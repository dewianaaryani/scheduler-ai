"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarGrid } from "./calendar-grid";
import CalendarGridMonth from "./calendar-grid-month";
import { ChevronLeftCircle, ChevronRightCircle, Calendar } from "lucide-react";
import { format, addDays, addMonths } from "date-fns";
import { id } from "date-fns/locale";
import { AddEvent } from "./addEvent";

export function CalendarComponent() {
  // Centralized date state for both views
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState<"week" | "month">("week");

  // Navigation functions
  const goToPrevious = () => {
    setCurrentDate((prevDate) => {
      if (activeView === "week") {
        return addDays(prevDate, -7);
      } else {
        return addMonths(prevDate, -1);
      }
    });
  };

  const goToNext = () => {
    setCurrentDate((prevDate) => {
      if (activeView === "week") {
        return addDays(prevDate, 7);
      } else {
        return addMonths(prevDate, 1);
      }
    });
  };

  // Date display formatting based on view
  const dateDisplay = () => {
    if (activeView === "week") {
      // const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekStart = currentDate;
      return `${format(weekStart, "d MMMM", { locale: id })} - ${format(
        addDays(weekStart, 6),
        "d MMMM yyyy",
        { locale: id }
      )}`;
    } else {
      return format(currentDate, "MMMM yyyy", { locale: id });
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <Tabs
        defaultValue="week"
        className="flex flex-col h-full w-full"
        onValueChange={(value) => setActiveView(value as "week" | "month")}
      >
        <div className="border-b flex justify-between items-center w-full pb-2">
          <TabsList className="bg-transparent border border-primary">
            <TabsTrigger value="week">Minggu</TabsTrigger>
            <TabsTrigger value="month">Bulan</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3 text-sm">
            <button
              onClick={goToPrevious}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeftCircle className="h-5 w-5" />
            </button>

            <div className="md:flex items-center gap-2 font-medium hidden">
              <Calendar size={18} />
              {dateDisplay()}
            </div>

            <button
              onClick={goToNext}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRightCircle className="h-5 w-5" />
            </button>
          </div>

          <AddEvent />
        </div>

        <TabsContent value="week" className="flex-1 overflow-hidden">
          <CalendarGrid currentWeekStart={currentDate} />
        </TabsContent>

        <TabsContent value="month" className="flex-1 overflow-auto">
          <CalendarGridMonth currentMonth={currentDate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
