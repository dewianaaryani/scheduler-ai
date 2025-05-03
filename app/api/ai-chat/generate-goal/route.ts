import { requireUser } from "@/app/lib/hooks";
import { prisma } from "@/app/lib/db";
import { Goal } from "@/app/lib/types"; // only needed for typing if helpful
import { NextResponse } from "next/server";

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
    console.log(goalData);

    const createdGoal = await prisma.goal.create({
      data: {
        userId,
        title: goalData.title,
        description: goalData.description,
        startDate: new Date(goalData.startDate),
        endDate: new Date(goalData.endDate),
        emoji: goalData.emoji,
        status: "ACTIVE",
        schedules: {
          create: goalData.schedules.map((schedule) => ({
            userId,
            title: schedule.title,
            description: schedule.description,
            startedTime: new Date(schedule.startedTime),
            endTime: new Date(schedule.endTime),
            percentComplete: schedule.percentComplete,
            emoji: schedule.emoji,
            status: "NONE", // or schedule.status if provided
            order: schedule.order || "",
          })),
        },
      },
      include: {
        schedules: true,
      },
    });

    return NextResponse.json(createdGoal);
  } catch (error) {
    console.error("Error saving goal:", error);
    return NextResponse.json({ error: "Failed to save goal" }, { status: 500 });
  }
}
