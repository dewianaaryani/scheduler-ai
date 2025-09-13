import React from "react";
import { Goal, Schedule } from "@/app/lib/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ScheduleCard from "./schedule-card";

interface ScheduleTabsProps {
  goal: Goal;
  onUpdate?: () => void;
}

export const ScheduleTabs: React.FC<ScheduleTabsProps> = ({
  goal,
  onUpdate,
}) => {
  const getSchedulesByStatus = (status?: Schedule["status"]) => {
    const filtered = status
      ? goal.schedules.filter((s) => s.status === status)
      : goal.schedules;

    // Add goal data to each schedule
    const schedulesWithGoal = filtered.map((schedule) => ({
      ...schedule,
      goal: {
        id: goal.id,
        title: goal.title,
        description: goal.description,
        emoji: goal.emoji,
        status: goal.status,
        startDate: goal.startDate,
        endDate: goal.endDate,
        percentComplete: goal.percentComplete,
        schedules: [], // Empty to avoid circular reference
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
      },
    }));

    return schedulesWithGoal.sort((a, b) => {
      const aStart = new Date(a.startedTime).getTime();
      const bStart = new Date(b.startedTime).getTime();
      return aStart - bStart;
    });
  };

  const [activeTab, setActiveTab] = React.useState("all");

  return (
    <TooltipProvider>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="w-full overflow-x-auto pb-2">
          <TabsList className="mb-4 w-full sm:w-auto grid grid-cols-4 sm:inline-flex h-auto sm:h-auto bg-gray-100 p-1 gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="all"
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 transition-all rounded-md"
                  style={{
                    border: activeTab === "all" ? "1px solid #a855f7" : "1px solid #e5e7eb",
                    backgroundColor: activeTab === "all" ? "#faf5ff" : "white",
                    color: activeTab === "all" ? "#7c3aed" : "#6b7280",
                    fontWeight: activeTab === "all" ? "600" : "normal"
                  }}
                >
                  Semua
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium">
                <span>Tampilkan semua jadwal dalam tujuan ini</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="completed"
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 transition-all rounded-md"
                  style={{
                    border: activeTab === "completed" ? "1px solid #a855f7" : "1px solid #e5e7eb",
                    backgroundColor: activeTab === "completed" ? "#faf5ff" : "white",
                    color: activeTab === "completed" ? "#7c3aed" : "#6b7280",
                    fontWeight: activeTab === "completed" ? "600" : "normal"
                  }}
                >
                  Selesai
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium">
                <span>Jadwal yang telah berhasil diselesaikan</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="in-progress"
                  className="text-xs sm:text-sm px-1 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap transition-all rounded-md"
                  style={{
                    border: activeTab === "in-progress" ? "1px solid #a855f7" : "1px solid #e5e7eb",
                    backgroundColor: activeTab === "in-progress" ? "#faf5ff" : "white",
                    color: activeTab === "in-progress" ? "#7c3aed" : "#6b7280",
                    fontWeight: activeTab === "in-progress" ? "600" : "normal"
                  }}
                >
                  Berjalan
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium">
                <span>Jadwal yang sedang dikerjakan saat ini</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="upcoming"
                  className="text-xs sm:text-sm px-1 sm:px-3 py-1.5 sm:py-2 transition-all rounded-md"
                  style={{
                    border: activeTab === "upcoming" ? "1px solid #a855f7" : "1px solid #e5e7eb",
                    backgroundColor: activeTab === "upcoming" ? "#faf5ff" : "white",
                    color: activeTab === "upcoming" ? "#7c3aed" : "#6b7280",
                    fontWeight: activeTab === "upcoming" ? "600" : "normal"
                  }}
                >
                  Belum dimulai
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium">
                <span>Jadwal yang belum dimulai</span>
              </TooltipContent>
            </Tooltip>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-3 mt-4">
          {getSchedulesByStatus().length === 0 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-center py-8 text-muted-foreground text-sm cursor-help">
                  Belum ada jadwal
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="font-medium">
                <span>
                  Jadwal akan otomatis dibuat oleh sistem AI berdasarkan tujuan
                  Anda
                </span>
              </TooltipContent>
            </Tooltip>
          ) : (
            getSchedulesByStatus().map((s) => (
              <ScheduleCard
                key={s.id}
                schedule={s}
                borderColor="border-primary"
                onUpdate={onUpdate}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3 mt-4">
          {getSchedulesByStatus("COMPLETED").length === 0 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-center py-8 text-muted-foreground text-sm cursor-help">
                  Belum ada jadwal yang selesai
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="font-medium">
                <span>
                  Jadwal yang telah Anda selesaikan akan muncul di sini
                </span>
              </TooltipContent>
            </Tooltip>
          ) : (
            getSchedulesByStatus("COMPLETED").map((s) => (
              <ScheduleCard key={s.id} schedule={s} onUpdate={onUpdate} />
            ))
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-3 mt-4">
          {getSchedulesByStatus("IN_PROGRESS").length === 0 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-center py-8 text-muted-foreground text-sm cursor-help">
                  Belum ada jadwal yang sedang berjalan
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="font-medium">
                <span>
                  Jadwal yang sedang Anda kerjakan akan ditampilkan di sini
                </span>
              </TooltipContent>
            </Tooltip>
          ) : (
            getSchedulesByStatus("IN_PROGRESS").map((s) => (
              <ScheduleCard key={s.id} schedule={s} onUpdate={onUpdate} />
            ))
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-3 mt-4">
          {getSchedulesByStatus("NONE").length === 0 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-center py-8 text-muted-foreground text-sm cursor-help">
                  Belum ada jadwal mendatang
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="font-medium">
                <span>
                  Jadwal yang akan datang akan muncul di sini berdasarkan
                  timeline tujuan
                </span>
              </TooltipContent>
            </Tooltip>
          ) : (
            getSchedulesByStatus("NONE").map((s) => (
              <ScheduleCard key={s.id} schedule={s} onUpdate={onUpdate} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </TooltipProvider>
  );
};
