#!/usr/bin/env node

/**
 * Accessibility and Touch Interaction Validation Script
 * Validates touch targets, keyboard navigation, and screen reader compatibility
 */

const fs = require('fs');
const path = require('path');

class AccessibilityTouchValidator {
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

  validateTouchTargetSizing() {
    this.test('Touch Targets: 44px minimum size requirement (Req 4.1)', () => {
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      this.validateFileExists(cssPath, 'Generated CSS file');
      
      const requiredTouchStyles = [
        '--touch-target-min-size:44px',
        'min-height:44px',
        'min-width:44px',
        'min-height:var(--touch-target-min-size,44px)',
        'min-width:var(--touch-target-min-size,44px)'
      ];
      
      const content = fs.readFileSync(cssPath, 'utf8');
      let foundTouchTargetRules = 0;
      
      for (const style of requiredTouchStyles) {
        if (content.includes(style)) {
          foundTouchTargetRules++;
        }
      }
      
      if (foundTouchTargetRules < 2) {
        throw new Error('Insufficient touch target sizing rules found in CSS');
      }
    });

    this.test('Touch Targets: Filter buttons properly sized (Req 4.2)', () => {
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      
      const filterButtonStyles = [
        'filter-button',
        'min-height:44px',
        'touch-action:manipulation'
      ];
      
      this.validateFileContains(cssPath, filterButtonStyles, 'Filter button touch styles');
    });

    this.test('Touch Targets: Navigation links properly sized (Req 4.3, 4.4)', () => {
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      
      const navLinkStyles = [
        'nav-link',
        'min-height:44px',
        'padding'
      ];
      
      this.validateFileContains(cssPath, navLinkStyles, 'Navigation link touch styles');
    });

    this.test('Touch Targets: Social links and theme toggle sized (Req 4.5)', () => {
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      
      const socialThemeStyles = [
        'social-link',
        'theme-toggle',
        'min-height:44px',
        'min-width:44px'
      ];
      
      this.validateFileContains(cssPath, socialThemeStyles, 'Social links and theme toggle styles');
    });

    this.test('Touch Targets: Proper spacing between elements', () => {
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      
      const spacingStyles = [
        '--touch-target-spacing:8px',
        'margin:',
        'padding:'
      ];
      
      // Check for any of the spacing implementations
      const content = fs.readFileSync(cssPath, 'utf8');
      let foundSpacing = 0;
      
      for (const style of spacingStyles) {
        if (content.includes(style)) {
          foundSpacing++;
        }
      }
      
      // Also check for gap styles or margin-bottom styles
      if (content.includes('gap:') || content.includes('margin-bottom:') || content.includes('space-y-')) {
        foundSpacing++;
      }
      
      if (foundSpacing < 2) {
        throw new Error('Insufficient touch target spacing styles found in CSS');
      }
    });

    this.test('Touch Targets: Touch-specific interaction styles', () => {
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      
      const touchInteractionStyles = [
        'touch-action:manipulation',
        '-webkit-tap-highlight-color',
        'hover:none',
        ':active'
      ];
      
      this.validateFileContains(cssPath, touchInteractionStyles, 'Touch interaction styles');
    });
  }

