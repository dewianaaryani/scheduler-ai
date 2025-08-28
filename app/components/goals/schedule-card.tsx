"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BadgeStatus from "../BadgeStatus";
import { formatDateYearTime } from "@/app/lib/utils";
import { Schedule } from "@/app/lib/types";
import ScheduleDetailPopup from "../schedule-detail-popup";

interface ScheduleCardProps {
  schedule: Schedule;
  borderColor?: string;
  onUpdate?: () => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  borderColor,
  onUpdate,
}) => {
  const [open, setOpen] = useState(false);

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
  const [updatedSchedule, setUpdatedSchedule] = useState<Schedule>(schedule);

  // const handleStatusUpdate = (
  //   id: string,
  //   newStatus: Schedule["status"], // <- Pastikan pakai union type
  //   newNotes?: string
  // ) => {
  //   setUpdatedSchedule((prev) => ({
  //     ...prev,
  //     status: newStatus,
  //     notes: newNotes ?? prev.notes,
  //   }));
  // };

  return (
    <>
      {/* Card */}
      <Card
        className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => {
          setUpdatedSchedule(schedule);
          setOpen(true);
        }}
      >
        <div className={`flex flex-col sm:flex-row border-l-4 ${getBorderColor()}`}>
          <div className="p-3 sm:p-4 flex items-center justify-center bg-muted/30 sm:w-16">
            <span className="text-xl sm:text-2xl" role="img" aria-label="Schedule emoji">
              {schedule.emoji}
            </span>
          </div>
          <CardContent className="p-3 sm:p-4 flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <h3 className="font-medium text-sm sm:text-base line-clamp-2">{schedule.title}</h3>
                <BadgeStatus status={schedule.status} />
              </div>
              {schedule.percentComplete && (
                <Badge variant="outline" className="self-start sm:self-auto text-xs">{schedule.percentComplete}%</Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">
              {schedule.description}
            </p>
            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Waktu Mulai</span>
                <span className="block text-xs sm:text-sm">{formatDateYearTime(schedule.startedTime)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Waktu Selesai</span>
                <span className="block text-xs sm:text-sm">{formatDateYearTime(schedule.endTime)}</span>
              </div>
            </div>
            {schedule.notes && (
              <div className="mt-2 border-t pt-2">
                <span className="text-muted-foreground block text-xs">
                  Catatan
                </span>
                <p className="text-xs sm:text-sm line-clamp-2">{schedule.notes}</p>
              </div>
            )}
          </CardContent>
        </div>
      </Card>

      {/* Popup */}
      <ScheduleDetailPopup
        open={open}
        onOpenChange={setOpen}
        schedule={updatedSchedule}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default ScheduleCard;
