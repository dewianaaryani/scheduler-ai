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
  const getInsight = () => {
    if (!analyticsData) {
      return {
        title: "Memuat...",
        message: "Memuat wawasan...",
      };
    }

    // Hitung produktivitas 7 hari terakhir
    const last7Days = analyticsData.dailyScheduleCompletion || [];
    //sum adalah variabel penampung untuk reduce(penjumlahan)
    const totalSchedules = last7Days.reduce((sum, day) => sum + day.total, 0);
    const completedSchedules = last7Days.reduce(
      (sum, day) => sum + day.completed,
      0
    );
    const weeklyCompletionRate =
      totalSchedules > 0
        ? Math.round((completedSchedules / totalSchedules) * 100)
        : 0;

    let title = "";
    let message = "";

    if (weeklyCompletionRate >= 90) {
      title = "Produktivitas Luar Biasa! 🔥";
      message = `Dalam 7 hari terakhir kamu menyelesaikan ${completedSchedules} dari ${totalSchedules} jadwal (${weeklyCompletionRate}%). Pertahankan performa ini! 🔥`;
    } else if (weeklyCompletionRate >= 70) {
      title = "Produktivitas Sangat Baik! 📈";
      message = `Minggu ini kamu menyelesaikan ${completedSchedules} dari ${totalSchedules} jadwal (${weeklyCompletionRate}%). Konsistensi kamu patut diapresiasi! 📈`;
    } else if (weeklyCompletionRate >= 50) {
      title = "Produktivitas Cukup Baik! 💪";
      message = `Kamu menyelesaikan ${completedSchedules} dari ${totalSchedules} jadwal (${weeklyCompletionRate}%) minggu ini. Masih ada ruang untuk lebih baik lagi! 💪`;
    } else if (weeklyCompletionRate >= 30) {
      title = "Perlu Konsistensi 🌱";
      message = `Kamu sudah menyelesaikan ${completedSchedules} dari ${totalSchedules} jadwal (${weeklyCompletionRate}%) minggu ini. Tingkatkan konsistensi agar progresmu lebih stabil! 🌱`;
    } else if (totalSchedules > 0) {
      title = "Butuh Peningkatan 🚀";
      message = `Baru ${completedSchedules} dari ${totalSchedules} jadwal selesai (${weeklyCompletionRate}%) minggu ini. Coba fokus pada jadwal yang paling penting lebih dulu. 🚀`;
    } else {
      title = "Mari Mulai Produktif! 🌟";
      message = `Belum ada jadwal dalam 7 hari terakhir. Yuk mulai buat jadwal sederhana untuk membangun rutinitas produktif! 🌟`;
    }

    return { title, message };
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
                {getInsight().title}
              </h3>
              <p className="text-gray-600 text-sm">{getInsight().message}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
