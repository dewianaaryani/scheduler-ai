import React from "react";
import { GeneralSettingsForm } from "./general-settings-form";
import AbandonedGoals from "./abandoned-goals";

export default function SettingsGoals() {
  return (
    <div className="container space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Goal Settings</h2>
        <p className="text-gray-500">Manage your settings goal here.</p>
      </div>
      <div className="grid grid-cols-2 border border-gray-200 rounded-lg shadow-md p-4 gap-4">
        <div className="">
          <h4 className="font-semibold text-md">General Settings</h4>
        </div>
        <div className="flex flex-col gap-4">
          <GeneralSettingsForm />
        </div>
      </div>
      <AbandonedGoals />
    </div>
  );
}
