"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const [refreshKey, setRefreshKey] = useState(0);

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

  // Tooltip text based on active view
  const getPreviousTooltip = () => {
    return activeView === "week" ? "Minggu sebelumnya" : "Bulan sebelumnya";
  };

  const getNextTooltip = () => {
    return activeView === "week" ? "Minggu berikutnya" : "Bulan berikutnya";
  };

  // Callback for refreshing calendar after adding event
  const handleEventAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full w-full">
        <Tabs
          defaultValue="week"
          className="flex flex-col h-full w-full"
          onValueChange={(value) => setActiveView(value as "week" | "month")}
        >
          <div className="border-b flex justify-between items-center w-full pb-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsList className="bg-transparent border border-primary">
                  <TabsTrigger value="week">Minggu</TabsTrigger>
                  <TabsTrigger value="month">Bulan</TabsTrigger>
                </TabsList>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium">
                <span>Pilih tampilan kalender</span>
              </TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-3 text-sm">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={goToPrevious}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronLeftCircle className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="font-medium">
                  <span>{getPreviousTooltip()}</span>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="md:flex items-center gap-2 font-medium hidden cursor-help">
                    <Calendar size={18} />
                    {dateDisplay()}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="font-medium">
                  <div className="flex flex-col text-center">
                    <span className="font-semibold">Periode Saat Ini</span>
                    <span className="text-xs text-muted-foreground">
                      {activeView === "week"
                        ? "Tampilan minggu yang sedang ditampilkan"
                        : "Tampilan bulan yang sedang ditampilkan"}
                    </span>
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={goToNext}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronRightCircle className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="font-medium">
                  <span>{getNextTooltip()}</span>
                </TooltipContent>
              </Tooltip>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <AddEvent onEventAdded={handleEventAdded} />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium">
                <div className="flex flex-col text-center">
                  <span className="font-semibold">Tambah Jadwal</span>
                  <span className="text-xs text-muted-foreground">
                    Buat jadwal baru
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>

          <TabsContent value="week" className="flex-1 overflow-hidden">
            <CalendarGrid currentWeekStart={currentDate} key={refreshKey} />
          </TabsContent>

          <TabsContent value="month" className="flex-1 overflow-auto">
            <CalendarGridMonth currentMonth={currentDate} key={refreshKey} />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
