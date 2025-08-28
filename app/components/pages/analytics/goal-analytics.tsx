"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Target } from "lucide-react";
import { AnalyticsData } from "@/lib/analytics";

interface GoalAnalyticsProps {
  analyticsData?: AnalyticsData | null; // 👈 This receives the real data
}

export default function GoalAnalytics({
  analyticsData,
}: GoalAnalyticsProps) {
  if (!analyticsData) {
    return <div className="animate-pulse h-64 bg-gray-200 rounded"></div>;
  }

  // 👇 Transform the real data for the chart
  const goalStatusData = analyticsData.goalsByStatus
    .filter((item) => item.count > 0)
    .map((item) => ({
      name:
        item.status === "ACTIVE"
          ? "Aktif"
          : item.status === "COMPLETED"
            ? "Selesai"
            : "Dibatalkan",
      value: item.count, // 👈 Real count from database
      color: item.color, // 👈 Use color from data
    }));

  const RADIAN = Math.PI / 180;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    if (!midAngle || !percent) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

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
    );
  };

  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-violet-600" />
          <div>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Tujuan Berdasarkan Status
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Semua tujuan yang pernah dibuat
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {goalStatusData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={goalStatusData} // 👈 Real data
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
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="font-medium text-gray-700">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-gray-800">
                    {item.value}
                  </span>{" "}
                  {/* 👈 Real count */}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">Tidak ada tujuan ditemukan</p>
              <p className="text-sm">Buat tujuan pertama Anda untuk melihat analitik</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
