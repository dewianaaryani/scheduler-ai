"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Schedule } from "@/app/lib/types";
import { format } from "date-fns";

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

  // Memoize the formatted dates to prevent infinite loops
  const startDateStr = useMemo(() => format(options.startDate, "yyyy-MM-dd"), [options.startDate]);
  const endDateStr = useMemo(() => format(options.endDate, "yyyy-MM-dd"), [options.endDate]);

  useEffect(() => {
    async function fetchSchedules() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          startDate: startDateStr,
          endDate: endDateStr,
        });

        if (options.goalId) params.append('goalId', options.goalId);
        if (options.status) params.append('status', options.status);

        const response = await fetch(`/api/calendar/schedules?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch schedules');
        }

        const data = await response.json();
        if (data.success) {
          setSchedules(data.data);
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Error fetching schedules:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSchedules();
  }, [startDateStr, endDateStr, options.goalId, options.status]);

  const refetch = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        startDate: startDateStr,
        endDate: endDateStr,
      });

      if (options.goalId) {
        queryParams.set('goalId', options.goalId);
      }
      if (options.status) {
        queryParams.set('status', options.status);
      }

      const response = await fetch(`/api/calendar/schedules?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSchedules(data.schedules || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error refetching schedules:', err);
    } finally {
      setLoading(false);
    }
  }, [startDateStr, endDateStr, options.goalId, options.status]);

  return { 
    schedules, 
    loading, 
    error, 
    refetch
  };
}