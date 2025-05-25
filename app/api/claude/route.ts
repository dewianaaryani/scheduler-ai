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

    // Calculate time difference for recurrence options
    const availableRecurrenceOptions = ["DAILY"];
    let showCustomizationOptions = false;
    let recurrenceType = "";

    if (updatedStartDate && updatedEndDate) {
      const start = new Date(updatedStartDate);
      const end = new Date(updatedEndDate);
      const timeDiff = end.getTime() - start.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      // Set available recurrence options based on time period
      if (dayDiff >= 14) {
        availableRecurrenceOptions.push("WEEKLY");

        if (recurrence === "WEEKLY") {
          showCustomizationOptions = true;
          recurrenceType = "weekly";
        }
      }

      if (dayDiff >= 60) {
        // ~ 2 months
        availableRecurrenceOptions.push("MONTHLY");

        if (recurrence === "MONTHLY") {
          showCustomizationOptions = true;
          recurrenceType = "monthly";
        }
      }
    }

    // Determine if we are handling day/date selection
    const isHandlingDaySelection =
      currentFocus === "selectedDays" &&
      selectedDays &&
      selectedDays.length > 0;
    const isHandlingDateSelection =
      currentFocus === "selectedDates" &&
      selectedDates &&
      selectedDates.length > 0;

    // Check if we have all required data and can generate steps directly
    const hasAllRequiredData =
      title &&
      description &&
      description.length >= 30 &&
      updatedStartDate &&
      updatedEndDate &&
      recurrence;

    // Also check if we have necessary day/date selections based on recurrence type
    const hasNecessarySelections =
      (recurrence !== "WEEKLY" || selectedDays?.length > 0) &&
      (recurrence !== "MONTHLY" || selectedDates?.length > 0);

    // If we have all the data and necessary selections, we can generate steps automatically
    // or if we're handling a specific selection and have all other required data
    if (
      (hasAllRequiredData && hasNecessarySelections) ||
      ((isHandlingDaySelection || isHandlingDateSelection) &&
        hasAllRequiredData)
    ) {
      // We have all required data and the user has submitted their day/date selections
      // Prepare data for plan generation

      // Format selected days for display
      const daysInfo =
        selectedDays && selectedDays.length > 0
          ? `You'll work on this goal on these days: ${selectedDays.join(
              ", "
            )}.`
          : "";

      // Format selected dates for display with proper ordinal suffixes
      const datesInfo =
        selectedDates && selectedDates.length > 0
          ? `You'll work on this goal on the ${(selectedDates as number[])
              .sort((a: number, b: number) => a - b)
              .map(
                (d: number) =>
                  d + (d === 1 ? "st" : d === 2 ? "nd" : d === 3 ? "rd" : "th")
              )
              .join(", ")} of each month.`
          : "";

      // Generate steps based on all the information we have
      const start = new Date(updatedStartDate);
      const end = new Date(updatedEndDate);

      const steps = [
        {
          title: "Get Started",
          description: "Begin working on your goal according to your schedule.",
          timeline: `Starting ${start.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}`,
        },
        {
          title: "Ongoing Progress",
          description: `Maintain your ${recurrence.toLowerCase()} rhythm${
            selectedDays?.length > 0 ? ` on ${selectedDays.join(", ")}` : ""
          }${
            selectedDates?.length > 0 ? ` on selected dates each month` : ""
          }.`,
          timeline: "Throughout your goal period",
        },
        {
          title: "Complete Your Goal",
          description: "Finalize all tasks and evaluate your progress.",
          timeline: `By ${end.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}`,
        },
      ];

      // Construct our response
      return NextResponse.json({
        newData: {
          title,
          description,
          startDate: updatedStartDate,
          endDate: updatedEndDate,
          recurrence,
        },
        followUp: `Great! Your goal plan for "${title}" is ready. ${daysInfo} ${datesInfo} Let me know if you'd like to modify anything about your plan.`,
        steps,
        requiresSelectedDays: false,
        requiresSelectedDates: false,
      });
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
- Available Recurrence Options: ${availableRecurrenceOptions.join(", ")}
${
  selectedDays && selectedDays.length > 0
    ? `- Selected Days: ${selectedDays.join(", ")}`
    : ""
}
${
  selectedDates && selectedDates.length > 0
    ? `- Selected Dates: ${(selectedDates as number[])
        .sort((a: number, b: number) => a - b)
        .map(
          (d: number) =>
            d + (d === 1 ? "st" : d === 2 ? "nd" : d === 3 ? "rd" : "th")
        )
        .join(", ")}`
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
}. If all information is complete (title, description, startDate, endDate, recurrence, and any required selectedDays/selectedDates), return a JSON with a "steps" key that outlines a plan for the goal:
[
  { "title": "Step Title", "description": "What to do", "timeline": "date" }
]
  If any of these values are missing, do NOT return "steps". Instead, use "followUp" to kindly ask the user for the missing information.

${
  showCustomizationOptions &&
  !(selectedDays?.length > 0 || selectedDates?.length > 0)
    ? `5. Since the user selected ${recurrenceType} recurrence with a longer time period, include a field called "needsCustomization" set to true and "customizationType" set to "${recurrenceType}" in your response.`
    : ""
}

IMPORTANT: If recurrence is already set to "${recurrence}" and this is not an empty value, do NOT ask about recurrence again in your response.
${
  selectedDays && selectedDays.length > 0
    ? "IMPORTANT: The user has already selected the following days for weekly recurrence: " +
      selectedDays.join(", ") +
      ". Do NOT ask about days again."
    : ""
}
${
  selectedDates && selectedDates.length > 0
    ? "IMPORTANT: The user has already selected dates for monthly recurrence. Do NOT ask about dates again."
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
    "availableRecurrenceOptions": ${JSON.stringify(availableRecurrenceOptions)},
  },
  "followUp": "If something is missing, ask the user with kind and excited tone about what's needed next",
  "steps": [ ... ],
  ${
    showCustomizationOptions &&
    !(selectedDays?.length > 0 || selectedDates?.length > 0)
      ? `"needsCustomization": true,
  "customizationType": "${recurrenceType}",`
      : ""
  }
  "requiresSelectedDays": ${
    recurrence === "WEEKLY" && !(selectedDays?.length > 0) ? "true" : "false"
  },
  "requiresSelectedDates": ${
    recurrence === "MONTHLY" && !(selectedDates?.length > 0) ? "true" : "false"
  }
}

⚠️ IMPORTANT: 
- Respond with **only valid JSON** — no commentary or extra text.
- Make sure the description is expanded from the title and is AT LEAST 30 characters long.
- Ask sequences of questions to the user to get more information.
- Always ask start date and end date, but if they're already provided, don't ask again.
- If recurrence is already provided, don't ask for it again.
- If recurrence is WEEKLY with a period > 2 weeks, add "requiresSelectedDays": true to the response
- If recurrence is MONTHLY with a period > 2 months, add "requiresSelectedDates": true to the response
- If selectedDays or selectedDates is already provided, incorporate them into your response and steps.
`;

    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-opus-4-20250514",
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
