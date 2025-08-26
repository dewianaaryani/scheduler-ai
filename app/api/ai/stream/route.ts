import { requireUser } from "@/app/lib/hooks";
// import { prisma } from "@/app/lib/db"; // Commented out as unused
import { NextRequest } from "next/server";
import { debugLogGoalCSV, debugLogStreamingData } from "@/lib/debug-csv";

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();
    if (!session?.id) {
      return new Response("Unauthorized", { status: 401 });
    }
    console.log("User ID:", session.id);
    console.log("Processing new AI stream request");

    // fetchin user data preferences - commented out as unused
    // const userPreferences = await prisma.userPreferences.findFirst({
    //   where: { userId: session.id },
    //   select: { aiModel: true },
    // });

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
          encoder.encode(
            `data: ${JSON.stringify({
              type: "status",
              message: "Memproses tujuan Anda...",
            })}\n\n`
          )
        );

        // Get user context - commented out as unused
        // const userGoals = await prisma.goal.findMany({
        //   where: { userId: session.id },
        //   select: { title: true, description: true },
        //   take: 5,
        //   orderBy: { createdAt: "desc" },
        // });

        // const goalHistory = userGoals
        //   .map((g, i) => `Goal ${i + 1}: ${g.title} - ${g.description}`)
        //   .join("\n");

        // Get today's date for context
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];
        // const todayFormatted = today.toLocaleDateString("id-ID", {
        //   weekday: "long",
        //   year: "numeric",
        //   month: "long",
        //   day: "numeric",
        // });

        // Format dates properly for the AI
        // const formatDateForPrompt = (dateStr: string) => {
        //   const date = new Date(dateStr);
        //   return date.toLocaleDateString("id-ID", {
        //     weekday: "long",
        //     year: "numeric",
        //     month: "long",
        //     day: "numeric",
        //   });
        // };

        // Debug log the input
        console.log("Stream API received:", {
          initialValue,
          title,
          description,
          startDate,
          endDate,
        });

        // Calculate number of days if we have both dates
        let totalDays = 0;
        const dateList: string[] = [];
        let adjustedEndDate = endDate; // Track the adjusted end date

        if (startDate && endDate) {
          const start = new Date(startDate);
          let end = new Date(endDate);
          totalDays =
            Math.ceil(
              (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
            ) + 1;

          // Validate max 6 months (approximately 180 days)
          if (totalDays > 180) {
            console.log(
              `Date range exceeds 6 months (${totalDays} days), capping at 180 days`
            );
            totalDays = 180;
            // Adjust end date to 6 months from start
            const maxEnd = new Date(start);
            maxEnd.setMonth(maxEnd.getMonth() + 6);
            end = maxEnd;
            adjustedEndDate = end.toISOString(); // Update the adjusted date
          }

          // Generate list of all dates
          for (let i = 0; i < totalDays; i++) {
            const currentDate = new Date(start);
            currentDate.setDate(start.getDate() + i);
            dateList.push(currentDate.toISOString().split("T")[0]);
          }
        }

        // Build prompt for Claude - request CSV format with schedules
        const prompt = `You are a professional goal planner. ALL OUTPUT MUST BE IN INDONESIAN LANGUAGE.
Today: ${todayStr}

IMPORTANT VALIDATION RULES:
- Maximum allowed duration is 6 months (180 days)
- If user mentions: "1 tahun", "setahun", "2 tahun", "satu tahun", "dalam 1 tahun", "selama 1 tahun", etc. → status MUST be "incomplete"
- If user mentions: "8 bulan", "9 bulan", "10 bulan", etc. (more than 6) → status MUST be "incomplete"  
- For these cases, return message: "Durasi maksimal adalah 6 bulan. Silakan sesuaikan target Anda, misalnya: 'selama 6 bulan' atau 'selama 3 bulan'"

DATE DETECTION PRIORITY:
1. FIRST check if dates are provided in the payload (startDate/endDate fields below)
2. IF NO payload dates, THEN parse dates from user input text
3. Examples of date parsing from text:
   - "mulai besok" → extract tomorrow's date
   - "mulai 1 September" → extract September 1st  
   - "selama 3 bulan" → calculate end date as 3 months from start
   - "sampai akhir tahun" → extract December 31st

User input: "${initialValue}"
${title ? `Current title: ${title}` : ""}
${description ? `Current description: ${description}` : ""}

CRITICAL: The goal MUST be based on the user input above!
- If user mentions "Bahasa Jepang" → create Japanese learning schedules
- If user mentions "kaya" → create wealth building schedules  
- DO NOT mix up or ignore the user's actual request!
${
  startDate && endDate
    ? `
DATES PROVIDED IN PAYLOAD (USE THESE):
Start Date: ${new Date(startDate).toISOString().split("T")[0]}
End Date: ${new Date(adjustedEndDate).toISOString().split("T")[0]}${adjustedEndDate !== endDate ? " (adjusted to 6-month limit)" : ""}
TOTAL DAYS: ${totalDays} days
YOU MUST CREATE EXACTLY ${totalDays} SCHEDULES!

List of all dates that need schedules:
${dateList
  .slice(0, 20)
  .map((date, idx) => `Day ${idx + 1}: ${date}`)
  .join("\n")}
${totalDays > 20 ? `... (continue until day ${totalDays})` : ""}
`
    : startDate && !endDate
      ? `
PARTIAL DATE PROVIDED:
Start Date: ${new Date(startDate).toISOString().split("T")[0]}
End Date: NOT PROVIDED - extract from user input OR ask for duration
`
      : !startDate && endDate
        ? `
PARTIAL DATE PROVIDED:  
End Date: ${new Date(endDate).toISOString().split("T")[0]}
Start Date: NOT PROVIDED - extract from user input OR ask when to start
`
        : `
NO DATES PROVIDED IN PAYLOAD - extract from user input text
If no dates found in text, ask user for both start and duration
`
}

OUTPUT CSV ONLY! ALL TEXT IN INDONESIAN!
IMPORTANT: 
- Use semicolon (;) as delimiter, NOT comma (,)
- Do NOT include header line (status;title;description...) - start directly with data

${
  !startDate || !endDate
    ? `
Status: incomplete (dates not complete)
Output directly (no header):
incomplete;[title];[description];[startDate or empty];[endDate or empty];[emoji];[message]

IMPORTANT RULES FOR INCOMPLETE STATUS:
- title: The goal name based on user input (e.g., "Pembuatan Aplikasi Toko POS")
- description: MUST be a proper detailed description of what the goal entails (50-100 chars)
  Example: "Mengembangkan aplikasi point of sale dengan fitur inventory dan laporan keuangan"
  NOT: "Anda belum menentukan detail" or "Detail belum ada"
- For missing dates: use empty string "" or leave blank, NOT text values
- message: Ask for the missing dates

Check user input text for date mentions before asking!
- If user says "mulai besok selama 3 bulan" → extract BOTH dates and set status "complete"
- If user says "belajar python 30 hari" → extract duration and ask for start date
- If user says "mulai september" → extract start and ask for duration

Example output for incomplete status:
incomplete;"Pembuatan Aplikasi Toko POS";"Mengembangkan sistem point of sale dengan manajemen inventory dan laporan";;;"🛒";"Kapan Anda ingin mulai? Berapa lama target pengerjaannya?"

Example messages in Indonesian:
- Missing start: "Kapan Anda ingin mulai? Contoh: 'mulai besok' atau 'mulai 1 September'"
- Missing end: "Berapa lama target Anda? Contoh: 'selama 30 hari' atau 'selama 3 bulan' (maksimal 6 bulan)"
- Duration too long (e.g., "1 tahun"): "Durasi maksimal adalah 6 bulan. Silakan sesuaikan target Anda, misalnya: 'selama 6 bulan' atau 'selama 3 bulan'"
`
    : `
Status: complete
YOU MUST create ${totalDays} schedules (from ${dateList[0]} to ${dateList[dateList.length - 1]})

Output goal data directly (no header):
complete;[title];[description];${dateList[0]};${dateList[dateList.length - 1]};[emoji];[message]

MANDATORY: Add this exact line after goal data:
[SCHEDULES]

Then list schedules (no header):
1;[dayTitle];[dayDescription];[startTime];[endTime]
2;[dayTitle];[dayDescription];[startTime];[endTime]
...continue for all ${totalDays} days

CREATE EXACTLY ${totalDays} SCHEDULE ROWS:
${dateList
  .slice(0, 5)
  .map(
    (_, idx) =>
      `${idx + 1};<title min 20 chars>;<description 50-200 chars>;11:00;15:00`
  )
  .join("\n")}
${totalDays > 5 ? `... (CONTINUE UNTIL YOU HAVE ${totalDays} ROWS)` : ""}
`
}

RULES:
- Maximum date range is 6 months (180 days)
- title: Always create a proper goal title based on user input
- description: ALWAYS provide meaningful description of the goal (what it entails, objectives)
  NEVER use placeholder text like "belum ditentukan" or "detail belum ada"
- dayTitle: minimum 20 characters, specific and clear (in Indonesian)
- dayDescription: MUST be 50-200 characters, detailed action steps (in Indonesian)
- Vary activities progressively, don't repeat the same tasks
- Use 24-hour format for time (HH:MM)
- ALL output text MUST be in Indonesian language
- PLEASE CREATE TIME BETWEEN 11:00 - 15:00 ONLY

${
  startDate && endDate
    ? `
CRITICAL: You MUST generate EXACTLY ${totalDays} schedules.
Do NOT stop at 5 or 7. Continue until you have ${totalDays} rows.
Each schedule must be for a different date.
Count your output - it should have ${totalDays} schedule lines.
`
    : ""
}

Example of expected output format for complete status:
complete;Goal Title;Goal description here;2025-08-26;2025-09-29;📖;Success message

[SCHEDULES]
1;Task for day 1;Detailed description 150-300 chars;11:00;14:00
2;Task for day 2;Detailed description 150-300 chars;11:30;14:30

Start output now:`;

        // Send status update
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "status",
              message: "Menghubungi AI...",
            })}\n\n`
          )
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
            model: "claude-3-5-haiku-20241022", // Haiku is 5x faster than Sonnet
            max_tokens:
              totalDays > 0
                ? Math.min(8192, Math.max(4000, totalDays * 100))
                : 4000, // Dynamic with 8192 cap
            stream: true,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("AI API Error:", response.status, errorText);
          throw new Error(
            `AI API error: ${response.status} ${response.statusText}`
          );
        }

        // Stream Claude's response
        const reader = response.body?.getReader();
        if (!reader) {
          console.error("No response body from AI");
          throw new Error("No response body from AI");
        }

        console.log("=== STARTING TO STREAM FROM CLAUDE ===");
        let buffer = "";
        let fullResponse = "";
        let chunkCount = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log("=== CLAUDE STREAM ENDED ===");
            break;
          }

          const chunk = new TextDecoder().decode(value);
          buffer += chunk;
          chunkCount++;

          // Log first few chunks to see what we're getting
          if (chunkCount <= 5) {
            console.log(
              `Chunk ${chunkCount} from Claude:`,
              chunk.substring(0, 200)
            );
          }

          // Process SSE messages from Claude
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                console.log("Received [DONE] from Claude");
                continue;
              }

              try {
                const parsed = JSON.parse(data);

                if (
                  parsed.type === "content_block_delta" &&
                  parsed.delta?.text
                ) {
                  fullResponse += parsed.delta.text;
                  // Log progress every 1000 characters
                  if (fullResponse.length % 1000 < parsed.delta.text.length) {
                    console.log(
                      `Claude response length: ${fullResponse.length} chars`
                    );
                  }
                } else if (parsed.type === "message_start") {
                  console.log("Claude message started");
                } else if (parsed.type === "message_stop") {
                  console.log("Claude message complete");
                } else if (parsed.type === "content_block_start") {
                  console.log("Claude content block started");
                } else if (parsed.type === "content_block_stop") {
                  console.log("Claude content block stopped");
                }
              } catch (e) {
                console.error("Parse error:", e);
              }
            }
          }
        }

        console.log("Final full response length:", fullResponse.length);
        console.log("First 500 chars:", fullResponse.substring(0, 500));

        // Parse CSV response into JSON
        let result;
        try {
          // Split CSV into lines
          const lines = fullResponse
            .trim()
            .split("\n")
            .filter((line) => line.trim());

          console.log("Parsed lines:", lines.length, "lines");
          if (lines.length > 0) {
            console.log("First line:", lines[0]);
          }

          // The AI might return with or without header
          // Look for the data line (contains status like 'complete' or 'incomplete')
          let dataLine = "";

          // Check if first line is header or data
          if (lines.length === 0) {
            console.error("Empty AI response received");
            throw new Error("AI tidak memberikan respons. Silakan coba lagi.");
          }

          // Check for header with both comma and semicolon formats
          const firstLine = lines[0].toLowerCase();
          if (
            firstLine &&
            (firstLine.includes("status;title;description") ||
              firstLine.includes("status,title,description") ||
              firstLine ===
                "status;title;description;startdate;enddate;emoji;message")
          ) {
            // Has header, use second line
            dataLine = lines[1] || "";
            console.log("Header detected, using line 2 as data");
          } else {
            // No header, first line is data
            dataLine = lines[0];
            console.log("No header detected, using line 1 as data");
          }

          if (!dataLine || dataLine.trim() === "") {
            console.error("No valid data line in response:", lines);
            throw new Error(
              "Format respons AI tidak valid. Silakan coba lagi."
            );
          }

          // Parse CSV data
          const parseCSVLine = (line: string) => {
            const result: string[] = [];
            let current = "";
            let inQuotes = false;

            for (let i = 0; i < line.length; i++) {
              const char = line[i];

              if (char === '"') {
                inQuotes = !inQuotes;
              } else if (char === ";" && !inQuotes) {
                result.push(current);
                current = "";
              } else {
                current += char;
              }
            }
            result.push(current); // Add last field

            return result.map((field) => {
              // Remove quotes and convert "null" string to null
              field = field.trim();
              if (field.startsWith('"') && field.endsWith('"')) {
                field = field.slice(1, -1);
              }
              return field === "null" ? null : field;
            });
          };

          const values = parseCSVLine(dataLine);
          console.log("Parsed CSV values:", values);

          // Validate we have the expected number of fields
          if (values.length < 7) {
            console.error(
              "Invalid CSV format - expected 7 fields, got",
              values.length
            );
            console.error("Raw line:", dataLine);
            throw new Error("Format respons tidak sesuai. Silakan coba lagi.");
          }

          // Map CSV to JSON structure
          const [
            status,
            csvTitle,
            csvDescription,
            csvStartDate,
            csvEndDate,
            emoji,
            message,
          ] = values;

          // Clean up date values - convert invalid strings to null
          const cleanDate = (dateStr: string | null | undefined) => {
            if (
              !dateStr ||
              dateStr === "" ||
              dateStr === "null" ||
              dateStr === "BELUM DITENTUKAN" ||
              dateStr === "NOT DETERMINED"
            ) {
              return null;
            }
            // Check if it's a valid date format
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) {
              return null;
            }
            return dateStr;
          };

          const cleanStartDate = cleanDate(csvStartDate);
          const cleanEndDate = cleanDate(csvEndDate);

          const isComplete = status === "complete";
          const isInvalid = status === "invalid";

          // Validate dates - max 6 months from start date
          if (cleanStartDate && cleanEndDate) {
            const start = new Date(cleanStartDate);
            const end = new Date(cleanEndDate);
            const sixMonthsFromStart = new Date(start);
            sixMonthsFromStart.setMonth(sixMonthsFromStart.getMonth() + 6);

            // If duration is more than 6 months, return error
            if (end > sixMonthsFromStart) {
              const monthDiff = Math.ceil(
                (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
              );
              result = {
                title: csvTitle,
                description: csvDescription,
                startDate: csvStartDate,
                endDate: csvEndDate,
                message: `Gagal membuat tujuan: Durasi maksimal adalah 6 bulan. Anda memasukkan ${monthDiff} bulan.`,
                error: `Durasi tujuan melebihi batas maksimal 6 bulan`,
                dataGoals: null,
              };

              // Debug log duration error
              debugLogGoalCSV(
                {
                  title: csvTitle,
                  description: csvDescription,
                  startDate: csvStartDate,
                  endDate: csvEndDate,
                  emoji: emoji || "🎯",
                  status: "error",
                  message: result.message,
                  error: result.error,
                },
                "duration_error"
              );

              // Send error result
              await writer.write(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "complete",
                    data: result,
                  })}\n\n`
                )
              );
              return;
            }
          }

          // Parse schedules from response
          const schedules: Array<{
            title: string;
            description: string;
            startedTime: string;
            endTime: string;
            emoji: string;
            percentComplete: number;
          }> = [];

          // Also check if schedules are included without [SCHEDULES] marker
          const hasScheduleMarker = fullResponse.includes("[SCHEDULES]");
          const hasScheduleData = lines.length > 2 && lines[1]?.match(/^\d+;/);

          if (
            isComplete &&
            cleanStartDate &&
            cleanEndDate &&
            (hasScheduleMarker || hasScheduleData)
          ) {
            const start = new Date(cleanStartDate);
            const end = new Date(cleanEndDate);
            const totalDays =
              Math.floor(
                (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
              ) + 1;

            // Extract schedule section from response
            let schedulePart = "";

            if (hasScheduleMarker) {
              // Has [SCHEDULES] marker
              schedulePart = fullResponse.split("[SCHEDULES]")[1];
            } else if (hasScheduleData) {
              // No marker but has schedule data starting from line 2
              schedulePart = lines.slice(1).join("\n");
            }

            if (schedulePart) {
              const scheduleLines = schedulePart
                .trim()
                .split("\n")
                .filter((line: string) => line.trim());
              const currentDate = new Date(start);

              // Parse each schedule line (skip header if present)
              for (let i = 0; i < scheduleLines.length; i++) {
                const line = scheduleLines[i];

                // Skip the header line
                if (
                  i === 0 &&
                  (line.toLowerCase().includes("day;daytitle") ||
                    line.toLowerCase().includes("day,daytitle"))
                ) {
                  continue;
                }
                // Parse CSV format: day;dayTitle;dayDescription;startTime;endTime
                const parseCSVLine = (line: string) => {
                  const result: string[] = [];
                  let current = "";
                  let inQuotes = false;

                  for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    if (char === '"') {
                      inQuotes = !inQuotes;
                    } else if (char === ";" && !inQuotes) {
                      result.push(current);
                      current = "";
                    } else {
                      current += char;
                    }
                  }
                  result.push(current); // Add last field

                  return result.map((field) => {
                    field = field.trim();
                    if (field.startsWith('"') && field.endsWith('"')) {
                      field = field.slice(1, -1);
                    }
                    return field;
                  });
                };

                const values = parseCSVLine(line);
                if (values.length >= 5) {
                  const [
                    dayNum,
                    dayTitle,
                    dayDescription,
                    csvStartTime,
                    csvEndTime,
                  ] = values;
                  const day = parseInt(dayNum);

                  if (!isNaN(day) && day <= totalDays) {
                    const dateStr = currentDate.toISOString().split("T")[0];

                    // Use times from CSV - ensure they are properly parsed
                    const schedStartTime =
                      csvStartTime && csvStartTime.includes(":")
                        ? csvStartTime.trim()
                        : "09:00";
                    const schedEndTime =
                      csvEndTime && csvEndTime.includes(":")
                        ? csvEndTime.trim()
                        : "11:00";

                    // Debug log to verify times
                    if (schedules.length < 3) {
                      console.log(
                        `Schedule ${day}: Start=${schedStartTime}, End=${schedEndTime}`
                      );
                    }

                    // Debug first schedule to check parsing
                    if (schedules.length === 0) {
                      console.log("First schedule parsed values:", {
                        dayNum,
                        dayTitle: dayTitle?.substring(0, 50),
                        dayDescription: dayDescription?.substring(0, 100),
                        csvStartTime,
                        csvEndTime,
                      });
                    }

                    schedules.push({
                      title: dayTitle || `Hari ${day}`,
                      description: dayDescription || `Progress hari ke-${day}`,
                      startedTime: `${dateStr}T${schedStartTime}:00+07:00`,
                      endTime: `${dateStr}T${schedEndTime}:00+07:00`,
                      emoji: emoji || "📚",
                      percentComplete: Math.round((day / totalDays) * 100),
                    });

                    currentDate.setDate(currentDate.getDate() + 1);

                    // Don't limit - generate all schedules for the full date range
                  }
                }
              }
            }
          }

          // Only create dataGoals if we have complete data with schedules
          result = {
            title: csvTitle || null,
            description: csvDescription || null,
            startDate: cleanStartDate || null,
            endDate: cleanEndDate || null,
            message: message || "Memproses tujuan Anda...",
            error: isInvalid ? "Tujuan tidak valid" : null,
            dataGoals:
              isComplete &&
              cleanStartDate &&
              cleanEndDate &&
              schedules.length > 0
                ? {
                    title: csvTitle || "",
                    description: csvDescription || "",
                    startDate: cleanStartDate || "",
                    endDate: cleanEndDate || "",
                    emoji: emoji || "🎯",
                    schedules: schedules,
                  }
                : null,
          };

          console.log("Final result:", {
            status,
            isComplete,
            hasSchedules: schedules.length,
            dataGoals: result.dataGoals ? "yes" : "no",
          });
        } catch (parseError) {
          console.error("Failed to parse CSV response:", parseError);
          console.error("Raw response:", fullResponse);

          // Debug log the parsing error
          debugLogStreamingData(
            prompt,
            fullResponse,
            null,
            parseError as Error
          );

          // Send error instead of fallback
          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                error:
                  parseError instanceof Error
                    ? parseError.message
                    : "Gagal memproses respons AI",
              })}\n\n`
            )
          );
          return;
        }

        // Send final result FIRST (before debug logging)
        console.log("Sending final result to client");
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "complete",
              data: result,
            })}\n\n`
          )
        );

        // Close the stream immediately
        console.log("Sending [DONE] to close stream");
        await writer.write(encoder.encode("data: [DONE]\n\n"));

        // Ensure data is flushed to client
        await writer.ready;
        console.log("Stream closed successfully");

        // Debug log AFTER sending response (non-blocking)
        setTimeout(() => {
          debugLogGoalCSV(
            {
              ...result,
              status: result.error ? "error" : "success",
              emoji: result.dataGoals?.emoji || "🎯",
            },
            "stream_result"
          );
          debugLogStreamingData(prompt, fullResponse, result);
        }, 0);
      } catch (error) {
        // Check if error is ResponseAborted (client disconnected)
        if (error instanceof Error && error.name === "ResponseAborted") {
          console.log("Client disconnected during stream");
        } else {
          console.error("Stream processing error:", error);
          try {
            await writer.write(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "error",
                  error:
                    error instanceof Error ? error.message : "Unknown error",
                })}\n\n`
              )
            );
          } catch (writeError) {
            console.error("Failed to write error:", writeError);
          }
        }
      } finally {
        try {
          // Try to close the writer, but don't worry if it fails
          await writer.close();
        } catch (closeError) {
          // This is expected if client disconnected or stream already closed
          // Only log if it's not a typical close error
          const errorMessage =
            closeError instanceof Error
              ? closeError.message
              : String(closeError);
          if (
            !errorMessage.includes("WritableStream is closed") &&
            !errorMessage.includes("ResponseAborted")
          ) {
            console.error("Unexpected stream close error:", closeError);
          }
        }
      }
    })();

    // Return the streaming response
    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
