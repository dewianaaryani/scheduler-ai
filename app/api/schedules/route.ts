import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireUser } from "@/app/lib/hooks";

const prisma = new PrismaClient();
// Handle GET request
export async function GET() {
  try {
    const session = await requireUser();
    if (!session || !session.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const schedules = await prisma.schedule.findMany();
    return NextResponse.json(schedules, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { message: "Terjadi kesalahan", error: err.message },
      { status: 500 }
    );
  }
}

// Handle POST request
export async function POST(req: NextRequest) {
  try {
    const session = await requireUser();
    if (!session || !session.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("✅ Data diterima dari frontend:", body);

    const { title, description, startedTime, endTime, icon } = body;

    if (!title || !description || !startedTime || !endTime || !icon) {
      console.error("❌ Data tidak lengkap:", body);
      return NextResponse.json(
        { message: "Semua field harus diisi!" },
        { status: 400 }
      );
    }

    const newSchedule = await prisma.schedule.create({
      data: {
        title,
        description,
        startedTime: new Date(startedTime),
        endTime: new Date(endTime),
        icon,
        recurrence: "NONE",
        status: "NONE",
        userId: session.id,
      },
    });

    console.log("✅ Schedule berhasil dibuat:", newSchedule);
    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ Error terjadi:", err.message, err.stack);
    return NextResponse.json(
      { message: "Terjadi kesalahan", error: err.message },
      { status: 500 }
    );
  }
}
