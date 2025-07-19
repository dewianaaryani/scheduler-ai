"use client";

import AccountSettings from "@/app/components/settings/account-settings";
import AvailabilityOverview from "@/app/components/settings/availability-overview";

export default function SettingsPage() {
  return (
    <div className="w-full space-y-8">
      <AccountSettings />
      <AvailabilityOverview />
    </div>
  );
}
