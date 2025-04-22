"use client";

import { useState, useEffect } from "react";
import { DollarSign, ArrowUpRight, Loader } from "lucide-react";
import Link from "next/link";
import { Icon } from "@/app/components/Icon";

// Types
interface Goal {
  id: number;
  category: string;
  title: string;
  description: string;
  icon: string; // <- icon name as a string!
  startDate: string;
  endDate: string;
  // progress: number;
}

export default function GoalsPage() {
  // Filter states
  const [activeFilter, setActiveFilter] = useState<
    "ongoing" | "finished" | "abandoned"
  >("ongoing");
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
            onClick={() => setActiveFilter("ongoing")}
            className={`px-4 py-2 text-sm rounded-md ${
              activeFilter === "ongoing"
                ? "bg-purple-100 text-purple-800 font-medium"
                : "text-gray-600"
            }`}
          >
            Ongoing
          </button>
          <button
            onClick={() => setActiveFilter("finished")}
            className={`px-4 py-2 text-sm rounded-md ${
              activeFilter === "finished"
                ? "bg-purple-100 text-purple-800 font-medium"
                : "text-gray-600"
            }`}
          >
            Finished
          </button>
          <button
            onClick={() => setActiveFilter("abandoned")}
            className={`px-4 py-2 text-sm rounded-md ${
              activeFilter === "abandoned"
                ? "bg-purple-100 text-purple-800 font-medium"
                : "text-gray-600"
            }`}
          >
            Abandoned
          </button>
        </div>

        {/* Goals grid */}
        <div className="justify-between grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="border border-gray-200 rounded-lg p-5 bg-white shadow-lg flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center mb-1">
                  <div className="bg-green-100 text-green-600 p-2 rounded-full mr-3">
                    <Icon iconName={goal.icon} />
                    <DollarSign size={15} />
                  </div>
                  <div>
                    <div className="font-semibold text-md text-wrap max-w-xs">
                      {goal.title}
                    </div>
                  </div>
                </div>
                <button className="rounded-full p-1 border border-primary">
                  <Link href={`/goals/${goal.id}`}>
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
                    100%
                    <Loader size={14} className="ml-1 text-gray-400" />
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: 100 }}
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
