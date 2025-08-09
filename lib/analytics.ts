import { prisma } from "@/app/lib/db";
import {
  subDays,
  startOfDay,
  endOfDay,
  getHours,
  startOfMonth,
  eachDayOfInterval,
  getDay,
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

  // New analytics for the enhanced dashboard
  hourlyProductivity: Array<{
    hour: string;
    productivity: number;
    schedules: number;
  }>;
  weeklyActivity: Array<{
    day: string;
    schedules: number;
    completed: number;
    hours: number;
  }>;
  adherenceData: Array<{ week: string; adherence: number }>;
  currentStreak: number;
  longestStreak: number;
  velocityIncrease: number;
  peakPerformance: number;
  monthlyHeatmap: Array<{
    date: number;
    week: number;
    day: number;
    value: number;
    schedules: number;
  }>;
  dailyCompletionRate: Array<{ day: string; rate: number }>;
  scheduleStatusDetailed: Array<{
    status: string;
    count: number;
    color: string;
  }>;
  improvementThisMonth: number;
  averageSessionDuration: number;
  currentAdherenceRate: number;
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

  // Goals by status
  const goalsByStatus = [
    {
      status: "ACTIVE",
      count: goals.filter((g) => g.status === "ACTIVE").length,
    },
    { status: "COMPLETED", count: completedGoals },
    {
      status: "ABANDONED",
      count: goals.filter((g) => g.status === "ABANDONED").length,
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
  const dailyCompletionRate: Array<{ day: string; rate: number }> = [];
  const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

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
    const rate =
      daySchedules.length > 0
        ? Math.round((dayCompleted / daySchedules.length) * 100)
        : 0;

    dailyScheduleCompletion.push({
      date: date.toISOString().split("T")[0],
      completed: dayCompleted,
      total: daySchedules.length,
    });

    dailyCompletionRate.push({
      day: dayNames[getDay(date) === 0 ? 6 : getDay(date) - 1],
      rate,
    });
  }

  // Hourly productivity analysis
  const hourlyProductivity: Array<{
    hour: string;
    productivity: number;
    schedules: number;
  }> = [];
  for (let hour = 6; hour <= 20; hour++) {
    const hourSchedules = allSchedules.filter((s) => {
      const scheduleHour = getHours(new Date(s.startedTime));
      return scheduleHour === hour;
    });

    const hourCompleted = hourSchedules.filter(
      (s) => s.status === "COMPLETED"
    ).length;
    const productivity =
      hourSchedules.length > 0
        ? Math.round((hourCompleted / hourSchedules.length) * 100)
        : 0;

    const timeLabel =
      hour <= 12 ? `${hour} ${hour === 12 ? "PM" : "AM"}` : `${hour - 12} PM`;

    hourlyProductivity.push({
      hour: timeLabel,
      productivity,
      schedules: hourSchedules.length,
    });
  }

  // Weekly activity pattern
  const weeklyActivity: Array<{
    day: string;
    schedules: number;
    completed: number;
    hours: number;
  }> = [];
  const weekDays = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
  ];

  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const daySchedules = allSchedules.filter((s) => {
      const scheduleDayIndex = getDay(new Date(s.startedTime));
      const adjustedDayIndex =
        scheduleDayIndex === 0 ? 6 : scheduleDayIndex - 1;
      return adjustedDayIndex === dayIndex;
    });

    const dayCompleted = daySchedules.filter(
      (s) => s.status === "COMPLETED"
    ).length;

    // Calculate average hours worked on this day
    const avgHours =
      daySchedules.length > 0
        ? daySchedules.reduce((sum, s) => {
            const duration =
              (new Date(s.endTime).getTime() -
                new Date(s.startedTime).getTime()) /
              (1000 * 60 * 60);
            return sum + duration;
          }, 0) / daySchedules.length
        : 0;

    weeklyActivity.push({
      day: weekDays[dayIndex],
      schedules: daySchedules.length,
      completed: dayCompleted,
      hours: Math.round(avgHours * 10) / 10,
    });
  }

  // Calculate streaks
  const { currentStreak, longestStreak } = calculateStreaks(allSchedules);

  // Adherence data (weekly averages over the period)
  const adherenceData: Array<{ week: string; adherence: number }> = [];
  const weeks = Math.ceil(dateRange / 7);
  for (let week = weeks - 1; week >= 0; week--) {
    const weekStart = subDays(endDate, (week + 1) * 7);
    const weekEnd = subDays(endDate, week * 7);

    const weekSchedules = schedules.filter(
      (s) => s.startedTime >= weekStart && s.startedTime <= weekEnd
    );

    const weekCompleted = weekSchedules.filter(
      (s) => s.status === "COMPLETED"
    ).length;
    const adherence =
      weekSchedules.length > 0
        ? Math.round((weekCompleted / weekSchedules.length) * 100)
        : 0;

    adherenceData.push({
      week: `Minggu ${weeks - week}`,
      adherence,
    });
  }

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

  // Monthly heatmap
  const monthStart = startOfMonth(endDate);
  const monthlyHeatmap: Array<{
    date: number;
    week: number;
    day: number;
    value: number;
    schedules: number;
  }> = [];
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: endDate });

  daysInMonth.forEach((day, index) => {
    const daySchedules = allSchedules.filter((s) => {
      const scheduleDate = new Date(s.startedTime);
      return scheduleDate.toDateString() === day.toDateString();
    });

    const completed = daySchedules.filter(
      (s) => s.status === "COMPLETED"
    ).length;
    const productivity =
      daySchedules.length > 0
        ? Math.round((completed / daySchedules.length) * 100)
        : 0;

    monthlyHeatmap.push({
      date: day.getDate(),
      week: Math.floor(index / 7),
      day: getDay(day),
      value: productivity,
      schedules: daySchedules.length,
    });
  });

  // Additional metrics
  const velocityIncrease = calculateVelocityIncrease(
    schedules,
    previousSchedules
  );
  const peakPerformance = Math.max(
    ...dailyCompletionRate.map((d) => d.rate),
    0
  );
  const currentAdherenceRate = scheduleCompletionRate;
  const improvementThisMonth = calculateImprovement(
    schedules,
    previousSchedules
  );
  const averageSessionDuration = calculateAverageSessionDuration(schedules);

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

    // Enhanced analytics
    hourlyProductivity,
    weeklyActivity,
    adherenceData,
    currentStreak,
    longestStreak,
    velocityIncrease,
    peakPerformance,
    monthlyHeatmap,
    dailyCompletionRate,
    scheduleStatusDetailed,
    improvementThisMonth,
    averageSessionDuration,
    currentAdherenceRate,
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

  // Calculate streaks
  const dates = Array.from(dailyCompletion.keys()).sort();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Check from most recent date backwards for current streak
  for (let i = dates.length - 1; i >= 0; i--) {
    if (dailyCompletion.get(dates[i])) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak
  dates.forEach((date) => {
    if (dailyCompletion.get(date)) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  });

  return { currentStreak, longestStreak };
}

function calculateVelocityIncrease(
  current: Array<{ status: string }>,
  previous: Array<{ status: string }>
): number {
  if (previous.length === 0) return current.length > 0 ? 100 : 0;

  const currentCompleted = current.filter(
    (s) => s.status === "COMPLETED"
  ).length;
  const previousCompleted = previous.filter(
    (s) => s.status === "COMPLETED"
  ).length;

  if (previousCompleted === 0) return currentCompleted > 0 ? 100 : 0;

  const increase =
    ((currentCompleted - previousCompleted) / previousCompleted) * 100;
  return Math.round(increase * 10) / 10;
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

function calculateAverageSessionDuration(
  schedules: Array<{ startedTime: Date | string; endTime: Date | string }>
): number {
  if (schedules.length === 0) return 0;

  const totalDuration = schedules.reduce((sum, schedule) => {
    const duration =
      (new Date(schedule.endTime).getTime() -
        new Date(schedule.startedTime).getTime()) /
      (1000 * 60 * 60);
    return sum + duration;
  }, 0);

  return Math.round((totalDuration / schedules.length) * 10) / 10;
}
