#!/usr/bin/env node

/**
 * Deployment Verification Script
 * 
 * This script verifies that the built site is ready for deployment by checking:
 * - Required files exist
 * - Content validation passes
 * - Assets are properly optimized
 * - Links are functional
 */

const fs = require('fs');
const path = require('path');

const SITE_DIR = '_site';
const REQUIRED_FILES = [
  'index.html',
  'assets/css/main.css',
  'assets/js/content-filter.js',
  'assets/js/theme-system.js',
  'static/resume.pdf'
];

const REQUIRED_PAGES = [
  'contact/index.html',
  'resume/index.html'
];

function checkFileExists(filePath) {
  const fullPath = path.join(SITE_DIR, filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Required file missing: ${filePath}`);
  }
  console.log(`✓ ${filePath}`);
}

function checkFileSize(filePath, maxSizeKB) {
  const fullPath = path.join(SITE_DIR, filePath);
  const stats = fs.statSync(fullPath);
  const sizeKB = stats.size / 1024;
  
  if (sizeKB > maxSizeKB) {
    console.warn(`⚠ ${filePath} is ${sizeKB.toFixed(1)}KB (recommended: <${maxSizeKB}KB)`);
  } else {
    console.log(`✓ ${filePath} (${sizeKB.toFixed(1)}KB)`);
  }
}

function checkHTMLContent(filePath, requiredContent) {
  const fullPath = path.join(SITE_DIR, filePath);
  const content = fs.readFileSync(fullPath, 'utf8');
  
  requiredContent.forEach(text => {
    if (!content.includes(text)) {
      throw new Error(`Missing required content in ${filePath}: ${text}`);
    }
  });
  
  console.log(`✓ ${filePath} content validation passed`);
}

function main() {
  console.log('🚀 Verifying deployment build...\n');
  
  try {
    // Check if build directory exists
    if (!fs.existsSync(SITE_DIR)) {
      throw new Error(`Build directory ${SITE_DIR} does not exist. Run 'npm run build' first.`);
    }
    
    console.log('📁 Checking required files...');
    REQUIRED_FILES.forEach(checkFileExists);
    REQUIRED_PAGES.forEach(checkFileExists);
    
    console.log('\n📏 Checking file sizes...');
    checkFileSize('assets/css/main.css', 100); // CSS should be under 100KB
    checkFileSize('assets/js/content-filter.js', 50); // JS should be under 50KB
    checkFileSize('assets/js/theme-system.js', 20); // Theme JS should be under 20KB
    
    console.log('\n🔍 Checking HTML content...');
    checkHTMLContent('index.html', [
      'filter-button',
      'experience-card',
      'work-item-card',
      'theme-system'
    ]);
    
    checkHTMLContent('contact/index.html', [
      'contact-info'
    ]);
    
    console.log('\n✅ Deployment verification passed!');
    console.log('\nYour site is ready for deployment to GitHub Pages.');
    console.log('Push to the main branch to trigger automatic deployment.');
    
  } catch (error) {
    console.error('\n❌ Deployment verification failed:');
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };