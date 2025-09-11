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
import { useNextStep } from "nextstepjs";

export default function DashboardContent() {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userHasGoals, setUserHasGoals] = useState(false);
  const [userHasSchedule, setUserHasSchedule] = useState(false);
  const [username, setUsername] = useState(""); // Add username state

  const { startNextStep } = useNextStep();

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("api/user/has-schedule-or-goals");

        if (response.ok) {
          const data = await response.json();
          setUserHasGoals(data.hasGoals > 0);
          setUserHasSchedule(data.hasSchedule > 0);
          setUsername(data.username || ""); // Set username from API response
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

  const closePopup = () => {
    setShowPopup(false);
    localStorage.setItem("dashboard-setup-completed", "true");
  };

  const handleStartTour = () => {
    // Close popup first
    setShowPopup(false);
    localStorage.setItem("dashboard-setup-completed", "true");

    // Start tour after a short delay to allow popup to close
    setTimeout(() => {
      startNextStep("mainTour");
    }, 300);
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
          <TodaySchedule />
        </div>
      </div>

      {/* Simple Setup Popup */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="max-w-md md:max-w-lg p-12">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              Halo {username || "User"}!
              <span className="text-2xl mr-2">🤩</span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col space-y-4">
            <div className="text-center text-gray-600 text-sm mb-2">
              Mari perkenalan dengan aplikasi Kalcer
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" onClick={closePopup}>
                Lewati
              </Button>

              <Button onClick={handleStartTour}>Mulai</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
