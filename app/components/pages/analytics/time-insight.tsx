"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Clock, Sun, Calendar, TrendingUp } from "lucide-react";
import { AnalyticsData } from "@/lib/analytics"; // 👈 Import your type

interface TimeInsightsProps {
  dateRange: string;
  analyticsData?: AnalyticsData | null; // 👈 Add this prop
}

export default function TimeInsights({
  dateRange,
  analyticsData,
}: TimeInsightsProps) {
  if (!analyticsData) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Most Productive Hours */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-violet-600" />
              <CardTitle className="text-lg font-semibold text-gray-800">
                Most Productive Hours
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {analyticsData.hourlyProductivity &&
            analyticsData.hourlyProductivity.some((h) => h.schedules > 0) ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.hourlyProductivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="hour"
                      stroke="#6b7280"
                      tick={{ fontSize: 12 }}
                      interval={2}
                    />
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
                        name === "productivity"
                          ? "Productivity Score"
                          : "Schedules",
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
                      <linearGradient
                        id="productivityGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <p>No hourly data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Activity Pattern */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-violet-600" />
              <CardTitle className="text-lg font-semibold text-gray-800">
                Weekly Activity Pattern
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {analyticsData.weeklyActivity &&
            analyticsData.weeklyActivity.some((d) => d.schedules > 0) ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.weeklyActivity}>
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
                    <Bar
                      dataKey="schedules"
                      fill="#8b5cf6"
                      radius={[2, 2, 0, 0]}
                      name="Total Schedules"
                    />
                    <Bar
                      dataKey="completed"
                      fill="#10b981"
                      radius={[2, 2, 0, 0]}
                      name="Completed"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <p>No weekly activity data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Schedule Adherence Rate */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-violet-600" />
            <CardTitle className="text-lg font-semibold text-gray-800">
              Schedule Adherence Over Time
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {analyticsData.adherenceData &&
              analyticsData.adherenceData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.adherenceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="week" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" domain={[0, 100]} />
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
                        <linearGradient
                          id="adherenceGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <p>No adherence data available yet</p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {analyticsData.currentAdherenceRate ||
                    analyticsData.scheduleCompletionRate}
                  %
                </div>
                <div className="text-sm text-gray-600">
                  Current Adherence Rate
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {analyticsData.improvementThisMonth &&
                  analyticsData.improvementThisMonth > 0
                    ? "+"
                    : ""}
                  {analyticsData.improvementThisMonth || 0}%
                </div>
                <div className="text-sm text-gray-600">
                  Improvement This Period
                </div>
              </div>
              <div className="bg-violet-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-violet-600 mb-1">
                  {analyticsData.averageSessionDuration || 0}h
                </div>
                <div className="text-sm text-gray-600">
                  Average Session Duration
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
