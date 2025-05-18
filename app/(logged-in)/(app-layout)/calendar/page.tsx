import { CalendarComponent } from "@/app/components/calendar/week/calendar-component";
import React from "react";

export default function page() {
  return (
    <div className="flex h-full flex-col overflow-hidden w-full ">
      <CalendarComponent />
      {/* <CalendarGrid /> */}
    </div>
  );
}
