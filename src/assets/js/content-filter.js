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
    // Add click handlers to filter buttons
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = button.dataset.filter;
        if (filter && !this.isAnimating) {
          this.setFilter(filter);
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
    });
    
    // Handle URL hash changes for deep linking
    window.addEventListener('hashchange', () => {
      this.handleHashChange();
    });
    
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      this.handleHashChange();
    });
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
        visibleCount: this.getVisibleCount(filter)
      }
    }));
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
      // Animate out hidden items first
      this.animateItems(itemsToHide, false, () => {
        // Then animate in visible items
        this.animateItems(itemsToShow, true);
      });
    } else {
      // Immediate show/hide without animation
      itemsToHide.forEach(item => this.hideItem(item));
      itemsToShow.forEach(item => this.showItem(item));
    }
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
  
  animateItems(items, show, callback) {
    if (items.length === 0) {
      if (callback) callback();
      return;
    }
    
    // Use requestAnimationFrame for smooth animations
    requestAnimationFrame(() => {
      items.forEach((item, index) => {
        // Stagger animations slightly for better visual effect
        setTimeout(() => {
          if (show) {
            this.showItem(item);
          } else {
            this.hideItem(item);
          }
        }, index * 50);
      });
      
      // Call callback after all animations start
      if (callback) {
        setTimeout(callback, items.length * 50 + 100);
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
    // Add CSS for smooth content transitions
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
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        ${this.options.contentSelector} {
          transition: none !important;
        }
      }
      
      /* Focus management during filtering */
      .filter-button:focus-visible {
        outline: 2px solid var(--color-secondary);
        outline-offset: 2px;
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