/**
 * Content Filter System - Client-side filtering for Science/Policy/Tech content
 * Implements progressive enhancement with smooth transitions and accessibility
 */

class ContentFilter {
  constructor(options = {}) {
    this.options = {
      filterSelector: '.filter-button',
      contentSelector: '[data-tags]',
      activeClass: 'filter-button--active',
      inactiveClass: 'filter-button--inactive',
      hiddenClass: 'content-hidden',
      animationDuration: 300,
      announcementDelay: 100,
      ...options
    };
    
    this.currentFilter = 'all';
    this.filterButtons = [];
    this.contentItems = [];
    this.announcementArea = null;
    this.isAnimating = false;
    this.deviceType = this.getDeviceType();
    
    this.init();
  }
  
  init() {
    // Find filter buttons and content items
    this.filterButtons = Array.from(document.querySelectorAll(this.options.filterSelector));
    this.contentItems = Array.from(document.querySelectorAll(this.options.contentSelector));
    this.announcementArea = document.getElementById('filter-announcement');
    
    if (this.filterButtons.length === 0) {
      console.warn('ContentFilter: No filter buttons found');
      return;
    }
    
    // Set up event listeners
    this.bindEvents();
    
    // Initialize with current state
    this.initializeState();
    
    // Add CSS for smooth transitions
    this.addFilterStyles();
    
    console.log(`ContentFilter initialized with ${this.filterButtons.length} filters and ${this.contentItems.length} content items`);
  }
  
