"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Activity } from "lucide-react";
import { AnalyticsData } from "@/lib/analytics";

interface SchedulePerformanceProps {
  analyticsData?: AnalyticsData | null; // 👈 This receives the real data
}

export default function SchedulePerformance({
  analyticsData,
}: SchedulePerformanceProps) {
  if (!analyticsData) {
    return <div className="animate-pulse h-64 bg-gray-200 rounded"></div>;
  }

  // 👇 Use the real schedule status data
  const scheduleStatusData = analyticsData.scheduleStatusDetailed;

  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-violet-600" />
          <CardTitle className="text-lg font-semibold text-gray-800">
            Distribusi Status Jadwal
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {scheduleStatusData.some((item) => item.count > 0) ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={scheduleStatusData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
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
                  {" "}
                  {/* 👈 Real count data */}
                  {scheduleStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">Tidak ada jadwal ditemukan</p>
              <p className="text-sm">
                Buat jadwal untuk melihat analitik performa
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
