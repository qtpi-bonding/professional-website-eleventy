/**
 * Sidebar Manager Tests
 * Tests for responsive sidebar behavior, device detection, and state management
 */

// Create a comprehensive DOM structure for testing
const createTestDOM = () => {
  // Mock DOM elements
  const mockElement = (tag, attributes = {}) => {
    const element = {
      tagName: tag.toUpperCase(),
      classList: {
        add: jest.fn(),
        remove: jest.fn(),
        contains: jest.fn(() => false),
        toggle: jest.fn()
      },
      setAttribute: jest.fn(),
      getAttribute: jest.fn(),
      removeAttribute: jest.fn(),
      hasAttribute: jest.fn(() => false),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      querySelector: jest.fn(),
      querySelectorAll: jest.fn(() => []),
      contains: jest.fn(() => false),
      focus: jest.fn(),
      style: {},
      offsetParent: {},
      ...attributes
    };
    
    // Set initial attributes
    Object.keys(attributes).forEach(key => {
      if (key.startsWith('data-')) {
        element.dataset = element.dataset || {};
        element.dataset[key.replace('data-', '')] = attributes[key];
      }
    });
    
    return element;
  };

  // Create mock elements
  const sidebar = mockElement('aside', { 'data-sidebar': true });
  const overlay = mockElement('div', { 'data-sidebar-overlay': true });
  const hamburgerButton = mockElement('button', { 'data-sidebar-toggle': true, class: 'mobile-menu-toggle' });
  const toggleButton = mockElement('button', { 'data-sidebar-toggle': true, class: 'sidebar-toggle-button' });
  const floatingToggle = mockElement('button', { 'data-sidebar-toggle': true, class: 'floating-sidebar-toggle' });
  const mainContent = mockElement('main', { class: 'main-content' });
  const announcements = mockElement('div', { id: 'sidebar-announcements' });
  const description = mockElement('div', { id: 'sidebar-description' });
  
  // Mock links and buttons inside sidebar
  const sidebarLink1 = mockElement('a', { href: '#', tabindex: '0' });
  const sidebarLink2 = mockElement('a', { href: '#', tabindex: '0' });
  const sidebarButton = mockElement('button', { tabindex: '0' });
  
  // Set up querySelector responses
  const elements = {
    '[data-sidebar]': sidebar,
    '[data-sidebar-overlay]': overlay,
    '.main-content': mainContent,
    '.floating-sidebar-toggle': floatingToggle,
    '#sidebar-announcements': announcements,
    '#sidebar-description': description,
    '.mobile-menu-toggle': hamburgerButton,
    '.sidebar-toggle-button': toggleButton
  };
  
  // Mock document
  global.document = {
    querySelector: jest.fn((selector) => elements[selector] || null),
    querySelectorAll: jest.fn((selector) => {
      if (selector === '[data-sidebar-toggle]') {
        return [hamburgerButton, toggleButton, floatingToggle];
      }
      if (selector.includes('.sidebar a, .sidebar button')) {
        return [sidebarLink1, sidebarLink2, sidebarButton];
      }
      return [];
    }),
    getElementById: jest.fn((id) => {
      if (id === 'sidebar-announcements') return announcements;
      if (id === 'sidebar-description') return description;
      return null;
    }),
    createElement: jest.fn((tag) => mockElement(tag)),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    readyState: 'complete',
    body: mockElement('body')
  };
  
  // Mock sidebar querySelector for internal elements
  sidebar.querySelector = jest.fn((selector) => {
    if (selector.includes('[data-sidebar-toggle]')) return toggleButton;
    return null;
  });
  
  sidebar.querySelectorAll = jest.fn((selector) => {
    if (selector.includes('a, button') || selector.includes('[tabindex]')) {
      return [sidebarLink1, sidebarLink2, sidebarButton];
    }
    if (selector.includes('[data-sidebar-toggle]')) {
      return [toggleButton];
    }
    return [];
  });
  
  sidebar.contains = jest.fn((element) => {
    return element === sidebarLink1 || element === sidebarLink2 || element === sidebarButton || element === toggleButton;
  });
  
  // Mock window
  global.window = {
    innerWidth: 1200,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getComputedStyle: jest.fn(() => ({
      display: 'block',
      visibility: 'visible',
      opacity: '1'
    })),
    localStorage: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    },
    sessionStorage: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    }
  };
  
  // Mock active element
  Object.defineProperty(global.document, 'activeElement', {
    writable: true,
    value: hamburgerButton
  });
  
  return {
    sidebar,
    overlay,
    hamburgerButton,
    toggleButton,
    floatingToggle,
    mainContent,
    announcements,
    description,
    sidebarLink1,
    sidebarLink2,
    sidebarButton
  };
};

