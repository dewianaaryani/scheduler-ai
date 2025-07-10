"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { Target, TrendingUp, Clock } from "lucide-react"

interface GoalAnalyticsProps {
  dateRange: string
}

export default function GoalAnalytics({ dateRange }: GoalAnalyticsProps) {
  // Mock data for goal status distribution
  const goalStatusData = [
    { name: "Active", value: 7, color: "#8b5cf6" },
    { name: "Completed", value: 15, color: "#10b981" },
    { name: "Abandoned", value: 2, color: "#ef4444" },
  ]

  // Mock data for goal completion timeline
  const completionTimelineData = [
    { month: "Jan", completed: 2, created: 4 },
    { month: "Feb", completed: 3, created: 5 },
    { month: "Mar", completed: 4, created: 6 },
    { month: "Apr", completed: 6, created: 7 },
    { month: "May", completed: 5, created: 8 },
    { month: "Jun", completed: 7, created: 9 },
  ]

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="space-y-6">
      {/* Goals by Status */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-violet-600" />
            <CardTitle className="text-lg font-semibold text-gray-800">Goals by Status</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={goalStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {goalStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {goalStatusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal Completion Timeline */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-violet-600" />
            <CardTitle className="text-lg font-semibold text-gray-800">Goal Completion Timeline</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionTimelineData}>
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  name="Completed Goals"
                />
                <Line
                  type="monotone"
                  dataKey="created"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                  name="Created Goals"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Goal Insights */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-violet-600" />
            <CardTitle className="text-lg font-semibold text-gray-800">Goal Insights</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-violet-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-violet-600 mb-1">42 days</div>
              <div className="text-sm text-gray-600">Average Goal Duration</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">12 days</div>
              <div className="text-sm text-gray-600">Fastest Goal Completion</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">Work</div>
              <div className="text-sm text-gray-600">Most Productive Category</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
