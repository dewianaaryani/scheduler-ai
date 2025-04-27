"use client";

import BadgeStatus from "@/app/components/BadgeStatus";
import { Goal } from "@/app/lib/types";
import { formatDate } from "@/app/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Loader } from "lucide-react";
import React, { use, useEffect, useState } from "react";

// For client components in Next.js App Router, params are already resolved
// No need to use React.use() in client components
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGoal() {
      try {
        setLoading(true);
        const res = await fetch(`/api/goals/${id}`);

        if (!res.ok) {
          throw new Error(`Error fetching goal: ${res.status}`);
        }

        const data = await res.json();
        setGoal(data);
      } catch (err) {
        console.error("Failed to fetch goal:", err);
        setError("Failed to load goal data");
      } finally {
        setLoading(false);
      }
    }

    fetchGoal();
  }, [id]);

  if (loading)
    return (
      <div className="space-y-6">
        {/* Skeleton loading state */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>

        {/* Description Skeleton */}
        <Skeleton className="h-4 w-96" />

        {/* Dates Skeleton */}
        <div className="grid grid-cols-2 gap-4 max-w-sm">
          <div>
            <Skeleton className="h-4 w-28" />
          </div>
          <div>
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        {/* Progress Skeleton */}
        <div className="max-w-sm">
          <Skeleton className="h-4 w-56" />
        </div>

        {/* Steps Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          {[...Array(3)].map((_, index) => (
            <div key={index} className="border rounded-lg p-4">
              <Skeleton className="h-6 w-6 mb-2" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-56" />
            </div>
          ))}
        </div>
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 p-4 border border-red-200 rounded-md">
        {error}
      </div>
    );

  if (!goal)
    return (
      <div className="text-gray-500 p-4 border border-gray-200 rounded-md">
        Goal not found
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 rounded-full p-2 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold">
            {goal.emoji} {goal.title}
          </h1>
          <BadgeStatus status={goal.status} />
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700">{goal.description}</p>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 max-w-sm">
        <div>
          <p className="text-sm text-gray-500">Start Date</p>
          <p className="font-medium">{formatDate(goal.startDate)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">End Date</p>
          <p className="font-medium">{formatDate(goal.endDate)}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-sm">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-500">Progress</p>
          <div className="flex items-center">
            <span className="font-medium">{goal.percentComplete}%</span>
            <span className="ml-1">
              <Loader className="h-4 w-4" />
            </span>
          </div>
        </div>
        <Progress value={goal.percentComplete} className="h-4 bg-gray-100" />
      </div>

      {/* Steps */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Step</h2>

        {goal.schedules.map((schedule, index) => (
          <div key={schedule.id} className="border rounded-lg p-4">
            <div className="flex items-center gap-4 mb-2">
              <div
                className={`${
                  schedule.status === "COMPLETED"
                    ? "shadow-sm border border-green-500"
                    : "shadow-sm border"
                } h-6 w-6 rounded-sm flex items-center justify-center`}
              >
                <span className="text-xs">{index + 1}</span>
              </div>
              <h3 className="font-medium">{schedule.title}</h3>
              <BadgeStatus status={schedule.status} />
            </div>
            <div className="ml-10">
              <p className="text-sm text-gray-500 mb-1">
                {formatDate(schedule.startedTime)} -{" "}
                {formatDate(schedule.endTime)}
              </p>
              <p className="text-sm text-gray-700">{schedule.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
