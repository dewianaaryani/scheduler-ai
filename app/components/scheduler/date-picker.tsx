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
}

export default function DatePicker({
  selectedDate,
  onSelect,
  minDate,
  label,
}: DatePickerProps) {
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
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelect}
          initialFocus
          disabled={(date) => {
            // Disable dates before minDate if provided
            if (minDate) {
              return date < minDate;
            }
            // Otherwise disable dates in the past
            return date < new Date(new Date().setHours(0, 0, 0, 0));
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
