import { CalendarGrid } from "@/app/components/calendar/week/calendar-grid";
import { CalendarHeader } from "@/app/components/calendar/week/calendar-header";
import React from "react";

export default function page() {
  return (
    <div className="flex h-full flex-col overflow-hidden w-full ">
      <CalendarHeader />
      <CalendarGrid />
    </div>
  );
}
