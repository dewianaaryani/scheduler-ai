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
import { Calendar } from "lucide-react";
import { Schedule } from "@/app/lib/types";
import { Button } from "@/components/ui/button";
import { StatusBorder } from "@/app/lib/utils";
import ScheduleDetailPopup from "../../schedule-detail-popup";

type CalendarEvent = {
  id: string;
  title: string;
  day: number;
  time: string;
  description?: string;
  icon?: string;
  // Add the full schedule object for the modal
  schedule: Schedule;
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

  // Add modal state
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showMoreEvents, setShowMoreEvents] = useState<{
    [key: string]: boolean;
  }>({});

  // Function to handle "more" events toggle
  const toggleMoreEvents = (dayKey: string) => {
    setShowMoreEvents((prev) => ({
      ...prev,
      [dayKey]: !prev[dayKey],
    }));
  };

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
          `/api/calendar/schedules?startDate=${startDate}&endDate=${endDate}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch schedules");
        }

        const data = await response.json();
        const schedules: Schedule[] = data.success ? data.data : [];

        // Transform schedules to calendar events
        const formattedEvents = schedules.map((schedule) => {
          const startDate = new Date(schedule.startedTime);

          return {
            id: schedule.id,
            title: schedule.title,
            day: startDate.getDate(),
            time: format(startDate, "h:mm a").toLowerCase(),
            description: schedule.description,
            icon: schedule.emoji,
            schedule: schedule, // Store the full schedule object
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

  // Add refetch function for modal updates
  const refetch = () => {
    // Re-run the fetch logic
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const firstDayOfMonth = startOfMonth(currentMonth);
        const lastDayOfMonth = endOfMonth(currentMonth);

        const startDate = format(firstDayOfMonth, "yyyy-MM-dd");
        const endDate = format(lastDayOfMonth, "yyyy-MM-dd");

        const response = await fetch(
          `/api/calendar/schedules?startDate=${startDate}&endDate=${endDate}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch schedules");
        }

        const data = await response.json();
        const schedules: Schedule[] = data.success ? data.data : [];

        const formattedEvents = schedules.map((schedule) => {
          const startDate = new Date(schedule.startedTime);

          return {
            id: schedule.id,
            title: schedule.title,
            day: startDate.getDate(),
            time: format(startDate, "h:mm a").toLowerCase(),
            description: schedule.description,
            icon: schedule.emoji,
            schedule: schedule,
          };
        });

        setEvents(formattedEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        console.error("Error fetching schedules:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  };

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
  const eventsByDay = events.reduce(
    (acc, event) => {
      if (!acc[event.day]) {
        acc[event.day] = [];
      }
      acc[event.day].push(event);
      return acc;
    },
    {} as Record<number, CalendarEvent[]>
  );

  // Calculate all days to display (including previous and next month days)
  const allCalendarDays = [...prevMonthDays, ...daysInMonth];

  // Add days from next month to fill the grid
  const totalDaysShown = Math.ceil(allCalendarDays.length / 7) * 7;
  const remainingDays = totalDaysShown - allCalendarDays.length;

  const nextMonthDays = Array.from({ length: remainingDays }, (_, i) =>
    addDays(lastDayOfMonth, i + 1)
  );

  const allDays = [...allCalendarDays, ...nextMonthDays];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-200 border-t-violet-600 mx-auto"></div>
            <Calendar className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-violet-600" />
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading your schedule...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-red-500 mb-2">
              <Calendar className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-red-700 font-medium mb-3">
              Failed to load calendar
            </p>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
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
              const dayKey = `${date.getFullYear()}-${date.getMonth()}-${day}`;
              const showingMore = showMoreEvents[dayKey];
              const displayEvents = showingMore
                ? dayEvents
                : dayEvents.slice(0, 3);
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
                          className={`bg-white border rounded p-1 text-xs shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 hover:border-violet-200 ${StatusBorder(event.schedule.status)}`}
                          onClick={() => {
                            setSelectedSchedule(event.schedule);
                            setIsDetailOpen(true);
                          }}
                        >
                          {event.time && (
                            <div className="text-gray-500 text-xs">
                              {event.time}
                            </div>
                          )}
                          <div className="truncate font-medium flex items-center gap-1">
                            {event.icon && <span>{event.icon}</span>}
                            {event.title}
                          </div>
                        </div>
                      ))}
                    {/* "More" indicator */}
                    {isCurrentMonth && hasMoreEvents && !showingMore && (
                      <div
                        className="text-xs text-neutral-500 pl-1 flex items-center gap-1 cursor-pointer hover:text-neutral-900 hover:bg-violet-200 rounded px-1 py-0.5 transition-colors duration-200"
                        onClick={() => toggleMoreEvents(dayKey)}
                      >
                        {dayEvents.length - 3} more...
                      </div>
                    )}
                    {/* "Show less" indicator */}
                    {isCurrentMonth && hasMoreEvents && showingMore && (
                      <div
                        className="text-xs  text-neutral-500pl-1 flex items-center gap-1 cursor-pointer hover:text-neutral-900 hover:bg-violet-200  rounded px-1 py-0.5 transition-colors duration-200"
                        onClick={() => toggleMoreEvents(dayKey)}
                      >
                        Show less
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add the modal popup */}
      {selectedSchedule && (
        <ScheduleDetailPopup
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          schedule={selectedSchedule}
          onUpdate={refetch}
        />
      )}
    </div>
  );
}
