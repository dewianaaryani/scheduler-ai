// app/api/user/availability/route.ts
import { NextResponse } from "next/server";
import { requireUser } from "@/app/lib/hooks";
import { prisma } from "@/app/lib/db";
import { UserPreferences } from "@/app/lib/types";

export async function POST(request: Request) {
  try {
    const session = await requireUser();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // Parse the request body
    const availabilityData = await request.json();

    // Validate the data structure
    const {
      hasRegularSchedule,
      wantsPreferredBlocks,
      preferredTimeBlocks,
      sameScheduleDaily,
      dailyBusyBlocks,
      weeklyBusyBlocks,
      notes,
    } = availabilityData;

    // Create the preferences object (replace entirely)
    const preferences: UserPreferences = {
      availability: {
        hasRegularSchedule,
        wantsPreferredBlocks,
        preferredTimeBlocks: preferredTimeBlocks || [],
        sameScheduleDaily,
        dailyBusyBlocks: dailyBusyBlocks || [],
        weeklyBusyBlocks: weeklyBusyBlocks || {},
        notes: notes || "",
        updatedAt: new Date().toISOString(),
      },
    };

    // Update the user's preferences (completely replace)
    // Type assertion to satisfy Prisma's JSON type requirements
    const updatedUser = await prisma.user.update({
      where: {
        id: session.id,
      },
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        preferences: preferences as any, // Type assertion for Prisma JSON
      },
      select: {
        id: true,
        preferences: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Availability preferences saved successfully",
      data: (updatedUser.preferences as UserPreferences)?.availability,
    });
  } catch (error: unknown) {
    console.error("Error saving availability preferences:", error);

    // Handle specific Prisma errors with proper typing
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    }

    return NextResponse.json(
      { error: "Failed to save preferences" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await requireUser();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        preferences: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Type the preferences properly
    const preferences = user.preferences as UserPreferences | null;
    const availabilityData = preferences?.availability || null;

    // If no availability data exists, return default structure
    if (!availabilityData) {
      return NextResponse.json({
        success: true,
        data: {
          hasRegularSchedule: null,
          wantsPreferredBlocks: null,
          preferredTimeBlocks: [],
          sameScheduleDaily: null,
          dailyBusyBlocks: [],
          weeklyBusyBlocks: {},
          notes: "",
          lastUpdated: user.updatedAt.toISOString(),
          isConfigured: false,
        },
      });
    }
    console.log("Availability data fetched:", availabilityData);
    console.log(user.preferences);

    // Return formatted availability data
    return NextResponse.json({
      success: true,
      data: {
        hasRegularSchedule: availabilityData.hasRegularSchedule,
        wantsPreferredBlocks: availabilityData.wantsPreferredBlocks,
        preferredTimeBlocks: availabilityData.preferredTimeBlocks || [],
        sameScheduleDaily: availabilityData.sameScheduleDaily,
        dailyBusyBlocks: availabilityData.dailyBusyBlocks || [],
        weeklyBusyBlocks: availabilityData.weeklyBusyBlocks || {},
        notes: availabilityData.notes || "",
        lastUpdated: availabilityData.updatedAt || user.updatedAt.toISOString(),
        isConfigured: true,
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching availability preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}
