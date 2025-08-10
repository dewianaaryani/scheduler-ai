/**
 * Date parsing utilities for extracting and calculating dates from natural language
 */

interface DateParseResult {
  startDate: Date | null;
  endDate: Date | null;
  duration: { value: number; unit: 'days' | 'weeks' | 'months' } | null;
}

/**
 * Parse natural language text to extract dates and durations
 */
export function parseDatesFromText(text: string, baseDate: Date = new Date()): DateParseResult {
  const result: DateParseResult = {
    startDate: null,
    endDate: null,
    duration: null,
  };

  // Normalize text to lowercase for matching
  const normalizedText = text.toLowerCase();

  // Parse start date patterns
  if (normalizedText.includes('hari ini') || normalizedText.includes('sekarang')) {
    result.startDate = new Date(baseDate);
    result.startDate.setDate(result.startDate.getDate() + 1); // Start tomorrow
  } else if (normalizedText.includes('besok')) {
    result.startDate = new Date(baseDate);
    result.startDate.setDate(result.startDate.getDate() + 1);
  } else if (normalizedText.includes('mulai')) {
    // Try to extract date after "mulai"
    const dateMatch = normalizedText.match(/mulai\s+(?:tanggal\s+)?(\d{1,2})[\s-]?(\w+)?/);
    if (dateMatch) {
      const day = parseInt(dateMatch[1]);
      const monthStr = dateMatch[2];
      result.startDate = parseIndonesianDate(day, monthStr, baseDate);
    }
  }

  // Parse end date patterns
  if (normalizedText.includes('sampai') || normalizedText.includes('hingga')) {
    const dateMatch = normalizedText.match(/(?:sampai|hingga)\s+(?:tanggal\s+)?(\d{1,2})[\s-]?(\w+)?/);
    if (dateMatch) {
      const day = parseInt(dateMatch[1]);
      const monthStr = dateMatch[2];
      result.endDate = parseIndonesianDate(day, monthStr, baseDate);
    }
  }

  // Parse duration patterns
  const durationPatterns = [
    { regex: /(\d+)\s*hari/, unit: 'days' as const },
    { regex: /(\d+)\s*minggu/, unit: 'weeks' as const },
    { regex: /(\d+)\s*bulan/, unit: 'months' as const },
  ];

  for (const pattern of durationPatterns) {
    const match = normalizedText.match(pattern.regex);
    if (match) {
      result.duration = {
        value: parseInt(match[1]),
        unit: pattern.unit,
      };
      break;
    }
  }

  return result;
}

/**
 * Calculate end date from start date and duration
 */
export function calculateEndDate(startDate: Date, duration: { value: number; unit: string }): Date {
  const endDate = new Date(startDate);
  
  switch (duration.unit) {
    case 'days':
      endDate.setDate(endDate.getDate() + duration.value - 1);
      break;
    case 'weeks':
      endDate.setDate(endDate.getDate() + (duration.value * 7) - 1);
      break;
    case 'months':
      endDate.setMonth(endDate.getMonth() + duration.value);
      endDate.setDate(endDate.getDate() - 1);
      break;
  }
  
  return endDate;
}

/**
 * Parse Indonesian date format
 */
function parseIndonesianDate(day: number, monthStr: string | undefined, baseDate: Date): Date {
  const date = new Date(baseDate);
  date.setDate(day);
  
  if (monthStr) {
    const months: Record<string, number> = {
      'januari': 0, 'jan': 0,
      'februari': 1, 'feb': 1,
      'maret': 2, 'mar': 2,
      'april': 3, 'apr': 3,
      'mei': 4,
      'juni': 5, 'jun': 5,
      'juli': 6, 'jul': 6,
      'agustus': 7, 'agu': 7, 'aug': 7,
      'september': 8, 'sep': 8,
      'oktober': 9, 'okt': 9,
      'november': 10, 'nov': 10,
      'desember': 11, 'des': 11,
    };
    
    const monthNum = months[monthStr.toLowerCase()];
    if (monthNum !== undefined) {
      date.setMonth(monthNum);
      
      // If the resulting date is in the past, assume next year
      if (date < baseDate) {
        date.setFullYear(date.getFullYear() + 1);
      }
    }
  }
  
  return date;
}

/**
 * Validate date range for goal creation
 */
export function validateDateRange(startDate: Date, endDate: Date): { valid: boolean; error?: string } {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  // Start date must be at least tomorrow
  if (startDate < tomorrow) {
    return { valid: false, error: "Tanggal mulai harus minimal besok" };
  }
  
  // End date must be after start date
  if (endDate <= startDate) {
    return { valid: false, error: "Tanggal selesai harus setelah tanggal mulai" };
  }
  
  // End date must not exceed 4 months from start date
  const fourMonthsFromStart = new Date(startDate);
  fourMonthsFromStart.setMonth(fourMonthsFromStart.getMonth() + 4);
  
  if (endDate > fourMonthsFromStart) {
    return { valid: false, error: "Tanggal selesai tidak boleh lebih dari 4 bulan dari tanggal mulai" };
  }
  
  return { valid: true };
}

/**
 * Extract duration from title or description
 */
export function extractDurationFromTitle(title: string): { value: number; unit: string } | null {
  const normalizedTitle = title.toLowerCase();
  
  // Check for duration patterns in title
  const patterns = [
    { regex: /(\d+)\s*hari/, unit: 'days' },
    { regex: /(\d+)\s*minggu/, unit: 'weeks' },
    { regex: /(\d+)\s*bulan/, unit: 'months' },
  ];
  
  for (const pattern of patterns) {
    const match = normalizedTitle.match(pattern.regex);
    if (match) {
      return {
        value: parseInt(match[1]),
        unit: pattern.unit,
      };
    }
  }
  
  return null;
}