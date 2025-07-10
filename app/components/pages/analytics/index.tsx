"use client"
import React, { useState } from 'react'
import AnalyticsPageHeader from './analytics-page-header'
import MetricsOverview from './metrics-overview'
import GoalAnalytics from './goal-analytics'
import SchedulePerformance from './schedule-performance'
import TimeInsights from './time-insight'
import ProductivityTrends from './productivity-trends'

export default function AnalyticsPage() {
     const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dateRange, setDateRange] = useState("30")

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
            <AnalyticsPageHeader dateRange={dateRange} onDateRangeChange={setDateRange} />
            <MetricsOverview dateRange={dateRange} />

            <div className="grid lg:grid-cols-2 gap-6">
              <GoalAnalytics dateRange={dateRange} />
              <SchedulePerformance dateRange={dateRange} />
            </div>

            <TimeInsights dateRange={dateRange} />
            <ProductivityTrends dateRange={dateRange} />
          </div>
  )
}