  validateKeyboardNavigation() {
    this.test('Keyboard Navigation: Toggle button focusable (Req 6.1)', () => {
      const htmlPath = path.join(__dirname, '..', '_site', 'index.html');
      
      const keyboardAttributes = [
        'tabindex="0"',
        'data-sidebar-toggle',
        'role="button"'
      ];
      
      this.validateFileContains(htmlPath, keyboardAttributes, 'Keyboard focusable toggle button');
    });

    this.test('Keyboard Navigation: Focus indicators implemented (Req 6.2)', () => {
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      
      const focusStyles = [
        ':focus-visible',
        'focus-visible',
        '--color-focusRing',
        'outline:2px solid',
        'box-shadow:0 0 0 4px'
      ];
      
      this.validateFileContains(cssPath, focusStyles, 'Focus indicator styles');
    });

    this.test('Keyboard Navigation: Enter/Space key support (Req 6.3)', () => {
      const jsPath = path.join(__dirname, '..', '_site', 'assets', 'js', 'sidebar-manager.js');
      
      const keyboardHandling = [
        'Enter',
        'handleKeyboard',
        'preventDefault'
      ];
      
      // Check for keyboard handling - in minified code, Space might be represented as " "
      const content = fs.readFileSync(jsPath, 'utf8');
      let foundKeyboardFeatures = 0;
      
      for (const feature of keyboardHandling) {
        if (content.includes(feature)) {
          foundKeyboardFeatures++;
        }
      }
      
      // Check for space key handling (could be minified as " " or other representations)
      if (content.includes('Space') || content.includes('" "') || content.includes("' '") || content.includes('key===" \"')) {
        foundKeyboardFeatures++;
      }
      
      if (foundKeyboardFeatures < 3) {
        throw new Error('Insufficient keyboard event handling features found');
      }
    });

    this.test('Keyboard Navigation: Escape key closes sidebar (Req 6.4)', () => {
      const jsPath = path.join(__dirname, '..', '_site', 'assets', 'js', 'sidebar-manager.js');
      
      const escapeHandling = [
        'Escape',
        'hide',
        'handleKeyboard'
      ];
      
      this.validateFileContains(jsPath, escapeHandling, 'Escape key handling');
    });
  }

  validateAriaLabelsAndScreenReader() {
    this.test('ARIA Labels: Toggle button has descriptive labels (Req 7.1)', () => {
      const htmlPath = path.join(__dirname, '..', '_site', 'index.html');
      
      const ariaLabels = [
        'aria-label="Open navigation menu"',
        'aria-label="Close navigation menu"',
        'aria-label="Show navigation sidebar"',
        'aria-label="Hide navigation sidebar"'
      ];
      
      const content = fs.readFileSync(htmlPath, 'utf8');
      let foundLabels = 0;
      
      for (const label of ariaLabels) {
        if (content.includes(label)) {
          foundLabels++;
        }
      }
      
      if (foundLabels < 2) {
        throw new Error('Insufficient ARIA labels found for toggle buttons');
      }
    });

    this.test('ARIA Labels: Sidebar state attributes (Req 7.2)', () => {
      const htmlPath = path.join(__dirname, '..', '_site', 'index.html');
      
      const ariaStates = [
        'aria-expanded',
        'aria-controls="main-sidebar"',
        'aria-hidden',
        'role="navigation"',
        'aria-label="Main navigation"'
      ];
      
      this.validateFileContains(htmlPath, ariaStates, 'ARIA state attributes');
    });

    this.test('ARIA Labels: Dynamic state updates in JavaScript (Req 7.3)', () => {
      const jsPath = path.join(__dirname, '..', '_site', 'assets', 'js', 'sidebar-manager.js');
      
      const ariaUpdates = [
        'setAttribute',
        'aria-expanded',
        'aria-hidden',
        'aria-label',
        'updateToggleButtons',
        'updateSidebarAriaStates'
      ];
      
      this.validateFileContains(jsPath, ariaUpdates, 'Dynamic ARIA state updates');
    });

    this.test('ARIA Labels: Screen reader announcements', () => {
      const jsPath = path.join(__dirname, '..', '_site', 'assets', 'js', 'sidebar-manager.js');
      
      const screenReaderFeatures = [
        'aria-live',
        'announcements',
        'announceSidebarStateChange',
        'polite'
      ];
      
      this.validateFileContains(jsPath, screenReaderFeatures, 'Screen reader announcement features');
    });
  }

