import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Edit, Plus } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Type definitions based on your schema
type StatusGoal = "ACTIVE" | "COMPLETED" | "ABANDONED";
type StatusSchedule =
  | "NONE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "MISSED"
  | "ABANDONED";

interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  emoji: string;
  status: StatusGoal;
  createdAt: Date;
  updatedAt: Date;
  schedules: Schedule[];
}

interface Schedule {
  id: string;
  userId: string;
  goalId: string;
  order: string | null;
  title: string;
  description: string;
  notes: string | null;
  startedTime: Date;
  endTime: Date;
  percentComplete: string | null;
  emoji: string;
  status: StatusSchedule;
  createdAt: Date;
  updatedAt: Date;
}

export default function GoalDetailPage({ params }: { params: { id: string } }) {
  // This would normally come from your database
  const goal: Goal = {
    id: params.id,
    userId: "user123",
    title: "Complete Frontend Development Course",
    description:
      "Finish the advanced React course on Udemy and build 3 projects to practice the concepts learned.",
    startDate: new Date("2025-03-15"),
    endDate: new Date("2025-06-30"),
    emoji: "🎯",
    status: "ACTIVE",
    createdAt: new Date("2025-03-15"),
    updatedAt: new Date("2025-03-15"),
    schedules: [
      {
        id: "1",
        userId: "user123",
        goalId: params.id,
        order: "1",
        title: "Complete React Fundamentals",
        description: "Go through the React fundamentals section of the course",
        notes: "Focus on hooks and component lifecycle",
        startedTime: new Date("2025-03-16T09:00:00"),
        endTime: new Date("2025-03-20T17:00:00"),
        percentComplete: "100",
        emoji: "📚",
        status: "COMPLETED",
        createdAt: new Date("2025-03-15"),
        updatedAt: new Date("2025-03-20"),
      },
      {
        id: "2",
        userId: "user123",
        goalId: params.id,
        order: "2",
        title: "Build First Practice Project",
        description: "Create a simple todo app using React",
        notes: "Implement context API for state management",
        startedTime: new Date("2025-03-22T09:00:00"),
        endTime: new Date("2025-03-28T17:00:00"),
        percentComplete: "100",
        emoji: "🛠️",
        status: "COMPLETED",
        createdAt: new Date("2025-03-15"),
        updatedAt: new Date("2025-03-28"),
      },
      {
        id: "3",
        userId: "user123",
        goalId: params.id,
        order: "3",
        title: "Advanced State Management",
        description: "Learn Redux and other state management libraries",
        notes: null,
        startedTime: new Date("2025-04-01T09:00:00"),
        endTime: new Date("2025-04-15T17:00:00"),
        percentComplete: "60",
        emoji: "🧠",
        status: "IN_PROGRESS",
        createdAt: new Date("2025-03-15"),
        updatedAt: new Date("2025-04-10"),
      },
      {
        id: "4",
        userId: "user123",
        goalId: params.id,
        order: "4",
        title: "Build Second Project",
        description: "Create an e-commerce site with React and Redux",
        notes: null,
        startedTime: new Date("2025-04-20T09:00:00"),
        endTime: new Date("2025-05-10T17:00:00"),
        percentComplete: "0",
        emoji: "🏗️",
        status: "NONE",
        createdAt: new Date("2025-03-15"),
        updatedAt: new Date("2025-03-15"),
      },
    ],
  };

  // Calculate days remaining
  const today = new Date();
  const endDate = new Date(goal.endDate);
  const daysRemaining = Math.ceil(
    (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate overall progress based on completed schedules
  const completedSchedules = goal.schedules.filter(
    (s) => s.status === "COMPLETED"
  ).length;
  const totalSchedules = goal.schedules.length;
  const overallProgress =
    totalSchedules > 0
      ? Math.round((completedSchedules / totalSchedules) * 100)
      : 0;

  // Get status badge color
  const getStatusColor = (status: StatusGoal) => {
    switch (status) {
      case "ACTIVE":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "ABANDONED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get schedule status badge color
  const getScheduleStatusColor = (status: StatusSchedule) => {
    switch (status) {
      case "NONE":
        return "bg-gray-100 text-gray-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "MISSED":
        return "bg-yellow-100 text-yellow-800";
      case "ABANDONED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date to readable string
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time to readable string
  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
        <Button size="sm" variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Goal
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-3xl" role="img" aria-label="Goal emoji">
            {goal.emoji}
          </span>
          <h1 className="text-3xl font-bold tracking-tight">{goal.title}</h1>
          <Badge className={getStatusColor(goal.status)}>{goal.status}</Badge>
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
                  Started {formatDate(goal.startDate)}
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
                Due {formatDate(goal.endDate)}
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
                  {formatDate(goal.startDate)}
                </p>
              </div>
              <div className="h-0.5 bg-muted flex-1 mx-4"></div>
              <div className="text-right">
                <p className="font-medium">End Date</p>
                <p className="text-muted-foreground">
                  {formatDate(goal.endDate)}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-sm font-medium mb-2">Goal Details</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Created</span>
                  <span>{formatDate(goal.createdAt)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{formatDate(goal.updatedAt)}</span>
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
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Schedule
            </Button>
          </div>
          <CardDescription>
            Activities planned to achieve your goal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {goal.schedules.map((schedule) => (
                <Card key={schedule.id} className="overflow-hidden">
                  <div className="flex border-l-4 border-primary">
                    <div className="p-4 flex items-center justify-center bg-muted/30 w-16">
                      <span
                        className="text-2xl"
                        role="img"
                        aria-label="Schedule emoji"
                      >
                        {schedule.emoji}
                      </span>
                    </div>
                    <CardContent className="p-4 flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{schedule.title}</h3>
                          <Badge
                            className={getScheduleStatusColor(schedule.status)}
                          >
                            {schedule.status.replace("_", " ")}
                          </Badge>
                        </div>
                        {schedule.percentComplete && (
                          <Badge variant="outline">
                            {schedule.percentComplete}%
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {schedule.description}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground block">
                            Start Time
                          </span>
                          <span>{formatDateTime(schedule.startedTime)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">
                            End Time
                          </span>
                          <span>{formatDateTime(schedule.endTime)}</span>
                        </div>
                      </div>
                      {schedule.notes && (
                        <div className="mt-2 text-sm border-t pt-2">
                          <span className="text-muted-foreground block text-xs">
                            Notes
                          </span>
                          <p>{schedule.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {goal.schedules
                .filter((s) => s.status === "COMPLETED")
                .map((schedule) => (
                  <Card key={schedule.id} className="overflow-hidden">
                    {/* Same card content as above */}
                    <div className="flex border-l-4 border-green-500">
                      <div className="p-4 flex items-center justify-center bg-muted/30 w-16">
                        <span
                          className="text-2xl"
                          role="img"
                          aria-label="Schedule emoji"
                        >
                          {schedule.emoji}
                        </span>
                      </div>
                      <CardContent className="p-4 flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{schedule.title}</h3>
                            <Badge
                              className={getScheduleStatusColor(
                                schedule.status
                              )}
                            >
                              {schedule.status.replace("_", " ")}
                            </Badge>
                          </div>
                          {schedule.percentComplete && (
                            <Badge variant="outline">
                              {schedule.percentComplete}%
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {schedule.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground block">
                              Start Time
                            </span>
                            <span>{formatDateTime(schedule.startedTime)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">
                              End Time
                            </span>
                            <span>{formatDateTime(schedule.endTime)}</span>
                          </div>
                        </div>
                        {schedule.notes && (
                          <div className="mt-2 text-sm border-t pt-2">
                            <span className="text-muted-foreground block text-xs">
                              Notes
                            </span>
                            <p>{schedule.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </div>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="in-progress" className="space-y-4">
              {goal.schedules
                .filter((s) => s.status === "IN_PROGRESS")
                .map((schedule) => (
                  <Card key={schedule.id} className="overflow-hidden">
                    {/* Same card content as above with blue border */}
                    <div className="flex border-l-4 border-blue-500">
                      <div className="p-4 flex items-center justify-center bg-muted/30 w-16">
                        <span
                          className="text-2xl"
                          role="img"
                          aria-label="Schedule emoji"
                        >
                          {schedule.emoji}
                        </span>
                      </div>
                      <CardContent className="p-4 flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{schedule.title}</h3>
                            <Badge
                              className={getScheduleStatusColor(
                                schedule.status
                              )}
                            >
                              {schedule.status.replace("_", " ")}
                            </Badge>
                          </div>
                          {schedule.percentComplete && (
                            <Badge variant="outline">
                              {schedule.percentComplete}%
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {schedule.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground block">
                              Start Time
                            </span>
                            <span>{formatDateTime(schedule.startedTime)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">
                              End Time
                            </span>
                            <span>{formatDateTime(schedule.endTime)}</span>
                          </div>
                        </div>
                        {schedule.notes && (
                          <div className="mt-2 text-sm border-t pt-2">
                            <span className="text-muted-foreground block text-xs">
                              Notes
                            </span>
                            <p>{schedule.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </div>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              {goal.schedules
                .filter((s) => s.status === "NONE")
                .map((schedule) => (
                  <Card key={schedule.id} className="overflow-hidden">
                    {/* Same card content as above with gray border */}
                    <div className="flex border-l-4 border-gray-300">
                      <div className="p-4 flex items-center justify-center bg-muted/30 w-16">
                        <span
                          className="text-2xl"
                          role="img"
                          aria-label="Schedule emoji"
                        >
                          {schedule.emoji}
                        </span>
                      </div>
                      <CardContent className="p-4 flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{schedule.title}</h3>
                            <Badge
                              className={getScheduleStatusColor(
                                schedule.status
                              )}
                            >
                              {schedule.status.replace("_", " ")}
                            </Badge>
                          </div>
                          {schedule.percentComplete && (
                            <Badge variant="outline">
                              {schedule.percentComplete}%
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {schedule.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground block">
                              Start Time
                            </span>
                            <span>{formatDateTime(schedule.startedTime)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">
                              End Time
                            </span>
                            <span>{formatDateTime(schedule.endTime)}</span>
                          </div>
                        </div>
                        {schedule.notes && (
                          <div className="mt-2 text-sm border-t pt-2">
                            <span className="text-muted-foreground block text-xs">
                              Notes
                            </span>
                            <p>{schedule.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </div>
                  </Card>
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Schedules help you break down your goal into manageable activities
          with specific timeframes.
        </CardFooter>
      </Card>
    </div>
  );
}
