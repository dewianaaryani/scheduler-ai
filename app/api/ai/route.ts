import { prisma } from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await requireUser();
  if (!session) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  }

  const goals = await prisma.goal.findMany({
    where: { userId: session.id },
    select: { title: true, description: true },
  });

  const historyText = goals
    .map((g, i) => `Goal ${i + 1}: ${g.title} - ${g.description}`)
    .join("\n");

  const prompt = `
Kamu adalah asisten AI yang membantu pengguna usia 22-40 tahun membuat tujuan produktivitas yang pintar dan logis.

KRITERIA WAJIB:
✅ Target yang realistis dan dapat diukur dengan jelas
✅ Memperhitungkan kapasitas manusia normal
✅ Dapat dijadwalkan dengan logika yang masuk akal
✅ Dapat diselesaikan kurang dari 6 bulan
✅ Memiliki perhitungan waktu yang realistis

HINDARI target yang tidak logis seperti:
❌ "12 buku dalam 6 bulan" (buku bisa 100-1000 halaman)
❌ "Belajar 5 bahasa dalam 4 bulan" (tidak realistis)
❌ "Olahraga 2 jam setiap hari" (burnout)

Riwayat tujuan pengguna:
${historyText || "Belum ada riwayat"}

Berikan 4 tujuan baru yang relevan dengan riwayat tujuan pengguna, dalam format CSV:
emoji,title

CONTOH yang LOGIS dan REALISTIS:
🏃,"Lari 30 menit 3x seminggu selama 2 minggu"
📚,"Baca 30 menit setiap hari selama 5 bulan"
💻,"Belajar Python 1 jam per hari selama 3 bulan"

Format: "[Aktivitas spesifik] [Durasi waktu] [Frekuensi] selama [Periode waktu]"

Berikan tepat 4 baris CSV. Judul dalam bahasa Indonesia.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 200, // Much less for CSV
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const json = await response.json();
    const raw = json.content?.[0]?.text ?? "";
    console.log("AI suggestions CSV:", raw);

    // Parse CSV response
    const lines = raw
      .trim()
      .split("\n")
      .filter((line: string) => line.trim());
    const suggestions = lines.slice(0, 4).map((line: string) => {
      // Parse CSV line
      const match = line.match(/^([^,]+),["']?([^"']+)["']?$/);
      if (match) {
        return {
          emoji: match[1].trim(),
          title: match[2].trim(),
        };
      }
      // Fallback if parsing fails
      const parts = line.split(",");
      return {
        emoji: parts[0]?.trim() || "🎯",
        title: parts[1]?.replace(/['"]/g, "").trim() || "Tujuan baru",
      };
    });

    // Ensure we have 4 suggestions
    while (suggestions.length < 4) {
      const fallbacks = [
        { emoji: "🎯", title: "Tetapkan tujuan baru" },
        { emoji: "📚", title: "Pelajari sesuatu yang baru" },
        { emoji: "💪", title: "Mulai kebiasaan sehat" },
        { emoji: "🗓️", title: "Atur rutinitas harian" },
      ];
      suggestions.push(fallbacks[suggestions.length]);
    }

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Gagal mengambil saran:", error);
    return NextResponse.json(
      { error: "Gagal memproses respon Claude" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();
    const reqData = await request.json();

    const {
      initialValue,
      title = null,
      description = null,
      startDate = null,
      endDate = null,
    } = reqData;

    if (!initialValue) {
      return NextResponse.json(
        { error: "Nilai awal tidak ada" },
        { status: 400 }
      );
    }

    // Validate dates if provided
    if (startDate || endDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && start < tomorrow) {
        return NextResponse.json(
          {
            error: "Tanggal mulai harus minimal besok",
            message: "Tanggal tidak valid",
            dataGoals: null,
          },
          { status: 400 }
        );
      }

      if (end && end < tomorrow) {
        return NextResponse.json(
          {
            error: "Tanggal selesai harus minimal besok",
            message: "Tanggal tidak valid",
            dataGoals: null,
          },
          { status: 400 }
        );
      }

      if (start && end) {
        const sixMonthsFromStart = new Date(start);
        sixMonthsFromStart.setMonth(sixMonthsFromStart.getMonth() + 6);

        if (end > sixMonthsFromStart) {
          return NextResponse.json(
            {
              error:
                "Tanggal selesai tidak boleh lebih dari 6 bulan dari tanggal mulai",
              message: "Durasi maksimal tujuan adalah 6 bulan",
              dataGoals: null,
            },
            { status: 400 }
          );
        }

        if (end < start) {
          return NextResponse.json(
            {
              error: "Tanggal selesai harus setelah tanggal mulai",
              message: "Tanggal tidak valid",
              dataGoals: null,
            },
            { status: 400 }
          );
        }
      }
    }

    const userGoals = await prisma.goal.findMany({
      where: { userId: session.id },
      select: { title: true, description: true },
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    const goalHistory = userGoals
      .map((g, i) => `Goal ${i + 1}: ${g.title} - ${g.description}`)
      .join("\n");

    // const hasCompleteData = title && description && startDate && endDate;

    // Get today's date for context
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const todayFormatted = today.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Build CSV prompt for goal extraction
    const prompt = `