  bindEvents() {
    // Add click handlers to filter buttons with mobile optimization
    this.filterButtons.forEach(button => {
      // Use touchend for better mobile responsiveness
      if (this.deviceType === 'mobile') {
        button.addEventListener('touchend', (e) => {
          e.preventDefault();
          const filter = button.dataset.filter;
          if (filter && !this.isAnimating) {
            this.setFilterWithMobileOptimization(filter);
          }
        }, { passive: false });
      }
      
      // Standard click handler for all devices
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = button.dataset.filter;
        if (filter && !this.isAnimating) {
          if (this.deviceType === 'mobile') {
            this.setFilterWithMobileOptimization(filter);
          } else {
            this.setFilter(filter);
          }
        }
      });
      
      // Add keyboard support
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const filter = button.dataset.filter;
          if (filter && !this.isAnimating) {
            this.setFilter(filter);
          }
        }
      });
      
      // Add mobile-specific touch feedback
      if (this.deviceType === 'mobile') {
        button.addEventListener('touchstart', (e) => {
          button.classList.add('filter-button--touch-active');
        }, { passive: true });
        
        button.addEventListener('touchend', (e) => {
          setTimeout(() => {
            button.classList.remove('filter-button--touch-active');
          }, 150);
        }, { passive: true });
        
        button.addEventListener('touchcancel', (e) => {
          button.classList.remove('filter-button--touch-active');
        }, { passive: true });
      }
    });
    
    // Handle URL hash changes for deep linking
    window.addEventListener('hashchange', () => {
      this.handleHashChange();
    });
    
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      this.handleHashChange();
    });
    
    // Handle device type changes on resize
    window.addEventListener('resize', this.debounce(() => {
      const newDeviceType = this.getDeviceType();
      if (newDeviceType !== this.deviceType) {
        this.deviceType = newDeviceType;
        this.handleDeviceTypeChange();
      }
    }, 250));
  }
  
  initializeState() {
    // Check for URL hash filter
    const hashFilter = this.getFilterFromHash();
    if (hashFilter && this.isValidFilter(hashFilter)) {
      this.currentFilter = hashFilter;
    } else {
      // Find active button or default to 'all'
      const activeButton = this.filterButtons.find(btn => 
        btn.classList.contains(this.options.activeClass) || 
        btn.getAttribute('aria-pressed') === 'true'
      );
      this.currentFilter = activeButton?.dataset.filter || 'all';
    }
    
    // Apply initial filter without animation
    this.applyFilter(this.currentFilter, false);
  }
  
  setFilter(filter) {
    if (filter === this.currentFilter || this.isAnimating) {
      return;
    }
    
    const previousFilter = this.currentFilter;
    this.currentFilter = filter;
    
    // Update URL hash
    this.updateHash(filter);
    
    // Apply filter with animation
    this.applyFilter(filter, true);
    
    // Announce change to screen readers
    this.announceFilterChange(filter, previousFilter);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('filterchange', {
      detail: { 
        filter, 
        previousFilter,
        visibleCount: this.getVisibleCount(filter),
        deviceType: this.deviceType
      }
    }));
  }
  
  // Mobile-optimized filter setting with enhanced UX
  setFilterWithMobileOptimization(filter) {
    if (filter === this.currentFilter || this.isAnimating) {
      return;
    }
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Provide immediate visual feedback
    const button = this.filterButtons.find(btn => btn.dataset.filter === filter);
    if (button) {
      button.classList.add('filter-button--mobile-processing');
    }
    
    // Ensure navigation system is aware of filtering
    this.maintainNavigationDuringFiltering();
    
    // Apply filter with mobile-specific timing
    setTimeout(() => {
      this.setFilter(filter);
      
      // Clean up mobile processing state
      if (button) {
        setTimeout(() => {
          button.classList.remove('filter-button--mobile-processing');
        }, this.options.animationDuration);
      }
    }, 50);
  }
  
  // Maintain proper section visibility and navigation after filtering
  maintainNavigationDuringFiltering() {
    // Store current scroll position
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      this.scrollPositionBeforeFilter = mainContent.scrollTop;
    }
    
    // Get current active section from navigation system
    if (window.navigationSystem) {
      this.activeSectionBeforeFilter = window.navigationSystem.getCurrentSection();
    }
  }
  
  // Device type detection
  getDeviceType() {
    const width = window.innerWidth;
    
    if (width >= 1024) return 'desktop';
    if (width >= 768) return 'tablet';
    return 'mobile';
  }
  
  // Handle device type changes
  handleDeviceTypeChange() {
    console.log('ContentFilter: Device type changed to', this.deviceType);
    
    // Re-apply current filter with device-appropriate behavior
    this.applyFilter(this.currentFilter, false);
    
    // Update filter button interactions
    this.updateFilterButtonInteractions();
  }
  
  // Update filter button interactions based on device type
  updateFilterButtonInteractions() {
    this.filterButtons.forEach(button => {
      // Remove existing mobile-specific classes
      button.classList.remove('filter-button--touch-active', 'filter-button--mobile-processing');
      
      // Update touch action based on device type
      if (this.deviceType === 'mobile') {
        button.style.touchAction = 'manipulation';
      } else {
        button.style.touchAction = 'auto';
      }
    });
  }
  
  // Debounce utility for resize events
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  applyFilter(filter, animate = true) {
    if (animate) {
      this.isAnimating = true;
    }
    
    // Update button states
    this.updateButtonStates(filter);
    
    // Filter content items
    this.filterContent(filter, animate);
    
    if (animate) {
      // Reset animation flag after transition
      setTimeout(() => {
        this.isAnimating = false;
      }, this.options.animationDuration);
    }
  }
  
  updateButtonStates(activeFilter) {
    this.filterButtons.forEach(button => {
      const isActive = button.dataset.filter === activeFilter;
      
      // Update classes
      button.classList.toggle(this.options.activeClass, isActive);
      button.classList.toggle(this.options.inactiveClass, !isActive);
      
      // Update ARIA attributes
      button.setAttribute('aria-pressed', isActive.toString());
      
      // Update tabindex for keyboard navigation
      button.setAttribute('tabindex', isActive ? '0' : '-1');
    });
  }
  
  filterContent(filter, animate = true) {
    const itemsToShow = [];
    const itemsToHide = [];
    
    this.contentItems.forEach(item => {
      const shouldShow = this.shouldShowItem(item, filter);
      
      if (shouldShow) {
        itemsToShow.push(item);
      } else {
        itemsToHide.push(item);
      }
    });
    
    if (animate) {
      // Use device-appropriate animation timing
      const animationDelay = this.deviceType === 'mobile' ? 100 : 50;
      
      // Animate out hidden items first
      this.animateItems(itemsToHide, false, () => {
        // Then animate in visible items
        this.animateItems(itemsToShow, true, () => {
          // After filtering is complete, maintain navigation state
          this.restoreNavigationAfterFiltering();
        });
      }, animationDelay);
    } else {
      // Immediate show/hide without animation
      itemsToHide.forEach(item => this.hideItem(item));
      itemsToShow.forEach(item => this.showItem(item));
      this.restoreNavigationAfterFiltering();
    }
  }
  
  // Restore navigation state after filtering
  restoreNavigationAfterFiltering() {
    if (this.deviceType !== 'mobile') return;
    
    // Ensure navigation system updates section visibility
    if (window.navigationSystem) {
      setTimeout(() => {
        window.navigationSystem.refresh();
        
        // If we had an active section before filtering, try to maintain it
        if (this.activeSectionBeforeFilter) {
          const activeSection = document.getElementById(this.activeSectionBeforeFilter);
          if (activeSection && !activeSection.classList.contains(this.options.hiddenClass)) {
            // Section is still visible after filtering, maintain scroll position
            const mainContent = document.querySelector('.main-content');
            if (mainContent && this.scrollPositionBeforeFilter !== undefined) {
              mainContent.scrollTop = this.scrollPositionBeforeFilter;
            }
          }
        }
      }, this.options.animationDuration + 100);
    }
    
    // Clean up stored state
    this.scrollPositionBeforeFilter = undefined;
    this.activeSectionBeforeFilter = undefined;
  }
  
  shouldShowItem(item, filter) {
    if (filter === 'all') {
      return true;
    }
    
    const tags = this.getItemTags(item);
    return tags.includes(filter);
  }
  
  getItemTags(item) {
    const tagsAttr = item.dataset.tags;
    if (!tagsAttr) {
      return [];
    }
    
    // Handle both comma-separated and space-separated tags
    return tagsAttr.toLowerCase()
      .split(/[,\s]+/)
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }
  
  animateItems(items, show, callback, staggerDelay = 50) {
    if (items.length === 0) {
      if (callback) callback();
      return;
    }
    
    // Use requestAnimationFrame for smooth animations
    requestAnimationFrame(() => {
      items.forEach((item, index) => {
        // Use device-appropriate stagger timing
        const delay = this.deviceType === 'mobile' ? 
          Math.min(index * staggerDelay, 200) : // Cap mobile stagger for performance
          index * staggerDelay;
        
        setTimeout(() => {
          if (show) {
            this.showItem(item);
          } else {
            this.hideItem(item);
          }
        }, delay);
      });
      
      // Call callback after all animations start
      if (callback) {
        const totalDelay = this.deviceType === 'mobile' ? 
          Math.min(items.length * staggerDelay, 200) + 150 :
          items.length * staggerDelay + 100;
        setTimeout(callback, totalDelay);
      }
    });
  }
  
  showItem(item) {
    item.classList.remove(this.options.hiddenClass);
    item.setAttribute('aria-hidden', 'false');
    
    // Restore to normal flow
    item.style.display = '';
    item.style.opacity = '';
    item.style.transform = '';
  }
  
  hideItem(item) {
    item.classList.add(this.options.hiddenClass);
    item.setAttribute('aria-hidden', 'true');
    
    // Use CSS transitions for smooth hiding
    item.style.opacity = '0';
    item.style.transform = 'scale(0.95)';
    
    // Remove from flow after transition
    setTimeout(() => {
      if (item.classList.contains(this.options.hiddenClass)) {
        item.style.display = 'none';
      }
    }, this.options.animationDuration);
  }
  
  announceFilterChange(newFilter, previousFilter) {
    if (!this.announcementArea) {
      return;
    }
    
    const visibleCount = this.getVisibleCount(newFilter);
    const filterLabel = this.getFilterLabel(newFilter);
    
    let message;
    if (newFilter === 'all') {
      message = `Showing all content. ${visibleCount} items visible.`;
    } else {
      message = `Filtered to ${filterLabel} content. ${visibleCount} items visible.`;
    }
    
    // Delay announcement to avoid interrupting button click feedback
    setTimeout(() => {
      this.announcementArea.textContent = message;
    }, this.options.announcementDelay);
  }
  
  getVisibleCount(filter) {
    return this.contentItems.filter(item => this.shouldShowItem(item, filter)).length;
  }
  
  getFilterLabel(filter) {
    const button = this.filterButtons.find(btn => btn.dataset.filter === filter);
    return button ? button.textContent.trim() : filter;
  }
  
  isValidFilter(filter) {
    return this.filterButtons.some(btn => btn.dataset.filter === filter);
  }
  
  getFilterFromHash() {
    const hash = window.location.hash.slice(1);
    return hash.startsWith('filter-') ? hash.replace('filter-', '') : null;
  }
  
  updateHash(filter) {
    const newHash = filter === 'all' ? '' : `#filter-${filter}`;
    
    // Update URL without triggering hashchange event
    if (window.history && window.history.replaceState) {
      const url = window.location.pathname + window.location.search + newHash;
      window.history.replaceState(null, '', url);
    } else {
      // Fallback for older browsers
      window.location.hash = newHash;
    }
  }
  
  handleHashChange() {
    const hashFilter = this.getFilterFromHash();
    if (hashFilter && this.isValidFilter(hashFilter) && hashFilter !== this.currentFilter) {
      this.setFilter(hashFilter);
    } else if (!hashFilter && this.currentFilter !== 'all') {
      this.setFilter('all');
    }
  }
  
  addFilterStyles() {
    // Add CSS for smooth content transitions with mobile optimizations
    const style = document.createElement('style');
    style.textContent = `
      /* Content filter transition styles */
      ${this.options.contentSelector} {
        transition: opacity ${this.options.animationDuration}ms ease-in-out,
                    transform ${this.options.animationDuration}ms ease-in-out;
      }
      
      ${this.options.contentSelector}.${this.options.hiddenClass} {
        pointer-events: none;
      }
      
      /* Mobile-specific filter button states */
      .filter-button--touch-active {
        transform: scale(0.98);
        opacity: 0.8;
        transition: transform 150ms ease-out, opacity 150ms ease-out;
      }
      
      .filter-button--mobile-processing {
        position: relative;
        overflow: hidden;
      }
      
      .filter-button--mobile-processing::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        animation: mobile-filter-processing 600ms ease-in-out;
      }
      
      @keyframes mobile-filter-processing {
        0% { left: -100%; }
        100% { left: 100%; }
      }
      
      /* Mobile-specific content transitions */
      @media (max-width: 767px) {
        ${this.options.contentSelector} {
          transition: opacity 250ms ease-in-out,
                      transform 250ms ease-in-out;
        }
        
        /* Optimize for mobile performance */
        ${this.options.contentSelector}.${this.options.hiddenClass} {
          will-change: opacity, transform;
        }
        
        /* Enhanced mobile filter button feedback */
        .filter-button {
          transition: all 200ms ease-in-out;
        }
        
        .filter-button:active {
          transform: scale(0.96);
        }
      }
      
      /* Tablet optimizations */
      @media (min-width: 768px) and (max-width: 1023px) {
        ${this.options.contentSelector} {
          transition: opacity 200ms ease-in-out,
                      transform 200ms ease-in-out;
        }
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        ${this.options.contentSelector} {
          transition: none !important;
        }
        
        .filter-button--touch-active,
        .filter-button--mobile-processing,
        .filter-button {
          transition: none !important;
          animation: none !important;
        }
        
        .filter-button--mobile-processing::after {
          display: none;
        }
      }
      
      /* Focus management during filtering */
      .filter-button:focus-visible {
        outline: 2px solid var(--color-secondary);
        outline-offset: 2px;
      }
      
      /* High contrast mode support for mobile states */
      @media (prefers-contrast: high) {
        .filter-button--touch-active {
          border-width: 3px;
        }
        
        .filter-button--mobile-processing::after {
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.5), transparent);
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Public API methods
  getCurrentFilter() {
    return this.currentFilter;
  }
  
  getAvailableFilters() {
    return this.filterButtons.map(btn => ({
      id: btn.dataset.filter,
      label: btn.textContent.trim(),
      element: btn
    }));
  }
  
  getVisibleItems() {
    return this.contentItems.filter(item => !item.classList.contains(this.options.hiddenClass));
  }
  
  refresh() {
    // Re-scan for content items (useful if content is dynamically added)
    this.contentItems = Array.from(document.querySelectorAll(this.options.contentSelector));
    this.applyFilter(this.currentFilter, false);
  }
  
  destroy() {
    // Clean up event listeners
    this.filterButtons.forEach(button => {
      button.replaceWith(button.cloneNode(true));
    });
    
    window.removeEventListener('hashchange', this.handleHashChange);
    window.removeEventListener('popstate', this.handleHashChange);
  }
}

// Progressive enhancement - only initialize if filter elements exist
function initializeContentFilter() {
  const filterButtons = document.querySelectorAll('.filter-button');
  const contentItems = document.querySelectorAll('[data-tags]');
  
  if (filterButtons.length > 0 && contentItems.length > 0) {
    window.contentFilter = new ContentFilter();
    console.log('Content filtering enabled');
  } else {
    console.log('Content filtering not initialized - missing required elements');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeContentFilter);
} else {
  initializeContentFilter();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContentFilter;
}