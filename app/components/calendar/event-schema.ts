import { addMinutes, format, isAfter, isBefore, parse, startOfDay, endOfDay, isValid } from "date-fns";
import { z } from "zod";

// Custom regex for time validation (HH:mm format)
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

// Custom emoji validation
const emojiRegex = /^(\p{Emoji}|\p{Emoji_Presentation}|\p{Emoji_Modifier_Base}|\p{Emoji_Component})+$/u;

// Define the form schema with Zod
export const formSchema = z
  .object({
    title: z
      .string()
      .min(1, "Judul wajib diisi")
      .max(100, "Judul maksimal 100 karakter")
      .trim()
      .refine(
        (val) => val.length >= 3,
        "Judul minimal 3 karakter"
      ),
    description: z
      .string()
      .min(1, "Deskripsi wajib diisi")
      .max(500, "Deskripsi maksimal 500 karakter")
      .trim()
      .refine(
        (val) => val.length >= 10,
        "Deskripsi minimal 10 karakter untuk lebih jelas"
      ),
    date: z
      .date({
        required_error: "Tanggal wajib dipilih",
        invalid_type_error: "Format tanggal tidak valid",
      })
      .refine(
        (date) => {
          const today = startOfDay(new Date());
          const selectedDate = startOfDay(date);
          return selectedDate >= today;
        },
        "Tidak bisa memilih tanggal yang sudah lewat"
      )
      .refine(
        (date) => {
          const maxDate = new Date();
          maxDate.setFullYear(maxDate.getFullYear() + 1);
          return date <= maxDate;
        },
        "Tanggal tidak boleh lebih dari 1 tahun ke depan"
      ),
    startTime: z
      .string({
        required_error: "Waktu mulai wajib diisi",
      })
      .regex(timeRegex, "Format waktu tidak valid (HH:mm)")
      .refine(
        (time) => {
          const [hours, minutes] = time.split(":").map(Number);
          return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
        },
        "Waktu tidak valid"
      ),
    endTime: z
      .string({
        required_error: "Waktu selesai wajib diisi",
      })
      .regex(timeRegex, "Format waktu tidak valid (HH:mm)"),
    emoji: z
      .string()
      .min(1, "Emoji wajib dipilih")
      .max(20, "Emoji terlalu panjang")
      .refine(
        (val) => {
          // Allow empty string or valid emoji
          return val === "" || emojiRegex.test(val) || val.length <= 20;
        },
        "Emoji tidak valid"
      ),
  })
  .superRefine((data, ctx) => {
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

    // Validate parsed dates
    if (!isValid(startDateTime) || !isValid(endDateTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Format waktu tidak valid",
        path: ["startTime"],
      });
      return;
    }

    // Check if end time is after start time
    if (!isAfter(endDateTime, startDateTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Waktu selesai harus setelah waktu mulai",
        path: ["endTime"],
      });
      return;
    }

    // Check if end time is at least 15 minutes after start time
    const minEndTime = addMinutes(startDateTime, 15);
    if (isBefore(endDateTime, minEndTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Durasi minimal 15 menit",
        path: ["endTime"],
      });
      return;
    }

    // Check if duration is not more than 8 hours
    const maxEndTime = addMinutes(startDateTime, 480); // 8 hours
    if (isAfter(endDateTime, maxEndTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Durasi maksimal 8 jam",
        path: ["endTime"],
      });
      return;
    }

    // Check if event is within reasonable hours (optional)
    const startHour = startDateTime.getHours();
    const endHour = endDateTime.getHours();
    
    // Warning for very early or very late events
    if (startHour < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Peringatan: Acara dimulai sangat pagi (sebelum jam 5)",
        path: ["startTime"],
      });
    }
    
    if (endHour >= 23 || (endHour === 0 && endDateTime.getMinutes() > 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Peringatan: Acara berakhir sangat malam (setelah jam 23)",
        path: ["endTime"],
      });
    }
  });
