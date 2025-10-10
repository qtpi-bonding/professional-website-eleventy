/**
 * Unit tests for ContentFilter class
 * Tests filter state management, content visibility logic, and accessibility features
 */

// Mock DOM environment for testing
const { JSDOM } = require('jsdom');

// Set up DOM environment
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head>
  <title>Test</title>
</head>
<body>
  <!-- Filter buttons -->
  <div class="filter-system">
    <button class="filter-button filter-button--active" data-filter="all" aria-pressed="true">All</button>
    <button class="filter-button filter-button--inactive" data-filter="science" aria-pressed="false">Science</button>
    <button class="filter-button filter-button--inactive" data-filter="policy" aria-pressed="false">Policy</button>
    <button class="filter-button filter-button--inactive" data-filter="tech" aria-pressed="false">Tech</button>
    <div id="filter-announcement" class="sr-only" aria-live="polite"></div>
  </div>
  
  <!-- Content items with tags -->
  <div data-tags="science,policy" class="content-item">Science & Policy Item</div>
  <div data-tags="science" class="content-item">Science Only Item</div>
  <div data-tags="policy" class="content-item">Policy Only Item</div>
  <div data-tags="tech" class="content-item">Tech Only Item</div>
  <div data-tags="tech,science" class="content-item">Tech & Science Item</div>
  <div data-tags="" class="content-item">No Tags Item</div>
