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
  // Normalize to UTC date only (ignore time) - consistent with AI routes
  const startUTC = new Date(start);
  startUTC.setUTCHours(0, 0, 0, 0);
  const endUTC = new Date(end);
  endUTC.setUTCHours(0, 0, 0, 0);
  // Count the number of days inclusive - consistent with all AI routes
  const totalDays = Math.floor((endUTC.getTime() - startUTC.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Use smaller batch sizes for better UX
  // For shorter durations, use smaller batches for smoother progress
  const batchSize = totalDays <= 30 ? 7 : totalDays <= 90 ? 14 : 30;
  
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
        throw new Error(error.error || "Gagal membuat jadwal");
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
      
      // Small delay to avoid rate limiting and provide smoother UX
      await new Promise(resolve => setTimeout(resolve, 800));
    } catch (error) {
      console.error("Error generating batch:", error);
      toast.error(`Gagal membuat jadwal: ${error instanceof Error ? error.message : "Terjadi kesalahan"}`);
      throw error;
    }
  }

  return { totalCreated, totalDays };
}

// Helper to use in components
export function useScheduleGenerator() {
  const generateWithProgress = async (params: GenerateSchedulesParams) => {
    const toastId = toast.loading("Membuat jadwal...", {
      description: "0% selesai",
    });

    try {
      const result = await generateSchedulesProgressively({
        ...params,
        onProgress: (progress) => {
          toast.loading("Membuat jadwal...", {
            id: toastId,
            description: `${progress}% selesai`,
          });
        },
      });

      toast.success(`Berhasil membuat ${result.totalCreated} jadwal!`, {
        id: toastId,
        description: `Jadwal dibuat untuk ${result.totalDays} hari`,
      });

      return result;
    } catch (error) {
      toast.error("Gagal membuat jadwal", {
        id: toastId,
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
      throw error;
    }
  };

  return { generateWithProgress };
}