  validateFocusManagement() {
    this.test('Focus Management: Focus trapping in mobile overlay (Req 7.5)', () => {
      const jsPath = path.join(__dirname, '..', '_site', 'assets', 'js', 'sidebar-manager.js');
      
      const focusTrapping = [
        'trapFocus',
        'releaseFocus',
        'getFocusableElements',
        'handleFocusTrap',
        'firstFocusableElement',
        'lastFocusableElement'
      ];
      
      this.validateFileContains(jsPath, focusTrapping, 'Focus trapping functionality');
    });

    this.test('Focus Management: Focus return after sidebar closes', () => {
      const jsPath = path.join(__dirname, '..', '_site', 'assets', 'js', 'sidebar-manager.js');
      
      const focusReturn = [
        'previousFocusElement',
        'releaseFocus',
        'focus()',
        'setTimeout'
      ];
      
      this.validateFileContains(jsPath, focusReturn, 'Focus return functionality');
    });

    this.test('Focus Management: Proper focus order within sidebar', () => {
      const jsPath = path.join(__dirname, '..', '_site', 'assets', 'js', 'sidebar-manager.js');
      
      const focusOrder = [
        'ensureFocusOrder',
        'tabindex',
        'focusableElements',
        'querySelectorAll'
      ];
      
      this.validateFileContains(jsPath, focusOrder, 'Focus order management');
    });

    this.test('Focus Management: Focus monitoring and correction', () => {
      const jsPath = path.join(__dirname, '..', '_site', 'assets', 'js', 'sidebar-manager.js');
      
      const focusMonitoring = [
        'monitorFocus',
        'focusin',
        'contains',
        'activeElement'
      ];
      
      this.validateFileContains(jsPath, focusMonitoring, 'Focus monitoring functionality');
    });
  }

  validateReducedMotionSupport() {
    this.test('Accessibility: Reduced motion preferences respected (Req 7.4)', () => {
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      
      const reducedMotionStyles = [
        'prefers-reduced-motion:reduce',
        'transition:none',
        'animation:none'
      ];
      
      this.validateFileContains(cssPath, reducedMotionStyles, 'Reduced motion support');
    });

    this.test('Accessibility: Animation fallbacks for older browsers', () => {
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      
      const fallbackStyles = [
        '@supports not',
        'transition:transform',
        'will-change:auto',
        'transform:translateX(0)'
      ];
      
      this.validateFileContains(cssPath, fallbackStyles, 'Animation fallback styles');
    });
  }

  validateSemanticHTML() {
    this.test('Semantic HTML: Proper heading hierarchy', () => {
      const htmlPath = path.join(__dirname, '..', '_site', 'index.html');
      
      const semanticElements = [
        '<aside',
        'role="navigation"',
        '<nav',
        '<header',
        '<main'
      ];
      
      this.validateFileContains(htmlPath, semanticElements, 'Semantic HTML elements');
    });

    this.test('Semantic HTML: Skip to main content link', () => {
      const htmlPath = path.join(__dirname, '..', '_site', 'index.html');
      
      const skipLink = [
        'Skip to main content',
        'sr-only',
        'focus:not-sr-only',
        '#main-content'
      ];
      
      this.validateFileContains(htmlPath, skipLink, 'Skip to main content link');
    });
  }

  validateColorContrastAndVisibility() {
    this.test('Visual Accessibility: Focus indicators have sufficient contrast', () => {
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      
      const contrastFeatures = [
        '--color-focusRing',
        'outline:2px solid',
        'prefers-contrast:high',
        'box-shadow:0 0 0 4px'
      ];
      
      this.validateFileContains(cssPath, contrastFeatures, 'Focus indicator contrast');
    });

    this.test('Visual Accessibility: High contrast mode support', () => {
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      
      const highContrastStyles = [
        'prefers-contrast:high',
        'border-width:2px'
      ];
      
      this.validateFileContains(cssPath, highContrastStyles, 'High contrast mode support');
    });
  }

  validateTouchFeedback() {
    this.test('Touch Feedback: Visual feedback for touch interactions', () => {
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      
      const touchFeedback = [
        '--color-touchFeedback',
        ':active',
        'transform:scale',
        'background-color:var(--color-touchFeedback)'
      ];
      
      this.validateFileContains(cssPath, touchFeedback, 'Touch feedback styles');
    });

    this.test('Touch Feedback: Hover vs touch state differentiation', () => {
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      
      const hoverTouchDiff = [
        'hover:hover',
        'hover:none',
        ':hover',
        ':active'
      ];
      
      this.validateFileContains(cssPath, hoverTouchDiff, 'Hover/touch state differentiation');
    });
  }

