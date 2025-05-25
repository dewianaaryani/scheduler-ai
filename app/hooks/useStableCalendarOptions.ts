"use client";

import { useMemo } from "react";

interface CalendarOptions {
  startDate: Date;
  endDate: Date;
  goalId?: string;
  status?: string;
}

/**
 * Hook to create stable calendar options that won't change reference on every render
 * This prevents infinite re-renders in useCalendar by using date timestamps for comparison
 */
export function useStableCalendarOptions(options: CalendarOptions): CalendarOptions {
  // Extract date timestamps for stable comparison
  const startTime = options.startDate.getTime();
  const endTime = options.endDate.getTime();

  return useMemo(() => ({
    startDate: options.startDate,
    endDate: options.endDate,
    goalId: options.goalId,
    status: options.status,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [
    startTime,        // Use timestamp for stable date comparison
    endTime,          // Use timestamp for stable date comparison
    options.goalId,
    options.status,
  ]);
}