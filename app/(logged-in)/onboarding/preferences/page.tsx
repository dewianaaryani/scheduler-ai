"use client";

import { useState } from "react";
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

  const toggleDay = (day: string) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl px-10">
      <div className="grid grid-cols-2 gap-4 px-10 my-4">
        <button
          onClick={() => setUserType("morning")}
          className={`flex flex-col items-center justify-center px-0 py-12 rounded-xl border ${
            userType === "morning"
              ? "text-primary border-primary"
              : "border-gray-200 text-gray-700"
          }`}
        >
          <Sun className="h-6 w-6 mb-1" />
          <span className="text-sm font-medium">Morning Person</span>
        </button>

        <button
          onClick={() => setUserType("night")}
          className={`flex flex-col items-center justify-center px-0 py-10 rounded-xl border ${
            userType === "night"
              ? "bg-primary text-white border-primary"
              : "border-gray-200 text-gray-700"
          }`}
        >
          <Moon className="h-6 w-6 mb-1" />
          <span className="text-sm font-medium">Night Owl</span>
        </button>
      </div>

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
                  : "bg-white border border-gray-200 text-gray-700"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-center font-medium mb-3">Working Hours</p>
        <div className="flex items-center justify-center gap-2">
          <Select defaultValue="10:00 am">
            <SelectTrigger className="w-[120px] border-gray-200">
              <SelectValue placeholder="Start time" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }).map((_, i) => {
                const hour = i % 12 || 12;
                const ampm = i < 12 ? "am" : "pm";
                return (
                  <SelectItem key={i} value={`${hour}:00 ${ampm}`}>
                    {`${hour}:00 ${ampm}`}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <span className="text-gray-500">-</span>
          <Select defaultValue="05:00 pm">
            <SelectTrigger className="w-[120px] border-gray-200">
              <SelectValue placeholder="End time" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }).map((_, i) => {
                const hour = i % 12 || 12;
                const ampm = i < 12 ? "am" : "pm";
                return (
                  <SelectItem key={i} value={`${hour}:00 ${ampm}`}>
                    {`${hour}:00 ${ampm}`}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-center font-medium mb-3">Sleep Schedule</p>
        <div className="flex items-center justify-center gap-2">
          <Select defaultValue="10:00 pm">
            <SelectTrigger className="w-[120px] border-gray-200">
              <SelectValue placeholder="Start time" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }).map((_, i) => {
                const hour = i % 12 || 12;
                const ampm = i < 12 ? "am" : "pm";
                return (
                  <SelectItem key={i} value={`${hour}:00 ${ampm}`}>
                    {`${hour}:00 ${ampm}`}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <span className="text-gray-500">-</span>
          <Select defaultValue="06:00 am">
            <SelectTrigger className="w-[120px] border-gray-200">
              <SelectValue placeholder="End time" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }).map((_, i) => {
                const hour = i % 12 || 12;
                const ampm = i < 12 ? "am" : "pm";
                return (
                  <SelectItem key={i} value={`${hour}:00 ${ampm}`}>
                    {`${hour}:00 ${ampm}`}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-center">
        <Button className=" px-8">Submit</Button>
      </div>
    </div>
  );
}
