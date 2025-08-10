/**
 * Simple Test to Verify Jest Setup
 * Basic tests to ensure the testing environment works correctly
 */

describe('Basic Test Setup', () => {
  test('Jest is working correctly', () => {
    expect(1 + 1).toBe(2);
  });

  test('Basic math operations', () => {
    expect(Math.max(1, 2, 3)).toBe(3);
    expect([1, 2, 3]).toHaveLength(3);
  });

  test('String operations', () => {
    expect('hello world').toContain('world');
    expect('JavaScript').toMatch(/Script$/);
  });

  test('Async operations', async () => {
    const promise = Promise.resolve('success');
    await expect(promise).resolves.toBe('success');
  });

  test('Mock functions', () => {
    const mockFn = jest.fn();
    mockFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

describe('Date and Time Tests', () => {
  test('Date formatting', () => {
    const date = new Date('2025-08-10');
    expect(date.getFullYear()).toBe(2025);
    expect(date.getMonth()).toBe(7); // 0-indexed
  });

  test('Indonesian date detection with custom matcher', () => {
    const indonesianDate = 'Senin, 10 Agustus 2025';
    expect(indonesianDate).toBeIndonesianDate();
  });
});

describe('CSV Format Tests', () => {
  test('CSV line validation with custom matcher', () => {
    const validCsvLine = '1,2025-08-11,09:00,11:00,"Test Title","Test Description",🚀,100';
    expect(validCsvLine).toBeValidCSVLine();
  });

  test('Date range validation with custom matcher', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const dateRange = {
      startDate: tomorrow.toISOString().split('T')[0],
      endDate: nextMonth.toISOString().split('T')[0]
    };
    
    expect(dateRange).toHaveValidDateRange();
  });
});

describe('Environment Tests', () => {
  test('Environment variables are set', () => {
    expect(process.env.ANTHROPIC_API_KEY).toBe('test-key');
    expect(process.env.NEXTAUTH_SECRET).toBe('test-secret');
  });

  test('Global test utilities are available', () => {
    expect(global.testUtils).toBeDefined();
    expect(global.testUtils.waitFor).toBeInstanceOf(Function);
  });
});