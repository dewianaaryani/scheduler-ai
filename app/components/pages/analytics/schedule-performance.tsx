"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Calendar, Activity, Clock } from "lucide-react"

interface SchedulePerformanceProps {
  dateRange: string
}

export default function SchedulePerformance({ dateRange }: SchedulePerformanceProps) {
  // Mock data for schedule status distribution
  const scheduleStatusData = [
    { status: "Completed", count: 45, color: "#10b981" },
    { status: "In Progress", count: 8, color: "#3b82f6" },
    { status: "Missed", count: 12, color: "#ef4444" },
    { status: "Abandoned", count: 3, color: "#6b7280" },
  ]

  // Mock data for daily completion rate (last 7 days)
  const dailyCompletionData = [
    { day: "Mon", rate: 85 },
    { day: "Tue", rate: 92 },
    { day: "Wed", rate: 78 },
    { day: "Thu", rate: 88 },
    { day: "Fri", rate: 95 },
    { day: "Sat", rate: 72 },
    { day: "Sun", rate: 68 },
  ]

  // Mock heatmap data for the current month
  const generateHeatmapData = () => {
    const data = []
    for (let week = 0; week < 5; week++) {
      for (let day = 0; day < 7; day++) {
        const date = week * 7 + day + 1
        if (date <= 30) {
          data.push({
            date,
            week,
            day,
            value: Math.floor(Math.random() * 100),
            schedules: Math.floor(Math.random() * 5),
          })
        }
      }
    }
    return data
  }

  const heatmapData = generateHeatmapData()

  const getHeatmapColor = (value: number) => {
    if (value >= 80) return "#10b981"
    if (value >= 60) return "#34d399"
    if (value >= 40) return "#fbbf24"
    if (value >= 20) return "#fb923c"
    return "#ef4444"
  }

  return (
    <div className="space-y-6">
      {/* Schedule Status Distribution */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-violet-600" />
            <CardTitle className="text-lg font-semibold text-gray-800">Schedule Status Distribution</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scheduleStatusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="status" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {scheduleStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Daily Completion Rate */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-violet-600" />
            <CardTitle className="text-lg font-semibold text-gray-800">Weekly Completion Pattern</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyCompletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value) => [`${value}%`, "Completion Rate"]}
                />
                <Bar dataKey="rate" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Activity Heatmap */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-violet-600" />
            <CardTitle className="text-lg font-semibold text-gray-800">Monthly Activity Heatmap</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {heatmapData.map((item, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-sm cursor-pointer hover:ring-2 hover:ring-violet-300 transition-all"
                  style={{ backgroundColor: getHeatmapColor(item.value) }}
                  title={`${item.date}: ${item.value}% completion rate, ${item.schedules} schedules`}
                >
                  <div className="w-full h-full flex items-center justify-center text-xs text-white font-medium">
                    {item.date}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Less active</span>
              <div className="flex gap-1">
                {[20, 40, 60, 80, 100].map((value) => (
                  <div
                    key={value}
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: getHeatmapColor(value) }}
                  ></div>
                ))}
              </div>
              <span>More active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
