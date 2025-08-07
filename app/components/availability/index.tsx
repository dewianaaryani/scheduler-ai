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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const updateData = (updates: Partial<AvailabilityData>) => {
    setData((prev) => {
      const newData = { ...prev, ...updates };
      
      // Reset dependent data when schedule type changes
      if ('hasRegularSchedule' in updates) {
        if (updates.hasRegularSchedule === false) {
          // Reset data for flexible schedule
          newData.sameScheduleDaily = null;
          newData.dailyBusyBlocks = [];
          newData.weeklyBusyBlocks = {};
        } else if (updates.hasRegularSchedule === true) {
          // Reset data for regular schedule
          newData.wantsPreferredBlocks = null;
          newData.preferredTimeBlocks = [];
        }
      }
      
      // Reset dependent data when schedule consistency changes
      if ('sameScheduleDaily' in updates) {
        if (updates.sameScheduleDaily === true) {
          // Reset weekly blocks
          newData.weeklyBusyBlocks = {};
        } else if (updates.sameScheduleDaily === false) {
          // Reset daily blocks
          newData.dailyBusyBlocks = [];
        }
      }
      
      // Reset preferred time blocks when user chooses not to set them
      if ('wantsPreferredBlocks' in updates && updates.wantsPreferredBlocks === false) {
        newData.preferredTimeBlocks = [];
      }
      
      return newData;
    });
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const getStepFlow = (): StepConfig[] => {
    const steps: StepConfig[] = [
      { component: IntroScreen, title: "Selamat Datang" },
      { component: ScheduleTypeQuestion, title: "Jenis Jadwal" },
    ];

    // Branch based on schedule type
    if (data.hasRegularSchedule === false) {
      steps.push({ component: FlexibleTimeBlocks, title: "Waktu Preferensi" });
    } else if (data.hasRegularSchedule === true) {
      steps.push({
        component: ScheduleConsistencyQuestion,
        title: "Pola Jadwal",
      });

      if (data.sameScheduleDaily === true) {
        steps.push({ component: DailyBusyBlocks, title: "Jadwal Harian" });
      } else if (data.sameScheduleDaily === false) {
        steps.push({ component: WeeklyBusyBlocks, title: "Jadwal Mingguan" });
      }
    }

    steps.push({ component: ScheduleNotes, title: "Catatan Tambahan" });
    steps.push({ component: CompletionScreen, title: "Selesai" });

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
        if (currentStepTitle === "Jadwal Harian") {
          return data.dailyBusyBlocks && data.dailyBusyBlocks.length > 0;
        }
        if (currentStepTitle === "Jadwal Mingguan") {
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
      // Availability data collected

      const response = await fetch("/api/user/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan preferensi");
      }

      // Success toast
      toast.success("Preferensi ketersediaan berhasil disimpan!", {
        description: "Preferensi penjadwalan Anda telah diperbarui.",
        duration: 3000,
      });

      // Optional: redirect to dashboard or next step
      router.push("/dashboard");
    } catch (error) {
      // Error saving preferences
      const errorMessage =
        error instanceof Error ? error.message : "Terjadi kesalahan tidak diketahui";
      toast.error("Gagal menyimpan preferensi", {
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
            Pengaturan Ketersediaan
          </h1>
        </div>
        <div className="w-full max-w-md mx-auto">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">
            Langkah {currentStep + 1} dari {steps.length}
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
            isLoading={isLoading}
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
            Kembali
          </Button>

          <Button
            onClick={nextStep}
            disabled={!canGoNext()}
            className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
          >
            Lanjutkan
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
