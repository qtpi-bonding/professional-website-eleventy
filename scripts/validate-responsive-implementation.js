#!/usr/bin/env node

/**
 * Responsive Implementation Validation Script
 * Validates that all responsive features are properly implemented
 * without requiring browser automation
 */

const fs = require('fs');
const path = require('path');

class ResponsiveValidator {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  test(name, testFn) {
    try {
      console.log(`🧪 Testing: ${name}`);
      testFn();
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

  validateFileExists(filePath, description) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`${description} not found at ${filePath}`);
    }
  }

  validateFileContains(filePath, searchTerms, description) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    for (const term of searchTerms) {
      if (!content.includes(term)) {
        throw new Error(`${description} missing required content: ${term}`);
      }
    }
  }

  validateCSSBreakpoints() {
    this.test('CSS: Responsive breakpoints defined', () => {
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      this.validateFileExists(cssPath, 'Generated CSS file');
      
      const requiredBreakpoints = [
        '--breakpoint-mobile:0px',
        '--breakpoint-tablet:768px', 
        '--breakpoint-desktop:1024px',
        'min-width:768px',
        'min-width:1024px'
      ];
      
      this.validateFileContains(cssPath, requiredBreakpoints, 'CSS breakpoints');
    });

    this.test('CSS: Sidebar responsive styles', () => {
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      
      const requiredStyles = [
        'sidebar--visible',
        'sidebar--hidden',
        'main-content--sidebar-hidden',
        'mobile-menu-toggle',
        'floating-sidebar-toggle',
        'sidebar-overlay'
      ];
      
      this.validateFileContains(cssPath, requiredStyles, 'Sidebar responsive styles');
    });

    this.test('CSS: Touch target sizing', () => {
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      
      const touchTargetStyles = [
        '--touch-target-min-size:44px',
        'min-height:44px',
        'min-width:44px'
      ];
      
      this.validateFileContains(cssPath, touchTargetStyles, 'Touch target sizing');
    });

    this.test('CSS: Animation and transition styles', () => {
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      
      const animationStyles = [
        'transition:transform',
        'prefers-reduced-motion:reduce',
        'cubic-bezier'
      ];
      
      this.validateFileContains(cssPath, animationStyles, 'Animation styles');
    });
  }

  validateHTMLStructure() {
    this.test('HTML: Mobile menu button present', () => {
      const htmlPath = path.join(__dirname, '..', '_site', 'index.html');
      this.validateFileExists(htmlPath, 'Generated HTML file');
      
      const requiredElements = [
        'mobile-menu-toggle',
        'data-sidebar-toggle',
        'aria-label="Open navigation menu"',
        'hamburger-line'
      ];
      
      this.validateFileContains(htmlPath, requiredElements, 'Mobile menu button');
    });

    this.test('HTML: Sidebar structure and attributes', () => {
      const htmlPath = path.join(__dirname, '..', '_site', 'index.html');
      
      const sidebarElements = [
        'data-sidebar',
        'role="navigation"',
        'aria-label="Main navigation"',
        'data-sidebar-state',
        'sidebar-close-button',
        'sidebar-toggle-button'
      ];
      
      this.validateFileContains(htmlPath, sidebarElements, 'Sidebar structure');
    });

    this.test('HTML: Overlay and floating toggle', () => {
      const htmlPath = path.join(__dirname, '..', '_site', 'index.html');
      
      const overlayElements = [
        'sidebar-overlay',
        'data-sidebar-overlay',
        'floating-sidebar-toggle',
        'aria-hidden="true"'
      ];
      
      this.validateFileContains(htmlPath, overlayElements, 'Overlay and floating toggle');
    });

    this.test('HTML: Accessibility attributes', () => {
      const htmlPath = path.join(__dirname, '..', '_site', 'index.html');
      
      const accessibilityAttributes = [
        'aria-expanded',
        'aria-controls',
        'aria-label',
        'aria-hidden',
        'tabindex="0"'
      ];
      
      this.validateFileContains(htmlPath, accessibilityAttributes, 'Accessibility attributes');
    });
  }

  validateJavaScript() {
    this.test('JavaScript: Sidebar manager exists', () => {
      const jsPath = path.join(__dirname, '..', '_site', 'assets', 'js', 'sidebar-manager.js');
      this.validateFileExists(jsPath, 'Sidebar manager JavaScript');
      
      const content = fs.readFileSync(jsPath, 'utf8');
      if (content.length < 1000) {
        throw new Error('Sidebar manager JavaScript appears to be empty or too small');
      }
    });

    this.test('JavaScript: Core functionality present', () => {
      const jsPath = path.join(__dirname, '..', '_site', 'assets', 'js', 'sidebar-manager.js');
      
      // Check for key methods and functionality (even in minified code)
      const requiredFunctionality = [
        'getDeviceType',
        'show',
        'hide',
        'toggle',
        'trapFocus',
        'handleKeyboard',
        'updateDeviceType'
      ];
      
      this.validateFileContains(jsPath, requiredFunctionality, 'Core JavaScript functionality');
    });

    this.test('JavaScript: Device detection and preferences', () => {
      const jsPath = path.join(__dirname, '..', '_site', 'assets', 'js', 'sidebar-manager.js');
      
      const deviceFeatures = [
        'mobile',
        'tablet', 
        'desktop',
        'localStorage',
        'preferences'
      ];
      
      this.validateFileContains(jsPath, deviceFeatures, 'Device detection and preferences');
    });
  }

  validateThemeIntegration() {
    this.test('Theme: Responsive variables in theme config', () => {
      const themePath = path.join(__dirname, '..', 'src', '_data', 'app-theme.json');
      this.validateFileExists(themePath, 'Theme configuration');
      
      const themeContent = fs.readFileSync(themePath, 'utf8');
      const themeData = JSON.parse(themeContent);
      
      if (!themeData.responsive) {
        throw new Error('Theme config missing responsive section');
      }
      
      if (!themeData.responsive.breakpoints) {
        throw new Error('Theme config missing responsive breakpoints');
      }
      
      if (!themeData.responsive.sidebar) {
        throw new Error('Theme config missing responsive sidebar settings');
      }
      
      if (!themeData.responsive.touchTargets) {
        throw new Error('Theme config missing touch target settings');
      }
    });

    this.test('Theme: Generated CSS includes responsive variables', () => {
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      
      const themeVariables = [
        '--color-sidebarOverlay',
        '--color-hamburgerLine',
        '--color-toggleButton',
        '--color-focusRing',
        '--color-touchFeedback'
      ];
      
      this.validateFileContains(cssPath, themeVariables, 'Responsive theme variables');
    });
  }

  validateRequirementsCoverage() {
    this.test('Requirements: Mobile behavior (Req 1.1-1.6)', () => {
      const htmlPath = path.join(__dirname, '..', '_site', 'index.html');
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      
      // Check for mobile-specific implementations
      const mobileFeatures = [
        'mobile-menu-toggle',
        'sidebar-overlay',
        'hamburger-line',
        'max-width:767px'
      ];
      
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      
      for (const feature of mobileFeatures) {
        if (!htmlContent.includes(feature) && !cssContent.includes(feature)) {
          throw new Error(`Mobile feature missing: ${feature}`);
        }
      }
    });

    this.test('Requirements: Tablet behavior (Req 2.1-2.3)', () => {
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      
      const tabletFeatures = [
        'min-width:768px',
        'main-content--sidebar-hidden',
        'sidebar-toggle-button'
      ];
      
      this.validateFileContains(cssPath, tabletFeatures, 'Tablet behavior features');
    });

    this.test('Requirements: Desktop behavior (Req 3.1-3.3)', () => {
      const htmlPath = path.join(__dirname, '..', '_site', 'index.html');
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      
      const desktopFeatures = [
        'floating-sidebar-toggle',
        'min-width:1024px',
        'localStorage'
      ];
      
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      const jsContent = fs.readFileSync(path.join(__dirname, '..', '_site', 'assets', 'js', 'sidebar-manager.js'), 'utf8');
      
      for (const feature of desktopFeatures) {
        if (!htmlContent.includes(feature) && !cssContent.includes(feature) && !jsContent.includes(feature)) {
          throw new Error(`Desktop feature missing: ${feature}`);
        }
      }
    });

    this.test('Requirements: Touch targets (Req 4.1-4.5)', () => {
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      
      const touchFeatures = [
        '--touch-target-min-size:44px',
        'min-height:44px',
        'touch-action:manipulation',
        '-webkit-tap-highlight-color'
      ];
      
      this.validateFileContains(cssPath, touchFeatures, 'Touch target features');
    });

    this.test('Requirements: Accessibility (Req 6.1-7.5)', () => {
      const htmlPath = path.join(__dirname, '..', '_site', 'index.html');
      const jsPath = path.join(__dirname, '..', '_site', 'assets', 'js', 'sidebar-manager.js');
      
      const accessibilityFeatures = [
        'aria-label',
        'aria-expanded',
        'aria-controls',
        'aria-hidden',
        'role="navigation"',
        'trapFocus',
        'handleKeyboard'
      ];
      
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      const jsContent = fs.readFileSync(jsPath, 'utf8');
      
      for (const feature of accessibilityFeatures) {
        if (!htmlContent.includes(feature) && !jsContent.includes(feature)) {
          throw new Error(`Accessibility feature missing: ${feature}`);
        }
      }
    });
  }

  generateSummary() {
    const total = this.results.passed + this.results.failed;
    const successRate = Math.round((this.results.passed / total) * 100);
    
    console.log('\n📊 Validation Results Summary:');
    console.log(`   Total Tests: ${total}`);
    console.log(`   Passed: ${this.results.passed}`);
    console.log(`   Failed: ${this.results.failed}`);
    console.log(`   Success Rate: ${successRate}%`);
    
    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.tests
        .filter(test => test.status === 'FAILED')
        .forEach(test => {
          console.log(`   • ${test.name}: ${test.error}`);
        });
    }
    
    return {
      total,
      passed: this.results.passed,
      failed: this.results.failed,
      successRate: `${successRate}%`,
      allPassed: this.results.failed === 0
    };
  }

  run() {
    console.log('🚀 Starting Responsive Implementation Validation...\n');
    
    console.log('🔍 Validating CSS Implementation...');
    this.validateCSSBreakpoints();
    
    console.log('🔍 Validating HTML Structure...');
    this.validateHTMLStructure();
    
    console.log('🔍 Validating JavaScript Implementation...');
    this.validateJavaScript();
    
    console.log('🔍 Validating Theme Integration...');
    this.validateThemeIntegration();
    
    console.log('🔍 Validating Requirements Coverage...');
    this.validateRequirementsCoverage();
    
    const summary = this.generateSummary();
    
    if (summary.allPassed) {
      console.log('\n✅ All validation tests passed! Responsive implementation is complete.');
      return true;
    } else {
      console.log('\n❌ Some validation tests failed. Please review the issues above.');
      return false;
    }
  }
}

// Run the validator if this file is executed directly
if (require.main === module) {
  const validator = new ResponsiveValidator();
  const success = validator.run();
  process.exit(success ? 0 : 1);
}

module.exports = ResponsiveValidator;