// components/goal/goal-steps.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { AIResponse, GoalFormData } from "@/app/lib/types";
import DatePicker from "./date-picker";

interface GoalStepsProps {
  initialValue: string;
  aiResponse: AIResponse | null;
  processingAI: boolean;
  error: string | null;
  onError: (error: string | null) => void;
  onBack: () => void;
  onSubmitData: (data: Partial<GoalFormData>) => void;
  onProcessComplete: () => void;
}

type StepType = "title" | "description" | "startDate" | "endDate";

export default function GoalSteps({
  initialValue,
  aiResponse,
  processingAI,
  error,
  onError,
  onBack,
  onSubmitData,
  onProcessComplete,
}: GoalStepsProps) {
  const [currentFocus, setCurrentFocus] = useState<StepType>("title");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [input, setInput] = useState("");
  const [hasSubmittedComplete, setHasSubmittedComplete] = useState(false);

  // Determine placeholder based on current step
  const getPlaceholder = () => {
    switch (currentFocus) {
      case "title":
        // If we already have initialValue, ask for clarification
        return initialValue
          ? "Mohon perjelas judul tujuan Anda..."
          : "Apa tujuan yang ingin Anda capai?";
      case "description":
        return "Berikan detail lebih lanjut tentang tujuan Anda...";
      case "startDate":
        return "Kapan Anda ingin mulai? (contoh: besok, Senin depan)";
      case "endDate":
        return "Kapan target selesai? (contoh: dalam 3 bulan, 30 hari)";
      default:
        return "Ketik pesan Anda...";
    }
  };

  // Update values if AI suggests them
  useEffect(() => {
    if (aiResponse) {
      if (aiResponse.title && !title) setTitle(aiResponse.title);
      if (aiResponse.description && !description)
        setDescription(aiResponse.description);

      // Auto-fill dates if AI extracted them from user input OR from complete goal data
      if (aiResponse.startDate && !startDate) {
        setStartDate(new Date(aiResponse.startDate));
      }
      if (aiResponse.endDate && !endDate) {
        setEndDate(new Date(aiResponse.endDate));
      }

      // Also check dataGoals for complete responses
      if (aiResponse.dataGoals?.startDate && !startDate)
        setStartDate(new Date(aiResponse.dataGoals.startDate));
      if (aiResponse.dataGoals?.endDate && !endDate)
        setEndDate(new Date(aiResponse.dataGoals.endDate));

      // Reset submission flag if we got a validation message back
      if (!aiResponse.dataGoals && aiResponse.message) {
        setHasSubmittedComplete(false);
      }
    }
  }, [aiResponse, title, description, startDate, endDate]);
  useEffect(() => {
    if (title && !description) {
      setCurrentFocus("description");
    } else if (title && description && !startDate) {
      setCurrentFocus("startDate");
    } else if (title && description && startDate && !endDate) {
      setCurrentFocus("endDate");
    }
  }, [title, description, startDate, endDate]);

  useEffect(() => {
    // Submit data when all fields are filled AND we haven't already submitted
    // BUT don't submit if AI is currently showing a validation message
    const hasValidationMessage =
      aiResponse && !aiResponse.dataGoals && aiResponse.message;

    if (
      title &&
      description &&
      startDate &&
      endDate &&
      !hasSubmittedComplete &&
      !processingAI &&
      !hasValidationMessage
    ) {
      // Mark as submitted to prevent infinite loop
      setHasSubmittedComplete(true);

      // First submit the complete data to AI, then check for completion
      onSubmitData({
        initialValue,
        title,
        description,
        startDate,
        endDate,
      });
    }
  }, [
    title,
    description,
    startDate,
    endDate,
    initialValue,
    onSubmitData,
    hasSubmittedComplete,
    processingAI,
    aiResponse,
  ]);

  // Separate effect to check for completion after AI response
  useEffect(() => {
    if (title && description && startDate && endDate && aiResponse?.dataGoals) {
      onProcessComplete();
    }
  }, [title, description, startDate, endDate, aiResponse, onProcessComplete]);

  const handleSubmit = () => {
    if (
      !input.trim() &&
      currentFocus !== "startDate" &&
      currentFocus !== "endDate"
    )
      return;

    if (currentFocus === "title") {
      setTitle(input);
      setInput("");
      setCurrentFocus("description");
      onSubmitData({ initialValue, title: input });
    } else if (currentFocus === "description") {
      setDescription(input);
      setInput("");
      setCurrentFocus("startDate");
      onSubmitData({ initialValue, title, description: input });
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Determine which component to render based on current step
  const renderCurrentStep = () => {
    if (currentFocus === "startDate") {
      return (
        <DatePicker
          selectedDate={startDate}
          onSelect={(date) => {
            if (date) {
              setStartDate(date);
              setHasSubmittedComplete(false); // Reset to allow re-submission
              onSubmitData({
                initialValue,
                title,
                description,
                startDate: date,
              });
            }
          }}
          label="Pilih tanggal mulai"
          showNote={true}
        />
      );
    } else if (currentFocus === "endDate") {
      return (
        <DatePicker
          selectedDate={endDate}
          onSelect={(date) => {
            if (date) {
              setEndDate(date);
              setHasSubmittedComplete(false); // Reset to allow re-submission
              onSubmitData({
                initialValue,
                title,
                description,
                startDate,
                endDate: date,
              });
            }
          }}
          minDate={startDate}
          label="Pilih tanggal selesai"
          showNote={true}
        />
      );
    } else if (currentFocus === "description") {
      return (
        <div className="relative w-full">
          <Textarea
            placeholder={getPlaceholder()}
            value={input}
            className="pr-16 min-h-[120px]"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            size="sm"
            className="absolute bottom-2 right-2 rounded-md"
            onClick={handleSubmit}
            type="button"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      );
    } else {
      return (
        <div className="relative w-full">
          <Input
            placeholder={getPlaceholder()}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            size="sm"
            className="absolute bottom-2 right-2 rounded-md"
            onClick={handleSubmit}
            type="button"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      );
    }
  };

  const getStepTitle = () => {
    switch (currentFocus) {
      case "title":
        return "Apa tujuan yang ingin Anda capai?";
      case "description":
        return "Ceritakan lebih detail tentang tujuan Anda:";
      case "startDate":
        return "Kapan Anda ingin memulai?";
      case "endDate":
        return "Kapan target selesai tujuan ini?";
    }
  };

  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="flex-col max-w-md w-full space-y-6">
        <p className="text-lg font-medium">{getStepTitle()}</p>

        {/* Show AI feedback if we have it */}
        {aiResponse && !aiResponse.dataGoals && aiResponse.message && (
          <div
            className={`text-sm p-3 rounded-md ${
              aiResponse.error
                ? "bg-red-50 text-red-700"
                : "bg-gray-50 text-gray-600"
            } italic`}
          >
            {aiResponse.message}
          </div>
        )}

        {/* Show current progress */}
        {initialValue && (
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="font-medium">{initialValue}</p>
            {title && <p className="text-sm mt-1">Title: {title}</p>}
            {description && (
              <p className="text-sm mt-1 truncate">
                Description: {description.substring(0, 50)}
                {description.length > 50 ? "..." : ""}
              </p>
            )}
            {startDate && (
              <p className="text-sm mt-1">Start: {format(startDate, "PP")}</p>
            )}
            {endDate && (
              <p className="text-sm mt-1">End: {format(endDate, "PP")}</p>
            )}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
            <p className="text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onError(null)}
              className="mt-2"
            >
              Coba Lagi
            </Button>
          </div>
        )}

        {processingAI ? (
          <div className="text-center py-4 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <p>Memproses data tujuan Anda...</p>
          </div>
        ) : (
          renderCurrentStep()
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Go back to previous step
              if (currentFocus === "title") {
                onBack();
              } else if (currentFocus === "description") {
                setCurrentFocus("title");
              } else if (currentFocus === "startDate") {
                setCurrentFocus("description");
              } else if (currentFocus === "endDate") {
                setCurrentFocus("startDate");
              }
            }}
          >
            Kembali
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => {
              // Skip the current step if needed
              if (currentFocus === "title" && input) {
                setTitle(input);
                setInput("");
                setCurrentFocus("description");
                onSubmitData({ initialValue, title: input });
              } else if (currentFocus === "description" && input) {
                setDescription(input);
                setInput("");
                setCurrentFocus("startDate");
                onSubmitData({ initialValue, title, description: input });
              } else if (currentFocus === "startDate" && startDate) {
                setCurrentFocus("endDate");
              } else if (currentFocus === "endDate" && endDate) {
                // Force submission when user explicitly clicks button
                setHasSubmittedComplete(false);
                setTimeout(() => {
                  onSubmitData({
                    initialValue,
                    title,
                    description,
                    startDate,
                    endDate,
                  });
                }, 0);
              }
            }}
            disabled={
              (currentFocus === "title" && !input) ||
              (currentFocus === "description" && !input) ||
              (currentFocus === "startDate" && !startDate) ||
              (currentFocus === "endDate" && !endDate) ||
              processingAI
            }
          >
            {currentFocus === "endDate" ? "Buat Tujuan" : "Lanjut"}
          </Button>
        </div>
      </div>
    </div>
  );
}
