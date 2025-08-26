import { prisma } from "@/app/lib/db";
import {
  subDays,
  startOfDay,
  endOfDay,
} from "date-fns";

export interface AnalyticsData {
  totalGoals: number;
  goalCompletionRate: number;
  scheduleCompletionRate: number;
  totalSchedules: number;
  completedGoals: number;
  completedSchedules: number;
  previousPeriodGoals: number;
  previousPeriodSchedules: number;
  goalsByStatus: Array<{ status: string; count: number }>;
  schedulesByStatus: Array<{ status: string; count: number }>;
  dailyScheduleCompletion: Array<{
    date: string;
    completed: number;
    total: number;
  }>;
  goalTrends: Array<{ date: string; created: number; completed: number }>;

  // Analytics for the dashboard
  scheduleStatusDetailed: Array<{
    status: string;
    count: number;
    color: string;
  }>;
  improvementThisMonth: number;
  currentStreak: number;
  longestStreak: number;
}

export async function getAnalyticsData(
  userId: string,
  dateRange: number
): Promise<AnalyticsData> {
  const endDate = new Date();
  const startDate = subDays(endDate, dateRange);
  const previousStartDate = subDays(startDate, dateRange);

  // Get all user schedules for comprehensive analysis
  const allSchedules = await prisma.schedule.findMany({
    where: { userId },
    orderBy: { startedTime: "asc" },
  });

  // Get all user goals
  const allGoals = await prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  // Current period goals
  const goals = allGoals.filter(
    (g) => g.createdAt >= startDate && g.createdAt <= endDate
  );

  // Previous period goals for comparison
  const previousGoals = allGoals.filter(
    (g) => g.createdAt >= previousStartDate && g.createdAt < startDate
  );

  // Current period schedules
  const schedules = allSchedules.filter(
    (s) => s.startedTime >= startDate && s.startedTime <= endDate
  );

  // Previous period schedules
  const previousSchedules = allSchedules.filter(
    (s) => s.startedTime >= previousStartDate && s.startedTime < startDate
  );

  // Calculate basic metrics
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.status === "COMPLETED").length;
  const goalCompletionRate =
    totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  const totalSchedules = schedules.length;
  const completedSchedules = schedules.filter(
    (s) => s.status === "COMPLETED"
  ).length;
  const scheduleCompletionRate =
    totalSchedules > 0 ? (completedSchedules / totalSchedules) * 100 : 0;

  // Goals by status (using all goals, not time-limited)
  const goalsByStatus = [
    {
      status: "ACTIVE",
      count: allGoals.filter((g) => g.status === "ACTIVE").length,
    },
    { 
      status: "COMPLETED", 
      count: allGoals.filter((g) => g.status === "COMPLETED").length 
    },
    {
      status: "ABANDONED",
      count: allGoals.filter((g) => g.status === "ABANDONED").length,
    },
  ];

  // Enhanced schedule status with colors
  const scheduleStatusDetailed = [
    {
      status: "Selesai",
      count: schedules.filter((s) => s.status === "COMPLETED").length,
      color: "#10b981",
    },
    {
      status: "Sedang Berjalan",
      count: schedules.filter((s) => s.status === "IN_PROGRESS").length,
      color: "#3b82f6",
    },
    {
      status: "Terlewat",
      count: schedules.filter((s) => s.status === "MISSED").length,
      color: "#ef4444",
    },
    {
      status: "Dibatalkan",
      count: schedules.filter((s) => s.status === "ABANDONED").length,
      color: "#6b7280",
    },
  ];

  // Schedules by status (original format)
  const schedulesByStatus = [
    {
      status: "NONE",
      count: schedules.filter((s) => s.status === "NONE").length,
    },
    {
      status: "IN_PROGRESS",
      count: schedules.filter((s) => s.status === "IN_PROGRESS").length,
    },
    { status: "COMPLETED", count: completedSchedules },
    {
      status: "MISSED",
      count: schedules.filter((s) => s.status === "MISSED").length,
    },
    {
      status: "ABANDONED",
      count: schedules.filter((s) => s.status === "ABANDONED").length,
    },
  ];

  // Daily schedule completion (last 7 days)
  const dailyScheduleCompletion: Array<{
    date: string;
    completed: number;
    total: number;
  }> = [];

  for (let i = 6; i >= 0; i--) {
    const date = subDays(endDate, i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const daySchedules = allSchedules.filter(
      (s) => s.startedTime >= dayStart && s.startedTime <= dayEnd
    );

    const dayCompleted = daySchedules.filter(
      (s) => s.status === "COMPLETED"
    ).length;

    dailyScheduleCompletion.push({
      date: date.toISOString().split("T")[0],
      completed: dayCompleted,
      total: daySchedules.length,
    });
  }

  // Calculate streaks (needed for insights)
  const { currentStreak, longestStreak } = calculateStreaks(allSchedules);

  // Goal trends (creation and completion over time)
  const goalTrends: Array<{
    date: string;
    created: number;
    completed: number;
  }> = [];
  for (let i = dateRange - 1; i >= 0; i -= Math.floor(dateRange / 7)) {
    const date = subDays(endDate, i);
    const periodStart = subDays(date, 3);
    const periodEnd = date;

    const periodGoals = goals.filter(
      (g) => g.createdAt >= periodStart && g.createdAt <= periodEnd
    );

    const periodCompletedGoals = goals.filter(
      (g) =>
        g.updatedAt >= periodStart &&
        g.updatedAt <= periodEnd &&
        g.status === "COMPLETED"
    );

    goalTrends.push({
      date: date.toISOString().split("T")[0],
      created: periodGoals.length,
      completed: periodCompletedGoals.length,
    });
  }

  // Additional metrics
  const improvementThisMonth = calculateImprovement(
    schedules,
    previousSchedules
  );

  return {
    totalGoals,
    goalCompletionRate: Math.round(goalCompletionRate),
    scheduleCompletionRate: Math.round(scheduleCompletionRate),
    totalSchedules,
    completedGoals,
    completedSchedules,
    previousPeriodGoals: previousGoals.length,
    previousPeriodSchedules: previousSchedules.length,
    goalsByStatus,
    schedulesByStatus,
    dailyScheduleCompletion,
    goalTrends,
    scheduleStatusDetailed,
    improvementThisMonth,
    currentStreak,
    longestStreak,
  };
}

