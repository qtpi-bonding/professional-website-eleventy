/**
 * Navigation System - Scroll-based highlighting and smooth scrolling
 * Handles active state highlighting and smooth scroll functionality
 */

class NavigationSystem {
  constructor() {
    this.activeSection = null;
    this.sections = [];
    this.navItems = [];
    this.mainContent = null;
    this.observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Trigger when section is 20% visible
      threshold: 0
    };
    
    this.init();
  }
  
  init() {
    // Find main content container
    this.mainContent = document.querySelector('.main-content');
    if (!this.mainContent) {
      console.warn('NavigationSystem: Main content container not found');
      return;
    }
    
    // Find all sections and navigation links
    this.sections = Array.from(document.querySelectorAll('.content-section[id]'));
    this.navItems = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
    
    if (this.sections.length === 0 || this.navItems.length === 0) {
      console.warn('NavigationSystem: No sections or navigation links found');
      return;
    }
    
    // Set up intersection observer for scroll detection
    this.setupScrollDetection();
    
    // Set up smooth scroll functionality
    this.setupSmoothScroll();
    
    // Handle initial page load with hash
    this.handleInitialHash();
  }
  
  setupScrollDetection() {
    // Update observer options to use main content as root
    const observerOptions = {
      ...this.observerOptions,
      root: this.mainContent
    };
    
    this.sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.highlightNavItem(entry.target.id);
        }
      });
    }, observerOptions);
    
    // Observe all sections
    this.sections.forEach(section => {
      this.sectionObserver.observe(section);
    });
  }
  
  setupSmoothScroll() {
    this.navItems.forEach(navItem => {
      navItem.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = navItem.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
      });
    });
  }
  
  highlightNavItem(sectionId) {
    if (this.activeSection === sectionId) return;
    
    this.activeSection = sectionId;
    
    // Remove active class from all nav links
    this.navItems.forEach(link => {
      link.classList.remove('bg-nav-active', 'text-surface', 'font-semibold');
      link.classList.add('text-nav-text');
    });
    
    // Add active class to current nav link
    const activeNavLink = this.navItems.find(link => 
      link.getAttribute('href') === `#${sectionId}`
    );
    
    if (activeNavLink) {
      activeNavLink.classList.add('bg-nav-active', 'text-surface', 'font-semibold');
      activeNavLink.classList.remove('text-nav-text');
    }
    
    // Dispatch navigation change event
    window.dispatchEvent(new CustomEvent('navigationchange', {
      detail: { activeSection: sectionId }
    }));
  }
  
  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section || !this.mainContent) return;
    
    // Get device type for mobile-specific behavior
    const deviceType = this.getDeviceType();
    
    // Calculate mobile-specific header offset
    let headerOffset = 20; // Default offset
    
    if (deviceType === 'mobile') {
      // Account for mobile hamburger button and additional spacing
      headerOffset = 100; // Larger offset for mobile to account for hamburger button
    } else if (deviceType === 'tablet') {
      headerOffset = 40; // Medium offset for tablet
    }
    
    const sectionTop = section.offsetTop - this.mainContent.offsetTop;
    const scrollPosition = Math.max(0, sectionTop - headerOffset);
    
    // Enhanced smooth scroll with mobile optimization
    const scrollOptions = {
      top: scrollPosition,
      behavior: 'smooth'
    };
    
    // Add mobile-specific scroll behavior
    if (deviceType === 'mobile') {
      // Ensure smooth scrolling works correctly on mobile
      this.mainContent.style.scrollBehavior = 'smooth';
      
      // Use requestAnimationFrame for better mobile performance
      this.smoothScrollToPosition(scrollPosition);
    } else {
      this.mainContent.scrollTo(scrollOptions);
    }
    
    // Update URL hash without triggering scroll
    if (history.replaceState) {
      history.replaceState(null, null, `#${sectionId}`);
    }
    
    // Manually trigger highlighting with device-specific timing
    const highlightDelay = deviceType === 'mobile' ? 200 : 100;
    setTimeout(() => {
      this.highlightNavItem(sectionId);
    }, highlightDelay);
    
    // Dispatch mobile navigation event
    if (deviceType === 'mobile') {
      window.dispatchEvent(new CustomEvent('mobilenavigation', {
        detail: { 
          targetSection: sectionId,
          scrollPosition: scrollPosition,
          headerOffset: headerOffset
        }
      }));
    }
  }
  
  // Enhanced smooth scroll for mobile devices
  smoothScrollToPosition(targetPosition) {
    const startPosition = this.mainContent.scrollTop;
    const distance = targetPosition - startPosition;
    const duration = 600; // Slightly longer duration for mobile
    let startTime = null;
    
    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };
    
    const animateScroll = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      const easedProgress = easeInOutCubic(progress);
      const currentPosition = startPosition + (distance * easedProgress);
      
      this.mainContent.scrollTop = currentPosition;
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  }
  
  // Device type detection for navigation system
  getDeviceType() {
    const width = window.innerWidth;
    
    if (width >= 1024) return 'desktop';
    if (width >= 768) return 'tablet';
    return 'mobile';
  }
  
  handleInitialHash() {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const sectionId = hash.substring(1);
      const section = document.getElementById(sectionId);
      
      if (section) {
        // Delay initial scroll to ensure page is fully loaded
        setTimeout(() => {
          this.scrollToSection(sectionId);
        }, 100);
      }
    }
  }
  
  // Public methods for external control
  getCurrentSection() {
    return this.activeSection;
  }
  
  goToSection(sectionId) {
    this.scrollToSection(sectionId);
  }
  
  refresh() {
    // Re-initialize if DOM has changed
    this.sections = Array.from(document.querySelectorAll('.content-section[id]'));
    this.navItems = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
    
    // Re-observe sections
    if (this.sectionObserver) {
      this.sectionObserver.disconnect();
      this.setupScrollDetection();
    }
  }
  
  destroy() {
    if (this.sectionObserver) {
      this.sectionObserver.disconnect();
    }
    
    // Remove event listeners
    this.navItems.forEach(navItem => {
      navItem.removeEventListener('click', this.scrollToSection);
    });
  }
}

// Initialize navigation system when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.navigationSystem = new NavigationSystem();
  });
} else {
  window.navigationSystem = new NavigationSystem();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NavigationSystem;
}