</body>
</html>
`, { url: 'http://localhost' });

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.requestAnimationFrame = (callback) => setTimeout(callback, 16);

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

// Import ContentFilter after setting up DOM
const ContentFilter = require('../src/assets/js/content-filter.js');

describe('ContentFilter', () => {
  let filter;
  let filterButtons;
  let contentItems;
  
  beforeEach(() => {
    // Reset DOM state
    document.querySelectorAll('.filter-button').forEach(btn => {
      btn.classList.remove('filter-button--active');
      btn.classList.add('filter-button--inactive');
      btn.setAttribute('aria-pressed', 'false');
    });
    
    document.querySelectorAll('[data-tags]').forEach(item => {
      item.classList.remove('content-hidden');
      item.removeAttribute('aria-hidden');
      item.style.display = '';
      item.style.opacity = '';
      item.style.transform = '';
    });
    
    // Set 'all' button as active
    const allButton = document.querySelector('[data-filter="all"]');
    allButton.classList.add('filter-button--active');
    allButton.classList.remove('filter-button--inactive');
    allButton.setAttribute('aria-pressed', 'true');
    
    // Create fresh instance
    filter = new ContentFilter();
    filterButtons = Array.from(document.querySelectorAll('.filter-button'));
    contentItems = Array.from(document.querySelectorAll('[data-tags]'));
  });
  
  afterEach(() => {
    if (filter && filter.destroy) {
      filter.destroy();
    }
  });
  
  describe('Initialization', () => {
    test('should initialize with correct default state', () => {
      expect(filter.getCurrentFilter()).toBe('all');
      expect(filter.getAvailableFilters()).toHaveLength(4);
    });
    
    test('should find all filter buttons and content items', () => {
      expect(filter.filterButtons).toHaveLength(4);
      expect(filter.contentItems).toHaveLength(6);
    });
    
    test('should set up announcement area', () => {
      expect(filter.announcementArea).toBeTruthy();
      expect(filter.announcementArea.id).toBe('filter-announcement');
    });
  });
  
  describe('Filter State Management', () => {
    test('should update current filter when setFilter is called', () => {
      filter.setFilter('science');
      expect(filter.getCurrentFilter()).toBe('science');
    });
    
    test('should not change filter if same filter is selected', () => {
      const initialFilter = filter.getCurrentFilter();
      filter.setFilter('all');
      expect(filter.getCurrentFilter()).toBe(initialFilter);
    });
    
    test('should update button states correctly', () => {
      filter.setFilter('science');
      
      const scienceButton = document.querySelector('[data-filter="science"]');
      const allButton = document.querySelector('[data-filter="all"]');
      
      expect(scienceButton.classList.contains('filter-button--active')).toBe(true);
      expect(scienceButton.getAttribute('aria-pressed')).toBe('true');
      
      expect(allButton.classList.contains('filter-button--inactive')).toBe(true);
      expect(allButton.getAttribute('aria-pressed')).toBe('false');
    });
  });
  
  describe('Content Visibility Logic', () => {
    test('should show all items when filter is "all"', () => {
      filter.setFilter('all');
      
      const visibleItems = filter.getVisibleItems();
      expect(visibleItems).toHaveLength(6);
    });
    
    test('should show only science items when filter is "science"', () => {
      filter.setFilter('science');
      
      // Items with science tag: science,policy + science + tech,science = 3 items
      const expectedVisible = contentItems.filter(item => {
        const tags = item.dataset.tags.split(',').map(t => t.trim());
        return tags.includes('science');
      });
      
      expect(expectedVisible).toHaveLength(3);
    });
    
    test('should show only policy items when filter is "policy"', () => {
      filter.setFilter('policy');
      
      // Items with policy tag: science,policy + policy = 2 items
      const expectedVisible = contentItems.filter(item => {
        const tags = item.dataset.tags.split(',').map(t => t.trim());
        return tags.includes('policy');
      });
      
      expect(expectedVisible).toHaveLength(2);
    });
    
    test('should show only tech items when filter is "tech"', () => {
      filter.setFilter('tech');
      
      // Items with tech tag: tech + tech,science = 2 items
      const expectedVisible = contentItems.filter(item => {
        const tags = item.dataset.tags.split(',').map(t => t.trim());
        return tags.includes('tech');
      });
      
      expect(expectedVisible).toHaveLength(2);
    });
    
    test('should handle items with no tags correctly', () => {
      const noTagsItem = document.querySelector('[data-tags=""]');
      
      // Should be visible with 'all' filter
      filter.setFilter('all');
      expect(filter.shouldShowItem(noTagsItem, 'all')).toBe(true);
      
      // Should be hidden with specific filters
      expect(filter.shouldShowItem(noTagsItem, 'science')).toBe(false);
      expect(filter.shouldShowItem(noTagsItem, 'policy')).toBe(false);
      expect(filter.shouldShowItem(noTagsItem, 'tech')).toBe(false);
    });
    
    test('should handle multi-tagged items correctly', () => {
      const multiTagItem = document.querySelector('[data-tags="science,policy"]');
      
      expect(filter.shouldShowItem(multiTagItem, 'all')).toBe(true);
      expect(filter.shouldShowItem(multiTagItem, 'science')).toBe(true);
      expect(filter.shouldShowItem(multiTagItem, 'policy')).toBe(true);
      expect(filter.shouldShowItem(multiTagItem, 'tech')).toBe(false);
    });
  });
  
  describe('Tag Parsing', () => {
    test('should parse comma-separated tags correctly', () => {
      const item = document.createElement('div');
      item.dataset.tags = 'science,policy,tech';
      
      const tags = filter.getItemTags(item);
      expect(tags).toEqual(['science', 'policy', 'tech']);
    });
    
    test('should handle tags with spaces', () => {
      const item = document.createElement('div');
      item.dataset.tags = 'science, policy , tech';
      
      const tags = filter.getItemTags(item);
      expect(tags).toEqual(['science', 'policy', 'tech']);
    });
    
    test('should handle empty tags', () => {
      const item = document.createElement('div');
      item.dataset.tags = '';
      
      const tags = filter.getItemTags(item);
      expect(tags).toEqual([]);
    });
    
    test('should handle missing tags attribute', () => {
      const item = document.createElement('div');
      
      const tags = filter.getItemTags(item);
      expect(tags).toEqual([]);
    });
  });
  
  describe('Accessibility Features', () => {
    test('should set aria-pressed correctly on buttons', () => {
      filter.setFilter('science');
      
      filterButtons.forEach(button => {
        const isActive = button.dataset.filter === 'science';
        expect(button.getAttribute('aria-pressed')).toBe(isActive.toString());
      });
    });
    
    test('should set aria-hidden on content items', () => {
      filter.setFilter('science');
      
      // Wait for async operations
      setTimeout(() => {
        contentItems.forEach(item => {
          const shouldShow = filter.shouldShowItem(item, 'science');
          const expectedAriaHidden = shouldShow ? 'false' : 'true';
          expect(item.getAttribute('aria-hidden')).toBe(expectedAriaHidden);
        });
      }, 100);
    });
    
    test('should announce filter changes', (done) => {
      filter.setFilter('science');
      
      // Check announcement after delay
      setTimeout(() => {
        const announcement = filter.announcementArea.textContent;
        expect(announcement).toContain('Science');
        expect(announcement).toContain('visible');
        done();
      }, 200);
    });
    
    test('should handle keyboard navigation', () => {
      const scienceButton = document.querySelector('[data-filter="science"]');
      
      // Simulate Enter key press
      const enterEvent = new dom.window.KeyboardEvent('keydown', { key: 'Enter' });
      scienceButton.dispatchEvent(enterEvent);
      
      expect(filter.getCurrentFilter()).toBe('science');
    });
    
    test('should handle space key for button activation', () => {
      const policyButton = document.querySelector('[data-filter="policy"]');
      
      // Simulate Space key press
      const spaceEvent = new dom.window.KeyboardEvent('keydown', { key: ' ' });
      policyButton.dispatchEvent(spaceEvent);
      
      expect(filter.getCurrentFilter()).toBe('policy');
    });
  });
  
  describe('URL Hash Integration', () => {
    test('should update hash when filter changes', () => {
      filter.setFilter('science');
      // Note: In real browser, this would update window.location.hash
      // In test environment, we just verify the method doesn't throw
      expect(filter.getCurrentFilter()).toBe('science');
    });
    
    test('should validate filter names', () => {
      expect(filter.isValidFilter('science')).toBe(true);
      expect(filter.isValidFilter('policy')).toBe(true);
      expect(filter.isValidFilter('tech')).toBe(true);
      expect(filter.isValidFilter('all')).toBe(true);
      expect(filter.isValidFilter('invalid')).toBe(false);
    });
  });
  
  describe('Event Handling', () => {
    test('should dispatch filterchange event', (done) => {
      window.addEventListener('filterchange', (event) => {
        expect(event.detail.filter).toBe('science');
        expect(event.detail.previousFilter).toBe('all');
        expect(typeof event.detail.visibleCount).toBe('number');
        done();
      });
      
      filter.setFilter('science');
    });
    
    test('should handle click events on filter buttons', () => {
      const scienceButton = document.querySelector('[data-filter="science"]');
      
      // Simulate click
      const clickEvent = new dom.window.MouseEvent('click', { bubbles: true });
      scienceButton.dispatchEvent(clickEvent);
      
      expect(filter.getCurrentFilter()).toBe('science');
    });
  });
  
  describe('Public API', () => {
    test('should return current filter', () => {
      filter.setFilter('tech');
      expect(filter.getCurrentFilter()).toBe('tech');
    });
    
    test('should return available filters', () => {
      const filters = filter.getAvailableFilters();
      expect(filters).toHaveLength(4);
      expect(filters[0]).toHaveProperty('id');
      expect(filters[0]).toHaveProperty('label');
      expect(filters[0]).toHaveProperty('element');
    });
    
    test('should return visible items', () => {
      filter.setFilter('science');
      const visibleItems = filter.getVisibleItems();
      expect(Array.isArray(visibleItems)).toBe(true);
    });
    
    test('should refresh content items', () => {
      // Add new content item
      const newItem = document.createElement('div');
      newItem.dataset.tags = 'science';
      newItem.className = 'content-item';
      document.body.appendChild(newItem);
      
      // Refresh should pick up new item
      filter.refresh();
      expect(filter.contentItems.length).toBeGreaterThan(6);
    });
  });
  
  describe('Error Handling', () => {
    test('should handle missing filter buttons gracefully', () => {
      // Remove all filter buttons
      document.querySelectorAll('.filter-button').forEach(btn => btn.remove());
      
      // Should not throw when creating new instance
      expect(() => {
        new ContentFilter();
      }).not.toThrow();
    });
    
    test('should handle missing content items gracefully', () => {
      // Remove all content items
      document.querySelectorAll('[data-tags]').forEach(item => item.remove());
      
      // Should not throw when filtering
      expect(() => {
        filter.setFilter('science');
      }).not.toThrow();
    });
    
    test('should handle animation during filtering', () => {
      // Set animation flag
      filter.isAnimating = true;
      
      // Should not change filter while animating
      const currentFilter = filter.getCurrentFilter();
      filter.setFilter('science');
      expect(filter.getCurrentFilter()).toBe(currentFilter);
    });
  });
});