"use client";

import { useState, useEffect } from "react";
import { Goal } from "@/app/lib/types";

interface UseGoalsOptions {
  status?: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
  limit?: number;
  offset?: number;
}

export function useGoals(options: UseGoalsOptions = {}) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: options.limit || 50,
    offset: options.offset || 0,
    hasMore: false,
  });

  useEffect(() => {
    async function fetchGoals() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (options.status) params.append('status', options.status);
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.offset) params.append('offset', options.offset.toString());

        const response = await fetch(`/api/goals/list?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch goals');
        }

        const data = await response.json();
        if (data.success) {
          setGoals(data.data);
          setPagination(data.pagination);
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Error fetching goals:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchGoals();
  }, [options.status, options.limit, options.offset]);

  const refetch = () => {
    setGoals([]);
    setLoading(true);
  };

  return { 
    goals, 
    loading, 
    error, 
    pagination,
    refetch
  };
}