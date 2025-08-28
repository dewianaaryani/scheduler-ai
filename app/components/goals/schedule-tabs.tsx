import { Goal, Schedule } from "@/app/lib/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ScheduleCard from "./schedule-card";

interface ScheduleTabsProps {
  goal: Goal;
  onUpdate?: () => void;
}

export const ScheduleTabs: React.FC<ScheduleTabsProps> = ({ goal, onUpdate }) => {
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

  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="w-full overflow-x-auto pb-2">
        <TabsList className="mb-4 w-full sm:w-auto grid grid-cols-4 sm:inline-flex h-auto sm:h-10">
          <TabsTrigger value="all" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-1">Semua</TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-1">Selesai</TabsTrigger>
          <TabsTrigger value="in-progress" className="text-xs sm:text-sm px-1 sm:px-3 py-1.5 sm:py-1 whitespace-nowrap">Berjalan</TabsTrigger>
          <TabsTrigger value="upcoming" className="text-xs sm:text-sm px-1 sm:px-3 py-1.5 sm:py-1">Mendatang</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="all" className="space-y-3 mt-4">
        {getSchedulesByStatus().length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Belum ada jadwal
          </div>
        ) : (
          getSchedulesByStatus().map((s) => (
            <ScheduleCard key={s.id} schedule={s} borderColor="border-primary" onUpdate={onUpdate} />
          ))
        )}
      </TabsContent>

      <TabsContent value="completed" className="space-y-3 mt-4">
        {getSchedulesByStatus("COMPLETED").length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Belum ada jadwal yang selesai
          </div>
        ) : (
          getSchedulesByStatus("COMPLETED").map((s) => (
            <ScheduleCard key={s.id} schedule={s} onUpdate={onUpdate} />
          ))
        )}
      </TabsContent>

      <TabsContent value="in-progress" className="space-y-3 mt-4">
        {getSchedulesByStatus("IN_PROGRESS").length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Belum ada jadwal yang sedang berjalan
          </div>
        ) : (
          getSchedulesByStatus("IN_PROGRESS").map((s) => (
            <ScheduleCard key={s.id} schedule={s} onUpdate={onUpdate} />
          ))
        )}
      </TabsContent>

      <TabsContent value="upcoming" className="space-y-3 mt-4">
        {getSchedulesByStatus("NONE").length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Belum ada jadwal mendatang
          </div>
        ) : (
          getSchedulesByStatus("NONE").map((s) => (
            <ScheduleCard key={s.id} schedule={s} onUpdate={onUpdate} />
          ))
        )}
      </TabsContent>
    </Tabs>
  );
};
