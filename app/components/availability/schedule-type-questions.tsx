"use client";
import { Calendar, Clock } from "lucide-react";
import { AvailabilityData } from ".";

interface ScheduleTypeQuestionProps {
  data: AvailabilityData;
  updateData: (updates: Partial<AvailabilityData>) => void;
  onNext: () => void;
}

export default function ScheduleTypeQuestion({
  data,
  updateData,
  onNext,
}: ScheduleTypeQuestionProps) {
  const handleSelection = (hasRegularSchedule: boolean) => {
    updateData({ hasRegularSchedule });
    setTimeout(onNext, 300); // Small delay for visual feedback
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Do you have a regular schedule?
        </h2>
        <p className="text-gray-600">
          This helps us understand if you have consistent busy times or if your
          availability varies.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <button
          onClick={() => handleSelection(false)}
          className={`group relative overflow-hidden rounded-xl border-2 p-6 transition-all duration-300 ${
            data.hasRegularSchedule === false
              ? "bg-gradient-to-br from-violet-100 to-violet-200 border-violet-500 shadow-lg"
              : "bg-gray-50 border-gray-200 hover:border-violet-300 hover:bg-violet-50"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className={`p-4 rounded-full transition-colors ${
                data.hasRegularSchedule === false
                  ? "bg-violet-200"
                  : "bg-gray-100"
              }`}
            >
              <Clock
                className={`h-8 w-8 ${
                  data.hasRegularSchedule === false
                    ? "text-violet-600"
                    : "text-gray-500"
                }`}
              />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                No, I&apos;m completely flexible
              </h3>
              <p className="text-sm text-gray-600">
                I&apos;m always available or have no fixed schedule
              </p>
            </div>
          </div>
          {data.hasRegularSchedule === false && (
            <div className="absolute top-2 right-2 bg-violet-500 rounded-full p-1">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </button>

        <button
          onClick={() => handleSelection(true)}
          className={`group relative overflow-hidden rounded-xl border-2 p-6 transition-all duration-300 ${
            data.hasRegularSchedule === true
              ? "bg-gradient-to-br from-violet-100 to-violet-200 border-violet-500 shadow-lg"
              : "bg-gray-50 border-gray-200 hover:border-violet-300 hover:bg-violet-50"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className={`p-4 rounded-full transition-colors ${
                data.hasRegularSchedule === true
                  ? "bg-violet-200"
                  : "bg-gray-100"
              }`}
            >
              <Calendar
                className={`h-8 w-8 ${
                  data.hasRegularSchedule === true
                    ? "text-violet-600"
                    : "text-gray-500"
                }`}
              />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                Yes, I have busy times
              </h3>
              <p className="text-sm text-gray-600">
                I have some busy periods during the day or week
              </p>
            </div>
          </div>
          {data.hasRegularSchedule === true && (
            <div className="absolute top-2 right-2 bg-violet-500 rounded-full p-1">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
