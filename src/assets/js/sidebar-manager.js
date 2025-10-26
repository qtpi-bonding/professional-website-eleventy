/**
 * Responsive Sidebar Manager - Device-aware sidebar toggle system
 * Handles sidebar visibility across mobile, tablet, and desktop devices
 */

class ResponsiveSidebarManager {
  constructor() {
    // Core elements
    this.sidebar = null;
    this.overlay = null;
    this.toggleButtons = [];
    this.closeButton = null;
    this.mainContent = null;
    this.floatingToggle = null;
    
    // State management
    this.isVisible = false;
    this.currentDeviceType = null;
    this.preferences = this.loadPreferences();
    
    // Configuration from theme
    this.config = {
      breakpoints: {
        mobile: 0,
        tablet: 768,
        desktop: 1024
      },
      defaults: {
        mobile: 'hidden',
        tablet: 'visible', 
        desktop: 'visible'
      },
      animations: {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    };
    
    this.init();
  }
  
  init() {
    console.log('🔧 Initializing ResponsiveSidebarManager...');
    
    // Find DOM elements
    this.findElements();
    
    if (!this.sidebar) {
      console.warn('ResponsiveSidebarManager: Sidebar element not found');
      return;
    }
    
    // Set up device detection
    this.updateDeviceType();
    
    // Apply device-specific defaults
    this.applyDeviceDefaults();
    
    // Bind all event listeners
    this.bindEvents();
    
    // Set up accessibility
    this.setupAccessibility();
    
    console.log('✅ ResponsiveSidebarManager initialized');
  }
  
  findElements() {
    this.sidebar = document.querySelector('[data-sidebar]');
    this.overlay = document.querySelector('[data-sidebar-overlay]');
    this.toggleButtons = Array.from(document.querySelectorAll('[data-sidebar-toggle]'));
    this.closeButton = document.querySelector('[data-sidebar-close]');
    this.mainContent = document.querySelector('.main-content');
    this.floatingToggle = document.querySelector('.floating-sidebar-toggle');
    
    console.log('🔍 Found elements:', {
      sidebar: !!this.sidebar,
      overlay: !!this.overlay,
      toggleButtons: this.toggleButtons.length,
      closeButton: !!this.closeButton,
      mainContent: !!this.mainContent,
      floatingToggle: !!this.floatingToggle
    });
  }
  
  // Device Detection Methods
  getDeviceType() {
    const width = window.innerWidth;
    
    if (width >= this.config.breakpoints.desktop) return 'desktop';
    if (width >= this.config.breakpoints.tablet) return 'tablet';
    return 'mobile';
  }
  
  updateDeviceType() {
    const newDeviceType = this.getDeviceType();
    
    if (this.currentDeviceType !== newDeviceType) {
      console.log('📱 Device type changed:', this.currentDeviceType, '→', newDeviceType);
      this.currentDeviceType = newDeviceType;
      
      // Update sidebar data attribute for CSS targeting
      if (this.sidebar) {
        this.sidebar.setAttribute('data-device-type', newDeviceType);
      }
      
      return true; // Device type changed
    }
    
    return false; // No change
  }
  
  // Core Sidebar Control Methods
  show() {
    console.log('📱 Showing sidebar');
    
    this.isVisible = true;
    
    // Update sidebar state
    this.sidebar.classList.add('sidebar--visible');
    this.sidebar.setAttribute('aria-hidden', 'false');
    this.sidebar.setAttribute('data-sidebar-state', 'visible');
    
    // Handle device-specific behavior
    if (this.currentDeviceType === 'mobile') {
      this.showOverlay();
      this.trapFocus();
    } else {
      // Tablet/Desktop: adjust main content margin and hide floating toggle
      if (this.mainContent) {
        this.mainContent.classList.remove('main-content--sidebar-hidden');
      }
      this.hideFloatingToggle();
    }
    
    // Update toggle buttons and ARIA states
    this.updateToggleButtons();
    
    // Announce state change to screen readers
    setTimeout(() => this.announceSidebarStateChange(), 100);
    
    // Save preference for tablet/desktop
    if (this.currentDeviceType !== 'mobile') {
      this.savePreference();
    }
    
    // Dispatch custom event
    this.dispatchStateChange();
  }
  
  hide() {
    console.log('📱 Hiding sidebar');
    
    this.isVisible = false;
    
    // Update sidebar state
    this.sidebar.classList.remove('sidebar--visible');
    this.sidebar.setAttribute('aria-hidden', 'true');
    this.sidebar.setAttribute('data-sidebar-state', 'hidden');
    
    // Handle device-specific behavior
    if (this.currentDeviceType === 'mobile') {
      this.hideOverlay();
      this.releaseFocus();
    } else {
      // Tablet/Desktop: adjust main content margin and show floating toggle
      if (this.mainContent) {
        this.mainContent.classList.add('main-content--sidebar-hidden');
      }
      
      // Show floating toggle on desktop only
      if (this.currentDeviceType === 'desktop') {
        this.showFloatingToggle();
      }
    }
    
    // Update toggle buttons and ARIA states
    this.updateToggleButtons();
    
    // Announce state change to screen readers
    setTimeout(() => this.announceSidebarStateChange(), 100);
    
    // Save preference for tablet/desktop
    if (this.currentDeviceType !== 'mobile') {
      this.savePreference();
    }
    
    // Dispatch custom event
    this.dispatchStateChange();
  }
  
  toggle() {
    console.log('🔄 Toggling sidebar');
    
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
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
    }, this.config.animations.duration);
    
