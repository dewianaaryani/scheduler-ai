import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

// GET handler
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Get current schedule with its goal information
    const currentSchedule = await prisma.schedule.findUnique({
      where: { id },
      include: {
        goal: true, // Include goal information
      },
    });

    if (!currentSchedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      );
    }

    // If current schedule doesn't have a goal, return null
    // (no previous schedule restriction needed)
    if (!currentSchedule.goalId) {
      return NextResponse.json(null);
    }

    // Find the previous schedule within the SAME GOAL that comes before current schedule
    const previousSchedule = await prisma.schedule.findFirst({
      where: {
        goalId: currentSchedule.goalId, // Same goal only
        startedTime: {
          lt: currentSchedule.startedTime, // Earlier than current schedule
        },
      },
      orderBy: {
        startedTime: "desc", // Get the most recent one before current
      },
      include: {
        goal: true, // Include goal info if needed
      },
    });

    console.log("Current schedule goal:", currentSchedule.goalId);
    console.log("Previous schedule in same goal:", previousSchedule);

    return NextResponse.json(previousSchedule ?? null);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