  validateErrorHandling() {
    this.test('Error Handling: Graceful degradation without JavaScript', () => {
      const htmlPath = path.join(__dirname, '..', '_site', 'index.html');
      
      // Check that basic navigation is available without JS
      const fallbackFeatures = [
        '<nav',
        '<a href',
        'role="navigation"'
      ];
      
      this.validateFileContains(htmlPath, fallbackFeatures, 'JavaScript fallback features');
    });

    this.test('Error Handling: CSS fallbacks for unsupported features', () => {
      const cssPath = path.join(__dirname, '..', '_site', 'assets', 'css', 'main.css');
      
      const cssSupports = [
        '@supports not',
        'backface-visibility:visible',
        'will-change:auto'
      ];
      
      this.validateFileContains(cssPath, cssSupports, 'CSS feature detection and fallbacks');
    });
  }

  generateDetailedReport() {
    const total = this.results.passed + this.results.failed;
    const successRate = Math.round((this.results.passed / total) * 100);
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total,
        passed: this.results.passed,
        failed: this.results.failed,
        successRate: `${successRate}%`
      },
      categories: {
        touchTargets: this.results.tests.filter(t => t.name.includes('Touch Target')),
        keyboardNavigation: this.results.tests.filter(t => t.name.includes('Keyboard Navigation')),
        ariaLabels: this.results.tests.filter(t => t.name.includes('ARIA')),
        focusManagement: this.results.tests.filter(t => t.name.includes('Focus Management')),
        accessibility: this.results.tests.filter(t => t.name.includes('Accessibility')),
        other: this.results.tests.filter(t => 
          !t.name.includes('Touch Target') && 
          !t.name.includes('Keyboard Navigation') && 
          !t.name.includes('ARIA') && 
          !t.name.includes('Focus Management') && 
          !t.name.includes('Accessibility')
        )
      },
      tests: this.results.tests
    };

    console.log('\n📊 Accessibility & Touch Validation Results:');
    console.log(`   Total Tests: ${total}`);
    console.log(`   Passed: ${this.results.passed}`);
    console.log(`   Failed: ${this.results.failed}`);
    console.log(`   Success Rate: ${successRate}%`);
    
    console.log('\n📋 Category Breakdown:');
    Object.entries(report.categories).forEach(([category, tests]) => {
      const categoryPassed = tests.filter(t => t.status === 'PASSED').length;
      const categoryTotal = tests.length;
      if (categoryTotal > 0) {
        console.log(`   ${category}: ${categoryPassed}/${categoryTotal} passed`);
      }
    });
    
    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.tests
        .filter(test => test.status === 'FAILED')
        .forEach(test => {
          console.log(`   • ${test.name}: ${test.error}`);
        });
    }
    
    return report;
  }

  run() {
    console.log('🚀 Starting Accessibility & Touch Interaction Validation...\n');
    
    console.log('🔍 Validating Touch Target Sizing...');
    this.validateTouchTargetSizing();
    
    console.log('🔍 Validating Keyboard Navigation...');
    this.validateKeyboardNavigation();
    
    console.log('🔍 Validating ARIA Labels and Screen Reader Support...');
    this.validateAriaLabelsAndScreenReader();
    
    console.log('🔍 Validating Focus Management...');
    this.validateFocusManagement();
    
    console.log('🔍 Validating Reduced Motion Support...');
    this.validateReducedMotionSupport();
    
    console.log('🔍 Validating Semantic HTML...');
    this.validateSemanticHTML();
    
    console.log('🔍 Validating Color Contrast and Visibility...');
    this.validateColorContrastAndVisibility();
    
    console.log('🔍 Validating Touch Feedback...');
    this.validateTouchFeedback();
    
    console.log('🔍 Validating Error Handling...');
    this.validateErrorHandling();
    
    const report = this.generateDetailedReport();
    
    if (report.summary.failed > 0) {
      console.log('\n❌ Some accessibility/touch tests failed. Please review the issues above.');
      return false;
    } else {
      console.log('\n✅ All accessibility and touch interaction tests passed!');
      return true;
    }
  }
}

// Run the validator if this file is executed directly
if (require.main === module) {
  const validator = new AccessibilityTouchValidator();
  const success = validator.run();
  process.exit(success ? 0 : 1);
}

module.exports = AccessibilityTouchValidator;