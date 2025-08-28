"use client";

import Link from "next/link";
import { useState, useEffect, use, useCallback } from "react";
import { ArrowLeft, Calendar, Clock, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Goal } from "@/app/lib/types";
import BadgeStatus from "@/app/components/BadgeStatus";
import { ScheduleTabs } from "@/app/components/goals/schedule-tabs";
import { formatDateYear } from "@/app/lib/utils";

export default function GoalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoal = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/goals/${id}`);

      if (!res.ok) {
        throw new Error(`Error fetching goal: ${res.status}`);
      }

      const data = await res.json();
      setGoal(data);
    } catch (err) {
      console.error("Failed to fetch goal:", err);
      setError("Gagal memuat data tujuan");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGoal();
  }, [id, fetchGoal]);

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-4 px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-32 sm:w-64" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-4 w-full" />
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>

        <Skeleton className="h-96" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <Link
            href="/goals"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Tujuan
          </Link>
        </div>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-destructive flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <p className="text-sm sm:text-base">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No goal found
  if (!goal) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <Link
            href="/goals"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Tujuan
          </Link>
        </div>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <p className="text-sm sm:text-base text-muted-foreground">Tujuan tidak ditemukan</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate days remaining
  const today = new Date();
  const endDate = new Date(goal.endDate);
  const daysRemaining = Math.ceil(
    (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate overall progress based on completed schedules or use provided percentComplete
  const overallProgress =
    goal.percentComplete !== undefined
      ? goal.percentComplete
      : goal.schedules.length > 0
        ? Math.round(
            (goal.schedules.filter((s) => s.status === "COMPLETED").length /
              goal.schedules.length) *
              100
          )
        : 0;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 px-4">
      {/* Header Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Link
          href="/goals"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Kembali ke Tujuan</span>
        </Link>
        <Button size="sm" variant="outline" asChild className="w-full sm:w-auto">
          <Link href={`/goals/${goal.id}/settings-goals`}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Perbarui Tujuan</span>
          </Link>
        </Button>
      </div>

      {/* Goal Title Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-2xl sm:text-3xl" role="img" aria-label="Goal emoji">
              {goal.emoji}
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight break-words flex-1">
              {goal.title}
            </h1>
          </div>
          <BadgeStatus status={goal.status} />
        </div>
        <p className="text-sm sm:text-base text-muted-foreground break-words">
          {goal.description}
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Progress Card */}
        <Card className="overflow-hidden">
          <CardHeader className="p-4 sm:p-6 pb-3">
            <CardTitle className="text-base sm:text-lg">Progres</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Lacak status penyelesaian Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-sm font-medium">
                  {overallProgress}% selesai
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  <Calendar className="inline mr-1 h-3 w-3" />
                  Dimulai {formatDateYear(goal.startDate)}
                </span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                {goal.status === "COMPLETED" ? (
                  <span className="text-sm text-green-600 font-medium">
                    ✓ Tujuan selesai!
                  </span>
                ) : (
                  <span
                    className={`text-sm ${
                      daysRemaining < 7 ? "text-destructive font-medium" : ""
                    }`}
                  >
                    {daysRemaining} hari tersisa
                  </span>
                )}
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {goal.status === "COMPLETED"
                  ? `Selesai ${formatDateYear(goal.updatedAt)}`
                  : `Jatuh tempo ${formatDateYear(goal.endDate)}`}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Card */}
        <Card className="overflow-hidden">
          <CardHeader className="p-4 sm:p-6 pb-3">
            <CardTitle className="text-base sm:text-lg">Timeline Tujuan</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Perjalanan tujuan Anda dari awal hingga akhir
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium">Tanggal Mulai</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {formatDateYear(goal.startDate)}
                </p>
              </div>
              <div className="h-px sm:h-0.5 bg-muted w-full sm:w-auto sm:flex-1 mx-0 sm:mx-4"></div>
              <div className="flex-1 sm:text-right">
                <p className="text-sm font-medium">Tanggal Selesai</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {formatDateYear(goal.endDate)}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t">
              <p className="text-sm font-medium mb-3">Detail Tujuan</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Dibuat</span>
                  <span className="text-xs sm:text-sm">{formatDateYear(goal.createdAt)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">
                    Terakhir Diperbarui
                  </span>
                  <span className="text-xs sm:text-sm">{formatDateYear(goal.updatedAt)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedules Card */}
      <Card className="overflow-hidden">
        <CardHeader className="p-4 sm:p-6 pb-3">
          <CardTitle className="text-base sm:text-lg">Jadwal</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Aktivitas yang direncanakan untuk mencapai tujuan Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <ScheduleTabs goal={goal} onUpdate={fetchGoal} />
        </CardContent>
        <CardFooter className="p-4 sm:p-6 pt-0">
          <p className="text-xs text-muted-foreground">
            Jadwal membantu Anda memecah tujuan menjadi aktivitas yang dapat
            dikelola dengan jangka waktu tertentu.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}