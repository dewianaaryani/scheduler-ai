import { prisma } from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await requireUser();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Get schedules for this month
  const thisMonthSchedules = await prisma.schedule.findMany({
    where: {
      userId: user.id,
      startedTime: {
        gte: startOfThisMonth,
        lte: now,
      },
    },
  });

  // Get schedules for last month
  const lastMonthSchedules = await prisma.schedule.findMany({
    where: {
      userId: user.id,
      startedTime: {
        gte: startOfLastMonth,
        lte: endOfLastMonth,
      },
    },
  });

  const calcPercent = (schedules: typeof thisMonthSchedules) => {
    if (!schedules.length) return 0;
    const total = schedules.reduce(
      (acc, s) => acc + (parseInt(s.percentComplete ?? "0") || 0),
      0
    );
    return Math.round(total / schedules.length);
  };

  const thisMonthPercent = calcPercent(thisMonthSchedules);
  const lastMonthPercent = calcPercent(lastMonthSchedules);
  console.log("thisMonthPercent", thisMonthPercent);
  console.log("lastMonthPercent", lastMonthPercent);

  const improvement =
    thisMonthPercent > lastMonthPercent
      ? "They have improved this month compared to the last."
      : thisMonthPercent === lastMonthPercent
      ? "Their progress is consistent with the previous month."
      : "Their progress has slightly decreased this month.";

  const prompt = `Give an uplifting 1–2 sentence motivational message for someone named ${user.name}. ${improvement} Avoid stating any numbers or statistics directly.`;

  const completion = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  const completionData = await completion.json();
  const aiMessage =
    completionData?.content?.[0]?.text ??
    "You're doing great—keep showing up and putting in the effort!";

  return NextResponse.json({
    success: true,
    data: {
      today: now.toISOString(),
      user: {
        name: user.name,
        avatar: user.image ?? "/placeholder.svg",
        message: aiMessage,
      },
    },
  });
}
