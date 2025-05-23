"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, Loader, PlusCircle } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Goal } from "@/app/lib/types";

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
  const router = useRouter();

  const handleEmptyStateClick = () => {
    if (activeFilter === "ABANDONED" || activeFilter === "COMPLETED") {
      setActiveFilter("ACTIVE");
      router.push("/goals");
    } else {
      router.push("/ai");
    }
  };

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
        buttonText: "View Ongoing",
      },
      ABANDONED: {
        title: "No abandoned goals",
        description: "Goals you abandon will be shown here",
        buttonText: "View Ongoing",
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
        <Button onClick={handleEmptyStateClick}>
          {currentMessage.buttonText}
          <ArrowUpRight size={16} className="" />
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-5 bg-white shadow-lg animate-pulse flex flex-col space-y-4"
              >
                {/* Header with emoji and title */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="bg-gray-200 w-10 h-10 rounded-full mr-3" />
                    <div className="h-4 bg-gray-200 rounded w-32" />
                  </div>
                  <div className="w-6 h-6 border border-gray-300 rounded-full" />
                </div>

                {/* Description section */}
                <div>
                  <div className="h-3 bg-gray-200 rounded w-20 mb-1" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6 mt-1" />
                </div>

                {/* Start Date */}
                <div>
                  <div className="h-3 bg-gray-200 rounded w-24 mb-1" />
                  <div className="h-4 bg-gray-200 rounded w-32" />
                </div>

                {/* End Date */}
                <div>
                  <div className="h-3 bg-gray-200 rounded w-24 mb-1" />
                  <div className="h-4 bg-gray-200 rounded w-32" />
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="h-3 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-12" />
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-gray-300 h-2 rounded-full w-1/2" />
                  </div>
                </div>
              </div>
            ))}
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
                    <Link href={`/goals/${goal.id}/`}>
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
                  <div className="text-sm">{formatDate(goal.startDate)}</div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-500">End Date</div>
                  <div className="text-sm">{formatDate(goal.endDate)}</div>
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
