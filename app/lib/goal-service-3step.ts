import {
  ValidateGoalRequest,
  ValidateGoalResponse,
  GenerateSchedulesRequest,
  GenerateSchedulesResponse,
  SaveGoalRequest,
  SaveGoalResponse,
  ScheduleItem,
} from "./types/goal-api";

// Interface untuk callback yang dipanggil pada setiap tahap pembuatan goal
export interface GoalCreationCallbacks {
  // Dipanggil saat mulai validasi goal dari input pengguna
  onValidationStart?: () => void;
  // Dipanggil setelah validasi selesai dengan hasil validasi
  onValidationComplete?: (result: ValidateGoalResponse) => void;
  // Dipanggil saat mulai generate jadwal otomatis
  onScheduleGenerationStart?: () => void;
  // Dipanggil untuk update progress saat generate jadwal (pesan & persentase)
  onScheduleGenerationProgress?: (message: string, progress: number) => void;
  // Dipanggil setiap kali satu jadwal berhasil dibuat (untuk streaming)
  onScheduleReceived?: (schedule: ScheduleItem, currentCount: number) => void;
  // Dipanggil setelah semua jadwal selesai dibuat
  onScheduleGenerationComplete?: (schedules: ScheduleItem[]) => void;
  // Dipanggil saat mulai menyimpan goal ke database
  onSaveStart?: () => void;
  // Dipanggil setelah goal berhasil disimpan
  onSaveComplete?: (goal: SaveGoalResponse) => void;
  // Dipanggil jika terjadi error pada tahap tertentu
  onError?: (error: string, step: 'validation' | 'generation' | 'save') => void;
  // Flag untuk skip auto-save setelah generate jadwal (untuk preview)
  skipAutoSave?: boolean;
}

// STEP 1: VALIDASI GOAL
// Fungsi untuk validasi input goal dari pengguna
// Mengecek kelengkapan data dan memberikan saran otomatis
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
      const error = await response.json().catch(() => ({ error: "Gagal melakukan validasi. Silakan coba lagi." }));
      throw new Error(error.error || "Gagal melakukan validasi. Silakan coba lagi.");
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
    // Re-throw the error so it's properly handled by the caller
    // This will trigger the onError callback instead of showing incomplete state
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Terjadi kesalahan koneksi. Silakan coba lagi.'
    );
  }
}

// STEP 2: GENERATE JADWAL OTOMATIS (dengan streaming)
// Fungsi untuk membuat jadwal harian berdasarkan goal yang sudah divalidasi
// Mendukung streaming untuk menampilkan progress secara real-time
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
            // Update progress bar/message di UI
            onProgress(parsed.message, parsed.progress);
          } else if (parsed.type === "schedule") {
            // Handle streaming jadwal satu per satu
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

  // Jika sudah dapat jadwal tapi tidak ada pesan complete, tetap return jadwalnya
  if (collectedSchedules.length > 0) {
    return {
      schedules: collectedSchedules,
      totalDays: collectedSchedules.length,
      message: `Berhasil membuat ${collectedSchedules.length} jadwal untuk tujuan Anda`
    };
  }

  throw new Error("No complete response received");
}

// STEP 3: SIMPAN GOAL KE DATABASE
// Fungsi untuk menyimpan goal beserta semua jadwalnya ke database
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

// FUNGSI UTAMA: ALUR LENGKAP 3 LANGKAH
// Menggabungkan ketiga step di atas menjadi satu alur yang seamless
// 1. Validasi -> 2. Generate Jadwal -> 3. Simpan ke Database
export async function createGoalWithSchedules(
  initialValue: string,
  callbacks?: GoalCreationCallbacks
): Promise<SaveGoalResponse> {
  try {
    // LANGKAH 1: Validasi input dari pengguna
    // Panggil callback untuk mulai validasi (biasanya untuk show loading)
    callbacks?.onValidationStart?.();
    const validation = await validateGoal({ initialValue });
    // Panggil callback setelah validasi selesai dengan hasilnya
    callbacks?.onValidationComplete?.(validation);

    // Cek apakah validasi berhasil
    // Status 'invalid' = input tidak valid (misal: tanggal salah)
    // Status 'incomplete' = butuh info tambahan dari user
    if (validation.status === 'invalid' || validation.status === 'incomplete') {
      // Jangan throw error - ini adalah state normal yang ditangani UI
      // Return dummy response (tidak akan dipakai karena UI handle state ini)
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

    // LANGKAH 2: Generate jadwal berdasarkan goal yang sudah valid
    // Pastikan semua data yang diperlukan sudah lengkap
    if (!validation.title || !validation.description || !validation.startDate || !validation.endDate) {
      throw new Error("Data goal tidak lengkap setelah validasi");
    }

    // Mulai generate jadwal
    callbacks?.onScheduleGenerationStart?.();
    const schedulesResponse = await generateSchedules(
      {
        title: validation.title,
        description: validation.description,
        startDate: validation.startDate,
        endDate: validation.endDate,
        emoji: validation.emoji,
      },
      callbacks?.onScheduleGenerationProgress,  // Callback untuk progress
      callbacks?.onScheduleReceived             // Callback untuk setiap jadwal yang diterima
    );
    // Panggil callback setelah semua jadwal selesai dibuat
    callbacks?.onScheduleGenerationComplete?.(schedulesResponse.schedules);

    // Cek apakah harus skip auto-save (untuk mode preview)
    if (callbacks?.skipAutoSave) {
      // Return response tanpa menyimpan ke database
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

    // LANGKAH 3: Simpan goal ke database (hanya jika tidak skip auto-save)
    callbacks?.onSaveStart?.();

    // Konversi format jadwal untuk disimpan ke database
    const schedulesToSave = schedulesResponse.schedules.map((schedule, index) => ({
      title: schedule.title,
      description: schedule.description,
      notes: "",  // Notes kosong, bisa diisi user nanti
      startedTime: `${schedule.date}T${schedule.startTime}:00+07:00`,  // Format ISO dengan timezone
      endTime: `${schedule.date}T${schedule.endTime}:00+07:00`,
      emoji: schedule.emoji || validation.emoji,  // Pakai emoji jadwal atau emoji goal
      percentComplete: String(schedule.progressPercent),  // Progress awal dari AI
      order: index,  // Urutan jadwal
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

    // Tentukan di step mana yang error untuk pesan yang lebih spesifik
    let step: 'validation' | 'generation' | 'save' = 'validation';
    if (errorMessage.includes('schedule') || errorMessage.includes('Schedule')) {
      step = 'generation';  // Error saat generate jadwal
    } else if (errorMessage.includes('save') || errorMessage.includes('Save')) {
      step = 'save';  // Error saat simpan ke database
    }
    
    callbacks?.onError?.(errorMessage, step);
    throw error;
  }
}

// HELPER: Untuk retry validasi dengan info tambahan dari user
// Digunakan ketika validasi pertama status 'incomplete' dan user memberikan info tambahan
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
  // Gabungkan saran dari validasi sebelumnya dengan info baru dari user
  const request: ValidateGoalRequest = {
    initialValue,
    title: additionalInfo.title || previousValidation.title,
    description: additionalInfo.description || previousValidation.description,
    startDate: additionalInfo.startDate || previousValidation.startDate,
    endDate: additionalInfo.endDate || previousValidation.endDate,
  };

  return validateGoal(request);
}