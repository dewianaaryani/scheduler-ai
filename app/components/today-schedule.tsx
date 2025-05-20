"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Schedule = {
  id: string;
  title: string;
  time: string;
  category: string;
  icon: string;
  hasGoal: boolean;
};

export function TodaySchedule() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await fetch("/api/dashboard/today-schedules");
        if (!res.ok) throw new Error("Failed to fetch schedules");
        const data = await res.json();
        setSchedules(data);
      } catch (error) {
        console.error("Error loading schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

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
            <h3 className="font-semibold">Today&apos;s Schedule</h3>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-8">
                <TabsTrigger value="all" className="text-xs">
                  All
                </TabsTrigger>
                <TabsTrigger value="one-time" className="text-xs">
                  One time event
                </TabsTrigger>
                <TabsTrigger value="ai-goals" className="text-xs">
                  Ai Goals
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search in activities..."
                className="pl-9 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {loading ? (
              <p className="text-sm text-muted-foreground">
                Loading schedules...
              </p>
            ) : filteredSchedules.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No schedules found.
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
