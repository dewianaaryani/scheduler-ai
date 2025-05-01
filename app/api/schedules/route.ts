import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireUser } from "@/app/lib/hooks";
import { endOfDay, parseISO, startOfDay } from "date-fns";
import { auth } from "@/app/lib/auth";

const prisma = new PrismaClient();
// Handle GET request
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // Default to current week if dates not provided
  const startDateTime = startDate
    ? startOfDay(parseISO(startDate))
    : startOfDay(new Date());

  const endDateTime = endDate
    ? endOfDay(parseISO(endDate))
    : endOfDay(new Date());

  try {
    const schedules = await prisma.schedule.findMany({
      where: {
        userId: session.user.id,
        startedTime: {
          gte: startDateTime,
        },
        endTime: {
          lte: endDateTime,
        },
        status: {
          not: "ABANDONED",
        },
      },
      orderBy: {
        startedTime: "asc",
      },
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
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

    const { title, description, startedTime, endTime, emoji } = body;

    if (!title || !description || !startedTime || !endTime || !emoji) {
      console.error("❌ Data tidak lengkap:", body);
      return NextResponse.json(
        { message: "Semua field harus diisi!" },
        { status: 400 }
      );
    }
    // ⛔ Cek konflik waktu
    const conflictingSchedule = await prisma.schedule.findFirst({
      where: {
        userId: session.id,
        AND: [
          {
            startedTime: {
              lt: new Date(endTime),
            },
          },
          {
            endTime: {
              gt: new Date(startedTime),
            },
          },
        ],
      },
    });

    if (conflictingSchedule) {
      return NextResponse.json(
        { message: "Waktu yang dipilih sudah digunakan oleh jadwal lain." },
        { status: 409 }
      );
    }

    const newSchedule = await prisma.schedule.create({
      data: {
        title,
        description,
        startedTime: new Date(startedTime),
        endTime: new Date(endTime),
        emoji,
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
