import { z } from "zod";

export const formSchema = z
  .object({
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    description: z.string().min(10, {
      message: "Description must be at least 10 characters.",
    }),
    startedTime: z.date({
      required_error: "A date and time is required.",
    }),
    endTime: z.date({
      required_error: "A date and time is required.",
    }),
    icon: z.string().min(1, {
      message: "Icon must be choosen",
    }),
  })
  .superRefine(({ startedTime, endTime }, ctx) => {
    if (startedTime && endTime) {
      const diffInMilliseconds = endTime.getTime() - startedTime.getTime();
      const diffInHours = diffInMilliseconds / (1000 * 60 * 60); // Konversi ke jam

      if (diffInHours < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time must be at least 1 hour after start time",
          path: ["endTime"],
        });
      }
    }
  });
