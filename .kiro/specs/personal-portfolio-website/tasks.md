# Implementation Plan

- [x] 1. Set up project structure and development environment
  - Create Docker configuration for container-first development
  - Initialize Eleventy project with proper directory structure
  - Set up npm scripts for build process orchestration
  - Configure Tailwind CSS integration with Eleventy
  - _Requirements: 8.2, 9.4_

- [x] 2. Implement centralized theme system foundation
  - [x] 2.1 Create app-theme.json configuration file
    - Define color tokens for light/dark themes (primary, secondary, surface, text)
    - Configure typography system (Geologica, Source Sans 3, JetBrains Mono)
    - Set up 8-point grid spacing system
    - Define semantic colors (success, warning, error, info)
    - _Requirements: 7.1, 7.2, 8.2_

  - [x] 2.2 Build CSS design tokens system
    - Generate CSS custom properties from app-theme.json
    - Create Tailwind utility classes for theme colors
    - Implement automatic light/dark mode detection
    - Build typography and spacing utility classes
    - _Requirements: 7.1, 7.3, 9.1_

  - [x] 2.3 Create component variants configuration
    - Define UI component styling definitions in component-variants.json
    - Configure button, card, heading, and text component variants
    - Set up consistent spacing and layout patterns
    - _Requirements: 8.2, 10.3_

- [x] 3. Build core site configuration and data structure
  - [x] 3.1 Create site configuration files
    - Implement site.json with metadata, author info, and social links
    - Configure navigation.json for site structure
    - Set up proper content/configuration separation
    - _Requirements: 5.1, 5.2, 8.1, 8.2_

  - [x] 3.2 Define content collection schemas
    - Create experience entry frontmatter schema with validation
    - Implement unified work item schema for projects and publications
    - Set up tag validation (science, policy, tech only)
    - Configure Eleventy collections for content organization
    - _Requirements: 3.1, 3.2, 4.1, 10.1, 10.2_

- [x] 4. Implement base layout and UI component system
  - [x] 4.1 Create base HTML layout template
    - Build responsive HTML structure with semantic markup
    - Implement theme system integration with CSS custom properties
    - Add meta tags for SEO and accessibility
    - Configure proper heading hierarchy
    - _Requirements: 7.1, 7.2, 9.1_

  - [x] 4.2 Build reusable UI components
    - Create heading component with theme integration
    - Implement text component with typography variants
    - Build button component with proper accessibility
    - Create card component for content containers
    - _Requirements: 7.2, 8.3, 10.3_

- [x] 5. Develop content filtering system
  - [x] 5.1 Create filter interface component
    - Build filter buttons for All, Science, Policy, Tech
    - Implement active state visual indicators
    - Add proper ARIA labels for accessibility
    - Create responsive filter button layout
    - _Requirements: 1.2, 2.2_

  - [x] 5.2 Implement client-side filtering logic
    - Write JavaScript for content visibility management
    - Create smooth transitions between filter states
    - Implement progressive enhancement approach
    - Add fallback behavior for disabled JavaScript
    - _Requirements: 1.1, 2.1, 2.3, 2.4, 9.2_

  - [x] 5.3 Write unit tests for filtering functionality
    - Test filter state management
    - Verify content visibility logic
    - Test accessibility features
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 6. Build content display components
  - [x] 6.1 Create experience card component
    - Display title, organization, date range, and location
    - Implement tag visualization with theme colors
    - Add responsive layout for different screen sizes
    - Include proper semantic markup
    - _Requirements: 3.1, 3.3_

  - [x] 6.2 Implement unified work item card component
    - Handle both project and publication display types
    - Show collaborators/co-authors appropriately
    - Display technologies for projects, journal for publications
    - Implement media display (screenshots, TOC images)
    - Add external link handling with security attributes
    - _Requirements: 3.2, 3.4, 4.1, 4.2_

  - [x] 6.3 Create homepage layout with content sections
    - Build sidebar navigation layout with fixed left panel
    - Implement section-based content organization (About, Experience, Projects, Publications)
    - Create scrollable main content area with proper section separation
    - Integrate filtering system to show/hide sections based on tag content
    - Add responsive design for mobile and tablet layouts
    - _Requirements: 1, 1.1, 2, 3.1, 3.2_

