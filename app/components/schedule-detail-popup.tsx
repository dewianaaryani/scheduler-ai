"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  Calendar,
  Target,
  CheckCircle,
  XCircle,
  NotebookPen,
} from "lucide-react";
import BadgeStatus from "./BadgeStatus";
import { formatDate, formatTime } from "../lib/utils";
import { Schedule } from "../lib/types";

type ExtendedSchedule = Schedule & {
  goalTitle?: string; // Add fields not in the original Schedule
};

interface ScheduleDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: ExtendedSchedule;
  onUpdateStatus?: (id: string, status: string, notes?: string) => void;
}

export default function ScheduleDetailPopup({
  open,
  onOpenChange,
  schedule,
  onUpdateStatus,
}: ScheduleDetailProps) {
  const [notes, setNotes] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(
    schedule.status || "NONE"
  );

  const handleUpdateStatus = () => {
    if (onUpdateStatus) {
      onUpdateStatus(schedule.id, selectedStatus, notes);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-y-auto">
        <div className="bg-violet-50 p-6">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl">{schedule.emoji}</div>
              <DialogTitle className="text-xl font-bold text-gray-800">
                {schedule.title}
              </DialogTitle>
              <BadgeStatus status={schedule.status} />
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-2">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Description
              </h4>
              <p className="text-gray-700">{schedule.description}</p>
            </div>

            {schedule.goalTitle && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                  <Target className="h-4 w-4 text-violet-500" />
                  Related Goal
                </h4>
                <p className="text-gray-700">{schedule.goalTitle}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-violet-500" />
                  Start Time
                </h4>
                <p className="text-gray-700">
                  {formatTime(schedule.startedTime)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-violet-500" />
                  End Time
                </h4>
                <p className="text-gray-700">{formatTime(schedule.endTime)}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-violet-500" />
                Date
              </h4>
              <p className="text-gray-700">
                {formatDate(schedule.startedTime)}
              </p>
            </div>

            {!schedule.notes ? (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Notes
                </h4>
                <Textarea
                  placeholder="Add your notes here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>
            ) : (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                  <NotebookPen className="h-4 w-4 text-violet-500" />
                  Notes
                </h4>
                <p className="text-gray-700">{schedule.notes}</p>
              </div>
            )}

            {(schedule.status === "NONE" ||
              schedule.status === "IN_PROGRESS") && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Update Status
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={
                      selectedStatus === "IN_PROGRESS" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedStatus("IN_PROGRESS")}
                    className={
                      selectedStatus === "IN_PROGRESS"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : ""
                    }
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    In Progress
                  </Button>
                  <Button
                    variant={
                      selectedStatus === "COMPLETED" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedStatus("COMPLETED")}
                    className={
                      selectedStatus === "COMPLETED"
                        ? "bg-green-600 hover:bg-green-700"
                        : ""
                    }
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Completed
                  </Button>
                  {schedule.goalTitle && (
                    <Button
                      variant={
                        selectedStatus === "MISSED" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedStatus("MISSED")}
                      className={
                        selectedStatus === "MISSED"
                          ? "bg-red-600 hover:bg-red-700"
                          : ""
                      }
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Missed
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-6 pt-0">
          {(!schedule.status ||
            schedule.status === "NONE" ||
            schedule.status === "IN_PROGRESS") && (
            <Button
              onClick={handleUpdateStatus}
              className="bg-violet-600 hover:bg-violet-700"
            >
              Save Changes
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
