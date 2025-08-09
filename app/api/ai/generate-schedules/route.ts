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
        { error: "Autentikasi diperlukan" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { goalId, startDate, endDate, batchSize = 30 } = body;

    if (!goalId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Field yang diperlukan tidak lengkap: goalId, startDate, endDate" },
        { status: 400 }
      );
    }

    // Get user preferences for availability
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { preferences: true },
    });

    const userPreferences = user?.preferences as UserPreferences | null;

    // Verify goal ownership and get goal with its dates
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
        { error: "Tujuan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Use goal's actual end date, not the one from request
    const start = new Date(startDate);
    const goalEndDate = new Date(goal.endDate); // Use goal's actual end date
    const batchEnd = new Date(start);
    batchEnd.setDate(batchEnd.getDate() + batchSize);
    const actualBatchEnd = batchEnd > goalEndDate ? goalEndDate : batchEnd;

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

    // Calculate exact number of days (inclusive) using UTC to avoid timezone issues
    const startUTC = new Date(start);
    startUTC.setUTCHours(0, 0, 0, 0);
    const endUTC = new Date(actualBatchEnd);
    endUTC.setUTCHours(0, 0, 0, 0);
    const totalDays = Math.floor((endUTC.getTime() - startUTC.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const prompt = `
🚨 ABSOLUTE REQUIREMENT: Generate schedules for EVERY day including the final date ${actualBatchEnd.toISOString().split('T')[0]}.
🚨 The LAST schedule MUST have startedTime on ${actualBatchEnd.toISOString().split('T')[0]}.
🚨 DO NOT stop one day early! Generate exactly ${totalDays} schedules.

Generate detailed daily schedules for the following goal:

Goal: ${goal.title}
Description: ${goal.description}
Period: ${start.toISOString()} to ${actualBatchEnd.toISOString()} (INCLUSIVE)
Total days to cover: ${totalDays} days

User Preferences: ${JSON.stringify(userPreferences || {})}
Preferred Time Slot: ${preferredTimeSlot} (use this consistently for all schedules)  
Existing schedules to avoid conflicts: [${existingSchedules}]

CRITICAL: Respond with ONLY a valid JSON array of schedules. Output text in INDONESIAN language but keep JSON keys in English.
MUST generate EXACTLY ${totalDays} schedules (one for each day from start to end date, inclusive).

Format Example (for 10-day goal):
[
  {
    "title": "Hari 1: Pengenalan dan Setup",
    "description": "Persiapan materi dan pengenalan dasar (ringan untuk memulai)",
    "startedTime": "2024-01-01T09:00:00+07:00",
    "endTime": "2024-01-01T10:30:00+07:00",
    "emoji": "🚀",
    "percentComplete": 10
  },
  {
    "title": "Hari 2: Pembelajaran Dasar",
    "description": "Mempelajari konsep fundamental dengan praktek",
    "startedTime": "2024-01-02T09:00:00+07:00",
    "endTime": "2024-01-02T11:00:00+07:00",
    "emoji": "📚",
    "percentComplete": 20
  },
  {
    "title": "Hari 6: Sabtu - Review Mingguan",
    "description": "Meninjau progress minggu ini, istirahat aktif",
    "startedTime": "2024-01-06T10:00:00+07:00",
    "endTime": "2024-01-06T11:00:00+07:00",
    "emoji": "🔄",
    "percentComplete": 60
  },
  {
    "title": "Hari 7: Minggu - Refleksi dan Persiapan",
    "description": "Refleksi pembelajaran dan persiapan minggu depan",
    "startedTime": "2024-01-07T10:00:00+07:00",
    "endTime": "2024-01-07T11:00:00+07:00",
    "emoji": "🤔",
    "percentComplete": 70
  },
  // ... continue for remaining days
  {
    "title": "Hari 10: Evaluasi dan Penyelesaian",
    "description": "Review menyeluruh, dokumentasi hasil, dan perayaan pencapaian",
    "startedTime": "2024-01-10T09:00:00+07:00",
    "endTime": "2024-01-10T11:30:00+07:00",
    "emoji": "🎯",
    "percentComplete": 100
  }
]

Rules:
- CRITICAL: Create exactly ${totalDays} schedules - one schedule for EVERY SINGLE DAY in the period (no gaps, no missing days)
- MUST cover ALL dates from ${start.toISOString().split('T')[0]} to ${actualBatchEnd.toISOString().split('T')[0]} inclusive
- EXAMPLE: If period is 2025-08-28 to 2025-08-30, create schedules for:
  * Day 1: 2025-08-28T06:00:00+07:00 to 2025-08-28T07:30:00+07:00 (weekday, 1.5 hours)
  * Day 2: 2025-08-29T06:00:00+07:00 to 2025-08-29T08:00:00+07:00 (weekday, 2 hours)
  * Day 3: 2025-08-30T09:00:00+07:00 to 2025-08-30T10:00:00+07:00 (weekend, lighter, 1 hour)
- CRITICAL: NO DATE GAPS! Every consecutive day from start to end must be included
- CRITICAL: The LAST schedule MUST be on ${actualBatchEnd.toISOString().split('T')[0]}, not one day before!
- FLEXIBLE TIME ALLOCATION: 1-3 hours depending on day type and progress stage
- WEEKEND ADAPTATION: Shorter sessions (1-1.5 hours) with review/reflection activities
- REST DAYS: Every 6-7 days, create "review and rest" activities (1 hour max)
- If the preferred time slot conflicts with existing schedules, find the next available hour
- Respect user availability preferences if provided
- Include weekends with lighter/review activities if needed
- Don't overlap with ANY existing user schedules
- Make activities progressive and building on each other
- Each should have unique, specific content
- CRITICAL: Set percentComplete PROGRESSIVELY and CONSISTENTLY:
  * FORMULA: percentComplete = Math.round(((scheduleIndex + 1) / ${totalDays}) * 100)  
  * For ${totalDays} schedules: Distribute evenly from start to 100%
  * NO percentage jumps > 15%, NO stagnant values, NO decreases
  * REST DAYS: Keep same percentage as previous day (maintain progress)
  * WEEKEND DAYS: Small incremental progress (1-3% increase)
  * The FINAL schedule (#${totalDays}) MUST be exactly 100%
- VALIDATION: Verify no duplicate percentages and steady progression
- Output all titles and descriptions in INDONESIAN language
- Ensure continuous daily coverage with no missing dates
- Maintain consistent timing across all schedules for better routine
- VALIDATION CHECKLIST before responding:
  1. Schedule count = ${totalDays} (exact match required)
  2. Date verification: Check ALL dates from ${start.toISOString().split('T')[0]} to ${actualBatchEnd.toISOString().split('T')[0]} (NO gaps!)
  3. Progress check: Each percentage > previous, steady increase, final = 100%
  4. Time allocation: 1-3 hours per day, appropriate for weekends/rest days
  5. Final date confirmation: Last schedule startedTime contains ${actualBatchEnd.toISOString().split('T')[0]}
- CRITICAL: If ANY validation fails, revise the entire schedule array
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
      console.error("Gagal memproses jadwal:", err);
      return NextResponse.json(
        { error: "Gagal membuat jadwal" },
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

    // Check if more batches needed (compare with goal's end date)
    const hasMore = actualBatchEnd < goalEndDate;
    // Next batch starts the day after the current batch ends to avoid duplication
    let nextStartDate = null;
    if (hasMore) {
      const nextStart = new Date(actualBatchEnd);
      nextStart.setDate(nextStart.getDate() + 1);
      nextStartDate = nextStart.toISOString();
    }

    return NextResponse.json({
      created: createdSchedules.count,
      hasMore,
      nextStartDate,
      batchEnd: actualBatchEnd.toISOString(),
    });
  } catch (error) {
    console.error("Error membuat jadwal:", error);
    return NextResponse.json(
      { error: "Failed to generate schedules" },
      { status: 500 }
    );
  }
}