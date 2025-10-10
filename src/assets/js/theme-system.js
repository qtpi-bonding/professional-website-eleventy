/**
 * Theme System - Automatic detection and manual switching
 * Handles light/dark mode with system preference detection
 */

class ThemeSystem {
  constructor() {
    this.themes = ['light', 'dark', 'system'];
    this.currentTheme = this.getStoredTheme() || 'system';
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    this.init();
  }
  
  init() {
    // Add theme loading class to prevent flash
    document.documentElement.classList.add('theme-loading');
    
    // Apply initial theme
    this.applyTheme(this.currentTheme);
    
    // Listen for system theme changes
    this.mediaQuery.addEventListener('change', () => {
      if (this.currentTheme === 'system') {
        this.applySystemTheme();
      }
    });
    
    // Remove loading class after a brief delay
    setTimeout(() => {
      document.documentElement.classList.remove('theme-loading');
    }, 100);
  }
  
  getStoredTheme() {
    try {
      return localStorage.getItem('theme');
    } catch (e) {
      return null;
    }
  }
  
  setStoredTheme(theme) {
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // Silently fail if localStorage is not available
    }
  }
  
  applyTheme(theme) {
    this.currentTheme = theme;
    this.setStoredTheme(theme);
    
    if (theme === 'system') {
      this.applySystemTheme();
    } else {
      this.applyManualTheme(theme);
    }
    
    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme: this.getEffectiveTheme() }
    }));
  }
  
  applySystemTheme() {
    const isDark = this.mediaQuery.matches;
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }
  
  applyManualTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }
  
  getEffectiveTheme() {
    if (this.currentTheme === 'system') {
      return this.mediaQuery.matches ? 'dark' : 'light';
    }
    return this.currentTheme;
  }
  
  getCurrentTheme() {
    return this.currentTheme;
  }
  
  setTheme(theme) {
    if (this.themes.includes(theme)) {
      this.applyTheme(theme);
    }
  }
  
  toggleTheme() {
    const effectiveTheme = this.getEffectiveTheme();
    const newTheme = effectiveTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
  
  // Utility method to check if dark mode is active
  isDarkMode() {
    return this.getEffectiveTheme() === 'dark';
  }
}

// Initialize theme system when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.themeSystem = new ThemeSystem();
  });
} else {
  window.themeSystem = new ThemeSystem();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeSystem;
}