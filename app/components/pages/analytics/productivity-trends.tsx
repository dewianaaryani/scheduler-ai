"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingUp, Award, Flame, Zap } from "lucide-react"

interface ProductivityTrendsProps {
  dateRange: string
}

export default function ProductivityTrends({ dateRange }: ProductivityTrendsProps) {
  // Mock data for monthly productivity trends
  const monthlyTrendsData = [
    { month: "Jan", productivity: 72, goals: 4, schedules: 45 },
    { month: "Feb", productivity: 78, goals: 5, schedules: 52 },
    { month: "Mar", productivity: 85, goals: 6, schedules: 58 },
    { month: "Apr", productivity: 82, goals: 7, schedules: 61 },
    { month: "May", productivity: 89, goals: 8, schedules: 67 },
    { month: "Jun", productivity: 92, goals: 9, schedules: 72 },
  ]

  // Mock data for best vs worst performance
  const performanceData = [
    { period: "Best Week", productivity: 96, completion: 94, focus: 98 },
    { period: "Worst Week", productivity: 68, completion: 72, focus: 65 },
    { period: "Average", productivity: 85, completion: 82, focus: 87 },
  ]

  // Mock data for completion streaks
  const streakData = [
    { day: 1, streak: 1 },
    { day: 2, streak: 2 },
    { day: 3, streak: 3 },
    { day: 4, streak: 4 },
    { day: 5, streak: 5 },
    { day: 6, streak: 6 },
    { day: 7, streak: 7 },
    { day: 8, streak: 8 },
    { day: 9, streak: 9 },
    { day: 10, streak: 10 },
    { day: 11, streak: 11 },
    { day: 12, streak: 12 },
    { day: 13, streak: 0 }, // Streak broken
    { day: 14, streak: 1 },
    { day: 15, streak: 2 },
    { day: 16, streak: 3 },
    { day: 17, streak: 4 },
    { day: 18, streak: 5 },
    { day: 19, streak: 6 },
    { day: 20, streak: 7 },
  ]

  return (
    <div className="space-y-6">
      {/* Monthly Productivity Trends */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-violet-600" />
            <CardTitle className="text-lg font-semibold text-gray-800">Monthly Productivity Trends</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="productivity"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 5 }}
                  name="Productivity Score"
                />
                <Line
                  type="monotone"
                  dataKey="goals"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
                  name="Goals Completed"
                />
                <Line
                  type="monotone"
                  dataKey="schedules"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                  name="Schedules Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Performance Comparison */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-violet-600" />
              <CardTitle className="text-lg font-semibold text-gray-800">Performance Comparison</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{item.period}</span>
                    <span className="text-sm text-gray-500">{item.productivity}% avg</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-violet-50 p-2 rounded text-center">
                      <div className="text-sm font-semibold text-violet-600">{item.productivity}%</div>
                      <div className="text-xs text-gray-500">Productivity</div>
                    </div>
                    <div className="bg-green-50 p-2 rounded text-center">
                      <div className="text-sm font-semibold text-green-600">{item.completion}%</div>
                      <div className="text-xs text-gray-500">Completion</div>
                    </div>
                    <div className="bg-blue-50 p-2 rounded text-center">
                      <div className="text-sm font-semibold text-blue-600">{item.focus}%</div>
                      <div className="text-xs text-gray-500">Focus</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completion Streaks */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-violet-600" />
              <CardTitle className="text-lg font-semibold text-gray-800">Completion Streaks</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={streakData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value) => [`${value} days`, "Streak Length"]}
                  />
                  <Area type="monotone" dataKey="streak" stroke="#f59e0b" fill="url(#streakGradient)" strokeWidth={2} />
                  <defs>
                    <linearGradient id="streakGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goal Achievement Velocity */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-violet-600" />
            <CardTitle className="text-lg font-semibold text-gray-800">Achievement Insights</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="bg-violet-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-violet-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">12 days</div>
              <div className="text-sm text-gray-600">Current Streak</div>
            </div>
            <div className="text-center space-y-2">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">23 days</div>
              <div className="text-sm text-gray-600">Longest Streak</div>
            </div>
            <div className="text-center space-y-2">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Flame className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">3.2x</div>
              <div className="text-sm text-gray-600">Velocity Increase</div>
            </div>
            <div className="text-center space-y-2">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">96%</div>
              <div className="text-sm text-gray-600">Peak Performance</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
