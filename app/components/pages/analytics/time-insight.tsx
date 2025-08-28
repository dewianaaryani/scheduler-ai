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
  Cell,
} from "recharts";
import { Sun, Calendar } from "lucide-react";
import { AnalyticsData } from "@/lib/analytics"; // 👈 Import your type

interface TimeInsightsProps {
  analyticsData?: AnalyticsData | null; // 👈 Add this prop
}

export default function TimeInsights({ analyticsData }: TimeInsightsProps) {
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Daily Schedule Completion */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-violet-600" />
              <CardTitle className="text-lg font-semibold text-gray-800">
                Penyelesaian Jadwal Harian (7 Hari Terakhir)
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {analyticsData.dailyScheduleCompletion &&
            analyticsData.dailyScheduleCompletion.some((d) => d.total > 0) ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.dailyScheduleCompletion}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      stroke="#6b7280"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(date) =>
                        new Date(date).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "2-digit",
                        })
                      }
                    />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      labelFormatter={(date) =>
                        new Date(date).toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      }
                      formatter={(value, name) => [
                        value,
                        name === "completed" ? "Selesai" : "Total",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#e5e7eb"
                      fill="#f3f4f6"
                      strokeWidth={1}
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stroke="#10b981"
                      fill="url(#completionGradient)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient
                        id="completionGradient"
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
                <p>Belum ada data penyelesaian harian tersedia</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Schedule Status Distribution */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-violet-600" />
              <CardTitle className="text-lg font-semibold text-gray-800">
                Distribusi Status Jadwal (7 Hari Terakhir)
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {analyticsData.scheduleStatusDetailed &&
            analyticsData.scheduleStatusDetailed.some((s) => s.count > 0) ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.scheduleStatusDetailed}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="status"
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
                      formatter={(value) => [value, "Jumlah Jadwal"]}
                    />
                    <Bar
                      dataKey="count"
                      radius={[2, 2, 0, 0]}
                      name="Jumlah"
                    >
                      {analyticsData.scheduleStatusDetailed.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <p>Belum ada data status jadwal tersedia</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
