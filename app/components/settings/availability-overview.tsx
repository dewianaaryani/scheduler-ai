"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  "6-9": "6:00 – 9:00 AM",
  "9-12": "9:00 – 12:00 PM",
  "12-15": "12:00 – 3:00 PM",
  "15-18": "3:00 – 6:00 PM",
  "18-21": "6:00 – 9:00 PM",
  "21-24": "9:00 PM – 12:00 AM",
};

const dayLabels: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
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
      toast.error("Failed to load availability preferences", {
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
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScheduleTypeDisplay = () => {
    if (!availabilityData?.hasRegularSchedule) {
      return {
        type: "Flexible Schedule",
        description: "Available anytime with optional preferred blocks",
        icon: <Clock className="h-5 w-5 text-green-600" />,
        color: "bg-green-100 text-green-800 border-green-200",
      };
    } else if (availabilityData.sameScheduleDaily) {
      return {
        type: "Daily Routine",
        description: "Same busy blocks every day",
        icon: <CheckCircle className="h-5 w-5 text-blue-600" />,
        color: "bg-blue-100 text-blue-800 border-blue-200",
      };
    } else {
      return {
        type: "Weekly Pattern",
        description: "Different schedule each day",
        icon: <Calendar className="h-5 w-5 text-purple-600" />,
        color: "bg-purple-100 text-purple-800 border-purple-200",
      };
    }
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
            day: "Daily",
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
            Failed to Load Availability
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchAvailabilityData} variant="outline">
            Try Again
          </Button>
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
            Set Up Your Availability
          </h3>
          <p className="text-gray-600 mb-4">
            Configure your scheduling preferences to help us create better
            schedules for you.
          </p>
          <Button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            <Settings className="h-4 w-4 mr-2" />
            Set Up Availability
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!availabilityData) return null;

  const scheduleType = getScheduleTypeDisplay();
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
                  Availability Preferences
                </CardTitle>
                <p className="text-gray-600 text-sm">
                  Your current scheduling preferences and busy times
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditModalOpen(true)}
              variant="outline"
              className="border-violet-300 text-violet-700 hover:bg-violet-50 hover:border-violet-400"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Update
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Schedule Type */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Settings className="h-5 w-5 text-violet-600" />
              Schedule Type
            </h3>
            <div className="flex items-center gap-3">
              <Badge
                className={`${scheduleType.color} flex items-center gap-2 px-3 py-1`}
              >
                {scheduleType.icon}
                {scheduleType.type}
              </Badge>
              <span className="text-gray-600 text-sm">
                {scheduleType.description}
              </span>
            </div>
          </div>

          {/* Busy Times Summary */}
          {availabilityData.hasRegularSchedule && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                Busy Times
              </h3>

              {busySummary.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Total busy blocks: {getTotalBusyBlocks()}</span>
                    <span>•</span>
                    <span>
                      {availabilityData.sameScheduleDaily
                        ? "Applied to all 7 days"
                        : `Active days: ${busySummary.length}`}
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
                            {day.count} blocks
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
                    No busy blocks configured
                  </p>
                  <p className="text-green-600 text-sm">
                    You&apos;re available all the time!
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
                  Preferred Times
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
                Additional Preferences
              </h3>
              <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {availabilityData.notes}
                </p>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-violet-600">
                {availabilityData.hasRegularSchedule
                  ? getTotalBusyBlocks()
                  : availabilityData.preferredTimeBlocks.length || "∞"}
              </div>
              <div className="text-gray-600 text-sm">
                {availabilityData.hasRegularSchedule
                  ? "Busy Blocks"
                  : availabilityData.wantsPreferredBlocks
                    ? "Preferred Blocks"
                    : "Always Available"}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-violet-600">
                {availabilityData.sameScheduleDaily ? 7 : busySummary.length}
              </div>
              <div className="text-gray-600 text-sm">
                {availabilityData.sameScheduleDaily
                  ? "Days with Schedule"
                  : "Active Days"}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-violet-600">
                {availabilityData.sameScheduleDaily
                  ? 0
                  : 7 - busySummary.length}
              </div>
              <div className="text-gray-600 text-sm">Free Days</div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              Last updated: {formatLastUpdated(availabilityData.lastUpdated)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="min-w-sm md:min-w-2xl max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-0">
            {" "}
            <DialogTitle className="sr-only">Edit Availability</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6 pt-0">
            <AvailabilityFlow />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
