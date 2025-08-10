/**
 * Test Helper Functions
 * Utility functions for setting up and running tests
 */

import { jest } from '@jest/globals';

/**
 * Mock server-sent events stream for testing
 */
export function createMockSSEStream(messages, delay = 100) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      let messageIndex = 0;
      
      const sendNextMessage = () => {
        if (messageIndex < messages.length) {
          const message = messages[messageIndex++];
          const sseData = `data: ${JSON.stringify(message)}\n\n`;
          controller.enqueue(encoder.encode(sseData));
          
          if (messageIndex < messages.length) {
            setTimeout(sendNextMessage, delay);
          } else {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          }
        }
      };
      
      sendNextMessage();
    }
  });

  return {
    getReader: () => stream.getReader()
  };
}

/**
 * Mock fetch response for streaming endpoints
 */
export function mockFetchStream(messages, options = {}) {
  const { ok = true, status = 200, delay = 100 } = options;
  
  return jest.fn().mockResolvedValue({
    ok,
    status,
    body: createMockSSEStream(messages, delay)
  });
}

/**
 * Mock anthropic API streaming response
 */
export function createMockAnthropicStream(csvResponse, delay = 50) {
  const messages = [
    { type: 'content_block_start', content_block: { type: 'text', text: '' } },
    { type: 'content_block_delta', delta: { text: csvResponse } },
    { type: 'content_block_stop' },
    { type: 'message_stop' }
  ];
  
  return createMockSSEStream(messages, delay);
}

/**
 * Wait for element to appear or disappear in testing library
 */
export async function waitForCondition(checkFunction, timeout = 5000) {
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    if (checkFunction()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  throw new Error('Condition not met within timeout');
}

/**
 * Create mock user session for testing
 */
export function createMockSession(overrides = {}) {
  return {
    id: 'test-user-123',
    name: 'Test User',
    email: 'test@example.com',
    image: null,
    preferences: {
      wakeTime: '06:00',
      sleepTime: '22:00',
      scheduleType: 'flexible'
    },
    ...overrides
  };
}

/**
 * Mock Prisma database operations
 */
export function createMockPrisma() {
  return {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    goal: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    schedule: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn()
    }
  };
}

/**
 * Setup common mocks for component testing
 */
export function setupComponentMocks() {
  // Mock Next.js router
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();
  
  jest.mock('next/navigation', () => ({
    useRouter: () => ({
      push: mockPush,
      refresh: mockRefresh,
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn()
    }),
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => '/test-path'
  }));

  // Mock toast notifications
  const mockToast = {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn()
  };

  jest.mock('sonner', () => ({
    toast: mockToast,
    Toaster: () => null
  }));

  return {
    router: { push: mockPush, refresh: mockRefresh },
    toast: mockToast
  };
}

/**
 * Create mock CSV parser results
 */
export function createMockCSVResult(type = 'valid', overrides = {}) {
  const baseSchedule = {
    day: 1,
    date: '2025-08-11',
    startTime: '09:00',
    endTime: '11:00',
    title: 'Test Schedule',
    description: 'Test description',
    emoji: '🚀',
    percent: 100
  };

  const validResult = {
    valid: true,
    errors: [],
    schedules: [{ ...baseSchedule, ...overrides }]
  };

  const invalidResult = {
    valid: false,
    errors: ['Test validation error'],
    schedules: []
  };

  return type === 'valid' ? validResult : invalidResult;
}

/**
 * Generate test dates relative to today
 */
export function getTestDates() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);
  
  const sixMonthsLater = new Date(today);
  sixMonthsLater.setMonth(today.getMonth() + 6);
  
  const sevenMonthsLater = new Date(today);
  sevenMonthsLater.setMonth(today.getMonth() + 7);
  
  return {
    today: today.toISOString().split('T')[0],
    tomorrow: tomorrow.toISOString().split('T')[0],
    nextWeek: nextWeek.toISOString().split('T')[0],
    nextMonth: nextMonth.toISOString().split('T')[0],
    sixMonthsLater: sixMonthsLater.toISOString().split('T')[0],
    sevenMonthsLater: sevenMonthsLater.toISOString().split('T')[0]
  };
}

/**
 * Mock environment variables for testing
 */
export function mockEnvironmentVariables(overrides = {}) {
  const defaultEnv = {
    ANTHROPIC_API_KEY: 'test-anthropic-key',
    NEXTAUTH_SECRET: 'test-secret',
    DATABASE_URL: 'postgresql://test',
    NEXTAUTH_URL: 'http://localhost:3000'
  };

  const originalEnv = process.env;
  
  beforeEach(() => {
    process.env = { ...originalEnv, ...defaultEnv, ...overrides };
  });
  
  afterEach(() => {
    process.env = originalEnv;
  });
}

/**
 * Mock console methods to reduce noise in tests
 */
export function mockConsole() {
  const originalConsole = { ...console };
  
  beforeEach(() => {
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
    console.info = jest.fn();
  });
  
  afterEach(() => {
    Object.assign(console, originalConsole);
  });
}

/**
 * Create mock API request/response for testing API routes
 */
export function createMockApiRequest(method = 'POST', body = {}, headers = {}) {
  return {
    method,
    json: jest.fn().mockResolvedValue(body),
    headers: {
      'content-type': 'application/json',
      ...headers
    },
    body: JSON.stringify(body),
    url: 'http://localhost:3000/api/test'
  };
}

export function createMockApiResponse() {
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    writeHead: jest.fn().mockReturnThis(),
    write: jest.fn().mockReturnThis()
  };
  
  return response;
}

/**
 * Simulate streaming response for testing
 */
export async function simulateStreamingResponse(mockFn, messages, delay = 100) {
  let messageIndex = 0;
  
  mockFn.mockImplementation(async (data, onProgress, onComplete, onError) => {
    const sendNextMessage = () => {
      if (messageIndex < messages.length) {
        const message = messages[messageIndex++];
        
        setTimeout(() => {
          switch (message.type) {
            case 'progress':
            case 'status':
              onProgress?.(message.message, message.progress);
              sendNextMessage();
              break;
            case 'complete':
              onComplete?.(message.data);
              break;
            case 'error':
              onError?.(message.error);
              break;
            default:
              sendNextMessage();
          }
        }, delay);
      }
    };
    
    sendNextMessage();
  });
}

/**
 * Test utility for validating Indonesian date formats
 */
export function validateIndonesianDateFormat(dateString) {
  const indonesianDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const indonesianMonths = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  // Check if string contains Indonesian day or month names
  const hasIndonesianDay = indonesianDays.some(day => dateString.includes(day));
  const hasIndonesianMonth = indonesianMonths.some(month => dateString.includes(month));
  
  return hasIndonesianDay || hasIndonesianMonth;
}

/**
 * Helper to clean up test environment
 */
export function cleanupTest() {
  // Clear all mocks
  jest.clearAllMocks();
  
  // Reset modules
  jest.resetModules();
  
  // Clear timers
  jest.clearAllTimers();
  
  // Restore original implementations
  jest.restoreAllMocks();
}

/**
 * Create test timeout wrapper
 */
export function withTimeout(testFn, timeout = 10000) {
  return async () => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Test timeout')), timeout);
    });
    
    const testPromise = testFn();
    
    return Promise.race([testPromise, timeoutPromise]);
  };
}