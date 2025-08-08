import { toast } from "sonner";

interface GenerateSchedulesParams {
  goalId: string;
  startDate: string;
  endDate: string;
  onProgress?: (progress: number) => void;
}

export async function generateSchedulesProgressively({
  goalId,
  startDate,
  endDate,
  onProgress,
}: GenerateSchedulesParams) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const batchSize = 30; // Generate 30 days at a time
  
  let currentStart = start;
  let processedDays = 0;
  let totalCreated = 0;

  while (currentStart < end) {
    try {
      const response = await fetch("/api/ai/generate-schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalId,
          startDate: currentStart.toISOString(),
          endDate: end.toISOString(),
          batchSize,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate schedules");
      }

      const result = await response.json();
      totalCreated += result.created;
      
      // Update progress
      processedDays = Math.min(processedDays + batchSize, totalDays);
      const progress = Math.round((processedDays / totalDays) * 100);
      onProgress?.(progress);

      // Check if more batches needed
      if (!result.hasMore) {
        break;
      }

      // Move to next batch
      currentStart = new Date(result.nextStartDate);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error generating batch:", error);
      toast.error(`Failed to generate schedules: ${error instanceof Error ? error.message : "Unknown error"}`);
      throw error;
    }
  }

  return { totalCreated, totalDays };
}

// Helper to use in components
export function useScheduleGenerator() {
  const generateWithProgress = async (params: GenerateSchedulesParams) => {
    const toastId = toast.loading("Generating schedules...", {
      description: "0% complete",
    });

    try {
      const result = await generateSchedulesProgressively({
        ...params,
        onProgress: (progress) => {
          toast.loading("Generating schedules...", {
            id: toastId,
            description: `${progress}% complete`,
          });
        },
      });

      toast.success(`Generated ${result.totalCreated} schedules!`, {
        id: toastId,
        description: `Created schedules for ${result.totalDays} days`,
      });

      return result;
    } catch (error) {
      toast.error("Failed to generate schedules", {
        id: toastId,
        description: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  };

  return { generateWithProgress };
}