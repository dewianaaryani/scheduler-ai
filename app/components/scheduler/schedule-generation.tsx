"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  TrendingUp,
  Zap,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { ScheduleItem } from "@/app/lib/types/goal-api";

import { ValidateGoalResponse } from "@/app/lib/types/goal-api";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface ScheduleGenerationProps {
  schedules: ScheduleItem[];
  progressMessage: string;
  progressPercent?: number;
  totalDays: number;
  error?: string | null;
  onRetry?: () => void;
  onBack?: () => void;
  onConfirm?: () => void;
  validationResult?: ValidateGoalResponse; // To hold validation data for saving
  saving?: boolean; // To show saving state
}

export default function ScheduleGeneration({
  schedules,
  progressMessage,
  progressPercent = 0,
  totalDays,
  error,
  onRetry,
  onBack,
  onConfirm,
  validationResult,
  saving = false,
}: ScheduleGenerationProps) {
  const [showSparkle, setShowSparkle] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Use progressPercent if provided (during streaming), otherwise calculate from schedules
  const progress =
    progressPercent > 0
      ? progressPercent
      : totalDays > 0
        ? (schedules.length / totalDays) * 100
        : 0;

  // Consider complete only when progressPercent is explicitly 100%
  // During streaming, progressPercent will be > 0 but < 100
  // Only show complete when we're explicitly told it's 100% complete
  const isComplete = progressPercent === 100;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (schedules.length > 0 && schedules.length % 5 === 0) {
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 1000);
    }
  }, [schedules.length]);

  // If there's an error, show error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-10">
        <div className="text-center space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="relative p-4 bg-red-50 rounded-full">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Gagal Membuat Jadwal
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              {error ||
                "Terjadi kesalahan saat membuat jadwal. Silakan coba lagi."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            {onBack && (
              <Button onClick={onBack} variant="outline" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
            )}
            {onRetry && (
              <Button onClick={onRetry} size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                Coba Lagi
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-10">
      {/* Modern Header */}
      <div
        className={`text-center space-y-6 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        {/* Animated Icon */}
        <div className="relative flex justify-center">
          <div className="relative">
            {!isComplete && (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-2xl opacity-20 animate-pulse rounded-full" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 blur-3xl opacity-10 animate-pulse rounded-full delay-500" />
              </>
            )}

            <div
              className={`relative transition-all duration-500 ${isComplete ? "" : "animate-spin-slow"}`}
            >
              {isComplete ? (
                <div className="relative animate-in zoom-in duration-500">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                  <div className="absolute -top-2 -right-2 animate-in zoom-in spin-in duration-700 delay-200">
                    <Sparkles className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              ) : (
                <div className="relative p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-2xl">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Sparkle Animation */}
          {showSparkle && (
            <div className="absolute animate-ping">
              <Sparkles className="h-8 w-8 text-yellow-400" />
            </div>
          )}
        </div>

        {/* Title and Progress */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {isComplete ? "Jadwal Siap! 🎉" : "Membuat Jadwal Pintar"}
          </h2>
          <p className="text-muted-foreground">
            {progressMessage ||
              `${schedules.length} dari ${totalDays} jadwal dibuat`}
          </p>
        </div>

        {/* Progress Stats */}
        <div className="flex justify-center gap-8">
          <div className="flex items-center gap-2 animate-in slide-in-from-left duration-500">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{totalDays} Hari</span>
          </div>
          <div className="flex items-center gap-2 animate-in slide-in-from-right duration-500">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {Math.round(progress)}% Selesai
            </span>
          </div>
        </div>
      </div>

      {/* Goal Info Display */}
      {validationResult && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                {validationResult.emoji} {validationResult.title}
              </h3>
              <p className="text-gray-600 mt-1">
                {validationResult.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Mulai:</span>
                {validationResult.startDate && (
                  <span>
                    {format(
                      new Date(validationResult.startDate),
                      "EEEE, d MMMM yyyy",
                      { locale: id }
                    )}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Selesai:</span>
                {validationResult.endDate && (
                  <span>
                    {format(
                      new Date(validationResult.endDate),
                      "EEEE, d MMMM yyyy",
                      { locale: id }
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Progress Bar */}
      <div className="relative animate-in fade-in duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl rounded-full" />
        <Progress
          value={progress}
          className="h-3 relative bg-secondary/50 transition-all duration-300"
        />
        {!isComplete && (
          <div
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-300"
            style={{ left: `${Math.min(95, progress)}%` }}
          >
            <div className="w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/50 animate-pulse" />
          </div>
        )}
      </div>

      {/* Schedule Cards Grid */}
      {schedules.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Preview Jadwal</h3>
            {(!isComplete || saving) && (
              <Badge variant="secondary" className="gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                {saving ? "Menyimpan..." : "Generating..."}
              </Badge>
            )}
          </div>

          <div className="">
            {schedules.map((schedule, idx) => (
              <div
                key={`schedule-${idx}`}
                className="animate-in slide-in-from-left duration-500"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <Card className="overflow-hidden hover:shadow-md transition-all hover:scale-[1.02] group">
                  <div className="" />
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Day Number Badge */}
                      <div className="relative">
                        <div className="relative bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-lg p-3 min-w-[60px] text-center">
                          <div className="text-xs opacity-90">Hari</div>
                          <div className="text-lg font-bold">
                            {schedule.dayNumber}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold line-clamp-1">
                              {schedule.emoji} {schedule.title}
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {schedule.description}
                            </p>
                          </div>
                          <Badge variant="outline" className="shrink-0">
                            {!isComplete ? (
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              `${schedule.progressPercent}%`
                            )}
                          </Badge>
                        </div>

                        {/* Time and Date */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{schedule.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {schedule.startTime} - {schedule.endTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar for Each Schedule */}
                    <div className="mt-3">
                      <div className="h-1 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                          style={{
                            width: `${schedule.progressPercent}%`,
                            transitionDelay: `${idx * 100}ms`,
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Confirmation Buttons - Show only when generation is complete */}
          {isComplete && (
            <div className="flex gap-4 justify-center mt-8 animate-in fade-in slide-in-from-bottom duration-500">
              {onBack && (
                <Button
                  onClick={onBack}
                  variant="outline"
                  size="lg"
                  className="min-w-[140px]"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali
                </Button>
              )}
              {onConfirm && (
                <Button
                  onClick={onConfirm}
                  size="lg"
                  disabled={saving}
                  className="min-w-[140px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Simpan Jadwal
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Custom CSS for slow spin animation */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
