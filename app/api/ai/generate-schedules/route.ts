import { requireUser } from "@/app/lib/hooks";
import { NextRequest } from "next/server";
import {
  GenerateSchedulesRequest,
  ScheduleItem,
} from "@/app/lib/types/goal-api";
import { prisma } from "@/app/lib/db";

/**
 * Fungsi utama untuk membuat jadwal otomatis berdasarkan goal/tujuan user
 * Endpoint ini dipanggil ketika user ingin membuat jadwal dari sebuah goal
 * Menggunakan AI (Claude) untuk menghasilkan jadwal yang tepat dan personal
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();
    if (!session?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body: GenerateSchedulesRequest = await request.json();
    const { title, description, startDate, endDate, emoji = "🎯" } = body;

    // Validasi field yang wajib diisi
    // title = judul goal, description = penjelasan goal
    // startDate = tanggal mulai goal, endDate = tanggal selesai goal
    if (!title || !description || !startDate || !endDate) {
      return new Response("Missing required fields", { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { preferences: true, name: true },
    });
    const preferences = (user?.preferences as Record<string, unknown>) || {};
    console.log("User preferences:", preferences);
    const existingSchedules = await prisma.schedule.findMany({
      where: {
        userId: session.id,
        status: { not: "ABANDONED" }, // filter not abandoned schedules
        startedTime: { gte: new Date(startDate || Date.now()) }, // filter schedules after start date or today
      },
      select: { title: true, startedTime: true, endTime: true },
    });

    // Menghitung total hari dari tanggal mulai hingga tanggal selesai
    // Ini untuk mengetahui berapa lama periode goal berlangsung
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Validasi total hari harus lebih dari 0
    // Tanggal selesai tidak boleh sebelum tanggal mulai
    if (totalDays <= 0) {
      return new Response(
        "Invalid date range: end date must be after start date",
        { status: 400 }
      );
    }

    // Validasi durasi maksimal menggunakan bulan (bukan hari)
    // Menghitung selisih bulan antara tanggal mulai dan selesai
    let monthsDiff = (end.getFullYear() - start.getFullYear()) * 12;
    monthsDiff += end.getMonth() - start.getMonth();

    // Jika hari akhir sebelum hari mulai, bulan belum lengkap
    // Contoh: 31 Januari ke 15 Februari = belum 1 bulan penuh
    if (end.getDate() < start.getDate()) {
      monthsDiff -= 1;
    }

    // Cek apakah durasi melebihi 6 bulan
    // Pembatasan ini untuk memastikan jadwal tetap realistis dan manageable
    if (monthsDiff > 6) {
      return new Response(
        `Durasi maksimal adalah 6 bulan. Durasi tujuan Anda adalah ${monthsDiff} bulan.`,
        { status: 400 }
      );
    }

    // Membuat daftar tanggal untuk periode tujuan
    // Array ini berisi semua tanggal dari start hingga end (format: YYYY-MM-DD)
    const dateList: string[] = [];
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      dateList.push(currentDate.toISOString().split("T")[0]);
    }

    // Membuat response streaming untuk update real-time
    // Streaming memungkinkan client menerima jadwal satu per satu saat dibuat
    // Tidak perlu menunggu semua jadwal selesai dibuat
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Memproses pembuatan jadwal di background (asynchronous)
    // Function ini berjalan paralel dan tidak memblokir response
    (async () => {
      try {
        console.log("Generating schedules for:", {
          title,
          totalDays,
          startDate,
          endDate,
        });

        // Mengirim status awal ke client
        // Client akan menampilkan pesan loading/progress ini
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "status",
              message: "Membuat jadwal untuk tujuan Anda...",
            })}\n\n`
          )
        );

        // Membangun prompt untuk AI dalam menghasilkan jadwal
        // Prompt ini berisi instruksi detail untuk Claude AI
        // Termasuk preferensi user, jadwal yang sudah ada, dan aturan pembuatan jadwal
        const prompt = `Anda adalah perencana jadwal profesional untuk orang yang mempunyai rentang usia 22-40. SEMUA OUTPUT HARUS DALAM BAHASA INDONESIA.
NAMA USER: ${user?.name || "User"}
PREFERENSI JADWAL USER: ${JSON.stringify(preferences || {}) || "Tidak ada"}
EXISTING SCHEDULES (jika ada) ZONA WAKTU YANG DIGUNAKAN DI EXISTING SCHEDULE GMT +7 (id-ID) : ${
          existingSchedules.length > 0
            ? existingSchedules
                .map(
                  (s) =>
                    `${s.title} (${new Date(s.startedTime).toLocaleDateString("id-ID")} ${new Date(s.startedTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} - ${new Date(s.endTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })})`
                )
                .join(", ")
            : "Tidak ada"
        }

Informasi Tujuan:
- Judul: ${title}
- Deskripsi: ${description}
- Tanggal Mulai: ${startDate}
- Tanggal Selesai: ${endDate}
- Total Hari Tersedia: ${totalDays}

TUGAS: Buat jadwal yang efektif untuk mencapai tujuan ini, dengan mempertimbangkan jadwal kesibukan user.

ATURAN PENTING TENTANG JADWAL:
1. TIDAK PERLU membuat jadwal untuk setiap hari
2. Jika user memiliki weeklyBusyBlocks dan dailyBusyBlocks, HINDARI waktu tersebut
3. Buat jadwal yang realistis - bisa 2-3x seminggu atau sesuai kebutuhan tujuan
4. Fokus pada kualitas aktivitas, bukan kuantitas hari
5. Pertimbangkan istirahat dan recovery time antar sesi
6. Harus hindari membuat jadwal yang tumpang tindih dengan existing schedules

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
12. KRITIS : HINDARI TUMPANG TINDIH DENGAN EXISTING SCHEDULES USER YANG SUDAH ADA SEHINGGA JANGAN ADA SCHEDULE DI WAKTU YANG SAMA, WALAUPUN DALAM KATEGORI AKTIVITAS YANG SERUPA!

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

        console.log("Schedule generation prompt:", prompt);

        // Memanggil Claude API dengan logika retry jika gagal
        // Retry otomatis hingga 3x jika server overload atau error
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

            // Jika berhasil atau error yang tidak bisa di-retry, keluar dari loop
            // Error 529 = overload, 502/503 = server down (bisa di-retry)
            // Error lain seperti 400/401 tidak di-retry karena permanen
            if (
              response.ok ||
              (response.status !== 529 &&
                response.status !== 502 &&
                response.status !== 503)
            ) {
              break;
            }

            // Jika error bisa di-retry, tunggu sebelum mencoba lagi
            // Menggunakan exponential backoff: tunggu 2 detik, 4 detik, 8 detik
            // Ini memberi waktu server untuk pulih
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

        // Memproses response streaming dari Claude API
        // Claude mengirim response per potongan (chunk), bukan sekaligus
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
          // Membaca chunk data dari stream
          // done = true jika streaming selesai, false jika masih ada data
          // value = berisi data chunk dalam format Uint8Array (array byte)
          const { done, value } = await reader.read();
          if (done) {
            console.log("Stream reading completed");
            break;
          }

          // Konversi byte array menjadi string yang bisa dibaca
          // Contoh input: Uint8Array [100, 97, 116, 97, ...] (kode ASCII)
          // Contoh output: "data: {\"type\": \"message_start\"}"
          const chunk = new TextDecoder().decode(value);

          // BUFFER SYSTEM: Menyimpan data yang belum lengkap
          // Kenapa perlu buffer?
          // 1. Data streaming datang per potongan, tidak selalu lengkap
          // 2. Satu baris CSV bisa terpotong jadi 2 chunk
          // 3. Buffer menyimpan potongan yang belum lengkap sampai ada newline (\n)
          //
          // Contoh:
          // Chunk 1: "data: {\"text\": \"1;2024-01-01;Riset Komp\"
          // Chunk 2: "etitor;Analisis 5 kompetitor;09:00;12:00\n\"}"
          // Buffer akan gabungkan kedua chunk sebelum diproses
          buffer += chunk;

          // Memisahkan buffer menjadi baris-baris berdasarkan karakter baris baru (\n)
          // Setiap baris adalah satu event lengkap dari Claude
          const lines = buffer.split("\n");

          // Menyimpan baris terakhir yang mungkin belum lengkap kembali ke buffer
          // pop() mengambil elemen terakhir dari array
          // Baris ini mungkin terpotong, jadi simpan untuk digabung dengan chunk berikutnya
          buffer = lines.pop() || "";

          // Memproses setiap baris yang sudah lengkap
          // Setiap baris adalah satu event dari Claude (format: "data: {JSON}")
          for (const line of lines) {
            // Hanya proses baris yang diawali dengan "data: "
            // Format standar Server-Sent Events (SSE) dari Claude
            if (line.startsWith("data: ")) {
              // Mengambil data setelah "data: " (6 karakter)
              // slice(6) memotong 6 karakter pertama ("data: ")
              // Sisanya adalah JSON string yang berisi event dari Claude
              // Contoh hasil: '{"type": "content_block_delta", "delta": {"text": "..."}}'
              const data = line.slice(6);
              // Melewati sinyal [DONE] yang menandakan akhir dari streaming
              // Claude mengirim "[DONE]" sebagai penanda streaming selesai
              if (data === "[DONE]") {
                console.log("Received [DONE] signal");
                continue;
              }

              // Mencoba parsing string JSON ke object JavaScript
              // Jika JSON invalid, akan masuk catch block
              try {
                // Parse string data JSON ke object JavaScript
                // Contoh input: '{"type": "message_start"}'
                // Contoh output: {type: "message_start"}
                const parsed = JSON.parse(data);
                // Hitung jumlah event yang diterima (untuk debugging)
                eventCount++;

                // Menangani berbagai jenis event dari Claude API
                // Setiap event memiliki "type" yang berbeda
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
                    // EVENT PENTING: Di sini teks jadwal CSV yang sebenarnya diterima
                    // Claude mengirim teks per potongan kecil (delta)
                    if (parsed.delta?.text) {
                      const textToAdd = parsed.delta.text;
                      fullResponse += textToAdd;
                      csvBuffer += textToAdd;

                      // Mencoba parsing baris CSV lengkap dari buffer
                      // Format CSV: dayNumber;date;title;description;startTime;endTime\n

                      // Memisahkan buffer berdasarkan newline untuk mendapatkan baris lengkap
                      const csvLines = csvBuffer.split("\n");
                      csvBuffer = csvLines.pop() || ""; // Keep incomplete line in buffer

                      for (const csvLine of csvLines) {
                        if (!csvLine.trim()) continue;

                        // Parsing baris CSV menjadi jadwal
                        // split(";") memisahkan berdasarkan titik koma
                        // trim() hapus spasi di awal/akhir
                        // replace() hapus tanda kutip jika ada
                        const parts = csvLine
                          .split(";")
                          .map((p) => p.trim().replace(/^"|"$/g, ""));

                        if (parts.length >= 6) {
                          // Mengambil informasi jadwal dari baris CSV
                          // Destructuring array: ambil 6 elemen pertama
                          // Urutan: nomor hari, tanggal, judul, deskripsi, jam mulai, jam selesai
                          const [
                            dayNum,
                            date,
                            schedTitle,
                            schedDesc,
                            startTime,
                            endTime,
                          ] = parts;
                          const dayNumber = parseInt(dayNum);

                          // Validasi data jadwal yang diterima
                          // Pastikan dayNumber adalah angka valid
                          // Pastikan judul dan deskripsi tidak kosong
                          if (!isNaN(dayNumber) && schedTitle && schedDesc) {
                            // Menggunakan panjang array schedules untuk menentukan indeks jadwal
                            // Index dimulai dari 1 (bukan 0) untuk user-friendly display
                            const scheduleIndex = schedules.length + 1;

                            // Membuat objek schedule baru dengan informasi yang diperlukan
                            // Objek ini akan disimpan ke database nanti
                            const schedule: ScheduleItem = {
                              dayNumber: scheduleIndex, // Use schedule index instead of day number
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
                              progressPercent: 0, // Will be calculated after all schedules are generated
                            };

                            schedules.push(schedule);

                            // REAL-TIME UPDATE: Kirim jadwal baru ke client segera
                            // Client akan menampilkan jadwal ini tanpa menunggu yang lain
                            // Format: Server-Sent Event dengan type "schedule"
                            await writer.write(
                              encoder.encode(
                                `data: ${JSON.stringify({
                                  type: "schedule",
                                  message: `Jadwal ke-${schedules.length} berhasil dibuat`,
                                  progress: 50, // Show indeterminate progress since we don't know final count
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

        // Memproses sisa CSV yang masih ada di buffer
        // Setelah streaming selesai, mungkin masih ada data di buffer
        // Data ini adalah baris terakhir yang tidak diakhiri newline
        if (csvBuffer.trim()) {
          const parts = csvBuffer
            .split(";")
            .map((p) => p.trim().replace(/^"|"$/g, ""));

          if (parts.length >= 6) {
            const [dayNum, date, schedTitle, schedDesc, startTime, endTime] =
              parts;
            const dayNumber = parseInt(dayNum);

            if (!isNaN(dayNumber) && schedTitle && schedDesc) {
              const scheduleIndex = schedules.length + 1;

              const schedule: ScheduleItem = {
                dayNumber: scheduleIndex,
                date:
                  date ||
                  dateList[Math.min(dayNumber - 1, dateList.length - 1)],
                title: schedTitle,
                description: schedDesc,
                startTime: startTime || "09:00",
                endTime: endTime || "12:00",
                emoji: emoji,
                progressPercent: 0, // Will be calculated after all schedules are generated
              };

              schedules.push(schedule);
              console.log(`Added final schedule from buffer: ${schedTitle}`);
            }
          }
        }

        // Cek apakah ada response dari AI
        // Jika kosong, berarti Claude tidak menghasilkan apapun (error)
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

        // Cek apakah ada jadwal yang dihasilkan
        // Minimal harus ada 1 jadwal
        if (schedules.length === 0) {
          const errorMsg = `AI tidak menghasilkan jadwal. Silakan coba lagi.`;
          console.error(errorMsg);
          throw new Error(errorMsg);
        }

        // Cek apakah jumlah jadwal yang dihasilkan cukup
        // Minimal 2 jadwal agar goal bermakna
        if (schedules.length < 2) {
          const errorMsg = `Jadwal terlalu sedikit (${schedules.length}). Minimal 2 jadwal diperlukan.`;
          console.error(errorMsg);
          throw new Error(errorMsg);
        }

        // Menghitung persentase progress setelah tahu total jadwal
        // Setiap jadwal mendapat porsi progress yang merata
        // Contoh: 4 jadwal = 25%, 50%, 75%, 100%
        const totalSchedules = schedules.length;
        schedules.forEach((schedule, index) => {
          schedule.progressPercent = parseFloat(
            (((index + 1) / totalSchedules) * 100).toFixed(2)
          );
        });

        // FINAL RESULT: Kirim semua jadwal yang sudah dibuat ke client
        // Type "complete" menandakan proses selesai sukses
        // Client akan menyimpan jadwal-jadwal ini ke database
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "complete",
              data: {
                schedules,
                totalDays: totalSchedules, // Use actual schedule count instead of calendar days
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
