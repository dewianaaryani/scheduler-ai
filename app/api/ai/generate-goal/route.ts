import { requireUser } from "@/app/lib/hooks";
import { prisma } from "@/app/lib/db";
import { Goal } from "@/app/lib/types";
import { NextResponse } from "next/server";
import { validateGoalData, validateScheduleData } from "@/app/lib/validation";

export async function POST(request: Request) {
  try {
    const session = await requireUser();
    if (!session?.id) {
      return NextResponse.json(
        { error: "Autentikasi diperlukan" },
        { status: 401 }
      );
    }

    const userId = session.id;
    const body = await request.json();
    const goalData = body as Goal;

    // Validate and clean goal data
    const cleanGoalData = validateGoalData(goalData);

    // Validate and clean schedule data with progressive percentages
    const cleanSchedules =
      goalData.schedules?.map((schedule, index, arr) => {
        const validated = validateScheduleData(schedule);
        // Calculate progressive percentage
        const progressivePercent = Math.round(((index + 1) / arr.length) * 100);
        validated.percentComplete = String(progressivePercent);
        // Ensure the last schedule is exactly 100%
        if (index === arr.length - 1) {
          validated.percentComplete = '100';
        }
        return validated;
      }) ||
      [];

    // Check if this is a long-duration goal (> 60 days)
    const startDate = new Date(cleanGoalData.startDate);
    const endDate = new Date(cleanGoalData.endDate);
    const daysDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const isLongDuration = daysDuration > 60;

    // For long-duration goals, create goal without schedules initially
    const createdGoal = await prisma.goal.create({
      data: {
        userId,
        title: cleanGoalData.title,
        description: cleanGoalData.description,
        startDate: cleanGoalData.startDate,
        endDate: cleanGoalData.endDate,
        emoji: cleanGoalData.emoji,
        status: "ACTIVE",
        schedules: isLongDuration ? undefined : {
          create: cleanSchedules.map((schedule) => ({
            userId,
            title: schedule.title,
            description: schedule.description,
            notes: schedule.notes,
            startedTime: schedule.startedTime,
            endTime: schedule.endTime,
            percentComplete: String(Math.max(10, Number(schedule.percentComplete) || 10)),
            emoji: schedule.emoji,
            status: "NONE",
            order: schedule.order,
          })),
        },
      },
      include: {
        schedules: true,
      },
    });

    console.log("Goal created successfully:", createdGoal.id);
    
    // Return response with flag indicating if schedules need to be generated separately
    return NextResponse.json({
      ...createdGoal,
      requiresScheduleGeneration: isLongDuration,
      duration: daysDuration,
    });
  } catch (error) {
    console.error("Error saving goal:", error);

    // Provide more specific error information
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Gagal menyimpan tujuan",
          details: error.message,
          type: error.constructor.name,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "Gagal menyimpan tujuan" }, { status: 500 });
  }
}
