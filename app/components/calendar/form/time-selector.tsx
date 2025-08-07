import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  showCalendar?: boolean;
  placeholder?: string;
}

export function TimePicker({
  value,
  onChange,
  showCalendar = true,
  placeholder = "Select date and time",
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);

  // Sync internal state with external value
  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  // Handle calendar date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const newDate = new Date(date);
    // If we already have a time from the existing selection, preserve it
    if (selectedDate) {
      newDate.setHours(selectedDate.getHours());
      newDate.setMinutes(selectedDate.getMinutes());
    } else {
      // Default to current time if no previous selection
      const now = new Date();
      newDate.setHours(now.getHours());
      newDate.setMinutes(now.getMinutes());
    }

    setSelectedDate(newDate);
    onChange(newDate);
  };

  // Handle hour selection (24-hour format)
  const handleHourSelect = (hour: number) => {
    if (!selectedDate) {
      const now = new Date();
      setSelectedDate(now);
      return;
    }

    const newDate = new Date(selectedDate);
    newDate.setHours(hour);

    setSelectedDate(newDate);
    onChange(newDate);
  };

  // Handle minute selection
  const handleMinuteSelect = (minute: number) => {
    if (!selectedDate) {
      const now = new Date();
      setSelectedDate(now);
      return;
    }

    const newDate = new Date(selectedDate);
    newDate.setMinutes(minute);

    setSelectedDate(newDate);
    onChange(newDate);
  };


  // Get display hour in 24-hour format
  const getDisplayHour = (date: Date) => {
    return date.getHours();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full pl-3 text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          {selectedDate ? (
            format(selectedDate, showCalendar ? "PPP HH:mm" : "HH:mm")
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col sm:flex-row">
          {/* Calendar for date selection */}
          {showCalendar && (
            <div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </div>
          )}

          {/* Time picker section */}
          <div className="border-t sm:border-t-0 sm:border-l p-3">
            <div className="text-center font-medium mb-2">Waktu</div>

            {/* Hours */}
            <div className="mb-4">
              <div className="text-sm text-muted-foreground mb-1">Jam</div>
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <Button
                    key={hour}
                    size="sm"
                    variant={
                      selectedDate && getDisplayHour(selectedDate) === hour
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleHourSelect(hour)}
                    className="h-8"
                  >
                    {hour.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
            </div>

            {/* Minutes */}
            <div className="mb-4">
              <div className="text-sm text-muted-foreground mb-1">Menit</div>
              <div className="grid grid-cols-4 gap-1">
                {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(
                  (minute) => (
                    <Button
                      key={minute}
                      size="sm"
                      variant={
                        selectedDate && selectedDate.getMinutes() === minute
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleMinuteSelect(minute)}
                      className="h-8"
                    >
                      {minute.toString().padStart(2, "0")}
                    </Button>
                  )
                )}
              </div>
            </div>

            {/* AM/PM section removed for 24-hour format */}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
