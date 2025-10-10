/**
 * Jest test setup file
 * Configures global test environment and utilities
 */

// Global test utilities
global.createMockElement = (tag, attributes = {}) => {
  const element = document.createElement(tag);
  Object.keys(attributes).forEach(key => {
    if (key.startsWith('data-')) {
      element.dataset[key.replace('data-', '')] = attributes[key];
    } else {
      element.setAttribute(key, attributes[key]);
    }
  });
  return element;
};

global.createMockFilterButton = (filter, active = false) => {
  return createMockElement('button', {
    'class': `filter-button ${active ? 'filter-button--active' : 'filter-button--inactive'}`,
    'data-filter': filter,
    'aria-pressed': active.toString()
  });
};

global.createMockContentItem = (tags) => {
  return createMockElement('div', {
    'class': 'content-item',
    'data-tags': tags
  });
};

// Mock console methods for cleaner test output
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Mock requestAnimationFrame for tests
global.requestAnimationFrame = jest.fn((callback) => {
  return setTimeout(callback, 16);
});

global.cancelAnimationFrame = jest.fn((id) => {
  clearTimeout(id);
});

// Mock performance.now for timing tests
global.performance = {
  now: jest.fn(() => Date.now())
};

// Test timeout configuration
jest.setTimeout(10000);