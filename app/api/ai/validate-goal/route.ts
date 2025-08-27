import { requireUser } from "@/app/lib/hooks";
import { NextRequest, NextResponse } from "next/server";
import {
  ValidateGoalRequest,
  ValidateGoalResponse,
} from "@/app/lib/types/goal-api";
import { prisma } from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ValidateGoalRequest = await request.json();
    const { initialValue, title, description, startDate, endDate } = body;

    // GET USER DATA

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { preferences: true, name: true },
    });

    const preferences = (user?.preferences as Record<string, unknown>) || {};
    console.log("User preferences:", preferences.availability);
    if (!initialValue) {
      return NextResponse.json(
        { error: "Initial value required" },
        { status: 400 }
      );
    }

    // Always use AI validation to ensure consistency and proper syncing
    // Even if all fields are provided, AI will sync title with dates and validate properly

    // Get today's date for context
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // Build validation prompt
    const prompt = `Anda adalah asisten validasi tujuan. SEMUA OUTPUT HARUS DALAM BAHASA INDONESIA.
Hari ini: ${todayStr}
NAMA USER: ${user?.name || "User"}
PREFERENSI JADWAL USER: ${JSON.stringify(preferences || {}) || "Tidak ada"}
TUGAS: Validasi dan ekstrak informasi tujuan dari input pengguna.

Input pengguna: "${initialValue}"
${title ? `Judul yang diberikan (GUNAKAN INI): ${title}` : ""}
${description ? `Deskripsi yang diberikan (GUNAKAN INI): ${description}` : ""}
${startDate ? `Tanggal mulai yang diberikan (GUNAKAN INI): ${startDate}` : ""}
${endDate ? `Tanggal selesai yang diberikan (GUNAKAN INI): ${endDate}` : ""}

PENTING: Jika judul, deskripsi, atau tanggal tersedia di atas, Anda HARUS menggunakannya dalam respons.

🚨 ATURAN KRITIS - JANGAN PERNAH MENGARANG TANGGAL 🚨:
1. HANYA gunakan tanggal jika muncul di "Tanggal mulai yang diberikan (GUNAKAN INI)" atau "Tanggal selesai yang diberikan (GUNAKAN INI)" di atas
2. Jika TIDAK ADA tanggal "GUNAKAN INI" di atas → Anda HARUS mengembalikan status: "incomplete"
3. JANGAN PERNAH membuat/mengarang/mengasumsikan tanggal - kembalikan null untuk tanggal yang hilang
4. JANGAN PERNAH gunakan tanggal hari ini kecuali secara eksplisit ada di bagian "GUNAKAN INI"
5. Preferensi user TIDAK berisi tanggal - abaikan untuk ekstraksi tanggal
6. "3x seminggu" adalah frekuensi, BUKAN durasi - tetap butuh tanggal mulai/selesai

CEK INI DULU:
- Apakah ada "Tanggal mulai yang diberikan (GUNAKAN INI):" di atas? Jika TIDAK → startDate harus null
- Apakah ada "Tanggal selesai yang diberikan (GUNAKAN INI):" di atas? Jika TIDAK → endDate harus null
- Jika salah satu null → status HARUS "incomplete"

ATURAN KRITIS - SINKRONKAN JUDUL DENGAN DURASI TANGGAL (WAJIB):
Jika judul diberikan DAN kedua tanggal (mulai & selesai) diberikan:
1. PERTAMA: Hitung durasi TEPAT antara startDate dan endDate dalam hari
2. KEDUA: Temukan penyebutan durasi dalam judul (misal: "3 bulan", "2 minggu", "30 hari")
3. KETIGA: GANTI durasi di judul dengan durasi AKTUAL dari tanggal
4. Contoh perhitungan:
   - 2025-08-27 ke 2025-09-27 = 31 hari = 1 bulan
   - 2025-08-27 ke 2025-10-27 = 61 hari = 2 bulan  
   - 2025-08-27 ke 2025-11-27 = 92 hari = 3 bulan
   - 2025-08-27 ke 2025-09-10 = 14 hari = 2 minggu
5. HARUS UPDATE Contoh:
   - Judul: "berolahraga selama 30 menit setiap hari selama 3 bulan"
   - Tanggal: 2025-08-27 ke 2025-09-27 (31 hari = 1 bulan)
   - HARUS UBAH menjadi: "berolahraga selama 30 menit setiap hari selama 1 bulan"
6. Deskripsi juga harus diperbarui sesuai durasi baru
7. JANGAN PERNAH biarkan durasi tidak cocok antara judul dan rentang tanggal aktual
8. PENTING: Memperbarui judul TIDAK membuat tujuan menjadi invalid. Jika durasi ≤ 6 bulan, status tetap "valid"

ATURAN VALIDASI:
1. CEK PERTAMA: Apakah startDate dan endDate ada di bagian "GUNAKAN INI" di atas?
   - Jika TIDAK ada startDate → status = "incomplete", tambah error "Tanggal mulai tidak disediakan"
   - Jika TIDAK ada endDate → status = "incomplete", tambah error "Tanggal selesai tidak disediakan"
2. Tujuan harus jelas dan dapat dijalankan
3. KRITIS: TANGGAL SELALU DIPERLUKAN - jika tidak ada tanggal → status HARUS "incomplete"
4. Durasi maksimal adalah 6 bulan (180 hari)
5. Jika durasi > 6 bulan → status = "invalid"
6. PENTING: Durasi 1-6 bulan adalah VALID. Contoh: 1 bulan valid, 2 bulan valid, 3 bulan valid, 4 bulan valid, 5 bulan valid, 6 bulan valid
7. Jika tujuan kurang jelas tapi bisa diperbaiki → status = "incomplete" (bukan invalid)
8. Hanya tandai "invalid" jika durasi LEBIH DARI 6 bulan ATAU benar-benar mustahil
9. Untuk tujuan tidak realistis (seperti "jadi kaya"), sarankan alternatif yang lebih spesifik
10. "1 jam" merujuk pada durasi harian, BUKAN durasi proyek - tetap butuh tanggal mulai/selesai
11. "Meningkatkan intensitas" tidak ada info durasi - butuh kedua tanggal

PRIORITAS EKSTRAKSI TANGGAL:
1. SELALU gunakan tanggal yang diberikan jika tersedia (ditandai dengan "GUNAKAN INI")
2. SELALU gunakan judul dan deskripsi yang diberikan jika tersedia
3. KEDUA startDate DAN endDate pada akhirnya DIPERLUKAN untuk validasi
4. Jika ditemukan durasi (misal: "selama 2 bulan") tapi tidak ada tanggal mulai:
   - status = "incomplete"
   - validationErrors = ["Tanggal mulai tidak disediakan"]
   - JANGAN tambah "Tanggal selesai tidak disediakan" karena durasi menyiratkan tanggal akhir
5. Jika tanggal mulai ditemukan tapi tidak ada durasi/tanggal akhir:
   - status = "incomplete" 
   - validationErrors = ["Tanggal selesai tidak disediakan"]
6. Contoh:
   - "selama 3 bulan" → incomplete, error: ["Tanggal mulai tidak disediakan"] saja
   - "mulai besok" → incomplete, error: ["Tanggal selesai tidak disediakan"] saja
   - Tanpa durasi dan tanggal → incomplete, errors: ["Tanggal mulai tidak disediakan", "Tanggal selesai tidak disediakan"]
7. Valid hanya ketika KEDUA tanggal bisa ditentukan (eksplisit atau via mulai+durasi)

KRITIS: Kembalikan HANYA JSON valid, tanpa teks sebelum atau sesudahnya.
Format output:
{
  "status": "valid" | "incomplete" | "invalid",
  "title": "judul tujuan yang diekstrak atau null",
  "description": "deskripsi detail (50-500 karakter) atau null", 
  "startDate": null, // HARUS null jika tidak ada di bagian "GUNAKAN INI"
  "endDate": null, // HARUS null jika tidak ada di bagian "GUNAKAN INI"  
  "emoji": "emoji yang sesuai",
  "message": "pesan validasi dalam Bahasa Indonesia",
  "validationErrors": ["array masalah spesifik jika ada"],
  "suggestions": {
    "title": "judul spesifik, terukur (misal: 'Menabung Rp 30 juta dalam 4 bulan')",
    "description": "deskripsi detail dengan target konkret, tanpa placeholder",
    "startDate": "format YYYY-MM-DD - SELALU sarankan hari ini atau besok jika tidak ada",
    "endDate": "format YYYY-MM-DD - SELALU hitung berdasarkan durasi jika disebutkan"
  }
}

Mulai respons Anda dengan { dan akhiri dengan }

Arti Status:
- "valid": Tujuan jelas, realistis, MEMILIKI TANGGAL MULAI DAN SELESAI (bukan hanya durasi), durasi ≤ 6 bulan. PENTING: 2 bulan adalah VALID, 3 bulan adalah VALID, dst hingga 6 bulan
- "incomplete": Tanggal mulai ATAU selesai tidak ada ATAU keduanya (walaupun durasi disebutkan), atau perlu detail lebih
- "invalid": HANYA ketika durasi LEBIH DARI 6 bulan (7 bulan atau lebih) atau benar-benar mustahil

ATURAN PENTING:
- Jika startDate null/tidak ada → status HARUS "incomplete" DAN berikan saran
- Jika endDate null/tidak ada → status HARUS "incomplete" DAN berikan saran
- Memiliki "selama 1 bulan" TIDAK cukup - tetap butuh tanggal mulai aktual
- Durasi saja (seperti "3 bulan", "2 minggu") TIDAK membuatnya valid
- SELALU berikan saran tanggal ketika tanggal tidak ada:
  * Jika tidak ada tanggal mulai: sarankan hari ini (${todayStr}) atau besok
  * Jika durasi disebutkan (misal "2 bulan"): hitung tanggal selesai dari tanggal mulai yang disarankan
  * Contoh: "Tadabur Alquran selama 2 bulan" → saran startDate: hari ini, endDate: hari ini + 2 bulan

Contoh:
- "Berlatih yoga dasar 3x seminggu" → incomplete, errors: ["Tanggal mulai tidak disediakan", "Tanggal selesai tidak disediakan"] (3x seminggu adalah frekuensi, bukan durasi)
- "💻 Membuat aplikasi manajemen inventaris" → incomplete, errors: ["Tanggal mulai tidak disediakan", "Tanggal selesai tidak disediakan"]
- "💪 Meningkatkan intensitas latihan beban" → incomplete, errors: ["Tanggal mulai tidak disediakan", "Tanggal selesai tidak disediakan"]
- "💪 Menambah durasi latihan beban menjadi 1 jam" → incomplete, errors: ["Tanggal mulai tidak disediakan", "Tanggal selesai tidak disediakan"] (1 jam adalah durasi harian, bukan durasi proyek)
- "Tadabur Alquran selama 2 bulan" → incomplete, error: ["Tanggal mulai tidak disediakan"] SAJA
- "belajar JavaScript selama 3 bulan" → incomplete, error: ["Tanggal mulai tidak disediakan"] SAJA
- "membuat POS app selama 1 bulan" → incomplete, error: ["Tanggal mulai tidak disediakan"] SAJA
- "belajar coding dalam 1 tahun" → invalid (durasi > 6 bulan)
- "belajar JavaScript dari 1 Jan sampai 1 April" → valid (memiliki kedua tanggal)
- "turun berat badan" → incomplete, errors: ["Tanggal mulai tidak disediakan", "Tanggal selesai tidak disediakan"]
- "Membuat website mulai besok" → incomplete, error: ["Tanggal selesai tidak disediakan"] SAJA

Contoh Pembaruan Durasi (ANDA HARUS IKUTI INI):
- Judul: "Belajar Python dalam 2 bulan", Mulai: 2024-01-01, Selesai: 2024-04-01 → Perbarui judul menjadi "Belajar Python dalam 3 bulan" → STATUS: "valid" (3 bulan ≤ 6 bulan)
- Judul: "Makan sehat selama 1 bulan", Mulai: 2025-08-27, Selesai: 2025-10-27 → Perbarui menjadi "Makan sehat selama 2 bulan" → STATUS: "valid" (2 bulan ≤ 6 bulan)
- Judul: "Menerapkan gaya hidup aktif selama 3 bulan", Mulai: 2025-08-27, Selesai: 2025-09-27 → Perbarui menjadi "Menerapkan gaya hidup aktif selama 1 bulan" → STATUS: "valid" (1 bulan ≤ 6 bulan)
- Judul: "Kursus online 1 minggu", Mulai: 2024-01-01, Selesai: 2024-01-20 → Perbarui menjadi "Kursus online 3 minggu" → STATUS: "valid"
- Judul: "berolahraga setiap hari selama 3 bulan", Mulai: 2025-08-27, Selesai: 2025-09-27 (31 hari) → "berolahraga setiap hari selama 1 bulan" → STATUS: "valid"

CONTOH SALAH (JANGAN PERNAH LAKUKAN INI):
- Membiarkan "3 bulan" di judul ketika tanggal hanya menunjukkan 1 bulan ❌
- Mengabaikan ketidakcocokan durasi ❌

PENTING: 
- Jadilah membantu, tidak terlalu ketat
- Berikan saran konstruktif untuk tujuan yang kurang jelas
- Selalu ekstrak judul dan deskripsi yang bermakna dari input pengguna
- JANGAN PERNAH gunakan placeholder seperti "Rp. X", "XXX", atau variabel dalam saran
- Selalu berikan contoh spesifik dan realistis (misal: "Rp 10 juta", "Rp 50 juta", "20%", "5 kg")
- Buat saran yang dapat dilakukan dan konkret berdasarkan tujuan umum
- DALAM DESKRIPSI SERTAKAN USER PREFERENSI!`;

    // console.log("Validation prompt:", prompt);
    console.log(
      "Sending validation request to AI...",
      process.env.ANTHROPIC_API_KEY
    );
    // Call Claude API for validation
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-1-20250805", // STRONG VALIDATION
        max_tokens: 4000,
        temperature: 1,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API Error:", response.status, errorText);
      return NextResponse.json(
        { error: "AI validation failed" },
        { status: 500 }
      );
    }

    const aiResponse = await response.json();
    let content = aiResponse.content[0].text;

    // Parse JSON response - handle cases where AI adds extra text
    let validationResult: ValidateGoalResponse;
    try {
      // Try to extract JSON from the response
      // Sometimes AI adds explanation before/after JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }

      validationResult = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI response:", content);

      // Fallback response for parsing errors
      return NextResponse.json({
        status: "incomplete",
        title: null,
        description: null,
        startDate: null,
        endDate: null,
        emoji: "❓",
        message:
          "Maaf, terjadi kesalahan dalam memproses tujuan Anda. Silakan coba lagi dengan deskripsi yang lebih jelas.",
        validationErrors: ["Failed to parse AI response"],
      } as ValidateGoalResponse);
    }

    // Validate date range if both dates are present
    if (validationResult.startDate && validationResult.endDate) {
      const start = new Date(validationResult.startDate);
      const end = new Date(validationResult.endDate);

      // Calculate difference in months properly
      let monthsDiff = (end.getFullYear() - start.getFullYear()) * 12;
      monthsDiff += end.getMonth() - start.getMonth();

      // If the end day is before the start day, we haven't completed the full month
      if (end.getDate() < start.getDate()) {
        monthsDiff -= 1;
      }

      // Allow exactly 6 months or less
      if (monthsDiff > 6) {
        validationResult.status = "invalid";
        validationResult.message = `Durasi maksimal adalah 6 bulan. Durasi tujuan Anda adalah ${monthsDiff} bulan.`;
        validationResult.validationErrors = [
          `Durasi melebihi batas maksimal 6 bulan (${monthsDiff} bulan)`,
        ];
      }
    }

    return NextResponse.json(validationResult);
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
