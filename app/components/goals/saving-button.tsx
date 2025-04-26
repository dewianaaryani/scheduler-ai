"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define the types to match what the Goal Planner component provides
interface PlanStep {
  title: string;
  emoji: string;
  description: string;
  startedTime: string;
  endTime: string;
  percentComplete: string;
}

interface GoalData {
  title: string;
  emoji: string;
  description: string;
  startDate: string;
  endDate: string;
  steps: PlanStep[];
}

interface PlanData {
  dataGoals: GoalData;
  message: string;
  error: string | null;
  isLastMessage: boolean;
}

interface SavingButtonProps {
  planData: PlanData;
}

export default function SavingButton({ planData }: SavingButtonProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!planData?.dataGoals) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(planData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save data");
      }

      setSaved(true);
      toast.success("Goal saved successfully", {
        description: "Redirecting to dashboard...",
        duration: 2000,
      });

      // Redirect to dashboard after successful save
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Something went wrong");
        toast.error(err.message || "Something went wrong", {
          description: "Please try again later.",
        });
      } else {
        setError("An unknown error occurred");
        toast.error("An unknown error occurred", {
          description: "Please try again later.",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4">
      <Button
        onClick={handleSave}
        disabled={saving || saved}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {saving ? "Saving..." : saved ? "Saved!" : "Save Goal"}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
