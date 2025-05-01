"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, Loader, PlusCircle } from "lucide-react";
import Link from "next/link";

// Types
interface Goal {
  id: number;
  category: string;
  title: string;
  description: string;
  emoji: string;
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
  const [loading, setLoading] = useState(true);

  // Fetch goals from API
  useEffect(() => {
    async function fetchGoals() {
      setLoading(true);
      try {
        const response = await fetch("/api/goals/");
        const data = await response.json();
        setGoals(data);
      } catch (error) {
        console.error("Error fetching goals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGoals();
  }, []);

  // Filter goals based on active filter
  const filteredGoals = goals.filter((goal) => goal.status === activeFilter);

  // Empty state component
  const EmptyState = () => {
    const emptyStateMessages = {
      ACTIVE: {
        title: "No ongoing goals yet",
        description: "Create your first goal to start tracking your progress",
        buttonText: "Create Goal",
      },
      COMPLETED: {
        title: "No completed goals",
        description: "Once you complete goals, they'll appear here",
        buttonText: "Create Goal",
      },
      ABANDONED: {
        title: "No abandoned goals",
        description: "Goals you abandon will be shown here",
        buttonText: "View Ongoing Goals",
      },
    };

    const currentMessage = emptyStateMessages[activeFilter];

    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="bg-purple-50 p-6 rounded-full mb-4">
          <PlusCircle size={48} className="text-purple-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          {currentMessage.title}
        </h3>
        <p className="text-gray-500 mb-6 max-w-md">
          {currentMessage.description}
        </p>
        <Link
          href={activeFilter === "ABANDONED" ? "/goals" : "/goals/new"}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          {currentMessage.buttonText}
          <ArrowUpRight size={16} className="ml-2" />
        </Link>
      </div>
    );
  };

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

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader size={24} className="animate-spin text-purple-600" />
          </div>
        ) : filteredGoals.length === 0 ? (
          <EmptyState />
        ) : (
          /* Goals grid */
          <div className="justify-between grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGoals.map((goal) => (
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
        )}
      </div>
    </div>
  );
}
