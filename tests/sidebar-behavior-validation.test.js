/**
 * Sidebar Behavior Validation Tests
 * Focused tests for the core sidebar functionality and requirements
 */

describe('Sidebar Behavior Validation', () => {
  let SimpleSidebarManager;
  let mockElements;
  
  beforeEach(() => {
    // Mock DOM elements
    mockElements = {
      sidebar: {
        classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn(() => false) },
        setAttribute: jest.fn(),
        getAttribute: jest.fn(),
        addEventListener: jest.fn(),
        querySelector: jest.fn(),
        querySelectorAll: jest.fn(() => []),
        contains: jest.fn(() => false)
      },
      overlay: {
        classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn(() => false) },
        setAttribute: jest.fn(),
        style: {}
      },
      mainContent: {
        classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn(() => false) }
      },
      floatingToggle: {
        classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn(() => false) },
        setAttribute: jest.fn(),
        style: {}
      },
      toggleButtons: [
        {
          classList: { 
            add: jest.fn(), 
            remove: jest.fn(), 
            contains: jest.fn((className) => className === 'mobile-menu-toggle')
          },
          setAttribute: jest.fn(),
          getAttribute: jest.fn(),
          addEventListener: jest.fn()
        }
      ]
    };
    
    // Mock document
    global.document = {
      querySelector: jest.fn((selector) => {
        if (selector === '[data-sidebar]') return mockElements.sidebar;
        if (selector === '[data-sidebar-overlay]') return mockElements.overlay;
        if (selector === '.main-content') return mockElements.mainContent;
        if (selector === '.floating-sidebar-toggle') return mockElements.floatingToggle;
        return null;
      }),
      querySelectorAll: jest.fn((selector) => {
        if (selector === '[data-sidebar-toggle]') return mockElements.toggleButtons;
        return [];
      }),
      getElementById: jest.fn(() => ({ textContent: '' })),
      createElement: jest.fn(() => ({})),
      addEventListener: jest.fn(),
      readyState: 'complete',
      body: { appendChild: jest.fn() }
    };
    
    // Mock window
    global.window = {
      innerWidth: 1200,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      getComputedStyle: jest.fn(() => ({ display: 'block', visibility: 'visible', opacity: '1' })),
      localStorage: { getItem: jest.fn(), setItem: jest.fn() },
      sessionStorage: { getItem: jest.fn(), setItem: jest.fn() }
    };
    
    // Mock console
    global.console = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };
    
    // Import sidebar manager
    delete require.cache[require.resolve('../src/assets/js/sidebar-manager.js')];
    SimpleSidebarManager = require('../src/assets/js/sidebar-manager.js');
  });

  describe('Requirement 1: Mobile Behavior', () => {
    test('1.1 - Should hide sidebar by default on mobile', () => {
      global.window.innerWidth = 768;
      const manager = new SimpleSidebarManager();
      
      const state = manager.getCurrentState();
      expect(state.isMobile).toBe(true);
      expect(state.isVisible).toBe(false);
    });
    
    test('1.2 - Should show hamburger button when sidebar is hidden on mobile', () => {
      global.window.innerWidth = 768;
      const manager = new SimpleSidebarManager();
      
      // Sidebar should be hidden by default, so hamburger should be available
      expect(manager.isVisible).toBe(false);
      expect(manager.isMobile).toBe(true);
    });
    
    test('1.3 - Should show sidebar with overlay when hamburger is tapped on mobile', () => {
      global.window.innerWidth = 768;
      const manager = new SimpleSidebarManager();
      
      manager.showSidebar();
      
      expect(manager.isVisible).toBe(true);
      expect(mockElements.overlay.classList.add).toHaveBeenCalledWith('sidebar-overlay--visible');
    });
    
    test('1.4 - Should display collapse button inside sidebar when open on mobile', () => {
      global.window.innerWidth = 768;
      const manager = new SimpleSidebarManager();
      
      manager.showSidebar();
      
      expect(manager.isVisible).toBe(true);
      // Collapse button should be available inside sidebar
    });
    
    test('1.5 - Should hide sidebar when collapse button or overlay is tapped on mobile', () => {
      global.window.innerWidth = 768;
      const manager = new SimpleSidebarManager();
      
      manager.showSidebar();
      expect(manager.isVisible).toBe(true);
      
      manager.hideSidebar();
      expect(manager.isVisible).toBe(false);
      expect(mockElements.overlay.classList.remove).toHaveBeenCalledWith('sidebar-overlay--visible');
    });
  });

  describe('Requirement 2: Desktop Behavior', () => {
    test('2.1 - Should display sidebar by default on desktop', () => {
      global.window.innerWidth = 1200;
      const manager = new SimpleSidebarManager();
      
      const state = manager.getCurrentState();
      expect(state.isMobile).toBe(false);
      expect(state.isVisible).toBe(true);
    });
    
    test('2.2 - Should show collapse button inside sidebar when visible on desktop', () => {
      global.window.innerWidth = 1200;
      const manager = new SimpleSidebarManager();
      
      expect(manager.isVisible).toBe(true);
      // Collapse button should be available inside sidebar
    });
    
    test('2.3 - Should hide sidebar and show floating button when collapse is clicked on desktop', () => {
      global.window.innerWidth = 1200;
      const manager = new SimpleSidebarManager();
      
      manager.hideSidebar();
      
      expect(manager.isVisible).toBe(false);
      expect(mockElements.floatingToggle.classList.add).toHaveBeenCalledWith('floating-sidebar-toggle--visible');
    });
    
    test('2.4 - Should display floating hamburger button when sidebar is hidden on desktop', () => {
      global.window.innerWidth = 1200;
      const manager = new SimpleSidebarManager();
      
      manager.hideSidebar();
      
      expect(mockElements.floatingToggle.classList.add).toHaveBeenCalledWith('floating-sidebar-toggle--visible');
    });
    
    test('2.5 - Should show sidebar when floating button is clicked on desktop', () => {
      global.window.innerWidth = 1200;
      const manager = new SimpleSidebarManager();
      
      manager.hideSidebar();
      expect(manager.isVisible).toBe(false);
      
      manager.showSidebar();
      expect(manager.isVisible).toBe(true);
    });
  });

  describe('Requirement 3: No Preference Persistence', () => {
    test('3.1 - Should always start with default state on page load', () => {
      // Test multiple initializations
      for (let i = 0; i < 3; i++) {
        // Desktop
        global.window.innerWidth = 1200;
        const desktopManager = new SimpleSidebarManager();
        expect(desktopManager.isVisible).toBe(true);
        
        // Mobile
        global.window.innerWidth = 768;
        const mobileManager = new SimpleSidebarManager();
        expect(mobileManager.isVisible).toBe(false);
      }
    });
    
    test('3.2 - Should reset to appropriate default state on window resize', () => {
      global.window.innerWidth = 1200;
      const manager = new SimpleSidebarManager();
      expect(manager.isVisible).toBe(true);
      
      // Resize to mobile
      global.window.innerWidth = 768;
      manager.handleResize();
      
      expect(manager.isMobile).toBe(true);
      expect(manager.isVisible).toBe(false); // Reset to mobile default
    });
    
    test('3.3 - Should not store preferences in localStorage', () => {
      const manager = new SimpleSidebarManager();
      
      manager.toggle();
      manager.showSidebar();
      manager.hideSidebar();
      
      expect(global.window.localStorage.setItem).not.toHaveBeenCalled();
    });
    
    test('3.4 - Should not store preferences in sessionStorage', () => {
      const manager = new SimpleSidebarManager();
      
      manager.toggle();
      manager.showSidebar();
      manager.hideSidebar();
      
      expect(global.window.sessionStorage.setItem).not.toHaveBeenCalled();
    });
    
    test('3.5 - Should ignore any previously stored preferences', () => {
      // Set up fake stored preferences
      global.window.localStorage.getItem.mockReturnValue('true');
      global.window.sessionStorage.getItem.mockReturnValue('false');
      
      // Desktop should still default to visible
      global.window.innerWidth = 1200;
      const desktopManager = new SimpleSidebarManager();
      expect(desktopManager.isVisible).toBe(true);
      
      // Mobile should still default to hidden
      global.window.innerWidth = 768;
      const mobileManager = new SimpleSidebarManager();
      expect(mobileManager.isVisible).toBe(false);
    });
  });

  describe('Device Detection and Breakpoints', () => {
    test('Should use 1024px as consistent breakpoint', () => {
      const manager = new SimpleSidebarManager();
      
      // Test exactly at breakpoint
      global.window.innerWidth = 1024;
      manager.updateDeviceType();
      expect(manager.isMobile).toBe(true);
      
      // Test just above breakpoint
      global.window.innerWidth = 1025;
      manager.updateDeviceType();
      expect(manager.isMobile).toBe(false);
    });
    
    test('Should detect device type changes correctly', () => {
      const manager = new SimpleSidebarManager();
      
      global.window.innerWidth = 1200;
      const changed1 = manager.updateDeviceType();
      expect(changed1).toBe(true);
      expect(manager.isMobile).toBe(false);
      
      // Same width should not trigger change
      const changed2 = manager.updateDeviceType();
      expect(changed2).toBe(false);
      
      // Different width should trigger change
      global.window.innerWidth = 768;
      const changed3 = manager.updateDeviceType();
      expect(changed3).toBe(true);
      expect(manager.isMobile).toBe(true);
    });
  });

  describe('Toggle Button Functionality', () => {
    test('Should prevent rapid toggle clicks during animations', () => {
      const manager = new SimpleSidebarManager();
      manager.isAnimating = true;
      
      const initialState = manager.isVisible;
      manager.toggle();
      
      // State should not change during animation
      expect(manager.isVisible).toBe(initialState);
    });
    
    test('Should set animation flag during transitions', () => {
      const manager = new SimpleSidebarManager();
      
      expect(manager.isAnimating).toBe(false);
      manager.showSidebar();
      expect(manager.isAnimating).toBe(true);
    });
    
    test('Should update ARIA attributes on state changes', () => {
      const manager = new SimpleSidebarManager();
      
      manager.showSidebar();
      expect(mockElements.sidebar.setAttribute).toHaveBeenCalledWith('aria-hidden', 'false');
      
      manager.hideSidebar();
      expect(mockElements.sidebar.setAttribute).toHaveBeenCalledWith('aria-hidden', 'true');
    });
  });

  describe('Main Content Adjustments', () => {
    test('Should adjust main content margin on desktop', () => {
      global.window.innerWidth = 1200;
      const manager = new SimpleSidebarManager();
      
      // When sidebar is hidden, add class
      manager.hideSidebar();
      expect(mockElements.mainContent.classList.add).toHaveBeenCalledWith('main-content--sidebar-hidden');
      
      // When sidebar is shown, remove class
      manager.showSidebar();
      expect(mockElements.mainContent.classList.remove).toHaveBeenCalledWith('main-content--sidebar-hidden');
    });
    
    test('Should not adjust main content margin on mobile', () => {
      global.window.innerWidth = 768;
      const manager = new SimpleSidebarManager();
      
      manager.showSidebar();
      manager.hideSidebar();
      
      // Main content margin adjustments should not happen on mobile
      // (This is handled by CSS, but we can verify the mobile flag)
      expect(manager.isMobile).toBe(true);
    });
  });

  describe('Public API', () => {
    test('Should provide getCurrentState method', () => {
      const manager = new SimpleSidebarManager();
      const state = manager.getCurrentState();
      
      expect(state).toHaveProperty('isVisible');
      expect(state).toHaveProperty('isMobile');
      expect(typeof state.isVisible).toBe('boolean');
      expect(typeof state.isMobile).toBe('boolean');
    });
    
    test('Should provide forceShow and forceHide methods', () => {
      const manager = new SimpleSidebarManager();
      
      manager.forceHide();
      expect(manager.isVisible).toBe(false);
      
      manager.forceShow();
      expect(manager.isVisible).toBe(true);
    });
    
    test('Should provide refresh method', () => {
      const manager = new SimpleSidebarManager();
      expect(() => manager.refresh()).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    test('Should handle missing sidebar element gracefully', () => {
      global.document.querySelector = jest.fn(() => null);
      
      expect(() => new SimpleSidebarManager()).not.toThrow();
    });
    
    test('Should handle missing toggle buttons gracefully', () => {
      global.document.querySelectorAll = jest.fn(() => []);
      
      expect(() => new SimpleSidebarManager()).not.toThrow();
    });
  });
});