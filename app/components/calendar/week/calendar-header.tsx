"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { AddEventDialog } from "../add-event-dialog";

export function CalendarHeader() {
  const [view, setView] = useState<"Week" | "Month">("Week");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("8 Mar 25");

  const goToPreviousWeek = () => {
    // In a real app, this would update the date
    console.log("Go to previous week");
  };

  const goToNextWeek = () => {
    // In a real app, this would update the date
    console.log("Go to next week");
  };

  return (
    <div className="flex items-center justify-between  w-[700px] p-4 border-b  top-0 bg-background z-20">
      <div className="flex items-center gap-4">
        <div className="flex space-x-1 rounded-lg border overflow-hidden">
          <button
            className={`px-4 py-2 text-sm ${
              view === "Week"
                ? "bg-primary text-primary-foreground"
                : "bg-background"
            }`}
            onClick={() => setView("Week")}
          >
            Week
          </button>
          <button
            className={`px-4 py-2 text-sm ${
              view === "Month"
                ? "bg-primary text-primary-foreground"
                : "bg-background"
            }`}
            onClick={() => setView("Month")}
          >
            Month
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">{currentDate}</div>
          <Button variant="outline" size="icon" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AddEventDialog />
    </div>
  );
}
