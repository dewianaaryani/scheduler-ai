import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Schedule } from "@/app/lib/types";
import BadgeStatus from "../BadgeStatus";
import { formatDateYearTime } from "@/app/lib/utils";

interface ScheduleCardProps {
  schedule: Schedule;
  borderColor?: string; // Optional prop
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  borderColor,
}) => {
  const getBorderColor = () => {
    if (borderColor) return borderColor;

    switch (schedule.status) {
      case "COMPLETED":
        return "border-green-500";
      case "IN_PROGRESS":
        return "border-blue-500";
      case "NONE":
        return "border-gray-300";
      default:
        return "border-primary";
    }
  };
  return (
    <Card className="overflow-hidden">
      <div className={`flex border-l-4 ${getBorderColor()}`}>
        <div className="p-4 flex items-center justify-center bg-muted/30 w-16">
          <span className="text-2xl" role="img" aria-label="Schedule emoji">
            {schedule.emoji}
          </span>
        </div>
        <CardContent className="p-4 flex-1">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{schedule.title}</h3>
              <BadgeStatus status={schedule.status} />
            </div>
            {schedule.percentComplete && (
              <Badge variant="outline">{schedule.percentComplete}%</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {schedule.description}
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground block">Start Time</span>
              <span>{formatDateYearTime(schedule.startedTime)}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">End Time</span>
              <span>{formatDateYearTime(schedule.endTime)}</span>
            </div>
          </div>
          {schedule.notes && (
            <div className="mt-2 text-sm border-t pt-2">
              <span className="text-muted-foreground block text-xs">Notes</span>
              <p>{schedule.notes}</p>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};
