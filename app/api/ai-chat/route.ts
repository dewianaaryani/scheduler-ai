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
You are a productivity assistant. Based on the user's previous goals, suggest 4 new goal ideas.

Here are the user's past goals:
${historyText}

CRITICAL: You must respond with ONLY a valid JSON array. No explanations, no markdown, no extra text.

Required format:
[
  { "emoji": "🧠", "title": "Learn a new skill" },
  { "emoji": "🗓️", "title": "Organize daily routine" },
  { "emoji": "💪", "title": "Start fitness routine" },
  { "emoji": "📚", "title": "Read more books" }
]

Rules:
- Return exactly 4 suggestions
- Each suggestion must have "emoji" and "title" fields
- Title must be 5-50 characters
- Use single relevant emoji
- JSON must be valid and parseable
- No text before or after the JSON array
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
      const cleanedResponse = raw.trim()
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
            { "emoji": "🎯", "title": "Set a new goal" },
            { "emoji": "📚", "title": "Learn something new" },
            { "emoji": "💪", "title": "Start a healthy habit" },
            { "emoji": "🗓️", "title": "Organize daily routine" }
          ];
        }
      } catch (extractErr) {
        console.error("Failed to extract suggestions array:", extractErr);
        // Return fallback suggestions
        suggestions = [
          { "emoji": "🎯", "title": "Set a new goal" },
          { "emoji": "📚", "title": "Learn something new" },
          { "emoji": "💪", "title": "Start a healthy habit" },
          { "emoji": "🗓️", "title": "Organize daily routine" }
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
    const today = new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const goalHistory = userGoals
      .map((g, i) => `Goal ${i + 1}: ${g.title} - ${g.description}`)
      .join("\n");

    // Check if we have complete goal data regardless of how it was initially entered
    const hasCompleteData = title && description && startDate && endDate;
    const isInitialSuggestionOnly = !title && !description && !startDate && !endDate && 
      initialValue.match(/^[🎯🧠📚💪🗓️📝💻🎨🏃‍♂️🧘‍♀️📖🎵🌱✨]\s/);

    // Get existing schedules for conflict avoidance
    const existingSchedules = await prisma.schedule.findMany({ 
      where: { userId: session.id }, 
      select: { startedTime: true, endTime: true } 
    });
    const scheduleConflicts = existingSchedules.map(s => 
      `{start: "${s.startedTime}", end: "${s.endTime}"}`
    ).join(', ');

    const prompt = `
CRITICAL: You must respond with ONLY valid JSON. No explanations, no markdown, no extra text.

Today is ${today}.
User input: "${initialValue}"

Current data:
- title: ${title || "not provided"}
- description: ${description || "not provided"}  
- startDate: ${startDate || "not provided"}
- endDate: ${endDate || "not provided"}

Data completeness: ${hasCompleteData ? "COMPLETE" : "INCOMPLETE"}
Initial input type: ${isInitialSuggestionOnly ? "SUGGESTION_SELECTION" : "USER_INPUT"}

Goal history: ${goalHistory || "No previous goals."}
User preferences: ${JSON.stringify(userPreferences || {})}
Existing schedules to avoid: [${scheduleConflicts}]

TASK: Process goal information and generate schedules if complete.

PROCESSING RULES:
1. ALWAYS extract dates from initial user input if explicitly mentioned:
   - "from January 1 to January 31" → extract both dates
   - "starting tomorrow" → extract start date
   - "for 2 weeks starting Monday" → calculate start and end dates
   - "next month" → calculate month start/end dates
   - "this weekend" → calculate weekend dates
2. If data completeness is "COMPLETE": Generate full goal with daily schedules  
3. If data completeness is "INCOMPLETE": Return basic structure with extracted info
4. For schedules: Create daily 1-hour sessions from start to end date
5. Avoid overlapping with existing user schedules
6. Respect user sleep/work hours from preferences

DATE EXTRACTION EXAMPLES:
- "Learn Python from December 1 to December 31" → startDate: "2024-12-01T00:00:00.000Z", endDate: "2024-12-31T23:59:59.999Z"
- "Start workout routine tomorrow" → startDate: tomorrow's date, endDate: null
- "Read 5 books this month" → startDate: first of current month, endDate: last of current month

RESPONSE FORMAT - Choose ONE:

Option 1 (Incomplete data):
{
  "title": "extracted or provided title",
  "description": "extracted or provided description", 
  "startDate": "extracted date in ISO format or null",
  "endDate": "extracted date in ISO format or null"
}

Option 2 (Complete data - generate full goal):
{
  "dataGoals": {
    "title": "${title || 'Goal title'}",
    "description": "${description || 'Goal description'}",
    "startDate": "${startDate}",
    "endDate": "${endDate}",
    "emoji": "🎯",
    "schedules": [
      {
        "title": "Daily session for [goal]",
        "description": "Work on [specific activity]",
        "startedTime": "2024-01-01T09:00:00.000Z",
        "endTime": "2024-01-01T10:00:00.000Z", 
        "emoji": "📅",
        "percentComplete": 20
      }
    ]
  },
  "message": "Goal plan created successfully",
  "error": null
}

CRITICAL:
- Use Option 2 ONLY when data completeness is "COMPLETE" (all 4 fields: title, description, startDate, endDate are available)
- Use Option 1 when any field is missing, but include extracted dates if found in user input
- Create one schedule per day between start and end dates  
- Ensure valid JSON with no trailing commas
- Schedules should be practical and achievable
- If user provides dates in initial input, extract them even for incomplete goals
`.trim();

    const anthropicPayload = {
      model: "claude-opus-4-20250514",
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
          const lastBrace = cleanJson.lastIndexOf('}');
          const lastBracket = cleanJson.lastIndexOf(']');
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
