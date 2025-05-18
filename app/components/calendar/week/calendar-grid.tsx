"use client";

import type React from "react";
import { useRef, useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DateCounter from "../DateCounter";

// Type for Schedule from Prisma
type Schedule = {
  id: string;
  title: string;
  description: string;
  startedTime: Date;
  endTime: Date;
  emoji: string;
  recurrence: string;
  status: string;
};

interface CalendarGridProps {
  currentWeekStart: Date;
}

export function CalendarGrid({ currentWeekStart }: CalendarGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate all 24 hours in AM/PM format
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12;
    const ampm = i < 12 ? "am" : "pm";
    return `${hour.toString().padStart(2, "0")}:00 ${ampm}`;
  });

  // Generate 7 days starting from the selected date
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(currentWeekStart, i);
    return format(date, "EEEE, d MMM");
  });

  // Format time to AM/PM format
  const formatToAmPm = (date: Date): string => {
    return format(date, "hh:mm a").toLowerCase(); // e.g., "01:00 pm"
  };

  // Fetch schedules from the database
  useEffect(() => {
    async function fetchSchedules() {
      setIsLoading(true);
      try {
        const startDate = format(currentWeekStart, "yyyy-MM-dd");
        const endDate = format(addDays(currentWeekStart, 6), "yyyy-MM-dd");

        const response = await fetch(
          `/api/schedules?startDate=${startDate}&endDate=${endDate}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch schedules");
        }

        const data = await response.json();
        setSchedules(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        console.error("Error fetching schedules:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSchedules();
  }, [currentWeekStart]);

  // Scroll to 8:00 am by default when component mounts
  useEffect(() => {
    if (scrollContainerRef.current) {
      // Scroll to 8:00 am (8 hours * height of each hour cell)
      scrollContainerRef.current.scrollTop = 8 * 128; // 8 hours * 128px per hour
    }
  }, []);

  // Helper function to convert time to position
  const getTimePosition = (time: Date) => {
    const hours = time.getHours();
    const minutes = time.getMinutes() / 60; // Convert minutes to fraction of hour
    return (hours + minutes) * 128; // 128px per hour
  };

  return (
    <div className="flex flex-col h-full">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto bg-zinc-100"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2">Loading schedules...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
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
          <div className="grid grid-cols-[auto_repeat(7,minmax(250px,1fr))] min-w-full bg-zinc-100">
            {/* Fixed time column */}
            <div className="sticky left-0 z-20 min-w-[60px] bg-background border-r">
              <div className="h-10 border-b"></div>{" "}
              {/* Empty cell for the day header */}
              {timeSlots.map((time, index) => (
                <div
                  key={index}
                  className="h-32 flex items-start justify-end p-1 text-xs font-medium text-gray-800"
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {days.map((day, dayIndex) => (
              <div key={dayIndex} className="min-w-[250px] border-r">
                {/* Sticky day header */}
                <div className="sticky top-0 z-10 h-10 pt-2 text-center justify-center items-center border-b text-xs font-medium bg-background">
                  {day}
                </div>

                {/* Time slots */}
                <div className="relative">
                  {timeSlots.map((_, timeIndex) => (
                    <div
                      key={timeIndex}
                      className="h-32 border-b last:border-b-0"
                    ></div>
                  ))}

                  {/* Schedules */}
                  {schedules
                    .filter((schedule) => {
                      const localStart = new Date(schedule.startedTime);
                      const scheduleDate = format(localStart, "yyyy-MM-dd");
                      const currentDate = format(
                        addDays(currentWeekStart, dayIndex),
                        "yyyy-MM-dd"
                      );
                      return scheduleDate === currentDate;
                    })
                    .map((schedule) => {
                      // Parse dates
                      const startTime = new Date(schedule.startedTime);
                      const endTime = new Date(schedule.endTime);

                      // Calculate position based on time
                      const startPosition = getTimePosition(startTime);

                      // Calculate height based on duration
                      const endPosition = getTimePosition(endTime);
                      const height = endPosition - startPosition;

                      return (
                        <div
                          key={schedule.id}
                          className="absolute left-2 right-2 py-2"
                          style={{
                            top: `${startPosition}px`,
                            height: `${height}px`,
                            minHeight: "32px", // Ensure minimum height for very short events
                          }}
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="bg-white rounded-lg border h-full  w-full flex flex-col justify-start items-start p-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="flex-shrink-0 border p-2 rounded-md shadow-md">
                                    <p className="text-md">{schedule.emoji}</p>
                                  </div>
                                  <div className="flex flex-col items-start ">
                                    <h3 className="font-semibold text-xs text-black line-clamp-1 text-left">
                                      {schedule.title}
                                    </h3>
                                    <p className="text-xs font-medium text-gray-500">
                                      {formatToAmPm(startTime)} -{" "}
                                      {formatToAmPm(endTime)}
                                    </p>
                                  </div>
                                </div>
                                {schedule.description &&
                                  height > 100 && ( // TODO: Fix height
                                    <div className=" text-left px-1">
                                      <p className="text-xs text-black font-medium">
                                        Desc
                                      </p>
                                      <p className="text-[10px] text-gray-500 line-clamp-2">
                                        {schedule.description}
                                      </p>
                                      <p></p>
                                    </div>
                                  )}
                              </TooltipTrigger>
                              <TooltipContent align="center" side="bottom">
                                <DateCounter
                                  date={schedule.startedTime}
                                  title={schedule.title}
                                  emoji={schedule.emoji}
                                />
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
