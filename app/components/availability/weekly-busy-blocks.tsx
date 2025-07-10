"use client";

import { CheckCircle } from "lucide-react";
import { AvailabilityData } from ".";

interface WeeklyBusyBlocksProps {
  data: AvailabilityData;
  updateData: (updates: Partial<AvailabilityData>) => void;
  onNext: () => void;
}

const timeBlocks = [
  { id: "6-9", label: "6–9 AM" },
  { id: "9-12", label: "9–12 PM" },
  { id: "12-15", label: "12–3 PM" },
  { id: "15-18", label: "3–6 PM" },
  { id: "18-21", label: "6–9 PM" },
  { id: "21-24", label: "9–12 PM" },
];

const weekDays = [
  { id: "monday", label: "Mon", full: "Monday" },
  { id: "tuesday", label: "Tue", full: "Tuesday" },
  { id: "wednesday", label: "Wed", full: "Wednesday" },
  { id: "thursday", label: "Thu", full: "Thursday" },
  { id: "friday", label: "Fri", full: "Friday" },
  { id: "saturday", label: "Sat", full: "Saturday" },
  { id: "sunday", label: "Sun", full: "Sunday" },
];

export default function WeeklyBusyBlocks({
  data,
  updateData,
}: WeeklyBusyBlocksProps) {
  const toggleTimeBlock = (day: string, blockId: string) => {
    const current = data.weeklyBusyBlocks || {};
    const dayBlocks = current[day] || [];
    const updated = dayBlocks.includes(blockId)
      ? dayBlocks.filter((id) => id !== blockId)
      : [...dayBlocks, blockId];

    updateData({
      weeklyBusyBlocks: {
        ...current,
        [day]: updated,
      },
    });
  };

  const isBlockSelected = (day: string, blockId: string) => {
    return data.weeklyBusyBlocks?.[day]?.includes(blockId) || false;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Select your busy blocks per day
        </h2>
        <p className="text-gray-600">
          Choose the time blocks when you&apos;re busy for each day of the week.
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px] bg-white rounded-lg border border-gray-200 p-4">
          {/* Header */}
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="text-sm font-medium text-gray-600 p-2">Time</div>
            {weekDays.map((day) => (
              <div key={day.id} className="text-center">
                <div className="text-sm font-medium text-gray-800">
                  {day.label}
                </div>
                <div className="text-xs text-gray-500">{day.full}</div>
              </div>
            ))}
          </div>

          {/* Time blocks grid */}
          <div className="space-y-2">
            {timeBlocks.map((block) => (
              <div key={block.id} className="grid grid-cols-8 gap-2">
                <div className="text-sm text-gray-600 p-2 font-medium">
                  {block.label}
                </div>
                {weekDays.map((day) => {
                  const isSelected = isBlockSelected(day.id, block.id);
                  return (
                    <button
                      key={`${day.id}-${block.id}`}
                      onClick={() => toggleTimeBlock(day.id, block.id)}
                      className={`h-12 rounded-md border-2 transition-all duration-200 relative ${
                        isSelected
                          ? "bg-red-100 border-red-300 hover:bg-red-200"
                          : "bg-gray-50 border-gray-200 hover:border-red-300 hover:bg-red-50"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle className="h-4 w-4 text-red-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