    console.log('🌫️ Overlay hidden');
  }
  
  // Floating Toggle Management (Desktop Only)
  showFloatingToggle() {
    if (!this.floatingToggle || this.currentDeviceType !== 'desktop') return;
    
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
      if (this.isVisible || this.currentDeviceType !== 'desktop') {
        this.floatingToggle.style.display = 'none';
      }
    }, this.config.animations.duration);
    
    console.log('🎈 Floating toggle hidden');
  }
  
  // Device-Specific Default Behavior
  applyDeviceDefaults() {
    const deviceType = this.currentDeviceType;
    const defaultState = this.config.defaults[deviceType];
    
    console.log('🎯 Applying device defaults for', deviceType, ':', defaultState);
    
    // Clean up previous device state
    this.hideFloatingToggle();
    
    if (deviceType === 'mobile') {
      // Mobile always starts hidden
      this.hide();
    } else {
      // Tablet/Desktop: check saved preference or use default
      const preference = this.preferences[deviceType];
      
      if (preference !== undefined) {
        console.log('📋 Using saved preference:', preference);
        if (preference.visible) {
          this.show();
        } else {
          this.hide();
        }
      } else {
        console.log('📋 Using default state:', defaultState);
        if (defaultState === 'visible') {
          this.show();
        } else {
          this.hide();
        }
      }
    }
  }
  
  // Window Resize Handling
  handleResize() {
    const deviceTypeChanged = this.updateDeviceType();
    
    if (deviceTypeChanged) {
      console.log('📐 Window resized, device type changed');
      
      // Clean up previous device state
      this.hideOverlay();
      this.hideFloatingToggle();
      this.releaseFocus();
      
      // Apply new device defaults
      this.applyDeviceDefaults();
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
  
  // Preference Management
  loadPreferences() {
    try {
      const stored = localStorage.getItem('sidebar-preferences');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.warn('Failed to load sidebar preferences:', e);
      return {};
    }
  }
  
  savePreference() {
    if (this.currentDeviceType === 'mobile') return; // Don't save mobile preferences
    
    try {
      this.preferences[this.currentDeviceType] = {
        visible: this.isVisible,
        timestamp: Date.now()
      };
      
      localStorage.setItem('sidebar-preferences', JSON.stringify(this.preferences));
      console.log('💾 Saved preference for', this.currentDeviceType, ':', this.isVisible);
    } catch (e) {
      console.warn('Failed to save sidebar preferences:', e);
    }
  }
  
  // Enhanced Focus Management with Focus Trapping
  trapFocus() {
    if (this.currentDeviceType !== 'mobile' || !this.sidebar) return;
    
    const focusableElements = this.getFocusableElements();
    
    if (focusableElements.length > 0) {
      // Store the element that had focus before opening sidebar
      this.previousFocusElement = document.activeElement;
      
      // Store focusable elements for tab navigation
      this.focusableElements = focusableElements;
      this.firstFocusableElement = focusableElements[0];
      this.lastFocusableElement = focusableElements[focusableElements.length - 1];
      
      // Focus first element (usually close button)
      this.firstFocusableElement.focus();
      
      // Add focus trap event listeners
      this.addFocusTrapListeners();
      
      console.log('🎯 Focus trapped in sidebar with', focusableElements.length, 'focusable elements');
    }
  }
  
  // Get all focusable elements within sidebar
  getFocusableElements() {
    if (!this.sidebar) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"]):not([disabled])',
      '[contenteditable="true"]'
    ].join(', ');
    
    const elements = Array.from(this.sidebar.querySelectorAll(focusableSelectors));
    
    // Filter out elements that are not visible
    return elements.filter(element => {
      const style = window.getComputedStyle(element);
      return style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             element.offsetParent !== null;
    });
  }
  
  // Add event listeners for focus trapping
  addFocusTrapListeners() {
    if (this.currentDeviceType !== 'mobile') return;
    
    // Remove existing listeners to prevent duplicates
    this.removeFocusTrapListeners();
    
    // Bind focus trap handler
    this.focusTrapHandler = this.handleFocusTrap.bind(this);
    document.addEventListener('keydown', this.focusTrapHandler);
    
    // Bind focus monitoring
    this.focusMonitorHandler = this.monitorFocus.bind(this);
    document.addEventListener('focusin', this.focusMonitorHandler);
    
    console.log('🎯 Focus trap listeners added');
  }
  
  // Remove focus trap event listeners
  removeFocusTrapListeners() {
    if (this.focusTrapHandler) {
      document.removeEventListener('keydown', this.focusTrapHandler);
      this.focusTrapHandler = null;
    }
    
    if (this.focusMonitorHandler) {
      document.removeEventListener('focusin', this.focusMonitorHandler);
      this.focusMonitorHandler = null;
    }
    
    console.log('🎯 Focus trap listeners removed');
  }
  
  // Handle focus trapping during tab navigation
  handleFocusTrap(event) {
    if (event.key !== 'Tab' || !this.isVisible || this.currentDeviceType !== 'mobile') return;
    
    const activeElement = document.activeElement;
    
    // If shift+tab on first element, focus last element
    if (event.shiftKey && activeElement === this.firstFocusableElement) {
      event.preventDefault();
      this.lastFocusableElement.focus();
      console.log('🎯 Focus wrapped to last element (shift+tab)');
    }
    // If tab on last element, focus first element
    else if (!event.shiftKey && activeElement === this.lastFocusableElement) {
      event.preventDefault();
      this.firstFocusableElement.focus();
      console.log('🎯 Focus wrapped to first element (tab)');
    }
  }
  
  // Monitor focus to ensure it stays within sidebar
  monitorFocus(event) {
    if (!this.isVisible || this.currentDeviceType !== 'mobile' || !this.sidebar) return;
    
    const focusedElement = event.target;
    
    // Check if focused element is within sidebar
    if (!this.sidebar.contains(focusedElement)) {
      // Focus escaped sidebar, return it to first focusable element
      if (this.firstFocusableElement) {
        this.firstFocusableElement.focus();
        console.log('🎯 Focus returned to sidebar (escaped)');
      }
    }
  }
  
  releaseFocus() {
    // Remove focus trap listeners
    this.removeFocusTrapListeners();
    
    // Clear focus trap elements
    this.focusableElements = null;
    this.firstFocusableElement = null;
    this.lastFocusableElement = null;
    
    // Return focus to the element that had focus before opening sidebar
    if (this.previousFocusElement && typeof this.previousFocusElement.focus === 'function') {
      // Use setTimeout to ensure focus is set after any pending DOM updates
      setTimeout(() => {
        this.previousFocusElement.focus();
        console.log('🎯 Focus returned to previous element');
      }, 50);
    } else {
      // Fallback: focus the first available toggle button
      const availableToggle = this.toggleButtons.find(btn => 
        btn.offsetParent !== null // Check if button is visible
      );
      
      if (availableToggle) {
        setTimeout(() => {
          availableToggle.focus();
          console.log('🎯 Focus returned to toggle button (fallback)');
        }, 50);
      }
    }
    
    // Clear the stored focus element
    this.previousFocusElement = null;
  }
  
  // Ensure proper focus order within sidebar
  ensureFocusOrder() {
    if (!this.sidebar) return;
    
    const focusableElements = this.sidebar.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    // Ensure elements have proper tabindex for logical focus order
    focusableElements.forEach((element, index) => {
      // Remove any existing tabindex that might interfere
      if (element.getAttribute('tabindex') === '-1') {
        element.removeAttribute('tabindex');
      }
    });
    
    console.log('🎯 Focus order ensured for', focusableElements.length, 'elements');
  }
  
  // Enhanced Toggle Button State Management with ARIA
  updateToggleButtons() {
    this.toggleButtons.forEach(button => {
      // Update ARIA attributes
      button.setAttribute('aria-expanded', this.isVisible.toString());
      
      // Update visual state and ARIA labels based on device type and button type
      if (this.isVisible) {
        button.classList.add('mobile-menu-toggle--active');
        
        // Device-specific ARIA labels
        if (this.currentDeviceType === 'mobile') {
          button.setAttribute('aria-label', 'Close navigation menu');
        } else {
          button.setAttribute('aria-label', 'Hide navigation sidebar');
        }
      } else {
        button.classList.remove('mobile-menu-toggle--active');
        
        // Device-specific ARIA labels
        if (this.currentDeviceType === 'mobile') {
          button.setAttribute('aria-label', 'Open navigation menu');
        } else {
          button.setAttribute('aria-label', 'Show navigation sidebar');
        }
      }
      
      // Ensure proper ARIA controls relationship
      button.setAttribute('aria-controls', 'main-sidebar');
    });
    
    // Update sidebar ARIA states
    this.updateSidebarAriaStates();
  }
  
  // Update sidebar and overlay ARIA states
  updateSidebarAriaStates() {
    if (!this.sidebar) return;
    
    // Update sidebar ARIA hidden state
    this.sidebar.setAttribute('aria-hidden', (!this.isVisible).toString());
    
    // Update overlay ARIA states
    if (this.overlay) {
      this.overlay.setAttribute('aria-hidden', (!this.isVisible || this.currentDeviceType !== 'mobile').toString());
    }
    
    // Update floating toggle ARIA states
    if (this.floatingToggle) {
      const shouldShowFloating = !this.isVisible && this.currentDeviceType === 'desktop';
      this.floatingToggle.setAttribute('aria-hidden', (!shouldShowFloating).toString());
    }
    
    console.log('♿ ARIA states updated - sidebar visible:', this.isVisible);
  }
  
  // Announce sidebar state changes to screen readers
  announceSidebarStateChange() {
    // Create or update live region for announcements
    let liveRegion = document.getElementById('sidebar-announcements');
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'sidebar-announcements';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      document.body.appendChild(liveRegion);
    }
    
    // Announce the state change
    const message = this.isVisible ? 
      'Navigation menu opened' : 
      'Navigation menu closed';
    
    liveRegion.textContent = message;
    
    console.log('📢 Screen reader announcement:', message);
  }
  
  // Event Binding
  bindEvents() {
    console.log('🔗 Binding events...');
    
    // Toggle button clicks
    this.toggleButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔘 Toggle button clicked');
        this.toggle();
      });
    });
    
    // Close button click
    if (this.closeButton) {
      this.closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('❌ Close button clicked');
        this.hide();
      });
    }
    
    // Overlay click to close
    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          console.log('🌫️ Overlay clicked');
          this.hide();
        }
      });
    }
    
    // Keyboard events
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    
    // Window resize events (debounced)
    this.debouncedResize = this.createDebouncedResize();
    window.addEventListener('resize', this.debouncedResize);
    
    // Auto-close on navigation link clicks (mobile only)
    this.setupNavigationAutoClose();
    
    console.log('✅ Events bound');
  }
  
  setupNavigationAutoClose() {
    if (!this.sidebar) return;
    
    const navLinks = this.sidebar.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        // Only auto-close on mobile when sidebar is visible
        if (this.currentDeviceType === 'mobile' && this.isVisible) {
          console.log('🧭 Navigation link clicked, auto-closing sidebar');
          
          // Add smooth transition class for better UX
          this.sidebar.classList.add('sidebar--transitioning');
          
          // Close sidebar with slight delay for smooth UX
          setTimeout(() => {
            this.hide();
            
            // Remove transition class after animation completes
            setTimeout(() => {
              this.sidebar.classList.remove('sidebar--transitioning');
            }, this.config.animations.duration);
          }, 150);
        }
      });
    });
    
    // Listen for navigation system events to maintain proper section highlighting
    window.addEventListener('navigationchange', (event) => {
      if (this.currentDeviceType === 'mobile' && this.isVisible) {
        console.log('🧭 Navigation changed to section:', event.detail.activeSection);
        // Ensure section highlighting is maintained during mobile navigation
        this.maintainSectionHighlighting(event.detail.activeSection);
      }
    });
  }
  
  // Maintain proper section highlighting during mobile navigation
  maintainSectionHighlighting(activeSection) {
    if (!this.sidebar || !activeSection) return;
    
    const navLinks = this.sidebar.querySelectorAll('.nav-link[href^="#"]');
    
    // Ensure the active section remains highlighted even when sidebar is closing
    navLinks.forEach(link => {
      const targetSection = link.getAttribute('href').substring(1);
      
      if (targetSection === activeSection) {
        // Keep the active state visible during transition
        link.classList.add('nav-link--mobile-active');
        
        // Remove the temporary class after transition
        setTimeout(() => {
          link.classList.remove('nav-link--mobile-active');
        }, this.config.animations.duration * 2);
      }
    });
  }
  
  // Keyboard Event Handling
  handleKeyboard(event) {
    // Escape key to close sidebar
    if (event.key === 'Escape' && this.isVisible) {
      console.log('⌨️ Escape key pressed');
      this.hide();
      return;
    }
    
    // Enter/Space on toggle buttons
    if ((event.key === 'Enter' || event.key === ' ') && 
        this.toggleButtons.includes(event.target)) {
      event.preventDefault();
      console.log('⌨️ Toggle button activated via keyboard');
      this.toggle();
      return;
    }
    
    // Enter/Space on close button
    if ((event.key === 'Enter' || event.key === ' ') && 
        event.target === this.closeButton) {
      event.preventDefault();
      console.log('⌨️ Close button activated via keyboard');
      this.hide();
      return;
    }
    
    // Tab key focus management for mobile overlay
    if (event.key === 'Tab' && this.isVisible && this.currentDeviceType === 'mobile') {
      this.handleTabNavigation(event);
    }
  }
  
  // Enhanced Tab navigation for focus trapping (legacy method for backward compatibility)
  handleTabNavigation(event) {
    // This method is now handled by the more comprehensive handleFocusTrap method
    // Keeping for backward compatibility but delegating to the new system
    if (this.currentDeviceType === 'mobile' && this.isVisible) {
      this.handleFocusTrap(event);
    }
  }
  
  // Enhanced Accessibility Setup
  setupAccessibility() {
    if (!this.sidebar) return;
    
    // Ensure sidebar has proper ARIA attributes
    this.sidebar.setAttribute('role', 'navigation');
    this.sidebar.setAttribute('aria-label', 'Main navigation');
    
    // Ensure all toggle buttons are properly configured for keyboard navigation
    this.toggleButtons.forEach(button => {
      // Make sure buttons are focusable
      if (!button.hasAttribute('tabindex')) {
        button.setAttribute('tabindex', '0');
      }
      
      // Ensure proper ARIA controls relationship
      button.setAttribute('aria-controls', 'main-sidebar');
      
      // Add focus event listeners for enhanced focus indicators
      button.addEventListener('focus', this.handleToggleButtonFocus.bind(this));
      button.addEventListener('blur', this.handleToggleButtonBlur.bind(this));
    });
    
    // Ensure close button is properly configured
    if (this.closeButton) {
      if (!this.closeButton.hasAttribute('tabindex')) {
        this.closeButton.setAttribute('tabindex', '0');
      }
      this.closeButton.addEventListener('focus', this.handleCloseButtonFocus.bind(this));
      this.closeButton.addEventListener('blur', this.handleCloseButtonBlur.bind(this));
    }
    
    // Set initial ARIA states
    this.updateToggleButtons();
    
    // Ensure proper focus order
    this.ensureFocusOrder();
    
    console.log('♿ Enhanced accessibility attributes set');
  }
  
  // Focus event handlers for enhanced focus indicators
  handleToggleButtonFocus(event) {
    event.target.classList.add('focus-visible');
    console.log('🎯 Toggle button focused');
  }
  
  handleToggleButtonBlur(event) {
    event.target.classList.remove('focus-visible');
    console.log('🎯 Toggle button blurred');
  }
  
  handleCloseButtonFocus(event) {
    event.target.classList.add('focus-visible');
    console.log('🎯 Close button focused');
  }
  
  handleCloseButtonBlur(event) {
    event.target.classList.remove('focus-visible');
    console.log('🎯 Close button blurred');
  }
  
  // Event Dispatching
  dispatchStateChange() {
    const event = new CustomEvent('sidebarStateChange', {
      detail: {
        isVisible: this.isVisible,
        deviceType: this.currentDeviceType,
        timestamp: Date.now()
      }
    });
    
    window.dispatchEvent(event);
    console.log('📡 Sidebar state change event dispatched');
  }
  
  // Public API Methods
  getCurrentState() {
    return {
      isVisible: this.isVisible,
      deviceType: this.currentDeviceType,
      preferences: this.preferences
    };
  }
  
  forceShow() {
    this.show();
  }
  
  forceHide() {
    this.hide();
  }
  
  refresh() {
    console.log('🔄 Refreshing sidebar manager...');
    this.findElements();
    this.updateDeviceType();
    this.applyDeviceDefaults();
  }
  
  destroy() {
    console.log('🗑️ Destroying sidebar manager...');
    
    // Remove event listeners
    this.toggleButtons.forEach(button => {
      button.removeEventListener('click', this.toggle);
      button.removeEventListener('focus', this.handleToggleButtonFocus);
      button.removeEventListener('blur', this.handleToggleButtonBlur);
    });
    
    if (this.closeButton) {
      this.closeButton.removeEventListener('click', this.hide);
      this.closeButton.removeEventListener('focus', this.handleCloseButtonFocus);
      this.closeButton.removeEventListener('blur', this.handleCloseButtonBlur);
    }
    
    if (this.overlay) {
      this.overlay.removeEventListener('click', this.hide);
    }
    
    document.removeEventListener('keydown', this.handleKeyboard);
    window.removeEventListener('resize', this.debouncedResize);
    
    // Clean up focus trap listeners
    this.removeFocusTrapListeners();
    
    // Clean up state
    this.hideOverlay();
    this.hideFloatingToggle();
    this.releaseFocus();
    
    // Remove live region for announcements
    const liveRegion = document.getElementById('sidebar-announcements');
    if (liveRegion) {
      liveRegion.remove();
    }
  }
}

// Initialize sidebar manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.sidebarManager = new ResponsiveSidebarManager();
  });
} else {
  window.sidebarManager = new ResponsiveSidebarManager();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResponsiveSidebarManager;
}