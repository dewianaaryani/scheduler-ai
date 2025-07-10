"use client";

import { Button } from "@/components/ui/button";
import { Clock, CheckCircle } from "lucide-react";
import { AvailabilityData } from ".";

interface FlexibleTimeBlocksProps {
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

export default function FlexibleTimeBlocks({
  data,
  updateData,
  onNext,
}: FlexibleTimeBlocksProps) {
  const handleWantsBlocks = (wants: boolean) => {
    updateData({ wantsPreferredBlocks: wants });
    if (!wants) {
      setTimeout(onNext, 300);
    }
  };

  const toggleTimeBlock = (blockId: string) => {
    const current = data.preferredTimeBlocks || [];
    const updated = current.includes(blockId)
      ? current.filter((id) => id !== blockId)
      : [...current, blockId];
    updateData({ preferredTimeBlocks: updated });
  };

  if (data.wantsPreferredBlocks === null) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Do you want to select preferred time blocks?
          </h2>
          <p className="text-gray-600">
            Even though you&apos;re flexible, you might still have preferred
            times for scheduling.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <Button
            onClick={() => handleWantsBlocks(true)}
            variant="outline"
            className="h-20 border-violet-300 hover:bg-violet-50 hover:border-violet-400"
          >
            <div className="text-center">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-violet-600" />
              <div className="font-medium">
                Yes, I want to select preferred times
              </div>
            </div>
          </Button>

          <Button
            onClick={() => handleWantsBlocks(false)}
            variant="outline"
            className="h-20 border-gray-300 hover:bg-gray-50"
          >
            <div className="text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-gray-500" />
              <div className="font-medium">No, I&apos;m available anytime</div>
            </div>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Select your preferred time blocks
        </h2>
        <p className="text-gray-600">
          Choose the times when you&apos;d prefer to have activities scheduled.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-3 max-w-3xl mx-auto">
        {timeBlocks.map((block) => {
          const isSelected = data.preferredTimeBlocks?.includes(block.id);
          return (
            <button
              key={block.id}
              onClick={() => toggleTimeBlock(block.id)}
              className={`group relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                isSelected
                  ? "bg-violet-100 border-violet-500 text-violet-700"
                  : "bg-gray-50 border-gray-200 hover:border-violet-300 hover:bg-violet-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{block.label}</div>
                  <div className="text-sm opacity-75">{block.period}</div>
                </div>
                {isSelected && (
                  <CheckCircle className="h-5 w-5 text-violet-600" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
