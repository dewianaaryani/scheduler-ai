import { prisma } from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await requireUser();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = session.id;

  // Ambil data goal
  const [activeGoals, completedGoals] = await Promise.all([
    prisma.goal.count({
      where: {
        userId,
        status: "ACTIVE",
      },
    }),
    prisma.goal.count({
      where: {
        userId,
        status: "COMPLETED",
      },
    }),
  ]);

  // Ambil jadwal untuk hari ini
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59
  );

  const todaySchedules = await prisma.schedule.findMany({
    where: {
      userId,
      startedTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  const totalSchedules = todaySchedules.length;

  const completedCount = todaySchedules.filter(
    (schedule) => parseInt(schedule.percentComplete || "0") === 100
  ).length;

  const dailyProgressPercent =
    totalSchedules > 0
      ? Math.round((completedCount / totalSchedules) * 100)
      : 0;

  return NextResponse.json({
    success: true,
    data: {
      activeGoals,
      completedGoals,
      todaySchedules: todaySchedules.length,
      dailyProgress: dailyProgressPercent,
    },
  });
}
