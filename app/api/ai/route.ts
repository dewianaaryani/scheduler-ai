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

    // Validate date range if dates are provided - KILL operation on any validation error
    if (startDate || endDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      // Check if start date is at least tomorrow
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

      // Check if end date is at least tomorrow
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

      // If both dates exist, validate that end date is within 4 months of start date
      if (start && end) {
        const fourMonthsFromStart = new Date(start);
        fourMonthsFromStart.setMonth(fourMonthsFromStart.getMonth() + 4);
        fourMonthsFromStart.setHours(23, 59, 59, 999);

        if (end > fourMonthsFromStart) {
          return NextResponse.json(
            {
              error:
                "Tanggal selesai tidak boleh lebih dari 4 bulan dari tanggal mulai",
              message: "Tanggal tidak valid",
              dataGoals: null,
            },
            { status: 400 }
          );
        }

        // Check if end date is before start date
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
    const today = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const goalHistory = userGoals
      .map((g, i) => `Goal ${i + 1}: ${g.title} - ${g.description}`)
      .join("\n");

    // Check if we have complete goal data regardless of how it was initially entered
    const hasCompleteData = title && description && startDate && endDate;

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
CRITICAL: Respond with ONLY valid JSON. No explanations, no markdown, no extra text.
Output all text content (titles, descriptions, messages) in INDONESIAN language but keep JSON keys in English.

🚨 ABSOLUTE REQUIREMENTS:
- Final schedule MUST be on endDate when generating schedules
- Use T00:00:00.000Z for dates to prevent timezone issues
- ONE schedule per day, NO GAPS, NO SKIPPED DAYS
- MUST include EVERY calendar date from start to end (no skipping any date)

⚠️ CRITICAL DATE VALIDATION:
- Generate schedules for EVERY CONSECUTIVE day
- Example: Aug 27 (Wed) → Aug 28 (Thu) → Aug 29 (Fri) 
- NEVER skip any date (weekdays OR weekends)
- If startDate to endDate = 92 days, MUST have exactly 92 schedules
- Each schedule date = previous date + 1 day (no jumps)
- Verify: Count calendar days and count schedules MUST match

🚨 DATE RANGE REQUIREMENTS:
- Start date MUST be in the future (minimum tomorrow)
- End date MUST be after start date
- End date MUST NOT exceed 4 months from START DATE (not from today)
- If dates are outside valid range, return error message immediately

Today is ${today}.
User input: "${initialValue}"

Current data:
- title: ${title || "not provided"}
- description: ${description || "not provided"}  
- startDate: ${startDate || "not provided"}
- endDate: ${endDate || "not provided"}
- Data completeness: ${hasCompleteData ? "COMPLETE" : "INCOMPLETE"}

⚠️ CRITICAL ACTION REQUIRED:
If title="${title}" contains "3 Minggu" AND startDate="${startDate}" is provided:
→ YOU MUST CALCULATE: endDate = startDate + 20 days
→ This gives you all 4 required fields to generate complete schedules
→ DO NOT return incomplete - CALCULATE the endDate NOW!

Goal history: ${goalHistory || "No previous goals."}
User preferences: ${JSON.stringify(userPreferences || {})}
Existing schedules to avoid: [${scheduleConflicts}]

DATE EXTRACTION RULES:
Extract ONLY what is EXPLICITLY mentioned:

START DATE PATTERNS:
- "mulai hari ini/sekarang" → startDate: today + 1 day
- "mulai besok" → startDate: tomorrow  
- "mulai tanggal X" → startDate: specified date
- "starting today/tomorrow" → startDate: today/tomorrow
- "dari tanggal X" → startDate: specified date

END DATE/DURATION PATTERNS:
- "sampai tanggal X" → endDate: specified date
- "hingga/selesai tanggal X" → endDate: specified date
- "selama/dalam X minggu" → duration: X weeks
- "selama/dalam X hari" → duration: X days
- "for X weeks/days" → duration: X weeks/days

COMMON INCOMPLETE SCENARIOS:
1. Only duration, no start:
   "dalam 3 minggu" → Missing startDate
   
2. Only start, no end/duration:
   "mulai besok" → Missing endDate
   
3. Only partial info:
   "belajar piano" → Missing both dates

DATE CALCULATION RULES:
IMPORTANT: If you have startDate AND find duration in the title/description, CALCULATE endDate!
- Start + "1 minggu" → endDate = start + 6 days (7 days total)
- Start + "2 minggu" → endDate = start + 13 days (14 days total)
- Start + "3 minggu" → endDate = start + 20 days (21 days total)
- Start + "4 minggu" → endDate = start + 27 days (28 days total)
- Start + "1 bulan" → endDate = start + 29 days (30 days total)
- Start + "X hari" → endDate = start + (X-1) days (X days total)

CHECK TITLE/DESCRIPTION FOR DURATION:
- Look for "X minggu" in title → calculate endDate from startDate
- Look for "X bulan" in title → calculate endDate from startDate
- Look for "X hari" in title → calculate endDate from startDate

VALIDATE CALCULATED DATES:
- If start date < tomorrow → return error "Tanggal mulai harus minimal besok"
- If end date < start date → return error "Tanggal selesai harus setelah tanggal mulai"
- If end date > start date + 4 months → return error "Tanggal selesai tidak boleh lebih dari 4 bulan dari tanggal mulai"

EXTRACTION EXAMPLES:
✅ COMPLETE: title="Program 3 Minggu", startDate provided
   → Extract "3 minggu" from title, calculate endDate = startDate+20

❌ INCOMPLETE: "Belajar coding selama 3 minggu"
   → duration found but missing startDate

❌ INCOMPLETE: "Belajar coding mulai besok"  
   → startDate: tomorrow, but missing endDate (no duration found)

✅ COMPLETE: "dari 15 Agustus sampai 30 Agustus"
   → startDate: 2025-08-15, endDate: 2025-08-30

❌ INCOMPLETE: "mulai tanggal 15 Agustus"
   → startDate: 2025-08-15, but missing endDate

PROCESSING RULES:
1. Extract all available information from initialValue AND provided data
2. IF startDate exists AND title/description contains duration ("X minggu/bulan/hari"):
   → CALCULATE endDate immediately using the duration
3. Check completeness (need all 4: title, description, startDate, endDate)
4. If COMPLETE: Generate full goal with schedules
5. If INCOMPLETE: Return what was extracted, indicate what's missing

CRITICAL: When you have startDate and see "3 minggu" in title/description, 
CALCULATE endDate = startDate + 20 days immediately!

RESPONSE FORMATS:

Option 1 - INCOMPLETE (missing dates):
{
  "title": "extracted or null",
  "description": "extracted or null",
  "startDate": "extracted date or null",
  "endDate": "extracted/calculated date or null",
  "message": "Informasi belum lengkap",
  "missingInfo": ["list of missing: startDate, endDate, or both"],
  "error": null
}

Option 1b - INVALID DATE RANGE (STOP IMMEDIATELY):
{
  "title": "extracted or null",
  "description": "extracted or null",
  "startDate": "extracted date or null",
  "endDate": "extracted/calculated date or null",
  "message": "Tanggal tidak valid",
  "error": "Specific error message based on validation",
  "dataGoals": null
}

Error messages to use:
- "Tanggal mulai harus minimal besok" (start date in past)
- "Tanggal selesai harus setelah tanggal mulai" (end before start)
- "Tanggal selesai tidak boleh lebih dari 4 bulan dari tanggal mulai" (end > start + 4 months)

Option 2 - COMPLETE (generate full goal):
{
  "dataGoals": {
    "title": "${title}",
    "description": "detailed description here",
    "startDate": "2025-08-11T00:00:00.000Z",
    "endDate": "2025-08-31T00:00:00.000Z",
    "emoji": "🎯",
    "schedules": [
      {
        "title": "Hari 1: [Activity]",
        "description": "[Detailed description]",
        "startedTime": "2025-08-11T09:00:00+07:00",
        "endTime": "2025-08-11T11:00:00+07:00",
        "emoji": "🚀",
        "percentComplete": 5
      },
      // ... one schedule for EACH consecutive day ...
      {
        "title": "Hari X: Penyelesaian",
        "description": "Final evaluation",
        "startedTime": "[endDate]T09:00:00+07:00",
        "endTime": "[endDate]T11:00:00+07:00",
        "emoji": "🎯",
        "percentComplete": 100
      }
    ]
  },
  "message": "Rencana tujuan berhasil dibuat",
  "error": null
}

SCHEDULE GENERATION (only when ALL data complete):
- Count: (endDate - startDate + 1) days = number of schedules
- Create schedule for EVERY consecutive day, no gaps
- percentComplete: Math.round(((index + 1) / total) * 100)
- Time allocation by activity type:
  * Learning/Study: 1-2 hours
  * Physical: 1-1.5 hours
  * Creative: 1.5-3 hours
  * Cooking: 2-4 hours
  * Planning: 30-60 minutes
  * Programming: 2-4 hours
  * Workshop: 3-6 hours

VALIDATION BEFORE RESPONDING:
✓ Only generate schedules if ALL 4 fields present
✓ Schedule count must equal date range
✓ No date gaps between consecutive schedules
✓ First schedule matches startDate
✓ Last schedule matches endDate
✓ Progressive percentComplete reaching 100%

CRITICAL REMINDERS:
- DON'T assume dates not explicitly mentioned
- Missing startDate OR endDate = return incomplete
- Only generate schedules when fully complete
- Every day must have its own schedule (no combining)
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
