"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  createGoalWithSchedules,
  retryValidationWithAdditionalInfo,
  GoalCreationCallbacks,
} from "@/app/lib/goal-service-3step";
import {
  ValidateGoalResponse,
  SaveGoalResponse,
  ScheduleItem,
} from "@/app/lib/types/goal-api";
import { Goal } from "@/app/lib/types";
import { Button } from "@/components/ui/button";

import InitialView from "./initial-view";
import GoalSuccess from "./goal-success";
import GoalValidation from "./goal-validation";
import ScheduleGeneration from "./schedule-generation";

interface GoalFormProps {
  username: string;
}

type FormStep = "initial" | "validation" | "schedules" | "complete";

export default function GoalForm({ username }: GoalFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FormStep>("initial");
  const [initialValue, setInitialValue] = useState("");
  const [validationResult, setValidationResult] = useState<ValidateGoalResponse | null>(null);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [savedGoal, setSavedGoal] = useState<SaveGoalResponse | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const handleInitialSubmit = async (value: string) => {
    setInitialValue(value);
    setError(null); // Clear any previous errors
    setScheduleError(null);
    setCurrentStep("validation");
    await processGoalCreation(value);
  };

  const processGoalCreation = async (value: string, autoSave: boolean = false) => {
    if (processing) return;

    try {
      setProcessing(true);
      setError(null);

      const callbacks: GoalCreationCallbacks = {
        skipAutoSave: !autoSave, // Skip auto-save unless explicitly requested
        onValidationStart: () => {
          setProgressMessage("Memvalidasi tujuan Anda...");
        },
        onValidationComplete: (result) => {
          setValidationResult(result);
          if (result.status === "valid") {
            setProgressMessage("Validasi berhasil! Membuat jadwal...");
          } else if (result.status === "incomplete") {
            setProgressMessage("");
            // Don't show toast - the UI component handles displaying the message
            setCurrentStep("validation");
            setProcessing(false);
            setError(result.message);
            return;
          } else if (result.status === "invalid") {
            setProgressMessage("");
            // Don't show toast - the UI component handles displaying the message
            setCurrentStep("validation");
            setProcessing(false);
            setError(result.message);
            return;
          }
        },
        onScheduleGenerationStart: () => {
          setCurrentStep("schedules");
          setSchedules([]); // Clear any previous schedules
          setProgressMessage("Membuat jadwal untuk tujuan Anda...");
          setProgressPercent(0);
          setScheduleError(null);
        },
        onScheduleGenerationProgress: (message, progress) => {
          setProgressMessage(message);
          setProgressPercent(progress);
        },
        onScheduleReceived: (schedule, currentCount) => {
          // Add schedule as it streams in
          setSchedules((prev) => [...prev, schedule]);
          setProgressMessage(`Membuat jadwal ke-${currentCount}...`);
          setProgressPercent(Math.min(currentCount * 10, 90));
        },
        onScheduleGenerationComplete: (generatedSchedules) => {
          setSchedules(generatedSchedules);
          setProgressMessage("Jadwal berhasil dibuat!");
          setProgressPercent(100);
          setScheduleError(null);
        },
        onSaveStart: () => {
          setProgressMessage("Menyimpan tujuan dan jadwal...");
        },
        onSaveComplete: (goal) => {
          setSavedGoal(goal);
          toast.success("Tujuan berhasil dibuat!", {
            description: `${goal.schedules.length} jadwal telah dibuat`,
          });
          // Redirect to goal detail page
          router.push(`/goals/${goal.id}`);
        },
        onError: (errorMessage, step) => {
          setError(errorMessage);
          if (step === 'generation') {
            setScheduleError(errorMessage);
          } else if (step === 'validation') {
            // If validation fails, go back to initial step
            setCurrentStep("initial");
            setValidationResult(null);
            // For validation errors, show in UI instead of toast
            return;
          }
          // Only show toast for generation and save errors (since they stay on same screen)
          const stepName = step === 'validation' ? 'validasi' : 
                          step === 'generation' ? 'pembuatan jadwal' : 'penyimpanan';
          toast.error(`Gagal pada tahap ${stepName}`, {
            description: errorMessage,
            duration: 4000,
          });
        },
      };

      await createGoalWithSchedules(value, callbacks);
    } catch (err) {
      console.error("Goal creation error:", err);
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(errorMessage);
      // If there's an error, go back to initial step
      setCurrentStep("initial");
      setValidationResult(null);
      // Don't show toast - error will be displayed in UI
    } finally {
      setProcessing(false);
      setProgressMessage("");
    }
  };

  const handleRetryWithAdditionalInfo = async (additionalInfo: {
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    if (!validationResult || processing) return;

    try {
      setProcessing(true);
      setError(null);
      setProgressMessage("Memvalidasi ulang dengan informasi tambahan...");

      const newValidation = await retryValidationWithAdditionalInfo(
        initialValue,
        validationResult,
        additionalInfo
      );

      setValidationResult(newValidation);

      if (newValidation.status === "valid") {
        // Move directly to schedule generation (don't re-validate)
        setCurrentStep("schedules");
        setProgressMessage("Membuat jadwal untuk tujuan Anda...");
        setScheduleError(null);
        
        // Only generate schedules WITHOUT auto-saving
        const { generateSchedules } = await import("@/app/lib/goal-service-3step");
        
        setSchedules([]); // Clear schedules before starting
        const schedulesResponse = await generateSchedules(
          {
            title: newValidation.title!,
            description: newValidation.description!,
            startDate: newValidation.startDate!,
            endDate: newValidation.endDate!,
            emoji: newValidation.emoji,
          },
          (message, progress) => {
            setProgressMessage(message);
            setProgressPercent(progress);
          },
          (schedule, currentCount) => {
            setSchedules((prev) => [...prev, schedule]);
            setProgressMessage(`Membuat jadwal ke-${currentCount}...`);
            setProgressPercent(Math.min(currentCount * 10, 90));
          }
        );
        
        setSchedules(schedulesResponse.schedules);
        setProgressMessage("Jadwal berhasil dibuat!");
        setProgressPercent(100);
      } else {
        setError(newValidation.message);
      }
    } catch (err) {
      console.error("Retry validation error:", err);
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(errorMessage);
      setScheduleError(errorMessage);
      // If retry fails, go back to initial step
      setCurrentStep("initial");
      setValidationResult(null);
      // Don't show toast - error will be displayed in UI
    } finally {
      setProcessing(false);
      setProgressMessage("");
    }
  };

  const resetForm = () => {
    setCurrentStep("initial");
    setInitialValue("");
    setValidationResult(null);
    setSchedules([]);
    setSavedGoal(null);
    setError(null);
    setProgressMessage("");
    setProgressPercent(0);
  };

  const navigateToGoals = () => {
    router.push("/goals");
  };

  const handleSaveSchedules = async () => {
    if (!validationResult || schedules.length === 0) return;

    try {
      setProcessing(true);
      setProgressMessage("Menyimpan tujuan dan jadwal...");

      const { saveGoal } = await import("@/app/lib/goal-service-3step");
      
      // Convert schedules to save format
      const schedulesToSave = schedules.map((schedule, index) => ({
        title: schedule.title,
        description: schedule.description,
        notes: "",
        startedTime: `${schedule.date}T${schedule.startTime}:00+07:00`,
        endTime: `${schedule.date}T${schedule.endTime}:00+07:00`,
        emoji: schedule.emoji || validationResult.emoji,
        percentComplete: String(schedule.progressPercent),
        order: index,
      }));

      const savedGoal = await saveGoal({
        title: validationResult.title!,
        description: validationResult.description!,
        startDate: validationResult.startDate!,
        endDate: validationResult.endDate!,
        emoji: validationResult.emoji,
        schedules: schedulesToSave,
      });

      setSavedGoal(savedGoal);
      toast.success("Tujuan berhasil dibuat!", {
        description: `${savedGoal.schedules.length} jadwal telah dibuat`,
      });
      // Redirect to goal detail page
      router.push(`/goals/${savedGoal.id}`);
    } catch (err) {
      console.error("Save error:", err);
      const errorMessage = err instanceof Error ? err.message : "Gagal menyimpan";
      setError(errorMessage);
      toast.error("Gagal menyimpan", {
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setProcessing(false);
      setProgressMessage("");
    }
  };

  // Render based on current step
  if (currentStep === "complete" && savedGoal) {
    // Convert to Goal type for GoalSuccess component
    const goalData: Goal = {
      id: savedGoal.id,
      title: savedGoal.title,
      description: savedGoal.description,
      startDate: savedGoal.startDate,
      endDate: savedGoal.endDate,
      emoji: savedGoal.emoji,
      status: savedGoal.status as "ACTIVE" | "COMPLETED" | "ABANDONED",
      percentComplete: 0, // Will be calculated from schedules
      createdAt: new Date(),
      updatedAt: new Date(),
      schedules: schedules.map((s, idx) => ({
        id: `temp-${idx}`,
        title: s.title,
        description: s.description,
        startedTime: new Date(`${s.date}T${s.startTime}:00+07:00`),
        endTime: new Date(`${s.date}T${s.endTime}:00+07:00`),
        emoji: s.emoji || savedGoal.emoji,
        percentComplete: String(s.progressPercent),
        status: "NONE" as const,
      })),
    };

    return (
      <GoalSuccess
        goal={goalData}
        onCreateAnother={resetForm}
        onGenerateGoal={navigateToGoals}
      />
    );
  }

  if (currentStep === "initial") {
    return <InitialView username={username} onSubmit={handleInitialSubmit} error={error} />;
  }

  // Render validation step
  if (currentStep === "validation") {
    return (
      <GoalValidation
        validationResult={validationResult}
        processing={processing}
        progressMessage={progressMessage}
        error={error}
        onBack={() => setCurrentStep("initial")}
        onRetryValidation={handleRetryWithAdditionalInfo}
      />
    );
  }

  // Render schedule generation step
  if (currentStep === "schedules") {
    const totalDays = validationResult?.startDate && validationResult?.endDate
      ? Math.ceil(
          (new Date(validationResult.endDate).getTime() - 
           new Date(validationResult.startDate).getTime()) / 
          (1000 * 60 * 60 * 24)
        ) + 1
      : 0;

    return (
      <ScheduleGeneration
        schedules={schedules}
        progressMessage={progressMessage}
        progressPercent={progressPercent}
        totalDays={totalDays}
        error={scheduleError}
        onRetry={() => processGoalCreation(initialValue)}
        onBack={() => setCurrentStep("validation")}
        onConfirm={handleSaveSchedules}
        validationResult={validationResult || undefined}
      />
    );
  }

  // This shouldn't happen, but just in case
  return (
    <div className="text-center">
      <p>Something went wrong. Please try again.</p>
      <Button onClick={resetForm} className="mt-4">
        Start Over
      </Button>
    </div>
  );
}