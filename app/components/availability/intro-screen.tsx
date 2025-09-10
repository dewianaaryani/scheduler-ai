"use client";

import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
import { AvailabilityData } from ".";

interface IntroScreenProps {
  data: AvailabilityData;
  updateData: (updates: Partial<AvailabilityData>) => void;
  onNext: () => void;
}

export default function IntroScreen({ onNext }: IntroScreenProps) {
  return (
    <div className="text-center space-y-6">
      <div className="bg-violet-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
        <Clock className="h-10 w-10 text-violet-600" />
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">
          Mari sesuaikan preferensi waktumu
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Kami akan menanyakan beberapa pertanyaan singkat untuk memahami
          keseharian jadwalmu.
        </p>
      </div>

      <Button
        onClick={onNext}
        size="lg"
        className="bg-violet-600 hover:bg-violet-700 text-white px-8"
      >
        Mulai
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>
    </div>
  );
}
