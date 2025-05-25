"use client";

import { useState, useEffect } from "react";

interface DashboardData {
  header: {
    today: string;
    user: {
      name: string;
      avatar: string;
      message: string;
    };
  };
  stats: {
    activeGoals: number;
    completedGoals: number;
    todaySchedules: number;
    dailyProgress: number;
  };
  schedules: Array<{
    id: string;
    title: string;
    time: string;
    category: string;
    icon: string;
    hasGoal: boolean;
    status: string;
  }>;
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const res = await fetch("/api/dashboard/combined");
        
        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          throw new Error(json.error || "Unknown error");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const refetch = () => {
    setData(null);
    setLoading(true);
  };

  return { data, loading, error, refetch };
}