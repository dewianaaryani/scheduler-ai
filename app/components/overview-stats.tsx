"use client";

import { useEffect, useState } from "react";
import {
  BarChart2,
  CalendarCheck2,
  CheckCircle2,
  CircleDot,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function OverviewStats() {
  const [data, setData] = useState({
    activeGoals: 0,
    completedGoals: 0,
    todaySchedules: 0,
    dailyProgress: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/dashboard/stats");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <Card className="shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <CircleDot className="text-blue-500" />
          <div>
            <p className="text-sm text-muted-foreground">Goal Aktif</p>
            <h3 className="text-xl font-bold">{data.activeGoals}</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <CheckCircle2 className="text-green-500" />
          <div>
            <p className="text-sm text-muted-foreground">Goal Selesai</p>
            <h3 className="text-xl font-bold">{data.completedGoals}</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <CalendarCheck2 className="text-orange-500" />
          <div>
            <p className="text-sm text-muted-foreground">Jadwal Hari Ini</p>
            <h3 className="text-xl font-bold">{data.todaySchedules}</h3>
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
            <span className="text-sm font-semibold">{data.dailyProgress}%</span>
          </div>
          <Progress value={data.dailyProgress} />
        </CardContent>
      </Card>
    </>
  );
}
