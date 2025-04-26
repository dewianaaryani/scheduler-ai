"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Loader } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Schedule {
  id: string;
  title: string;
  description: string;
  startedTime: string;
  endTime: string;
  status: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  emoji: string;
  startDate: string;
  endDate: string;
  status: string;
  progress: number;
  schedules: Schedule[];
}

export default function Page({ params }: { params: { goalId: string } }) {
  const [goal, setGoal] = useState<Goal | null>(null);

  useEffect(() => {
    async function fetchGoal() {
      const res = await fetch(`/api/goals/${params.goalId}`);
      const data = await res.json();
      setGoal(data);
    }
    fetchGoal();
  }, [params.goalId]);

  if (!goal) return <div>Loading...</div>;

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
          <Badge className="bg-violet-500 hover:bg-violet-600">
            {goal.status}
          </Badge>
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
            <span className="font-medium">{goal.progress}%</span>
            <span className="ml-1">
              <Loader />
            </span>
          </div>
        </div>
        <Progress value={goal.progress} className="h-4 bg-gray-100" />
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
                    ? "shadow-md border border-gray-200"
                    : "bg-gray-200"
                } h-6 w-6 rounded-full flex items-center justify-center`}
              >
                <span className="text-xs">{index + 1}</span>
              </div>
              <h3 className="font-medium">{schedule.title}</h3>
              <Badge className={getStatusBadge(schedule.status)}>
                {formatStatus(schedule.status)}
              </Badge>
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

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function getStatusBadge(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-500 hover:bg-green-600";
    case "IN_PROGRESS":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "MISSED":
      return "bg-red-500 hover:bg-red-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
}

function formatStatus(status: string) {
  switch (status) {
    case "COMPLETED":
      return "Completed";
    case "IN_PROGRESS":
      return "In Progress";
    case "MISSED":
      return "Missed";
    default:
      return "None";
  }
}
