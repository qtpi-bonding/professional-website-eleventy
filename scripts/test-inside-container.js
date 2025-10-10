#!/usr/bin/env node

/**
 * Test script that runs inside the container
 * Tests HTML structure without requiring curl
 */

const fs = require('fs');
const path = require('path');

function testHTMLStructure() {
  console.log('🧪 Testing HTML structure inside container...');
  
  try {
    const htmlPath = path.join(process.cwd(), '_site', 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    
    // Test 1: Check if theme toggle button exists
    const themeToggleMatches = html.match(/sidebar-theme-toggle/g);
    const themeToggleExists = themeToggleMatches && themeToggleMatches.length > 0;
    console.log('🔘 Theme toggle button exists:', themeToggleExists, `(${themeToggleMatches ? themeToggleMatches.length : 0} occurrences)`);
    
    // Test 2: Check if navigation links exist
    const navLinksMatches = html.match(/href="#[^"]*-section"/g);
    const navLinksCount = navLinksMatches ? navLinksMatches.length : 0;
    console.log('🧭 Navigation links found:', navLinksCount);
    if (navLinksMatches) {
      navLinksMatches.forEach((match, i) => console.log(`   ${i + 1}. ${match}`));
    }
    
    // Test 3: Check if sections exist
    const sectionsMatches = html.match(/id="[^"]*-section"/g);
    const sectionsCount = sectionsMatches ? sectionsMatches.length : 0;
    console.log('📄 Sections found:', sectionsCount);
    if (sectionsMatches) {
      sectionsMatches.forEach((match, i) => console.log(`   ${i + 1}. ${match}`));
    }
    
    // Test 4: Check if standalone JavaScript is present
    const standaloneJSExists = html.includes('Standalone homepage JavaScript loading');
    console.log('🐛 Standalone JavaScript present:', standaloneJSExists);
    
    // Test 5: Check if theme system script is loaded
    const themeSystemExists = html.includes('theme-system.js');
    console.log('🎨 Theme system script loaded:', themeSystemExists);
    
    console.log('\n📋 Test Summary:');
    console.log('================');
    console.log('✅ Theme toggle button:', themeToggleExists ? 'PASS' : 'FAIL');
    console.log('✅ Navigation links:', navLinksCount >= 4 ? 'PASS' : 'FAIL');
    console.log('✅ Content sections:', sectionsCount >= 4 ? 'PASS' : 'FAIL');
    console.log('✅ Standalone JavaScript:', standaloneJSExists ? 'PASS' : 'FAIL');
    console.log('✅ Theme system:', themeSystemExists ? 'PASS' : 'FAIL');
    
    if (themeToggleExists && navLinksCount >= 4 && sectionsCount >= 4 && standaloneJSExists) {
      console.log('\n🎉 All tests PASSED!');
      console.log('   JavaScript functionality should work in browser.');
      console.log('\n🔍 To test in browser:');
      console.log('   1. Open http://localhost:8080');
      console.log('   2. Open Developer Tools (F12) → Console');
      console.log('   3. Look for: "🚀 Standalone homepage JavaScript loading..."');
      console.log('   4. Click theme toggle and navigation links');
    } else {
      console.log('\n❌ Some tests FAILED!');
      console.log('   Check the issues above.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testHTMLStructure();