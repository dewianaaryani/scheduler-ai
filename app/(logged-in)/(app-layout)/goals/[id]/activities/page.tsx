"use client";
import { Goal } from "@/app/lib/types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { NotebookPenIcon } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

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
      <div className="space-y-4">
        {/* Skeleton for the heading */}
        <Skeleton className="h-8 w-1/2" />
        {/* Skeleton for the description */}
        <Skeleton className="h-4 w-3/4" />
        {/* Skeleton for the timeline and other parts */}
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-12 w-3/4" />
        {/* Add more skeletons for other parts as needed */}
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
    <div className="container mx-auto">
      <h1 className="text-xl font-semibold">Schedule Acitivies</h1>
      <p className="text-gray-500  mb-8">
        Schedule your activities and track your progress.
      </p>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-6 bottom-0 w-[1px] bg-violet-200" />

        {/* Schedule items */}
        <div className="space-y-8">
          {goal.schedules.map((item, index) => (
            <div key={index} className="relative pl-12">
              {/* Timeline dot */}
              <div className="absolute left-0  w-8 h-8 rounded-full border-4 border-violet-100 bg-violet-200 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-violet-500" />
              </div>

              {/* Date and time */}
              <div className="text-sm text-gray-600 mb-2">
                {item.startedTime} - {item.endTime}
              </div>

              {/* Content card */}
              <div className="border rounded-lg p-4">
                <Link href="">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3
                      className={`text-md font-medium ${
                        item.status === "COMPLETED"
                          ? "text-primary"
                          : "text-gray-700"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <Badge
                      className={`${
                        item.status === "COMPLETED"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gray-500 hover:bg-gray-600"
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Desc</p>
                    <p className="text-sm text-gray-700">{item.description}</p>
                  </div>
                  {item.notes && (
                    <div className="flex items-start gap-2 mt-2">
                      <NotebookPenIcon
                        className="size-9 md:size-4"
                        fill="orange"
                      />
                      <p className="text-sm text-gray-700">{item?.notes}</p>
                    </div>
                  )}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
