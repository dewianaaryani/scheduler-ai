"use client";

import { Button } from "@/components/ui/button";
import { Clock, CheckCircle } from "lucide-react";
import { AvailabilityData } from ".";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FlexibleTimeBlocksProps {
  data: AvailabilityData;
  updateData: (updates: Partial<AvailabilityData>) => void;
  onNext: () => void;
}

const timeBlocks = [
  { id: "6-9", label: "6:00 – 9:00", period: "Pagi Sekali" },
  { id: "9-12", label: "9:00 – 12:00", period: "Pagi" },
  { id: "12-15", label: "12:00 – 15:00", period: "Siang" },
  { id: "15-18", label: "15:00 – 18:00", period: "Sore" },
  { id: "18-21", label: "18:00 – 21:00", period: "Malam" },
  { id: "21-24", label: "21:00 – 00:00", period: "Malam Larut" },
];

export default function FlexibleTimeBlocks({
  data,
  updateData,
  onNext,
}: FlexibleTimeBlocksProps) {
  const handleWantsBlocks = (wants: boolean) => {
    updateData({ wantsPreferredBlocks: wants });
    if (!wants) {
      // Auto-advance only when selecting "tidak tersedia kapan saja"
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
      <TooltipProvider>
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Apakah kamu ingin memilih blok waktu preferensi?
            </h2>
            <p className="text-gray-600">
              Meskipun kamu fleksibel, kamu bisa memiliki waktu preferensi untuk
              penjadwalan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() => handleWantsBlocks(true)}
                  variant="outline"
                  className="h-30 w-70 mx-auto border-violet-300 hover:bg-violet-50 hover:border-violet-400"
                >
                  <div className="text-center">
                    <CheckCircle
                      size={30}
                      className="mx-auto mb-2 text-violet-600"
                    />
                    <div className="font-semibold text-md">
                      Ya, saya ingin memilih waktu preferensi
                    </div>
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm" side="bottom">
                Cont di jam 6-12, 12.00 - 15.00, dst
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() => handleWantsBlocks(false)}
                  variant="outline"
                  className="h-30 w-70 mx-auto border-gray-300 hover:bg-gray-50"
                >
                  <div className="text-center">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                    <div className="font-semibold text-md">
                      Tidak, saya tersedia kapan saja
                    </div>
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm" side="bottom">
                Menyerahkan seluruhnya ke sistem
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Pilih blok waktu preferensimu
        </h2>
        <p className="text-gray-600">
          Pilih waktu ketika kamu lebih suka untuk menjadwalkan aktivitas.
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
