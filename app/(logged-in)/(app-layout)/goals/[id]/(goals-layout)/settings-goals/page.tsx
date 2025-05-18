"use client";

import { GeneralSettingsForm } from "@/app/components/goals/general-settings-form";
import React, { use, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { Goal } from "@/app/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [goal, setGoal] = useState<Goal | null>(null); // Store the goal data
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const router = useRouter();

  useEffect(() => {
    async function fetchGoal() {
      try {
        const res = await fetch(`/api/goals/${id}`);
        if (res.ok) {
          const data = await res.json();
          setGoal(data);
        } else {
          console.error("Failed to fetch goal data");
        }
      } catch (error) {
        console.error("Error fetching goal data:", error);
      }
    }
    fetchGoal();
  }, [id]);

  const handleAbandonGoal = async () => {
    setIsSubmitting(true);
    setIsLoading(true); // Start loading spinner

    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Goal abandoned successfully!");

        // Simulate delay before redirecting to show loading spinner
        setTimeout(() => {
          router.push(`/goals/${id}/overview`);
        }, 1500); // Adjust time delay for the user to see the loading spinner
      } else {
        toast.error("Failed to abandon the goal.");
      }
    } catch (error) {
      console.error("Error abandoning goal:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false); // End loading spinner
    }
  };

  // If goal data is still loading, show skeleton loader
  if (!goal) {
    return (
      <div className="container space-y-6">
        <Skeleton className="h-6 w-48" /> {/* Skeleton for title */}
        <Skeleton className="h-4 w-72" /> {/* Skeleton for description */}
        {/* Skeleton for the general settings section */}
        <div className="grid grid-cols-2 border border-gray-200 rounded-lg shadow-md p-4 gap-4">
          <Skeleton className="h-4 w-32" />{" "}
          {/* Skeleton for 'General Settings' label */}
          <Skeleton className="h-20 w-full" />{" "}
          {/* Skeleton for the settings form */}
        </div>
        {/* Skeleton for the abandonment section */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />{" "}
          {/* Skeleton for 'Abandoned Goals' label */}
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" /> {/* Skeleton for alert box */}
            <Skeleton className="h-10 w-32" />{" "}
            {/* Skeleton for abandon button */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Goal Settings</h2>
        <p className="text-gray-500">Manage your settings goal here.</p>
      </div>
      <div className="grid grid-cols-2 border border-gray-200 rounded-lg shadow-md p-4 gap-4">
        <div className="">
          <h4 className="font-semibold text-md">General Settings</h4>
        </div>
        <div className="flex flex-col gap-4">
          <GeneralSettingsForm />
        </div>
      </div>
      {goal.status !== "ABANDONED" && (
        <div className="space-y-2">
          <h4 className="font-semibold text-md">Abandoned Goals</h4>
          <Alert
            variant="destructive"
            className="border-red-500 flex items-center justify-between py-4"
          >
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6" />
              <div className="ml-3">
                <AlertTitle>
                  Abandoning the goal means you will lose control over it.
                </AlertTitle>
                <AlertDescription>
                  Make sure you no longer need this goal before proceeding.
                </AlertDescription>
              </div>
            </div>

            {/* AlertDialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="mt-2">
                  Abandon
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently abandon
                    your goal.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isSubmitting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button onClick={handleAbandonGoal} disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : "Yes, Abandon"}
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Alert>
        </div>
      )}

      {/* Display a loading spinner while redirecting */}
      {isLoading && (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-6 h-6 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
          <span className="text-gray-500">Redirecting...</span>
        </div>
      )}
    </div>
  );
}
