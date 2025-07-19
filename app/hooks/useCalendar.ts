"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Schedule } from "@/app/lib/types";

interface UseCalendarOptions {
  startDate: Date;
  endDate: Date;
  goalId?: string;
  status?: string;
}

export function useCalendar(options: UseCalendarOptions) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Track if component is mounted to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use a more hydration-safe date formatting approach
  const startDateStr = useMemo(() => {
    if (!isMounted) return "";
    // Use toISOString and slice to get YYYY-MM-DD format consistently
    const year = options.startDate.getFullYear();
    const month = String(options.startDate.getMonth() + 1).padStart(2, "0");
    const day = String(options.startDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [options.startDate, isMounted]);

  const endDateStr = useMemo(() => {
    if (!isMounted) return "";
    const year = options.endDate.getFullYear();
    const month = String(options.endDate.getMonth() + 1).padStart(2, "0");
    const day = String(options.endDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [options.endDate, isMounted]);

  useEffect(() => {
    // Don't fetch until component is mounted
    if (!isMounted || !startDateStr || !endDateStr) return;

    async function fetchSchedules() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          startDate: startDateStr,
          endDate: endDateStr,
        });

        if (options.goalId) params.append("goalId", options.goalId);
        if (options.status) params.append("status", options.status);

        const response = await fetch(
          `/api/calendar/schedules?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch schedules");
        }

        const data = await response.json();
        if (data.success) {
          setSchedules(data.data);
        } else {
          throw new Error(data.error || "Unknown error");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        console.error("Error fetching schedules:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSchedules();
  }, [startDateStr, endDateStr, options.goalId, options.status, isMounted]);

  const refetch = useCallback(async () => {
    if (!isMounted || !startDateStr || !endDateStr) return;

    setError(null);
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        startDate: startDateStr,
        endDate: endDateStr,
      });

      if (options.goalId) {
        queryParams.set("goalId", options.goalId);
      }
      if (options.status) {
        queryParams.set("status", options.status);
      }

      const response = await fetch(
        `/api/calendar/schedules?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Fix: Use consistent data structure
      if (data.success) {
        setSchedules(data.data || []);
      } else {
        setSchedules(data.schedules || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("Error refetching schedules:", err);
    } finally {
      setLoading(false);
    }
  }, [startDateStr, endDateStr, options.goalId, options.status, isMounted]);

  return {
    schedules,
    loading,
    error,
    refetch,
  };
}
