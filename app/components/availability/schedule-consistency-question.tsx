"use client";

import { Calendar, RotateCcw } from "lucide-react";
import { AvailabilityData } from ".";

interface ScheduleConsistencyQuestionProps {
  data: AvailabilityData;
  updateData: (updates: Partial<AvailabilityData>) => void;
  onNext: () => void;
}

export default function ScheduleConsistencyQuestion({
  data,
  updateData,
  onNext,
}: ScheduleConsistencyQuestionProps) {
  const handleSelection = (sameScheduleDaily: boolean) => {
    updateData({ sameScheduleDaily });
    setTimeout(onNext, 300);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Apakah jadwalmu sama setiap hari?
        </h2>
        <p className="text-gray-600">
          Ini membantu kami memahami apakah waktu sibukmu konsisten atau bervariasi
          tiap hari.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <button
          onClick={() => handleSelection(true)}
          className={`group relative overflow-hidden rounded-xl border-2 p-6 transition-all duration-300 ${
            data.sameScheduleDaily === true
              ? "bg-gradient-to-br from-violet-100 to-violet-200 border-violet-500 shadow-lg"
              : "bg-gray-50 border-gray-200 hover:border-violet-300 hover:bg-violet-50"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className={`p-4 rounded-full transition-colors ${
                data.sameScheduleDaily === true
                  ? "bg-violet-200"
                  : "bg-gray-100"
              }`}
            >
              <RotateCcw
                className={`h-8 w-8 ${
                  data.sameScheduleDaily === true
                    ? "text-violet-600"
                    : "text-gray-500"
                }`}
              />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                Ya, sama setiap hari
              </h3>
              <p className="text-sm text-gray-600">
                Waktu sibuk saya konsisten di semua hari
              </p>
            </div>
          </div>
          {data.sameScheduleDaily === true && (
            <div className="absolute top-2 right-2 bg-violet-500 rounded-full p-1">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </button>

        <button
          onClick={() => handleSelection(false)}
          className={`group relative overflow-hidden rounded-xl border-2 p-6 transition-all duration-300 ${
            data.sameScheduleDaily === false
              ? "bg-gradient-to-br from-violet-100 to-violet-200 border-violet-500 shadow-lg"
              : "bg-gray-50 border-gray-200 hover:border-violet-300 hover:bg-violet-50"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className={`p-4 rounded-full transition-colors ${
                data.sameScheduleDaily === false
                  ? "bg-violet-200"
                  : "bg-gray-100"
              }`}
            >
              <Calendar
                className={`h-8 w-8 ${
                  data.sameScheduleDaily === false
                    ? "text-violet-600"
                    : "text-gray-500"
                }`}
              />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                Tidak, berbeda tiap hari
              </h3>
              <p className="text-sm text-gray-600">
                Jadwal saya berbeda di hari yang berbeda
              </p>
            </div>
          </div>
          {data.sameScheduleDaily === false && (
            <div className="absolute top-2 right-2 bg-violet-500 rounded-full p-1">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
