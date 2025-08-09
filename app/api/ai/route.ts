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
You are a productivity assistant. Based on the user's previous goals, suggest 4 new goal ideas that are achievable by designing a realistic schedule.

Here are the user's past goals:
${historyText}

CRITICAL: You must respond with ONLY a valid JSON array. No explanations, no markdown, no extra text.
Output titles in INDONESIAN language but keep JSON keys in English.

Required format:
[
  { "emoji": "🧠", "title": "Belajar keterampilan baru" },
  { "emoji": "🗓️", "title": "Mengatur rutinitas harian" },
  { "emoji": "💪", "title": "Memulai rutinitas kebugaran" },
  { "emoji": "📚", "title": "Membaca lebih banyak buku" }
]

Rules:
- Return exactly 4 suggestions
- Each suggestion must have "emoji" and "title" fields
- Title must be 5-50 characters in Indonesian
- Use single relevant emoji
- JSON must be valid and parseable
- No text before or after the JSON array
- All titles must be in INDONESIAN language
`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-20250514",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const json = await response.json();
    const raw = json.content?.[0]?.text ?? "[]";
    console.log("AI suggestions raw response:", raw);

    let suggestions;
    try {
      // Clean the response
      const cleanedResponse = raw
        .trim()
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .replace(/^[\s\n]*/, "")
        .replace(/[\s\n]*$/, "");

      suggestions = JSON.parse(cleanedResponse);

      // Validate it's an array
      if (!Array.isArray(suggestions)) {
        throw new Error("Response is not an array");
      }
    } catch (parseErr) {
      console.error("Gagal memproses saran JSON:", parseErr);
      console.log("Raw response:", raw);

      // Try to extract array from response
      try {
        const arrayMatch = raw.match(/(\[[\s\S]*\])/);
        if (arrayMatch && arrayMatch[0]) {
          const cleanArray = arrayMatch[0]
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
          suggestions = JSON.parse(cleanArray);
        } else {
          // Return fallback suggestions
          suggestions = [
            { emoji: "🎯", title: "Tetapkan tujuan baru" },
            { emoji: "📚", title: "Pelajari sesuatu yang baru" },
            { emoji: "💪", title: "Mulai kebiasaan sehat" },
            { emoji: "🗓️", title: "Atur rutinitas harian" },
          ];
        }
      } catch (extractErr) {
        console.error("Gagal mengekstrak array saran:", extractErr);
        // Return fallback suggestions
        suggestions = [
          { emoji: "🎯", title: "Tetapkan tujuan baru" },
          { emoji: "📚", title: "Pelajari sesuatu yang baru" },
          { emoji: "💪", title: "Mulai kebiasaan sehat" },
          { emoji: "🗓️", title: "Atur rutinitas harian" },
        ];
      }
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

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { preferences: true },
    });

    const userPreferences = user?.preferences;

    const userGoals = await prisma.goal.findMany({
      where: { userId: session.id },
      select: { title: true, description: true },
      take: 5,
      orderBy: { createdAt: "desc" },
    });
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const goalHistory = userGoals
      .map((g, i) => `Goal ${i + 1}: ${g.title} - ${g.description}`)
      .join("\n");

    // Check if we have complete goal data regardless of how it was initially entered
    const hasCompleteData = title && description && startDate && endDate;
    const isInitialSuggestionOnly =
      !title &&
      !description &&
      !startDate &&
      !endDate &&
      initialValue.match(/^[🎯🧠📚💪🗓️📝💻🎨🏃‍♂️🧘‍♀️📖🎵🌱✨]\s/);

    // Get existing schedules for conflict avoidance
    const existingSchedules = await prisma.schedule.findMany({
      where: { userId: session.id },
      select: { startedTime: true, endTime: true },
    });
    const scheduleConflicts = existingSchedules
      .map((s) => `{start: "${s.startedTime}", end: "${s.endTime}"}`)
      .join(", ");

    // Let AI calculate duration from extracted dates independently

    const prompt = `
CRITICAL: You must respond with ONLY valid JSON. No explanations, no markdown, no extra text.
Output all text content (titles, descriptions, messages) in INDONESIAN language but keep JSON keys in English.

