module.exports = {
  // Test environment - use jsdom for sidebar tests, node for others
  testEnvironment: 'node',
  testEnvironmentOptions: {
    url: 'http://localhost'
  },
  
  // Use jsdom for sidebar tests specifically
  projects: [
    {
      displayName: 'sidebar-tests',
      testMatch: ['**/tests/sidebar-manager.test.js'],
      testEnvironment: 'jsdom',
      testEnvironmentOptions: {
        url: 'http://localhost'
      }
    },
    {
      displayName: 'other-tests',
      testMatch: ['**/tests/**/*.test.js', '!**/tests/sidebar-manager.test.js'],
      testEnvironment: 'node'
    }
  ],
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/assets/js/**/*.js',
    '!src/assets/js/**/*.min.js'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Module paths
  moduleDirectories: ['node_modules', 'src'],
  
  // Transform files
  transform: {},
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/_site/'
  ],
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true
};