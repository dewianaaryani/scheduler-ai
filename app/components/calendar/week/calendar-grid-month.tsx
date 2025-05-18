"use client";

import { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addDays,
} from "date-fns";
import { MoreHorizontal } from "lucide-react";

// Types from your existing code
type IconName = string;

type Schedule = {
  id: string;
  title: string;
  description: string;
  startedTime: Date;
  endTime: Date;
  icon: IconName;
  recurrence: string;
  status: string;
};

type CalendarEvent = {
  id: string;
  title: string;
  day: number;
  time: string;
  description?: string;
  icon?: string;
};

interface CalendarGridMonthProps {
  currentMonth: Date;
}

export default function CalendarGridMonth({
  currentMonth,
}: CalendarGridMonthProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate these values inside useEffect to avoid the dependency warning
  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      try {
        // Calculate first day and last day of the month inside the effect
        const firstDayOfMonth = startOfMonth(currentMonth);
        const lastDayOfMonth = endOfMonth(currentMonth);

        const startDate = format(firstDayOfMonth, "yyyy-MM-dd");
        const endDate = format(lastDayOfMonth, "yyyy-MM-dd");

        const response = await fetch(
          `/api/schedules?startDate=${startDate}&endDate=${endDate}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch schedules");
        }

        const schedules: Schedule[] = await response.json();

        // Transform schedules to calendar events
        const formattedEvents = schedules.map((schedule) => {
          const startDate = new Date(schedule.startedTime);

          return {
            id: schedule.id,
            title: schedule.title,
            day: startDate.getDate(),
            time: format(startDate, "h:mm a").toLowerCase(),
            description: schedule.description,
            icon: schedule.icon,
          };
        });

        setEvents(formattedEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        console.error("Error fetching schedules:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, [currentMonth]); // currentMonth is the only dependency needed now

  // Calculate first day of the month and days in the month for rendering
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  // Calculate the days to display in the first row before the first day of the month
  const startingDayOfWeek = getDay(firstDayOfMonth);
  const precedingDays = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1; // Adjust for Monday start

  // Calculate days to display from previous month
  const prevMonthDays = Array.from({ length: precedingDays }, (_, i) =>
    addDays(firstDayOfMonth, -precedingDays + i)
  );

  // Days of the week (starting from Monday)
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Group events by day
  const eventsByDay = events.reduce((acc, event) => {
    if (!acc[event.day]) {
      acc[event.day] = [];
    }
    acc[event.day].push(event);
    return acc;
  }, {} as Record<number, CalendarEvent[]>);

  // Calculate all days to display (including previous and next month days)
  const allCalendarDays = [...prevMonthDays, ...daysInMonth];

  // Add days from next month to fill the grid
  const totalDaysShown = Math.ceil(allCalendarDays.length / 7) * 7;
  const remainingDays = totalDaysShown - allCalendarDays.length;

  const nextMonthDays = Array.from({ length: remainingDays }, (_, i) =>
    addDays(lastDayOfMonth, i + 1)
  );

  const allDays = [...allCalendarDays, ...nextMonthDays];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2">Loading schedules...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center text-red-500">
              <p>Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            {/* Calendar Headers */}
            <div className="grid grid-cols-7">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-xs md:text-sm font-medium border-b border-r last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7">
              {allDays.map((date, index) => {
                const day = date.getDate();
                const isCurrentMonth =
                  date.getMonth() === currentMonth.getMonth();
                const dayEvents = eventsByDay[day] || [];
                const displayEvents = dayEvents.slice(0, 3);
                const hasMoreEvents = dayEvents.length > 3;

                return (
                  <div
                    key={index}
                    className={`min-h-32 border-b border-r last:border-r-0 p-1 relative ${
                      !isCurrentMonth ? "bg-gray-50" : ""
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-6 h-6 flex items-center justify-center rounded-full text-xs md:text-sm ${
                        !isCurrentMonth ? "text-gray-400" : "text-gray-800"
                      }`}
                    >
                      {day}
                    </div>
                    <div className="mt-6 space-y-1">
                      {/* Events for this day */}
                      {isCurrentMonth &&
                        displayEvents.map((event) => (
                          <div
                            key={event.id}
                            className="bg-white border rounded p-1 text-xs shadow-sm hover:shadow-md cursor-pointer"
                          >
                            {event.time && (
                              <div className="text-gray-500 text-xs">
                                {event.time}
                              </div>
                            )}
                            <div className="truncate font-medium">
                              {event.title}
                            </div>
                          </div>
                        ))}
                      {/* "More" indicator */}
                      {isCurrentMonth && hasMoreEvents && (
                        <div className="text-xs text-gray-500 pl-1 flex items-center gap-1">
                          <MoreHorizontal size={12} />
                          {dayEvents.length - 3} more...
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
