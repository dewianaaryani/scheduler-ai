// components/analytics/analytics-page-header.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Calendar, TrendingUp } from "lucide-react";
import { AnalyticsData } from "@/lib/analytics"; // 👈 Import your AnalyticsData type

interface AnalyticsPageHeaderProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  analyticsData?: AnalyticsData | null; // 👈 Add this prop
}

export default function AnalyticsPageHeader({
  dateRange,
  onDateRangeChange,
  analyticsData, // 👈 Add this parameter
}: AnalyticsPageHeaderProps) {
  const getInsightMessage = () => {
    if (!analyticsData) return "Loading insights...";

    const improvement = analyticsData.improvementThisMonth || 0;

    if (improvement > 20) {
      return `Your productivity is soaring! You've improved by ${improvement}% this period. Outstanding work! 🚀`;
    } else if (improvement > 0) {
      return `Your productivity is trending upward! You've improved by ${improvement}% this period. Keep up the great work! 📈`;
    } else if (analyticsData.scheduleCompletionRate >= 80) {
      return `Excellent completion rate! You're completing ${analyticsData.scheduleCompletionRate}% of your scheduled tasks. You're on fire! 🔥`;
    } else if (analyticsData.currentStreak && analyticsData.currentStreak > 0) {
      return `Great momentum! You're on a ${analyticsData.currentStreak}-day completion streak. Stay consistent! 💪`;
    } else {
      return `Keep building momentum! Your current completion rate is ${analyticsData.scheduleCompletionRate}%. Small consistent steps lead to big results! 🌱`;
    }
  };

  const getInsightTitle = () => {
    if (!analyticsData) return "Loading...";

    const improvement = analyticsData.improvementThisMonth || 0;

    if (improvement > 20) return "Outstanding Performance! 🚀";
    if (improvement > 0) return "Trending Upward! 📈";
    if (analyticsData.scheduleCompletionRate >= 80)
      return "Excellent Performance! 🔥";
    if (analyticsData.currentStreak && analyticsData.currentStreak > 0)
      return "Building Momentum! 💪";
    return "Keep Going! 🌱";
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
                Analytics & Insights
              </h1>
              <p className="text-gray-600">
                Discover your productivity patterns and track your progress
                toward achieving your goals
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={onDateRangeChange}>
            <SelectTrigger className="bg-white border-gray-300 ">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
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
