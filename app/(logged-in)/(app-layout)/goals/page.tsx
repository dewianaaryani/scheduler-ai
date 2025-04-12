"use client";

import { useState } from "react";
import {
  DollarSign,
  ChevronRight,
  RotateCw,
  ArrowUpRight,
  Loader,
} from "lucide-react";

// Types
interface Goal {
  id: number;
  category: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
}

export default function GoalsPage() {
  // Filter states
  const [activeFilter, setActiveFilter] = useState<
    "ongoing" | "finished" | "expired"
  >("ongoing");

  // Sample goals data
  const [goals] = useState<Goal[]>([
    {
      id: 1,
      category: "Finance",
      title: "Saving 300000 for house",
      description: "Saving for buying house 1000000 every Week",
      startDate: "Thru, 28 March 2024",
      endDate: "Thru, 28 March 2024",
      progress: 60,
    },
    {
      id: 2,
      category: "Finance",
      title: "Saving 300000 for house",
      description: "Saving for buying house 1000000 every Week",
      startDate: "Thru, 28 March 2024",
      endDate: "Thru, 28 March 2024",
      progress: 60,
    },
    {
      id: 3,
      category: "Finance",
      title: "Saving 300000 for house",
      description: "Saving for buying house 1000000 every Week",
      startDate: "Thru, 28 March 2024",
      endDate: "Thru, 28 March 2024",
      progress: 60,
    },
    {
      id: 4,
      category: "Finance",
      title: "Saving 300000 for house",
      description: "Saving for buying house 1000000 every Week",
      startDate: "Thru, 28 March 2024",
      endDate: "Thru, 28 March 2024",
      progress: 60,
    },
  ]);

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
            onClick={() => setActiveFilter("expired")}
            className={`px-4 py-2 text-sm rounded-md ${
              activeFilter === "expired"
                ? "bg-purple-100 text-purple-800 font-medium"
                : "text-gray-600"
            }`}
          >
            Expired
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
                <div className="flex items-center">
                  <div className="bg-green-100 text-green-600 p-2 rounded-full mr-3">
                    <DollarSign size={15} />
                  </div>
                  <div>
                    {/* <div className="text-gray-500 text-sm">{goal.category}</div> */}
                    <div className="font-semibold text-md text-wrap max-w-xs">
                      {goal.title}
                    </div>
                  </div>
                </div>
                <button className="rounded-full p-1 border border-primary">
                  <ArrowUpRight size={16} className="text-gray-400" />
                </button>
              </div>

              {/* Description */}
              <div className="mb-3">
                <div className="text-xs text-gray-500">Desc</div>
                <div className="text-sm">{goal.description}</div>
              </div>

              {/* Dates */}
              <div className="mb-3">
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
                    {goal.progress}%
                    <Loader size={14} className="ml-1 text-gray-400" />
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${goal.progress}%` }}
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