🚨 ABSOLUTE REQUIREMENT: If generating schedules, the FINAL schedule MUST be on the endDate.
🚨 EXAMPLE: If endDate is 2025-08-30, the last schedule's startedTime MUST be "2025-08-30T...".
🚨 DO NOT end schedules one day early! Cover ALL days from startDate to endDate inclusive.
🚨 CRITICAL DATE FORMAT: Use T00:00:00.000Z for dates, NOT T23:59:59.999Z! This prevents timezone issues.
🚨 FIRST SCHEDULE REQUIREMENT: The FIRST schedule date MUST match the startDate exactly!
🚨 LAST SCHEDULE REQUIREMENT: The LAST schedule date MUST match the endDate exactly!

Today is ${today}.
User input: "${initialValue}"

Current data:
- title: ${title || "not provided"}
- description: ${description || "not provided"}  
- startDate: ${startDate || "not provided"}
- endDate: ${endDate || "not provided"}

Data completeness: ${hasCompleteData ? "COMPLETE" : "INCOMPLETE"}
Initial input type: ${
      isInitialSuggestionOnly ? "SUGGESTION_SELECTION" : "USER_INPUT"
    }
Duration: CALCULATE from extracted dates (count days from startDate to endDate inclusive)
Schedule Strategy: DAILY (per-day schedules)  
CRITICAL MATH CHECK: Count actual days from your extracted startDate to endDate = number of schedules needed

Goal history: ${goalHistory || "No previous goals."}
User preferences: ${JSON.stringify(userPreferences || {})}
Existing schedules to avoid: [${scheduleConflicts}]

TASK: Process goal information and generate schedules if complete.
CRITICAL: Always extract duration/time information from Indonesian text:
- "dalam waktu X minggu" = X weeks duration
- "dalam X hari" = X days duration
- "selama X bulan" = X months duration
- When duration is found, ALWAYS calculate startDate (today) and endDate

PROCESSING RULES:
1. ALWAYS extract dates and durations from user input (English OR Indonesian):
   ENGLISH PATTERNS:
   - "from January 1 to January 31" → extract both dates
   - "starting tomorrow" → extract start date
   - "for 2 weeks" → startDate: today, endDate: 2 weeks from today
   - "next month" → calculate month start/end dates
   - "this weekend" → calculate weekend dates
   
   INDONESIAN PATTERNS (MUST EXTRACT):
   - "dalam 2 minggu" or "dalam waktu 2 minggu" → startDate: today, endDate: 14 days from today
   - "selama 1 bulan" → startDate: today, endDate: 30 days from today
   - "dalam 30 hari" → startDate: today, endDate: 30 days from today
   - "minggu depan" → next week's dates
   - "bulan depan" → next month's dates
   - "mulai besok" → startDate: tomorrow
   - "dari tanggal 1 sampai 31" → extract both dates
   - "dari [tanggal] sampai [tanggal]" → extract both dates EXACTLY as specified (inclusive range)
   - "selesai [tanggal]" → set endDate to that EXACT date (no +1 day!)
   - "berakhir [tanggal]" → set endDate to that EXACT date
   - "hingga [tanggal]" → set endDate to that EXACT date
   - CRITICAL: "sampai", "selesai", "berakhir", "hingga" all mean the end date is INCLUSIVE, not exclusive
2. If data completeness is "COMPLETE": Generate full goal with schedules
3. If data completeness is "INCOMPLETE": Return basic structure with extracted info
4. For schedules:
   - WAJIB: Buat SATU jadwal untuk SETIAP HARI (one schedule per day ONLY!)
   - DILARANG: Menggabungkan beberapa hari dalam satu jadwal (TIDAK BOLEH "Hari 3-6" atau "Hari 112-120")
   - BENAR: "Hari 1", "Hari 2", "Hari 3" (terpisah untuk setiap hari)
   - SALAH: "Hari 3-6" (ini menggabungkan 4 hari - TIDAK BOLEH!)
   - Count schedules based on actual date range (1 schedule per day from startDate to endDate inclusive)
   - Each schedule should be 1-2 hours (beginner activities) or 2-3 hours (advanced/intensive activities)
   - Use consistent START time (e.g., always 09:00, 14:00, 19:00) but vary duration based on activity complexity
   - If user has preferences.availability, use that time slot
   - ACTIVITY-APPROPRIATE TIME GUIDELINES:
     * Learning/Study (belajar, membaca): 1-2 hours (avoid mental fatigue)
     * Physical activities (olahraga, fitness): 1-1.5 hours (includes warm-up/cool-down) 
     * Creative work (menulis, desain, musik): 1.5-3 hours (allows for flow state)
     * Cooking/Practical skills (masak, keterampilan): 2-4 hours (complex recipes + cleanup)
     * Planning/Review (perencanaan, review): 30-60 minutes (concise and focused)
     * Language practice (bahasa): 1-1.5 hours (optimal attention span)
     * Programming/Technical: 2-4 hours (complex problem solving)
     * Workshop/intensive training: 3-6 hours (with breaks)
     * Project work/research: 2-5 hours (deep work sessions)
     * Art/craft projects: 2-6 hours (depends on complexity)
   - DURATION LOGIC: Match time to activity complexity and nature
   - REALISTIC EXAMPLES:
     * Cooking workshop: 09:00 to 15:00 (6 hours with breaks) ✓
     * Study session: 09:00 to 11:00 (2 hours) ✓
     * Programming project: 13:00 to 17:00 (4 hours) ✓
     * Quick review: 19:00 to 19:30 (30 minutes) ✓
