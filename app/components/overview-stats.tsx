"use client";

import {
  BarChart2,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  PlayCircle,
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
          <Calendar className="text-blue-500 h-6 w-6" />
          <div>
            <p className="text-sm text-muted-foreground">Jadwal Hari Ini</p>
            <h3 className="text-xl font-bold">{stats?.todaySchedules || 0}</h3>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <CheckCircle2 className="text-green-500 h-6 w-6" />
          <div>
            <p className="text-sm text-muted-foreground">Jadwal Selesai</p>
            <h3 className="text-xl font-bold">
              {stats?.completedSchedulesToday || 0}
            </h3>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <Clock className="text-gray-500 h-6 w-6" />
          <div>
            <p className="text-sm text-muted-foreground">
              Jadwal Belum Selesai
            </p>
            <h3 className="text-xl font-bold">
              {stats?.todayNoneStatusSchedules || 0}
            </h3>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <PlayCircle className="text-orange-500 h-6 w-6" />
          <div>
            <p className="text-sm text-muted-foreground">
              Jadwal Sedang Berjalan
            </p>
            <h3 className="text-xl font-bold">
              {stats?.todayinProgressStatusSchedules || 0}
            </h3>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <AlertCircle className="text-yellow-500 h-6 w-6" />
          <div>
            <p className="text-sm text-muted-foreground">Jadwal Terlewat</p>
            <h3 className="text-xl font-bold">
              {stats?.todayMissedStatusSchedules || 0}
            </h3>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <XCircle className="text-red-500 h-6 w-6" />
          <div>
            <p className="text-sm text-muted-foreground">Jadwal Dibatalkan</p>
            <h3 className="text-xl font-bold">
              {stats?.todayAbandonedStatusSchedules || 0}
            </h3>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm col-span-1 md:col-span-3">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BarChart2 className="text-purple-500 h-6 w-6" />
              <p className="text-sm font-medium">Progress Harian</p>
            </div>
            <span className="text-sm font-semibold">
              {stats?.dailyProgress || 0}%
            </span>
          </div>
          <Progress value={stats?.dailyProgress || 0} className="bg-purple-100" />
        </CardContent>
      </Card>
    </>
  );
}
