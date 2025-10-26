#!/usr/bin/env node

/**
 * Comprehensive Responsive Behavior Testing Script
 * Tests all requirements for mobile responsive enhancements
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class ResponsiveTestSuite {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async init() {
    console.log('🚀 Starting Responsive Behavior Test Suite...\n');
    
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    await this.page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
  }

  async runTest(name, testFn) {
    try {
      console.log(`🧪 Testing: ${name}`);
      await testFn();
      this.results.passed++;
      this.results.tests.push({ name, status: 'PASSED' });
      console.log(`✅ PASSED: ${name}\n`);
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name, status: 'FAILED', error: error.message });
      console.log(`❌ FAILED: ${name}`);
      console.log(`   Error: ${error.message}\n`);
    }
  }

  async testMobileResponsiveBehavior() {
    await this.runTest('Mobile: Sidebar hidden by default', async () => {
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.waitForTimeout(500);
      
      const sidebarState = await this.page.evaluate(() => {
        const sidebar = document.querySelector('[data-sidebar]');
        return {
          isHidden: sidebar.getAttribute('aria-hidden') === 'true',
          hasHiddenClass: !sidebar.classList.contains('sidebar--visible'),
          deviceType: sidebar.getAttribute('data-device-type')
        };
      });
      
      if (!sidebarState.isHidden || !sidebarState.hasHiddenClass) {
        throw new Error('Sidebar should be hidden by default on mobile');
      }
      
      if (sidebarState.deviceType !== 'mobile') {
        throw new Error(`Expected device type 'mobile', got '${sidebarState.deviceType}'`);
      }
    });

    await this.runTest('Mobile: Hamburger menu button visible', async () => {
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.waitForTimeout(500);
      
      const hamburgerVisible = await this.page.evaluate(() => {
        const hamburger = document.querySelector('.mobile-menu-toggle');
        const computedStyle = window.getComputedStyle(hamburger);
        return computedStyle.display !== 'none' && hamburger.offsetParent !== null;
      });
      
      if (!hamburgerVisible) {
        throw new Error('Hamburger menu button should be visible on mobile');
      }
    });

    await this.runTest('Mobile: Sidebar shows with overlay when toggled', async () => {
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.waitForTimeout(500);
      
      // Click hamburger menu
      await this.page.click('.mobile-menu-toggle');
      await this.page.waitForTimeout(400);
      
      const sidebarState = await this.page.evaluate(() => {
        const sidebar = document.querySelector('[data-sidebar]');
        const overlay = document.querySelector('[data-sidebar-overlay]');
        return {
          sidebarVisible: sidebar.classList.contains('sidebar--visible'),
          overlayVisible: overlay.classList.contains('sidebar-overlay--visible'),
          sidebarAriaHidden: sidebar.getAttribute('aria-hidden'),
          overlayAriaHidden: overlay.getAttribute('aria-hidden')
        };
      });
      
      if (!sidebarState.sidebarVisible) {
        throw new Error('Sidebar should be visible after toggle');
      }
      
      if (!sidebarState.overlayVisible) {
        throw new Error('Overlay should be visible on mobile when sidebar is open');
      }
      
      if (sidebarState.sidebarAriaHidden !== 'false') {
        throw new Error('Sidebar aria-hidden should be false when visible');
      }
    });
  }

  async testTabletResponsiveBehavior() {
    await this.runTest('Tablet: Sidebar visible by default', async () => {
      await this.page.setViewport({ width: 768, height: 1024 });
      await this.page.waitForTimeout(500);
      
      const sidebarState = await this.page.evaluate(() => {
        const sidebar = document.querySelector('[data-sidebar]');
        return {
          isVisible: sidebar.getAttribute('aria-hidden') === 'false',
          hasVisibleClass: sidebar.classList.contains('sidebar--visible'),
          deviceType: sidebar.getAttribute('data-device-type')
        };
      });
      
      if (!sidebarState.isVisible || !sidebarState.hasVisibleClass) {
        throw new Error('Sidebar should be visible by default on tablet');
      }
      
      if (sidebarState.deviceType !== 'tablet') {
        throw new Error(`Expected device type 'tablet', got '${sidebarState.deviceType}'`);
      }
    });

    await this.runTest('Tablet: Sidebar toggleable without overlay', async () => {
      await this.page.setViewport({ width: 768, height: 1024 });
      await this.page.waitForTimeout(500);
      
      // Click sidebar toggle button
      await this.page.click('.sidebar-toggle-button');
      await this.page.waitForTimeout(400);
      
      const sidebarState = await this.page.evaluate(() => {
        const sidebar = document.querySelector('[data-sidebar]');
        const overlay = document.querySelector('[data-sidebar-overlay]');
        const mainContent = document.querySelector('.main-content');
        return {
          sidebarHidden: !sidebar.classList.contains('sidebar--visible'),
          overlayHidden: !overlay.classList.contains('sidebar-overlay--visible'),
          mainContentAdjusted: mainContent.classList.contains('main-content--sidebar-hidden')
        };
      });
      
      if (!sidebarState.sidebarHidden) {
        throw new Error('Sidebar should be hidden after toggle on tablet');
      }
      
      if (!sidebarState.overlayHidden) {
        throw new Error('Overlay should not be visible on tablet');
      }
      
      if (!sidebarState.mainContentAdjusted) {
        throw new Error('Main content should adjust when sidebar is hidden on tablet');
      }
    });
  }

  async testDesktopResponsiveBehavior() {
    await this.runTest('Desktop: Sidebar visible by default', async () => {
      await this.page.setViewport({ width: 1440, height: 900 });
      await this.page.waitForTimeout(500);
      
      const sidebarState = await this.page.evaluate(() => {
        const sidebar = document.querySelector('[data-sidebar]');
        return {
          isVisible: sidebar.getAttribute('aria-hidden') === 'false',
          hasVisibleClass: sidebar.classList.contains('sidebar--visible'),
          deviceType: sidebar.getAttribute('data-device-type')
        };
      });
      
      if (!sidebarState.isVisible || !sidebarState.hasVisibleClass) {
        throw new Error('Sidebar should be visible by default on desktop');
      }
      
      if (sidebarState.deviceType !== 'desktop') {
        throw new Error(`Expected device type 'desktop', got '${sidebarState.deviceType}'`);
      }
    });

    await this.runTest('Desktop: Floating toggle button appears when sidebar hidden', async () => {
      await this.page.setViewport({ width: 1440, height: 900 });
      await this.page.waitForTimeout(500);
      
      // Hide sidebar first
      await this.page.click('.sidebar-toggle-button');
      await this.page.waitForTimeout(400);
      
      const floatingToggleState = await this.page.evaluate(() => {
        const floatingToggle = document.querySelector('.floating-sidebar-toggle');
        return {
          isVisible: floatingToggle.classList.contains('floating-sidebar-toggle--visible'),
          ariaHidden: floatingToggle.getAttribute('aria-hidden'),
          display: window.getComputedStyle(floatingToggle).display
        };
      });
      
      if (!floatingToggleState.isVisible) {
        throw new Error('Floating toggle button should be visible when sidebar is hidden on desktop');
      }
      
      if (floatingToggleState.ariaHidden !== 'false') {
        throw new Error('Floating toggle button should not be aria-hidden when visible');
      }
    });
  }

  async testTouchTargets() {
    await this.runTest('Touch targets meet 44px minimum size', async () => {
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.waitForTimeout(500);
      
      const touchTargetSizes = await this.page.evaluate(() => {
        const selectors = [
          '.mobile-menu-toggle',
          '.sidebar-close-button',
          '.filter-button',
          '.nav-link',
          '.social-link',
          '.theme-toggle'
        ];
        
        const results = [];
        selectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(element);
            const minHeight = parseFloat(computedStyle.minHeight) || rect.height;
            const minWidth = parseFloat(computedStyle.minWidth) || rect.width;
            
            results.push({
              selector: `${selector}[${index}]`,
              width: rect.width,
              height: rect.height,
              minWidth,
              minHeight,
              meetsRequirement: minWidth >= 44 && minHeight >= 44
            });
          });
        });
        
        return results;
      });
      
      const failedTargets = touchTargetSizes.filter(target => !target.meetsRequirement);
      
      if (failedTargets.length > 0) {
        const failureDetails = failedTargets.map(target => 
          `${target.selector}: ${target.width}x${target.height} (min: ${target.minWidth}x${target.minHeight})`
        ).join(', ');
        throw new Error(`Touch targets too small: ${failureDetails}`);
      }
    });
  }

  async testKeyboardNavigation() {
    await this.runTest('Keyboard navigation: Tab to toggle button', async () => {
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.waitForTimeout(500);
      
      // Focus the hamburger menu with Tab
      await this.page.keyboard.press('Tab');
      
      const focusedElement = await this.page.evaluate(() => {
        const activeElement = document.activeElement;
        return {
          tagName: activeElement.tagName,
          className: activeElement.className,
          ariaLabel: activeElement.getAttribute('aria-label')
        };
      });
      
      if (!focusedElement.className.includes('mobile-menu-toggle')) {
        throw new Error('Tab should focus the mobile menu toggle button');
      }
    });

    await this.runTest('Keyboard navigation: Enter/Space activates toggle', async () => {
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.waitForTimeout(500);
      
      // Focus and activate with Enter
      await this.page.focus('.mobile-menu-toggle');
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(400);
      
      const sidebarVisible = await this.page.evaluate(() => {
        const sidebar = document.querySelector('[data-sidebar]');
        return sidebar.classList.contains('sidebar--visible');
      });
      
      if (!sidebarVisible) {
        throw new Error('Enter key should activate sidebar toggle');
      }
    });

    await this.runTest('Keyboard navigation: Escape closes sidebar', async () => {
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.waitForTimeout(500);
      
      // Open sidebar first
      await this.page.click('.mobile-menu-toggle');
      await this.page.waitForTimeout(400);
      
      // Press Escape
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(400);
      
      const sidebarHidden = await this.page.evaluate(() => {
        const sidebar = document.querySelector('[data-sidebar]');
        return !sidebar.classList.contains('sidebar--visible');
      });
      
      if (!sidebarHidden) {
        throw new Error('Escape key should close sidebar');
      }
    });
  }

  async testAriaLabelsAndScreenReader() {
    await this.runTest('ARIA labels: Toggle button has proper labels', async () => {
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.waitForTimeout(500);
      
      const ariaLabels = await this.page.evaluate(() => {
        const hamburger = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('[data-sidebar]');
        
        return {
          hamburgerLabel: hamburger.getAttribute('aria-label'),
          hamburgerExpanded: hamburger.getAttribute('aria-expanded'),
          hamburgerControls: hamburger.getAttribute('aria-controls'),
          sidebarRole: sidebar.getAttribute('role'),
          sidebarLabel: sidebar.getAttribute('aria-label')
        };
      });
      
      if (!ariaLabels.hamburgerLabel || !ariaLabels.hamburgerLabel.includes('navigation')) {
        throw new Error('Hamburger button should have descriptive aria-label');
      }
      
      if (ariaLabels.hamburgerExpanded !== 'false') {
        throw new Error('Hamburger button should have aria-expanded="false" when closed');
      }
      
      if (ariaLabels.hamburgerControls !== 'main-sidebar') {
        throw new Error('Hamburger button should have aria-controls pointing to sidebar');
      }
      
      if (ariaLabels.sidebarRole !== 'navigation') {
        throw new Error('Sidebar should have role="navigation"');
      }
    });

    await this.runTest('ARIA states: Update when sidebar toggles', async () => {
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.waitForTimeout(500);
      
      // Open sidebar
      await this.page.click('.mobile-menu-toggle');
      await this.page.waitForTimeout(400);
      
      const ariaStatesOpen = await this.page.evaluate(() => {
        const hamburger = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('[data-sidebar]');
        const overlay = document.querySelector('[data-sidebar-overlay]');
        
        return {
          hamburgerExpanded: hamburger.getAttribute('aria-expanded'),
          hamburgerLabel: hamburger.getAttribute('aria-label'),
          sidebarHidden: sidebar.getAttribute('aria-hidden'),
          overlayHidden: overlay.getAttribute('aria-hidden')
        };
      });
      
      if (ariaStatesOpen.hamburgerExpanded !== 'true') {
        throw new Error('Hamburger aria-expanded should be true when sidebar is open');
      }
      
      if (!ariaStatesOpen.hamburgerLabel.includes('Close')) {
        throw new Error('Hamburger label should indicate close action when sidebar is open');
      }
      
      if (ariaStatesOpen.sidebarHidden !== 'false') {
        throw new Error('Sidebar aria-hidden should be false when visible');
      }
    });
  }

  async testFocusManagement() {
    await this.runTest('Focus management: Focus trapping in mobile overlay', async () => {
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.waitForTimeout(500);
      
      // Open sidebar
      await this.page.click('.mobile-menu-toggle');
      await this.page.waitForTimeout(400);
      
      // Check if focus is trapped within sidebar
      const focusTrapped = await this.page.evaluate(() => {
        const sidebar = document.querySelector('[data-sidebar]');
        const focusableElements = sidebar.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        // Simulate focus moving outside sidebar
        const outsideElement = document.querySelector('.main-content');
        if (outsideElement) {
          outsideElement.focus();
          // Check if focus was redirected back to sidebar
          const activeElement = document.activeElement;
          return sidebar.contains(activeElement);
        }
        
        return focusableElements.length > 0;
      });
      
      if (!focusTrapped) {
        throw new Error('Focus should be trapped within sidebar when overlay is active');
      }
    });
  }

  async testBreakpointTransitions() {
    await this.runTest('Breakpoint transitions: Mobile to tablet', async () => {
      // Start at mobile
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.waitForTimeout(500);
      
      const mobileState = await this.page.evaluate(() => {
        const sidebar = document.querySelector('[data-sidebar]');
        return {
          deviceType: sidebar.getAttribute('data-device-type'),
          isVisible: sidebar.classList.contains('sidebar--visible')
        };
      });
      
      // Transition to tablet
      await this.page.setViewport({ width: 768, height: 1024 });
      await this.page.waitForTimeout(500);
      
      const tabletState = await this.page.evaluate(() => {
        const sidebar = document.querySelector('[data-sidebar]');
        return {
          deviceType: sidebar.getAttribute('data-device-type'),
          isVisible: sidebar.classList.contains('sidebar--visible')
        };
      });
      
      if (mobileState.deviceType !== 'mobile') {
        throw new Error('Should detect mobile device type at 375px width');
      }
      
      if (tabletState.deviceType !== 'tablet') {
        throw new Error('Should detect tablet device type at 768px width');
      }
      
      if (!tabletState.isVisible) {
        throw new Error('Sidebar should be visible by default when transitioning to tablet');
      }
    });

    await this.runTest('Breakpoint transitions: Tablet to desktop', async () => {
      // Start at tablet
      await this.page.setViewport({ width: 768, height: 1024 });
      await this.page.waitForTimeout(500);
      
      // Transition to desktop
      await this.page.setViewport({ width: 1440, height: 900 });
      await this.page.waitForTimeout(500);
      
      const desktopState = await this.page.evaluate(() => {
        const sidebar = document.querySelector('[data-sidebar]');
        return {
          deviceType: sidebar.getAttribute('data-device-type'),
          isVisible: sidebar.classList.contains('sidebar--visible')
        };
      });
      
      if (desktopState.deviceType !== 'desktop') {
        throw new Error('Should detect desktop device type at 1440px width');
      }
      
      if (!desktopState.isVisible) {
        throw new Error('Sidebar should remain visible when transitioning to desktop');
      }
    });
  }

  async testAnimationsAndTransitions() {
    await this.runTest('Animations: Sidebar slide transitions work', async () => {
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.waitForTimeout(500);
      
      // Check if CSS transitions are applied
      const transitionStyles = await this.page.evaluate(() => {
        const sidebar = document.querySelector('[data-sidebar]');
        const computedStyle = window.getComputedStyle(sidebar);
        return {
          transition: computedStyle.transition,
          transform: computedStyle.transform
        };
      });
      
      if (!transitionStyles.transition.includes('transform')) {
        throw new Error('Sidebar should have transform transition for animations');
      }
    });

    await this.runTest('Animations: Reduced motion preference respected', async () => {
      // Simulate reduced motion preference
      await this.page.emulateMediaFeatures([
        { name: 'prefers-reduced-motion', value: 'reduce' }
      ]);
      
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.waitForTimeout(500);
      
      const reducedMotionStyles = await this.page.evaluate(() => {
        const sidebar = document.querySelector('[data-sidebar]');
        const computedStyle = window.getComputedStyle(sidebar);
        return {
          transition: computedStyle.transition,
          animation: computedStyle.animation
        };
      });
      
      // With reduced motion, transitions should be disabled or very short
      const hasReducedTransitions = 
        reducedMotionStyles.transition === 'none' || 
        reducedMotionStyles.transition.includes('0s') ||
        reducedMotionStyles.transition.includes('0ms');
      
      if (!hasReducedTransitions) {
        throw new Error('Animations should be reduced when prefers-reduced-motion is set');
      }
    });
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.passed + this.results.failed,
        passed: this.results.passed,
        failed: this.results.failed,
        successRate: `${Math.round((this.results.passed / (this.results.passed + this.results.failed)) * 100)}%`
      },
      tests: this.results.tests
    };

    const reportPath = path.join(__dirname, '..', 'test-results', 'responsive-behavior-report.json');
    
    // Ensure directory exists
    const reportDir = path.dirname(reportPath);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📊 Test Results Summary:');
    console.log(`   Total Tests: ${report.summary.total}`);
    console.log(`   Passed: ${report.summary.passed}`);
    console.log(`   Failed: ${report.summary.failed}`);
    console.log(`   Success Rate: ${report.summary.successRate}`);
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
    return report;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async run() {
    try {
      await this.init();
      
      console.log('🔍 Testing Mobile Responsive Behavior...');
      await this.testMobileResponsiveBehavior();
      
      console.log('🔍 Testing Tablet Responsive Behavior...');
      await this.testTabletResponsiveBehavior();
      
      console.log('🔍 Testing Desktop Responsive Behavior...');
      await this.testDesktopResponsiveBehavior();
      
      console.log('🔍 Testing Touch Targets...');
      await this.testTouchTargets();
      
      console.log('🔍 Testing Keyboard Navigation...');
      await this.testKeyboardNavigation();
      
      console.log('🔍 Testing ARIA Labels and Screen Reader Support...');
      await this.testAriaLabelsAndScreenReader();
      
      console.log('🔍 Testing Focus Management...');
      await this.testFocusManagement();
      
      console.log('🔍 Testing Breakpoint Transitions...');
      await this.testBreakpointTransitions();
      
      console.log('🔍 Testing Animations and Transitions...');
      await this.testAnimationsAndTransitions();
      
      const report = await this.generateReport();
      
      if (report.summary.failed > 0) {
        console.log('\n❌ Some tests failed. Please review the issues above.');
        process.exit(1);
      } else {
        console.log('\n✅ All tests passed! Responsive behavior is working correctly.');
      }
      
    } catch (error) {
      console.error('💥 Test suite failed to run:', error);
      process.exit(1);
    } finally {
      await this.cleanup();
    }
  }
}

// Run the test suite if this file is executed directly
if (require.main === module) {
  const testSuite = new ResponsiveTestSuite();
  testSuite.run();
}

module.exports = ResponsiveTestSuite;