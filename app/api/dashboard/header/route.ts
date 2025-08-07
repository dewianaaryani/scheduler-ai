import { prisma } from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await requireUser();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Tidak diizinkan" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Pengguna tidak ditemukan" },
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
      ? "Mereka telah meningkat bulan ini dibandingkan bulan lalu."
      : thisMonthPercent === lastMonthPercent
      ? "Progres mereka konsisten dengan bulan sebelumnya."
      : "Progres mereka sedikit menurun bulan ini.";

  const prompt = `Berikan pesan motivasi yang mengangkat semangat dalam 1-2 kalimat untuk seseorang bernama ${user.name}. ${improvement} Hindari menyebutkan angka atau statistik secara langsung. Berikan pesan dalam bahasa Indonesia.`;

  const completion = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-20250514",
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
    "Kamu hebat—terus hadir dan berikan usaha terbaikmu!";

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