Hari ini: ${todayFormatted} (${todayStr})
Gunakan tanggal hari ini sebagai referensi untuk SEMUA perhitungan tanggal.

Ekstrak informasi tujuan dari input pengguna.

Input: "${initialValue}"
${title ? `Judul saat ini: ${title}` : ""}
${description ? `Deskripsi: ${description}` : ""}
${startDate ? `Mulai: ${startDate}` : ""}
${endDate ? `Selesai: ${endDate}` : ""}

Riwayat: ${goalHistory || "Kosong"}

RULES:
1. Ekstrak tanggal yang disebutkan eksplisit
2. Jika ada "X minggu" dan startDate, hitung endDate
3. Validasi tanggal (min besok = ${new Date(today.getTime() + 86400000).toISOString().split("T")[0]}, max 6 bulan)
4. GUNAKAN tanggal hari ini (${todayStr}) sebagai referensi

PERHITUNGAN TANGGAL:
- "besok" = ${new Date(today.getTime() + 86400000).toISOString().split("T")[0]}
- "lusa" = ${new Date(today.getTime() + 2 * 86400000).toISOString().split("T")[0]}
- "minggu depan" = ${new Date(today.getTime() + 7 * 86400000).toISOString().split("T")[0]}
- "2 minggu" dari hari ini = ${new Date(today.getTime() + 14 * 86400000).toISOString().split("T")[0]}
- "1 bulan" dari hari ini = ${new Date(today.getTime() + 30 * 86400000).toISOString().split("T")[0]}
- MAKSIMUM durasi = 6 bulan (180 hari)
- Jika >6 bulan, return status="error" dengan pesan dalam Bahasa Indonesia

Output HANYA CSV (1 baris, tanpa header):
status,title,description,startDate,endDate,emoji,message,needSchedules

Keterangan:
- status: "complete" atau "incomplete"
- dates: format YYYY-MM-DD atau "null" (HARUS tanggal aktual, bukan acak)
- needSchedules: "true" jika >30 hari, else "false"

