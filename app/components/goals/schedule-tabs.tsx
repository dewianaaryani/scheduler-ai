import { Goal, Schedule } from "@/app/lib/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScheduleCard } from "./schedule-card";

interface ScheduleTabsProps {
  goal: Goal;
}

export const ScheduleTabs: React.FC<ScheduleTabsProps> = ({ goal }) => {
  const getSchedulesByStatus = (status?: Schedule["status"]) => {
    return status
      ? goal.schedules.filter((s) => s.status === status)
      : goal.schedules;
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
        <TabsTrigger value="in-progress">In Progress</TabsTrigger>
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        {getSchedulesByStatus().map((s) => (
          <ScheduleCard key={s.id} schedule={s} borderColor="border-primary" />
        ))}
      </TabsContent>

      <TabsContent value="completed" className="space-y-4">
        {getSchedulesByStatus("COMPLETED").map((s) => (
          <ScheduleCard key={s.id} schedule={s} />
        ))}
      </TabsContent>

      <TabsContent value="in-progress" className="space-y-4">
        {getSchedulesByStatus("IN_PROGRESS").map((s) => (
          <ScheduleCard key={s.id} schedule={s} />
        ))}
      </TabsContent>

      <TabsContent value="upcoming" className="space-y-4">
        {getSchedulesByStatus("NONE").map((s) => (
          <ScheduleCard key={s.id} schedule={s} />
        ))}
      </TabsContent>
    </Tabs>
  );
};
