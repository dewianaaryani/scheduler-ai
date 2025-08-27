import { requireUser } from "@/app/lib/hooks";
import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";
import { validateGoalData, validateScheduleData } from "@/app/lib/validation";
import { SaveGoalRequest, SaveGoalResponse } from "@/app/lib/types/goal-api";

export async function POST(request: Request) {
  try {
    const session = await requireUser();
    if (!session?.id) {
      return NextResponse.json(
        { error: "Autentikasi diperlukan" },
        { status: 401 }
      );
    }

    const userId = session.id;
    const body: SaveGoalRequest = await request.json();

    // Validate and clean goal data
    const cleanGoalData = validateGoalData(body);

    // Calculate duration first for use in duplicate check response
    const startDate = new Date(cleanGoalData.startDate);
    const endDate = new Date(cleanGoalData.endDate);
    const startUTC = new Date(startDate);
    startUTC.setUTCHours(0, 0, 0, 0);
    const endUTC = new Date(endDate);
    endUTC.setUTCHours(0, 0, 0, 0);
    const daysDuration =
      Math.floor(
        (endUTC.getTime() - startUTC.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

    // Check for duplicate goal creation (same title within last 5 seconds)
    const fiveSecondsAgo = new Date(Date.now() - 5000);
    const existingGoal = await prisma.goal.findFirst({
      where: {
        userId,
        title: cleanGoalData.title,
        createdAt: {
          gte: fiveSecondsAgo,
        },
      },
      include: {
        schedules: true,
      },
    });

    if (existingGoal) {
      console.log(
        "Duplicate goal request detected, returning existing goal:",
        existingGoal.id
      );
      return NextResponse.json({
        ...existingGoal,
        requiresScheduleGeneration: false,
        duration: daysDuration,
        duplicate: true,
      });
    }

    // Validate and clean schedule data with progressive percentages
    const cleanSchedules =
      body.schedules?.map((schedule, index, arr) => {
        try {
          // Log the raw schedule data to debug date issues
          if (!schedule.startedTime || !schedule.endTime) {
            console.error(`Schedule ${index + 1} missing dates:`, {
              title: schedule.title,
              startedTime: schedule.startedTime,
              endTime: schedule.endTime,
            });
          }

          const validated = validateScheduleData({
            ...schedule,
            order: schedule.order?.toString() || String(index),
          });
          // Calculate progressive percentage
          const progressivePercent = Math.round(
            ((index + 1) / arr.length) * 100
          );
          validated.percentComplete = String(progressivePercent);
          // Ensure the last schedule is exactly 100%
          if (index === arr.length - 1) {
            validated.percentComplete = "100";
          }
          return validated;
        } catch (error) {
          console.error(`Error validating schedule ${index + 1}:`, error);
          console.error("Schedule data:", schedule);
          throw error;
        }
      }) || [];

    // Always create goal with all schedules from preview
    const createdGoal = await prisma.goal.create({
      data: {
        userId,
        title: cleanGoalData.title,
        description: cleanGoalData.description,
        startDate: cleanGoalData.startDate,
        endDate: cleanGoalData.endDate,
        emoji: cleanGoalData.emoji,
        status: "ACTIVE",
        schedules: {
          create: cleanSchedules.map((schedule) => ({
            userId,
            title: schedule.title,
            description: schedule.description,
            notes: schedule.notes,
            startedTime: schedule.startedTime,
            endTime: schedule.endTime,
            percentComplete: String(schedule.percentComplete || 0),
            emoji: schedule.emoji,
            status: "NONE",
            order: schedule.order,
          })),
        },
      },
      include: {
        schedules: true,
      },
    });

    console.log("Tujuan berhasil dibuat:", createdGoal.id);

    // Build response that matches SaveGoalResponse type
    const response: SaveGoalResponse = {
      id: createdGoal.id,
      title: createdGoal.title,
      description: createdGoal.description || "",
      startDate: createdGoal.startDate,
      endDate: createdGoal.endDate,
      emoji: createdGoal.emoji || "🎯",
      status: createdGoal.status,
      schedules: createdGoal.schedules.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description || "",
        startedTime: s.startedTime,
        endTime: s.endTime,
        status: s.status,
      })),
      duration: daysDuration,
      duplicate: false,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error saving goal:", error);

    // Provide more specific error information
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Gagal menyimpan tujuan",
          details: error.message,
          type: error.constructor.name,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Gagal menyimpan tujuan" },
      { status: 500 }
    );
  }
}
