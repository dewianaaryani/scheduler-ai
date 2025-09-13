import { prisma } from "@/app/lib/db";
import { subDays, startOfDay, endOfDay } from "date-fns";

export interface AnalyticsData {
  // Metrik utama
  totalGoals: number;
  goalCompletionRate: number;
  scheduleCompletionRate: number;
  completedGoals: number;

  // Distribusi status
  goalsByStatus: Array<{ status: string; count: number; color: string }>;
  scheduleStatusDetailed: Array<{
    status: string;
    count: number;
    color: string;
  }>;

  // Data harian (7 hari terakhir)
  dailyScheduleCompletion: Array<{
    date: string;
    completed: number;
    total: number;
  }>;
}

export async function getAnalyticsData(
  userId: string,
  dateRange: number = 30
): Promise<AnalyticsData> {
  const endDate = new Date();
  const startDate = subDays(endDate, dateRange);
  const previousStartDate = subDays(startDate, dateRange);

  // Ambil data jadwal - hanya field yang diperlukan
  const allSchedules = await prisma.schedule.findMany({
    where: { userId },
    select: {
      startedTime: true,
      status: true,
    },
    orderBy: { startedTime: "asc" },
  });

  // Ambil semua tujuan user
  const allGoals = await prisma.goal.findMany({
    where: { userId },
    select: {
      status: true,
    },
  });

  // METRIK UTAMA
  const totalGoals = allGoals.length;
  const completedGoals = allGoals.filter(
    (g) => g.status === "COMPLETED"
  ).length;
  const goalCompletionRate =
    totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  const completedSchedulesAllTime = allSchedules.filter(
    (s) => s.status === "COMPLETED"
  ).length;
  const scheduleCompletionRate =
    allSchedules.length > 0
      ? (completedSchedulesAllTime / allSchedules.length) * 100
      : 0;

  // DISTRIBUSI STATUS TUJUAN
  const goalsByStatus = [
    {
      status: "ACTIVE",
      count: allGoals.filter((g) => g.status === "ACTIVE").length,
      color: "#8b5cf6", // Ungu untuk aktif
    },
    {
      status: "COMPLETED",
      count: completedGoals,
      color: "#10b981", // Hijau untuk selesai
    },
    {
      status: "ABANDONED",
      count: allGoals.filter((g) => g.status === "ABANDONED").length,
      color: "#6b7280", // Abu-abu untuk dibatalkan
    },
  ];

  // PROSES DATA 7 HARI TERAKHIR (DIGABUNG)
  const dailyScheduleCompletion = [];
  const last7DaysSchedules = [];

  for (let i = 6; i >= 0; i--) {
    const date = subDays(endDate, i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const daySchedules = allSchedules.filter(
      (s) => s.startedTime >= dayStart && s.startedTime <= dayEnd
    );

    // Kumpulkan untuk scheduleStatusDetailed
    last7DaysSchedules.push(...daySchedules);

    // Data harian untuk chart
    dailyScheduleCompletion.push({
      date: date.toISOString().split("T")[0],
      completed: daySchedules.filter((s) => s.status === "COMPLETED").length,
      total: daySchedules.length,
    });
  }

  // DISTRIBUSI STATUS JADWAL 7 HARI TERAKHIR
  const scheduleStatusDetailed = [
    {
      status: "Belum Diperbarui",
      count: last7DaysSchedules.filter((s) => s.status === "NONE").length,
      color: "#f5f3ff",
    },
    {
      status: "Selesai",
      count: last7DaysSchedules.filter((s) => s.status === "COMPLETED").length,
      color: "#10b981",
    },
    {
      status: "Sedang Berjalan",
      count: last7DaysSchedules.filter((s) => s.status === "IN_PROGRESS")
        .length,
      color: "#fde047",
    },
    {
      status: "Terlewat",
      count: last7DaysSchedules.filter((s) => s.status === "MISSED").length,
      color: "#ef4444",
    },
    {
      status: "Dibatalkan",
      count: last7DaysSchedules.filter((s) => s.status === "ABANDONED").length,
      color: "#6b7280",
    },
  ];

  return {
    // Metrik utama
    totalGoals,
    goalCompletionRate: Math.round(goalCompletionRate),
    scheduleCompletionRate: Math.round(scheduleCompletionRate),
    completedGoals,

    // Distribusi
    goalsByStatus,
    scheduleStatusDetailed,

    // Data harian
    dailyScheduleCompletion,
  };
}
