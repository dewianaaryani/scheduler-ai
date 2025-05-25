import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { startOfDay, endOfDay, parseISO } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const goalId = searchParams.get('goalId');
    const status = searchParams.get('status');

    if (!startDateParam || !endDateParam) {
      return NextResponse.json(
        { error: "startDate and endDate are required" },
        { status: 400 }
      );
    }

    const startDate = startOfDay(parseISO(startDateParam));
    const endDate = endOfDay(parseISO(endDateParam));

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
      userId,
      startedTime: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (goalId) {
      whereClause.goalId = goalId;
    }

    if (status) {
      whereClause.status = status;
    }

    // Fetch schedules with goal information
    const schedules = await prisma.schedule.findMany({
      where: whereClause,
      include: {
        goal: {
          select: {
            id: true,
            title: true,
            emoji: true,
            status: true,
          },
        },
      },
      orderBy: {
        startedTime: 'asc',
      },
    });

    // Format schedules for calendar display
    const formattedSchedules = schedules.map(schedule => ({
      id: schedule.id,
      title: schedule.title,
      description: schedule.description,
      notes: schedule.notes,
      startedTime: schedule.startedTime,
      endTime: schedule.endTime,
      emoji: schedule.emoji,
      status: schedule.status,
      percentComplete: schedule.percentComplete,
      goal: schedule.goal ? {
        id: schedule.goal.id,
        title: schedule.goal.title,
        emoji: schedule.goal.emoji,
        status: schedule.goal.status,
      } : null,
      hasGoal: !!schedule.goalId,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: formattedSchedules,
      meta: {
        count: formattedSchedules.length,
        startDate: startDateParam,
        endDate: endDateParam,
        filters: {
          goalId,
          status,
        },
      },
    });

  } catch (error) {
    console.error("Calendar schedules API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    const {
      title,
      description,
      notes,
      startedTime,
      endTime,
      emoji,
      goalId,
      status = 'NONE',
    } = body;

    // Validate required fields
    if (!title || !startedTime || !endTime || !emoji) {
      return NextResponse.json(
        { error: "title, startedTime, endTime, and emoji are required" },
        { status: 400 }
      );
    }

    // Validate goal exists if goalId provided
    if (goalId) {
      const goal = await prisma.goal.findFirst({
        where: {
          id: goalId,
          userId,
        },
      });

      if (!goal) {
        return NextResponse.json(
          { error: "Goal not found" },
          { status: 404 }
        );
      }
    }

    // Create schedule
    const schedule = await prisma.schedule.create({
      data: {
        userId,
        goalId: goalId || null,
        title,
        description: description || '',
        notes: notes || null,
        startedTime: new Date(startedTime),
        endTime: new Date(endTime),
        emoji,
        status,
        percentComplete: '0',
      },
      include: {
        goal: {
          select: {
            id: true,
            title: true,
            emoji: true,
            status: true,
          },
        },
      },
    });

    const formattedSchedule = {
      id: schedule.id,
      title: schedule.title,
      description: schedule.description,
      notes: schedule.notes,
      startedTime: schedule.startedTime,
      endTime: schedule.endTime,
      emoji: schedule.emoji,
      status: schedule.status,
      percentComplete: schedule.percentComplete,
      goal: schedule.goal ? {
        id: schedule.goal.id,
        title: schedule.goal.title,
        emoji: schedule.goal.emoji,
        status: schedule.goal.status,
      } : null,
      hasGoal: !!schedule.goalId,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: formattedSchedule,
    }, { status: 201 });

  } catch (error) {
    console.error("Create schedule API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}