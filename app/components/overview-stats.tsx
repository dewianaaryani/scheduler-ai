"use client";

import {
  BarChart2,
  CalendarCheck2,
  CheckCircle2,
  CircleDot,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDashboard } from "../hooks/useDashboard";

export function OverviewStats() {
  const { data, loading } = useDashboard();

  if (loading) {
    return (
      <>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="shadow-sm animate-pulse">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-8"></div>
              </div>
            </CardContent>
          </Card>
        ))}
        <Card className="shadow-sm col-span-1 md:col-span-3 animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-8"></div>
            </div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
          </CardContent>
        </Card>
      </>
    );
  }

  const stats = data?.stats;

  return (
    <>
      <Card className="shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <CircleDot className="text-blue-500" />
          <div>
            <p className="text-sm text-muted-foreground">Tujuan Aktif</p>
            <h3 className="text-xl font-bold">{stats?.activeGoals || 0}</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <CheckCircle2 className="text-green-500" />
          <div>
            <p className="text-sm text-muted-foreground">Tujuan Selesai</p>
            <h3 className="text-xl font-bold">{stats?.completedGoals || 0}</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <CalendarCheck2 className="text-orange-500" />
          <div>
            <p className="text-sm text-muted-foreground">Jadwal Hari Ini</p>
            <h3 className="text-xl font-bold">{stats?.todaySchedules || 0}</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm col-span-1 md:col-span-3">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BarChart2 className="text-purple-500" />
              <p className="text-sm font-medium">Progress Harian</p>
            </div>
            <span className="text-sm font-semibold">
              {stats?.dailyProgress || 0}%
            </span>
          </div>
          <Progress value={stats?.dailyProgress || 0} />
        </CardContent>
      </Card>
    </>
  );
}
