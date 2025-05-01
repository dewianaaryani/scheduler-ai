import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const reqData = await request.json();
  const { initialValue } = reqData;

  if (!initialValue) {
    return new Response("Missing initialValue", { status: 400 });
  }

  const prompt = `
    You are helping a user plan a goal. The user provided this initial input:

    "{initialValue}"

    Your job is to extract four fields from it:
    1. title (short)
    2. description (at least 30 characters)
    3. startDate
    4. endDate

    Respond with a JSON object like this:
    {
    "title": "...",
    "description": "...",
    "startDate": "...",
    "endDate": "..."
    }

    If any field cannot be reliably extracted, return only the known fields.

    DO NOT ask the user anything yet. Just try your best to extract what you can.`;
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
    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to fetch suggestions:", error);
    return NextResponse.json(
      { error: "Failed to parse Claude response" },
      { status: 500 }
    );
  }
}
