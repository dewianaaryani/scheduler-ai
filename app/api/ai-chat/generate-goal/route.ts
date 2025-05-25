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
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.id;
    const body = await request.json();
    const goalData = body as Goal;
    console.log('Raw goal data received:', goalData);

    // Validate and clean goal data
    const cleanGoalData = validateGoalData(goalData);
    console.log('Cleaned goal data:', cleanGoalData);

    // Validate and clean schedule data
    const cleanSchedules = goalData.schedules?.map((schedule) => 
      validateScheduleData(schedule)
    ) || [];

    console.log(`Cleaned ${cleanSchedules.length} schedules`);

    const createdGoal = await prisma.goal.create({
      data: {
        userId,
        title: cleanGoalData.title,
        description: cleanGoalData.description,
        startDate: cleanGoalData.startDate,
        endDate: cleanGoalData.endDate,
        emoji: cleanGoalData.emoji,
        status: "ACTIVE",
        schedules: {
          create: cleanSchedules.map((schedule) => ({
            userId,
            title: schedule.title,
            description: schedule.description,
            notes: schedule.notes,
            startedTime: schedule.startedTime,
            endTime: schedule.endTime,
            percentComplete: schedule.percentComplete,
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

    console.log('Goal created successfully:', createdGoal.id);
    return NextResponse.json(createdGoal);
  } catch (error) {
    console.error("Error saving goal:", error);
    
    // Provide more specific error information
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: "Failed to save goal", 
          details: error.message,
          type: error.constructor.name 
        }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ error: "Failed to save goal" }, { status: 500 });
  }
}