/**
 * CSV Parser and Generator for Schedule Data
 * Optimized for minimal token usage while maintaining data integrity
 */

export interface ScheduleCSVRow {
  day: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  title: string;
  description: string;
  emoji: string;
  percent: number;
}

/**
 * Parse CSV string into schedule objects
 * Expected format: day,date,startTime,endTime,title,description,emoji,percent
 */
export function parseScheduleCSV(csvContent: string): ScheduleCSVRow[] {
  const lines = csvContent.trim().split('\n');
  const schedules: ScheduleCSVRow[] = [];
  
  for (const line of lines) {
    // Skip empty lines or headers
    if (!line.trim() || line.startsWith('day,') || line.startsWith('#')) {
      continue;
    }
    
    // Parse CSV line with proper escaping for commas in text
    const row = parseCSVLine(line);
    
    if (row.length >= 8) {
      try {
        schedules.push({
          day: parseInt(row[0]),
          date: row[1],
          startTime: row[2],
          endTime: row[3],
          title: row[4],
          description: row[5],
          emoji: row[6],
          percent: parseInt(row[7]),
        });
      } catch (err) {
        console.error('Failed to parse CSV row:', line, err);
      }
    }
  }
  
  return schedules;
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  result.push(current.trim());
  
  return result;
}

/**
 * Convert schedule CSV rows to database format
 */
export function csvToScheduleData(
  csvRow: ScheduleCSVRow,
  goalId: string,
  userId: string
) {
  // Combine date and time into ISO format with timezone
  const startDateTime = `${csvRow.date}T${csvRow.startTime}:00+07:00`;
  const endDateTime = `${csvRow.date}T${csvRow.endTime}:00+07:00`;
  
  return {
    userId,
    goalId,
    title: csvRow.title,
    description: csvRow.description,
    emoji: csvRow.emoji,
    startedTime: startDateTime,
    endTime: endDateTime,
    percentComplete: String(csvRow.percent),
    status: "NONE" as const,
    order: String(csvRow.day),
  };
}

/**
 * Generate CSV format instructions for AI
 */
export function getCSVFormatInstructions(): string {
  return `
FORMAT CSV - WAJIB gunakan format ini untuk efisiensi token:
day,date,startTime,endTime,title,description,emoji,percent

CONTOH OUTPUT (untuk 7 hari):
1,2025-08-11,09:00,11:00,"Hari 1: Pengenalan Dasar","Memahami konsep fundamental dan setup environment",🚀,14
2,2025-08-12,09:00,11:00,"Hari 2: Latihan Pertama","Praktik dasar dengan contoh sederhana",📚,28
3,2025-08-13,09:00,10:30,"Hari 3: Pendalaman Materi","Eksplorasi konsep lebih lanjut",🎯,42
4,2025-08-14,09:00,11:00,"Hari 4: Proyek Mini","Membuat proyek sederhana untuk praktik",💻,57
5,2025-08-15,09:00,10:00,"Hari 5: Review","Mengulang dan memperkuat pemahaman",🔄,71
6,2025-08-16,10:00,11:00,"Hari 6: Latihan Akhir Pekan","Sesi ringan dengan eksplorasi bebas",🌟,85
7,2025-08-17,10:00,11:30,"Hari 7: Evaluasi Mingguan","Review progress dan persiapan minggu depan",✅,100

ATURAN CSV:
- TIDAK perlu header, langsung data
- Gunakan tanda kutip untuk title/description jika ada koma
- Format tanggal: YYYY-MM-DD
- Format waktu: HH:MM (24 jam)
- Percent: angka bulat 1-100
- Emoji: satu emoji per baris
- JANGAN gunakan JSON, hanya CSV
- Satu baris = satu jadwal
`;
}

/**
 * Validate CSV data integrity
 */
export function validateCSVSchedules(schedules: ScheduleCSVRow[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (schedules.length === 0) {
    errors.push('No schedules found in CSV');
    return { valid: false, errors };
  }
  
  const dateSet = new Set<string>();
  let lastPercent = 0;
  
  schedules.forEach((schedule, index) => {
    // Check for duplicate dates
    if (dateSet.has(schedule.date)) {
      errors.push(`Duplicate date found: ${schedule.date}`);
    }
    dateSet.add(schedule.date);
    
    // Validate date format
    if (!isValidDate(schedule.date)) {
      errors.push(`Invalid date format at row ${index + 1}: ${schedule.date}`);
    }
    
    // Validate time format
    if (!isValidTime(schedule.startTime) || !isValidTime(schedule.endTime)) {
      errors.push(`Invalid time format at row ${index + 1}`);
    }
    
    // Check percentage progression
    if (schedule.percent < lastPercent) {
      errors.push(`Percentage decreased at row ${index + 1}: ${schedule.percent} < ${lastPercent}`);
    }
    lastPercent = schedule.percent;
    
    // Validate required fields
    if (!schedule.title || !schedule.description) {
      errors.push(`Missing title or description at row ${index + 1}`);
    }
    
    // Validate emoji (should be present)
    if (!schedule.emoji || schedule.emoji.length === 0) {
      errors.push(`Missing emoji at row ${index + 1}`);
    }
  });
  
  // Check if last schedule is 100%
  if (schedules.length > 0 && schedules[schedules.length - 1].percent !== 100) {
    errors.push(`Last schedule should be 100%, got ${schedules[schedules.length - 1].percent}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

function isValidDate(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
}

function isValidTime(timeStr: string): boolean {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(timeStr);
}
