// app/api/goals/[id]/route.ts
import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

// GET method (Keep your existing implementation)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise to get the id
    const resolvedParams = await params;
    const id = resolvedParams.id;

    console.log("Fetching goal with ID:", id);

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

// PATCH method for updating goal settings
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise to get the id
    const resolvedParams = await params;
    const id = resolvedParams.id;

    console.log("Updating goal settings with ID:", id);

    // Validate that id exists
    if (!id) {
      return NextResponse.json({ message: "Missing goal ID" }, { status: 400 });
    }

    // Parse the request body
    const body = await req.json();
    const { title, description } = body;

    // Validate required fields
    if (!title && !description) {
      return NextResponse.json(
        { message: "No fields to update provided" },
        { status: 400 }
      );
    }

    // Update goal in database
    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: {
        title: title || undefined,
        description: description || undefined,
      },
    });

    return NextResponse.json({
      message: "Goal settings updated successfully",
      goal: updatedGoal,
    });
  } catch (error) {
    console.error("Error updating goal settings:", error);

    // Check for Prisma not found error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === "P2025") {
      return NextResponse.json({ message: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