function calculateStreaks(
  schedules: Array<{ startedTime: Date | string; status: string }>
): { currentStreak: number; longestStreak: number } {
  if (schedules.length === 0) return { currentStreak: 0, longestStreak: 0 };

  // Group schedules by date
  const dailyCompletion = new Map<string, boolean>();

  schedules.forEach((schedule) => {
    const date = new Date(schedule.startedTime).toDateString();
    const hasCompleted =
      dailyCompletion.get(date) || schedule.status === "COMPLETED";
    dailyCompletion.set(date, hasCompleted);
  });

  // Calculate current streak and longest streak
  const dates = Array.from(dailyCompletion.keys()).sort();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Calculate longest streak by going through all dates
  for (let i = 0; i < dates.length; i++) {
    if (dailyCompletion.get(dates[i])) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  // Check from most recent date backwards for current streak
  for (let i = dates.length - 1; i >= 0; i--) {
    if (dailyCompletion.get(dates[i])) {
      currentStreak++;
    } else {
      break;
    }
  }

  return { currentStreak, longestStreak };
}


function calculateImprovement(
  current: Array<{ status: string }>,
  previous: Array<{ status: string }>
): number {
  if (previous.length === 0) return current.length > 0 ? 100 : 0;

  const currentRate =
    current.length > 0
      ? (current.filter((s) => s.status === "COMPLETED").length /
          current.length) *
        100
      : 0;

  const previousRate =
    previous.length > 0
      ? (previous.filter((s) => s.status === "COMPLETED").length /
          previous.length) *
        100
      : 0;

  return Math.round(((currentRate - previousRate) / (previousRate || 1)) * 100);
}

