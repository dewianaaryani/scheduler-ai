import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(session);
    

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'ACTIVE' | 'COMPLETED' | 'ABANDONED' | null;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = { userId };
    if (status) {
      whereClause.status = status;
    }

    // Fetch goals with schedules for progress calculation
    const goals = await prisma.goal.findMany({
      where: whereClause,
      include: {
        schedules: {
          select: {
            status: true,
          },
        },
        _count: {
          select: {
            schedules: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // Calculate progress for each goal
    const goalsWithProgress = goals.map(goal => {
      const totalSchedules = goal.schedules.length;
      const completedSchedules = goal.schedules.filter(s => s.status === 'COMPLETED').length;
      const percentComplete = totalSchedules > 0 
        ? Math.round((completedSchedules / totalSchedules) * 100) 
        : 0;

      return {
        id: goal.id,
        title: goal.title,
        description: goal.description,
        startDate: goal.startDate,
        endDate: goal.endDate,
        emoji: goal.emoji,
        status: goal.status,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
        percentComplete,
        scheduleCount: totalSchedules,
        completedScheduleCount: completedSchedules,
      };
    });

    // Get total count for pagination
    const totalCount = await prisma.goal.count({
      where: whereClause,
    });

    return NextResponse.json({
      success: true,
      data: goalsWithProgress,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });

  } catch (error) {
    console.error("Goals list API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}