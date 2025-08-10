// components/goal/date-picker.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DatePickerProps {
  selectedDate?: Date;
  onSelect: (date: Date | undefined) => void;
  minDate?: Date;
  label: string;
  maxMonthsFromMinDate?: number; // For end date, limit to X months from start date
  showNote?: boolean; // Show note about maximum duration
}

export default function DatePicker({
  selectedDate,
  onSelect,
  minDate,
  label,
  maxMonthsFromMinDate = 6,
  showNote = false,
}: DatePickerProps) {
  // Calculate minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  // Calculate maximum date based on minDate if provided, otherwise 4 months from now
  const calculateMaxDate = () => {
    if (minDate) {
      // If we have a minDate (for end date picker), max is 6 months from that minDate
      const maxFromMinDate = new Date(minDate);
      maxFromMinDate.setMonth(maxFromMinDate.getMonth() + maxMonthsFromMinDate);
      maxFromMinDate.setHours(23, 59, 59, 999);
      return maxFromMinDate;
    } else {
      // For start date picker, max is 6 months from tomorrow
      const maxDate = new Date(tomorrow);
      maxDate.setMonth(maxDate.getMonth() + 6);
      maxDate.setHours(23, 59, 59, 999);
      return maxDate;
    }
  };
  
  const maxDate = calculateMaxDate();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate ? "text-muted-foreground" : ""
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP") : label}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        {showNote && (
          <div className="p-3 border-b bg-yellow-50 text-sm text-yellow-800">
            <p className="font-medium">⚠️ Catatan:</p>
            <p>Durasi maksimal tujuan adalah 6 bulan.</p>
          </div>
        )}
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelect}
          initialFocus
          disabled={(date) => {
            // Disable dates before tomorrow
            if (date < tomorrow) {
              return true;
            }
            
            // Disable dates after the calculated max date
            if (date > maxDate) {
              return true;
            }
            
            // If minDate is provided, also disable dates before it
            if (minDate && date < minDate) {
              return true;
            }
            
            return false;
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
