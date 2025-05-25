/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();
    const reqData = await request.json();
    const user = await prisma.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        preferences: true,
      },
    });
    const userPreferences = user?.preferences;
    const existingSchedule = await prisma.schedule.findMany({
      where: {
        userId: session.id,
      },
    });

    const {
      currentAnswer = null,
      conversationHistory = [],
      previousResponse = null,
      // Get goal parameters
      title = null,
      description = null,
      startDate = null,
      endDate = null,
    } = reqData;

    // Prepare conversation history
    const modifiedHistory = [...(conversationHistory || [])];

    // If there was a previous response with validation error, modify the last assistant message
    if (
      previousResponse &&
      !previousResponse.isValid &&
      previousResponse.validationError
    ) {
      // Remove the last assistant message (which had the wrong details)
      if (
        modifiedHistory.length >= 2 &&
        modifiedHistory[modifiedHistory.length - 1].role === "assistant"
      ) {
        modifiedHistory.pop();
      }

      // Add current user answer to conversation
      if (currentAnswer) {
        modifiedHistory.push({
          role: "user",
          content: currentAnswer,
        });
      }

      // Add explicit instruction to correct the invalid input
      modifiedHistory.push({
        role: "user",
        content: `My previous answer was invalid. Please explain the validation error: "${previousResponse.validationError}" and ask me to provide valid input.`,
      });
    } else {
      // Normal flow - just add the current answer
      if (currentAnswer) {
        modifiedHistory.push({
          role: "user",
          content: currentAnswer,
        });
      }
    }

    // First prompt to initiate goal setting if no history
    const firstPrompt = `I want to set a goal with the following details:
    title: ${title || ""}
    Description: ${description || ""}
    Start Date: ${startDate || ""}
    End Date: ${endDate || ""}`;

    // System prompt for the goal planning assistant
    const systemPrompt = `
    You are a goal achievement specialist who helps people break down their goals into actionable steps and create schedules to achieve them. You need to ask the following questions in sequence. At the end, return a complete goal plan with steps and schedules.

    Here are the user preferences and existing schedule to consider when creating schedules :
    ${JSON.stringify(userPreferences)},
    ${existingSchedule}

    Questions:

    * What is the title of your goal?
      * Required: true
      * Validations:
        * Must be between 3-50 characters

    * Please describe your goal in detail. No need to be specific, just the main idea.
      * Required: true
      * Validations:
        * Must be between 10-500 characters
        * You will generate a detailed description based on user input

    * When do you want to start working on this goal? (YYYY-MM-DD)
      * Required: true
      * Validations:
        * Must be a valid date in YYYY-MM-DD format
        * User can input tomorrow or next week or any date in the future
        * Start date must not be in the past
        * Today's date is ${new Date().toISOString().split("T")[0]}
        * At the end the returned date should be YYYY-MM-DD

    * When do you want to complete this goal? (YYYY-MM-DD)
      * Required: true
      * Validations:
        * Must be a valid date in YYYY-MM-DD format
        * End date must be after the start date

    After collecting all required information, please:

    1. Break down the goal into 1 step per day. Example: 2025-05-06 09:00 TO 10:00 it depends on the user preferences and the activity average cost per day.
    2. For each step, create a detailed schedule with specific dates and timeframes
    3. Provide estimates of completion percentage for each milestone
    4. Return all the information in a structured format

    Ensure your tone is motivational but practical. Focus on creating realistic schedules that distribute the work appropriately across the available timeframe.
    When creating a schedule, strictly avoid the following times:
  - Do NOT schedule anything during sleep time
  - Do NOT schedule anything during working hours when working days
  - DO NOT create a schedule that overlaps with existing schedules
    For scheduling, consider:
    - Breaking the timeframe into logical phases
    - Identifying key milestone dates
    - Setting regular check-in points to measure progress
    - Balancing workload throughout the timeline
    - Same time of day for each day if its not overlapping with existing schedules

    Provide a summary at the end with the estimated completion date and key milestones.

    IMPORTANT: At the end of your response, you MUST include a JSON section with the following structure. The JSON MUST be delimited by triple backticks and the text "json" like this: \`\`\`json
    {
      "dataGoals": {
        "title": "...",
        "description": "...",
        "startDate": "...",
        "endDate": "...",
        "emoji": "...",
        "steps": [
          {
            "title": "...",
            "description": "...",
            "startedTime": "...", 
            "endTime": "...",
            "emoji": "...", //
            "percentComplete": "..."
          }
        ]
      },
      "message": "Goal plan created successfully",
      "error": null,
      "isLastMessage": true
    }
    \`\`\`

    Make sure the JSON is valid, properly formatted, and contains all required fields.
    `;

    if (modifiedHistory.length === 0) {
      modifiedHistory.push({
        role: "user",
        content: firstPrompt,
      });
    }

    try {
      // Prepare the request payload for Anthropic API
      const anthropicPayload = {
        model: "claude-opus-4-20250514",
        max_tokens: 64000,
        system: systemPrompt,
        messages: modifiedHistory,
      };

      // Call the Anthropic API directly
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY || "",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(anthropicPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Anthropic API error: ${response.status} - ${JSON.stringify(
            errorData
          )}`
        );
      }

      // Parse the response
      const responseData = await response.json();
      const content = responseData.content?.[0]?.text || "";

      // Extract JSON data from the response
      let planData = null;
      let jsonError = null;

      try {
        // Extract JSON from the response
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);

        if (jsonMatch && jsonMatch[1]) {
          const jsonString = jsonMatch[1];
          planData = JSON.parse(jsonString);
        } else {
          jsonError = "No valid JSON found in the response";
        }
      } catch (e) {
        console.error("Error parsing JSON data:", e);
        jsonError = e instanceof Error ? e.message : "JSON parsing error";
      }

      // Add Claude's response to history
      const updatedHistory = [...modifiedHistory];
      updatedHistory.push({
        role: "assistant",
        content: content,
      });

      return NextResponse.json({
        content: content,
        planData: planData,
        jsonError: jsonError,
        history: updatedHistory,
      });
    } catch (error: any) {
      console.error("Processing error:", error);

      // Add more detailed error logging
      if (error.response) {
        console.error("API Response Error:", {
          status: error.response.status,
          headers: error.response.headers,
          data: error.response.data,
        });
      }

      // Log the messages array that caused the error
      console.error("Messages array:", JSON.stringify(modifiedHistory));

      return NextResponse.json(
        {
          error: "Failed to process request",
          message: error instanceof Error ? error.message : "Unknown error",
          details: error.response?.data || null,
          planData: previousResponse?.planData || null,
          conversationHistory: modifiedHistory,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Goal planning error:", error);
    return NextResponse.json(
      {
        error: "Failed to process request",
        message: error instanceof Error ? error.message : "Unknown error",
        planData: null,
      },
      { status: 500 }
    );
  }
}
