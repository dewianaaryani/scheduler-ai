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
        model: "claude-3-haiku-20240307",
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

    // Determine if this is a suggestion selection (emoji + simple title) vs detailed user input
    const isSuggestionSelection = !title && !description && !startDate && !endDate && 
      initialValue.match(/^[🎯🧠📚💪🗓️📝💻🎨🏃‍♂️🧘‍♀️📖🎵🌱✨]\s/);

    const prompt = `
CRITICAL: You must respond with ONLY valid JSON. No explanations, no markdown, no extra text.

Today is ${today}.
User input: "${initialValue}"
Input type: ${isSuggestionSelection ? "SUGGESTION_SELECTION" : "USER_INPUT"}

Current values:
- title: ${title || "not provided"}
- description: ${description || "not provided"}  
- startDate: ${startDate || "not provided"}
- endDate: ${endDate || "not provided"}

Goal history: ${goalHistory || "No previous goals."}
User preferences: ${JSON.stringify(userPreferences || {})}

TASK: Extract goal information.

CRITICAL RULES:
1. If input type is "SUGGESTION_SELECTION": Extract title and description ONLY. Never generate dates.
2. If input type is "USER_INPUT": Extract all available information including dates if explicitly mentioned.
3. Only extract dates if user explicitly mentions specific dates/times (e.g., "from May 1 to May 15", "starting next Monday")
4. Never assume or generate default dates
5. Generate description 30-500 chars if title found

RESPONSE FORMAT - Choose ONE:

Option 1 (Incomplete - missing required info):
{
  "title": "extracted title or null",
  "description": "generated description or null",
  "startDate": null,
  "endDate": null
}

Option 2 (Complete with explicit dates from user):
{
  "dataGoals": {
    "title": "Goal title (max 100 chars)",
    "description": "Goal description (30-500 chars)",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-07T00:00:00.000Z",
    "emoji": "🎯",
    "schedules": [
      {
        "title": "Schedule title (max 100 chars)",
        "description": "Schedule description (max 500 chars)",
        "startedTime": "2024-01-01T09:00:00.000Z",
        "endTime": "2024-01-01T10:00:00.000Z",
        "emoji": "📅",
        "percentComplete": 14
      }
    ]
  },
  "message": "Goal plan created successfully",
  "error": null
}

IMPORTANT:
- For suggestion selections, ALWAYS return Option 1 format with title/description only
- Only use Option 2 when user explicitly provides dates AND all info is complete
- Ensure valid JSON syntax with no trailing commas
`.trim();

    const anthropicPayload = {
      model: "claude-3-7-sonnet-20250219",
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
