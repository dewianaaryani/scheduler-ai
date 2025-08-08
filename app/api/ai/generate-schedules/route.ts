import { requireUser } from "@/app/lib/hooks";
import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { validateScheduleData } from "@/app/lib/validation";

type UserPreferences = {
  availability?: string;
  [key: string]: unknown;
};

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();
    if (!session?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { goalId, startDate, endDate, batchSize = 30 } = body;

    if (!goalId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields: goalId, startDate, endDate" },
        { status: 400 }
      );
    }

    // Get user preferences for availability
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { preferences: true },
    });

    const userPreferences = user?.preferences as UserPreferences | null;

    // Verify goal ownership and get goal schedules
    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: session.id,
      },
      include: {
        schedules: {
          select: { startedTime: true, endTime: true },
        },
      },
    });

    if (!goal) {
      return NextResponse.json(
        { error: "Goal not found" },
        { status: 404 }
      );
    }

    // Calculate batch range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const batchEnd = new Date(start);
    batchEnd.setDate(batchEnd.getDate() + batchSize);
    const actualBatchEnd = batchEnd > end ? end : batchEnd;

    // Get ALL user's existing schedules to avoid conflicts
    const allUserSchedules = await prisma.schedule.findMany({
      where: { userId: session.id },
      select: { startedTime: true, endTime: true },
    });

    // Generate prompt for batch
    const existingSchedules = allUserSchedules
      .map((s) => `{start: "${s.startedTime}", end: "${s.endTime}"}`)
      .join(", ");

    // Determine preferred time slot based on first schedule or user preferences
    let preferredTimeSlot = "09:00-10:00"; // default
    if (goal.schedules.length > 0) {
      // Use the same time slot as existing schedules for this goal
      const firstSchedule = goal.schedules[0];
      const startTime = new Date(firstSchedule.startedTime);
      const endTime = new Date(firstSchedule.endTime);
      const startHour = startTime.getHours().toString().padStart(2, '0');
      const startMin = startTime.getMinutes().toString().padStart(2, '0');
      const endHour = endTime.getHours().toString().padStart(2, '0');
      const endMin = endTime.getMinutes().toString().padStart(2, '0');
      preferredTimeSlot = `${startHour}:${startMin}-${endHour}:${endMin}`;
    } else if (userPreferences?.availability) {
      // Use user's preferred availability
      preferredTimeSlot = userPreferences.availability;
    }

    const prompt = `
Generate detailed daily schedules for the following goal:

Goal: ${goal.title}
Description: ${goal.description}
Period: ${start.toISOString()} to ${actualBatchEnd.toISOString()}

User Preferences: ${JSON.stringify(userPreferences || {})}
Preferred Time Slot: ${preferredTimeSlot} (use this consistently for all schedules)
Existing schedules to avoid conflicts: [${existingSchedules}]

CRITICAL: Respond with ONLY a valid JSON array of schedules. Output text in INDONESIAN language but keep JSON keys in English.

Format Example (for 10-day goal):
[
  {
    "title": "Hari 1: Pengenalan dan Setup",
    "description": "Memulai dengan dasar-dasar",
    "startedTime": "2024-01-01T09:00:00+07:00",
    "endTime": "2024-01-01T10:00:00+07:00",
    "emoji": "🚀",
    "percentComplete": 10
  },
  {
    "title": "Hari 2: Pembelajaran Dasar",
    "description": "Mempelajari konsep fundamental",
    "startedTime": "2024-01-02T09:00:00+07:00",
    "endTime": "2024-01-02T10:00:00+07:00",
    "emoji": "📚",
    "percentComplete": 20
  },
  ... (progressively increase: 30, 40, 50, 60, 70, 80, 90)
  {
    "title": "Hari 10: Review dan Penyelesaian",
    "description": "Evaluasi akhir dan kesimpulan",
    "startedTime": "2024-01-10T09:00:00+07:00",
    "endTime": "2024-01-10T10:00:00+07:00",
    "emoji": "🎯",
    "percentComplete": 100
  }
]

Rules:
- Create one schedule for EVERY SINGLE DAY in the period (no gaps)
- CRITICAL: Use the preferred time slot (${preferredTimeSlot}) for ALL schedules to maintain consistency
- If the preferred time slot conflicts with existing schedules, find the next available hour
- Respect user availability preferences if provided
- Include weekends with lighter/review activities if needed
- Don't overlap with ANY existing user schedules
- Make activities progressive and building on each other
- Each should have unique, specific content
- CRITICAL: Set percentComplete PROGRESSIVELY and DIFFERENTLY for each schedule:
  * Calculate: percentComplete = Math.round((index + 1) / totalSchedules * 100)
  * For example, if you have 10 schedules: 10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90%, 100%
  * For 5 schedules: 20%, 40%, 60%, 80%, 100%
  * For 7 schedules: 14%, 29%, 43%, 57%, 71%, 86%, 100%
  * NEVER use the same percentage twice
  * The LAST schedule must ALWAYS be exactly 100%
- IMPORTANT: Each schedule MUST have a DIFFERENT percentComplete value
- IMPORTANT: percentComplete must increase progressively from first to last
- Output all titles and descriptions in INDONESIAN language
- Ensure continuous daily coverage with no missing dates
- Maintain consistent timing across all schedules for better routine
`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const responseData = await response.json();
    const raw = responseData.content?.[0]?.text || "[]";

    let schedules: Array<{
      title: string;
      description: string;
      notes?: string;
      startedTime: string;
      endTime: string;
      percentComplete?: number;
      emoji: string;
      order?: string;
    }>;
    
    try {
      schedules = JSON.parse(raw);
    } catch (err) {
      console.error("Failed to parse schedules:", err);
      return NextResponse.json(
        { error: "Failed to generate schedules" },
        { status: 500 }
      );
    }

    // Validate and save schedules with progressive percentages
    const validatedSchedules = schedules.map((s, index) => {
      const validated = validateScheduleData(s);
      // Calculate progressive percentage
      const progressivePercent = Math.round(((index + 1) / schedules.length) * 100);
      validated.percentComplete = String(progressivePercent);
      // Ensure the last schedule is exactly 100%
      if (index === schedules.length - 1) {
        validated.percentComplete = '100';
      }
      return validated;
    });
    
    const createdSchedules = await prisma.schedule.createMany({
      data: validatedSchedules.map((schedule) => ({
        userId: session.id!,
        goalId: goalId as string,
        title: schedule.title,
        description: schedule.description,
        notes: schedule.notes,
        startedTime: schedule.startedTime,
        endTime: schedule.endTime,
        percentComplete: String(Math.max(10, Number(schedule.percentComplete) || 10)),
        emoji: schedule.emoji,
        status: "NONE" as const,
        order: schedule.order || "0",
      })),
    });

    // Check if more batches needed
    const hasMore = actualBatchEnd < end;
    const nextStartDate = hasMore ? actualBatchEnd.toISOString() : null;

    return NextResponse.json({
      created: createdSchedules.count,
      hasMore,
      nextStartDate,
      batchEnd: actualBatchEnd.toISOString(),
    });
  } catch (error) {
    console.error("Error generating schedules:", error);
    return NextResponse.json(
      { error: "Failed to generate schedules" },
      { status: 500 }
    );
  }
}