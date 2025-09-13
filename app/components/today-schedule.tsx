"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    <TooltipProvider>
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4 mb-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 className="font-semibold inline-block cursor-help">
                    Jadwal Hari Ini
                  </h3>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  <span>
                    Daftar aktivitas dan jadwal yang perlu Anda selesaikan hari
                    ini
                  </span>
                </TooltipContent>
              </Tooltip>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 h-auto bg-gray-100 p-1 gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger 
                        value="all" 
                        className="text-xs px-2 py-2 transition-all rounded-md"
                        style={{
                          border: activeTab === "all" ? "1px solid #a855f7" : "1px solid #e5e7eb",
                          backgroundColor: activeTab === "all" ? "#faf5ff" : "white",
                          color: activeTab === "all" ? "#7c3aed" : "#6b7280",
                          fontWeight: activeTab === "all" ? "600" : "normal"
                        }}
                      >
                        Semua
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="font-medium">
                      <span>Tampilkan semua jadwal hari ini</span>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger
                        value="one-time"
                        className="text-xs px-2 py-2 transition-all rounded-md"
                        style={{
                          border: activeTab === "one-time" ? "1px solid #a855f7" : "1px solid #e5e7eb",
                          backgroundColor: activeTab === "one-time" ? "#faf5ff" : "white",
                          color: activeTab === "one-time" ? "#7c3aed" : "#6b7280",
                          fontWeight: activeTab === "one-time" ? "600" : "normal"
                        }}
                      >
                        Jadwal Biasa
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="font-medium">
                      <span>
                        Jadwal yang dibuat manual dan tidak terkait dengan
                        tujuan
                      </span>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger
                        value="ai-goals"
                        className="text-xs px-2 py-2 transition-all rounded-md"
                        style={{
                          border: activeTab === "ai-goals" ? "1px solid #a855f7" : "1px solid #e5e7eb",
                          backgroundColor: activeTab === "ai-goals" ? "#faf5ff" : "white",
                          color: activeTab === "ai-goals" ? "#7c3aed" : "#6b7280",
                          fontWeight: activeTab === "ai-goals" ? "600" : "normal"
                        }}
                      >
                        Jadwal dari Tujuan
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="font-medium">
                      <span>
                        Jadwal yang dibuat otomatis dari tujuan AI Anda
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari aktivitas yang ada hari ini..."
                  className="pl-9 rounded-lg"
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
                      {schedule?.goal && (
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-muted px-2 py-1 text-xs">
                            {schedule?.goal}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