Contoh (dengan hari ini = ${todayStr}):
complete,"Belajar Python","Kuasai dasar Python",${new Date(today.getTime() + 86400000).toISOString().split("T")[0]},${new Date(today.getTime() + 31 * 86400000).toISOString().split("T")[0]},🐍,"Tujuan lengkap",false`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 500, // Much less for CSV
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const responseData = await response.json();
    const csvContent = responseData.content?.[0]?.text || "";
    console.log("CSV Response:", csvContent);

    // Parse CSV response
    const parseCSVLine = (line: string): (string | null)[] => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          result.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current.trim());

      return result.map((field) => {
        // Remove quotes and convert "null" to null
        if (field.startsWith('"') && field.endsWith('"')) {
          field = field.slice(1, -1);
        }
        return field === "null" ? null : field;
      });
    };

    // Get the last non-empty line (the data line)
    const lines = csvContent
      .trim()
      .split("\n")
      .filter((line: string) => line.trim());
    const dataLine = lines[lines.length - 1];

    if (!dataLine) {
      return NextResponse.json(
        {
          error: "Tidak ada respons dari AI",
          message: "Silakan coba lagi",
          dataGoals: null,
        },
        { status: 500 }
      );
    }

    const [status, csvTitle, csvDesc, csvStart, csvEnd, emoji, message] =
      parseCSVLine(dataLine);

    const isComplete = status === "complete";

    // Validate and fix dates if they're in the past or invalid
    const validateDate = (dateStr: string | null): string | null => {
      if (!dateStr || dateStr === "null") return null;

      const date = new Date(dateStr);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      // If date is in the past, return tomorrow
      if (date < tomorrow) {
        return tomorrow.toISOString().split("T")[0];
      }

      return dateStr;
    };

    // Apply date validation
    const validatedStart = validateDate(csvStart as string | null);
    const validatedEnd = validateDate(csvEnd as string | null);

    // Build response
    interface GoalResponse {
      title: string | null;
      description: string | null;
      startDate: string | null;
      endDate: string | null;
      message: string;
      error: string | null;
      dataGoals?: {
        title: string;
        description: string;
        startDate: string;
        endDate: string;
        emoji: string;
        schedules: Array<{
          title: string;
          description: string;
          startedTime: string;
          endTime: string;
          emoji: string;
          percentComplete: number;
        }>;
      };
    }

    const result: GoalResponse = {
      title: csvTitle,
      description: csvDesc,
      startDate: validatedStart,
      endDate: validatedEnd,
      message: message || "Memproses tujuan...",
      error: null,
    };

    if (isComplete && csvTitle && csvDesc && validatedStart && validatedEnd) {
      // Calculate duration for schedule generation
      const start = new Date(validatedStart);
      const end = new Date(validatedEnd);
      const days =
        Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
        1;

      result.dataGoals = {
        title: csvTitle,
        description: csvDesc,
        startDate: validatedStart + "T00:00:00.000Z",
        endDate: validatedEnd + "T00:00:00.000Z",
        emoji: emoji || "🎯",
        schedules:
          days <= 30
            ? await generateQuickSchedules(validatedStart, validatedEnd, days)
            : [],
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI Goal Planner Error:", error);
    return NextResponse.json(
      { error: "Error server internal" },
      { status: 500 }
    );
  }
}

// Generate schedules for goals <= 30 days (for performance)
async function generateQuickSchedules(
  startDate: string,
  endDate: string,
  totalDays: number
) {
  const schedules = [];
  const currentDate = new Date(startDate);

  // Helper function to generate consistent descriptions
  const generateDescription = (day: number, total: number) => {
    const week = Math.ceil(day / 7);
    const dayInWeek = ((day - 1) % 7) + 1;
    const progress = Math.round((day / total) * 100);

    // Consistent descriptions based on day of week
    if (dayInWeek === 1) {
      // Monday
      return `Senin - Perencanaan minggu ${week}: Review progress minggu lalu, set target minggu ini. Mulai dengan konsep dasar, buat roadmap pembelajaran untuk 7 hari ke depan.`;
    } else if (dayInWeek === 2) {
      // Tuesday
      return `Selasa - Deep learning: Fokus pada satu topik utama hari ini. Pelajari teori mendalam, tonton 2-3 video tutorial, buat catatan komprehensif untuk referensi.`;
    } else if (dayInWeek === 3) {
      // Wednesday
      return `Rabu - Praktik: Implementasikan konsep yang dipelajari kemarin. Buat mini project atau selesaikan 5 latihan soal. Dokumentasikan kode dan pembelajaran.`;
    } else if (dayInWeek === 4) {
      // Thursday
      return `Kamis - Eksplorasi: Pelajari topik terkait atau advanced features. Baca dokumentasi resmi, eksperimen dengan edge cases. Progress saat ini: ${progress}%.`;
    } else if (dayInWeek === 5) {
      // Friday
      return `Jumat - Kolaborasi: Share progress di forum/community. Minta feedback, bantu yang lain, atau ikuti online workshop. Network dengan learner lain.`;
    } else if (dayInWeek === 6) {
      // Saturday
      return `Sabtu - Project day: Dedikasikan waktu untuk project yang lebih besar. Gabungkan semua pembelajaran minggu ini dalam satu implementasi nyata.`;
    } else {
      // Sunday
      return `Minggu - Review & refleksi: Evaluasi pencapaian minggu ${week}. Apa yang berhasil? Apa yang perlu diperbaiki? Siapkan materi untuk minggu depan.`;
    }
  };

  for (let day = 1; day <= totalDays; day++) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    const dayName = currentDate.toLocaleDateString("id-ID", {
      weekday: "long",
    });
    const startTime = isWeekend ? "10:00" : "09:00";
    const endTime = isWeekend ? "11:00" : "11:00";

    schedules.push({
      title: `Hari ${day} - ${dayName}`,
      description: generateDescription(day, totalDays),
      startedTime: `${dateStr}T${startTime}:00+07:00`,
      endTime: `${dateStr}T${endTime}:00+07:00`,
      emoji: "📚",
      percentComplete: Math.round((day / totalDays) * 100),
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
}
