#!/usr/bin/env node

// Simple console log capture for debugging
const puppeteer = require('puppeteer');

async function captureConsoleLogs() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Capture console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    console.log(`[${type.toUpperCase()}] ${text}`);
  });
  
  // Capture errors
  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
  });
  
  try {
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
    
    // Test theme toggle
    console.log('\n=== Testing Theme Toggle ===');
    await page.click('[data-theme-toggle]');
    await page.waitForTimeout(1000);
    
    // Check current theme
    const currentTheme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });
    console.log(`Current theme after toggle: ${currentTheme}`);
    
    // Check CSS variables
    const cssVars = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return {
        primary: styles.getPropertyValue('--color-primary'),
        surface: styles.getPropertyValue('--color-surface'),
        text: styles.getPropertyValue('--color-text')
      };
    });
    console.log('CSS Variables:', cssVars);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
}

captureConsoleLogs().catch(console.error);