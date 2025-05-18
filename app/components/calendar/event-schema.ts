import { addMinutes, format, isAfter, parse } from "date-fns";
import { z } from "zod";

// Define the form schema with Zod
export const formSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title cannot exceed 100 characters"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(500, "Description cannot exceed 500 characters"),
    date: z.date({
      required_error: "Date is required",
    }),
    startTime: z.string({
      required_error: "Start time is required",
    }),
    endTime: z.string({
      required_error: "End time is required",
    }),
    emoji: z.string().min(1, "Emoji is required"),
  })
  .refine(
    (data) => {
      // Parse the time strings to Date objects for comparison
      const startDateTime = parse(
        `${format(data.date, "yyyy-MM-dd")} ${data.startTime}`,
        "yyyy-MM-dd HH:mm",
        new Date()
      );

      const endDateTime = parse(
        `${format(data.date, "yyyy-MM-dd")} ${data.endTime}`,
        "yyyy-MM-dd HH:mm",
        new Date()
      );

      // Check if end time is at least 30 minutes after start time
      const minEndTime = addMinutes(startDateTime, 30);
      return isAfter(endDateTime, minEndTime);
    },
    {
      message: "End time must be at least 30 minutes after start time",
      path: ["endTime"],
    }
  );
