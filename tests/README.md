# Test Suite

This directory contains the test suite for the personal portfolio website.

## Test Files

- `content-filter.test.js` - Unit tests for the ContentFilter class
- `setup.js` - Jest test setup and utilities
- `run-tests.js` - Simple test runner for container environment

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in container
docker exec -it eleventy-landing-dev npm test
```

## Test Coverage

The test suite covers:
- Filter state management
- Content visibility logic
- Accessibility features (ARIA labels, keyboard navigation)
- Tag parsing and validation
- Event handling
- Error scenarios

All tests are designed to work in the containerized development environment.