5. Avoid overlapping with ANY existing user schedules
6. MUST respect user availability preferences
7. Maintain the SAME time slot for all schedules in this goal for consistency 

DATE EXTRACTION EXAMPLES:
ENGLISH:
- "Learn Python from December 1 to December 31" → startDate: "2024-12-01T00:00:00.000Z", endDate: "2024-12-31T00:00:00.000Z"
- "Start workout routine tomorrow" → startDate: tomorrow's date, endDate: null
- "Read 5 books this month" → startDate: first of current month, endDate: last of current month
- "Practice piano for 2 weeks" → startDate: today, endDate: 14 days from today

INDONESIAN (CRITICAL - MUST EXTRACT):
- "Membaca novel dengan target 300 halaman dalam waktu 2 minggu" → startDate: today, endDate: 14 days from today
- "Belajar coding selama 1 bulan" → startDate: today, endDate: 30 days from today
- "Latihan fitness dalam 30 hari" → startDate: today, endDate: 30 days from today
- "Menyelesaikan project dalam 2 minggu" → startDate: today, endDate: 14 days from today
- "Saya mau belajar masak dari 10 Agustus 2025 sampai 24 Agustus 2025" → startDate: "2025-08-10", endDate: "2025-08-24" (NOT 2025-08-25!)
- "selesai 1 Desember 2025" → endDate: "2025-12-01" (NOT 2025-12-02!)
- "target selesai tanggal 15 Januari 2026" → endDate: "2026-01-15"
- "berakhir pada 31 Maret 2025" → endDate: "2025-03-31"
- CRITICAL: When parsing "dari X sampai Y" or "selesai [date]", the specified date IS the FINAL DATE (inclusive). Do NOT add +1 day!

RESPONSE FORMAT - Choose ONE:

Option 1 (Incomplete data - ALWAYS include extracted dates if duration mentioned):
{
  "title": "extracted or provided title",
  "description": "extracted or provided description", 
  "startDate": "2025-08-10T00:00:00.000Z",
  "endDate": "2025-08-16T00:00:00.000Z"
}

Option 2 (Complete data - generate full goal):
{
  "dataGoals": {
    "title": "${title || "Goal title"}",
    "description": "${
      description || "Goal description"
    }", //generate more detail description
    "startDate": "2025-08-10T00:00:00.000Z",
    "endDate": "2025-08-16T00:00:00.000Z",
    "emoji": "🎯",
    "schedules": [
      {
        "title": "Hari 1: Pengenalan dan Setup",
        "description": "Memulai dengan dasar-dasar, persiapan alat dan materi",
        "startedTime": "2025-08-10T09:00:00+07:00",
        "endTime": "2025-08-10T11:00:00+07:00",
        "emoji": "🚀",
        "percentComplete": 15
      },
      {
        "title": "Hari 2: Pembelajaran Dasar",
        "description": "Mempelajari konsep fundamental dengan praktek ringan",
        "startedTime": "2025-08-11T09:00:00+07:00",
        "endTime": "2025-08-11T11:00:00+07:00",
        "emoji": "📚",
        "percentComplete": 30
      },
      {
        "title": "Hari 3: Latihan Lanjutan",
        "description": "Memperdalam pemahaman dengan latihan yang lebih kompleks",
        "startedTime": "2025-08-12T09:00:00+07:00",
        "endTime": "2025-08-12T11:00:00+07:00",
        "emoji": "💪",
        "percentComplete": 45
      },
      {
        "title": "Hari 4: Aplikasi Praktis",
        "description": "Menerapkan pengetahuan dalam proyek nyata",
        "startedTime": "2025-08-13T09:00:00+07:00",
        "endTime": "2025-08-13T11:00:00+07:00",
        "emoji": "🛠️",
        "percentComplete": 60
      },
      {
        "title": "Hari 5: Evaluasi Kemajuan",
        "description": "Menilai perkembangan dan menyesuaikan strategi",
        "startedTime": "2025-08-14T09:00:00+07:00",
        "endTime": "2025-08-14T11:00:00+07:00",
        "emoji": "📊",
        "percentComplete": 75
      },
      {
        "title": "Hari 6: Penguatan Materi",
        "description": "Mengulang dan memperkuat konsep penting",
        "startedTime": "2025-08-15T09:00:00+07:00",
        "endTime": "2025-08-15T11:00:00+07:00",
        "emoji": "🔄",
        "percentComplete": 90
      },
      {
        "title": "Hari 7: Penyelesaian dan Refleksi",
        "description": "Menyelesaikan target, evaluasi menyeluruh, dan perayaan pencapaian",
        "startedTime": "2025-08-16T09:00:00+07:00",
        "endTime": "2025-08-16T11:00:00+07:00",
        "emoji": "🎯",
        "percentComplete": 100
      }
    ]
  },
  "message": "Rencana tujuan berhasil dibuat",
  "error": null
}

