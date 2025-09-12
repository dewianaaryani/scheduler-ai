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

    // Get Indonesian time (WIB = UTC+7)
    const serverTime = new Date();
    const utc = serverTime.getTime() + serverTime.getTimezoneOffset() * 60000;
    const indonesianTime = new Date(utc + 7 * 3600000);

    // Use server time for database queries (keep as is)
    const today = new Date();
    const startDay = startOfDay(today);
    const endDay = endOfDay(today);

    // Your existing database queries remain the same...
    const [user, scheduleStats, todaySchedules] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
          image: true,
        },
      }),

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

    // Your existing calculations remain the same...
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

    const formattedSchedules = todaySchedules.map((schedule) => ({
      id: schedule.id,
      title: schedule.title,
      time: `${format(schedule.startedTime, "HH:mm")} - ${format(schedule.endTime, "HH:mm")}`,
      goal: schedule.goal?.title || null,
      icon: schedule.emoji,
      hasGoal: !!schedule.goalId,
      status: schedule.status,
    }));

    // UPDATED: Use Indonesian time for greeting
    const getMotivationalMessage = () => {
      const hour = indonesianTime.getHours(); // Use Indonesian hour
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
      header: {
        // UPDATED: Use Indonesian time for date display
        today: format(indonesianTime, "EEEE, dd MMMM yyyy", { locale: id }),
        user: {
          name: user.name,
          avatar: user.image || "",
          message: getMotivationalMessage(),
        },
      },

      stats: {
        todaySchedules: totalSchedulesToday,
        dailyProgress,
        completedSchedulesToday,
        todayMissedStatusSchedules,
        todayNoneStatusSchedules,
        todayinProgressStatusSchedules,
        todayAbandonedStatusSchedules,
      },

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
