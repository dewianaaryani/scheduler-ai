"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ActivityManager() {
  const activities = [
    { id: 1, value: 8.2, day: "Mon" },
    { id: 2, value: 7.8, day: "Tue" },
    { id: 3, value: 9.3, day: "Wed" },
    { id: 4, value: 6.5, day: "Thu" },
    { id: 5, value: 8.7, day: "Fri" },
    { id: 6, value: 7.2, day: "Sat" },
    { id: 7, value: 5.9, day: "Sun" },
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search in activities..."
          className="pl-9 rounded-full"
        />
      </div>

      <div className="flex items-end gap-2 h-[150px] pt-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex flex-col items-center gap-2 flex-1"
          >
            <div className="w-full flex-1 flex items-end">
              <div
                className="w-full bg-orange-500 rounded-sm"
                style={{
                  height: `${(activity.value / 10) * 100}%`,
                  opacity: activity.id % 2 === 0 ? 0.7 : 1,
                }}
              ></div>
            </div>
            <span className="text-xs text-muted-foreground">
              {activity.day}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">$43.20</p>
          <p className="text-xs text-muted-foreground">USD</p>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                i === 2 ? "bg-orange-500" : "bg-muted"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