CRITICAL:
- Use Option 2 ONLY when data completeness is "COMPLETE" (all 4 fields: title, description, startDate, endDate are available)
- Use Option 1 when any field is missing, but MUST include extracted dates if duration/time is mentioned
- For Indonesian text with duration (e.g., "dalam 2 minggu"), ALWAYS extract and return startDate and endDate
- Even if only initialValue is provided, extract dates from duration mentions
- CRITICAL: Create one schedule for EVERY SINGLE DAY from startDate to endDate (INCLUSIVE)
- PERINGATAN KERAS: SATU HARI = SATU JADWAL! Jangan gabungkan hari!
  * BENAR: 7 hari = 7 jadwal terpisah
  * SALAH: 7 hari = 1 jadwal dengan judul "Hari 1-7" 
- DATE ALIGNMENT CRITICAL: 
  * If goal startDate = "2025-08-10T00:00:00.000Z", first schedule = "2025-08-10T09:00:00+07:00"
  * If goal endDate = "2025-08-16T00:00:00.000Z", last schedule = "2025-08-16T09:00:00+07:00"
  * The DATE part (2025-08-10) MUST match between goal and schedule!
- MUST generate exactly the correct number of schedules based on your calculated date range (one per day, including both start and end dates)
- EXAMPLE: If startDate is 2025-08-28 and endDate is 2025-08-30, create 3 schedules:
  * Schedule 1: 2025-08-28T09:00:00+07:00 (Kamis, 28 Agustus)
  * Schedule 2: 2025-08-29T09:00:00+07:00 (Jumat, 29 Agustus)
  * Schedule 3: 2025-08-30T09:00:00+07:00 (Sabtu, 30 Agustus - FINAL DAY!)
- CRITICAL EXAMPLE: User chooses dates "10 to 16" means:
  * Day 10, Day 11, Day 12, Day 13, Day 14, Day 15, Day 16 = 7 schedules total
- CRITICAL: NO DATE GAPS! Every consecutive day must be included.
- CONSISTENT TIME ALLOCATION: Use the same duration for similar activities throughout the goal
- ACTIVITY-BASED DURATION: Match duration to activity type (see guidelines above)
- AVOID FATIGUE: Don't exceed optimal learning/practice times
- WEEKEND ADAPTATION: Include weekends but with lighter activities (review, reflection, planning)
- Include REST DAYS: Every 6-7 days, create a lighter "review and rest" schedule
- Generate EXACTLY the correct number of schedules for your calculated date range, no more, no less
- Ensure valid JSON with no trailing commas
- Schedules should be practical and achievable
- CRITICAL: percentComplete must be PROGRESSIVE, CONSISTENT, and REALISTIC
- FORMULA: percentComplete = Math.round(((scheduleIndex + 1) / totalSchedules) * 100)
- EXAMPLES: 
  * 5 schedules: 20%, 40%, 60%, 80%, 100%
  * 10 schedules: 10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90%, 100%
  * 30 schedules: 3%, 7%, 10%, 13%, 17%, 20%, ..., 97%, 100%