// Import the sidebar manager after setting up DOM
let SimpleSidebarManager;

describe('SimpleSidebarManager', () => {
  let domElements;
  let sidebarManager;
  let mockConsole;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock console methods
    mockConsole = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };
    global.console = mockConsole;
    
    // Create fresh DOM for each test
    domElements = createTestDOM();
    
    // Mock window.innerWidth for device detection
    Object.defineProperty(global.window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200 // Default to desktop
    });
    
    // Import and create sidebar manager
    delete require.cache[require.resolve('../src/assets/js/sidebar-manager.js')];
    SimpleSidebarManager = require('../src/assets/js/sidebar-manager.js');
    sidebarManager = new SimpleSidebarManager();
  });
  
  afterEach(() => {
    if (sidebarManager && sidebarManager.debouncedResize) {
      global.window.removeEventListener('resize', sidebarManager.debouncedResize);
    }
  });

  describe('Initialization', () => {
    test('should initialize with correct default state on desktop', () => {
      // Desktop width (>1024px)
      global.window.innerWidth = 1200;
      sidebarManager = new SimpleSidebarManager();
      
      const state = sidebarManager.getCurrentState();
      expect(state.isMobile).toBe(false);
      expect(state.isVisible).toBe(true); // Desktop default: visible
    });
    
    test('should initialize with correct default state on mobile', () => {
      // Mobile width (≤1024px)
      global.window.innerWidth = 768;
      sidebarManager = new SimpleSidebarManager();
      
      const state = sidebarManager.getCurrentState();
      expect(state.isMobile).toBe(true);
      expect(state.isVisible).toBe(false); // Mobile default: hidden
    });
    
    test('should find all required DOM elements', () => {
      expect(sidebarManager.sidebar).toBeTruthy();
      expect(sidebarManager.overlay).toBeTruthy();
      expect(sidebarManager.toggleButtons.length).toBeGreaterThan(0);
      expect(sidebarManager.mainContent).toBeTruthy();
    });
    
    test('should set up accessibility attributes', () => {
      const sidebar = domElements.sidebar;
      expect(sidebar.setAttribute).toHaveBeenCalledWith('role', 'navigation');
      expect(sidebar.setAttribute).toHaveBeenCalledWith('aria-label', 'Main navigation');
      expect(sidebar.setAttribute).toHaveBeenCalledWith('id', 'main-sidebar');
    });
  });

  describe('Device Detection', () => {
    test('should detect mobile device correctly', () => {
      global.window.innerWidth = 768;
      const changed = sidebarManager.updateDeviceType();
      
      expect(sidebarManager.isMobile).toBe(true);
      expect(changed).toBe(true);
    });
    
    test('should detect desktop device correctly', () => {
      global.window.innerWidth = 1200;
      const changed = sidebarManager.updateDeviceType();
      
      expect(sidebarManager.isMobile).toBe(false);
      expect(changed).toBe(true);
    });
    
    test('should use 1024px as breakpoint', () => {
      // Test exactly at breakpoint
      global.window.innerWidth = 1024;
      sidebarManager.updateDeviceType();
      expect(sidebarManager.isMobile).toBe(true);
      
      // Test just above breakpoint
      global.window.innerWidth = 1025;
      sidebarManager.updateDeviceType();
      expect(sidebarManager.isMobile).toBe(false);
    });
    
    test('should return false when device type does not change', () => {
      global.window.innerWidth = 1200;
      sidebarManager.updateDeviceType();
      
      // Same width should return false
      const changed = sidebarManager.updateDeviceType();
      expect(changed).toBe(false);
    });
  });

  describe('Default State Management', () => {
    test('should return correct default state for mobile', () => {
      sidebarManager.isMobile = true;
      expect(sidebarManager.getDefaultState()).toBe(false); // Hidden on mobile
    });
    
    test('should return correct default state for desktop', () => {
      sidebarManager.isMobile = false;
      expect(sidebarManager.getDefaultState()).toBe(true); // Visible on desktop
    });
    
    test('should reset to default state correctly', () => {
      // Test mobile reset
      sidebarManager.isMobile = true;
      sidebarManager.isVisible = true; // Set to non-default
      sidebarManager.resetToDefault();
      expect(sidebarManager.isVisible).toBe(false);
      
      // Test desktop reset
      sidebarManager.isMobile = false;
      sidebarManager.isVisible = false; // Set to non-default
      sidebarManager.resetToDefault();
      expect(sidebarManager.isVisible).toBe(true);
    });
  });

  describe('Mobile Behavior', () => {
    beforeEach(() => {
      global.window.innerWidth = 768;
      sidebarManager = new SimpleSidebarManager();
    });
    
    test('should start hidden on mobile', () => {
      const state = sidebarManager.getCurrentState();
      expect(state.isMobile).toBe(true);
      expect(state.isVisible).toBe(false);
    });
    
    test('should show overlay when sidebar is visible on mobile', () => {
      sidebarManager.showSidebar();
      
      const overlay = domElements.overlay;
      expect(overlay.classList.add).toHaveBeenCalledWith('sidebar-overlay--visible');
      expect(overlay.setAttribute).toHaveBeenCalledWith('aria-hidden', 'false');
    });
    
    test('should hide overlay when sidebar is hidden on mobile', () => {
      sidebarManager.showSidebar();
      sidebarManager.hideSidebar();
      
      const overlay = domElements.overlay;
      expect(overlay.classList.remove).toHaveBeenCalledWith('sidebar-overlay--visible');
      expect(overlay.setAttribute).toHaveBeenCalledWith('aria-hidden', 'true');
    });
    
    test('should toggle sidebar visibility on mobile', () => {
      expect(sidebarManager.isVisible).toBe(false);
      
      sidebarManager.toggle();
      expect(sidebarManager.isVisible).toBe(true);
      
      sidebarManager.toggle();
      expect(sidebarManager.isVisible).toBe(false);
    });
    
    test('should handle overlay click to close on mobile', () => {
      sidebarManager.showSidebar();
      expect(sidebarManager.isVisible).toBe(true);
      
      // Simulate overlay click
      const overlay = document.querySelector('[data-sidebar-overlay]');
      const clickEvent = new dom.window.Event('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: overlay });
      overlay.dispatchEvent(clickEvent);
      
      // Should close sidebar
      expect(sidebarManager.isVisible).toBe(false);
    });
  });

  describe('Desktop Behavior', () => {
    beforeEach(() => {
      global.window.innerWidth = 1200;
      sidebarManager = new SimpleSidebarManager();
    });
    
    test('should start visible on desktop', () => {
      const state = sidebarManager.getCurrentState();
      expect(state.isMobile).toBe(false);
      expect(state.isVisible).toBe(true);
    });
    
    test('should not show overlay on desktop', () => {
      sidebarManager.showSidebar();
      
      const overlay = document.querySelector('[data-sidebar-overlay]');
      expect(overlay.classList.contains('sidebar-overlay--visible')).toBe(false);
    });
    
    test('should show floating toggle when sidebar is hidden on desktop', () => {
      sidebarManager.hideSidebar();
      
      const floatingToggle = document.querySelector('.floating-sidebar-toggle');
      expect(floatingToggle.classList.contains('floating-sidebar-toggle--visible')).toBe(true);
      expect(floatingToggle.getAttribute('aria-hidden')).toBe('false');
    });
    
    test('should hide floating toggle when sidebar is visible on desktop', () => {
      sidebarManager.hideSidebar(); // First hide to show floating toggle
      sidebarManager.showSidebar(); // Then show to hide floating toggle
      
      const floatingToggle = document.querySelector('.floating-sidebar-toggle');
      expect(floatingToggle.classList.contains('floating-sidebar-toggle--visible')).toBe(false);
      expect(floatingToggle.getAttribute('aria-hidden')).toBe('true');
    });
    
    test('should adjust main content margin on desktop', () => {
      const mainContent = document.querySelector('.main-content');
      
      // When sidebar is visible, no special class
      sidebarManager.showSidebar();
      expect(mainContent.classList.contains('main-content--sidebar-hidden')).toBe(false);
      
      // When sidebar is hidden, add class
      sidebarManager.hideSidebar();
      expect(mainContent.classList.contains('main-content--sidebar-hidden')).toBe(true);
    });
  });

  describe('Window Resize Behavior', () => {
    test('should reset to mobile default when resizing to mobile', () => {
      // Start on desktop (visible)
      global.window.innerWidth = 1200;
      sidebarManager = new SimpleSidebarManager();
      expect(sidebarManager.isVisible).toBe(true);
      
      // Resize to mobile
      global.window.innerWidth = 768;
      sidebarManager.handleResize();
      
      // Should reset to mobile default (hidden)
      expect(sidebarManager.isMobile).toBe(true);
      expect(sidebarManager.isVisible).toBe(false);
    });
    
    test('should reset to desktop default when resizing to desktop', () => {
      // Start on mobile (hidden)
      global.window.innerWidth = 768;
      sidebarManager = new SimpleSidebarManager();
      expect(sidebarManager.isVisible).toBe(false);
      
      // Resize to desktop
      global.window.innerWidth = 1200;
      sidebarManager.handleResize();
      
      // Should reset to desktop default (visible)
      expect(sidebarManager.isMobile).toBe(false);
      expect(sidebarManager.isVisible).toBe(true);
    });
    
    test('should not reset state if device type does not change', () => {
      // Start on desktop
      global.window.innerWidth = 1200;
      sidebarManager = new SimpleSidebarManager();
      sidebarManager.hideSidebar(); // Change from default
      
      // Resize within desktop range
      global.window.innerWidth = 1400;
      sidebarManager.handleResize();
      
      // Should maintain current state
      expect(sidebarManager.isVisible).toBe(false);
    });
    
    test('should clean up previous device state on resize', () => {
      // Start on mobile with sidebar open
      global.window.innerWidth = 768;
      sidebarManager = new SimpleSidebarManager();
      sidebarManager.showSidebar();
      
      const overlay = document.querySelector('[data-sidebar-overlay]');
      expect(overlay.classList.contains('sidebar-overlay--visible')).toBe(true);
      
      // Resize to desktop
      global.window.innerWidth = 1200;
      sidebarManager.handleResize();
      
      // Overlay should be hidden
      expect(overlay.classList.contains('sidebar-overlay--visible')).toBe(false);
    });
  });

  describe('No Preference Persistence', () => {
    test('should not use localStorage', () => {
      // Perform various operations
      sidebarManager.toggle();
      sidebarManager.showSidebar();
      sidebarManager.hideSidebar();
      
      // localStorage should never be called
      expect(global.window.localStorage.getItem).not.toHaveBeenCalled();
      expect(global.window.localStorage.setItem).not.toHaveBeenCalled();
    });
    
    test('should not use sessionStorage', () => {
      // Perform various operations
      sidebarManager.toggle();
      sidebarManager.showSidebar();
      sidebarManager.hideSidebar();
      
      // sessionStorage should never be called
      expect(global.window.sessionStorage.getItem).not.toHaveBeenCalled();
      expect(global.window.sessionStorage.setItem).not.toHaveBeenCalled();
    });
    
    test('should always reset to default state on initialization', () => {
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
  });

  describe('Toggle Button Functionality', () => {
    test('should handle hamburger button clicks', () => {
      const hamburgerButton = document.querySelector('.mobile-menu-toggle');
      const initialState = sidebarManager.isVisible;
      
      // Simulate click
      const clickEvent = new dom.window.Event('click', { bubbles: true });
      hamburgerButton.dispatchEvent(clickEvent);
      
      expect(sidebarManager.isVisible).toBe(!initialState);
    });
    
    test('should handle sidebar toggle button clicks', () => {
      const toggleButton = document.querySelector('.sidebar-toggle-button');
      const initialState = sidebarManager.isVisible;
      
      // Simulate click
      const clickEvent = new dom.window.Event('click', { bubbles: true });
      toggleButton.dispatchEvent(clickEvent);
      
      expect(sidebarManager.isVisible).toBe(!initialState);
    });
    
    test('should prevent rapid toggle clicks during animations', () => {
      sidebarManager.isAnimating = true;
      const initialState = sidebarManager.isVisible;
      
      const hamburgerButton = document.querySelector('.mobile-menu-toggle');
      const clickEvent = new dom.window.Event('click', { bubbles: true });
      hamburgerButton.dispatchEvent(clickEvent);
      
      // State should not change during animation
      expect(sidebarManager.isVisible).toBe(initialState);
    });
    
    test('should update ARIA attributes on toggle buttons', () => {
      const toggleButton = document.querySelector('.mobile-menu-toggle');
      
      // Initial state
      expect(toggleButton.getAttribute('aria-expanded')).toBe(sidebarManager.isVisible.toString());
      
      // Toggle and check
      sidebarManager.toggle();
      expect(toggleButton.getAttribute('aria-expanded')).toBe(sidebarManager.isVisible.toString());
    });
    
    test('should handle keyboard events on toggle buttons', () => {
      const toggleButton = document.querySelector('.mobile-menu-toggle');
      const initialState = sidebarManager.isVisible;
      
      // Test Enter key
      const enterEvent = new dom.window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      toggleButton.dispatchEvent(enterEvent);
      expect(sidebarManager.isVisible).toBe(!initialState);
      
      // Test Space key
      const spaceEvent = new dom.window.KeyboardEvent('keydown', { key: ' ', bubbles: true });
      toggleButton.dispatchEvent(spaceEvent);
      expect(sidebarManager.isVisible).toBe(initialState);
    });
  });

  describe('Accessibility Features', () => {
    test('should handle Escape key to close sidebar', () => {
      sidebarManager.showSidebar();
      expect(sidebarManager.isVisible).toBe(true);
      
      // Simulate Escape key
      const escapeEvent = new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      document.dispatchEvent(escapeEvent);
      
      expect(sidebarManager.isVisible).toBe(false);
    });
    
    test('should update sidebar ARIA attributes', () => {
      const sidebar = document.querySelector('[data-sidebar]');
      
      sidebarManager.showSidebar();
      expect(sidebar.getAttribute('aria-hidden')).toBe('false');
      expect(sidebar.getAttribute('aria-expanded')).toBe('true');
      
      sidebarManager.hideSidebar();
      expect(sidebar.getAttribute('aria-hidden')).toBe('true');
      expect(sidebar.getAttribute('aria-expanded')).toBe('false');
    });
    
    test('should manage focus on sidebar elements', () => {
      const sidebarLinks = document.querySelectorAll('.sidebar a, .sidebar button');
      
      sidebarManager.hideSidebar();
      // When hidden, focusable elements should have tabindex="-1"
      sidebarLinks.forEach(element => {
        expect(element.getAttribute('tabindex')).toBe('-1');
      });
      
      sidebarManager.showSidebar();
      // When visible, tabindex should be removed or restored
      sidebarLinks.forEach(element => {
        expect(element.getAttribute('tabindex')).not.toBe('-1');
      });
    });
    
    test('should announce sidebar state changes', () => {
      const announcer = document.getElementById('sidebar-announcements');
      
      sidebarManager.showSidebar();
      // Should announce the state change
      expect(announcer.textContent).toContain('opened');
      
      sidebarManager.hideSidebar();
      expect(announcer.textContent).toContain('closed');
    });
  });

  describe('Animation and Timing', () => {
    test('should set animation flag during transitions', () => {
      expect(sidebarManager.isAnimating).toBe(false);
      
      sidebarManager.showSidebar();
      expect(sidebarManager.isAnimating).toBe(true);
      
      // Animation flag should reset after timeout
      setTimeout(() => {
        expect(sidebarManager.isAnimating).toBe(false);
      }, 350);
    });
    
    test('should prevent operations during animation', () => {
      sidebarManager.isAnimating = true;
      const initialState = sidebarManager.isVisible;
      
      sidebarManager.toggle();
      expect(sidebarManager.isVisible).toBe(initialState);
      
      sidebarManager.showSidebar();
      expect(sidebarManager.isVisible).toBe(initialState);
      
      sidebarManager.hideSidebar();
      expect(sidebarManager.isVisible).toBe(initialState);
    });
  });

  describe('Public API', () => {
    test('should provide getCurrentState method', () => {
      const state = sidebarManager.getCurrentState();
      expect(state).toHaveProperty('isVisible');
      expect(state).toHaveProperty('isMobile');
      expect(typeof state.isVisible).toBe('boolean');
      expect(typeof state.isMobile).toBe('boolean');
    });
    
    test('should provide forceShow method', () => {
      sidebarManager.forceShow();
      expect(sidebarManager.isVisible).toBe(true);
    });
    
    test('should provide forceHide method', () => {
      sidebarManager.forceHide();
      expect(sidebarManager.isVisible).toBe(false);
    });
    
    test('should provide refresh method', () => {
      // Should not throw error
      expect(() => sidebarManager.refresh()).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    test('should handle missing sidebar element gracefully', () => {
      // Remove sidebar element
      const sidebar = document.querySelector('[data-sidebar]');
      sidebar.remove();
      
      // Should not throw error
      expect(() => new SimpleSidebarManager()).not.toThrow();
    });
    
    test('should handle missing overlay element gracefully', () => {
      // Remove overlay element
      const overlay = document.querySelector('[data-sidebar-overlay]');
      overlay.remove();
      
      // Should not throw error
      expect(() => new SimpleSidebarManager()).not.toThrow();
    });
    
    test('should handle missing toggle buttons gracefully', () => {
      // Remove all toggle buttons
      const toggleButtons = document.querySelectorAll('[data-sidebar-toggle]');
      toggleButtons.forEach(button => button.remove());
      
      // Should not throw error
      expect(() => new SimpleSidebarManager()).not.toThrow();
    });
  });
});