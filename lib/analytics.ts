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

  // Performa
  improvementThisMonth: number;
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

  // Jadwal periode untuk improvement
  const schedules = allSchedules.filter(
    (s) => s.startedTime >= startDate && s.startedTime <= endDate
  );
  const previousSchedules = allSchedules.filter(
    (s) => s.startedTime >= previousStartDate && s.startedTime < startDate
  );

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

  // DISTRIBUSI JADWAL 7 HARI TERAKHIR
  const last7Days = allSchedules.filter(
    (s) => s.startedTime >= subDays(endDate, 7)
  );

  const scheduleStatusDetailed = [
    {
      status: "Belum Diperbarui",
      count: last7Days.filter((s) => s.status === "NONE").length,
      color: "#f5f3ff",
    },
    {
      status: "Selesai",
      count: last7Days.filter((s) => s.status === "COMPLETED").length,
      color: "#10b981",
    },
    {
      status: "Sedang Berjalan",
      count: last7Days.filter((s) => s.status === "IN_PROGRESS").length,
      color: "#fde047",
    },
    {
      status: "Terlewat",
      count: last7Days.filter((s) => s.status === "MISSED").length,
      color: "#ef4444",
    },
    {
      status: "Dibatalkan",
      count: last7Days.filter((s) => s.status === "ABANDONED").length,
      color: "#6b7280",
    },
  ];

  // PENYELESAIAN HARIAN (7 hari)
  const dailyScheduleCompletion = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(endDate, i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const daySchedules = allSchedules.filter(
      (s) => s.startedTime >= dayStart && s.startedTime <= dayEnd
    );

    dailyScheduleCompletion.push({
      date: date.toISOString().split("T")[0],
      completed: daySchedules.filter((s) => s.status === "COMPLETED").length,
      total: daySchedules.length,
    });
  }

  // PENINGKATAN
  const improvementThisMonth = calculateImprovement(
    schedules,
    previousSchedules
  );

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

    // Performa
    improvementThisMonth,
  };
}

// Menghitung persentase peningkatan antara 2 periode
function calculateImprovement(
  current: Array<{ status: string }>,
  previous: Array<{ status: string }>
): number {
  // Jika tidak ada data sebelumnya, anggap 100% peningkatan jika ada data sekarang
  if (previous.length === 0) return current.length > 0 ? 100 : 0;

  // Hitung completion rate periode sekarang
  const currentRate =
    current.length > 0
      ? (current.filter((s) => s.status === "COMPLETED").length /
          current.length) *
        100
      : 0;

  // Hitung completion rate periode sebelumnya
  const previousRate =
    previous.length > 0
      ? (previous.filter((s) => s.status === "COMPLETED").length /
          previous.length) *
        100
      : 0;

  // Persentase peningkatan = ((rate sekarang - rate sebelumnya) / rate sebelumnya) * 100
  return Math.round(((currentRate - previousRate) / (previousRate || 1)) * 100);
}
