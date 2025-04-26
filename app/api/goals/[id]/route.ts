import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Ensure params are awaited
  const { id } = await params; // Await params to access id
  console.log(id); // Log the ID to verify it's correctly extracted

  try {
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
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
