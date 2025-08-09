// app/lib/goal-service.ts
import { AIResponse, Suggestion, GoalFormData } from "./types";

export async function fetchSuggestions(): Promise<Suggestion[]> {
  const res = await fetch("/api/ai");

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch suggestions");
  }

  return await res.json();
}

export async function processGoalData(
  data: Partial<GoalFormData>
): Promise<AIResponse> {
  // Format dates to start of day to avoid timezone issues
  const formatDateToStartOfDay = (date: Date | undefined | null) => {
    if (!date) return null;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  };

  const payload = {
    initialValue: data.initialValue || "",
    title: data.title || null,
    description: data.description || null,
    startDate: formatDateToStartOfDay(data.startDate),
    endDate: formatDateToStartOfDay(data.endDate),
  };

  const response = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to get AI response");
  }

  return await response.json();
}
