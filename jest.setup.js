// Jest setup file
import '@testing-library/jest-dom';

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: '/test',
    query: {},
    asPath: '/test'
  }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com'
      }
    },
    status: 'authenticated'
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn()
}));

// Mock environment variables
process.env.ANTHROPIC_API_KEY = 'test-key';
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.DATABASE_URL = 'postgresql://test';
process.env.NEXTAUTH_URL = 'http://localhost:3000';

// Mock fetch for all tests
global.fetch = jest.fn();

// Mock console methods to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Mock timers
jest.useFakeTimers();

// Custom matchers
expect.extend({
  toBeIndonesianDate(received) {
    const indonesianDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const indonesianMonths = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const hasIndonesianDay = indonesianDays.some(day => received.includes(day));
    const hasIndonesianMonth = indonesianMonths.some(month => received.includes(month));
    
    const pass = hasIndonesianDay || hasIndonesianMonth;
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be in Indonesian date format`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be in Indonesian date format`,
        pass: false,
      };
    }
  },
  
  toBeValidCSVLine(received) {
    const csvRegex = /^[^,]+,[^,]+,[^,]+,[^,]+,"[^"]*","[^"]*",[^,]+,\d+$/;
    const pass = csvRegex.test(received);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid CSV line`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid CSV line format`,
        pass: false,
      };
    }
  },
  
  toHaveValidDateRange(received) {
    const { startDate, endDate } = received;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    
    const isValidRange = start >= today && end > start && end <= sixMonthsLater;
    
    if (isValidRange) {
      return {
        message: () => `expected date range ${startDate} to ${endDate} to be invalid`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected date range ${startDate} to ${endDate} to be valid (after today, max 6 months)`,
        pass: false,
      };
    }
  }
});

// Global test utilities
global.testUtils = {
  // Create a mock response for streaming
  createMockStreamResponse: (data) => ({
    ok: true,
    status: 200,
    headers: new Map([
      ['content-type', 'text/event-stream'],
      ['cache-control', 'no-cache']
    ]),
    body: {
      getReader: () => ({
        read: jest.fn()
          .mockResolvedValueOnce({
            done: false,
            value: new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`)
          })
          .mockResolvedValueOnce({
            done: true,
            value: null
          })
      })
    }
  }),
  
  // Wait for async operations in tests
  waitFor: (fn, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const check = () => {
        try {
          const result = fn();
          if (result) {
            resolve(result);
          } else if (Date.now() - startTime < timeout) {
            setTimeout(check, 100);
          } else {
            reject(new Error('Timeout waiting for condition'));
          }
        } catch (error) {
          if (Date.now() - startTime < timeout) {
            setTimeout(check, 100);
          } else {
            reject(error);
          }
        }
      };
      check();
    });
  }
};

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

// Setup and teardown for each test file
beforeAll(() => {
  // Any global setup
});

afterAll(() => {
  // Any global cleanup
  jest.restoreAllMocks();
});