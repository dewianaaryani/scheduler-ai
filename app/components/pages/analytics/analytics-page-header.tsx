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
    const completedSchedules = last7Days.reduce(
      (sum, day) => sum + day.completed,
      0
    );
    const weeklyCompletionRate =
      totalSchedules > 0
        ? Math.round((completedSchedules / totalSchedules) * 100)
        : 0;

    if (weeklyCompletionRate >= 90) {
      return `Produktivitas luar biasa seminggu ini! Kamu menyelesaikan ${weeklyCompletionRate}% dari ${totalSchedules} jadwal dalam 7 hari terakhir! 🔥`;
    } else if (weeklyCompletionRate >= 70) {
      return `Produktivitas sangat baik seminggu ini! Tingkat penyelesaian ${weeklyCompletionRate}% dengan ${completedSchedules} dari ${totalSchedules} jadwal selesai! 📈`;
    } else if (weeklyCompletionRate >= 50) {
      return `Produktivitas cukup baik seminggu ini! Kamu menyelesaikan ${weeklyCompletionRate}% jadwal. Ada ruang untuk peningkatan! 💪`;
    } else if (weeklyCompletionRate >= 30) {
      return `Terus membangun momentum! Tingkat penyelesaian ${weeklyCompletionRate}% minggu ini. Konsistensi adalah kunci! 🌱`;
    } else if (totalSchedules > 0) {
      return `Mari tingkatkan produktivitas! Baru ${weeklyCompletionRate}% jadwal selesai minggu ini. Fokus pada jadwal yang lebih realistis! 🚀`;
    } else {
      return `Saatnya memulai! Buat jadwal dan mulai bangun rutinitas produktif dalam 7 hari ke depan! 🌟`;
    }
  };

  const getInsightTitle = () => {
    if (!analyticsData) return "Memuat...";

    // Calculate 7-day productivity metrics
    const last7Days = analyticsData.dailyScheduleCompletion || [];
    const totalSchedules = last7Days.reduce((sum, day) => sum + day.total, 0);
    const completedSchedules = last7Days.reduce(
      (sum, day) => sum + day.completed,
      0
    );
    const weeklyCompletionRate =
      totalSchedules > 0
        ? Math.round((completedSchedules / totalSchedules) * 100)
        : 0;

    if (weeklyCompletionRate >= 90) return "Produktivitas Luar Biasa! 🔥";
    if (weeklyCompletionRate >= 70) return "Produktivitas Sangat Baik! 📈";
    if (weeklyCompletionRate >= 50) return "Produktivitas Cukup Baik! 💪";
    if (weeklyCompletionRate >= 30) return "Membangun Momentum! 🌱";
    if (totalSchedules > 0) return "Butuh Peningkatan! 🚀";
    return "Mari Mulai Produktif! 🌟";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-violet-100 p-2.5 rounded-lg">
              <BarChart3 className="h-7 w-7 text-violet-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-xl lg:text-2xl font-bold text-gray-800">
                Analisis Produktivitas
              </h1>
              <p className="text-sm md:text-base text-gray-600">
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
