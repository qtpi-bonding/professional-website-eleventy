#!/usr/bin/env node

// Simple theme toggle test using curl and HTML parsing
const { execSync } = require('child_process');

function testThemeToggle() {
  console.log('🎨 Testing Theme Toggle Functionality...\n');
  
  try {
    // Test 1: Check if theme toggle button exists
    const fs = require('fs');
    const html = fs.readFileSync('_site/index.html', 'utf8');
    
    const themeToggleExists = html.includes('sidebar-theme-toggle');
    console.log('✓ Theme toggle button exists:', themeToggleExists);
    
    // Test 2: Check if theme system script is loaded
    const themeSystemLoaded = html.includes('theme-system.js');
    console.log('✓ Theme system script loaded:', themeSystemLoaded);
    
    // Test 3: Check if CSS variables are defined
    const cssVariablesExist = html.includes('--color-primary') && html.includes('--color-surface');
    console.log('✓ CSS variables defined:', cssVariablesExist);
    
    // Test 4: Check if data-theme attribute handling is present in CSS
    const css = fs.readFileSync('_site/assets/css/main.css', 'utf8');
    const lightTheme = css.includes('[data-theme=light]');
    const darkTheme = css.includes('[data-theme=dark]');
    const dataThemeHandling = lightTheme || darkTheme;
    console.log('✓ Data-theme CSS rules present:', dataThemeHandling);
    if (!dataThemeHandling) {
      console.log('  Debug: light theme found:', lightTheme, 'dark theme found:', darkTheme);
      console.log('  CSS sample:', css.substring(0, 500));
    }
    
    // Test 5: Check for hardcoded dark mode classes (should be none)
    const hardcodedDarkClasses = html.match(/dark:bg-|dark:text-|dark:border-/g);
    const hasHardcodedClasses = hardcodedDarkClasses && hardcodedDarkClasses.length > 0;
    console.log('✓ No hardcoded dark classes:', !hasHardcodedClasses);
    if (hasHardcodedClasses) {
      console.log('  ⚠ Found hardcoded classes:', hardcodedDarkClasses.slice(0, 5));
    }
    
    // Test 6: Check if theme classes are used
    const themeClasses = html.match(/text-text|bg-surface|text-primary|bg-primary/g);
    const usesThemeClasses = themeClasses && themeClasses.length > 0;
    console.log('✓ Uses theme classes:', usesThemeClasses);
    if (usesThemeClasses) {
      console.log('  Found theme classes:', [...new Set(themeClasses)].slice(0, 5));
    }
    
    console.log('\n🎨 Theme Toggle Test Summary:');
    const allTestsPassed = themeToggleExists && themeSystemLoaded && cssVariablesExist && 
                          dataThemeHandling && !hasHardcodedClasses && usesThemeClasses;
    
    if (allTestsPassed) {
      console.log('✅ All theme toggle tests passed!');
    } else {
      console.log('❌ Some theme toggle tests failed. Check the issues above.');
    }
    
    return allTestsPassed;
    
  } catch (error) {
    console.error('❌ Error testing theme toggle:', error.message);
    return false;
  }
}

// Run the test
testThemeToggle();