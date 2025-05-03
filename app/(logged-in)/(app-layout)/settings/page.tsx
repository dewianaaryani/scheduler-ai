"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Sun, Moon } from "lucide-react";
import AccountSettings from "@/app/components/settings/account-settings";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState(
    "/placeholder.svg?height=80&width=80"
  );
  const [preference, setPreference] = useState("morning");
  const [workingDays, setWorkingDays] = useState<string[]>(["Sun"]);
  const [workingStartTime, setWorkingStartTime] = useState("10:00 am");
  const [workingEndTime, setWorkingEndTime] = useState("05:00 pm");
  const [sleepStartTime, setSleepStartTime] = useState("10:00 pm");
  const [sleepEndTime, setSleepEndTime] = useState("05:00 am");

  const toggleWorkingDay = (day: string) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const removeProfileImage = () => {
    setProfileImage("/placeholder.svg?height=80&width=80");
  };

  return (
    <div className="container p-8 max-w-md">
      <AccountSettings />
      <Card className="p-6 shadow-sm rounded-sm">
        <h1 className="text-xl font-bold">Settings Account</h1>
        <p className="text-gray-500 text-sm ">Settings Your Account</p>

        <div className="">
          <label htmlFor="name" className="block mb-2 font-medium">
            Name
          </label>
          <Input
            id="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="mb-6 relative inline-block">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100">
            <img
              src={profileImage || "/placeholder.svg"}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <button
            onClick={removeProfileImage}
            className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center text-white"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex justify-end">
          <Button className="bg-[#7C5CFC] hover:bg-[#6A4AE8]">Submit</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h1 className="text-xl font-bold mb-1">Settings Preferences</h1>
        <p className="text-gray-500 text-sm mb-6">
          Setting your preferences if its your habit is changes
        </p>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setPreference("morning")}
            className={`w-36 h-36 rounded-lg border flex flex-col items-center justify-center gap-2 transition-colors ${
              preference === "morning"
                ? "bg-[#7C5CFC] text-white border-[#7C5CFC]"
                : "bg-white text-gray-700 border-gray-200 hover:border-[#7C5CFC]/50"
            }`}
          >
            <Sun size={24} />
            <span className="font-medium">Morning Person</span>
          </button>

          <button
            onClick={() => setPreference("night")}
            className={`w-36 h-36 rounded-lg border flex flex-col items-center justify-center gap-2 transition-colors ${
              preference === "night"
                ? "bg-[#7C5CFC] text-white border-[#7C5CFC]"
                : "bg-white text-gray-700 border-gray-200 hover:border-[#7C5CFC]/50"
            }`}
          >
            <Moon size={24} />
            <span className="font-medium">Night Owl</span>
          </button>
        </div>

        <div className="mb-6">
          <h2 className="font-medium mb-2">Working Days</h2>
          <div className="flex flex-wrap gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <button
                key={day}
                onClick={() => toggleWorkingDay(day)}
                className={`px-4 py-1 rounded-full border transition-colors ${
                  workingDays.includes(day)
                    ? "bg-[#7C5CFC] text-white border-[#7C5CFC]"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#7C5CFC]/50"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-medium mb-2">Working Hours</h2>
          <div className="flex items-center gap-2">
            <Select
              value={workingStartTime}
              onValueChange={setWorkingStartTime}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Start time" />
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

            <span>-</span>

            <Select value={workingEndTime} onValueChange={setWorkingEndTime}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="End time" />
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

        <div>
          <h2 className="font-medium mb-2">Sleep Schedule</h2>
          <div className="flex items-center gap-2">
            <Select value={sleepStartTime} onValueChange={setSleepStartTime}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Start time" />
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

            <span>-</span>

            <Select value={sleepEndTime} onValueChange={setSleepEndTime}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="End time" />
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
      </Card>
    </div>
  );
}
