"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ProgressLoaderProps {
  isLoading: boolean;
  message?: string;
}

export default function ProgressLoader({ isLoading, message = "Membuat jadwal..." }: ProgressLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      setCurrentStep("");
      return;
    }

    // Simulate progress stages based on message type
    const isSaving = message.includes("Menyimpan");
    
    let stages;
    if (isSaving) {
      stages = [
        { percent: 20, message: "Menyimpan data tujuan...", duration: 800 },
        { percent: 50, message: "Membuat jadwal...", duration: 1500 },
        { percent: 80, message: "Menyelaraskan dengan kalender...", duration: 1000 },
        { percent: 100, message: "Tujuan berhasil dibuat!", duration: 500 },
      ];
    } else {
      stages = [
        { percent: 15, message: "Menganalisis tujuan...", duration: 1200 },
        { percent: 30, message: "Memproses informasi...", duration: 2000 },
        { percent: 50, message: "Membuat rencana harian...", duration: 2500 },
        { percent: 70, message: "Mengatur jadwal optimal...", duration: 2000 },
        { percent: 85, message: "Menyesuaikan dengan preferensi...", duration: 1500 },
        { percent: 100, message: "Rencana siap!", duration: 500 },
      ];
    }

    let currentStageIndex = 0;
    let animationFrame: number;
    const startTime = Date.now();
    let stageStartTime = startTime;

    const animate = () => {
      const now = Date.now();
      const stageElapsed = now - stageStartTime;
      const currentStage = stages[currentStageIndex];
      const nextStage = stages[currentStageIndex + 1];

      if (currentStage && stageElapsed < currentStage.duration) {
        // Interpolate progress within current stage
        const stageProgress = stageElapsed / currentStage.duration;
        const targetPercent = nextStage 
          ? currentStage.percent + (nextStage.percent - currentStage.percent) * stageProgress
          : currentStage.percent;
        
        setProgress(Math.min(targetPercent, 99)); // Cap at 99% until actually complete
        setCurrentStep(currentStage.message);
      } else if (currentStageIndex < stages.length - 1) {
        // Move to next stage
        currentStageIndex++;
        stageStartTime = now;
        if (stages[currentStageIndex]) {
          setCurrentStep(stages[currentStageIndex].message);
        }
      }

      // Continue animation if still loading and not at final stage
      if (isLoading && currentStageIndex < stages.length - 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isLoading, message]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center space-y-6">
          {/* Animated Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-violet-200 rounded-full animate-ping" />
            <div className="relative bg-violet-100 p-4 rounded-full">
              <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
            </div>
          </div>

          {/* Progress Text */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">{message}</h3>
            <p className="text-sm text-gray-600">{currentStep}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full space-y-2">
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{Math.round(progress)}%</span>
              <span>Sedang diproses...</span>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-violet-50 p-3 rounded-lg w-full">
            <p className="text-xs text-violet-700 text-center">
              💡 AI sedang membuat jadwal yang dipersonalisasi untukmu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}