import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { startOfMonth, endOfMonth, parseISO, format, eachDayOfInterval } from "date-fns";
import { id } from "date-fns/locale";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    
    const monthParam = searchParams.get('month'); // Format: YYYY-MM-DD (any day in the month)

    if (!monthParam) {
      return NextResponse.json(
        { error: "month parameter is required (YYYY-MM-DD format)" },
        { status: 400 }
      );
    }

    const monthDate = parseISO(monthParam);
    const startDate = startOfMonth(monthDate);
    const endDate = endOfMonth(monthDate);

    // Fetch schedules for the entire month
    const schedules = await prisma.schedule.findMany({
      where: {
        userId,
        startedTime: {
          gte: startDate,
          lte: endDate,
        },
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
      orderBy: {
        startedTime: 'asc',
      },
    });

    // Group schedules by date
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schedulesByDate: Record<string, any[]> = {};
    
    schedules.forEach(schedule => {
      const dateKey = format(schedule.startedTime, 'yyyy-MM-dd');
      if (!schedulesByDate[dateKey]) {
        schedulesByDate[dateKey] = [];
      }
      
      schedulesByDate[dateKey].push({
        id: schedule.id,
        title: schedule.title,
        description: schedule.description,
        startedTime: schedule.startedTime,
        endTime: schedule.endTime,
        emoji: schedule.emoji,
        status: schedule.status,
        percentComplete: schedule.percentComplete,
        goal: schedule.goal || null,
        hasGoal: !!schedule.goalId,
      });
    });

    // Generate calendar data for each day in the month
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
    const calendarData = daysInMonth.map(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const daySchedules = schedulesByDate[dateKey] || [];
      
      // Calculate daily statistics
      const totalSchedules = daySchedules.length;
      const completedSchedules = daySchedules.filter(s => s.status === 'COMPLETED').length;
      const inProgressSchedules = daySchedules.filter(s => s.status === 'IN_PROGRESS').length;
      const missedSchedules = daySchedules.filter(s => s.status === 'MISSED').length;
      
      const completionRate = totalSchedules > 0 
        ? Math.round((completedSchedules / totalSchedules) * 100) 
        : 0;

      return {
        date: dateKey,
        dayOfWeek: format(day, 'EEEE', { locale: id }),
        dayNumber: format(day, 'd'),
        schedules: daySchedules,
        stats: {
          total: totalSchedules,
          completed: completedSchedules,
          inProgress: inProgressSchedules,
          missed: missedSchedules,
          completionRate,
        },
      };
    });

    // Calculate month-level statistics
    const monthStats = {
      totalDays: daysInMonth.length,
      daysWithSchedules: Object.keys(schedulesByDate).length,
      totalSchedules: schedules.length,
      completedSchedules: schedules.filter(s => s.status === 'COMPLETED').length,
      inProgressSchedules: schedules.filter(s => s.status === 'IN_PROGRESS').length,
      missedSchedules: schedules.filter(s => s.status === 'MISSED').length,
      averageCompletionRate: calendarData.length > 0
        ? Math.round(calendarData.reduce((sum, day) => sum + day.stats.completionRate, 0) / calendarData.length)
        : 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        month: format(monthDate, 'MMMM yyyy', { locale: id }),
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        calendar: calendarData,
        stats: monthStats,
      },
    });

  } catch (error) {
    console.error("Calendar month API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}