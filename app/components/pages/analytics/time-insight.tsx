
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Clock, Sun, Calendar, TrendingUp } from "lucide-react"

interface TimeInsightsProps {
  dateRange: string
}

export default function TimeInsights({ dateRange }: TimeInsightsProps) {
  // Mock data for hourly productivity
  const hourlyProductivityData = [
    { hour: "6 AM", productivity: 45, schedules: 2 },
    { hour: "7 AM", productivity: 62, schedules: 4 },
    { hour: "8 AM", productivity: 78, schedules: 8 },
    { hour: "9 AM", productivity: 85, schedules: 12 },
    { hour: "10 AM", productivity: 92, schedules: 15 },
    { hour: "11 AM", productivity: 88, schedules: 14 },
    { hour: "12 PM", productivity: 75, schedules: 10 },
    { hour: "1 PM", productivity: 68, schedules: 8 },
    { hour: "2 PM", productivity: 82, schedules: 13 },
    { hour: "3 PM", productivity: 89, schedules: 16 },
    { hour: "4 PM", productivity: 86, schedules: 14 },
    { hour: "5 PM", productivity: 72, schedules: 9 },
    { hour: "6 PM", productivity: 58, schedules: 6 },
    { hour: "7 PM", productivity: 45, schedules: 4 },
    { hour: "8 PM", productivity: 35, schedules: 2 },
  ]

  // Mock data for weekly activity pattern
  const weeklyActivityData = [
    { day: "Monday", schedules: 18, completed: 15, hours: 6.5 },
    { day: "Tuesday", schedules: 22, completed: 20, hours: 7.2 },
    { day: "Wednesday", schedules: 20, completed: 16, hours: 6.8 },
    { day: "Thursday", schedules: 25, completed: 22, hours: 8.1 },
    { day: "Friday", schedules: 19, completed: 18, hours: 6.9 },
    { day: "Saturday", schedules: 12, completed: 9, hours: 4.2 },
    { day: "Sunday", schedules: 8, completed: 6, hours: 2.8 },
  ]

  // Mock data for schedule adherence over time
  const adherenceData = [
    { week: "Week 1", adherence: 72 },
    { week: "Week 2", adherence: 78 },
    { week: "Week 3", adherence: 85 },
    { week: "Week 4", adherence: 82 },
    { week: "Week 5", adherence: 89 },
    { week: "Week 6", adherence: 91 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Most Productive Hours */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-violet-600" />
              <CardTitle className="text-lg font-semibold text-gray-800">Most Productive Hours</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyProductivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" stroke="#6b7280" tick={{ fontSize: 12 }} interval={2} />
                  <YAxis stroke="#6b7280" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value, name) => [
                      name === "productivity" ? `${value}%` : value,
                      name === "productivity" ? "Productivity Score" : "Schedules",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="productivity"
                    stroke="#8b5cf6"
                    fill="url(#productivityGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="productivityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity Pattern */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-violet-600" />
              <CardTitle className="text-lg font-semibold text-gray-800">Weekly Activity Pattern</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="day"
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="schedules" fill="#8b5cf6" radius={[2, 2, 0, 0]} name="Total Schedules" />
                  <Bar dataKey="completed" fill="#10b981" radius={[2, 2, 0, 0]} name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Adherence Rate */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-violet-600" />
            <CardTitle className="text-lg font-semibold text-gray-800">Schedule Adherence Over Time</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={adherenceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" domain={[60, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      formatter={(value) => [`${value}%`, "Adherence Rate"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="adherence"
                      stroke="#10b981"
                      fill="url(#adherenceGradient)"
                      strokeWidth={3}
                    />
                    <defs>
                      <linearGradient id="adherenceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">91%</div>
                <div className="text-sm text-gray-600">Current Adherence Rate</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">+19%</div>
                <div className="text-sm text-gray-600">Improvement This Month</div>
              </div>
              <div className="bg-violet-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-violet-600 mb-1">2.3h</div>
                <div className="text-sm text-gray-600">Average Session Duration</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Block Utilization */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-violet-600" />
            <CardTitle className="text-lg font-semibold text-gray-800">Time Block Utilization</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-violet-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-violet-600 mb-1">Morning</div>
              <div className="text-sm text-gray-600 mb-2">6 AM - 12 PM</div>
              <div className="text-lg font-semibold text-gray-800">85%</div>
              <div className="text-xs text-gray-500">Utilization</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">Afternoon</div>
              <div className="text-sm text-gray-600 mb-2">12 PM - 6 PM</div>
              <div className="text-lg font-semibold text-gray-800">92%</div>
              <div className="text-xs text-gray-500">Utilization</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">Evening</div>
              <div className="text-sm text-gray-600 mb-2">6 PM - 10 PM</div>
              <div className="text-lg font-semibold text-gray-800">67%</div>
              <div className="text-xs text-gray-500">Utilization</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-600 mb-1">Night</div>
              <div className="text-sm text-gray-600 mb-2">10 PM - 6 AM</div>
              <div className="text-lg font-semibold text-gray-800">23%</div>
              <div className="text-xs text-gray-500">Utilization</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
