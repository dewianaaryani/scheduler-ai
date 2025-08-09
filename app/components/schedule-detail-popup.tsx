"use client";

import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Target, NotebookPen } from "lucide-react";
import BadgeStatus from "./BadgeStatus";
import { formatDate, formatTime } from "../lib/utils";
import type { Schedule } from "../lib/types";
import { toast } from "sonner";
import ScheduleStatusUpdater from "./schedul-status-updater";
import Link from "next/link";

type ExtendedSchedule = Schedule;

interface ScheduleDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: ExtendedSchedule;
  onUpdate?: () => void; // Optional callback to refresh parent data
}

export default function ScheduleDetailPopup({
  open,
  onOpenChange,
  schedule,
  onUpdate,
}: ScheduleDetailProps) {
  const [notes, setNotes] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(
    schedule.status || "NONE"
  );
  const [previousSchedule, setPreviousSchedule] = useState<Schedule>();
  const [isLoading, setIsLoading] = useState(false);
  const fetchedScheduleId = useRef<string | null>(null);

  const handleStatusChange = (status: Schedule["status"]) => {
    setSelectedStatus(status);
  };

  useEffect(() => {
    // Only fetch if dialog is open and we haven't fetched for this schedule yet
    if (!open || !schedule?.id || fetchedScheduleId.current === schedule.id) {
      return;
    }

    const fetchPrevious = async () => {
      if (isLoading) return; // Prevent multiple concurrent requests

      setIsLoading(true);
      try {
        const res = await fetch(`/api/schedules/${schedule.id}/previous`);
        if (res.ok) {
          const data = await res.json();
          setPreviousSchedule(data);
          fetchedScheduleId.current = schedule.id; // Mark as fetched
        }
      } catch (error) {
        console.error("Error fetching previous schedule:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrevious();
  }, [open, schedule?.id, isLoading]); // Only depend on dialog open state and schedule id

  // Reset state when dialog closes or schedule changes
  useEffect(() => {
    if (!open) {
      // Reset states when dialog closes
      setNotes("");
      setSelectedStatus(schedule.status || "NONE");
      // Don't reset previousSchedule and fetchedScheduleId to avoid refetching same data
    } else {
      // Update status when dialog opens with new schedule
      setSelectedStatus(schedule.status || "NONE");
      // Reset fetched flag if schedule changed
      if (fetchedScheduleId.current !== schedule.id) {
        setPreviousSchedule(undefined);
        fetchedScheduleId.current = null;
      }
    }
  }, [open, schedule.status, schedule.id]);

  const handleUpdateStatus = async () => {
    try {
      const response = await fetch(`/api/schedules/${schedule.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: selectedStatus,
          notes,
        }),
      });

      if (!response.ok) throw new Error("Gagal menyimpan");

      toast.success("Jadwal berhasil diperbarui!");
      onOpenChange(false);
      // Call parent's update callback instead of refreshing page
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[650px] p-0 overflow-y-auto">
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

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-5">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-violet-500" />
                Tanggal & Waktu
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Tanggal</p>
                  <p className="text-gray-700 font-medium">
                    {formatDate(schedule.startedTime)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Durasi</p>
                  <p className="text-gray-700 font-medium">
                    {formatTime(schedule.startedTime)} -{" "}
                    {formatTime(schedule.endTime)}
                  </p>
                </div>
              </div>
            </div>

            {schedule.goal?.title && (
              <div className="bg-violet-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-violet-500" />
                  Tujuan Terkait
                </h4>
                <Link
                  href={`/goals/${schedule.goal.id}`}
                  className="text-violet-600 hover:underline font-medium"
                >
                  {schedule.goal.title}
                </Link>
              </div>
            )}
            <ScheduleStatusUpdater
              initialStatus={schedule.status}
              goalTitle={schedule.goal?.title}
              previousScheduleStatus={previousSchedule?.status}
              onChange={handleStatusChange}
            />
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Deskripsi
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{schedule.description}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                <NotebookPen className="h-4 w-4 text-violet-500" />
                Catatan
              </h4>
              {!schedule.notes ? (
                <Textarea
                  placeholder="Tambahkan catatan di sini..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none bg-gray-50"
                  rows={4}
                />
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{schedule.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 border-t border-gray-100">
          {(!schedule.status ||
            schedule.status === "NONE" ||
            schedule.status === "IN_PROGRESS") && (
            <Button
              onClick={handleUpdateStatus}
              className="bg-violet-600 hover:bg-violet-700"
            >
              Simpan Perubahan
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
