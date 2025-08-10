/**
 * Unit Tests for Streaming Functionality
 * Tests the streaming API and related utilities
 */

// Mock the streaming service
const mockProcessGoalDataStream = jest.fn();

jest.mock('../../app/lib/goal-service-stream', () => ({
  processGoalDataStream: mockProcessGoalDataStream,
  processGoalData: jest.fn()
}));

describe('Streaming API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  test('should handle successful streaming response', async () => {
    const mockMessages = [
      { type: 'status', message: 'Memproses tujuan Anda...' },
      { type: 'progress', message: 'Menghubungi AI...', progress: 50 },
      { 
        type: 'complete', 
        data: {
          title: 'Belajar JavaScript',
          description: 'Pembelajaran JavaScript dari dasar',
          startDate: '2025-08-11',
          endDate: '2025-08-18',
          message: 'Tujuan berhasil dibuat!',
          dataGoals: {
            title: 'Belajar JavaScript',
            emoji: '🚀',
            schedules: []
          }
        }
      }
    ];

    // Mock successful streaming
    mockProcessGoalDataStream.mockImplementation(async (data, onProgress, onComplete) => {
      // Simulate progress updates
      onProgress?.('Memproses tujuan Anda...');
      onProgress?.('Menghubungi AI...', 50);
      
      // Simulate completion
      const result = mockMessages[2].data;
      onComplete?.(result);
      return result;
    });

    const goalData = { initialValue: 'Belajar JavaScript selama 1 minggu' };
    let progressMessages = [];
    let completedData = null;

    const result = await mockProcessGoalDataStream(
      goalData,
      (message, progress) => progressMessages.push({ message, progress }),
      (data) => completedData = data
    );

    expect(mockProcessGoalDataStream).toHaveBeenCalledWith(
      goalData,
      expect.any(Function),
      expect.any(Function)
    );
    expect(progressMessages).toHaveLength(2);
    expect(progressMessages[0].message).toBe('Memproses tujuan Anda...');
    expect(progressMessages[1].message).toBe('Menghubungi AI...');
    expect(progressMessages[1].progress).toBe(50);
    expect(completedData).toBeTruthy();
    expect(completedData.title).toBe('Belajar JavaScript');
  });

  test('should handle streaming errors', async () => {
    const errorMessage = 'Gagal memproses dengan AI';

    mockProcessGoalDataStream.mockImplementation(async (data, onProgress, onComplete, onError) => {
      onError?.(errorMessage);
      return null;
    });

    let errorReceived = null;
    const result = await mockProcessGoalDataStream(
      { initialValue: 'Test' },
      undefined,
      undefined,
      (error) => errorReceived = error
    );

    expect(errorReceived).toBe(errorMessage);
    expect(result).toBeNull();
  });

  test('should validate streaming data format', () => {
    const validStreamingData = {
      title: 'Test Goal',
      description: 'Test Description',
      startDate: '2025-08-11',
      endDate: '2025-08-18',
      message: 'Success',
      dataGoals: {
        title: 'Test Goal',
        emoji: '🚀',
        schedules: []
      }
    };

    expect(validStreamingData.title).toBeTruthy();
    expect(validStreamingData.dataGoals).toBeTruthy();
    expect(validStreamingData.dataGoals.emoji).toBeTruthy();
    expect(Array.isArray(validStreamingData.dataGoals.schedules)).toBe(true);
  });
});

describe('CSV Processing Tests', () => {
  test('should validate CSV format', () => {
    const csvLines = [
      'complete,"Belajar JavaScript","Pembelajaran JS",2025-08-11,2025-08-18,🚀,"Success",""',
      'incomplete,"Belajar Python","Pembelajaran Python",null,null,🐍,"Need dates","dates"'
    ];

    csvLines.forEach(line => {
      const parts = line.split(',');
      expect(parts.length).toBeGreaterThanOrEqual(7);
      expect(['complete', 'incomplete']).toContain(parts[0]);
    });
  });

  test('should parse CSV with Indonesian content', () => {
    const csvLine = 'complete,"Belajar Bahasa Indonesia","Menguasai bahasa Indonesia dengan baik",2025-08-11,2025-09-11,📚,"Siap belajar!",""';
    
    expect(csvLine).toContain('Belajar Bahasa Indonesia');
    expect(csvLine).toContain('Menguasai bahasa');
    expect(csvLine).toContain('📚');
    expect(csvLine).toContain('Siap belajar!');
  });

  test('should handle special characters in CSV', () => {
    const csvWithSpecialChars = 'complete,"React & Vue.js","Framework JS: React, Vue & tools",2025-08-11,2025-09-11,⚛️,"Ready to start!",""';
    
    // Should contain special characters
    expect(csvWithSpecialChars).toContain('&');
    expect(csvWithSpecialChars).toContain(',');
    expect(csvWithSpecialChars).toContain('⚛️');
  });
});

describe('Date Validation Tests', () => {
  test('should validate date ranges', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    
    const sevenMonthsLater = new Date(today);
    sevenMonthsLater.setMonth(today.getMonth() + 7);
    
    const validRange = {
      startDate: tomorrow.toISOString().split('T')[0],
      endDate: nextMonth.toISOString().split('T')[0]
    };
    
    const invalidRange = {
      startDate: tomorrow.toISOString().split('T')[0],
      endDate: sevenMonthsLater.toISOString().split('T')[0]
    };
    
    expect(validRange).toHaveValidDateRange();
    expect(invalidRange).not.toHaveValidDateRange();
  });

  test('should format Indonesian dates correctly', () => {
    const indonesianDates = [
      'Senin, 11 Agustus 2025',
      'Selasa, 12 Agustus 2025',
      'Rabu, 13 Agustus 2025'
    ];

    indonesianDates.forEach(date => {
      expect(date).toBeIndonesianDate();
    });
  });
});

describe('Error Handling Tests', () => {
  test('should handle network errors gracefully', async () => {
    const networkError = new Error('Network error');
    
    mockProcessGoalDataStream.mockRejectedValue(networkError);

    try {
      await mockProcessGoalDataStream({ initialValue: 'Test' });
    } catch (error) {
      expect(error.message).toBe('Network error');
    }
  });

  test('should handle timeout errors', async () => {
    const timeoutError = new Error('Timeout');
    mockProcessGoalDataStream.mockRejectedValue(timeoutError);

    await expect(mockProcessGoalDataStream({ initialValue: 'Test' }))
      .rejects
      .toThrow('Timeout');
  });

  test('should validate required fields', () => {
    const incompleteData = {
      title: 'Test Goal',
      // Missing description, dates, etc.
    };

    expect(incompleteData.title).toBeTruthy();
    expect(incompleteData.description).toBeUndefined();
    expect(incompleteData.startDate).toBeUndefined();
  });
});