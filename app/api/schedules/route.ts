"use server";

import { prisma } from "@/app/lib/db";
import { z } from "zod";

const scheduleSchema = z.object({
  userId: z.string(),
  stepId: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters long"),
  startedTime: z.string().transform((str) => new Date(str)),
  endTime: z.string().transform((str) => new Date(str)),
  icon: z.string(),
  recurrence: z.enum(["DAILY", "WEEKLY", "MONTHLY", "NONE"]), // Sesuaikan dengan enum di Prisma
  status: z.enum(["UPCOMING", "IN_PROGRESS", "COMPLETED", "MISSED"]), // Sesuaikan dengan enum di Prisma
});
type ScheduleFormData = z.infer<typeof scheduleSchema>;

export async function storeSchedule(formData: ScheduleFormData) {
  const parsedData = scheduleSchema.safeParse(formData);
  if (!parsedData.success) {
    return { error: parsedData.error.errors };
  }

  try {
    const schedule = await prisma.schedule.create({
      data: parsedData.data,
    });
    return { success: true, schedule };
  } catch (error) {
    console.error("Failed to create schedule:", error); // Menampilkan error di console
    return { error: "Failed to create schedule" };
  }
}
