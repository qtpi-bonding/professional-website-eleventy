/**
 * Sidebar Manager - Responsive sidebar with proper device detection and state management
 * Mobile: Hidden by default, Desktop: Visible by default
 * No preference persistence - always resets to default state
 */

class SimpleSidebarManager {
  constructor() {
    // Core elements
    this.sidebar = null;
    this.overlay = null;
    this.toggleButtons = [];
    this.mainContent = null;
    this.floatingToggle = null;
    
    // State management - no persistence
    this.isVisible = false;
    this.isMobile = false;
    this.isAnimating = false;
    
    // Device detection constants
    this.MOBILE_BREAKPOINT = 1024; // Consistent 1024px breakpoint
    
    this.init();
  }
  
  init() {
    console.log('🔧 Initializing SimpleSidebarManager...');
    
    // Find DOM elements
    this.findElements();
    
    if (!this.sidebar) {
      console.warn('SimpleSidebarManager: Sidebar element not found');
      return;
    }
    
    // Set up device detection and reset to default state
    this.updateDeviceType();
    this.resetToDefault();
    
    // Bind event listeners
    this.bindEvents();
    
    // Set up accessibility
    this.setupAccessibility();
    
    console.log('✅ SimpleSidebarManager initialized');
  }
  
  findElements() {
    this.sidebar = document.querySelector('[data-sidebar]');
    this.overlay = document.querySelector('[data-sidebar-overlay]');
    this.toggleButtons = Array.from(document.querySelectorAll('[data-sidebar-toggle]'));
    this.mainContent = document.querySelector('.main-content');
    this.floatingToggle = document.querySelector('.floating-sidebar-toggle');
    
    console.log('🔍 Found elements:', {
      sidebar: !!this.sidebar,
      overlay: !!this.overlay,
      toggleButtons: this.toggleButtons.length,
      mainContent: !!this.mainContent,
      floatingToggle: !!this.floatingToggle
    });
  }
  
  // Device detection using consistent 1024px breakpoint
  updateDeviceType() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= this.MOBILE_BREAKPOINT;
    
    if (wasMobile !== this.isMobile) {
      console.log('📱 Device type changed to:', this.isMobile ? 'mobile' : 'desktop');
      return true;
    }
    
