// components/analytics/productivity-trends.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Award, Flame, Zap } from "lucide-react";
import { AnalyticsData } from "@/lib/analytics"; // 👈 Import your type

interface ProductivityTrendsProps {
  analyticsData?: AnalyticsData | null; // 👈 Add this prop
}

export default function ProductivityTrends({
  analyticsData,
}: ProductivityTrendsProps) {
  if (!analyticsData) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full"></div>
                <div className="h-6 bg-gray-200 rounded w-12 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="pb-8">
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-violet-600" />
            <CardTitle className="text-lg font-semibold text-gray-800">
              Pencapaian & Wawasan
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="bg-violet-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-violet-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {analyticsData.currentStreak || 0}
              </div>
              <div className="text-sm text-gray-600">Berturut-turut Saat Ini</div>
            </div>
            <div className="text-center space-y-2">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {analyticsData.longestStreak || 0}
              </div>
              <div className="text-sm text-gray-600">Berturut-turut Terlama</div>
            </div>
            <div className="text-center space-y-2">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Flame className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {analyticsData.velocityIncrease &&
                analyticsData.velocityIncrease > 0
                  ? "+"
                  : ""}
                {analyticsData.velocityIncrease || 0}%
              </div>
              <div className="text-sm text-gray-600">Perubahan Kecepatan</div>
            </div>
            <div className="text-center space-y-2">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {analyticsData.peakPerformance || 0}%
              </div>
              <div className="text-sm text-gray-600">Performa Puncak</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
