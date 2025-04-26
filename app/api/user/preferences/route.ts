import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireUser } from "@/app/lib/hooks";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const session = await requireUser();
  const body = await req.json();

  try {
    const { userType, workingDays, workStart, workEnd, sleepStart, sleepEnd } =
      body;

    await prisma.user.update({
      where: { id: session.id },
      data: {
        preferences: {
          userType,
          workingDays,
          workStart,
          workEnd,
          sleepStart,
          sleepEnd,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Preferences saved successfully",
    });
  } catch (error) {
    console.error("Error saving preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
