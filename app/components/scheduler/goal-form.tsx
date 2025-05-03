// components/goal/goal-form.tsx
"use client";

import { useState } from "react";
import { AIResponse, GoalFormData } from "@/app/lib/types";
import { processGoalData } from "@/app/lib/goal-service";
import { toast } from "sonner";

import InitialView from "./initial-view";
import GoalSuccess from "./goal-success";
import GoalSteps from "./goal-step";

interface GoalFormProps {
  username: string;
}

export default function GoalForm({ username }: GoalFormProps) {
  const [initialValue, setInitialValue] = useState("");
  const [currentFocus, setCurrentFocus] = useState<
    "initialValue" | "steps" | "complete"
  >("initialValue");
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [processingAI, setProcessingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInitialSubmit = (value: string) => {
    setInitialValue(value);
    setCurrentFocus("steps");
    sendGoalDataToAI({ initialValue: value });
  };

  const sendGoalDataToAI = async (data: Partial<GoalFormData>) => {
    if (processingAI) return;

    try {
      setProcessingAI(true);
      setError(null);

      const response = await processGoalData(data);
      setAiResponse(response);

      // If we got back a complete goal plan
      if (response.dataGoals) {
        setCurrentFocus("complete");
        toast("Goal Created!");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("AI Processing Error:", err);
      setError(err.message || "Failed to process your goal");
      toast.error(err.message || "There was a problem processing your goal");
    } finally {
      setProcessingAI(false);
    }
  };

  const resetForm = () => {
    setInitialValue("");
    setCurrentFocus("initialValue");
    setAiResponse(null);
    setError(null);
  };
  const handleGenerateGoal = async () => {
    const response = await fetch("/api/ai-chat/generate-goal", {
      method: "POST",
      body: JSON.stringify(aiResponse?.dataGoals),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to save data");
    }
    toast.success("Goal saved successfully", {
      description: "Redirecting to dashboard...",
      duration: 2000,
    });
  };

  if (currentFocus === "complete" && aiResponse?.dataGoals) {
    return (
      <GoalSuccess
        goal={aiResponse.dataGoals}
        onCreateAnother={resetForm}
        onGenerateGoal={handleGenerateGoal}
      />
    );
  }

  if (currentFocus === "initialValue") {
    return <InitialView username={username} onSubmit={handleInitialSubmit} />;
  }

  return (
    <GoalSteps
      initialValue={initialValue}
      aiResponse={aiResponse}
      processingAI={processingAI}
      error={error}
      onError={setError}
      onBack={() => setCurrentFocus("initialValue")}
      onSubmitData={sendGoalDataToAI}
      onProcessComplete={() => {
        if (aiResponse?.dataGoals) {
          setCurrentFocus("complete");
          toast("Goal Created!");
        }
      }}
    />
  );
}
