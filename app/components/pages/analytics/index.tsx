// components/analytics/analytics-page.tsx
"use client";
import React, { useState, useEffect } from "react";
import AnalyticsPageHeader from "./analytics-page-header";
import GoalAnalytics from "./goal-analytics";
import SchedulePerformance from "./schedule-performance";
import TimeInsights from "./time-insight";
import ProductivityTrends from "./productivity-trends";
import { AnalyticsData } from "@/lib/analytics";
import MetricsOverview from "./metrics-overview";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/analytics?dateRange=${dateRange}`);

        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }

        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-8 p-2">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="space-y-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-200 p-2 rounded-lg w-10 h-10"></div>
                  <div>
                    <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-80"></div>
                  </div>
                </div>
              </div>
              <div className="w-40 h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>

          {/* Metrics skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>

          {/* Charts skeleton */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>

          {/* Time insights skeleton */}
          <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-80 bg-gray-200 rounded"></div>
          </div>

          {/* Productivity trends skeleton */}
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto p-2">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h3 className="text-red-800 font-semibold text-lg mb-2">
            Error loading analytics
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-2">
      <AnalyticsPageHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        analyticsData={data}
      />
      <MetricsOverview dateRange={dateRange} analyticsData={data} />

      <div className="grid lg:grid-cols-2 gap-6">
        <GoalAnalytics dateRange={dateRange} analyticsData={data} />
        <SchedulePerformance dateRange={dateRange} analyticsData={data} />
      </div>

      <TimeInsights dateRange={dateRange} analyticsData={data} />
      <ProductivityTrends dateRange={dateRange} analyticsData={data} />
    </div>
  );
}
