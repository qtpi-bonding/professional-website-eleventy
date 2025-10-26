#!/usr/bin/env node

/**
 * Debug Sidebar State Script
 * Checks the current sidebar state and localStorage preferences
 */

const puppeteer = require('puppeteer');

async function debugSidebarState() {
  console.log('🔍 Debugging sidebar state...\n');
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set desktop viewport
    await page.setViewport({ width: 1440, height: 900 });
    
    // Navigate to the page
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
    
    // Wait a bit for JavaScript to initialize
    await page.waitForTimeout(1000);
    
    // Get current sidebar state
    const sidebarState = await page.evaluate(() => {
      const sidebar = document.querySelector('[data-sidebar]');
      const sidebarManager = window.sidebarManager;
      
      if (!sidebar) return { error: 'Sidebar element not found' };
      if (!sidebarManager) return { error: 'SidebarManager not initialized' };
      
      // Get localStorage preferences
      let preferences = {};
      try {
        const stored = localStorage.getItem('sidebar-preferences');
        preferences = stored ? JSON.parse(stored) : {};
      } catch (e) {
        preferences = { error: 'Failed to read localStorage' };
      }
      
      return {
        // DOM state
        sidebarClasses: sidebar.className,
        ariaHidden: sidebar.getAttribute('aria-hidden'),
        dataState: sidebar.getAttribute('data-sidebar-state'),
        deviceType: sidebar.getAttribute('data-device-type'),
        
        // Manager state
        managerVisible: sidebarManager.isVisible,
        managerDeviceType: sidebarManager.currentDeviceType,
        
        // Preferences
        preferences: preferences,
        
        // Window size
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        
        // CSS computed styles
        transform: window.getComputedStyle(sidebar).transform,
        display: window.getComputedStyle(sidebar).display,
        visibility: window.getComputedStyle(sidebar).visibility
      };
    });
    
    console.log('📊 Current Sidebar State:');
    console.log('  DOM Classes:', sidebarState.sidebarClasses);
    console.log('  ARIA Hidden:', sidebarState.ariaHidden);
    console.log('  Data State:', sidebarState.dataState);
    console.log('  Device Type:', sidebarState.deviceType);
    console.log('  Manager Visible:', sidebarState.managerVisible);
    console.log('  Manager Device Type:', sidebarState.managerDeviceType);
    console.log('  Window Size:', `${sidebarState.windowWidth}x${sidebarState.windowHeight}`);
    console.log('  CSS Transform:', sidebarState.transform);
    console.log('  CSS Display:', sidebarState.display);
    console.log('  CSS Visibility:', sidebarState.visibility);
    console.log('  Preferences:', JSON.stringify(sidebarState.preferences, null, 2));
    
    // Check if sidebar should be visible
    const shouldBeVisible = sidebarState.windowWidth >= 1024;
    const isActuallyVisible = sidebarState.sidebarClasses.includes('sidebar--visible');
    
    console.log('\n🎯 Analysis:');
    console.log('  Should be visible (desktop):', shouldBeVisible);
    console.log('  Actually visible:', isActuallyVisible);
    
    if (shouldBeVisible && !isActuallyVisible) {
      console.log('  ❌ ISSUE: Sidebar should be visible on desktop but is hidden');
      
      // Try to force show the sidebar
      console.log('\n🔧 Attempting to force show sidebar...');
      
      const forceResult = await page.evaluate(() => {
        const sidebarManager = window.sidebarManager;
        if (sidebarManager) {
          sidebarManager.forceShow();
          return {
            success: true,
            newState: sidebarManager.isVisible,
            newClasses: document.querySelector('[data-sidebar]').className
          };
        }
        return { success: false, error: 'SidebarManager not available' };
      });
      
      console.log('  Force show result:', forceResult);
      
      // Clear localStorage preferences
      console.log('\n🧹 Clearing localStorage preferences...');
      
      const clearResult = await page.evaluate(() => {
        try {
          localStorage.removeItem('sidebar-preferences');
          return { success: true };
        } catch (e) {
          return { success: false, error: e.message };
        }
      });
      
      console.log('  Clear preferences result:', clearResult);
      
      // Refresh and check again
      console.log('\n🔄 Refreshing page...');
      await page.reload({ waitUntil: 'networkidle0' });
      await page.waitForTimeout(1000);
      
      const newState = await page.evaluate(() => {
        const sidebar = document.querySelector('[data-sidebar]');
        const sidebarManager = window.sidebarManager;
        
        return {
          sidebarClasses: sidebar.className,
          ariaHidden: sidebar.getAttribute('aria-hidden'),
          managerVisible: sidebarManager ? sidebarManager.isVisible : null,
          deviceType: sidebarManager ? sidebarManager.currentDeviceType : null
        };
      });
      
      console.log('  After refresh:');
      console.log('    Classes:', newState.sidebarClasses);
      console.log('    ARIA Hidden:', newState.ariaHidden);
      console.log('    Manager Visible:', newState.managerVisible);
      console.log('    Device Type:', newState.deviceType);
      
      const fixedVisible = newState.sidebarClasses.includes('sidebar--visible');
      console.log('    Now visible:', fixedVisible);
      
      if (fixedVisible) {
        console.log('  ✅ FIXED: Sidebar is now visible after clearing preferences');
      } else {
        console.log('  ❌ STILL BROKEN: Sidebar still not visible');
      }
    } else if (shouldBeVisible && isActuallyVisible) {
      console.log('  ✅ OK: Sidebar is correctly visible on desktop');
    } else if (!shouldBeVisible && !isActuallyVisible) {
      console.log('  ✅ OK: Sidebar is correctly hidden on mobile/tablet');
    }
    
  } catch (error) {
    console.error('💥 Debug failed:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run if this file is executed directly
if (require.main === module) {
  debugSidebarState();
}

module.exports = debugSidebarState;