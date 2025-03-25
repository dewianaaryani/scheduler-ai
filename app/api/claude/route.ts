import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("Missing Anthropic API key");
    }

    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-haiku-20240307",
        // ✅ Use a valid model
        max_tokens: 200,
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

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Claude API Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Claude API request failed", details: error.response?.data },
      { status: 500 }
    );
  }
}
