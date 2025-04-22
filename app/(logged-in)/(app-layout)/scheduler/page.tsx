"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Calendar, Check } from "lucide-react";
import { format, differenceInDays, differenceInMonths } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

export default function Page() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputPlaceholder, setInputPlaceholder] = useState(
    "Type your message..."
  );

  // Collected goal data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [recurrence, setRecurrence] = useState("");
  const [availableRecurrences, setAvailableRecurrences] = useState<string[]>(
    []
  );

  const [steps, setSteps] = useState<any[]>([]);
  const [currentFocus, setCurrentFocus] = useState("initial"); // To track what we're asking for

  // New fields for custom recurrence
  const [needsCustomization, setNeedsCustomization] = useState(false);
  const [customizationType, setCustomizationType] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [showDaySelection, setShowDaySelection] = useState(false);
  const [showDateSelection, setShowDateSelection] = useState(false);

  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const monthDates = Array.from({ length: 28 }, (_, i) => i + 1);

  // Update input placeholder based on what's missing
  useEffect(() => {
    if (!title) {
      setInputPlaceholder("What goal would you like to achieve?");
      setCurrentFocus("title");
    } else if (!description || description.length < 30) {
      setInputPlaceholder("Please provide more details about your goal...");
      setCurrentFocus("description");
    } else if (!startDate) {
      setInputPlaceholder(
        "When would you like to start? (e.g., tomorrow, next Monday)"
      );
      setCurrentFocus("startDate");
    } else if (!endDate) {
      setInputPlaceholder(
        "When do you want to complete this goal? (e.g., in 3 months)"
      );
      setCurrentFocus("endDate");
    } else if (!recurrence || recurrence === "NONE") {
      setInputPlaceholder(
        "How often will you work on this? (daily, weekly, monthly, or none)"
      );
      setCurrentFocus("recurrence");
    } else if (
      showDaySelection &&
      (!selectedDays || selectedDays.length === 0)
    ) {
      setInputPlaceholder(
        "Which days of the week would you like to work on this goal?"
      );
      setCurrentFocus("selectedDays");
    } else if (
      showDateSelection &&
      (!selectedDates || selectedDates.length === 0)
    ) {
      setInputPlaceholder(
        "Which dates of the month would you like to work on this goal?"
      );
      setCurrentFocus("selectedDates");
    } else {
      setInputPlaceholder("Anything else you'd like to add about your goal?");
      setCurrentFocus("additional");
    }
  }, [
    title,
    description,
    startDate,
    endDate,
    recurrence,
    selectedDays,
    selectedDates,
    showDaySelection,
    showDateSelection,
  ]);
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const dayDiff = differenceInDays(end, start);
      const monthDiff = differenceInMonths(end, start);

      if (monthDiff >= 2) {
        setAvailableRecurrences(["DAILY", "WEEKLY", "MONTHLY"]);
        setRecurrence(""); // let user pick
      } else if (dayDiff >= 14) {
        setAvailableRecurrences(["WEEKLY"]);
        setRecurrence(""); // let user pick
      } else {
        setAvailableRecurrences(["DAILY"]);
        setRecurrence("DAILY"); // auto-select Daily
      }
    } else {
      setAvailableRecurrences([]);
    }
  }, [startDate, endDate]);

  // Check if we need to show day/date selection based on recurrence and date range
  useEffect(() => {
    if (startDate && endDate && recurrence) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const dayDiff = differenceInDays(end, start);
      const monthDiff = differenceInMonths(end, start);

      if (recurrence === "WEEKLY" && dayDiff >= 14) {
        setShowDaySelection(true);
      } else {
        setShowDaySelection(false);
      }

      if (recurrence === "MONTHLY" && monthDiff >= 2) {
        setShowDateSelection(true);
      } else {
        setShowDateSelection(false);
      }
    } else {
      setShowDaySelection(false);
      setShowDateSelection(false);
    }
  }, [startDate, endDate, recurrence]);

  const sendMessage = async () => {
    // Modified condition to properly handle recurrence selection
    if (
      !input.trim() &&
      currentFocus !== "selectedDays" &&
      currentFocus !== "selectedDates" &&
      !(currentFocus === "recurrence" && recurrence)
    ) {
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      // Create appropriate input for recurrence if needed
      let actualInput = input.trim();

      // If input is empty but we're selecting recurrence, create input text
      if (!actualInput && currentFocus === "recurrence" && recurrence) {
        actualInput = `I want to work on this ${recurrence.toLowerCase()}`;
      }

      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: actualInput,
          title,
          description,
          startDate,
          endDate,
          recurrence,
          currentFocus,
          selectedDays,
          selectedDates,
        }),
      });

      const data = await res.json();
      console.log("Claude raw response:", data); // Debug

      if (!res.ok) {
        throw new Error(data?.error || "Unknown server error");
      }

      const newData = data?.newData || {};
      if (newData.title) setTitle(newData.title);
      if (newData.description) setDescription(newData.description);
      if (newData.startDate) setStartDate(newData.startDate);
      if (newData.endDate) setEndDate(newData.endDate);

      // Recurrence validation
      const validRecurrence = ["NONE", "DAILY", "WEEKLY", "MONTHLY"];
      const newRecurrence = newData.recurrence?.toUpperCase();
      if (validRecurrence.includes(newRecurrence)) {
        setRecurrence(newRecurrence);
      }

      if (data?.steps) {
        setSteps(data.steps);
      }

      // Handle customization options
      if (data.needsCustomization) {
        setNeedsCustomization(true);
        setCustomizationType(data.customizationType);
      }

      setResponse(data.followUp || "All set!");
    } catch (error) {
      console.error("Error:", error);
      setResponse("Something went wrong.");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  // For date selection with the calendar component
  const handleSelectStartDate = (date: Date | undefined) => {
    const formattedDate = date ? format(date, "yyyy-MM-dd") : undefined;
    setStartDate(formattedDate);
    if (formattedDate) {
      setInput(`Start date: ${format(date!, "MMMM d, yyyy")}`);
      sendMessage();
    }
  };

  const handleSelectEndDate = (date: Date | undefined) => {
    const formattedDate = date ? format(date, "yyyy-MM-dd") : undefined;
    setEndDate(formattedDate);
    if (formattedDate) {
      setInput(`End date: ${format(date!, "MMMM d, yyyy")}`);
      sendMessage();
    }
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const handleDateToggle = (date: number) => {
    setSelectedDates((prev) => {
      if (prev.includes(date)) {
        return prev.filter((d) => d !== date);
      } else {
        return [...prev, date];
      }
    });
  };

  const submitDaySelection = () => {
    if (selectedDays.length === 0) {
      setResponse("Please select at least one day of the week.");
      return;
    }

    setInput(`I'll work on this goal on ${selectedDays.join(", ")}.`);
    sendMessage();
  };

  const submitDateSelection = () => {
    if (selectedDates.length === 0) {
      setResponse("Please select at least one date of the month.");
      return;
    }

    const orderedDates = [...selectedDates].sort((a, b) => a - b);
    setInput(
      `I'll work on this goal on the ${orderedDates
        .map(
          (d) => d + (d === 1 ? "st" : d === 2 ? "nd" : d === 3 ? "rd" : "th")
        )
        .join(", ")} of each month.`
    );
    sendMessage();
  };

  // Handle recurrence option selection
  const handleRecurrenceSelect = (option: string) => {
    setRecurrence(option);
    // Important change: Set input with recurrence information before sending
    setInput(`I want to work on this goal ${option.toLowerCase()}`);
    // Call sendMessage directly to process the recurrence selection
    sendMessage();
  };

  return (
    <div className="flex w-full justify-center items-start p-6">
      <div className="max-w-3xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-black tracking-tight">
            What Can I Help You Today?{" "}
            <span className="text-yellow-400">✨</span>
          </h1>
          <p className="text-gray-600">
            Setup your productivity with Kalana 😊
          </p>
        </div>

        {/* Display current goal data */}
        <Card className="p-4">
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>Title:</strong> {title || "Not set"}
            </p>
            <p>
              <strong>Description:</strong> {description || "Not set"}
            </p>
            <p>
              <strong>Start Date:</strong> {startDate || "Not set"}
            </p>
            <p>
              <strong>End Date:</strong> {endDate || "Not set"}
            </p>
            <p>
              <strong>Recurrence:</strong> {recurrence || "Not set"}
            </p>

            {/* Display custom recurrence selections if applicable */}
            {selectedDays.length > 0 && (
              <p>
                <strong>Selected Days:</strong> {selectedDays.join(", ")}
              </p>
            )}

            {selectedDates.length > 0 && (
              <p>
                <strong>Selected Dates:</strong>{" "}
                {selectedDates
                  .sort((a, b) => a - b)
                  .map(
                    (d) =>
                      d +
                      (d === 1 ? "st" : d === 2 ? "nd" : d === 3 ? "rd" : "th")
                  )
                  .join(", ")}
              </p>
            )}
          </div>
        </Card>

        {/* Claude follow-up message */}
        {response && (
          <Card className="p-4 bg-gray-100 text-black whitespace-pre-line">
            <strong className="flex items-center gap-2">
              AI
              <Bot />:
            </strong>{" "}
            {response}
          </Card>
        )}

        {/* Day selection for weekly recurrence */}
        {showDaySelection && currentFocus === "selectedDays" && (
          <Card className="p-4">
            <h3 className="font-medium mb-3">Select days of the week:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
              {weekdays.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day}`}
                    checked={selectedDays.includes(day)}
                    onCheckedChange={() => handleDayToggle(day)}
                  />
                  <label
                    htmlFor={`day-${day}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {day}
                  </label>
                </div>
              ))}
            </div>
            <Button
              onClick={submitDaySelection}
              className="w-full"
              disabled={selectedDays.length === 0}
            >
              <Check className="mr-2 h-4 w-4" /> Confirm Selection
            </Button>
          </Card>
        )}

        {/* Date selection for monthly recurrence */}
        {showDateSelection && currentFocus === "selectedDates" && (
          <Card className="p-4">
            <h3 className="font-medium mb-3">Select dates of the month:</h3>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-4">
              {monthDates.map((date) => (
                <div
                  key={date}
                  onClick={() => handleDateToggle(date)}
                  className={`
                    flex justify-center items-center h-10 w-10 rounded-full cursor-pointer
                    ${
                      selectedDates.includes(date)
                        ? "bg-yellow-400 text-black"
                        : "bg-gray-100 hover:bg-gray-200"
                    }
                  `}
                >
                  {date}
                </div>
              ))}
            </div>
            <Button
              onClick={submitDateSelection}
              className="w-full"
              disabled={selectedDates.length === 0}
            >
              <Check className="mr-2 h-4 w-4" /> Confirm Selection
            </Button>
          </Card>
        )}

        {currentFocus === "startDate" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Calendar className="h-4 w-4" />
                <span className="ml-2">Pick a start date here</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={startDate ? new Date(startDate) : undefined}
                onSelect={handleSelectStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}

        {currentFocus === "endDate" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Calendar className="h-4 w-4" />
                <span className="ml-2">Pick a date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={endDate ? new Date(endDate) : undefined}
                onSelect={handleSelectEndDate}
                initialFocus
                disabled={(date) => {
                  // Disable dates before start date if start date is set
                  if (startDate) {
                    return date < new Date(startDate);
                  }
                  return false;
                }}
              />
            </PopoverContent>
          </Popover>
        )}

        {currentFocus === "recurrence" && availableRecurrences.length > 0 && (
          <div className="mb-4">
            <p className="text-center font-medium mb-3">
              How often will you work on this goal?
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {availableRecurrences.map((option) => (
                <button
                  key={option}
                  onClick={() => handleRecurrenceSelect(option)}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    recurrence === option
                      ? "bg-yellow-400 text-black font-medium"
                      : "bg-white border border-gray-200 text-black hover:bg-gray-100"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Only show text input if not in day/date selection mode */}
        {currentFocus !== "selectedDays" &&
          currentFocus !== "selectedDates" && (
            <Textarea
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={inputPlaceholder}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className={
                currentFocus === "startDate" || currentFocus === "endDate"
                  ? "focus:ring-2 focus:ring-yellow-400"
                  : ""
              }
            />
          )}

        {/* Send button - only show if not in day/date selection mode */}
        {currentFocus !== "selectedDays" &&
          currentFocus !== "selectedDates" && (
            <Button onClick={sendMessage} disabled={loading} className="w-full">
              {loading ? "Thinking..." : "Send"}
            </Button>
          )}

        {/* Steps if all data is filled */}
        {steps.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">🪄 Your Goal Plan:</h2>
            {steps.map((step, index) => (
              <Card key={index} className="p-4 bg-white">
                <h3 className="font-bold">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
                <p className="text-sm text-gray-500">{step.timeline}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
