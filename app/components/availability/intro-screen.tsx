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
          Let&apos;s Find Your Free Time
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We&apos;ll ask a few quick questions to understand your preferred
          schedule and help you make the most of your available time.
        </p>
      </div>

      <div className="bg-violet-50 rounded-lg p-6 max-w-md mx-auto">
        <h3 className="font-semibold text-gray-800 mb-2">
          What we&apos;ll cover:
        </h3>
        <ul className="text-sm text-gray-600 space-y-1 text-left">
          <li>• Your general schedule pattern</li>
          <li>• Preferred time blocks</li>
          <li>• Busy periods to avoid</li>
          <li>• Any special preferences</li>
        </ul>
      </div>

      <Button
        onClick={onNext}
        size="lg"
        className="bg-violet-600 hover:bg-violet-700 text-white px-8"
      >
        Get Started
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>
    </div>
  );
}
