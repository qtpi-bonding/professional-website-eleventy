#!/usr/bin/env node

/**
 * Simple test runner for container environment
 * Runs Jest tests and provides clear output
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Running Content Filter Tests...\n');

try {
  // Run Jest with specific configuration
  const result = execSync('npx jest --config=jest.config.js --verbose', {
    cwd: process.cwd(),
    stdio: 'inherit',
    encoding: 'utf8'
  });
  
  console.log('\n✅ All tests passed!');
  process.exit(0);
  
} catch (error) {
  console.error('\n❌ Tests failed!');
  console.error('Exit code:', error.status);
  process.exit(error.status || 1);
}