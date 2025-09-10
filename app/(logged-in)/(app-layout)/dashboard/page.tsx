"use client";
import { useState, useEffect } from "react";
import { OverviewStats } from "@/app/components/overview-stats";
import { TodaySchedule } from "@/app/components/today-schedule";
import DashboardHeaderContent from "@/app/components/dashboard-header-content";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardContent() {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userHasGoals, setUserHasGoals] = useState(false);
  const [userHasSchedule, setUserHasSchedule] = useState(false);
  const router = useRouter();

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("api/user/has-schedule-or-goals");

        if (response.ok) {
          const data = await response.json();
          setUserHasGoals(data.hasGoals > 0);
          setUserHasSchedule(data.hasSchedule > 0);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Check if user needs popup after data is loaded
  useEffect(() => {
    if (loading) return;

    const setupCompleted = localStorage.getItem("dashboard-setup-completed");

    if (!setupCompleted && !userHasGoals && !userHasSchedule) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [userHasGoals, userHasSchedule, loading]);

  const handleGoToGoals = () => {
    router.push("/ai");
    setShowPopup(false);
    localStorage.setItem("dashboard-setup-completed", "true");
  };

  const handleGoToSchedule = () => {
    router.push("/calendar");
    setShowPopup(false);
    localStorage.setItem("dashboard-setup-completed", "true");
  };

  if (loading) {
    return (
      <div className="flex flex-col p-2 w-full">
        <DashboardHeaderContent />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col p-2 w-full">
        <DashboardHeaderContent />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <OverviewStats />
        </div>

        {/* Today's Schedule */}
        <TodaySchedule />
      </div>

      {/* Simple Setup Popup */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Buat tujuan atau jadwal pertama Anda!
              <span className="text-2xl mr-2">🤩</span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col space-y-3 pt-4">
            <Button onClick={handleGoToGoals} className="w-full" size="lg">
              Buat tujuan sekarang
            </Button>

            <Button
              onClick={handleGoToSchedule}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Buat jadwal sekarang
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
