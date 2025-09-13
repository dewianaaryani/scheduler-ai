"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Clock,
  Calendar,
  Edit2,
  CheckCircle,
  XCircle,
  Settings,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AvailabilityFlow from "../availability";
import { toast } from "sonner";

interface AvailabilityData {
  hasRegularSchedule: boolean | null;
  wantsPreferredBlocks: boolean | null;
  preferredTimeBlocks: string[];
  sameScheduleDaily: boolean | null;
  dailyBusyBlocks: string[];
  weeklyBusyBlocks: Record<string, string[]>;
  notes: string;
  lastUpdated: string;
  isConfigured: boolean;
}

const timeBlockLabels: Record<string, string> = {
  "6-9": "6:00 – 9:00",
  "9-12": "9:00 – 12:00",
  "12-15": "12:00 – 15:00",
  "15-18": "15:00 – 18:00",
  "18-21": "18:00 – 21:00",
  "21-24": "21:00 – 00:00",
};

const dayLabels: Record<string, string> = {
  monday: "Sen",
  tuesday: "Sel",
  wednesday: "Rab",
  thursday: "Kam",
  friday: "Jum",
  saturday: "Sab",
  sunday: "Min",
};

export default function AvailabilityOverview() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [availabilityData, setAvailabilityData] =
    useState<AvailabilityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch availability data
  const fetchAvailabilityData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/user/availability");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch availability data");
      }

      setAvailabilityData(result.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      toast.error("Gagal memuat preferensi ketersediaan", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAvailabilityData();
  }, []);

  // Refresh data when modal closes (after potential updates)
  const handleModalClose = (open: boolean) => {
    setIsEditModalOpen(open);
    if (!open) {
      // Refresh data when modal closes
      fetchAvailabilityData();
    }
  };

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });
  };

  const getTotalBusyBlocks = () => {
    if (!availabilityData) return 0;

    if (availabilityData.sameScheduleDaily) {
      // For daily routine, count dailyBusyBlocks
      return availabilityData.dailyBusyBlocks?.length || 0;
    } else {
      // For weekly pattern, count all blocks across all days
      return Object.values(availabilityData.weeklyBusyBlocks || {}).flat()
        .length;
    }
  };

  const getWeeklyBusySummary = () => {
    if (!availabilityData) return [];

    if (availabilityData.sameScheduleDaily) {
      // For daily routine, show the same blocks for each day
      if (availabilityData.dailyBusyBlocks?.length > 0) {
        return [
          {
            day: "Harian",
            blocks: availabilityData.dailyBusyBlocks
              .map((block) => timeBlockLabels[block])
              .join(", "),
            count: availabilityData.dailyBusyBlocks.length,
          },
        ];
      }
      return [];
    } else {
      // For weekly pattern, show blocks per day
      return Object.entries(availabilityData.weeklyBusyBlocks || {})
        .filter(([, blocks]) => blocks.length > 0)
        .map(([day, blocks]) => ({
          day: dayLabels[day],
          blocks: blocks.map((block) => timeBlockLabels[block]).join(", "),
          count: blocks.length,
        }));
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="bg-white border-gray-200 text-gray-800 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <Skeleton className="h-10 w-20" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="bg-white border-gray-200 text-gray-800 shadow-lg">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Gagal Memuat Ketersediaan
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={fetchAvailabilityData} variant="outline">
                  Coba Lagi
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Muat ulang data ketersediaan</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>
    );
  }

  // Not configured state
  if (availabilityData && !availabilityData.isConfigured) {
    return (
      <Card className="bg-white border-gray-200 text-gray-800 shadow-lg">
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 text-violet-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Atur Ketersediaanmu
          </h3>
          <p className="text-gray-600 mb-4">
            Konfigurasikan preferensi penjadwalanmu untuk membantu kami membuat
            jadwal yang lebih baik untukmu.
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Atur Ketersediaan
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Konfigurasikan jadwal dan preferensi waktumu</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>
    );
  }

  if (!availabilityData) return null;

  const busySummary = getWeeklyBusySummary();

  return (
    <>
      <Card className="bg-white border-gray-200 text-gray-800 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-violet-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Preferensi Waktu
                </CardTitle>
                <p className="text-gray-600 text-sm">
                  Preferensi penjadwalan dan waktu sibukmu saat ini
                </p>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setIsEditModalOpen(true)}
                    variant="outline"
                    className="border-violet-300 text-violet-700 hover:bg-violet-50 hover:border-violet-400"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Perbarui
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit preferensi waktu dan jadwal sibukmu</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Busy Times Summary */}
          {availabilityData.hasRegularSchedule && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                Waktu Sibuk
              </h3>

              {busySummary.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Total blok sibuk: {getTotalBusyBlocks()}</span>
                    <span>•</span>
                    <span>
                      {availabilityData.sameScheduleDaily
                        ? "Diterapkan dari senin hingga minggu"
                        : `Hari aktif: ${busySummary.length}`}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    {busySummary.map((day) => (
                      <div
                        key={day.day}
                        className="bg-red-50 border border-red-200 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-800">
                            {day.day}
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-red-100 text-red-700 text-xs"
                          >
                            {day.count} blok
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{day.blocks}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 font-medium">
                    Tidak ada blok sibuk dikonfigurasi
                  </p>
                  <p className="text-green-600 text-sm">
                    Kamu tersedia sepanjang waktu!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Preferred Time Blocks (for flexible schedules) */}
          {!availabilityData.hasRegularSchedule &&
            availabilityData.wantsPreferredBlocks && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  Waktu Preferensi
                </h3>
                <div className="flex flex-wrap gap-2">
                  {availabilityData.preferredTimeBlocks.map((block) => (
                    <Badge
                      key={block}
                      className="bg-green-100 text-green-800 border-green-200"
                    >
                      {timeBlockLabels[block]}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

          {/* Additional Notes */}
          {availabilityData.notes && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Preferensi Tambahan
              </h3>
              <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {availabilityData.notes}
                </p>
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              Terakhir diperbarui:{" "}
              {formatLastUpdated(availabilityData.lastUpdated)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="min-w-sm md:min-w-2xl max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-0">
            {" "}
            <DialogTitle className="sr-only">Edit Ketersediaan</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6 pt-0">
            <AvailabilityFlow
              onComplete={() => {
                setIsEditModalOpen(false);
                fetchAvailabilityData();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
