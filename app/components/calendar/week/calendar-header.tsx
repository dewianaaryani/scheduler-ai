"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { AddEventDialog } from "../add-event-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="flex items-center justify-between p-4 border-b ">
      <div className="flex items-center gap-4">
        <Tabs defaultValue="week" className="">
          <TabsList className="bg-transparent border border-primary">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
          <TabsContent value="week">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="month">Change your password here.</TabsContent>
        </Tabs>

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
