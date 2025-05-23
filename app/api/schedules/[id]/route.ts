import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params adalah Promise
) {
  const { id } = await params; // await params dulu baru destructure id
  const { status, notes } = await req.json();

  try {
    const updatedSchedule = await prisma.schedule.update({
      where: { id },
      data: {
        status,
        notes,
      },
    });

    return NextResponse.json({ success: true, data: updatedSchedule });
  } catch (error) {
    console.error("Failed to update schedule:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update schedule" },
      { status: 500 }
    );
  }
}
