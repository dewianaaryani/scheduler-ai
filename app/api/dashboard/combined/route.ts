import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { format, startOfDay, endOfDay } from "date-fns";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const today = new Date();
    const startDay = startOfDay(today);
    const endDay = endOfDay(today);

    // Fetch all dashboard data in parallel for better performance
    const [user, goalsStats, scheduleStats, todaySchedules] = await Promise.all([
      // User data for header
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
          image: true,
        },
      }),

      // Goals statistics
      prisma.goal.groupBy({
        by: ['status'],
        where: { userId },
        _count: true,
      }),

      // Today's schedules count and completion
      prisma.schedule.aggregate({
        where: {
          userId,
          startedTime: {
            gte: startDay,
            lte: endDay,
          },
        },
        _count: true,
      }),

      // Today's schedule details
      prisma.schedule.findMany({
        where: {
          userId,
          startedTime: {
            gte: startDay,
            lte: endDay,
          },
        },
        include: {
          goal: {
            select: {
              title: true,
              emoji: true,
            },
          },
        },
        orderBy: {
          startedTime: 'asc',
        },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Process goals statistics
    const activeGoals = goalsStats.find(stat => stat.status === 'ACTIVE')?._count || 0;
    const completedGoals = goalsStats.find(stat => stat.status === 'COMPLETED')?._count || 0;

    // Calculate daily progress
    const totalSchedulesToday = scheduleStats._count;
    const completedSchedulesToday = todaySchedules.filter(s => s.status === 'COMPLETED').length;
    const dailyProgress = totalSchedulesToday > 0 
      ? Math.round((completedSchedulesToday / totalSchedulesToday) * 100) 
      : 0;

    // Format today's schedules
    const formattedSchedules = todaySchedules.map(schedule => ({
      id: schedule.id,
      title: schedule.title,
      time: `${format(schedule.startedTime, 'HH:mm')} - ${format(schedule.endTime, 'HH:mm')}`,
      category: schedule.goal?.title || 'Personal',
      icon: schedule.emoji,
      hasGoal: !!schedule.goalId,
      status: schedule.status,
    }));

    // Generate motivational message based on time and progress
    const getMotivationalMessage = () => {
      const hour = today.getHours();
      const userName = user.name?.split(" ")[0] || "User";
      
      if (dailyProgress >= 80) {
        return `Amazing work ${userName}! You're crushing your goals today! 🔥`;
      } else if (hour < 12) {
        return `Good morning ${userName}! Ready to make today productive? ☀️`;
      } else if (hour < 18) {
        return `Keep going ${userName}! You're doing great this afternoon! 💪`;
      } else {
        return `Evening ${userName}! Time to wrap up and reflect on today's progress! 🌙`;
      }
    };

    const combinedData = {
      // Header data
      header: {
        today: format(today, "EEEE, dd MMMM yyyy"),
        user: {
          name: user.name,
          avatar: user.image || "",
          message: getMotivationalMessage(),
        },
      },
      
      // Stats data
      stats: {
        activeGoals,
        completedGoals,
        todaySchedules: totalSchedulesToday,
        dailyProgress,
      },
      
      // Today's schedules
      schedules: formattedSchedules,
    };

    return NextResponse.json({
      success: true,
      data: combinedData,
    });

  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}