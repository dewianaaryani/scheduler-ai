import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { input, title, description, startDate, endDate, recurrence } =
      await req.json();
    const currentYear = new Date().getFullYear();

    // Update startDate to current year if it's in the past
    let updatedStartDate = startDate;
    if (startDate) {
      const dateObj = new Date(startDate);
      const startYear = dateObj.getFullYear();

      if (startYear < currentYear) {
        // Update the year while keeping month and day
        dateObj.setFullYear(currentYear);
        updatedStartDate = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD format
      }
    }

    // Do the same for endDate
    let updatedEndDate = endDate;
    if (endDate) {
      const dateObj = new Date(endDate);
      const endYear = dateObj.getFullYear();

      if (endYear < currentYear) {
        dateObj.setFullYear(currentYear);
        updatedEndDate = dateObj.toISOString().split("T")[0];
      }
    }
    const prompt = ` 
You're helping a user build a goal plan. Here's the data we have so far:

- Goal Title: ${title || "(not provided)"}
- Description: ${description || "(not provided)"}
- Start Date: ${updatedStartDate || "(not provided)"}
- End Date: ${updatedEndDate || "(not provided)"}
- Recurrence: ${recurrence || "(not provided)"}

The user just said: "${input}"

Please:
1. Try to extract any new values the user may have provided.
2. Return missing information questions if needed (like recurrence).
3. If all information is complete, return a JSON with a "steps" key:
[
  { "title": "Step Title", "description": "What to do", "timeline": "date" }
]
4. Always respond in this JSON structure:
{
  "newData": {
    "title": "...",
    "description": "...",
    "startDate": "...",
    "endDate": "...",
    "recurrence": "NONE | DAILY | WEEKLY | MONTHLY"
  },
  "followUp": "If something is missing, ask the user with kind and excited tone",
  "steps": [ ... ] // only when all data is filled
}

⚠️ IMPORTANT: Respond with **only valid JSON** — no commentary or extra text.
`;

    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-haiku-20240307",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
        },
      }
    );

    let content = response.data?.content?.[0]?.text || "{}";

    // ⚠️ Sanitize: remove markdown code block if any
    content = content.trim();
    if (content.startsWith("```json") || content.startsWith("```")) {
      content = content.replace(/```json|```/g, "").trim();
    }

    // 🧠 Safe JSON parsing
    const firstBraceIndex = content.indexOf("{");
    if (firstBraceIndex !== -1) {
      const jsonOnly = content.slice(firstBraceIndex);
      const parsed = JSON.parse(jsonOnly);
      return NextResponse.json(parsed);
    } else {
      throw new Error("No JSON found in Claude's response");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Claude API Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Claude API request failed", details: error.response?.data },
      { status: 500 }
    );
  }
}
