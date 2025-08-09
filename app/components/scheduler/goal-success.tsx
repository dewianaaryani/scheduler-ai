// components/goal/goal-success.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Goal } from "@/app/lib/types";
import { useState } from "react";
import ProgressLoader from "./progress-loader";

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
      console.error("Gagal membuat ulang tujuan", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <ProgressLoader 
        isLoading={generating} 
        message="Menyimpan tujuan..."
      />
      <div className="flex-col w-full p-6">
        <h1 className="text-2xl font-bold mb-4 flex items-center">
          {goal.emoji} {goal.title}
        </h1>
      <p className="mb-6 text-gray-600">{goal.description}</p>

      <div className="flex justify-between text-sm text-gray-500 mb-6">
        <div>Mulai: {new Date(goal.startDate).toLocaleDateString("id-ID", { 
          weekday: "long", 
          day: "numeric", 
          month: "long", 
          year: "numeric",
          timeZone: "Asia/Jakarta"
        })}</div>
        <div>Selesai: {new Date(goal.endDate).toLocaleDateString("id-ID", { 
          weekday: "long", 
          day: "numeric", 
          month: "long", 
          year: "numeric",
          timeZone: "Asia/Jakarta"
        })}</div>
      </div>

      <h2 className="text-xl font-semibold mb-3">Langkah-langkah untuk Mencapai Tujuan Ini</h2>
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
                {`${new Date(step.startedTime).toLocaleDateString("id-ID", { weekday: "long", timeZone: "Asia/Jakarta" })}, ${new Date(step.startedTime).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" })}`}
                <br />
                {`Pukul ${new Date(step.startedTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jakarta" })} - ${new Date(step.endTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jakarta" })} WIB`}
              </div>
              <div>{step.percentComplete}% selesai</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between pb-10">
        <Button onClick={onCreateAnother} variant="outline">
          Batal
        </Button>
        <Button onClick={handleGenerate} disabled={generating}>
          {generating ? "Sedang Membuat..." : "Buat Tujuan"}
        </Button>
      </div>
      </div>
    </>
  );
}
