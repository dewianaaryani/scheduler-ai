// components/analytics/analytics-page-header.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";
import { AnalyticsData } from "@/lib/analytics"; // 👈 Import your AnalyticsData type

interface AnalyticsPageHeaderProps {
  analyticsData?: AnalyticsData | null;
}

export default function AnalyticsPageHeader({
  analyticsData,
}: AnalyticsPageHeaderProps) {
  const getInsightMessage = () => {
    if (!analyticsData) return "Memuat wawasan...";

    // Calculate 7-day productivity metrics
    const last7Days = analyticsData.dailyScheduleCompletion || [];
    const totalSchedules = last7Days.reduce((sum, day) => sum + day.total, 0);
    const completedSchedules = last7Days.reduce((sum, day) => sum + day.completed, 0);
    const weeklyCompletionRate = totalSchedules > 0 ? Math.round((completedSchedules / totalSchedules) * 100) : 0;

    // Calculate active days (days with schedules)
    const activeDays = last7Days.filter(day => day.total > 0).length;
    const daysWithCompletions = last7Days.filter(day => day.completed > 0).length;

    // Get most productive day
    const mostProductiveDay = last7Days.reduce((best, day) => {
      if (day.total === 0) return best;
      const rate = (day.completed / day.total) * 100;
      const bestRate = best.total === 0 ? 0 : (best.completed / best.total) * 100;
      return rate > bestRate ? day : best;
    }, { completed: 0, total: 0, date: '' });

    const bestDayRate = mostProductiveDay.total > 0 ? Math.round((mostProductiveDay.completed / mostProductiveDay.total) * 100) : 0;

    if (weeklyCompletionRate >= 90) {
      return `Produktivitas luar biasa! Kamu menyelesaikan ${weeklyCompletionRate}% jadwal di ${activeDays} hari terakhir. Hari terbaikmu mencapai ${bestDayRate}%! 🔥`;
    } else if (weeklyCompletionRate >= 70) {
      return `Produktivitas sangat baik! Tingkat penyelesaian ${weeklyCompletionRate}% dalam 7 hari terakhir. Kamu aktif di ${activeDays} hari dengan konsistensi yang bagus! 📈`;
    } else if (weeklyCompletionRate >= 50) {
      return `Produktivitas cukup baik! Kamu menyelesaikan ${weeklyCompletionRate}% jadwal dalam ${activeDays} hari aktif. Ada ruang untuk peningkatan! 💪`;
    } else if (activeDays >= 3 && daysWithCompletions > 0) {
      return `Terus membangun momentum! Kamu aktif ${activeDays} hari dengan ${completedSchedules} jadwal selesai. Konsistensi adalah kunci! 🌱`;
    } else if (totalSchedules > 0) {
      return `Mari tingkatkan produktivitas! Dari ${totalSchedules} jadwal, ${completedSchedules} telah selesai. Fokus pada jadwal yang lebih realistis! 🚀`;
    } else {
      return `Saatnya memulai! Buat jadwal dan mulai bangun rutinitas produktif dalam 7 hari ke depan! 🌟`;
    }
  };

  const getInsightTitle = () => {
    if (!analyticsData) return "Memuat...";

    // Calculate 7-day productivity metrics
    const last7Days = analyticsData.dailyScheduleCompletion || [];
    const totalSchedules = last7Days.reduce((sum, day) => sum + day.total, 0);
    const completedSchedules = last7Days.reduce((sum, day) => sum + day.completed, 0);
    const weeklyCompletionRate = totalSchedules > 0 ? Math.round((completedSchedules / totalSchedules) * 100) : 0;

    const activeDays = last7Days.filter(day => day.total > 0).length;
    const daysWithCompletions = last7Days.filter(day => day.completed > 0).length;

    if (weeklyCompletionRate >= 90) return "Produktivitas Luar Biasa! 🔥";
    if (weeklyCompletionRate >= 70) return "Produktivitas Sangat Baik! 📈";
    if (weeklyCompletionRate >= 50) return "Produktivitas Cukup Baik! 💪";
    if (activeDays >= 3 && daysWithCompletions > 0) return "Membangun Momentum! 🌱";
    if (totalSchedules > 0) return "Butuh Peningkatan! 🚀";
    return "Mari Mulai Produktif! 🌟";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-violet-100 p-2 rounded-lg">
              <BarChart3 className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Analitik & Wawasan
              </h1>
              <p className="text-gray-600">
                Temukan pola produktivitasmu 7 hari terakhir dan lacak progresmu
                dalam mencapai tujuan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Insights Banner */}
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-violet-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">
                {getInsightTitle()}
              </h3>
              <p className="text-gray-600 text-sm">{getInsightMessage()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
