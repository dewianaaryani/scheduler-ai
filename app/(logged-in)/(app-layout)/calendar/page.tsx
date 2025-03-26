"use client";

import { useState } from "react";
import { Plus, Laptop, Utensils, Dumbbell, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddEventForm } from "./add-event-form";

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  icon: "laptop" | "utensils" | "dumbbell" | "leaf";
  column: number;
}

export default function Calendar() {
  const [view, setView] = useState<"week" | "month">("week");
  const [date, setDate] = useState<string>("8 Mar 25");
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Meeting With Client",
      startTime: "01:00 pm",
      endTime: "02:00 pm",
      description:
        "Automate trades based on user-defined criteria using AI algorithms.",
      icon: "laptop",
      column: 0,
    },
    {
      id: "2",
      title: "Lunch",
      startTime: "01:00 pm",
      endTime: "01:30 pm",
      description: "",
      icon: "utensils",
      column: 1,
    },
    {
      id: "3",
      title: "Workout",
      startTime: "02:00 pm",
      endTime: "04:00 pm",
      description:
        "Automate trades based on user-defined criteria using AI algorithms.",
      icon: "dumbbell",
      column: 0,
    },
    {
      id: "4",
      title: "Watering Plant",
      startTime: "01:00 pm",
      endTime: "02:00 pm",
      description:
        "Automate trades based on user-defined criteria using AI algorithms.",
      icon: "leaf",
      column: 0,
    },
  ]);

  const timeSlots = [
    "01:00 pm",
    "02:00 pm",
    "03:00 pm",
    "04:00 pm",
    "05:00 pm",
  ];

  const getEventIcon = (iconName: string) => {
    switch (iconName) {
      case "laptop":
        return <Laptop className="h-5 w-5 text-purple-500" />;
      case "utensils":
        return <Utensils className="h-5 w-5 text-amber-500" />;
      case "dumbbell":
        return <Dumbbell className="h-5 w-5 text-blue-400" />;
      case "leaf":
        return <Leaf className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getEventPosition = (event: Event) => {
    const startIndex = timeSlots.findIndex((time) => time === event.startTime);
    const endIndex = timeSlots.findIndex((time) => time === event.endTime);

    // If event is "Watering Plant", position it at 05:00 pm
    if (event.id === "4") {
      return {
        gridRowStart: 5,
        gridRowEnd: 6,
      };
    }

    return {
      gridRowStart: startIndex + 1,
      gridRowEnd: endIndex + 1 || startIndex + 2,
    };
  };

  //   const handleAddEvent = (newEvent: Omit<Event, "id">) => {
  //     setEvents([...events, { ...newEvent, id: Math.random().toString() }]);
  //   };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Tabs defaultValue="week" className="border rounded-md">
          <TabsList className="bg-white">
            <TabsTrigger
              value="week"
              className="data-[state=active]:bg-white"
              onClick={() => setView("week")}
            >
              Week
            </TabsTrigger>
            <TabsTrigger
              value="month"
              className="data-[state=active]:bg-white"
              onClick={() => setView("month")}
            >
              Month
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="text-sm font-medium">{date}</div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-500 hover:bg-purple-600">
              <Plus className="h-4 w-4 mr-1" /> Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            {/* <AddEventForm onAddEvent={handleAddEvent} /> */}
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md w-full">
        <div className="min-w-4xl overflow-x-scroll">
          {/* Header */}
          <div className="grid grid-cols-[100px_repeat(7,1fr)] border-b">
            <div className="p-4 border-r"></div>
            {[0, 1, 2, 3].map((day) => (
              <div
                key={day}
                className="p-4 text-center border-r last:border-r-0"
              >
                Monday, 7 Mar
              </div>
            ))}
          </div>

          {/* Time grid */}
          <div className="grid grid-cols-[100px_repeat(7,1fr)] relative">
            {/* Time labels */}
            <div className="col-span-1">
              {timeSlots.map((time, index) => (
                <div
                  key={index}
                  className="h-32 border-b last:border-b-0 border-r flex items-start justify-end pr-2 pt-2 text-sm"
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            {[0, 1, 2, 3].map((column) => (
              <div key={column} className="col-span-1 relative">
                {timeSlots.map((_, index) => (
                  <div
                    key={index}
                    className="h-32 border-b last:border-b-0 border-r last:border-r-0"
                  ></div>
                ))}

                {/* Events */}
                {events
                  .filter(
                    (event) =>
                      event.column === column ||
                      (column === 0 && event.id === "1") ||
                      (column === 0 && event.id === "3") ||
                      (column === 0 && event.id === "4") ||
                      (column === 1 && event.id === "2")
                  )
                  .map((event) => {
                    const position = getEventPosition(event);
                    return (
                      <div
                        key={event.id}
                        className="absolute left-1 right-1 bg-white border rounded-md p-3 shadow-sm"
                        style={{
                          top: `${(position.gridRowStart - 1) * 8}rem`,
                          height: `${
                            (position.gridRowEnd - position.gridRowStart) * 8 -
                            0.5
                          }rem`,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-shrink-0">
                            {getEventIcon(event.icon)}
                          </div>
                          <div className="font-medium">{event.title}</div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {event.startTime} - {event.endTime}
                        </div>
                        {event.description && (
                          <div className="mt-2">
                            <div className="text-xs font-medium">Desc</div>
                            <div className="text-xs text-gray-600">
                              {event.description}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