    return false;
  }
  
  // Get default state for current device type
  getDefaultState() {
    // Requirements: mobile=hidden, desktop=visible
    return !this.isMobile;
  }
  
  // Reset to default state (no preference persistence)
  resetToDefault() {
    console.log('🔄 Resetting to default state for', this.isMobile ? 'mobile' : 'desktop');
    
    const defaultState = this.getDefaultState();
    
    if (defaultState) {
      this.showSidebar();
    } else {
      this.hideSidebar();
    }
  }
  
  // Show sidebar with proper state management
  showSidebar() {
    if (this.isAnimating) return;
    
    console.log('📱 Showing sidebar');
    
    this.isVisible = true;
    this.isAnimating = true;
    
    // Update sidebar state
    this.sidebar.classList.add('sidebar--visible');
    this.sidebar.setAttribute('aria-hidden', 'false');
    this.sidebar.setAttribute('data-sidebar-state', 'visible');
    
    if (this.isMobile) {
      // Mobile: show overlay
      this.showOverlay();
    } else {
      // Desktop: adjust main content margin and hide floating toggle
      if (this.mainContent) {
        this.mainContent.classList.remove('main-content--sidebar-hidden');
      }
      this.hideFloatingToggle();
    }
    
    this.updateToggleButtons();
    this.manageSidebarFocus();
    this.announceSidebarState();
    
    // Reset animation flag after transition completes
    setTimeout(() => {
      this.isAnimating = false;
    }, 300);
  }
  
  hideSidebar() {
    if (this.isAnimating) return;
    
    console.log('📱 Hiding sidebar');
    
    this.isVisible = false;
    this.isAnimating = true;
    
    // Update sidebar state
    this.sidebar.classList.remove('sidebar--visible');
    this.sidebar.setAttribute('aria-hidden', 'true');
    this.sidebar.setAttribute('data-sidebar-state', 'hidden');
    
    if (this.isMobile) {
      // Mobile: hide overlay
      this.hideOverlay();
    } else {
      // Desktop: adjust main content margin and show floating toggle
      if (this.mainContent) {
        this.mainContent.classList.add('main-content--sidebar-hidden');
      }
      this.showFloatingToggle();
    }
    
    this.updateToggleButtons();
    this.manageSidebarFocus();
    this.announceSidebarState();
    
    // Reset animation flag after transition completes
    setTimeout(() => {
      this.isAnimating = false;
    }, 300);
  }
  
  toggle() {
    if (this.isAnimating) return;
    
    console.log('🔄 Toggling sidebar');
    
    // Allow toggling on all devices
    if (this.isVisible) {
      this.hideSidebar();
    } else {
      this.showSidebar();
    }
  }
  
  // Overlay Management (Mobile Only)
  showOverlay() {
    if (!this.overlay) return;
    
    this.overlay.classList.add('sidebar-overlay--visible');
    this.overlay.setAttribute('aria-hidden', 'false');
    this.overlay.style.display = 'block';
    
    console.log('🌫️ Overlay shown');
  }
  
  hideOverlay() {
    if (!this.overlay) return;
    
    this.overlay.classList.remove('sidebar-overlay--visible');
    this.overlay.setAttribute('aria-hidden', 'true');
    
    // Hide overlay after animation completes
    setTimeout(() => {
      if (!this.isVisible) {
        this.overlay.style.display = 'none';
      }
    }, 300);
    
    console.log('🌫️ Overlay hidden');
  }
  
  // Floating Toggle Management (Desktop Only)
  showFloatingToggle() {
    if (!this.floatingToggle || this.isMobile) return;
    
    this.floatingToggle.classList.add('floating-sidebar-toggle--visible');
    this.floatingToggle.style.display = 'block';
    this.floatingToggle.setAttribute('aria-hidden', 'false');
    
    console.log('🎈 Floating toggle shown');
  }
  
  hideFloatingToggle() {
    if (!this.floatingToggle) return;
    
    this.floatingToggle.classList.remove('floating-sidebar-toggle--visible');
    this.floatingToggle.setAttribute('aria-hidden', 'true');
    
    // Hide floating toggle after animation completes
    setTimeout(() => {
      if (this.isVisible || this.isMobile) {
        this.floatingToggle.style.display = 'none';
      }
    }, 300);
    
    console.log('🎈 Floating toggle hidden');
  }
  

  
  // Apply correct state based on device type (deprecated - use resetToDefault)
  applyCorrectState() {
    console.log('⚠️ applyCorrectState is deprecated, use resetToDefault instead');
    this.resetToDefault();
  }
  
  // Enhanced accessibility setup
  setupAccessibility() {
    if (!this.sidebar) return;
    
    // Ensure sidebar has proper ARIA attributes
    this.sidebar.setAttribute('role', 'navigation');
    this.sidebar.setAttribute('aria-label', 'Main navigation');
    this.sidebar.setAttribute('id', 'main-sidebar');
    
    // Ensure all toggle buttons are properly configured
    this.toggleButtons.forEach(button => {
      // Set proper role and tabindex
      if (!button.hasAttribute('tabindex')) {
        button.setAttribute('tabindex', '0');
      }
      button.setAttribute('aria-controls', 'main-sidebar');
      button.setAttribute('role', 'button');
      
      // Add keyboard event listeners for accessibility
      button.addEventListener('keydown', (e) => {
        // Handle Enter and Space keys for button activation
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          
          // Prevent rapid toggle clicks during animations
          if (this.isAnimating) {
            console.log('🚫 Keyboard toggle blocked - animation in progress');
            return;
          }
          
          console.log('⌨️ Keyboard toggle activated:', e.key);
          this.toggle();
        }
      });
    });
    
    // Ensure overlay has proper attributes
    if (this.overlay) {
      this.overlay.setAttribute('role', 'presentation');
      this.overlay.setAttribute('aria-label', 'Sidebar overlay');
    }
    
    // Ensure floating toggle has proper attributes when it exists
    if (this.floatingToggle) {
      this.floatingToggle.setAttribute('role', 'button');
      this.floatingToggle.setAttribute('aria-controls', 'main-sidebar');
      if (!this.floatingToggle.hasAttribute('tabindex')) {
        this.floatingToggle.setAttribute('tabindex', '0');
      }
    }
    
    // Set initial ARIA states
    this.updateToggleButtons();
    
    console.log('♿ Enhanced accessibility attributes set');
  }
  
  // Window Resize Handling with state reset
  handleResize() {
    const deviceTypeChanged = this.updateDeviceType();
    
    if (deviceTypeChanged) {
      console.log('📐 Window resized, device type changed - resetting to default state');
      
      // Clean up previous device state
      this.hideOverlay();
      this.hideFloatingToggle();
      
      // Reset to default state for new device type (no preference persistence)
      this.resetToDefault();
    }
  }
  
  // Debounced resize handler for better performance
  createDebouncedResize() {
    let resizeTimeout;
    return () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.handleResize(), 150);
    };
  }
  

  

  
  // Enhanced toggle button management with comprehensive ARIA support
  updateToggleButtons() {
    this.toggleButtons.forEach(button => {
      // Update aria-expanded for all toggle buttons
      button.setAttribute('aria-expanded', this.isVisible.toString());
      
      // Update aria-pressed to indicate current state (for toggle buttons)
      button.setAttribute('aria-pressed', this.isVisible.toString());
      
      // Update visual state classes
      if (this.isVisible) {
        button.classList.add('mobile-menu-toggle--active');
      } else {
        button.classList.remove('mobile-menu-toggle--active');
      }
      
      // Update aria-label based on current state and device type
      this.updateButtonAriaLabel(button);
      
      // Ensure aria-controls is set for all toggle buttons
      button.setAttribute('aria-controls', 'main-sidebar');
      
      // Set aria-describedby for additional context
      if (!button.hasAttribute('aria-describedby')) {
        button.setAttribute('aria-describedby', 'sidebar-description');
      }
      
      // Ensure proper role and tabindex
      if (!button.hasAttribute('role')) {
        button.setAttribute('role', 'button');
      }
      if (!button.hasAttribute('tabindex')) {
        button.setAttribute('tabindex', '0');
      }
    });
    
    // Update sidebar ARIA state and properties
    this.updateSidebarAriaState();
    
    // Update overlay ARIA state (only visible on mobile when sidebar is open)
    this.updateOverlayAriaState();
    
    // Update floating toggle ARIA state (only visible on desktop when sidebar is hidden)
    this.updateFloatingToggleAriaState();
    
    // Ensure sidebar description exists
    this.ensureSidebarDescription();
    
    console.log('♿ Enhanced ARIA attributes updated - sidebar visible:', this.isVisible, 'mobile:', this.isMobile);
  }
  
  // Helper method to update button ARIA labels based on context
  updateButtonAriaLabel(button) {
    if (this.isVisible) {
      // Sidebar is open - buttons should indicate closing action
      if (button.classList.contains('mobile-menu-toggle')) {
        button.setAttribute('aria-label', 'Close navigation menu');
      } else if (button.classList.contains('sidebar-toggle-button')) {
        button.setAttribute('aria-label', 'Hide navigation sidebar');
      } else if (button.classList.contains('sidebar-close-button')) {
        button.setAttribute('aria-label', 'Close navigation');
      } else {
        // Generic toggle button
        button.setAttribute('aria-label', this.isMobile ? 'Close navigation menu' : 'Hide navigation sidebar');
      }
    } else {
      // Sidebar is closed - buttons should indicate opening action
      if (button.classList.contains('mobile-menu-toggle')) {
        button.setAttribute('aria-label', 'Open navigation menu');
      } else if (button.classList.contains('floating-sidebar-toggle')) {
        button.setAttribute('aria-label', 'Show navigation sidebar');
      } else {
        // Generic toggle button
        button.setAttribute('aria-label', this.isMobile ? 'Open navigation menu' : 'Show navigation sidebar');
      }
    }
  }
  
  // Helper method to update sidebar ARIA state
  updateSidebarAriaState() {
    if (!this.sidebar) return;
    
    this.sidebar.setAttribute('aria-hidden', (!this.isVisible).toString());
    this.sidebar.setAttribute('aria-expanded', this.isVisible.toString());
    
    // Ensure sidebar has proper navigation role and label
    if (!this.sidebar.hasAttribute('role')) {
      this.sidebar.setAttribute('role', 'navigation');
    }
    if (!this.sidebar.hasAttribute('aria-label')) {
      this.sidebar.setAttribute('aria-label', 'Main navigation');
    }
    if (!this.sidebar.hasAttribute('id')) {
      this.sidebar.setAttribute('id', 'main-sidebar');
    }
  }
  
  // Helper method to update overlay ARIA state
  updateOverlayAriaState() {
    if (!this.overlay) return;
    
    const overlayVisible = this.isVisible && this.isMobile;
    this.overlay.setAttribute('aria-hidden', (!overlayVisible).toString());
    
    if (overlayVisible) {
      // Overlay is visible and interactive on mobile
      this.overlay.setAttribute('aria-label', 'Sidebar overlay - click to close navigation');
      this.overlay.setAttribute('role', 'button');
      this.overlay.setAttribute('tabindex', '0');
    } else {
      // Overlay is hidden or not interactive
      this.overlay.setAttribute('role', 'presentation');
      this.overlay.removeAttribute('tabindex');
      this.overlay.removeAttribute('aria-label');
    }
  }
  
  // Helper method to update floating toggle ARIA state
  updateFloatingToggleAriaState() {
    if (!this.floatingToggle) return;
    
    const shouldShowFloating = !this.isVisible && !this.isMobile;
    this.floatingToggle.setAttribute('aria-hidden', (!shouldShowFloating).toString());
    this.floatingToggle.setAttribute('aria-expanded', this.isVisible.toString());
    this.floatingToggle.setAttribute('aria-pressed', this.isVisible.toString());
    
    // Ensure proper attributes for floating toggle
    if (!this.floatingToggle.hasAttribute('aria-controls')) {
      this.floatingToggle.setAttribute('aria-controls', 'main-sidebar');
    }
    if (!this.floatingToggle.hasAttribute('role')) {
      this.floatingToggle.setAttribute('role', 'button');
    }
    if (!this.floatingToggle.hasAttribute('tabindex')) {
      this.floatingToggle.setAttribute('tabindex', '0');
    }
  }
  
  // Helper method to ensure sidebar description exists
  ensureSidebarDescription() {
    if (!document.getElementById('sidebar-description')) {
      const description = document.createElement('div');
      description.id = 'sidebar-description';
      description.className = 'sr-only';
      description.textContent = 'Navigation sidebar containing personal information, menu links, and content filters';
      document.body.appendChild(description);
    }
  }
  
  // Event Binding
  bindEvents() {
    console.log('🔗 Binding events...');
    
    // Toggle button clicks with animation prevention
    this.toggleButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Prevent rapid toggle clicks during animations
        if (this.isAnimating) {
          console.log('🚫 Toggle blocked - animation in progress');
          return;
        }
        
        console.log('🔄 Toggle button clicked:', button.getAttribute('aria-label'));
        this.toggle();
      });
      
      // Add visual feedback for button press
      button.addEventListener('mousedown', (e) => {
        button.style.transform = 'scale(0.95)';
      });
      
      button.addEventListener('mouseup', (e) => {
        button.style.transform = '';
      });
      
      button.addEventListener('mouseleave', (e) => {
        button.style.transform = '';
      });
    });
    

    
    // Overlay click to close (mobile only)
    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        // Only close if clicking directly on overlay (not child elements)
        if (e.target === this.overlay && this.isMobile && this.isVisible) {
          console.log('🌫️ Overlay clicked - closing sidebar');
          this.hideSidebar();
        }
      });
      
      // Prevent clicks inside sidebar from bubbling to overlay
      if (this.sidebar) {
        this.sidebar.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
    }
    
    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Escape key to close sidebar
      if (e.key === 'Escape' && this.isVisible) {
        e.preventDefault();
        console.log('⌨️ Escape key pressed - closing sidebar');
        this.hideSidebar();
        
        // Return focus to appropriate toggle button
        this.returnFocusToToggle();
      }
      
      // Tab key management for focus trapping when sidebar is open
      if (e.key === 'Tab' && this.isVisible) {
        // On mobile, always trap focus within sidebar
        // On desktop, allow normal tab flow but enhance navigation
        if (this.isMobile) {
          this.handleTabKeyNavigation(e);
        }
      }
      
      // Arrow key navigation within sidebar (optional enhancement)
      if (this.isVisible && this.sidebar && this.sidebar.contains(document.activeElement)) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          this.handleArrowKeyNavigation(e);
        }
      }
    });
    
    // Add keyboard support for overlay
    if (this.overlay) {
      this.overlay.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && this.isMobile && this.isVisible) {
          e.preventDefault();
          console.log('⌨️ Overlay activated via keyboard - closing sidebar');
          this.hideSidebar();
          this.returnFocusToToggle();
        }
      });
    }
    
    // Window resize events (debounced)
    this.debouncedResize = this.createDebouncedResize();
    window.addEventListener('resize', this.debouncedResize);
    
    console.log('✅ Events bound');
  }
  

  
  // Enhanced focus management methods
  returnFocusToToggle() {
    // Determine which toggle button should receive focus based on current state
    let targetToggle = null;
    
    if (this.isMobile) {
      // On mobile, always focus the hamburger menu button
      targetToggle = document.querySelector('.mobile-menu-toggle[data-sidebar-toggle]');
    } else {
      // On desktop, focus the appropriate toggle based on sidebar visibility
      if (this.isVisible) {
        // Sidebar is visible, focus the collapse button inside sidebar
        targetToggle = document.querySelector('.sidebar-toggle-button[data-sidebar-toggle]');
      } else {
        // Sidebar is hidden, focus the floating toggle button
        targetToggle = document.querySelector('.floating-sidebar-toggle[data-sidebar-toggle]');
      }
    }
    
    // Focus the target toggle if it exists and is visible
    if (targetToggle && this.isElementVisible(targetToggle)) {
      setTimeout(() => {
        targetToggle.focus();
        
        // Add visual focus indicator
        targetToggle.classList.add('focus-visible');
        setTimeout(() => {
          targetToggle.classList.remove('focus-visible');
        }, 2000);
        
        console.log('♿ Focus returned to toggle button:', targetToggle.getAttribute('aria-label'));
      }, 150); // Delay to ensure DOM updates and animations are complete
    } else {
      console.warn('♿ Could not find appropriate toggle button to focus');
    }
  }
  
  // Enhanced method to set focus to first focusable element in sidebar
  focusFirstSidebarElement() {
    if (!this.sidebar || !this.isVisible) return;
    
    const focusableElements = this.getFocusableElementsInSidebar();
    if (focusableElements.length > 0) {
      setTimeout(() => {
        focusableElements[0].focus();
        console.log('♿ Focus set to first sidebar element');
      }, 150);
    }
  }
  
  // Helper method to get all focusable elements in sidebar
  getFocusableElementsInSidebar() {
    if (!this.sidebar) return [];
    
    const focusableSelectors = [
      'button:not([disabled]):not([aria-hidden="true"])',
      '[href]:not([disabled]):not([aria-hidden="true"])',
      'input:not([disabled]):not([aria-hidden="true"])',
      'select:not([disabled]):not([aria-hidden="true"])',
      'textarea:not([disabled]):not([aria-hidden="true"])',
      '[tabindex]:not([tabindex="-1"]):not([disabled]):not([aria-hidden="true"])'
    ].join(', ');
    
    return Array.from(this.sidebar.querySelectorAll(focusableSelectors))
      .filter(element => this.isElementVisible(element));
  }
  
  isElementVisible(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           element.offsetParent !== null;
  }
  
  handleTabKeyNavigation(e) {
    if (!this.sidebar || !this.isVisible) return;
    
    // Get all focusable elements within the sidebar
    const focusableElements = this.getFocusableElementsInSidebar();
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;
    
    // Check if focus is currently within the sidebar
    const focusInSidebar = this.sidebar.contains(activeElement);
    
    if (!focusInSidebar && !e.shiftKey) {
      // Tab into sidebar from outside - focus first element
      e.preventDefault();
      firstElement.focus();
      console.log('♿ Tab navigation: Focused first sidebar element');
      return;
    }
    
    if (focusInSidebar) {
      // Focus is within sidebar - handle tab trapping
      if (e.shiftKey && activeElement === firstElement) {
        // Shift+tab on first element - focus last element
        e.preventDefault();
        lastElement.focus();
        console.log('♿ Tab navigation: Wrapped to last sidebar element');
      } else if (!e.shiftKey && activeElement === lastElement) {
        // Tab on last element - focus first element
        e.preventDefault();
        firstElement.focus();
        console.log('♿ Tab navigation: Wrapped to first sidebar element');
      }
    }
  }
  
  // Enhanced focus management for sidebar content
  manageSidebarFocus() {
    if (!this.sidebar) return;
    
    const focusableElements = this.getFocusableElementsInSidebar();
    
    focusableElements.forEach(element => {
      if (this.isVisible) {
        // Sidebar is visible - ensure elements are focusable
        if (element.getAttribute('tabindex') === '-1') {
          element.removeAttribute('tabindex');
        }
        // Ensure elements are not hidden from screen readers
        if (element.getAttribute('aria-hidden') === 'true') {
          element.removeAttribute('aria-hidden');
        }
      } else {
        // Sidebar is hidden - prevent focus on sidebar elements
        const originalTabIndex = element.getAttribute('data-original-tabindex');
        if (originalTabIndex !== null) {
          // Restore original tabindex
          element.setAttribute('tabindex', originalTabIndex);
          element.removeAttribute('data-original-tabindex');
        } else if (!element.hasAttribute('tabindex') || element.getAttribute('tabindex') !== '-1') {
          // Store original tabindex and set to -1
          const currentTabIndex = element.getAttribute('tabindex');
          if (currentTabIndex && currentTabIndex !== '-1') {
            element.setAttribute('data-original-tabindex', currentTabIndex);
          }
          element.setAttribute('tabindex', '-1');
        }
      }
    });
    
    // Also manage focus for toggle buttons inside sidebar
    const sidebarToggleButtons = this.sidebar.querySelectorAll('[data-sidebar-toggle]');
    sidebarToggleButtons.forEach(button => {
      if (this.isVisible) {
        button.removeAttribute('tabindex');
        button.removeAttribute('aria-hidden');
      } else {
        button.setAttribute('tabindex', '-1');
      }
    });
    
    console.log('♿ Sidebar focus management updated - visible:', this.isVisible, 'focusable elements:', focusableElements.length);
  }
  
  // Enhanced arrow key navigation within sidebar
  handleArrowKeyNavigation(e) {
    if (!this.sidebar || !this.isVisible) return;
    
    const focusableElements = this.getFocusableElementsInSidebar();
    const currentIndex = focusableElements.indexOf(document.activeElement);
    
    if (currentIndex === -1) return;
    
    let nextIndex;
    if (e.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % focusableElements.length;
    } else if (e.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
    } else {
      return;
    }
    
    e.preventDefault();
    focusableElements[nextIndex].focus();
    console.log('♿ Arrow key navigation: Focused element', nextIndex + 1, 'of', focusableElements.length);
  }
  
  // Screen reader announcements for sidebar state changes
  announceSidebarState() {
    const announcer = document.getElementById('sidebar-announcements');
    if (!announcer) {
      console.warn('♿ Sidebar announcements element not found');
      return;
    }
    
    const deviceType = this.isMobile ? 'mobile' : 'desktop';
    const state = this.isVisible ? 'opened' : 'closed';
    const message = `Navigation sidebar ${state} on ${deviceType}`;
    
    // Clear previous announcement and set new one
    announcer.textContent = '';
    setTimeout(() => {
      announcer.textContent = message;
      console.log('📢 Screen reader announcement:', message);
    }, 100);
    
    // Also announce the number of focusable elements when opening
    if (this.isVisible) {
      const focusableCount = this.getFocusableElementsInSidebar().length;
      setTimeout(() => {
        announcer.textContent = `${message}. ${focusableCount} interactive elements available.`;
      }, 200);
    }
  }
  
  // Public API Methods
  getCurrentState() {
    return {
      isVisible: this.isVisible,
      isMobile: this.isMobile
    };
  }
  
  forceShow() {
    this.showSidebar();
  }
  
  forceHide() {
    this.hideSidebar();
  }
  
  refresh() {
    console.log('🔄 Refreshing sidebar manager...');
    this.findElements();
    this.updateDeviceType();
    this.resetToDefault();
  }
}

// Initialize sidebar manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.sidebarManager = new SimpleSidebarManager();
  });
} else {
  window.sidebarManager = new SimpleSidebarManager();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SimpleSidebarManager;
}