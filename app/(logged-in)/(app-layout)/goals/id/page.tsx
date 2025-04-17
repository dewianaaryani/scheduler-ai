"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewGoals from "@/app/components/goals/overview";
import ActivityGoals from "@/app/components/goals/activities";
import SettingsGoals from "@/app/components/goals/settings";

export default function SavingsTracker() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start border-b bg-transparent h-auto p-0">
            <TabsTrigger
              value="overview"
              className={`px-6 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none ${
                activeTab === "overview" ? "border-b-2 border-primary" : ""
              }`}
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className={`px-6 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none ${
                activeTab === "activities" ? "border-b-2 border-primary" : ""
              }`}
            >
              Activities
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className={`px-6 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none ${
                activeTab === "settings" ? "border-b-2 border-primary" : ""
              }`}
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="overview"
            className="p-6 focus-visible:outline-none focus-visible:ring-0"
          >
            <OverviewGoals />
          </TabsContent>

          <TabsContent
            value="activities"
            className="p-6 focus-visible:outline-none focus-visible:ring-0"
          >
            <ActivityGoals />
          </TabsContent>

          <TabsContent
            value="settings"
            className="p-6 focus-visible:outline-none focus-visible:ring-0"
          >
            <SettingsGoals />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
