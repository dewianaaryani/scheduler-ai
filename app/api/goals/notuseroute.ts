/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/api/goals.ts
import { prisma } from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { type NextRequest, NextResponse } from "next/server";

interface Step {
  title: string;
  description: string;
  startedTime: string;
  endTime: string;
  percentComplete: string;
  emoji: string;
}

interface GoalPlanData {
  dataGoals: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    emoji: string;
    steps: Step[];
  };
  message: string;
  error: string | null;
  isLastMessage: boolean;
}

export async function GET() {
  try {
    const session = await requireUser();
    if (!session || !session.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    const userId = session.id;

    const goals = await prisma.goal.findMany({
      where: { userId },
      include: {
        schedules: {
          where: { status: "COMPLETED" },
          orderBy: { updatedAt: "desc" },
          take: 1,
          select: {
            percentComplete: true,
          },
        },
      },
    });

    // Biar gampang di frontend, kita flatten percentComplete
    const formattedGoals = goals.map((goal) => ({
      ...goal,
      percentComplete: goal.schedules[0]?.percentComplete || 0,
    }));

    return NextResponse.json(formattedGoals);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await requireUser();
    if (!session || !session.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    const userId = session.id;

    // Parse request data
    const planData: GoalPlanData = await request.json();

    // Validate required data
    if (!planData?.dataGoals) {
      return NextResponse.json({ error: "Invalid goal data" }, { status: 400 });
    }

    const { title, description, startDate, endDate, emoji, steps } =
      planData.dataGoals;

    if (!title || !description || !startDate || !endDate || !emoji || !steps) {
      return NextResponse.json(
        { error: "Missing required goal fields" },
        { status: 400 }
      );
    }

    // Create transaction to save both goal and schedules
    const result = await prisma.$transaction(async (tx) => {
      // Create the goal
      const goal = await tx.goal.create({
        data: {
          userId,
          title,
          description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          emoji,
          status: "ACTIVE", // Default status
        },
      });

      // Create schedules from steps
      const schedulePromises = steps.map((step, idx) => {
        // Convert percentComplete from string to proper format (remove % if present)
        const cleanedPercentComplete = step.percentComplete
          .replace("%", "")
          .trim();

        return tx.schedule.create({
          data: {
            userId,
            goalId: goal.id,
            order: String(idx + 1), // Store order as string per schema
            title: step.title,
            description: step.description,
            startedTime: new Date(step.startedTime),
            endTime: new Date(step.endTime),
            percentComplete: cleanedPercentComplete,
            emoji: step.emoji,
            status: "NONE", // Default status
          },
        });
      });

      const schedules = await Promise.all(schedulePromises);

      return { goal, schedules };
    });

    return NextResponse.json({
      message: "Goal and schedules saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error saving goal:", error);
    return NextResponse.json(
      {
        error: "Failed to save goal",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
