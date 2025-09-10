import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Tidak diizinkan" }, { status: 401 });
  }

  const userId = session.user.id;
  const username = session.user.name;
  const hasSchedule = await prisma.schedule.count({
    where: {
      userId,
    },
  });

  const hasGoals = await prisma.goal.count({
    where: {
      userId,
    },
  });
  console.log({ hasSchedule, hasGoals });

  return NextResponse.json({
    hasSchedule,
    hasGoals,
    username,
  });
}
