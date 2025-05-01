"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { Goal } from "@/app/lib/types";

type Suggestion = {
  emoji: string;
  title: string;
};

type AIResponse = {
  dataGoals?: Goal;
  message?: string;
  error?: string | null;
  title?: string | null;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
};

export default function Page() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [processingAI, setProcessingAI] = useState(false);

  const [inputPlaceholder, setInputPlaceholder] = useState(
    "Type your message..."
  );
  const [input, setInput] = useState("");

  const [currentFocus, setCurrentFocus] = useState("initialValue"); // To track what we're asking for
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [initialValue, setInitialValue] = useState("");
  const [goalCreated, setGoalCreated] = useState(false);
  const [username, setUsername] = useState("User");

  // Get username on load
  useEffect(() => {
    // You would typically get this from your auth system
    // For now, we'll use a placeholder
    const fetchUserData = async () => {
      try {
        // This would be replaced with your actual user data fetch
        // const res = await fetch("/api/user");
        // const data = await res.json();
        // setUsername(data.name);
        setUsername("User"); // Placeholder
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!initialValue) {
      setCurrentFocus("initialValue");
    } else if (!title) {
      setInputPlaceholder("What goal would you like to achieve?");
      setCurrentFocus("title");
    } else if (!description) {
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
    } else if (!goalCreated) {
      // When all data is collected, send to AI
      sendGoalDataToAI();
    }
  }, [initialValue, title, description, startDate, endDate, goalCreated]);

  useEffect(() => {
    if (
      initialValue &&
      !title &&
      !description &&
      !startDate &&
      !endDate &&
      !goalCreated
    ) {
      sendGoalDataToAI(); // Give Claude a chance to extract info from the user's input
    }
  }, [initialValue]);

  const handleSubmit = () => {
    if (!input.trim()) return;

    if (currentFocus === "initialValue") {
      setInitialValue(input);
      setInput(""); // Clear input
    } else if (currentFocus === "title") {
      setTitle(input);
      setInput(""); // Clear input
    } else if (currentFocus === "description") {
      setDescription(input);
      setInput("");
    } else if (currentFocus === "startDate" || currentFocus === "endDate") {
      // Ignore here — dates are selected via calendar
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents form from reloading the page
      handleSubmit();
    }
  };

  const handleRetry = () => {
    // Reset error and try processing again
    setError(null);
    sendGoalDataToAI();
  };

  const sendGoalDataToAI = async () => {
    if (processingAI) return;

    try {
      setProcessingAI(true);
      setError(null);

      const payload = {
        initialValue,
        title: title || null,
        description: description || null,
        startDate: startDate || null,
        endDate: endDate || null,
      };

      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get AI response");
      }

      const data = await response.json();
      setAiResponse(data);

      // If we got back a complete goal plan
      if (data.dataGoals) {
        setGoalCreated(true);
        toast("Goal Created!");
      }
      // If AI suggested updates to our fields
      else if (
        data.title ||
        data.description ||
        data.startDate ||
        data.endDate
      ) {
        if (data.title && !title) setTitle(data.title);
        if (data.description && !description) setDescription(data.description);
        if (data.startDate && !startDate)
          setStartDate(new Date(data.startDate));
        if (data.endDate && !endDate) setEndDate(new Date(data.endDate));
      }
    } catch (err: any) {
      console.error("AI Processing Error:", err);
      setError(err.message || "Failed to process your goal");
      toast.error(err.message || "There was a problem processing your goal");
    } finally {
      setProcessingAI(false);
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch("/api/ai-chat");

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch suggestions");
        }

        const data = await res.json();
        setSuggestions(data);
      } catch (err: any) {
        console.error("Suggestion Fetch Error:", err);
        setError(err.message);
        toast("Couldn't load suggestions");
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  // Render goal creation complete view
  if (goalCreated && aiResponse?.dataGoals) {
    return (
      <div className="flex w-full h-full">
        <div className="flex-col w-full p-6">
          <h1 className="text-2xl font-bold mb-4 flex items-center">
            {aiResponse.dataGoals.emoji} {aiResponse.dataGoals.title}
          </h1>
          <p className="mb-6 text-gray-600">
            {aiResponse.dataGoals.description}
          </p>

          <div className="flex justify-between text-sm text-gray-500 mb-6">
            <div>
              Starts:{" "}
              {new Date(aiResponse.dataGoals.startDate).toLocaleDateString()}
            </div>
            <div>
              Ends:{" "}
              {new Date(aiResponse.dataGoals.endDate).toLocaleDateString()}
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-3">
            Steps to Achieve This Goal
          </h2>
          <div className="space-y-4">
            {aiResponse.dataGoals.schedules.map((step, index) => (
              <div key={index} className="p-4 border rounded-md">
                <div className="flex items-center gap-2">
                  <div>{step.emoji}</div>
                  <h3 className="font-medium">{step.title}</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600">{step.description}</p>
                <div className="mt-3 flex justify-between text-xs text-gray-500">
                  <div>
                    {new Date(step.startedTime).toLocaleDateString()} -{" "}
                    {new Date(step.endTime).toLocaleDateString()}
                  </div>
                  <div>{step.percentComplete} complete</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={() => {
                setGoalCreated(false);
                setInitialValue("");
                setTitle("");
                setDescription("");
                setStartDate(undefined);
                setEndDate(undefined);
                setAiResponse(null);
                setCurrentFocus("initialValue");
              }}
            >
              Create Another Goal
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full">
      {/* Initial View */}
      {currentFocus === "initialValue" ? (
        <div className="flex w-full h-full justify-center items-start pt-10">
          <div className="flex-col h-full max-w-3xl justify-between items-center w-full space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-black tracking-tight">
                Hi There, {username}!
                <br />
                What Can I Help You Today?{" "}
                <span className="text-yellow-400">✨</span>
              </h1>
              <p className="text-md text-gray-600">
                Setup your productivity with Kalana 😊
              </p>
            </div>

            <div className="flex gap-4 w-full items-center">
              <div className="flex flex-col gap-2 w-full">
                <h2 className="text-sm">
                  Here are suggestions for your goals based on your previous
                  activities
                </h2>

                {loading ? (
                  <div className="flex items-center justify-center p-6 text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <p>Loading suggestions...</p>
                  </div>
                ) : error ? (
                  <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-600">
                    <p>{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setError(null);
                        setLoading(true);

                        // Retry fetching suggestions
                        fetch("/api/ai-chat")
                          .then((res) => res.json())
                          .then((data) => {
                            setSuggestions(data);
                            setLoading(false);
                          })
                          .catch((err) => {
                            setError(err.message);
                            setLoading(false);
                          });
                      }}
                      className="mt-2"
                    >
                      Retry
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    {suggestions.length > 0 ? (
                      suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            setInitialValue(
                              `${suggestion.emoji} ${suggestion.title}`
                            )
                          }
                          className="relative flex flex-col p-4 border shadow-sm hover:shadow-xl rounded-sm items-start text-left w-full transition-all duration-200"
                        >
                          <p className="text-sm font-semibold">
                            {suggestion.title}
                          </p>
                          <div className="mt-auto self-end text-xl">
                            {suggestion.emoji}
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 p-4">
                        No suggestions available. Start by creating your first
                        goal!
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="relative w-full">
              <Textarea
                className="pr-20 min-h-[100px]"
                placeholder="I want to..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                size="sm"
                className="absolute bottom-2 right-2 rounded-md"
                onClick={handleSubmit}
                type="button"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full h-full justify-center items-center">
          <div className="flex-col max-w-md w-full space-y-6">
            {/* response from ai */}
            <p className="text-lg font-medium">
              {currentFocus === "title" &&
                "What goal would you like to achieve?"}
              {currentFocus === "description" &&
                "Tell me more about your goal:"}
              {currentFocus === "startDate" && "When would you like to start?"}
              {currentFocus === "endDate" &&
                "When do you want to complete this goal?"}
            </p>

            {/* Show AI feedback if we have it */}
            {aiResponse && !aiResponse.dataGoals && aiResponse.message && (
              <div className="text-sm text-gray-600 italic p-3 bg-gray-50 rounded-md">
                {aiResponse.message}
              </div>
            )}

            {/* Show current progress */}
            {initialValue && (
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="font-medium">{initialValue}</p>
                {title && <p className="text-sm mt-1">Title: {title}</p>}
                {description && (
                  <p className="text-sm mt-1 truncate">
                    Description: {description.substring(0, 50)}
                    {description.length > 50 ? "..." : ""}
                  </p>
                )}
                {startDate && (
                  <p className="text-sm mt-1">
                    Start: {format(startDate, "PP")}
                  </p>
                )}
                {endDate && (
                  <p className="text-sm mt-1">End: {format(endDate, "PP")}</p>
                )}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                <p className="text-sm">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="mt-2"
                >
                  Try Again
                </Button>
              </div>
            )}

            {processingAI ? (
              <div className="text-center py-4 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <p>Processing your goal data...</p>
              </div>
            ) : currentFocus === "startDate" || currentFocus === "endDate" ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      (currentFocus === "startDate" && !startDate) ||
                        (currentFocus === "endDate" && !endDate)
                        ? "text-muted-foreground"
                        : ""
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {currentFocus === "startDate" && startDate
                      ? format(startDate, "PPP")
                      : currentFocus === "endDate" && endDate
                      ? format(endDate, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      currentFocus === "startDate" ? startDate : endDate
                    }
                    onSelect={(date) => {
                      if (!date) return;
                      if (currentFocus === "startDate") {
                        setStartDate(date);
                        setCurrentFocus("endDate");
                      } else {
                        setEndDate(date);
                      }
                    }}
                    initialFocus
                    disabled={(date) => {
                      // For end date, disable dates before start date
                      if (currentFocus === "endDate" && startDate) {
                        return date < startDate;
                      }
                      // Disable dates in the past
                      return date < new Date(new Date().setHours(0, 0, 0, 0));
                    }}
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <div className="relative w-full">
                {currentFocus === "description" ? (
                  <Textarea
                    placeholder={inputPlaceholder}
                    value={input}
                    className="pr-16 min-h-[120px]"
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                ) : (
                  <Input
                    placeholder={inputPlaceholder}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                )}
                <Button
                  size="sm"
                  className="absolute bottom-2 right-2 rounded-md"
                  onClick={handleSubmit}
                  type="button"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Go back to previous step
                  if (currentFocus === "title") {
                    setCurrentFocus("initialValue");
                  } else if (currentFocus === "description") {
                    setCurrentFocus("title");
                  } else if (currentFocus === "startDate") {
                    setCurrentFocus("description");
                  } else if (currentFocus === "endDate") {
                    setCurrentFocus("startDate");
                  }
                }}
              >
                Back
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  // Skip the current step if needed
                  if (currentFocus === "title" && input) {
                    setTitle(input);
                    setInput("");
                    setCurrentFocus("description");
                  } else if (currentFocus === "description" && input) {
                    setDescription(input);
                    setInput("");
                    setCurrentFocus("startDate");
                  } else if (currentFocus === "startDate" && startDate) {
                    setCurrentFocus("endDate");
                  } else if (currentFocus === "endDate" && endDate) {
                    sendGoalDataToAI();
                  }
                }}
                disabled={
                  (currentFocus === "title" && !input) ||
                  (currentFocus === "description" && !input) ||
                  (currentFocus === "startDate" && !startDate) ||
                  (currentFocus === "endDate" && !endDate) ||
                  processingAI
                }
              >
                {currentFocus === "endDate" ? "Create Goal" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
