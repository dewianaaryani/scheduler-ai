// app/api/analytics/route.ts
import { auth } from "@/app/lib/auth";
import { getAnalyticsData } from "@/lib/analytics";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("📊 Analytics API called");

    // Check authentication
    const session = await auth();

    if (!session?.user?.id) {
      console.log("❌ Unauthorized - no session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ User authenticated:", session.user.id);

    // Get date range parameter
    const { searchParams } = new URL(request.url);
    const dateRange = parseInt(searchParams.get("dateRange") || "30");

    console.log("📅 Date range:", dateRange);

    // Get analytics data using your function
    const analyticsData = await getAnalyticsData(session.user.id, dateRange);

    console.log("📈 Analytics data retrieved:", {
      totalGoals: analyticsData.totalGoals,
      totalSchedules: analyticsData.totalSchedules,
      goalCompletionRate: analyticsData.goalCompletionRate,
      scheduleCompletionRate: analyticsData.scheduleCompletionRate,
    });

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error("❌ Analytics API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        stack:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.stack
              : ""
            : undefined,
      },
      { status: 500 }
    );
  }
}

// Optional: Add a simple test endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.test === "ping") {
      return NextResponse.json({
        message: "Analytics API is working!",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      });
    }

    return NextResponse.json(
      { error: "Invalid test request" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Test failed" }, { status: 500 });
  }
}
