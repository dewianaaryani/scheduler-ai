import { NextResponse } from "next/server";
import { startOfDay, endOfDay } from "date-fns";
import { prisma } from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";

export async function GET() {
  const session = await requireUser();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const today = new Date();

  const schedules = await prisma.schedule.findMany({
    where: {
      userId: session.id,
      startedTime: {
        gte: startOfDay(today),
        lte: endOfDay(today),
      },
    },
    orderBy: {
      startedTime: "asc",
    },
    select: {
      id: true,
      title: true,
      startedTime: true,
      endTime: true,
      emoji: true,
      goal: {
        select: {
          title: true,
        },
      },
    },
  });

  const formatted = schedules.map((s) => ({
    id: s.id,
    title: s.title,
    time: `${s.startedTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${s.endTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`,
    category: s.goal?.title || "One-time event",
    icon: s.emoji,
    hasGoal: Boolean(s.goal),
  }));

  return NextResponse.json(formatted);
}
