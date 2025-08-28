import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import type { Schedule } from "../lib/types";

interface Props {
  initialStatus: Schedule["status"];
  goalTitle?: string;
  onChange: (status: Schedule["status"]) => void;
  previousScheduleStatus?: Schedule["status"];
}

export default function ScheduleStatusUpdater({
  initialStatus,
  goalTitle,
  onChange,
  previousScheduleStatus,
}: Props) {
  const [status, setStatus] = useState<Schedule["status"]>(
    initialStatus || "NONE"
  );
  const [message, setMessage] = useState("");

  const updateMessage = useCallback(() => {
    if (status === "COMPLETED") {
      setMessage("🎉 Bagus! Jadwal ini telah selesai.");
    } else if (status === "ABANDONED") {
      setMessage("📋 Jadwal ini telah dibatalkan.");
    } else if (status === "MISSED") {
      setMessage("⏰ Jadwal ini terlewat.");
    } else if (status === "IN_PROGRESS") {
      setMessage("🔄 Jadwal ini sedang berjalan.");
    } else {
      setMessage("");
    }
  }, [status]);

  useEffect(() => {
    onChange(status);
    updateMessage();
  }, [status, onChange, updateMessage]);

  // Check if previous schedule in the same goal flow is completed
  const canUpdateBasedOnPreviousSchedule = () => {
    // If this schedule has goals and there's a previous schedule
    if (goalTitle && previousScheduleStatus) {
      // Only allow update if previous schedule is completed
      return previousScheduleStatus === "COMPLETED";
    }
    // If no goals or no previous schedule, allow update
    return true;
  };

  // Determine which buttons can be shown based on current status and rules
  const canShowButton = (targetStatus: Schedule["status"]) => {
    // Rule 1: If status is NONE
    if (initialStatus === "NONE") {
      // Check if we can update based on previous schedule in goal flow
      if (!canUpdateBasedOnPreviousSchedule()) {
        return false;
      }

      // If schedule has goals, don't show ABANDONED and MISSED
      if (
        goalTitle &&
        (targetStatus === "ABANDONED" || targetStatus === "MISSED")
      ) {
        return false;
      }

      // Show all available options for NONE status
      return ["IN_PROGRESS", "COMPLETED", "ABANDONED", "MISSED"].includes(
        targetStatus
      );
    }

    // Rule 2: If status is IN_PROGRESS
    if (initialStatus === "IN_PROGRESS") {
      // Only show COMPLETED option
      return targetStatus === "COMPLETED";
    }

    // Rule 3: If status is COMPLETED, ABANDONED, or MISSED
    // No further updates allowed
    return false;
  };

  // Show blocking message when previous schedule prevents updates
  const renderBlockingMessage = () => {
    if (
      goalTitle &&
      previousScheduleStatus &&
      previousScheduleStatus !== "COMPLETED"
    ) {
      return (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800">
            ⚠️ Selesaikan jadwal sebelumnya pada tujuan ini terlebih dahulu sebelum
            memperbarui jadwal ini.
          </p>
        </div>
      );
    }
    return null;
  };

  // Show appreciation message for completed status
  const renderAppreciationMessage = () => {
    if (initialStatus === "COMPLETED") {
      return (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800 font-medium">
            🎉 Bagus! Jadwal ini telah selesai.
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="text-sm font-medium text-gray-500 mb-3">Perbarui Status</h4>

      {/* Show buttons only if status allows updates */}
      {(initialStatus === "NONE" || initialStatus === "IN_PROGRESS") && (
        <div className="flex flex-wrap gap-3">
          {canShowButton("IN_PROGRESS") && (
            <Button
              variant={status === "IN_PROGRESS" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatus("IN_PROGRESS")}
              className={
                status === "IN_PROGRESS" ? "bg-blue-600 hover:bg-blue-700" : ""
              }
            >
              <Clock className="h-4 w-4 mr-1" />
              Sedang Berjalan
            </Button>
          )}

          {canShowButton("COMPLETED") && (
            <Button
              variant={status === "COMPLETED" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatus("COMPLETED")}
              className={
                status === "COMPLETED" ? "bg-green-600 hover:bg-green-700" : ""
              }
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Selesai
            </Button>
          )}

          {canShowButton("ABANDONED") && (
            <Button
              variant={status === "ABANDONED" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatus("ABANDONED")}
              className={
                status === "ABANDONED"
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : ""
              }
            >
              <XCircle className="h-4 w-4 mr-1" />
              Dibatalkan
            </Button>
          )}

          {canShowButton("MISSED") && (
            <Button
              variant={status === "MISSED" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatus("MISSED")}
              className={
                status === "MISSED" ? "bg-red-600 hover:bg-red-700" : ""
              }
            >
              <XCircle className="h-4 w-4 mr-1" />
              Terlewat
            </Button>
          )}
        </div>
      )}

      {/* Show blocking message if previous schedule prevents updates */}
      {renderBlockingMessage()}

      {/* Show appreciation message for completed schedules */}
      {renderAppreciationMessage()}

      {/* Show current status message for active updates */}
      {message && !renderAppreciationMessage() && (
        <p className="mt-4 text-sm text-gray-600 font-medium">{message}</p>
      )}
    </div>
  );
}