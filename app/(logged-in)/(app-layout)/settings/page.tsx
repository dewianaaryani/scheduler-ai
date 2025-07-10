"use client";

import AccountSettings from "@/app/components/settings/account-settings";
import AvailabilityOverview from "@/app/components/settings/availability-overview";
import PreferencesSettings from "@/app/components/settings/preferences-settings";

export default function SettingsPage() {
  return (
    <div className="w-full space-y-8">
      <AccountSettings />
      <PreferencesSettings />
      <AvailabilityOverview />
    </div>
  );
}
