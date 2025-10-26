/**
 * Simple Sidebar Manager - Always show sidebar on desktop/tablet, hamburger menu on mobile
 */

class SimpleSidebarManager {
  constructor() {
    // Core elements
    this.sidebar = null;
    this.overlay = null;
    this.toggleButtons = [];
    this.closeButton = null;
    this.mainContent = null;
    
    // State management
    this.isVisible = false;
    this.isMobile = false;
    
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
    
    // Set up device detection and initial state
    this.updateDeviceType();
    this.applyCorrectState();
    
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
  
  // Simple device detection
  updateDeviceType() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;
    
    if (wasMobile !== this.isMobile) {
      console.log('📱 Device type changed to:', this.isMobile ? 'mobile' : 'desktop');
      return true;
    }
    
    return false;
  }
  
  // Simple sidebar control methods
  showSidebar() {
    console.log('📱 Showing sidebar');
    
    this.isVisible = true;
    
    // Update sidebar state
    this.sidebar.classList.add('sidebar--visible');
    this.sidebar.setAttribute('aria-hidden', 'false');
    this.sidebar.setAttribute('data-sidebar-state', 'visible');
    
    if (this.isMobile) {
      // Mobile: show overlay
      this.showOverlay();
    } else {
      // Desktop/Tablet: adjust main content margin and hide floating toggle
      if (this.mainContent) {
        this.mainContent.classList.remove('main-content--sidebar-hidden');
      }
      this.hideFloatingToggle();
    }
    
    this.updateToggleButtons();
  }
  
  hideSidebar() {
    console.log('📱 Hiding sidebar');
    
    this.isVisible = false;
    
    // Update sidebar state
    this.sidebar.classList.remove('sidebar--visible');
    this.sidebar.setAttribute('aria-hidden', 'true');
    this.sidebar.setAttribute('data-sidebar-state', 'hidden');
    
    if (this.isMobile) {
      // Mobile: hide overlay
      this.hideOverlay();
    } else {
      // Desktop/Tablet: adjust main content margin and show floating toggle
      if (this.mainContent) {
        this.mainContent.classList.add('main-content--sidebar-hidden');
      }
      this.showFloatingToggle();
    }
    
    this.updateToggleButtons();
  }
  
  toggle() {
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
  

  
  // Apply correct state based on device type
  applyCorrectState() {
    // Clean up floating toggle first
    this.hideFloatingToggle();
    
    if (this.isMobile) {
      // Mobile: hide sidebar, show hamburger menu
      console.log('📱 Mobile - hiding sidebar');
      this.hideSidebar();
    } else {
      // Desktop/Tablet: show sidebar
      console.log('💻 Desktop/Tablet - showing sidebar');
      this.showSidebar();
    }
  }
  
  // Basic accessibility setup
  setupAccessibility() {
    if (!this.sidebar) return;
    
    // Ensure sidebar has proper ARIA attributes
    this.sidebar.setAttribute('role', 'navigation');
    this.sidebar.setAttribute('aria-label', 'Main navigation');
    
    // Ensure all toggle buttons are properly configured
    this.toggleButtons.forEach(button => {
      if (!button.hasAttribute('tabindex')) {
        button.setAttribute('tabindex', '0');
      }
      button.setAttribute('aria-controls', 'main-sidebar');
    });
    
    // Ensure close button is properly configured
    if (this.closeButton) {
      if (!this.closeButton.hasAttribute('tabindex')) {
        this.closeButton.setAttribute('tabindex', '0');
      }
    }
    
    // Set initial ARIA states
    this.updateToggleButtons();
    
    console.log('♿ Accessibility attributes set');
  }
  
  // Window Resize Handling
  handleResize() {
    const deviceTypeChanged = this.updateDeviceType();
    
    if (deviceTypeChanged) {
      console.log('📐 Window resized, device type changed');
      
      // Clean up previous device state
      this.hideOverlay();
      this.hideFloatingToggle();
      
      // Apply correct state for new device type
      this.applyCorrectState();
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
  

  

  
  // Toggle button management with ARIA
  updateToggleButtons() {
    this.toggleButtons.forEach(button => {
      button.setAttribute('aria-expanded', this.isVisible.toString());
      
      if (this.isVisible) {
        button.classList.add('mobile-menu-toggle--active');
        button.setAttribute('aria-label', this.isMobile ? 'Close navigation menu' : 'Hide navigation sidebar');
      } else {
        button.classList.remove('mobile-menu-toggle--active');
        button.setAttribute('aria-label', this.isMobile ? 'Open navigation menu' : 'Show navigation sidebar');
      }
      
      button.setAttribute('aria-controls', 'main-sidebar');
    });
    
    // Update overlay ARIA state
    if (this.overlay) {
      this.overlay.setAttribute('aria-hidden', (!this.isVisible || !this.isMobile).toString());
    }
    
    // Update floating toggle ARIA state
    if (this.floatingToggle) {
      const shouldShowFloating = !this.isVisible && !this.isMobile;
      this.floatingToggle.setAttribute('aria-hidden', (!shouldShowFloating).toString());
    }
  }
  
  // Event Binding
  bindEvents() {
    console.log('🔗 Binding events...');
    
    // Toggle button clicks
    this.toggleButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggle();
      });
    });
    
    // Close button click
    if (this.closeButton) {
      this.closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.hideSidebar();
      });
    }
    
    // Overlay click to close
    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay && this.isMobile) {
          this.hideSidebar();
        }
      });
    }
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible) {
        this.hideSidebar();
      }
    });
    
    // Window resize events (debounced)
    this.debouncedResize = this.createDebouncedResize();
    window.addEventListener('resize', this.debouncedResize);
    
    console.log('✅ Events bound');
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
    this.applyCorrectState();
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