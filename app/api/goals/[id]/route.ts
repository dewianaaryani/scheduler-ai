// app/api/goals/[id]/route.ts
import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise to get the id
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Validate that id exists
    if (!id) {
      return NextResponse.json({ message: "Missing goal ID" }, { status: 400 });
    }

    const goal = await prisma.goal.findUnique({
      where: { id },
      include: {
        schedules: true, // Get all related schedules for this goal
      },
    });

    if (!goal) {
      return NextResponse.json({ message: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json(goal);
  } catch (error) {
    console.error("Error fetching goal:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise to get the id
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ message: "Missing goal ID" }, { status: 400 });
    }

    // Update Goal status
    await prisma.goal.update({
      where: { id },
      data: {
        status: "ABANDONED",
      },
    });

    // Update related StatusSchedule status
    await prisma.schedule.updateMany({
      where: {
        goalId: id, // pastikan field di StatusSchedule namanya goalId (atau sesuaikan)
      },
      data: {
        status: "ABANDONED",
      },
    });

    return NextResponse.json(
      { message: "Goal and status schedules abandoned successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
