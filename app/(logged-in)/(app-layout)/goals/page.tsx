"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, Loader } from "lucide-react";
import Link from "next/link";

// Types
interface Goal {
  id: number;
  category: string;
  title: string;
  description: string;
  emoji: string; //
  startDate: string;
  endDate: string;
  percentComplete: number;
  status: "ACTIVE" | "COMPLETED" | "ABANDONED";
}

export default function GoalsPage() {
  // Filter states
  const [activeFilter, setActiveFilter] = useState<
    "ACTIVE" | "COMPLETED" | "ABANDONED"
  >("ACTIVE");
  const [goals, setGoals] = useState<Goal[]>([]);

  // Fetch goals from API
  useEffect(() => {
    async function fetchGoals() {
      const response = await fetch("/api/goals/");
      const data = await response.json();
      setGoals(data);
    }

    fetchGoals();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4">
        {/* Filter tabs */}
        <div className="inline-flex rounded-md border border-purple-200 p-1 mb-6">
          <button
            onClick={() => setActiveFilter("ACTIVE")}
            className={`px-4 py-2 text-sm rounded-md ${
              activeFilter === "ACTIVE"
                ? "bg-purple-100 text-purple-800 font-medium"
                : "text-gray-600"
            }`}
          >
            Ongoing
          </button>
          <button
            onClick={() => setActiveFilter("COMPLETED")}
            className={`px-4 py-2 text-sm rounded-md ${
              activeFilter === "COMPLETED"
                ? "bg-purple-100 text-purple-800 font-medium"
                : "text-gray-600"
            }`}
          >
            Finished
          </button>
          <button
            onClick={() => setActiveFilter("ABANDONED")}
            className={`px-4 py-2 text-sm rounded-md ${
              activeFilter === "ABANDONED"
                ? "bg-purple-100 text-purple-800 font-medium"
                : "text-gray-600"
            }`}
          >
            Abandoned
          </button>
        </div>

        {/* Goals grid */}
        <div className="justify-between grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals
            .filter((goal) => goal.status === activeFilter)
            .map((goal) => (
              <div
                key={goal.id}
                className="border border-gray-200 rounded-lg p-5 bg-white shadow-lg flex flex-col"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center mb-1">
                    <div className="bg-green-100 text-green-600 p-2 rounded-full mr-3">
                      {goal.emoji}
                    </div>
                    <div>
                      <div className="font-semibold text-md text-wrap max-w-xs">
                        {goal.title}
                      </div>
                    </div>
                  </div>
                  <button className="rounded-full p-1 border border-primary">
                    <Link href={`/goals/${goal.id}/overview`}>
                      <ArrowUpRight size={16} className="text-gray-400" />
                    </Link>
                  </button>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500">Desc</div>
                  <div className="text-sm">{goal.description}</div>
                </div>

                {/* Dates */}
                <div className="mb-1">
                  <div className="text-xs text-gray-500">Start Date</div>
                  <div className="text-sm">{goal.startDate}</div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-500">End Date</div>
                  <div className="text-sm">{goal.endDate}</div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-xs text-gray-500">Progress</div>
                    <div className="flex items-center text-sm">
                      {goal.percentComplete}%
                      <Loader size={14} className="ml-1 text-gray-400" />
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${goal.percentComplete}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
