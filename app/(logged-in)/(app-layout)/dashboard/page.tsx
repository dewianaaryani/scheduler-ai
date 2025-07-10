import { OverviewStats } from "@/app/components/overview-stats";
import { TodaySchedule } from "@/app/components/today-schedule";
import DashboardHeaderContent from "@/app/components/dashboard-header-content";

export default function DashboardContent() {
  return (
    <div className="flex flex-col p-2 w-full">
      <DashboardHeaderContent />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <OverviewStats />
      </div>

      {/* <DashboardMainContent/> */}

      {/* Today's Schedule */}
      <TodaySchedule />
    </div>
  );
}
