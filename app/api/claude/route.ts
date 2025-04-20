import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const {
      input,
      title,
      description,
      startDate,
      endDate,
      recurrence,
      currentFocus,
      selectedDays,
      selectedDates,
    } = await req.json();
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
    console.log("updatedEndDate", updatedEndDate);

    if (endDate) {
      const dateObj = new Date(endDate);
      const endYear = dateObj.getFullYear();

      if (endYear < currentYear) {
        dateObj.setFullYear(currentYear);
        updatedEndDate = dateObj.toISOString().split("T")[0];
      }
    }

    // Check if we need to expand the description from the title
    let needsDescriptionExpansion = false;
    if (title && (!description || description.length < 30)) {
      needsDescriptionExpansion = true;
    }

    // Calculate time difference for recurrence customization
    let showCustomizationOptions = false;
    let recurrenceType = "";

    if (updatedStartDate && updatedEndDate && recurrence) {
      const start = new Date(updatedStartDate);
      const end = new Date(updatedEndDate);
      const timeDiff = end.getTime() - start.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (recurrence === "WEEKLY" && dayDiff >= 14) {
        showCustomizationOptions = true;
        recurrenceType = "weekly";
      } else if (recurrence === "MONTHLY" && dayDiff >= 60) {
        showCustomizationOptions = true;
        recurrenceType = "monthly";
      }
    }

    const prompt = ` 
    Today is ${new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
You're helping a user build a goal plan. Here's the data we have so far:

- Goal Title: ${title || "(not provided)"}
- Description: ${description || "(not provided)"}
- Start Date: ${updatedStartDate || "(not provided)"}
- End Date: ${updatedEndDate || "(not provided)"}
- Recurrence: ${recurrence || "(not provided)"}
${
  selectedDays && selectedDays.length > 0
    ? `- Selected Days: ${selectedDays.join(", ")}`
    : ""
}
${
  selectedDates && selectedDates.length > 0
    ? `- Selected Dates: ${selectedDates.join(", ")}`
    : ""
}

Currently focusing on: ${currentFocus || "initial input"}
The user just said: "${input}"

Please:
1. Try to extract any new values the user may have provided, focusing primarily on ${
      currentFocus || "any missing information"
    }.
2. If the user is specifically being asked about ${currentFocus}, prioritize extracting that information.
${
  needsDescriptionExpansion
    ? `3. If there's a title but no description or the description is less than 30 characters, please create a detailed description based on the title. The description must be at least 30 characters long and expand meaningfully on the title.`
    : ""
}
${
  needsDescriptionExpansion ? "4" : "3"
}. If all information is complete (title, description, startDate, endDate, recurrence), return a JSON with a "steps" key that outlines a plan for the goal:
[
  { "title": "Step Title", "description": "What to do", "timeline": "date" }
]
  If any of these values are missing, do NOT return "steps". Instead, use "followUp" to kindly ask the user for the missing information.

${
  showCustomizationOptions
    ? `5. Since the user selected ${recurrenceType} recurrence with a longer time period, include a field called "needsCustomization" set to true and "customizationType" set to "${recurrenceType}" in your response.`
    : ""
}

${
  needsDescriptionExpansion
    ? showCustomizationOptions
      ? "6"
      : "5"
    : showCustomizationOptions
    ? "5"
    : "4"
}. Always respond in this JSON structure:
{
  "newData": {
    "title": "...",
    "description": "...",
    "startDate": "...",
    "endDate": "...",
    "recurrence": "DAILY | WEEKLY | MONTHLY"
  },
  "followUp": "If something is missing, ask the user with kind and excited tone about what's needed next",
  "steps": [ ... ],
  ${
    showCustomizationOptions
      ? `"needsCustomization": true,
  "customizationType": "${recurrenceType}",`
      : ""
  }
  "requiresSelectedDays": ${recurrence === "WEEKLY" ? "true" : "false"},
  "requiresSelectedDates": ${recurrence === "MONTHLY" ? "true" : "false"}
}

⚠️ IMPORTANT: 
- Respond with **only valid JSON** — no commentary or extra text.
- Make sure the description is expanded from the title and is AT LEAST 30 characters long.
- Ask sequnces of questions to the user to get more information.
- Always ask start date and end date.
- If recurrence is WEEKLY with a period > 2 weeks, add "requiresSelectedDays": true to the response
- If recurrence is MONTHLY with a period > 2 months, add "requiresSelectedDates": true to the response
`;

    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 64000,
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

      // Additional validation for description length
      if (
        parsed.newData &&
        parsed.newData.description &&
        parsed.newData.description.length < 30
      ) {
        // If Claude somehow returned a description that's still too short, expand it
        parsed.newData.description =
          `${parsed.newData.description} - This goal requires consistent effort and planning to achieve the desired outcome.`.substring(
            0,
            200
          );
      }

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
