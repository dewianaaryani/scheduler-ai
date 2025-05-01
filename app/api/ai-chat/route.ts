import { prisma } from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
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
You are a productivity assistant. Based on the user's previous goals, suggest 4 new goal ideas with matching emojis. Respond in the following format as valid JSON:

[
  { "emoji": "🧠", "title": "..." },
  { "emoji": "🗓️", "title": "..." },
  ...
]

Here are the user's past goals:
${historyText}

Return only the JSON array, no explanations.
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
    const content = json.content?.[0]?.text ?? "[]";

    const suggestions = JSON.parse(content);
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
    const existingSchedule = await prisma.schedule.findMany({
      where: {
        userId: session.id,
      },
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

    const prompt = `
Today is ${today}.

You are an assistant helping users create schedule to achieve a goal. A goal includes:
- title (short summary)
- description (minimum 30 characters, generated from title if possible)
- startDate (in ISO format)
- endDate (in ISO format)

The user said: "${initialValue}"

Current values:
- title: ${title || "❌ not provided"}
- description: ${description || "❌ not provided"}
- startDate: ${startDate || "❌ not provided"}
- endDate: ${endDate || "❌ not provided"}

Goal history:
${goalHistory || "No previous goals."}

Preferences:
${JSON.stringify(userPreferences || {})}

---

Your task:
- Must extract the title from ${initialValue} for defining the goal.
- If title is found and description is missing or short (<30 chars), generate a suitable one for description based on the title and initialValue.
- If the title or initialValue lacks enough context to understand the goal, do NOT generate a generic description. Instead, leave description as null so the user can clarify.
- If the user provided a description, expand and enhance it into a clear and informative summary of the goal (minimum 30 characters, max 500).
- Extract startDate and endDate ONLY if a clear and specific date or time range is mentioned by the user (e.g., "from May 1 to May 15", "starting next Monday").
- DO NOT assume or generate any default dates.
- Ignore vague or generic time expressions like "soon", "in a while", or "eventually".
- If a relative date like "tomorrow", "next week", or "next Monday" is used, you may convert that to an ISO date — but only if it's unambiguous.
- If no date or range is mentioned, leave startDate and endDate as null.


---

🎯 Return one of the following JSON values:

1. If any required fields are missing or incomplete, return:
{
  "title": null, // if not found
  "description": null, // if missing or <30 chars
  "startDate": null, // if not found or unclear 
  "endDate": null // if not found or unclear
}

2. If everything is present and valid, return:
{
  "dataGoals": {
    "title": "...", //no more than 100 characters
    "description": "...", //no more than 500 characters
    "startDate": "...",
    "endDate": "...",
    "emoji": "...", //1 emoji for define the goal
    "schedules": [
      {
        "title": "...", //title of the schedule, no more than 100 characters
        "description": "...", //description of the schedule, no more than 500 characters
        "startedTime": "...", //time when the schedule started, datetime format
        "endTime": "...", //time when the schedule ended, datetime format
        "emoji": "...", //1 emoji for define the schedule
        "percentComplete": "..." //percentage of overall goal progress represented by this schedule (e.g., divide 100 by total schedule count, so if 10 total: use 10%, 20%, ..., 100%)
      }
    ]
  },
  "message": "Goal plan created successfully",
  "error": null
}

Schedules:
- Should span daily from startDate to endDate (1 per day).
- The time period between startedTime and endTime is usually 1 hour but adjust it according to the activity
 When creating a schedules, strictly avoid the following times based on the ${existingSchedule}:
  - Do NOT schedule anything during sleep time
  - Do NOT schedule anything during working hours when working days
  - DO NOT create a schedule that overlaps with existing schedules

❗ Do NOT assume or invent values.
❗ Do NOT include any explanation.
❗ Do not include any markdown formatting.
Make sure the JSON is valid, properly formatted, and contains all required fields.
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
      // First try direct parsing
      json = JSON.parse(raw.trim());
    } catch (err) {
      console.error("Failed direct JSON parse, attempting extraction...");
      console.log(err);

      try {
        // Try to extract JSON object from response
        const jsonMatch = raw.match(/(\{[\s\S]*\})/);
        if (jsonMatch && jsonMatch[0]) {
          // Clean potential markdown or backticks
          const cleanJson = jsonMatch[0]
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
          json = JSON.parse(cleanJson);
        } else {
          throw new Error("Couldn't extract valid JSON from response");
        }
      } catch (extractErr) {
        console.error("Failed to extract JSON:", extractErr);
        return NextResponse.json(
          {
            error: "AI response was not valid JSON",
            rawResponse: raw,
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
