"use client";

import dynamic from "next/dynamic";
const AvailabilityFlow = dynamic(
  () => import("@/app/components/availability"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Memuat Penyesuaian Preferensi Waktu...
          </p>
        </div>
      </div>
    ),
  }
);

export default function AvailabilitySetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <AvailabilityFlow />
      </div>
    </div>
  );
}
