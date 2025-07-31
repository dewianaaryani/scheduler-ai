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
      setError("Failed to load goal data");
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
      <div className="container max-w-5xl space-y-6 px-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
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
      <div className="container max-w-5xl px-2">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/goals"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Goals
          </Link>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-destructive flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No goal found
  if (!goal) {
    return (
      <div className="container max-w-5xl px-2">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/goals"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Goals
          </Link>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Goal not found</p>
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
    <div className="container max-w-5xl space-y-6 px-2">
      <div className="flex items-center justify-between">
        <Link
          href="/goals"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Goals
        </Link>
        <Button size="sm" variant="outline" asChild>
          <Link href={`/goals/${goal.id}/settings-goals`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Goal
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-3xl" role="img" aria-label="Goal emoji">
            {goal.emoji}
          </span>
          <h1 className="text-3xl font-bold tracking-tight">{goal.title}</h1>
          <BadgeStatus status={goal.status} />
        </div>
        <p className="text-muted-foreground">{goal.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Progress</CardTitle>
            <CardDescription>Track your completion status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {overallProgress}% complete
                </span>
                <span className="text-sm text-muted-foreground">
                  <Calendar className="inline mr-1 h-3 w-3" />
                  Started {formatDateYear(goal.startDate)}
                </span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                <span
                  className={
                    daysRemaining < 7 ? "text-destructive font-medium" : ""
                  }
                >
                  {daysRemaining} days remaining
                </span>
              </div>
              <span className="text-muted-foreground">
                Due {formatDateYear(goal.endDate)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Goal Timeline</CardTitle>
            </div>
            <CardDescription>
              Your goal journey from start to finish
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="font-medium">Start Date</p>
                <p className="text-muted-foreground">
                  {formatDateYear(goal.startDate)}
                </p>
              </div>
              <div className="h-0.5 bg-muted flex-1 mx-4"></div>
              <div className="text-right">
                <p className="font-medium">End Date</p>
                <p className="text-muted-foreground">
                  {formatDateYear(goal.endDate)}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-sm font-medium mb-2">Goal Details</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Created</span>
                  <span>{formatDateYear(goal.createdAt)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{formatDateYear(goal.updatedAt)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Schedules</CardTitle>
          </div>
          <CardDescription>
            Activities planned to achieve your goal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScheduleTabs goal={goal} onUpdate={fetchGoal} />
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Schedules help you break down your goal into manageable activities
          with specific timeframes.
        </CardFooter>
      </Card>
    </div>
  );
}
