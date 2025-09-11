import { requireUser } from "@/app/lib/hooks";
import { NextRequest } from "next/server";
import {
  GenerateSchedulesRequest,
  ScheduleItem,
} from "@/app/lib/types/goal-api";
import { prisma } from "@/app/lib/db";

// Fungsi utama untuk menghasilkan jadwal berdasarkan tujuan pengguna
export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();
    if (!session?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body: GenerateSchedulesRequest = await request.json();
    const { title, description, startDate, endDate, emoji = "🎯" } = body;

    // Validasi field yang wajib diisi
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
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Validasi total hari harus lebih dari 0
    if (totalDays <= 0) {
      return new Response(
        "Invalid date range: end date must be after start date",
        { status: 400 }
      );
    }

    // Validasi durasi maksimal menggunakan bulan (bukan hari)
    let monthsDiff = (end.getFullYear() - start.getFullYear()) * 12;
    monthsDiff += end.getMonth() - start.getMonth();

    // Jika hari akhir sebelum hari mulai, bulan belum lengkap
    if (end.getDate() < start.getDate()) {
      monthsDiff -= 1;
    }

    // Cek apakah durasi melebihi 6 bulan
    if (monthsDiff > 6) {
      return new Response(
        `Durasi maksimal adalah 6 bulan. Durasi tujuan Anda adalah ${monthsDiff} bulan.`,
        { status: 400 }
      );
    }

    // Membuat daftar tanggal untuk periode tujuan
    const dateList: string[] = [];
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      dateList.push(currentDate.toISOString().split("T")[0]);
    }

    // Membuat response streaming untuk update real-time
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Memproses pembuatan jadwal di background
    (async () => {
      try {
        console.log("Generating schedules for:", {
          title,
          totalDays,
          startDate,
          endDate,
        });

        // Mengirim status awal ke client
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "status",
              message: "Membuat jadwal untuk tujuan Anda...",
            })}\n\n`
          )
        );

        // Membangun prompt untuk AI dalam menghasilkan jadwal
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
            if (
              response.ok ||
              (response.status !== 529 &&
                response.status !== 502 &&
                response.status !== 503)
            ) {
              break;
            }

            // Jika error bisa di-retry, tunggu sebelum mencoba lagi
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
          const { done, value } = await reader.read(); // read streaming data dari claude mempunyai dua variable property done dan value
          // done untuk menentukan apakah streaming sudah selesai atau belum
          // value untuk menyimpan data streaming yang dihasilkan
          if (done) {
            console.log("Stream reading completed");
            break;
          }

          const chunk = new TextDecoder().decode(value); // decode data streaming (Uint8Array<ArrayBuffer>) dari claude menjadi string
          //contoh  data value streaming dari claude dalam Uint8Array<ArrayBuffer> : Uint8Array(37) [100, 97, 116, 97, 58, 32, 123, 34, 116, 121, 112, 101, 34, 58, 32, 34, 109, 101, 115, 115, 97, 103, 101, 95, 115, 116, 97, 114, 116, 34, 125, 10, ...]
          //contoh hasil decode data streaming dari claude : data: {"type": "message_start"} atau data: {"type": "content_block_start", "content_block": {"type": "text"}}

          // Menambahkan chunk baru ke buffer
          // Buffer menyimpan data streaming yang belum lengkap
          // Buffer akan di proses ketika sudah ada baris baru (\n)
          // Karena data streaming dari claude tidak selalu berakhir dengan baris baru (\n)
          // Buffer akan menyimpan data streaming yang belum lengkap sampai ada baris baru (\n)
          // Contoh: jika buffer = 'data: {"type": "content_block_delta", "delta": {"text": "1;2024-01-01;Riset Kompetitor dan Pasar;Analisis 5 kompetitor utama untuk identifikasi fitur unggulan dan strategi harga produk;09:00;12:00\n2;2024-01-03;Perancangan Database Inventori;Membuat ERD dan tabel untuk produk, kategori, supplier, stok dengan PostgreSQL;13:00;16:00\n3;2024-01-05;Inisialisasi Proyek Web;Setup Next.js dengan TypeScript, Tailwind CSS, ESLint dan dependencies utama;10:00;13:00\n4;2024-01-08;Implementasi Model Data;Membuat schema Prisma dan migrasi database untuk entitas utama aplikasi;14:00;17:00\n5;2024-01-10;Pengembangan API Backend;Membuat endpoint CRUD untuk produk dan kategori dengan validasi data;09:00;12:00\n6;2024-01-12;Pengembangan Frontend Aplikasi;Membangun halaman utama, dashboard, dan formulir interaktif dengan React dan Tailwind CSS;11:00;14:00\n7;2024-01-15;Integrasi Otentikasi Pengguna;Implementasi sistem login, pendaftaran, dan manajemen sesi dengan JWT dan NextAuth.js;15:00;18:00\n8;2024-01-17;Pengujian Unit dan Integrasi;Menulis tes unit untuk komponen frontend dan endpoint backend menggunakan Jest dan React Testing Library;10:00;13:00\n9;2024-01-19;Pengujian End-to-End;Membuat skrip pengujian e2e untuk alur pengguna utama dengan Cypress;14:00;17:00\n10;2024-01-22;Optimasi Kinerja Aplikasi;Menganalisis dan mengoptimalkan waktu muat halaman, kueri database, dan penggunaan memori;09:00;12:00\n11;2024-01-24;Persiapan Deployment;Menyiapkan lingkungan produksi, CI/CD pipeline, dan dokumentasi deployment di Vercel atau AWS;13:00;16:00\n12;2024-01-26;Peluncuran dan Pemantauan;Meluncurkan aplikasi ke publik, memantau kinerja, dan menyiapkan alat analitik pengguna seperti Google Analytics atau Mixpanel;11:00;14:00\n13;2024-01-29;Pengumpulan Umpan Balik Peng
          buffer += chunk;

          // Memisahkan buffer menjadi baris-baris berdasarkan karakter baris baru (\n)
          const lines = buffer.split("\n");

          // Menyimpan baris terakhir yang mungkin belum lengkap kembali ke buffer
          // Baris terakhir akan diproses pada iterasi berikutnya ketika sudah lengkap
          buffer = lines.pop() || "";

          // Memproses setiap baris yang sudah lengkap
          for (const line of lines) {
            // Hanya proses baris yang diawali dengan "data: "
            if (line.startsWith("data: ")) {
              // Mengambil data setelah "data: "
              // Data ini adalah string JSON yang perlu di-parse
              // Contoh: {"type": "content_block_delta", "delta": {"text": "1;2024-01-01;Riset Kompetitor dan Pasar;Analisis 5 kompetitor utama untuk identifikasi fitur unggulan dan strategi harga produk;09:00;12:00"}}
              const data = line.slice(6);
              // Melewati sinyal [DONE] yang menandakan akhir dari streaming
              if (data === "[DONE]") {
                console.log("Received [DONE] signal");
                continue;
              }

              // Mencoba parsing string JSON ke object
              try {
                // Parse string data JSON ke object
                const parsed = JSON.parse(data);
                // Increment event count for each parsed event
                eventCount++;

                // Menangani event streaming sesuai dokumentasi Anthropic
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
                    // Di sini teks jadwal yang sebenarnya diterima
                    if (parsed.delta?.text) {
                      const textToAdd = parsed.delta.text;
                      fullResponse += textToAdd;
                      csvBuffer += textToAdd;

                      // Mencoba parsing baris CSV lengkap dari buffer
                      const csvLines = csvBuffer.split("\n");
                      csvBuffer = csvLines.pop() || ""; // Keep incomplete line in buffer

                      for (const csvLine of csvLines) {
                        if (!csvLine.trim()) continue;

                        // Parsing baris CSV menjadi jadwal
                        const parts = csvLine
                          .split(";")
                          .map((p) => p.trim().replace(/^"|"$/g, ""));

                        if (parts.length >= 6) {
                          // Mengambil informasi jadwal dari baris CSV
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
                          if (!isNaN(dayNumber) && schedTitle && schedDesc) {
                            // Menggunakan panjang array schedules untuk menentukan indeks jadwal
                            const scheduleIndex = schedules.length + 1;

                            // Membuat objek schedule baru dengan informasi yang diperlukan
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

                            // Mengirim update jadwal langsung ke client
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
        if (schedules.length === 0) {
          const errorMsg = `AI tidak menghasilkan jadwal. Silakan coba lagi.`;
          console.error(errorMsg);
          throw new Error(errorMsg);
        }

        // Cek apakah jumlah jadwal yang dihasilkan cukup
        if (schedules.length < 2) {
          const errorMsg = `Jadwal terlalu sedikit (${schedules.length}). Minimal 2 jadwal diperlukan.`;
          console.error(errorMsg);
          throw new Error(errorMsg);
        }

        // Menghitung persentase progress setelah tahu total jadwal
        const totalSchedules = schedules.length;
        schedules.forEach((schedule, index) => {
          schedule.progressPercent = parseFloat(
            (((index + 1) / totalSchedules) * 100).toFixed(2)
          );
        });

        // Mengirim hasil akhir ke client
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
