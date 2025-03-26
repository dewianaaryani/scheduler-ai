"use client"; // ✅ Gunakan use client untuk memastikan komponen ini hanya di render di client
import { useState, useEffect, useCallback } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OnboardingForm() {
  const [userType, setUserType] = useState("morning");
  const [workingDays, setWorkingDays] = useState(["Sun"]);
  const [workStart, setWorkStart] = useState("10:00 am");
  const [workEnd, setWorkEnd] = useState("04:00 pm");
  const [sleepStart, setSleepStart] = useState("05:00 pm");
  const [sleepEnd, setSleepEnd] = useState("09:00 am");
  const [loading, setLoading] = useState(false);

  const toggleDay = (day: string) => {
    setWorkingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const timeOptions = Array.from({ length: 24 }).map((_, i) => {
    const hour = i % 12 || 12;
    const ampm = i < 12 ? "am" : "pm";
    return `${hour}:00 ${ampm}`;
  });

  // ✅ Menggunakan useCallback untuk memastikan fungsi tidak berubah setiap render
  const getAvailableSleepTimes = useCallback(() => {
    const workStartIndex = timeOptions.indexOf(workStart);
    const workEndIndex = timeOptions.indexOf(workEnd);

    return timeOptions.filter((_, i) => i > workEndIndex || i < workStartIndex);
  }, [workStart, workEnd, timeOptions]);

  // ✅ useEffect sekarang hanya akan dipanggil jika workStart atau workEnd berubah
  useEffect(() => {
    const availableTimes = getAvailableSleepTimes();
    setSleepStart(availableTimes[0] || "05:00 pm");
    setSleepEnd(availableTimes[availableTimes.length - 1] || "09:00 am");
  }, [getAvailableSleepTimes]);

  const handleSubmit = async () => {
    setLoading(true);

    const preferences = {
      userType,
      workingDays,
      workStart,
      workEnd,
      sleepStart,
      sleepEnd,
    };

    try {
      const response = await fetch("/api/user/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        console.log("Preferences saved successfully");
      } else {
        console.error("Failed to save preferences");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg h-[calc(100vh-200px)] bg-white rounded-3xl px-10 overflow-y-auto">
      {/* Morning / Night Selection */}
      <div className="grid grid-cols-2 gap-4 px-10 my-4">
        <button
          onClick={() => setUserType("morning")}
          className={`flex flex-col items-center justify-center px-0 py-10 rounded-xl border ${
            userType === "morning"
              ? "text-primary border-primary border-2"
              : "border-gray-200 text-black"
          }`}
        >
          <Sun className="h-6 w-6 mb-1" fill="currentColor" />
          <span className="text-sm font-medium">Morning Person</span>
        </button>

        <button
          onClick={() => setUserType("night")}
          className={`flex flex-col items-center justify-center px-0 py-10 rounded-xl border ${
            userType === "night"
              ? "bg-primary text-white border-primary"
              : "border-gray-200 text-black"
          }`}
        >
          <Moon className="h-6 w-6 mb-1" fill="currentColor" />
          <span className="text-sm font-medium">Night Owl</span>
        </button>
      </div>

      {/* Working Days */}
      <div className="mb-6">
        <p className="text-center font-medium mb-3">Working Days</p>
        <div className="flex flex-wrap justify-center gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`px-3 py-1 rounded-full text-sm ${
                workingDays.includes(day)
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-200 text-black"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Working Hours */}
      <div className="mb-6">
        <p className="text-center font-medium mb-3">Working Hours</p>
        <div className="flex items-center justify-center gap-2">
          <Select value={workStart} onValueChange={setWorkStart}>
            <SelectTrigger className="w-[120px] border-gray-200">
              <SelectValue placeholder="Start time" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-gray-500">-</span>
          <Select value={workEnd} onValueChange={setWorkEnd}>
            <SelectTrigger className="w-[120px] border-gray-200">
              <SelectValue placeholder="End time" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sleep Schedule */}
      <div className="mb-8">
        <p className="text-center font-medium mb-3">Sleep Schedule</p>
        <div className="flex items-center justify-center gap-2">
          <Select value={sleepStart} onValueChange={setSleepStart}>
            <SelectTrigger className="w-[120px] border-gray-200">
              <SelectValue placeholder="Start time" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableSleepTimes().map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-gray-500">-</span>
          <Select value={sleepEnd} onValueChange={setSleepEnd}>
            <SelectTrigger className="w-[120px] border-gray-200">
              <SelectValue placeholder="End time" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableSleepTimes().map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button className="px-8" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
