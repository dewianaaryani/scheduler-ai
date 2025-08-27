import { requireUser } from "@/app/lib/hooks";
import { NextRequest } from "next/server";
import {
  GenerateSchedulesRequest,
  ScheduleItem,
} from "@/app/lib/types/goal-api";
import { prisma } from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();
    if (!session?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body: GenerateSchedulesRequest = await request.json();
    const { title, description, startDate, endDate, emoji = "🎯" } = body;

    // Validate required fields
    if (!title || !description || !startDate || !endDate) {
      return new Response("Missing required fields", { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { preferences: true, name: true },
    });
    const preferences = (user?.preferences as Record<string, unknown>) || {};
    console.log("User preferences:", preferences);

    // Calculate total days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Validate total days
    if (totalDays <= 0) {
      return new Response(
        "Invalid date range: end date must be after start date",
        { status: 400 }
      );
    }

    // Validate max duration using months (not days)
    let monthsDiff = (end.getFullYear() - start.getFullYear()) * 12;
    monthsDiff += end.getMonth() - start.getMonth();

    // If the end day is before the start day, we haven't completed the full month
    if (end.getDate() < start.getDate()) {
      monthsDiff -= 1;
    }

    // Check if duration exceeds 6 months
    if (monthsDiff > 6) {
      return new Response(
        `Durasi maksimal adalah 6 bulan. Durasi tujuan Anda adalah ${monthsDiff} bulan.`,
        { status: 400 }
      );
    }

    // Generate date list
    const dateList: string[] = [];
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      dateList.push(currentDate.toISOString().split("T")[0]);
    }

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Process in background
    (async () => {
      try {
        console.log("Generating schedules for:", {
          title,
          totalDays,
          startDate,
          endDate,
        });

        // Send initial status
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "status",
              message: "Membuat jadwal untuk tujuan Anda...",
            })}\n\n`
          )
        );

        // Build prompt for schedule generation
        const prompt = `Anda adalah perencana jadwal profesional. SEMUA OUTPUT HARUS DALAM BAHASA INDONESIA.
NAMA USER: ${user?.name || "User"}
PREFERENSI JADWAL USER: ${JSON.stringify(preferences || {}) || "Tidak ada"}

Informasi Tujuan:
- Judul: ${title}
- Deskripsi: ${description}
- Tanggal Mulai: ${startDate}
- Tanggal Selesai: ${endDate}
- Total Hari Tersedia: ${totalDays}

TUGAS: Buat jadwal yang efektif untuk mencapai tujuan ini, dengan mempertimbangkan jadwal kesibukan user.

ATURAN PENTING TENTANG JADWAL:
1. TIDAK PERLU membuat jadwal untuk setiap hari
2. Jika user memiliki weeklyBusyBlocks, HINDARI waktu tersebut
3. Buat jadwal yang realistis - bisa 2-3x seminggu atau sesuai kebutuhan tujuan
4. Fokus pada kualitas aktivitas, bukan kuantitas hari
5. Pertimbangkan istirahat dan recovery time antar sesi

PERSYARATAN KRITIS:
1. Output HANYA baris CSV, tanpa teks lain, tanpa penjelasan, tanpa header
2. Buat jadwal yang OPTIMAL (tidak harus setiap hari, sesuaikan dengan tujuan)
3. Setiap baris harus mengikuti format tepat ini: dayNumber;date;title;description;startTime;endTime
4. Gunakan titik koma (;) sebagai delimiter, BUKAN koma
5. JANGAN bungkus nilai dengan tanda kutip
6. dayNumber adalah urutan jadwal (1,2,3...), BUKAN hari kalender
7. Setiap jadwal harus UNIK dan PROGRESIF yang membangun menuju tujuan
8. Jadilah SPESIFIK dan KOMPREHENSIF
9. 🚨 KRITIS: Deskripsi HARUS 50-200 karakter (TIDAK BOLEH kurang dari 50 atau lebih dari 200!)
10. 🚨 KRITIS: Gunakan BAHASA INDONESIA untuk semua judul dan deskripsi
11. HINDARI jadwal pada waktu busy blocks user

PERSYARATAN JUDUL:
- Harus jelas dan spesifik (15-50 karakter)
- WAJIB menggunakan BAHASA INDONESIA yang baik dan benar
- Gunakan nama tugas nyata, bukan placeholder
- TANPA istilah generik seperti "Aktivitas X", "Task Y", "Item Z"
- TANPA campuran bahasa Inggris kecuali untuk istilah teknis yang umum
- Contoh BENAR: "Menyiapkan Database PostgreSQL", "Membuat Formulir Login", "Menguji Sistem Pembayaran"
- Contoh SALAH: "Setup Database", "Testing Payment", "Create Login Form"

PERSYARATAN DESKRIPSI:
- HARUS antara 50-200 karakter (BUKAN 100-250!)
- WAJIB menggunakan BAHASA INDONESIA yang baik dan benar
- Jadilah jelas dan ringkas tentang apa yang akan dilakukan
- Sertakan detail spesifik yang relevan
- TANPA deskripsi samar seperti "melanjutkan progress" atau "lanjut pengembangan"
- TANPA teks placeholder dengan variabel X, Y, Z
- Fokus pada aktivitas konkret yang akan dilakukan

CONTOH BAGUS untuk "${title}" (perhatikan: tidak setiap hari, deskripsi 50-200 karakter):
1;2024-01-01;Riset Kompetitor dan Pasar;Analisis 5 kompetitor utama untuk identifikasi fitur unggulan dan strategi harga produk;09:00;12:00
2;2024-01-03;Perancangan Database Inventori;Membuat ERD dan tabel untuk produk, kategori, supplier, stok dengan PostgreSQL;13:00;16:00
3;2024-01-05;Inisialisasi Proyek Web;Setup Next.js dengan TypeScript, Tailwind CSS, ESLint dan dependencies utama;10:00;13:00
4;2024-01-08;Implementasi Model Data;Membuat schema Prisma dan migrasi database untuk entitas utama aplikasi;14:00;17:00
5;2024-01-10;Pengembangan API Backend;Membuat endpoint CRUD untuk produk dan kategori dengan validasi data;09:00;12:00

CONTOH BURUK (JANGAN PERNAH LAKUKAN INI):
- "Aktivitas Hari 1" ❌
- "Melanjutkan task X" ❌
- "Development item Y dan Z" ❌
- "Progress minggu ke-2" ❌
- "Implementasi fitur" (terlalu samar) ❌
- "Setup project" (harus Bahasa Indonesia) ❌
- "Testing and debugging" (harus Bahasa Indonesia) ❌

Ingat:
- Setiap deskripsi HARUS 50-200 karakter (PENTING: 50-200, BUKAN 100-250!)
- WAJIB menggunakan BAHASA INDONESIA untuk judul dan deskripsi
- Gunakan contoh NYATA, SPESIFIK yang relevan dengan tujuan
- Kesulitan progresif: mulai sederhana, bangun kompleksitas
- Istilah teknis boleh tetap dalam bahasa Inggris (misal: database, API, framework)
- Semua penjelasan dan kata kerja HARUS dalam Bahasa Indonesia

PANDUAN JUMLAH JADWAL:
- Untuk tujuan harian (misal: olahraga, makan sehat): buat jadwal 3-5x per minggu
- Untuk tujuan pembelajaran: buat jadwal 2-4x per minggu dengan sesi fokus
- Untuk tujuan proyek: buat milestone mingguan atau 2x seminggu
- TIDAK PERLU ${totalDays} jadwal, buat sesuai kebutuhan yang realistis
- Contoh: Tujuan 1 bulan bisa memiliki 8-12 jadwal (2-3x per minggu)

Hasilkan jadwal yang OPTIMAL dan REALISTIS dalam format CSV:`;

        // Call Claude API with retry logic
        let response;
        let attempt = 0;
        const maxRetries = 3;

        while (attempt < maxRetries) {
          try {
            response = await fetch("https://api.anthropic.com/v1/messages", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.ANTHROPIC_API_KEY || "",
                "anthropic-version": "2023-06-01",
              },
              body: JSON.stringify({
                model: "claude-3-7-sonnet-20250219", // Use Sonnet for balance of speed and quality
                max_tokens: 10000, // Reduce tokens to avoid overload
                stream: true,
                temperature: 0.3, // Lower temperature for consistency
                messages: [{ role: "user", content: prompt }],
              }),
            });

            // If successful or non-retryable error, break
            if (
              response.ok ||
              (response.status !== 529 &&
                response.status !== 502 &&
                response.status !== 503)
            ) {
              break;
            }

            // If it's a retryable error, wait before retry
            if (
              response.status === 529 ||
              response.status === 502 ||
              response.status === 503
            ) {
              attempt++;
              if (attempt < maxRetries) {
                const waitTime = Math.min(1000 * Math.pow(2, attempt), 8000); // Exponential backoff, max 8s
                console.log(
                  `Claude API overloaded (${response.status}), retrying in ${waitTime}ms... (attempt ${attempt}/${maxRetries})`
                );
                await new Promise((resolve) => setTimeout(resolve, waitTime));
                continue;
              }
            }
          } catch (error) {
            attempt++;
            if (attempt < maxRetries) {
              const waitTime = Math.min(1000 * Math.pow(2, attempt), 8000);
              console.log(
                `Network error, retrying in ${waitTime}ms... (attempt ${attempt}/${maxRetries})`
              );
              await new Promise((resolve) => setTimeout(resolve, waitTime));
              continue;
            }
            throw error;
          }
        }

        if (!response || !response.ok) {
          const errorText = await response?.text().catch(() => "Network error");
          console.error("AI API Error:", response?.status, errorText);

          let errorMessage = "Gagal membuat jadwal";
          if (response?.status === 529) {
            errorMessage =
              "Server AI sedang overload. Silakan tunggu beberapa saat dan coba lagi";
          } else if (response?.status === 502 || response?.status === 503) {
            errorMessage =
              "Server AI tidak tersedia sementara. Silakan coba lagi";
          } else if (response?.status && response.status >= 500) {
            errorMessage =
              "Server AI sedang mengalami gangguan. Silakan coba lagi";
          } else if (!response) {
            errorMessage =
              "Gagal terhubung ke server AI. Periksa koneksi internet Anda";
          }

          throw new Error(errorMessage);
        }

        // Process streaming response
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        let buffer = "";
        let fullResponse = "";
        let eventCount = 0;
        const schedules: ScheduleItem[] = [];
        let csvBuffer = ""; // Buffer for incomplete CSV lines

        console.log("Starting to read streaming response...");

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log("Stream reading completed");
            break;
          }

          const chunk = new TextDecoder().decode(value);
          buffer += chunk;

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                console.log("Received [DONE] signal");
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                eventCount++;

                // Handle streaming events according to Anthropic docs
                switch (parsed.type) {
                  case "message_start":
                    console.log("Message started");
                    break;

                  case "content_block_start":
                    console.log(
                      "Content block started, type:",
                      parsed.content_block?.type
                    );
                    break;

                  case "content_block_delta":
                    // This is where the actual text comes through
                    if (parsed.delta?.text) {
                      const textToAdd = parsed.delta.text;
                      fullResponse += textToAdd;
                      csvBuffer += textToAdd;

                      // Try to parse complete CSV lines from buffer
                      const csvLines = csvBuffer.split("\n");
                      csvBuffer = csvLines.pop() || ""; // Keep incomplete line in buffer

                      for (const csvLine of csvLines) {
                        if (!csvLine.trim()) continue;

                        // Parse CSV line
                        const parts = csvLine
                          .split(";")
                          .map((p) => p.trim().replace(/^"|"$/g, ""));

                        if (parts.length >= 6) {
                          const [
                            dayNum,
                            date,
                            schedTitle,
                            schedDesc,
                            startTime,
                            endTime,
                          ] = parts;
                          const dayNumber = parseInt(dayNum);

                          if (!isNaN(dayNumber) && schedTitle && schedDesc) {
                            // Calculate precise percentage
                            const progressPercent =
                              (dayNumber / totalDays) * 100;

                            const schedule: ScheduleItem = {
                              dayNumber,
                              date:
                                date ||
                                dateList[
                                  Math.min(dayNumber - 1, dateList.length - 1)
                                ],
                              title: schedTitle,
                              description: schedDesc,
                              startTime: startTime || "09:00",
                              endTime: endTime || "12:00",
                              emoji: emoji,
                              progressPercent: parseFloat(
                                progressPercent.toFixed(2)
                              ),
                            };

                            schedules.push(schedule);

                            // Send schedule update immediately
                            await writer.write(
                              encoder.encode(
                                `data: ${JSON.stringify({
                                  type: "schedule",
                                  message: `Jadwal ke-${schedules.length} berhasil dibuat`,
                                  progress: Math.min(schedules.length * 10, 90), // Progress up to 90%
                                  schedule: schedule,
                                  currentCount: schedules.length,
                                })}\n\n`
                              )
                            );

                            console.log(
                              `Streamed schedule ${schedules.length}: ${schedTitle}`
                            );
                          }
                        }
                      }
                    }
                    break;

                  case "content_block_stop":
                    console.log(
                      "Content block stopped, total schedules:",
                      schedules.length
                    );
                    break;

                  case "message_stop":
                    console.log(
                      "Message stopped, total schedules parsed:",
                      schedules.length
                    );
                    break;

                  case "ping":
                    console.log("Received ping");
                    break;

                  default:
                    console.log("Unknown event type:", parsed.type);
                }
              } catch (e) {
                console.error(
                  "Parse error:",
                  e,
                  "Data:",
                  data.substring(0, 200)
                );
              }
            }
          }
        }

        // Process any remaining CSV in buffer
        if (csvBuffer.trim()) {
          const parts = csvBuffer
            .split(";")
            .map((p) => p.trim().replace(/^"|"$/g, ""));

          if (parts.length >= 6) {
            const [dayNum, date, schedTitle, schedDesc, startTime, endTime] =
              parts;
            const dayNumber = parseInt(dayNum);

            if (!isNaN(dayNumber) && schedTitle && schedDesc) {
              const progressPercent = (dayNumber / totalDays) * 100;

              const schedule: ScheduleItem = {
                dayNumber,
                date:
                  date ||
                  dateList[Math.min(dayNumber - 1, dateList.length - 1)],
                title: schedTitle,
                description: schedDesc,
                startTime: startTime || "09:00",
                endTime: endTime || "12:00",
                emoji: emoji,
                progressPercent: parseFloat(progressPercent.toFixed(2)),
              };

              schedules.push(schedule);
              console.log(`Added final schedule from buffer: ${schedTitle}`);
            }
          }
        }

        // Check if we got any response
        if (!fullResponse || fullResponse.trim().length === 0) {
          const errorMsg = "AI tidak menghasilkan jadwal. Silakan coba lagi.";
          console.error(errorMsg);
          console.error("Event count:", eventCount);
          throw new Error(errorMsg);
        }

        console.log(`\n=== STREAMING COMPLETE ===`);
        console.log(
          `Successfully streamed ${schedules.length} schedules for ${totalDays} day period`
        );
        console.log(
          "Schedule titles:",
          schedules.map((s) => s.title)
        );

        // Check if we got any schedules
        if (schedules.length === 0) {
          const errorMsg = `AI tidak menghasilkan jadwal. Silakan coba lagi.`;
          console.error(errorMsg);
          throw new Error(errorMsg);
        }

        // Check if we got reasonable number of schedules
        if (schedules.length < 2) {
          const errorMsg = `Jadwal terlalu sedikit (${schedules.length}). Minimal 2 jadwal diperlukan.`;
          console.error(errorMsg);
          throw new Error(errorMsg);
        }

        // Send final result
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "complete",
              data: {
                schedules,
                totalDays,
                message: `Berhasil membuat ${schedules.length} jadwal untuk tujuan Anda`,
              },
            })}\n\n`
          )
        );

        await writer.write(encoder.encode("data: [DONE]\n\n"));
      } catch (error) {
        console.error("Schedule generation error:", error);
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "error",
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to generate schedules",
            })}\n\n`
          )
        );
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
