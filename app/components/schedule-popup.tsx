"use client";

import { useState } from "react";
import ScheduleDetailPopup from "./schedule-detail-popup";

export default function SchedulePopup() {
  const [open, setOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);

  const schedules = [
    {
      id: "1",
      title: "Team Meeting",
      description: "Weekly team sync to discuss project progress and blockers",
      goalTitle: "Improve Team Communication",
      startTime: "2025-05-21T10:00:00",
      endTime: "2025-05-21T11:00:00",
      percentComplete: 0,
      emoji: "👥",
      status: "NONE", // Empty status to show textarea
      notes: "Hello mf",
    },
    {
      id: "2",
      title: "Project Planning",
      description: "Plan the next sprint and assign tasks",
      goalTitle: "Complete Project on Time",
      startTime: "2025-05-21T13:00:00",
      endTime: "2025-05-21T14:30:00",
      percentComplete: 25,
      emoji: "📝",
      status: "NONE", // Can be updated
    },
    {
      id: "3",
      title: "Client Presentation",
      description: "Present the latest project updates to the client",
      startTime: "2025-05-21T15:00:00",
      endTime: "2025-05-21T16:00:00",
      percentComplete: 50,
      emoji: "🎯",
      status: "IN_PROGRESS", // Can be updated
    },
    {
      id: "4",
      title: "Workout Session",
      description: "30-minute cardio and strength training",
      goalTitle: "Stay Healthy",
      startTime: "2025-05-21T18:00:00",
      endTime: "2025-05-21T18:30:00",
      percentComplete: 100,
      emoji: "💪",
      status: "COMPLETED", // Already completed
    },
    {
      id: "5",
      title: "Morning Meditation",
      description: "15-minute mindfulness meditation",
      goalTitle: "Improve Mental Wellbeing",
      startTime: "2025-05-21T07:00:00",
      endTime: "2025-05-21T07:15:00",
      percentComplete: 0,
      emoji: "🧘‍♂️",
      status: "MISSED", // Already missed
    },
  ];

  const handleOpenSchedule = (schedule: any) => {
    setSelectedSchedule(schedule);
    setOpen(true);
  };

  const handleUpdateStatus = (id: string, status: string, notes?: string) => {
    console.log(`Updated schedule ${id} to status: ${status}`);
    if (notes) {
      console.log(`Notes: ${notes}`);
    }
    // In a real app, you would update the schedule in your state or database
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Schedule Detail Demo
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleOpenSchedule(schedule)}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">{schedule.emoji}</div>
              <h3 className="font-medium text-gray-800">{schedule.title}</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {schedule.description}
            </p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>
                {new Date(schedule.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span>{schedule.status || "No status"}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedSchedule && (
        <ScheduleDetailPopup
          open={open}
          onOpenChange={setOpen}
          schedule={selectedSchedule}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
