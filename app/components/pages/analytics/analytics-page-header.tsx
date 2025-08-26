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

    const improvement = analyticsData.improvementThisMonth || 0;

    if (improvement > 20) {
      return `Produktivitasmu meningkat pesat! Kamu meningkat ${improvement}% periode ini. Kerja luar biasa! 🚀`;
    } else if (improvement > 0) {
      return `Produktivitasmu terus meningkat! Kamu meningkat ${improvement}% periode ini. Pertahankan kerja bagusmu! 📈`;
    } else if (analyticsData.scheduleCompletionRate >= 80) {
      return `Tingkat penyelesaian luar biasa! Kamu menyelesaikan ${analyticsData.scheduleCompletionRate}% dari tugas terjadwal. Kamu hebat! 🔥`;
    } else if (analyticsData.currentStreak && analyticsData.currentStreak > 0) {
      return `Momentum yang bagus! Kamu sudah ${analyticsData.currentStreak} hari berturut-turut menyelesaikan tugas. Tetap konsisten! 💪`;
    } else {
      return `Terus bangun momentum! Tingkat penyelesaianmu saat ini ${analyticsData.scheduleCompletionRate}%. Langkah kecil yang konsisten menghasilkan hasil besar! 🌱`;
    }
  };

  const getInsightTitle = () => {
    if (!analyticsData) return "Memuat...";

    const improvement = analyticsData.improvementThisMonth || 0;

    if (improvement > 20) return "Performa Luar Biasa! 🚀";
    if (improvement > 0) return "Terus Meningkat! 📈";
    if (analyticsData.scheduleCompletionRate >= 80)
      return "Performa Sangat Baik! 🔥";
    if (analyticsData.currentStreak && analyticsData.currentStreak > 0)
      return "Membangun Momentum! 💪";
    return "Terus Semangat! 🌱";
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
