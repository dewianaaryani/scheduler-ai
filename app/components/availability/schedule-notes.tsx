"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { AvailabilityData } from ".";

interface ScheduleNotesProps {
  data: AvailabilityData;
  updateData: (updates: Partial<AvailabilityData>) => void;
  onNext: () => void;
}

export default function ScheduleNotes({
  data,
  updateData,
}: ScheduleNotesProps) {
  const handleNotesChange = (notes: string) => {
    updateData({ notes });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="bg-violet-100 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <MessageSquare className="h-8 w-8 text-violet-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Any scheduling preferences or notes?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Share any additional preferences, constraints, or notes that would
          help us schedule things better for you.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <Label htmlFor="notes" className="text-gray-700 font-medium">
          Additional Notes (Optional)
        </Label>
        <Textarea
          id="notes"
          value={data.notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="e.g. Only available on weekends, avoid mornings, prefer after 6 PM, need 30 min breaks between meetings..."
          className="min-h-[120px] bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-400 focus-visible:ring-violet-500"
        />

        <div className="text-sm text-gray-500">
          <p className="mb-2">Examples of helpful notes:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Time zone preferences</li>
            <li>Break requirements</li>
            <li>Energy levels at different times</li>
            <li>Commute considerations</li>
            <li>Family or personal commitments</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
