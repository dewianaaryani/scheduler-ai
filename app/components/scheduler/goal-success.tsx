// components/goal/goal-success.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Goal } from "@/app/lib/types";
import { useState } from "react";

interface GoalSuccessProps {
  goal: Goal;
  onCreateAnother: () => void;
  onGenerateGoal: () => void; // <-- new prop
}

export default function GoalSuccess({
  goal,
  onCreateAnother,
  onGenerateGoal,
}: GoalSuccessProps) {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      await onGenerateGoal(); // <- this was missing
    } catch (err) {
      console.error("Failed to regenerate goal", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex-col w-full p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        {goal.emoji} {goal.title}
      </h1>
      <p className="mb-6 text-gray-600">{goal.description}</p>

      <div className="flex justify-between text-sm text-gray-500 mb-6">
        <div>Starts: {new Date(goal.startDate).toLocaleDateString()}</div>
        <div>Ends: {new Date(goal.endDate).toLocaleDateString()}</div>
      </div>

      <h2 className="text-xl font-semibold mb-3">Steps to Achieve This Goal</h2>
      <div className="space-y-4">
        {goal.schedules.map((step, index) => (
          <div key={index} className="p-4 border rounded-md">
            <div className="flex items-center gap-2">
              <div>{step.emoji}</div>
              <h3 className="font-medium">{step.title}</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">{step.description}</p>
            <div className="mt-3 flex justify-between text-xs text-gray-500">
              <div>
                {new Date(step.startedTime).toLocaleDateString()} -{" "}
                {new Date(step.endTime).toLocaleDateString()}
              </div>
              <div>{step.percentComplete} complete</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between pb-10">
        <Button onClick={onCreateAnother} variant="outline">
          Cancel
        </Button>
        <Button onClick={handleGenerate} disabled={generating}>
          {generating ? "Generating..." : "Generate Goal"}
        </Button>
      </div>
    </div>
  );
}
