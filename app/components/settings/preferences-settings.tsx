"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Clock, Calendar, Zap, Settings } from "lucide-react";

export default function PreferencesSettings() {
  const [preference, setPreference] = useState<"morning" | "night">("morning");
  const [workingDays, setWorkingDays] = useState([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ]);
  const [workingStartTime, setWorkingStartTime] = useState("09:00 am");
  const [workingEndTime, setWorkingEndTime] = useState("05:00 pm");
  const [sleepStartTime, setSleepStartTime] = useState("10:00 pm");
  const [sleepEndTime, setSleepEndTime] = useState("06:00 am");
  const toggleWorkingDay = (day: string) => {
    setWorkingDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day].sort((a, b) => {
            const order = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            return order.indexOf(a) - order.indexOf(b);
          })
    );
  };

  const weekDays = [
    { short: "Sun", full: "Sunday" },
    { short: "Mon", full: "Monday" },
    { short: "Tue", full: "Tuesday" },
    { short: "Wed", full: "Wednesday" },
    { short: "Thu", full: "Thursday" },
    { short: "Fri", full: "Friday" },
    { short: "Sat", full: "Saturday" },
  ];

  return (
    <Card className="bg-white border-gray-200 text-gray-800 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-violet-100 p-2 rounded-lg">
            <Settings className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-800">
              Preferences
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Customize your scheduling preferences and habits
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Productivity Type */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-violet-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Productivity Type
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Choose your natural productivity pattern to optimize your schedule
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setPreference("morning")}
              className={`group relative overflow-hidden rounded-xl border-2 p-6 transition-all duration-300 ${
                preference === "morning"
                  ? "bg-gradient-to-br from-violet-100 to-violet-200 border-violet-500 shadow-lg shadow-violet-200"
                  : "bg-gray-50 border-gray-200 hover:border-violet-300 hover:bg-violet-50"
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <div
                  className={`p-4 rounded-full transition-colors ${
                    preference === "morning" ? "bg-violet-200" : "bg-gray-100"
                  }`}
                >
                  <Sun
                    className={`h-8 w-8 ${
                      preference === "morning"
                        ? "text-violet-600"
                        : "text-gray-500"
                    }`}
                  />
                </div>
                <div className="text-center">
                  <h4
                    className={`font-semibold text-lg ${
                      preference === "morning"
                        ? "text-gray-800"
                        : "text-gray-700"
                    }`}
                  >
                    Morning Person
                  </h4>
                  <p
                    className={`text-sm ${
                      preference === "morning"
                        ? "text-violet-700"
                        : "text-gray-600"
                    }`}
                  >
                    Most productive in the morning hours
                  </p>
                </div>
              </div>
              {preference === "morning" && (
                <div className="absolute top-2 right-2 bg-violet-500 rounded-full p-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>

            <button
              onClick={() => setPreference("night")}
              className={`group relative overflow-hidden rounded-xl border-2 p-6 transition-all duration-300 ${
                preference === "night"
                  ? "bg-gradient-to-br from-violet-100 to-violet-200 border-violet-500 shadow-lg shadow-violet-200"
                  : "bg-gray-50 border-gray-200 hover:border-violet-300 hover:bg-violet-50"
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <div
                  className={`p-4 rounded-full transition-colors ${
                    preference === "night" ? "bg-violet-200" : "bg-gray-100"
                  }`}
                >
                  <Moon
                    className={`h-8 w-8 ${
                      preference === "night"
                        ? "text-violet-600"
                        : "text-gray-500"
                    }`}
                  />
                </div>
                <div className="text-center">
                  <h4
                    className={`font-semibold text-lg ${
                      preference === "night" ? "text-gray-800" : "text-gray-700"
                    }`}
                  >
                    Night Owl
                  </h4>
                  <p
                    className={`text-sm ${
                      preference === "night"
                        ? "text-violet-700"
                        : "text-gray-600"
                    }`}
                  >
                    Most productive in the evening hours
                  </p>
                </div>
              </div>
              {preference === "night" && (
                <div className="absolute top-2 right-2 bg-violet-500 rounded-full p-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Working Days */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-violet-500" />
            <h3 className="text-lg font-semibold">Working Days</h3>
          </div>
          <p className=" text-sm mb-4">
            Select the days you typically work so the scheduler can optimize
            your busy time.
          </p>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <button
                key={day.short}
                onClick={() => toggleWorkingDay(day.short)}
                className={`group relative p-4 rounded-lg border-2 transition-all duration-200 ${
                  workingDays.includes(day.short)
                    ? "bg-violet-100 border-violet-500 text-violet-700"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:border-violet-300 hover:text-gray-800"
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold text-sm">{day.short}</div>
                  <div className="text-xs opacity-80">
                    {day.full.slice(0, 3)}
                  </div>
                </div>
                {workingDays.includes(day.short) && (
                  <div className="absolute top-1 right-1 bg-violet-500 rounded-full p-0.5">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Time Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Working Hours */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-violet-600" />
              <h3 className="text-lg font-semibold">Working Hours</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Start Time</Label>
                <Select
                  value={workingStartTime}
                  onValueChange={setWorkingStartTime}
                >
                  <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-800 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "06:00 am",
                      "07:00 am",
                      "08:00 am",
                      "09:00 am",
                      "10:00 am",
                      "11:00 am",
                      "12:00 pm",
                    ].map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">End Time</Label>
                <Select
                  value={workingEndTime}
                  onValueChange={setWorkingEndTime}
                >
                  <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-800 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "01:00 pm",
                      "02:00 pm",
                      "03:00 pm",
                      "04:00 pm",
                      "05:00 pm",
                      "06:00 pm",
                      "07:00 pm",
                    ].map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Sleep Schedule */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Moon className="h-5 w-5 text-violet-600" />
              <h3 className="text-lg font-semibold">Sleep Schedule</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Bedtime</Label>
                <Select
                  value={sleepStartTime}
                  onValueChange={setSleepStartTime}
                >
                  <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-800 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "08:00 pm",
                      "09:00 pm",
                      "10:00 pm",
                      "11:00 pm",
                      "12:00 am",
                    ].map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Wake Up</Label>
                <Select value={sleepEndTime} onValueChange={setSleepEndTime}>
                  <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-800 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "04:00 am",
                      "05:00 am",
                      "06:00 am",
                      "07:00 am",
                      "08:00 am",
                    ].map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-white/10">
          <Button className="w-full md:w-auto">Save Preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
}
