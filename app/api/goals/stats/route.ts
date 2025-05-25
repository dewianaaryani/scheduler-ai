import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get goal statistics with progress calculation
    const [goalStats, goalsWithSchedules] = await Promise.all([
      prisma.goal.groupBy({
        by: ['status'],
        where: { userId },
        _count: true,
      }),
      
      prisma.goal.findMany({
        where: { userId },
        include: {
          schedules: {
            select: {
              status: true,
            },
          },
        },
      }),
    ]);

    // Calculate progress for each goal
    const goalsWithProgress = goalsWithSchedules.map(goal => {
      const totalSchedules = goal.schedules.length;
      const completedSchedules = goal.schedules.filter(s => s.status === 'COMPLETED').length;
      const percentComplete = totalSchedules > 0 
        ? Math.round((completedSchedules / totalSchedules) * 100) 
        : 0;

      return {
        ...goal,
        percentComplete,
        scheduleCount: totalSchedules,
        completedScheduleCount: completedSchedules,
      };
    });

    const stats = {
      total: goalsWithSchedules.length,
      active: goalStats.find(stat => stat.status === 'ACTIVE')?._count || 0,
      completed: goalStats.find(stat => stat.status === 'COMPLETED')?._count || 0,
      abandoned: goalStats.find(stat => stat.status === 'ABANDONED')?._count || 0,
      averageProgress: goalsWithProgress.length > 0 
        ? Math.round(goalsWithProgress.reduce((sum, goal) => sum + goal.percentComplete, 0) / goalsWithProgress.length)
        : 0,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });

  } catch (error) {
    console.error("Goals stats API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}