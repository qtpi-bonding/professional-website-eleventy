#!/usr/bin/env node

/**
 * Simple test script to verify HTML structure for JavaScript functionality
 * Tests that required elements exist for theme toggle and navigation scrolling
 */

const { execSync } = require('child_process');

function testHTMLStructure() {
  console.log('🧪 Testing HTML structure for JavaScript functionality...');
  
  try {
    // Test 1: Check if theme toggle button exists
    const themeToggleTest = execSync('curl -s http://localhost:8080 | grep -c "sidebar-theme-toggle"', { encoding: 'utf8' });
    const themeToggleExists = parseInt(themeToggleTest.trim()) > 0;
    console.log('🔘 Theme toggle button exists:', themeToggleExists);
    
    // Test 2: Check if navigation links exist
    const navLinksTest = execSync('curl -s http://localhost:8080 | grep -c "href=\\"#.*-section\\""', { encoding: 'utf8' });
    const navLinksCount = parseInt(navLinksTest.trim());
    console.log('🧭 Navigation links found:', navLinksCount);
    
    // Test 3: Check if sections exist
    const sectionsTest = execSync('curl -s http://localhost:8080 | grep -c "id=\\".*-section\\""', { encoding: 'utf8' });
    const sectionsCount = parseInt(sectionsTest.trim());
    console.log('📄 Sections found:', sectionsCount);
    
    // Test 4: Check if theme system script is loaded
    const themeSystemTest = execSync('curl -s http://localhost:8080 | grep -c "theme-system.js"', { encoding: 'utf8' });
    const themeSystemExists = parseInt(themeSystemTest.trim()) > 0;
    console.log('🎨 Theme system script loaded:', themeSystemExists);
    
    // Test 5: Check if debug JavaScript is present
    const debugJSTest = execSync('curl -s http://localhost:8080 | grep -c "Homepage JavaScript loading"', { encoding: 'utf8' });
    const debugJSExists = parseInt(debugJSTest.trim()) > 0;
    console.log('🐛 Debug JavaScript present:', debugJSExists);
    
    console.log('\n📋 Test Summary:');
    console.log('================');
    console.log('✅ Theme toggle button:', themeToggleExists ? 'PASS' : 'FAIL');
    console.log('✅ Navigation links:', navLinksCount >= 4 ? 'PASS' : 'FAIL');
    console.log('✅ Content sections:', sectionsCount >= 4 ? 'PASS' : 'FAIL');
    console.log('✅ Theme system:', themeSystemExists ? 'PASS' : 'FAIL');
    console.log('✅ Debug JavaScript:', debugJSExists ? 'PASS' : 'FAIL');
    
    console.log('\n🔍 Manual Testing Instructions:');
    console.log('================================');
    console.log('1. Open http://localhost:8080 in your browser');
    console.log('2. Open Developer Tools (F12) and check Console tab');
    console.log('3. You should see debug messages like:');
    console.log('   - "🚀 Homepage JavaScript loading..."');
    console.log('   - "🔧 Initializing homepage functionality..."');
    console.log('   - "🎨 Theme toggle button found: true"');
    console.log('   - "🧭 Navigation links found: 4"');
    console.log('4. Click the theme toggle button (sun/moon icon) in sidebar');
    console.log('5. Click navigation links (About, Experience, etc.) in sidebar');
    console.log('6. Both should work and show console messages');
    
    if (themeToggleExists && navLinksCount >= 4 && sectionsCount >= 4 && themeSystemExists && debugJSExists) {
      console.log('\n🎉 All HTML structure tests PASSED!');
      console.log('   JavaScript functionality should work in browser.');
    } else {
      console.log('\n❌ Some HTML structure tests FAILED!');
      console.log('   Check the issues above before testing JavaScript.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testHTMLStructure();