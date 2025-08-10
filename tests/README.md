# Tests - Scheduler AI

Folder ini berisi semua test modern dengan struktur yang terorganisir berdasarkan flow aplikasi saat ini.

## 📁 Struktur Folder

```
tests/
├── unit/              # Unit tests untuk individual components/functions
│   ├── lib/           # Tests untuk utility functions  
│   └── components/    # Tests untuk React components
├── integration/       # Integration tests untuk feature flows
│   └── api/           # API integration tests
└── utils/            # Test utilities dan helpers
    ├── fixtures/     # Test data fixtures
    └── helpers/     # Test helper functions
```

## 🧪 Test Categories

### Unit Tests
- **lib/**: CSV parser, validation utilities, date helpers
- **components/**: Goal form, progress loader, calendar components  
- **api/**: Route handlers, authentication middleware

### Integration Tests
- **goal-creation/**: Complete goal creation flow dengan streaming
- **csv-processing/**: CSV parsing dan schedule generation
- **auth/**: Login, session management, onboarding

## 🚀 Running Tests

```bash
# Run all tests
npm test

# Run specific test categories
npm run test:unit
npm run test:integration

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run all test categories
npm run test:all
```

## 🔧 Test Configuration

- **Framework**: Jest untuk semua testing
- **Component Testing**: Testing Library untuk React components
- **API Testing**: Mock implementations untuk integration tests
- **Mocking**: Jest mocks untuk semua dependencies

## 📊 Test Coverage Goals

- **Unit Tests**: Comprehensive testing untuk semua utility functions
- **Integration Tests**: Cover semua major API flows dan data processing

## 🎯 Focus Areas

### Streaming & CSV Features
- Streaming API responses
- CSV parsing accuracy
- Progress tracking
- Error handling

### Core Application Logic
- Goal creation flow
- Schedule generation
- Date validation
- Authentication

### User Experience
- Real-time updates
- Error states
- Loading states
- Responsive behavior

## 📝 Test Writing Guidelines

1. **Descriptive Names**: Test names should clearly describe what is being tested
2. **Arrange-Act-Assert**: Follow AAA pattern untuk test structure
3. **Mock External Dependencies**: Use mocks untuk external services
4. **Test Edge Cases**: Include error conditions dan boundary values
5. **Keep Tests Fast**: Unit tests should run quickly

## 🔍 Test Data Management

- **Fixtures**: Pre-defined test data dalam `utils/fixtures/`
- **Factories**: Dynamic test data generation
- **Cleanup**: Proper teardown after each test

## 🚨 Continuous Integration

Tests will run automatically on:
- Pull requests
- Main branch pushes
- Scheduled nightly runs

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/)
- [MSW](https://mswjs.io/)