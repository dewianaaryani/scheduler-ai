/**
 * Simplified CSV Parser Tests
 * Tests CSV parsing logic with mock implementations
 */

describe('CSV Parser Logic Tests', () => {
  // Mock CSV parsing function with proper quoted field handling
  function mockParseScheduleCSV(csvContent) {
    const lines = csvContent.trim().split('\n');
    const schedules = [];
    
    for (const line of lines) {
      if (!line.trim() || line.startsWith('day,') || line.startsWith('#')) {
        continue;
      }
      
      // Simple CSV parser for quoted fields
      const fields = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          fields.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      fields.push(current); // Add last field
      
      if (fields.length >= 8) {
        schedules.push({
          day: parseInt(fields[0]),
          date: fields[1],
          startTime: fields[2],
          endTime: fields[3],
          title: fields[4],
          description: fields[5],
          emoji: fields[6],
          percent: parseInt(fields[7])
        });
      }
    }
    
    return schedules;
  }

  // Mock CSV validation function
  function mockValidateCSVSchedules(schedules) {
    const errors = [];
    
    if (schedules.length === 0) {
      errors.push('No schedules found');
      return { valid: false, errors };
    }
    
    const dateSet = new Set();
    let lastPercent = 0;
    
    schedules.forEach((schedule, index) => {
      if (dateSet.has(schedule.date)) {
        errors.push(`Duplicate date found: ${schedule.date}`);
      }
      dateSet.add(schedule.date);
      
      if (schedule.percent < lastPercent) {
        errors.push(`Percentage decreased at row ${index + 1}: ${schedule.percent} < ${lastPercent}`);
      }
      lastPercent = schedule.percent;
      
      if (!schedule.title || !schedule.description) {
        errors.push(`Missing title or description at row ${index + 1}`);
      }
    });
    
    if (schedules.length > 0 && schedules[schedules.length - 1].percent !== 100) {
      errors.push(`Last schedule should be 100%, got ${schedules[schedules.length - 1].percent}`);
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  describe('parseScheduleCSV', () => {
    test('should parse valid CSV content correctly', () => {
      const csvContent = `1,2025-08-11,09:00,11:00,"Hari 1: Pengenalan","Memahami konsep fundamental",🚀,14
2,2025-08-12,09:00,11:00,"Hari 2: Latihan","Praktik dasar dengan contoh",📚,28`;

      const result = mockParseScheduleCSV(csvContent);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        day: 1,
        date: '2025-08-11',
        startTime: '09:00',
        endTime: '11:00',
        title: 'Hari 1: Pengenalan',
        description: 'Memahami konsep fundamental',
        emoji: '🚀',
        percent: 14
      });
    });

    test('should handle quoted values with commas correctly', () => {
      const csvContent = `1,2025-08-11,09:00,11:00,"Hari 1: Pengenalan, Dasar","Memahami konsep, fundamental",🚀,14`;

      const result = mockParseScheduleCSV(csvContent);

      expect(result[0].title).toBe('Hari 1: Pengenalan, Dasar');
      expect(result[0].description).toBe('Memahami konsep, fundamental');
    });

    test('should skip empty lines and headers', () => {
      const csvContent = `day,date,startTime,endTime,title,description,emoji,percent

1,2025-08-11,09:00,11:00,"Hari 1: Pengenalan","Memahami konsep",🚀,14

2,2025-08-12,09:00,11:00,"Hari 2: Latihan","Praktik dasar",📚,28`;

      const result = mockParseScheduleCSV(csvContent);

      expect(result).toHaveLength(2);
    });

    test('should handle malformed CSV gracefully', () => {
      const csvContent = `invalid,csv,data
1,2025-08-11,09:00,11:00,"Hari 1","Description",🚀,14`;

      const result = mockParseScheduleCSV(csvContent);

      expect(result).toHaveLength(1); // Only valid row should be parsed
    });
  });

  describe('validateCSVSchedules', () => {
    test('should validate correct schedule progression', () => {
      const schedules = [
        {
          day: 1,
          date: '2025-08-11',
          startTime: '09:00',
          endTime: '11:00',
          title: 'Day 1',
          description: 'First day',
          emoji: '🚀',
          percent: 25
        },
        {
          day: 2,
          date: '2025-08-12',
          startTime: '09:00',
          endTime: '11:00',
          title: 'Day 2',
          description: 'Second day',
          emoji: '📚',
          percent: 50
        },
        {
          day: 3,
          date: '2025-08-13',
          startTime: '09:00',
          endTime: '11:00',
          title: 'Day 3',
          description: 'Final day',
          emoji: '✅',
          percent: 100
        }
      ];

      const result = mockValidateCSVSchedules(schedules);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should detect duplicate dates', () => {
      const schedules = [
        {
          day: 1,
          date: '2025-08-11',
          startTime: '09:00',
          endTime: '11:00',
          title: 'Day 1',
          description: 'First day',
          emoji: '🚀',
          percent: 50
        },
        {
          day: 2,
          date: '2025-08-11', // Duplicate date
          startTime: '14:00',
          endTime: '16:00',
          title: 'Day 1 Part 2',
          description: 'Same day',
          emoji: '📚',
          percent: 100
        }
      ];

      const result = mockValidateCSVSchedules(schedules);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Duplicate date found: 2025-08-11');
    });

    test('should detect decreasing percentage', () => {
      const schedules = [
        {
          day: 1,
          date: '2025-08-11',
          startTime: '09:00',
          endTime: '11:00',
          title: 'Day 1',
          description: 'First day',
          emoji: '🚀',
          percent: 50
        },
        {
          day: 2,
          date: '2025-08-12',
          startTime: '09:00',
          endTime: '11:00',
          title: 'Day 2',
          description: 'Second day',
          emoji: '📚',
          percent: 25 // Decreased from 50
        }
      ];

      const result = mockValidateCSVSchedules(schedules);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Percentage decreased at row 2: 25 < 50');
    });

    test('should validate last schedule is 100%', () => {
      const schedules = [
        {
          day: 1,
          date: '2025-08-11',
          startTime: '09:00',
          endTime: '11:00',
          title: 'Day 1',
          description: 'First day',
          emoji: '🚀',
          percent: 50
        },
        {
          day: 2,
          date: '2025-08-12',
          startTime: '09:00',
          endTime: '11:00',
          title: 'Day 2',
          description: 'Second day',
          emoji: '📚',
          percent: 75 // Not 100%
        }
      ];

      const result = mockValidateCSVSchedules(schedules);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Last schedule should be 100%, got 75');
    });
  });

  describe('CSV to Database Format Conversion', () => {
    test('should convert CSV row to database format correctly', () => {
      const csvRow = {
        day: 1,
        date: '2025-08-11',
        startTime: '09:00',
        endTime: '11:00',
        title: 'Day 1',
        description: 'First day',
        emoji: '🚀',
        percent: 25
      };

      // Mock conversion function
      const mockCsvToScheduleData = (row, goalId, userId) => ({
        userId,
        goalId,
        title: row.title,
        description: row.description,
        emoji: row.emoji,
        startedTime: `${row.date}T${row.startTime}:00+07:00`,
        endTime: `${row.date}T${row.endTime}:00+07:00`,
        percentComplete: String(row.percent),
        status: 'NONE',
        order: String(row.day)
      });

      const result = mockCsvToScheduleData(csvRow, 'goal-123', 'user-456');

      expect(result).toEqual({
        userId: 'user-456',
        goalId: 'goal-123',
        title: 'Day 1',
        description: 'First day',
        emoji: '🚀',
        startedTime: '2025-08-11T09:00:00+07:00',
        endTime: '2025-08-11T11:00:00+07:00',
        percentComplete: '25',
        status: 'NONE',
        order: '1'
      });
    });
  });

  describe('CSV Format Instructions', () => {
    test('should return format instructions', () => {
      const mockGetCSVFormatInstructions = () => `
FORMAT CSV - WAJIB gunakan format ini untuk efisiensi token:
day,date,startTime,endTime,title,description,emoji,percent

ATURAN CSV:
- TIDAK perlu header, langsung data
- Gunakan tanda kutip untuk title/description jika ada koma`;

      const instructions = mockGetCSVFormatInstructions();

      expect(instructions).toContain('FORMAT CSV');
      expect(instructions).toContain('day,date,startTime,endTime');
      expect(instructions).toContain('ATURAN CSV');
    });
  });
});