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
import ScheduleDetailPopup from "../../schedule-detail-popup";
import { Schedule } from "@/app/lib/types";
import { StatusBorder } from "@/app/lib/utils";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalendar } from "@/app/hooks/useCalendar";
import { useStableCalendarOptions } from "@/app/hooks/useStableCalendarOptions";

interface CalendarGridProps {
  currentWeekStart: Date;
}

export function CalendarGrid({ currentWeekStart }: CalendarGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Use stable calendar options to prevent infinite re-renders
  const stableOptions = useStableCalendarOptions({
    startDate: currentWeekStart,
    endDate: addDays(currentWeekStart, 6),
  });
  
  const { schedules, loading: isLoading, error } = useCalendar(stableOptions);

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

  // Schedules are now fetched by the useCalendar hook

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
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto bg-zinc-100"
      >
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
                            <TooltipTrigger
                              className={`group bg-white rounded-lg border h-full w-full flex flex-col justify-start items-start p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${StatusBorder(
                                schedule.status
                              )} hover:shadow-md hover:shadow-violet-100`}
                            >
                              <div
                                className="flex flex-col items-start gap-2 mb-1 h-full w-full cursor-pointer"
                                onClick={() => {
                                  setSelectedSchedule(schedule);
                                  setIsDetailOpen(true);
                                }}
                              >
                                <div className="flex items-center gap-2 mb-1 w-full">
                                  <div className="flex-shrink-0 border border-gray-200 p-2 rounded-md shadow-sm bg-white group-hover:border-violet-200 group-hover:shadow-md transition-all duration-200">
                                    <p className="text-md">{schedule.emoji}</p>
                                  </div>
                                  <div className="flex flex-col items-start flex-1 min-w-0">
                                    <h3 className="font-semibold text-xs text-black line-clamp-1 text-left group-hover:text-violet-800 transition-colors duration-200">
                                      {schedule.title}
                                    </h3>
                                    <p className="text-xs font-medium text-gray-500 group-hover:text-violet-600 transition-colors duration-200">
                                      {formatToAmPm(startTime)} -{" "}
                                      {formatToAmPm(endTime)}
                                    </p>
                                  </div>
                                </div>
                                {schedule.description && height > 100 && (
                                  <div className="text-left px-1 w-full">
                                    <p className="text-xs text-black font-medium group-hover:text-violet-800 transition-colors duration-200">
                                      Desc
                                    </p>
                                    <p className="text-[10px] text-gray-500 line-clamp-2 group-hover:text-violet-600 transition-colors duration-200">
                                      {schedule.description}
                                    </p>
                                  </div>
                                )}
                              </div>
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
      </div>
      {selectedSchedule && (
        <ScheduleDetailPopup
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          schedule={selectedSchedule}
        />
      )}
    </div>
  );
}
