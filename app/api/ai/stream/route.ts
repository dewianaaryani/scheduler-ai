import { requireUser } from "@/app/lib/hooks";
import { prisma } from "@/app/lib/db";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();
    if (!session?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const {
      initialValue,
      title = null,
      description = null,
      startDate = null,
      endDate = null,
    } = body;

    if (!initialValue) {
      return new Response("Initial value required", { status: 400 });
    }

    // Create a TransformStream for streaming responses
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Process in background
    (async () => {
      try {
        // Send initial processing message
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ 
            type: 'status', 
            message: 'Memproses tujuan Anda...' 
          })}\n\n`)
        );

        // Get user context
        const userGoals = await prisma.goal.findMany({
          where: { userId: session.id },
          select: { title: true, description: true },
          take: 5,
          orderBy: { createdAt: "desc" },
        });

        const goalHistory = userGoals
          .map((g, i) => `Goal ${i + 1}: ${g.title} - ${g.description}`)
          .join("\n");

        // Get today's date for context
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const todayFormatted = today.toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        // Build prompt for Claude - request CSV format for easier parsing
        const prompt = `
Hari ini adalah: ${todayFormatted} (${todayStr})
Gunakan tanggal hari ini sebagai referensi untuk semua perhitungan tanggal.

Analisis tujuan pengguna dan ekstrak informasi dalam format CSV.

Input pengguna: "${initialValue}"
${title ? `Judul saat ini: ${title}` : ''}
${description ? `Deskripsi saat ini: ${description}` : ''}
${startDate ? `Tanggal mulai: ${startDate}` : ''}
${endDate ? `Tanggal selesai: ${endDate}` : ''}

Riwayat tujuan pengguna:
${goalHistory || "Belum ada tujuan sebelumnya"}

INSTRUKSI:
Berikan output HANYA 1 baris CSV (TANPA header, TANPA penjelasan):
Format kolom: status,title,description,startDate,endDate,emoji,message,missingInfo

Keterangan kolom:
- status: "complete" jika data lengkap, "incomplete" jika ada yang kurang
- title: judul tujuan atau "null" jika belum jelas
- description: deskripsi tujuan atau "null" jika belum ada
- startDate: tanggal mulai dalam format YYYY-MM-DD atau "null" (HARUS >= ${todayStr})
- endDate: tanggal selesai dalam format YYYY-MM-DD atau "null" (HARUS > startDate)
- emoji: emoji yang sesuai dengan tujuan
- message: pesan untuk pengguna
- missingInfo: field yang masih kurang (pisahkan dengan semicolon, contoh: "title;dates")

ATURAN TANGGAL:
- "besok" = ${new Date(today.getTime() + 86400000).toISOString().split('T')[0]}
- "minggu depan" = ${new Date(today.getTime() + 7 * 86400000).toISOString().split('T')[0]}
- "bulan depan" = ${new Date(today.getTime() + 30 * 86400000).toISOString().split('T')[0]}
- MAKSIMUM endDate = ${(() => { const max = new Date(today); max.setMonth(max.getMonth() + 6); return max.toISOString().split('T')[0]; })()}
- SELALU gunakan tanggal aktual, JANGAN tanggal acak
- JANGAN buat endDate lebih dari 6 bulan dari startDate
- Jika user minta >6 bulan, TOLAK dengan pesan error

Contoh output CSV (dengan hari ini = ${todayStr}):
incomplete,"Belajar Python","Menguasai dasar Python",null,null,🐍,"Mohon tentukan tanggal mulai dan target selesai","dates"
complete,"Menurunkan berat badan 5kg","Program diet dan olahraga rutin",${new Date(today.getTime() + 86400000).toISOString().split('T')[0]},${new Date(today.getTime() + 31 * 86400000).toISOString().split('T')[0]},💪,"Tujuan Anda sudah lengkap dan siap dijalankan",""`;

        // Send status update
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ 
            type: 'status', 
            message: 'Menghubungi AI...' 
          })}\n\n`)
        );

        // Call Claude API
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY || "",
            "anthropic-version": "2023-06-01",
            "anthropic-beta": "messages-2023-12-15",
          },
          body: JSON.stringify({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1000, // Much less tokens needed for CSV
            stream: true,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (!response.ok) {
          throw new Error(`AI API error: ${response.statusText}`);
        }

        // Stream Claude's response
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        let buffer = "";
        let fullResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          buffer += chunk;

          // Process SSE messages from Claude
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                  fullResponse += parsed.delta.text;
                  
                  // Progress updates disabled - progress bar was not working correctly
                  // Just keep the streaming connection alive
                }
              } catch (e) {
                console.error('Parse error:', e);
              }
            }
          }
        }

        // Parse CSV response into JSON
        let result;
        try {
          // Split CSV into lines
          const lines = fullResponse.trim().split('\n').filter(line => line.trim());
          
          // The AI might return with or without header
          // Look for the data line (contains status like 'complete' or 'incomplete')
          let dataLine = '';
          
          // Check if first line is header or data
          if (lines[0] && lines[0].includes('status,title,description')) {
            // Has header, use second line or last non-empty line
            dataLine = lines[lines.length - 1];
          } else {
            // No header, first line is data
            dataLine = lines[0];
          }
          
          if (!dataLine) {
            throw new Error("No data line found in CSV response");
          }
          
          // Parse CSV data
          const parseCSVLine = (line: string) => {
            const result: string[] = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
              const char = line[i];
              
              if (char === '"') {
                inQuotes = !inQuotes;
              } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
              } else {
                current += char;
              }
            }
            result.push(current); // Add last field
            
            return result.map(field => {
              // Remove quotes and convert "null" string to null
              field = field.trim();
              if (field.startsWith('"') && field.endsWith('"')) {
                field = field.slice(1, -1);
              }
              return field === 'null' ? null : field;
            });
          };
          
          const values = parseCSVLine(dataLine);
          
          // Map CSV to JSON structure
          const [status, csvTitle, csvDescription, csvStartDate, csvEndDate, emoji, message] = values;
          
          const isComplete = status === 'complete';
          // const missingFields = missingInfo ? missingInfo.split(';').filter(Boolean) : [];
          
          // Validate dates - max 6 months from start date
          if (csvStartDate && csvEndDate) {
            const start = new Date(csvStartDate as string);
            const end = new Date(csvEndDate as string);
            const sixMonthsFromStart = new Date(start);
            sixMonthsFromStart.setMonth(sixMonthsFromStart.getMonth() + 6);
            
            // If duration is more than 6 months, return error
            if (end > sixMonthsFromStart) {
              const monthDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
              result = {
                title: csvTitle,
                description: csvDescription,
                startDate: csvStartDate,
                endDate: csvEndDate,
                message: `Gagal membuat tujuan: Durasi maksimal adalah 6 bulan. Anda memasukkan ${monthDiff} bulan.`,
                error: `Durasi tujuan melebihi batas maksimal 6 bulan`,
                dataGoals: null
              };
              
              // Send error result
              await writer.write(
                encoder.encode(`data: ${JSON.stringify({ 
                  type: 'complete', 
                  data: result 
                })}\n\n`)
              );
              await writer.close();
              return;
            }
          }
          
          // For complete goals, generate preview schedules
          const schedules = [];
          if (isComplete && csvStartDate && csvEndDate) {
            const start = new Date(csvStartDate);
            const end = new Date(csvEndDate);
            const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            
            // Generate ALL schedules for preview display
            const daysToGenerate = totalDays; // Show ALL days, not just 7
            const currentDate = new Date(start);
            
            // Generate consistent and detailed descriptions for each day
            const generateDayDescription = (dayNum: number, totalDays: number, goalTitle: string | null, goalDesc: string | null) => {
              const isHafalan = goalTitle?.includes('Hafal') || goalTitle?.includes('Quran') || goalDesc?.includes('hafal');
              const week = Math.ceil(dayNum / 7);
              const dayInWeek = ((dayNum - 1) % 7) + 1;
              const juz = Math.min(5, Math.ceil(dayNum / 24)); // 5 juz target, ~24 days per juz
              const halaman = Math.min(20, Math.ceil(dayNum / 6)); // ~20 pages per juz, 6 days per page
              const progress = Math.round((dayNum / totalDays) * 100);
              
              if (isHafalan) {
                // Structured hafalan descriptions based on day of week
                const dayOfWeekNum = dayInWeek;
                
                if (dayOfWeekNum === 1) { // Monday - New week start
                  return `Awal minggu ${week}: Mulai dengan muroja'ah hafalan minggu lalu (15 menit), dilanjutkan hafalan baru. Target: Juz ${juz} halaman ${halaman}, minimal 5 ayat baru. Gunakan metode talaqqi.`;
                } else if (dayOfWeekNum === 2) { // Tuesday - Build momentum
                  return `Lanjutkan hafalan Juz ${juz} halaman ${halaman}. Pagi: Muroja'ah ayat kemarin (10x), tambah 5-7 ayat baru. Sore: Gabungkan hafalan 2 hari terakhir, baca dalam shalat.`;
                } else if (dayOfWeekNum === 3) { // Wednesday - Mid-week push
                  return `Pertengahan minggu ${week}: Fokus pada tahsin dan kelancaran. Perbaiki makhorijul huruf, perhatikan panjang pendek (mad). Target hari ini: 5 ayat baru + muroja'ah 1/4 juz.`;
                } else if (dayOfWeekNum === 4) { // Thursday - Intensive day
                  return `Hari intensif: Metode 3x3x3 untuk hafalan kuat. Baca 3 ayat pertama 3x, 3 ayat kedua 3x, gabungkan 6 ayat 3x. Target Juz ${juz} halaman ${halaman + 1}.`;
                } else if (dayOfWeekNum === 5) { // Friday - Special day
                  return `Jumat berkah: Mulai dengan tilawah 1 juz untuk melancarkan. Hafalan baru 5 ayat setelah Jumat. Malam: Muroja'ah seluruh hafalan minggu ini sebelum tidur.`;
                } else if (dayOfWeekNum === 6) { // Saturday - Review day
                  return `Sabtu review: Setorkan hafalan minggu ini ke guru/rekam untuk evaluasi. Perbaiki bacaan berdasarkan koreksi. Siapkan hafalan untuk minggu depan.`;
                } else { // Sunday - Consolidation
                  return `Minggu konsolidasi: Muroja'ah total hafalan ${Math.ceil(progress * 5 / 100)} juz. Tanpa melihat mushaf, test kelancaran dalam shalat. Catat ayat yang masih lemah.`;
                }
              } else {
                // Structured generic learning descriptions
                const dayOfWeekNum = dayInWeek;
                
                if (dayOfWeekNum === 1) { // Monday
                  return `Senin - Perencanaan minggu ${week}: Review progress minggu lalu, set target minggu ini. Mulai dengan konsep dasar, buat roadmap pembelajaran untuk 7 hari ke depan.`;
                } else if (dayOfWeekNum === 2) { // Tuesday
                  return `Selasa - Deep learning: Fokus pada satu topik utama hari ini. Pelajari teori mendalam, tonton 2-3 video tutorial, buat catatan komprehensif untuk referensi.`;
                } else if (dayOfWeekNum === 3) { // Wednesday
                  return `Rabu - Praktik: Implementasikan konsep yang dipelajari kemarin. Buat mini project atau selesaikan 5 latihan soal. Dokumentasikan kode dan pembelajaran.`;
                } else if (dayOfWeekNum === 4) { // Thursday
                  return `Kamis - Eksplorasi: Pelajari topik terkait atau advanced features. Baca dokumentasi resmi, eksperimen dengan edge cases. Progress saat ini: ${progress}%.`;
                } else if (dayOfWeekNum === 5) { // Friday
                  return `Jumat - Kolaborasi: Share progress di forum/community. Minta feedback, bantu yang lain, atau ikuti online workshop. Network dengan learner lain.`;
                } else if (dayOfWeekNum === 6) { // Saturday
                  return `Sabtu - Project day: Dedikasikan waktu untuk project yang lebih besar. Gabungkan semua pembelajaran minggu ini dalam satu implementasi nyata.`;
                } else { // Sunday
                  return `Minggu - Review & refleksi: Evaluasi pencapaian minggu ${week}. Apa yang berhasil? Apa yang perlu diperbaiki? Siapkan materi untuk minggu depan.`;
                }
              }
            };
            
            for (let day = 1; day <= daysToGenerate; day++) {
              const dateStr = currentDate.toISOString().split('T')[0];
              const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
              const dayName = currentDate.toLocaleDateString('id-ID', { weekday: 'long' });
              const startTime = isWeekend ? "10:00" : "09:00";
              const endTime = isWeekend ? "11:00" : "11:00";
              
              // Generate detailed description
              const detailedDescription = generateDayDescription(day, totalDays, csvTitle, csvDescription);
              
              // Create consistent titles
              let dayTitle = '';
              if (csvTitle?.includes('Hafal') || csvTitle?.includes('Quran')) {
                // Consistent format: "Hari X - DayName"
                dayTitle = `Hari ${day} - ${dayName}`;
              } else {
                // For other goals, same consistent format
                dayTitle = `Hari ${day} - ${dayName}`;
              }
              
              schedules.push({
                title: dayTitle,
                description: detailedDescription,
                startedTime: `${dateStr}T${startTime}:00+07:00`,
                endTime: `${dateStr}T${endTime}:00+07:00`,
                emoji: emoji || "📖",
                percentComplete: Math.round((day / totalDays) * 100)
              });
              
              currentDate.setDate(currentDate.getDate() + 1);
            }
          }
          
          result = {
            title: csvTitle,
            description: csvDescription,
            startDate: csvStartDate,
            endDate: csvEndDate,
            message: message || "Memproses tujuan Anda...",
            error: null,
            dataGoals: isComplete ? {
              title: csvTitle || "",
              description: csvDescription || "",
              startDate: csvStartDate || "",
              endDate: csvEndDate || "",
              emoji: emoji || "🎯",
              schedules: schedules // Shows 7-day preview for all goals
            } : null
          };
          
        } catch (parseError) {
          console.error("Failed to parse CSV response:", parseError);
          console.error("Raw response:", fullResponse);
          
          // Send error instead of fallback
          await writer.write(
            encoder.encode(`data: ${JSON.stringify({ 
              type: 'error', 
              error: parseError instanceof Error ? parseError.message : 'Gagal memproses respons AI' 
            })}\n\n`)
          );
          await writer.close();
          return;
        }

        // Send final result
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ 
            type: 'complete', 
            data: result 
          })}\n\n`)
        );

        // Close the stream
        await writer.write(encoder.encode('data: [DONE]\n\n'));
      } catch (error) {
        console.error("Stream processing error:", error);
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ 
            type: 'error', 
            error: error instanceof Error ? error.message : 'Unknown error' 
          })}\n\n`)
        );
      } finally {
        await writer.close();
      }
    })();

    // Return the streaming response
    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}