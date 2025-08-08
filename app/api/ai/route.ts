import { prisma } from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await requireUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      console.error("Failed to parse suggestions JSON:", parseErr);
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
        console.error("Failed to extract suggestions array:", extractErr);
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
    console.error("Failed to fetch suggestions:", error);
    return NextResponse.json(
      { error: "Failed to parse Claude response" },
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
        { error: "Missing initialValue" },
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

    // Calculate duration to determine schedule generation strategy
    const daysDuration = startDate && endDate ? 
      Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    // Always use DAILY strategy for per-day schedules
    const maxSchedules = Math.min(daysDuration, 90); // Max 90 days of daily schedules

    const prompt = `
CRITICAL: You must respond with ONLY valid JSON. No explanations, no markdown, no extra text.
Output all text content (titles, descriptions, messages) in INDONESIAN language but keep JSON keys in English.

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
Duration: ${daysDuration} days
Schedule Strategy: DAILY (per-day schedules)

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
2. If data completeness is "COMPLETE": Generate full goal with schedules
3. If data completeness is "INCOMPLETE": Return basic structure with extracted info
4. For schedules:
   - Always create DAILY schedules (one per day)
   - Maximum ${maxSchedules} schedules
   - Each schedule should be 1-2 hours
   - Use consistent time slots (e.g., always 09:00-10:00) for better routine
   - If user has preferences.availability, use that time slot
5. Avoid overlapping with ANY existing user schedules
6. MUST respect user availability preferences
7. Maintain the SAME time slot for all schedules in this goal for consistency 

DATE EXTRACTION EXAMPLES:
ENGLISH:
- "Learn Python from December 1 to December 31" → startDate: "2024-12-01T00:00:00.000Z", endDate: "2024-12-31T23:59:59.999Z"
- "Start workout routine tomorrow" → startDate: tomorrow's date, endDate: null
- "Read 5 books this month" → startDate: first of current month, endDate: last of current month
- "Practice piano for 2 weeks" → startDate: today, endDate: 14 days from today

INDONESIAN (CRITICAL - MUST EXTRACT):
- "Membaca novel dengan target 300 halaman dalam waktu 2 minggu" → startDate: today, endDate: 14 days from today
- "Belajar coding selama 1 bulan" → startDate: today, endDate: 30 days from today
- "Latihan fitness dalam 30 hari" → startDate: today, endDate: 30 days from today
- "Menyelesaikan project dalam 2 minggu" → startDate: today, endDate: 14 days from today

RESPONSE FORMAT - Choose ONE:

Option 1 (Incomplete data - ALWAYS include extracted dates if duration mentioned):
{
  "title": "extracted or provided title",
  "description": "extracted or provided description", 
  "startDate": "extracted date in ISO format (MUST extract if duration like '2 minggu' mentioned)",
  "endDate": "extracted date in ISO format (MUST calculate from duration)"
}

Option 2 (Complete data - generate full goal):
{
  "dataGoals": {
    "title": "${title || "Goal title"}",
    "description": "${
      description || "Goal description"
    }", //generate more detail description
    "startDate": "${startDate}",
    "endDate": "${endDate}",
    "emoji": "🎯",
    "schedules": [
      {
        "title": "Hari 1: Pengenalan",
        "description": "Aktivitas harian dan tujuan yang terperinci",
        "startedTime": "2024-01-01T09:00:00+07:00",
        "endTime": "2024-01-01T10:00:00+07:00",
        "emoji": "📅",
        "percentComplete": 10
      },
      {
        "title": "Hari 2: Pembelajaran",
        "description": "Memperdalam pemahaman",
        "startedTime": "2024-01-02T09:00:00+07:00",
        "endTime": "2024-01-02T10:00:00+07:00",
        "emoji": "📚",
        "percentComplete": 20
      }
      // ... more schedules with progressive percentages (30, 40, 50, etc.)
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
- Always create one schedule for EVERY SINGLE DAY (no gaps)
- Use CONSISTENT time slots across all schedules (e.g., if first is 09:00-10:00, all should be 09:00-10:00)
- If time conflicts with existing schedules, shift to next available hour but keep consistency
- Include weekends with lighter/review activities if needed
- Limit to ${maxSchedules} schedules maximum to avoid token limits
- Ensure valid JSON with no trailing commas
- Schedules should be practical and achievable
- CRITICAL: percentComplete must be PROGRESSIVE and DIFFERENT for each schedule
- Calculate: percentComplete = Math.round((scheduleIndex + 1) / totalSchedules * 100)
- Example for 5 schedules: 20%, 40%, 60%, 80%, 100%
- The LAST schedule must ALWAYS be exactly 100%
- If user provides dates in initial input, extract them even for incomplete goals
- Respect user preferences for availability if provided
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
      console.error("Failed direct JSON parse, attempting extraction...");
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
        console.error("Failed to extract JSON:", extractErr);
        console.log("Attempted to parse:", raw);
        return NextResponse.json(
          {
            error: "AI response was not valid JSON. Please try again.",
            details: "The AI response could not be parsed as JSON",
            rawResponse: raw.substring(0, 500) + "...", // Truncate for debugging
          },
          { status: 400 }
        );
      }
    }
    console.log(json);

    return NextResponse.json(json);
  } catch (error) {
    console.error("AI Goal Planner Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
