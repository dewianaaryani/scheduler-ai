"use client";

import { CheckCircle } from "lucide-react";
import { AvailabilityData } from ".";

interface DailyBusyBlocksProps {
  data: AvailabilityData;
  updateData: (updates: Partial<AvailabilityData>) => void;
  onNext: () => void;
}

const timeBlocks = [
  { id: "6-9", label: "6:00 – 9:00 AM", period: "Early Morning" },
  { id: "9-12", label: "9:00 – 12:00 PM", period: "Morning" },
  { id: "12-15", label: "12:00 – 3:00 PM", period: "Afternoon" },
  { id: "15-18", label: "3:00 – 6:00 PM", period: "Late Afternoon" },
  { id: "18-21", label: "6:00 – 9:00 PM", period: "Evening" },
  { id: "21-24", label: "9:00 PM – 12:00 AM", period: "Night" },
];

export default function DailyBusyBlocks({
  data,
  updateData,
}: DailyBusyBlocksProps) {
  const toggleTimeBlock = (blockId: string) => {
    const current = data.dailyBusyBlocks || [];
    const updated = current.includes(blockId)
      ? current.filter((id) => id !== blockId)
      : [...current, blockId];
    updateData({ dailyBusyBlocks: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Select your daily busy blocks
        </h2>
        <p className="text-gray-600">
          Choose the time blocks when you&apos;re typically busy every day.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-3 max-w-3xl mx-auto">
        {timeBlocks.map((block) => {
          const isSelected = data.dailyBusyBlocks?.includes(block.id);
          return (
            <button
              key={block.id}
              onClick={() => toggleTimeBlock(block.id)}
              className={`group relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                isSelected
                  ? "bg-red-50 border-red-300 text-red-700"
                  : "bg-gray-50 border-gray-200 hover:border-red-300 hover:bg-red-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{block.label}</div>
                  <div className="text-sm opacity-75">{block.period}</div>
                </div>
                {isSelected && <CheckCircle className="h-5 w-5 text-red-600" />}
              </div>
              {isSelected && (
                <div className="absolute top-1 right-1 bg-red-500 rounded-full p-0.5">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
