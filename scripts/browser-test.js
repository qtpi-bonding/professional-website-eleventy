/**
 * Browser Console Test Script
 * Copy and paste this into your browser console at http://localhost:8080
 * to test theme toggle and navigation functionality
 */

console.log('🧪 Starting browser functionality test...');

// Test 1: Check elements exist
const themeToggle = document.getElementById('sidebar-theme-toggle');
const navLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
const mainContent = document.querySelector('.main-content');
const sections = document.querySelectorAll('[id$="-section"]');

console.log('🔘 Theme toggle button:', !!themeToggle);
console.log('🧭 Navigation links:', navLinks.length);
console.log('📄 Main content area:', !!mainContent);
console.log('📄 Content sections:', sections.length);
console.log('🎨 Theme system:', !!window.themeSystem);

// Test 2: Test theme toggle
if (themeToggle) {
  console.log('🎨 Testing theme toggle...');
  const originalTheme = document.documentElement.getAttribute('data-theme');
  console.log('🎨 Original theme:', originalTheme);
  
  // Simulate click
  themeToggle.click();
  
  setTimeout(() => {
    const newTheme = document.documentElement.getAttribute('data-theme');
    console.log('🎨 New theme after click:', newTheme);
    console.log('🎨 Theme toggle test:', originalTheme !== newTheme ? 'PASS' : 'FAIL');
  }, 100);
} else {
  console.log('❌ Theme toggle button not found');
}

// Test 3: Test navigation scrolling
if (navLinks.length > 0 && mainContent) {
  console.log('🧭 Testing navigation scrolling...');
  
  const originalScrollTop = mainContent.scrollTop;
  console.log('📜 Original scroll position:', originalScrollTop);
  
  // Click the first navigation link
  const firstLink = navLinks[0];
  const targetHref = firstLink.getAttribute('href');
  console.log('🎯 Testing navigation to:', targetHref);
  
  firstLink.click();
  
  setTimeout(() => {
    const newScrollTop = mainContent.scrollTop;
    console.log('📜 New scroll position:', newScrollTop);
    console.log('🧭 Navigation scroll test:', newScrollTop !== originalScrollTop ? 'PASS' : 'FAIL');
  }, 1000);
} else {
  console.log('❌ Navigation elements not found');
}

console.log('🧪 Browser test completed! Check results above.');
console.log('💡 You can also manually click the theme toggle and navigation links to test.');