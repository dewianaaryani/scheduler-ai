"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  XCircle,
  Send,
} from "lucide-react";
import { format } from "date-fns";
import { ValidateGoalResponse } from "@/app/lib/types/goal-api";
import DatePicker from "./date-picker";

interface GoalValidationProps {
  validationResult: ValidateGoalResponse | null;
  processing: boolean;
  progressMessage: string;
  error: string | null;
  onBack: () => void;
  onRetryValidation: (additionalInfo: {
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  }) => void;
}

export default function GoalValidation({
  validationResult,
  processing,
  progressMessage,
  error,
  onBack,
  onRetryValidation,
}: GoalValidationProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Update state when validationResult changes
  useEffect(() => {
    if (validationResult) {
      // For invalid or incomplete goals, prefer suggestions over extracted values
      const isInvalidOrIncomplete =
        validationResult.status === "invalid" ||
        validationResult.status === "incomplete";

      // Set title - prefer suggestion for invalid/incomplete goals
      if (isInvalidOrIncomplete && validationResult.suggestions?.title) {
        setTitle(validationResult.suggestions.title);
      } else if (validationResult.title) {
        setTitle(validationResult.title);
      }

      // Set description - prefer suggestion for invalid/incomplete goals
      if (isInvalidOrIncomplete && validationResult.suggestions?.description) {
        setDescription(validationResult.suggestions.description);
      } else if (validationResult.description) {
        setDescription(validationResult.description);
      }

      // Set start date - prefer suggestion for invalid/incomplete goals
      if (isInvalidOrIncomplete && validationResult.suggestions?.startDate) {
        setStartDate(new Date(validationResult.suggestions.startDate));
      } else if (validationResult.startDate) {
        setStartDate(new Date(validationResult.startDate));
      }

      // Set end date - prefer suggestion for invalid/incomplete goals
      if (isInvalidOrIncomplete && validationResult.suggestions?.endDate) {
        setEndDate(new Date(validationResult.suggestions.endDate));
      } else if (validationResult.endDate) {
        setEndDate(new Date(validationResult.endDate));
      }
    }
  }, [validationResult]);

  const handleSubmit = () => {
    onRetryValidation({
      title: title || undefined,
      description: description || undefined,
      startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
      endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
    });
  };

  const isIncomplete = validationResult?.status === "incomplete";
  const isInvalid = validationResult?.status === "invalid";
  const isValid = validationResult?.status === "valid";

  return (
    <div className="flex w-full h-full justify-center items-start pt-10">
      <div className="flex-col max-w-3xl justify-between items-center w-full space-y-6">
        {/* Back Button */}
        <div className="w-full">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="hover:bg-transparent group"
            disabled={processing}
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-muted-foreground">Kembali</span>
          </Button>
        </div>

        {/* Header with Status */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            {processing && (
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            )}
            {!processing && isValid && (
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            )}
            {!processing && isInvalid && (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
            {!processing && isIncomplete && (
              <AlertCircle className="h-12 w-12 text-amber-500" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-black tracking-tight">
            {processing && "Memvalidasi tujuan Anda..."}
            {!processing && isValid && (
              <>
                Tujuan Valid! <span className="text-green-500">✅</span>
              </>
            )}
            {!processing && isInvalid && "Tujuan perlu diperbaiki"}
            {!processing && isIncomplete && "Validasi Tujuan"}
          </h1>

          {progressMessage && processing && (
            <p className="text-md text-gray-600">{progressMessage}</p>
          )}

          {!processing && (isIncomplete || isInvalid) && (
            <p className="text-md text-gray-600">
              {isInvalid
                ? "Mari perbaiki tujuan Anda agar lebih realistis"
                : "Tambahkan detail yang diperlukan untuk melanjutkan"}
            </p>
          )}
        </div>

        {/* Success State - Valid Goal */}
        {isValid && !processing && (
          <div className="w-full">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Judul Tujuan</p>
                  <p className="font-semibold text-lg">
                    {validationResult?.title}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Deskripsi</p>
                  <p className="text-gray-800">
                    {validationResult?.description}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Periode</p>
                  <p className="text-gray-800">
                    {validationResult?.startDate &&
                      format(
                        new Date(validationResult.startDate),
                        "dd MMMM yyyy"
                      )}{" "}
                    -{" "}
                    {validationResult?.endDate &&
                      format(
                        new Date(validationResult.endDate),
                        "dd MMMM yyyy"
                      )}
                  </p>
                </div>
              </div>
              <div className="flex justify-center pt-2">
                <Badge className="bg-green-100 text-green-700 border-green-300">
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Sedang membuat jadwal...
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Error/Incomplete State */}
        {(isIncomplete || isInvalid) && !processing && (
          <div className="w-full space-y-6">
            {/* Suggestions */}
            {validationResult?.suggestions && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Sparkles className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-blue-800">💡 Saran AI</p>
                    <div className="text-sm text-blue-700 mt-2 space-y-2">
                      {validationResult.suggestions.title && (
                        <div>
                          <span className="font-medium">Judul:</span>{" "}
                          {validationResult.suggestions.title}
                        </div>
                      )}
                      {validationResult.suggestions.description && (
                        <div>
                          <span className="font-medium">Deskripsi:</span>{" "}
                          {validationResult.suggestions.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Judul Tujuan
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Belajar bahasa Jepang dalam 3 bulan"
                  className="h-11"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Deskripsi
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan tujuan Anda secara detail..."
                  className="min-h-[100px] resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Tanggal Mulai
                  </label>
                  <DatePicker
                    selectedDate={startDate}
                    onSelect={setStartDate}
                    label="Pilih Tanggal Mulai"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Tanggal Selesai
                  </label>
                  <DatePicker
                    selectedDate={endDate}
                    onSelect={setEndDate}
                    minDate={startDate}
                    label="Pilih Tanggal Selesai"
                  />
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={
                  !title || !description || !startDate || !endDate || processing
                }
                className="w-full h-12"
                size="lg"
              >
                <Send className="mr-2 h-4 w-4" />
                Validasi Ulang
              </Button>
            </div>

            {/* Note */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-10">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">💡 Tips:</span> Pastikan tujuan
                Anda spesifik, terukur, dan realistis. Durasi maksimal adalah 6
                bulan untuk memastikan fokus dan pencapaian yang optimal.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