- [x] 7. Implement site pages and navigation
  - [x] 7.1 Create contact page
    - Display professional email and social media links
    - Implement secure external link handling
    - Add responsive contact information layout
    - Ensure all links open in new tabs appropriately
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 7.2 Build resume/CV page
    - Create download link for PDF resume
    - Implement file serving configuration
    - Add last updated information display
    - Ensure proper file format and accessibility
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 7.3 Set up site navigation and routing
    - Configure Eleventy routing for all pages
    - Implement navigation component with theme integration
    - Add proper URL structure for GitHub Pages
    - Ensure SEO-friendly page structure
    - _Requirements: 9.1, 9.4_

- [x] 8. Optimize performance and build process
  - [x] 8.1 Configure asset optimization
    - Set up image compression and optimization
    - Implement CSS minification and optimization
    - Configure JavaScript bundling and minification
    - Add proper caching headers for static assets
    - _Requirements: 9.1, 9.3_

  - [x] 8.2 Implement build validation and error handling
    - Add frontmatter validation for required fields
    - Create tag validation (science, policy, tech only)
    - Implement image path validation
    - Add clear error messages for content authors
    - _Requirements: 8.5, 10.5_

- [x] 9. Add sample content and finalize site
  - [x] 9.1 Create sample experience entries
    - Write example experience markdown files with proper frontmatter
    - Include diverse tags (science, policy, tech) for testing
    - Add realistic content for demonstration
    - _Requirements: 10.1, 10.2_

  - [x] 9.2 Create sample work items (projects and publications)
    - Write example project entries with technologies and collaborators
    - Create sample publication entries with co-authors and journals
    - Include proper media references and external links
    - Test multi-tag filtering scenarios
    - _Requirements: 10.1, 10.2, 3.2, 4.1_

  - [x] 9.3 Configure deployment for GitHub Pages
    - Set up GitHub Actions workflow for automated deployment
    - Configure proper base URL for GitHub Pages
    - Test deployment process and verify functionality
    - _Requirements: 9.4_

- [x] 10. Fix theme system and navigation issues
  - [x] 10.1 Fix theme system functionality
    - Debug and fix light/dark mode detection and application
    - Implement manual theme toggle button with localStorage persistence
    - Ensure proper CSS custom property application across all elements
    - Fix theme switching transitions and prevent flash of incorrect theme
    - _Requirements: 7.1, 7.5, 7.6, 7.7_

  - [x] 10.2 Fix sidebar navigation visibility and contrast
    - Update navigation colors to use proper theme variables with high contrast
    - Ensure navigation items are clearly visible in both light and dark modes
    - Fix color contrast issues that make navigation elements invisible
    - Test navigation visibility across all theme states
    - _Requirements: 1.3, 1.9, 7.8_

  - [x] 10.3 Add personal description to sidebar
    - Update site configuration to include personal description field
    - Modify sidebar layout to display description below "Your Name"
    - Ensure proper typography and spacing for description text
    - Test description display in both light and dark themes
    - _Requirements: 1.2_

  - [x] 10.4 Implement scroll-based navigation highlighting
    - Create scroll detection system using Intersection Observer API
    - Implement active state highlighting for current section in sidebar navigation
    - Add smooth scroll functionality when clicking navigation items
    - Ensure proper offset calculation for fixed headers
    - Test scroll detection accuracy and performance
    - _Requirements: 1.5, 1.6, 10.1, 10.2, 10.3, 10.4_

  - [x] 10.5 Fix and relocate filter buttons
    - Move filter buttons from main content to sidebar (below personal description)
    - Fix filter button visibility with high contrast colors and proper styling
    - Implement distinct visual states for active, inactive, and hover states
    - Ensure filter buttons are clearly visible in both light and dark themes
    - Test filter functionality after relocation
    - _Requirements: 1.2, 2.2_

- [x] 11. Final testing and validation
  - [x] 11.1 Perform comprehensive manual testing
    - Test all filtering functionality with relocated filter buttons
    - Verify theme switching and manual toggle functionality
    - Test scroll-based navigation highlighting and smooth scrolling
    - Check responsive design on multiple screen sizes
    - Validate all external links and file downloads
    - _Requirements: 1.1, 2.1, 7.1, 5.3, 6.2, 10.1, 10.2_

  - [x] 11.2 Validate content management workflow
    - Test adding new experience entries through markdown
    - Verify work item creation and automatic filtering integration
    - Check content update process without breaking functionality
    - Ensure proper error handling for invalid content
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 11.3 Run automated test suite
    - Execute build validation tests
    - Run HTTP response tests
    - Verify content validation functionality
    - _Requirements: 9.1, 9.2_