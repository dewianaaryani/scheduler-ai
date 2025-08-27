// components/goal/initial-view.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, AlertCircle } from "lucide-react";
import { useState } from "react";
import SuggestionList from "./suggestion-list";

interface InitialViewProps {
  username: string;
  onSubmit: (value: string) => void;
  error?: string | null;
}

export default function InitialView({ username, onSubmit, error }: InitialViewProps) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSubmit(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex w-full h-full justify-center items-start pt-10">
      <div className="flex-col h-full max-w-3xl justify-between items-center w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-black tracking-tight">
            Hai, {username}!
            <br />
            Apa yang bisa saya bantu hari ini?{" "}
            <span className="text-yellow-400">✨</span>
          </h1>
          <p className="text-md text-gray-600">
            Atur produktivitasmu dengan Kalana 😊
          </p>
        </div>

        <div className="flex gap-4 w-full items-center">
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-sm">
              Berikut saran tujuan berdasarkan aktivitas
              sebelumnya
            </h2>

            <SuggestionList onSelectSuggestion={onSubmit} />
          </div>
        </div>

        <div className="space-y-2 w-full">
          <div className="relative w-full">
            <Textarea
              className="pr-20 min-h-[100px]"
              placeholder="Saya ingin..."
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
          
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-red-800">Terjadi Kesalahan</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">⚠️ Catatan:</span> Durasi maksimal untuk setiap tujuan adalah 6 bulan. 
              Sistem akan membuat jadwal harian otomatis untuk membantu Anda mencapai tujuan tepat waktu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
