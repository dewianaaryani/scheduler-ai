"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboard } from "../hooks/useDashboard";

export function TodaySchedule() {
  const { data, loading } = useDashboard();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const schedules = data?.schedules || [];

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "one-time" && !schedule.hasGoal) ||
      (activeTab === "ai-goals" && schedule.hasGoal);

    const matchesSearch = schedule.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Jadwal Hari Ini</h3>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-8">
                <TabsTrigger value="all" className="text-xs">
                  Semua
                </TabsTrigger>
                <TabsTrigger value="one-time" className="text-xs">
                  Jadwal Biasa
                </TabsTrigger>
                <TabsTrigger value="ai-goals" className="text-xs">
                  Jadwal dari Tujuan
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari dalam aktivitas..."
                className="pl-9 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : filteredSchedules.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Tidak ada jadwal ditemukan.
              </p>
            ) : (
              <div className="space-y-3">
                {filteredSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full text-white text-lg">
                      <span>{schedule.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{schedule.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {schedule.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-muted px-2 py-1 text-xs">
                        {schedule.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
