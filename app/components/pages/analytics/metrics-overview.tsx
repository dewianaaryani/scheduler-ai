"use client";

import { AnalyticsData } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle } from "lucide-react";

interface MetricsOverviewProps {
  analyticsData?: AnalyticsData | null;
}

export default function MetricsOverview({
  analyticsData,
}: MetricsOverviewProps) {
  // Show loading skeleton if no data
  if (!analyticsData) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Helper functions

  const getChangeColor = (type: "positive" | "negative" | "neutral") => {
    switch (type) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getChangeBackground = (type: "positive" | "negative" | "neutral") => {
    switch (type) {
      case "positive":
        return "bg-green-50";
      case "negative":
        return "bg-red-50";
      default:
        return "bg-gray-50";
    }
  };

  // Helper function to determine goal completion rate type
  const getGoalCompletionChangeType = (
    rate: number
  ): "positive" | "negative" | "neutral" => {
    if (rate >= 70) return "positive";
    if (rate >= 40) return "neutral";
    return "negative";
  };

  // Calculate active goals from the data
  const activeGoals = analyticsData.goalsByStatus.find(g => g.status === "ACTIVE")?.count || 0;
  
  // Use the real data from analytics
  const metrics = [
    {
      title: "Total Tujuan Dibuat",
      value: analyticsData.totalGoals.toString(),
      changeType: "neutral" as const,
      icon: Target,
      description: "Tujuan yang telah dibuat",
    },
    {
      title: "Tingkat Penyelesaian Tujuan",
      value: `${analyticsData.goalCompletionRate}%`,
      change: `${analyticsData.completedGoals}/${analyticsData.totalGoals}`,
      changeType: getGoalCompletionChangeType(analyticsData.goalCompletionRate),
      icon: CheckCircle,
      description: "Tujuan berhasil diselesaikan",
    },
    {
      title: "Tujuan Aktif",
      value: activeGoals.toString(),
      changeType: activeGoals > 0 ? ("positive" as const) : ("neutral" as const),
      icon: Target,
      description: "Tujuan yang sedang dikerjakan",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
      {metrics.map((metric, index) => (
        <Card
          key={index}
          className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <div className="bg-violet-100 p-2 rounded-lg">
                <metric.icon className="h-4 w-4 text-violet-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-gray-800">
                  {metric.value}
                </span>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getChangeBackground(metric.changeType)}`}
                >
                  <span className={getChangeColor(metric.changeType)}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500">{metric.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
