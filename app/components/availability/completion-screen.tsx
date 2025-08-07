"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, ArrowRight } from "lucide-react";
import { AvailabilityData } from ".";

interface CompletionScreenProps {
  data: AvailabilityData;
  onComplete: () => void;
  isLoading?: boolean;
}

export default function CompletionScreen({
  data,
  onComplete,
  isLoading,
}: CompletionScreenProps) {
  const getSummary = () => {
    const summary = [];

    if (data.hasRegularSchedule === false) {
      if (data.wantsPreferredBlocks && data.preferredTimeBlocks?.length) {
        summary.push(
          `Waktu preferensi: ${data.preferredTimeBlocks.length} blok waktu dipilih`
        );
      } else {
        summary.push("Tersedia kapan saja");
      }
    } else {
      if (data.sameScheduleDaily) {
        summary.push(
          `Blok sibuk harian: ${data.dailyBusyBlocks?.length || 0} blok waktu`
        );
      } else {
        const totalBusyBlocks = Object.values(
          data.weeklyBusyBlocks || {}
        ).flat().length;
        summary.push(
          `Blok sibuk mingguan: ${totalBusyBlocks} blok waktu dalam seminggu`
        );
      }
    }

    if (data.notes) {
      summary.push("Preferensi tambahan dicatat");
    }

    return summary;
  };

  return (
    <div className="text-center space-y-6">
      <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">Selesai!</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Kami telah menyimpan preferensi ketersediaanmu dan siap
          membantumu menjadwalkan dengan lebih efektif.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-violet-600" />
          Ringkasan Preferensimu
        </h3>
        <ul className="text-sm text-gray-600 space-y-2 text-left">
          {getSummary().map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <Button
          onClick={onComplete}
          size="lg"
          disabled={isLoading}
          className="bg-violet-600 hover:bg-violet-700 text-white px-8 disabled:opacity-50"
        >
          {isLoading ? "Menyimpan..." : "Simpan Preferensi"}
          {!isLoading && <ArrowRight className="h-5 w-5 ml-2" />}
        </Button>

        <p className="text-sm text-gray-500">
          Kamu dapat memperbarui preferensi ini kapan saja di pengaturan.
        </p>
      </div>
    </div>
  );
}
