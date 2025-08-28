import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkAndCompleteGoal } from "@/app/lib/goal-utils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params adalah Promise
) {
  const { id } = await params; // await params dulu baru destructure id
  const { status, notes } = await req.json();

  try {
    // First, get the schedule to check its goalId
    const existingSchedule = await prisma.schedule.findUnique({
      where: { id },
      select: { goalId: true, status: true }
    });

    if (!existingSchedule) {
      return NextResponse.json(
        { success: false, message: "Jadwal tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update the schedule
    const updatedSchedule = await prisma.schedule.update({
      where: { id },
      data: {
        status,
        notes,
      },
    });

    // If schedule is being marked as COMPLETED and it has a goalId, check if goal should be completed
    if (status === 'COMPLETED' && existingSchedule.goalId) {
      await checkAndCompleteGoal(existingSchedule.goalId);
    }

    return NextResponse.json({ success: true, data: updatedSchedule });
  } catch (error) {
    console.error("Gagal memperbarui jadwal:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui jadwal" },
      { status: 500 }
    );
  }
}
