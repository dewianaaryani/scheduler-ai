"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import IntroScreen from "./intro-screen";
import ScheduleTypeQuestion from "./schedule-type-questions";
import FlexibleTimeBlocks from "./flexible-time-blocks";
import ScheduleConsistencyQuestion from "./schedule-consistency-question";
import DailyBusyBlocks from "./daily-busy-blocks";
import WeeklyBusyBlocks from "./weekly-busy-blocks";
import ScheduleNotes from "./schedule-notes";
import CompletionScreen from "./completion-screen";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export type AvailabilityData = {
  hasRegularSchedule: boolean | null;
  wantsPreferredBlocks: boolean | null;
  preferredTimeBlocks: string[];
  sameScheduleDaily: boolean | null;
  dailyBusyBlocks: string[];
  weeklyBusyBlocks: Record<string, string[]>;
  notes: string;
};

type StepConfig = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  title: string;
};

export default function AvailabilityFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<AvailabilityData>({
    hasRegularSchedule: null,
    wantsPreferredBlocks: null,
    preferredTimeBlocks: [],
    sameScheduleDaily: null,
    dailyBusyBlocks: [],
    weeklyBusyBlocks: {},
    notes: "",
  });
  const [, setIsLoading] = useState(false);
  const router = useRouter();

  const updateData = (updates: Partial<AvailabilityData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const getStepFlow = (): StepConfig[] => {
    const steps: StepConfig[] = [
      { component: IntroScreen, title: "Welcome" },
      { component: ScheduleTypeQuestion, title: "Schedule Type" },
    ];

    // Branch based on schedule type
    if (data.hasRegularSchedule === false) {
      steps.push({ component: FlexibleTimeBlocks, title: "Preferred Times" });
    } else if (data.hasRegularSchedule === true) {
      steps.push({
        component: ScheduleConsistencyQuestion,
        title: "Schedule Pattern",
      });

      if (data.sameScheduleDaily === true) {
        steps.push({ component: DailyBusyBlocks, title: "Daily Schedule" });
      } else if (data.sameScheduleDaily === false) {
        steps.push({ component: WeeklyBusyBlocks, title: "Weekly Schedule" });
      }
    }

    steps.push({ component: ScheduleNotes, title: "Additional Notes" });
    steps.push({ component: CompletionScreen, title: "Complete" });

    return steps;
  };

  const steps = getStepFlow();
  const CurrentStepComponent = steps[currentStep]?.component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const canGoNext = () => {
    const steps = getStepFlow();
    const currentStepTitle = steps[currentStep]?.title;

    switch (currentStep) {
      case 0:
        return true; // Intro screen
      case 1:
        return data.hasRegularSchedule !== null;
      case 2:
        if (data.hasRegularSchedule === false) {
          return data.wantsPreferredBlocks !== null;
        } else {
          return data.sameScheduleDaily !== null;
        }
      default:
        // Check for busy blocks steps
        if (currentStepTitle === "Daily Schedule") {
          return data.dailyBusyBlocks && data.dailyBusyBlocks.length > 0;
        }
        if (currentStepTitle === "Weekly Schedule") {
          const hasWeeklyBlocks = Object.values(
            data.weeklyBusyBlocks || {}
          ).some((blocks) => blocks && blocks.length > 0);
          return hasWeeklyBlocks;
        }
        return true;
    }
  };

  const handleComplete = async () => {
    try {
      setIsLoading(true);
      console.log("Availability data collected:", data);

      const response = await fetch("/api/user/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save preferences");
      }

      // Success toast
      toast.success("Availability preferences saved successfully!", {
        description: "Your scheduling preferences have been updated.",
        duration: 3000,
      });

      // Optional: redirect to dashboard or next step
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving preferences:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error("Failed to save preferences", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="max-w-4xl  mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="h-6 w-6 text-violet-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Availability Setup
          </h1>
        </div>
        <div className="w-full max-w-md mx-auto">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Card className="bg-white border-gray-200 shadow-lg">
        <CardContent className="p-8">
          {CurrentStepComponent && (
            <CurrentStepComponent
              data={data}
              updateData={updateData}
              onNext={nextStep}
              {...(isLastStep && { onComplete: handleComplete })}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      {currentStep > 0 && currentStep < steps.length - 1 && (
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={nextStep}
            disabled={!canGoNext()}
            className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