- RULES: No percentage jumps > 15%, no stagnant percentages, last = 100%
- REST DAYS: Use same percentage as previous day (no progress loss on rest days)
- If user provides dates in initial input, extract them even for incomplete goals
- Respect user preferences for availability if provided
- VALIDATION CHECKLIST before responding:
  1. Count schedules = actual days from startDate to endDate inclusive (exact match required)
  2. Check dates: NO gaps between consecutive schedules  
  3. Verify progress: Each percentage > previous, final = 100%
  4. Confirm FIRST schedule date: Must be on startDate (e.g., if startDate is 2025-08-10, first schedule is 2025-08-10)
  5. Confirm LAST schedule date: Must be on endDate (e.g., if endDate is 2025-08-16, last schedule is 2025-08-16)
  6. PERIKSA JUDUL: Tidak boleh ada rentang hari (SALAH: "Hari 3-6", BENAR: "Hari 3", "Hari 4", "Hari 5", "Hari 6")
  7. Time allocation: Follow activity-specific durations, lighter on weekends (30-60 min for review)
- FINAL CHECK: The last schedule's startedTime MUST be on the endDate, not one day before!
- DATE PARSING CRITICAL: When user says "sampai [date]", that date IS the final date.
- EXAMPLE CHECK: "dari 10 Agustus sampai 24 Agustus" means endDate = 2025-08-24, final schedule = 2025-08-24T...
- EXAMPLE CHECK: "selesai 1 Desember 2025" means endDate = 2025-12-01, final schedule = 2025-12-01T...
- EXAMPLE CHECK: "dates 10 to 16" means schedules on: 10th, 11th, 12th, 13th, 14th, 15th, 16th (STOP!)
- VALIDATION: If input says "selesai [date]", the last schedule MUST be on that exact date, not the next day!
- DURATION VALIDATION: Match duration to activity type. Cooking/workshops can be 4-6 hours, study sessions 1-2 hours.
- DATE COUNT VALIDATION: If user selects "10 to 16", create exactly 7 schedules ending on day 16!
- MATHEMATICAL PROOF: Calculate days between dates inclusive
  * Example: startDate = day 10, endDate = day 16  
  * Days: 10, 11, 12, 13, 14, 15, 16 = 7 schedules total
  * Formula: (endDate - startDate + 1) = number of schedules
  * VERIFY: Last schedule date must equal endDate exactly!
`.trim();

    const anthropicPayload = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 64000,
      messages: [{ role: "user", content: prompt }],
    };

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(anthropicPayload),
    });

    const responseData = await response.json();
    const raw = responseData.content?.[0]?.text || "{}";
    console.log(raw);

    let json;
    try {
      // Clean the raw response first
      let cleanedResponse = raw.trim();

      // Remove common markdown formatting
      cleanedResponse = cleanedResponse
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .replace(/^[\s\n]*/, "")
        .replace(/[\s\n]*$/, "");

      // Try direct parsing first
      json = JSON.parse(cleanedResponse);
    } catch (err) {
      console.error("Gagal parsing JSON langsung, mencoba ekstraksi...");
      console.log("Parse error:", err);
      console.log("Raw response:", raw);

      try {
        // Try to extract JSON object or array from response
        const jsonMatch = raw.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (jsonMatch && jsonMatch[0]) {
          let cleanJson = jsonMatch[0]
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .replace(/^\s+|\s+$/g, "")
            .trim();

          // Remove any trailing text after the JSON
          const lastBrace = cleanJson.lastIndexOf("}");
          const lastBracket = cleanJson.lastIndexOf("]");
          const lastIndex = Math.max(lastBrace, lastBracket);
          if (lastIndex > 0) {
            cleanJson = cleanJson.substring(0, lastIndex + 1);
          }

          json = JSON.parse(cleanJson);
        } else {
          throw new Error("No valid JSON structure found in response");
        }
      } catch (extractErr) {
        console.error("Gagal mengekstrak JSON:", extractErr);
        console.log("Attempted to parse:", raw);
        return NextResponse.json(
          {
            error: "Respon AI tidak valid. Silakan coba lagi.",
            details: "Respon AI tidak dapat diproses sebagai JSON",
            rawResponse: raw.substring(0, 500) + "...", // Truncate for debugging
          },
          { status: 400 }
        );
      }
    }
    console.log(json);
    console.log(JSON.stringify(json, null, 2));

    return NextResponse.json(json);
  } catch (error) {
    console.error("AI Goal Planner Error:", error);
    return NextResponse.json(
      { error: "Error server internal" },
      { status: 500 }
    );
  }
}
