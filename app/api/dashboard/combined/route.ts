import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { format, startOfDay, endOfDay } from "date-fns";
import { id } from "date-fns/locale";

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
    const [user, scheduleStats, todaySchedules] = await Promise.all([
      // User data for header
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
          image: true,
        },
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
          startedTime: "asc",
        },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate daily progress
    const totalSchedulesToday = scheduleStats._count;
    const completedSchedulesToday = todaySchedules.filter(
      (s) => s.status === "COMPLETED"
    ).length;

    const todayMissedStatusSchedules = todaySchedules.filter(
      (s) => s.status === "MISSED"
    ).length;
    const todayNoneStatusSchedules = todaySchedules.filter(
      (s) => s.status === "NONE"
    ).length;
    const todayAbandonedStatusSchedules = todaySchedules.filter(
      (s) => s.status === "ABANDONED"
    ).length;
    const todayinProgressStatusSchedules = todaySchedules.filter(
      (s) => s.status === "IN_PROGRESS"
    ).length;

    const dailyProgress =
      totalSchedulesToday > 0
        ? Math.round((completedSchedulesToday / totalSchedulesToday) * 100)
        : 0;

    // Format today's schedules
    const formattedSchedules = todaySchedules.map((schedule) => ({
      id: schedule.id,
      title: schedule.title,
      time: `${format(schedule.startedTime, "HH:mm")} - ${format(schedule.endTime, "HH:mm")}`,
      goal: schedule.goal?.title || null,
      icon: schedule.emoji,
      hasGoal: !!schedule.goalId,
      status: schedule.status,
    }));

    // Generate motivational message based on time and progress
    const getMotivationalMessage = () => {
      const hour = today.getHours();
      const userName = user.name?.split(" ")[0] || "User";

      if (dailyProgress >= 80) {
        return `Kerja bagus, ${userName}! Produktivitasmu hari ini luar biasa 🔥`;
      } else if (hour < 11) {
        return `Selamat pagi, ${userName}! Awali hari dengan semangat baru 💡`;
      } else if (hour < 14) {
        return `Selamat siang, ${userName}! Teruskan semangatmu, progresmu menunggu 🚀`;
      } else if (hour < 18) {
        return `Selamat sore, ${userName}! Sisa waktu masih bisa kamu maksimalkan 💪`;
      } else {
        return `Selamat malam, ${userName}! Saatnya refleksi dan apresiasi usaha hari ini 🌙`;
      }
    };

    const combinedData = {
      // Header data
      header: {
        today: format(today, "EEEE, dd MMMM yyyy", { locale: id }),
        user: {
          name: user.name,
          avatar: user.image || "",
          message: getMotivationalMessage(),
        },
      },

      // Stats data
      stats: {
        todaySchedules: totalSchedulesToday,
        dailyProgress,
        completedSchedulesToday,
        todayMissedStatusSchedules,
        todayNoneStatusSchedules,
        todayinProgressStatusSchedules,
        todayAbandonedStatusSchedules,
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
