"use client";

import type React from "react";

import { useRef, useEffect } from "react";
import { Monitor, Utensils, Dumbbell, Flower } from "lucide-react";

type Event = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  icon: React.ReactNode;
  day: number; // 0-6 for the day of the week
};

export function CalendarGrid() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Generate all 24 hours in AM/PM format
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12;
    const ampm = i < 12 ? "am" : "pm";
    return `${hour.toString().padStart(2, "0")}:00 ${ampm}`;
  });

  // Generate 7 days starting from the selected date
  const days = [
    "Monday, 7 Mar",
    "Tuesday, 8 Mar",
    "Wednesday, 9 Mar",
    "Thursday, 10 Mar",
    "Friday, 11 Mar",
    "Saturday, 12 Mar",
    "Sunday, 13 Mar",
  ];

  // Sample events data
  const events: Event[] = [
    {
      id: "2",
      title: "Lunch",
      startTime: "01:00 pm",
      endTime: "01:30 pm",
      description: "",
      icon: <Utensils className="h-5 w-5 text-amber-500" />,
      day: 0,
    },
    {
      id: "3",
      title: "Workout",
      startTime: "02:00 pm",
      endTime: "04:00 pm",
      description:
        "Automate trades based on user-defined criteria using AI algorithms.",
      icon: <Dumbbell className="h-5 w-5 text-cyan-500" />,
      day: 0,
    },
    {
      id: "4",
      title: "Watering Plant",
      startTime: "04:00 pm",
      endTime: "05:00 pm",
      description:
        "Automate trades based on user-defined criteria using AI algorithms.",
      icon: <Flower className="h-5 w-5 text-green-500" />,
      day: 0,
    },
    // Additional events for other days
    {
      id: "5",
      title: "Team Meeting",
      startTime: "10:00 am",
      endTime: "11:00 am",
      description: "Weekly team sync-up meeting.",
      icon: <Monitor className="h-5 w-5 text-indigo-500" />,
      day: 1,
    },
    {
      id: "6",
      title: "Gym Session",
      startTime: "06:00 pm",
      endTime: "07:30 pm",
      description: "Cardio and strength training.",
      icon: <Dumbbell className="h-5 w-5 text-cyan-500" />,
      day: 2,
    },
  ];

  // Scroll to 8:00 am by default when component mounts
  useEffect(() => {
    if (scrollContainerRef.current) {
      // Scroll to 8:00 am (8 hours * height of each hour cell)
      scrollContainerRef.current.scrollTop = 8 * 128; // 8 hours * 128px per hour
    }
  }, []);

  // Helper function to convert time string to position
  const getTimePosition = (timeString: string) => {
    const [time, period] = timeString.split(" ");
    const [hourStr] = time.split(":");
    let hour = Number.parseInt(hourStr);

    // Convert to 24-hour format for calculation
    if (period === "pm" && hour !== 12) hour += 12;
    if (period === "am" && hour === 12) hour = 0;

    return hour * 128; // 128px per hour
  };

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-auto bg-zinc-100"
      style={{ height: "calc(100vh - 70px)" }} // Adjust based on header height
    >
      <div className="grid grid-cols-[auto_repeat(7,minmax(250px,1fr))] min-w-full bg-zinc-100">
        {/* Fixed time column */}
        <div className="sticky left-0 z-20 min-w-[60px] bg-background border-r">
          <div className="h-10 border-b"></div>{" "}
          {/* Empty cell for the day header */}
          {timeSlots.map((time, index) => (
            <div
              key={index}
              className="h-32 flex items-start justify-end p-1 text-xs font-medium text-gray-800 "
            >
              {time}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((day, dayIndex) => (
          <div key={dayIndex} className="min-w-[250px] border-r ">
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

              {/* Events */}
              {events
                .filter((event) => event.day === dayIndex)
                .map((event) => {
                  // Calculate position based on time
                  const startPosition = getTimePosition(event.startTime);

                  // Calculate height based on duration
                  const endPosition = getTimePosition(event.endTime);
                  const height = endPosition - startPosition;

                  return (
                    <div
                      key={event.id}
                      className="absolute left-2 right-2 bg-white rounded-lg border p-3 shadow-sm"
                      style={{
                        top: `${startPosition}px`,
                        height: `${height}px`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-shrink-0 border p-2 rounded-md">
                          {event.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-black">
                            {event.title}
                          </h3>
                          <p className="text-xs font-medium text-gray-500">
                            {event.startTime} - {event.endTime}
                          </p>
                        </div>
                      </div>
                      {event.description && (
                        <div className="mt-2">
                          <p className="text-xs text-black font-medium">Desc</p>
                          <p className="text-[10px] text-gray-500">
                            {event.description}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
