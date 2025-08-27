import {
  ValidateGoalRequest,
  ValidateGoalResponse,
  GenerateSchedulesRequest,
  GenerateSchedulesResponse,
  SaveGoalRequest,
  SaveGoalResponse,
  ScheduleItem,
} from "./types/goal-api";

export interface GoalCreationCallbacks {
  onValidationStart?: () => void;
  onValidationComplete?: (result: ValidateGoalResponse) => void;
  onScheduleGenerationStart?: () => void;
  onScheduleGenerationProgress?: (message: string, progress: number) => void;
  onScheduleReceived?: (schedule: ScheduleItem, currentCount: number) => void; // New callback for streaming schedules
  onScheduleGenerationComplete?: (schedules: ScheduleItem[]) => void;
  onSaveStart?: () => void;
  onSaveComplete?: (goal: SaveGoalResponse) => void;
  onError?: (error: string, step: 'validation' | 'generation' | 'save') => void;
  skipAutoSave?: boolean; // Add flag to skip auto-save after schedule generation
}

// Step 1: Validate Goal
export async function validateGoal(
  request: ValidateGoalRequest
): Promise<ValidateGoalResponse> {
  try {
    const response = await fetch("/api/ai/validate-goal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Validation failed" }));
      throw new Error(error.error || "Validation failed");
    }

    const data = await response.json();
    
    // Ensure we have a valid response
    if (!data.status) {
      console.error("Invalid validation response:", data);
      throw new Error("Invalid validation response format");
    }

    return data;
  } catch (error) {
    console.error("Validation error:", error);
    // Return a fallback response for network errors
    return {
      status: 'incomplete',
      title: null,
      description: null,
      startDate: null,
      endDate: null,
      emoji: '❓',
      message: 'Terjadi kesalahan koneksi. Silakan coba lagi.',
      validationErrors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

// Step 2: Generate Schedules (with streaming)
export async function generateSchedules(
  request: GenerateSchedulesRequest,
  onProgress?: (message: string, progress: number) => void,
  onScheduleReceived?: (schedule: ScheduleItem, currentCount: number) => void
): Promise<GenerateSchedulesResponse> {
  const response = await fetch("/api/ai/generate-schedules", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Schedule generation failed");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const decoder = new TextDecoder();
  let buffer = "";
  const collectedSchedules: ScheduleItem[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") continue;

        try {
          const parsed = JSON.parse(data);

          if (parsed.type === "progress" && onProgress) {
            onProgress(parsed.message, parsed.progress);
          } else if (parsed.type === "schedule") {
            // New: handle individual schedule streaming
            if (parsed.schedule) {
              collectedSchedules.push(parsed.schedule);
              if (onScheduleReceived) {
                onScheduleReceived(parsed.schedule, parsed.currentCount);
              }
              if (onProgress) {
                onProgress(parsed.message, parsed.progress);
              }
            }
          } else if (parsed.type === "complete") {
            return parsed.data as GenerateSchedulesResponse;
          } else if (parsed.type === "error") {
            throw new Error(parsed.error);
          }
        } catch (e) {
          console.error("Parse error:", e);
        }
      }
    }
  }

  // If we collected schedules but didn't get a complete message, return them
  if (collectedSchedules.length > 0) {
    return {
      schedules: collectedSchedules,
      totalDays: collectedSchedules.length,
      message: `Berhasil membuat ${collectedSchedules.length} jadwal untuk tujuan Anda`
    };
  }

  throw new Error("No complete response received");
}

// Step 3: Save Goal
export async function saveGoal(
  request: SaveGoalRequest
): Promise<SaveGoalResponse> {
  const response = await fetch("/api/ai/save-goal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Save failed");
  }

  return response.json();
}

// Complete 3-step flow
export async function createGoalWithSchedules(
  initialValue: string,
  callbacks?: GoalCreationCallbacks
): Promise<SaveGoalResponse> {
  try {
    // Step 1: Validate Goal
    callbacks?.onValidationStart?.();
    const validation = await validateGoal({ initialValue });
    callbacks?.onValidationComplete?.(validation);

    // Check if validation passed
    if (validation.status === 'invalid' || validation.status === 'incomplete') {
      // Don't throw error - these are expected validation states that the UI handles
      // Just return early with a dummy response (won't be used since UI handles the state)
      return {
        id: '',
        title: validation.title || '',
        description: validation.description || '',
        startDate: validation.startDate ? new Date(validation.startDate) : new Date(),
        endDate: validation.endDate ? new Date(validation.endDate) : new Date(),
        emoji: validation.emoji,
        status: 'ACTIVE',
        schedules: [],
        duration: 0,
      };
    }

    // Step 2: Generate Schedules
    if (!validation.title || !validation.description || !validation.startDate || !validation.endDate) {
      throw new Error("Missing required goal information after validation");
    }

    callbacks?.onScheduleGenerationStart?.();
    const schedulesResponse = await generateSchedules(
      {
        title: validation.title,
        description: validation.description,
        startDate: validation.startDate,
        endDate: validation.endDate,
        emoji: validation.emoji,
      },
      callbacks?.onScheduleGenerationProgress,
      callbacks?.onScheduleReceived
    );
    callbacks?.onScheduleGenerationComplete?.(schedulesResponse.schedules);

    // Check if we should skip auto-save
    if (callbacks?.skipAutoSave) {
      // Return a partial response without saving
      return {
        id: '',
        title: validation.title,
        description: validation.description,
        startDate: new Date(validation.startDate),
        endDate: new Date(validation.endDate),
        emoji: validation.emoji,
        status: 'ACTIVE',
        schedules: [],
        duration: 0,
      };
    }

    // Step 3: Save Goal (only if not skipping auto-save)
    callbacks?.onSaveStart?.();
    
    // Convert schedules to save format
    const schedulesToSave = schedulesResponse.schedules.map((schedule, index) => ({
      title: schedule.title,
      description: schedule.description,
      notes: "",
      startedTime: `${schedule.date}T${schedule.startTime}:00+07:00`,
      endTime: `${schedule.date}T${schedule.endTime}:00+07:00`,
      emoji: schedule.emoji || validation.emoji,
      percentComplete: String(schedule.progressPercent),
      order: index,
    }));

    const savedGoal = await saveGoal({
      title: validation.title,
      description: validation.description,
      startDate: validation.startDate,
      endDate: validation.endDate,
      emoji: validation.emoji,
      schedules: schedulesToSave,
    });

    callbacks?.onSaveComplete?.(savedGoal);
    return savedGoal;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Determine which step failed
    let step: 'validation' | 'generation' | 'save' = 'validation';
    if (errorMessage.includes('schedule') || errorMessage.includes('Schedule')) {
      step = 'generation';
    } else if (errorMessage.includes('save') || errorMessage.includes('Save')) {
      step = 'save';
    }
    
    callbacks?.onError?.(errorMessage, step);
    throw error;
  }
}

// Helper to handle incomplete validation with additional user input
export async function retryValidationWithAdditionalInfo(
  initialValue: string,
  previousValidation: ValidateGoalResponse,
  additionalInfo: {
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  }
): Promise<ValidateGoalResponse> {
  // Merge previous suggestions with new info
  const request: ValidateGoalRequest = {
    initialValue,
    title: additionalInfo.title || previousValidation.title,
    description: additionalInfo.description || previousValidation.description,
    startDate: additionalInfo.startDate || previousValidation.startDate,
    endDate: additionalInfo.endDate || previousValidation.endDate,
  };

  return validateGoal(request);
}