#!/usr/bin/env node

/**
 * Theme CSS Generator
 * 
 * Generates CSS custom properties and utility classes from app-theme.json
 * This ensures the JSON file is the single source of truth for all theming
 */

const fs = require('fs');
const path = require('path');

// Paths
const THEME_JSON_PATH = path.join(__dirname, '../src/_data/app-theme.json');
const OUTPUT_CSS_PATH = path.join(__dirname, '../src/assets/css/design-tokens/colors.css');

/**
 * Load and parse the theme JSON file
 */
function loadThemeData() {
  try {
    const themeData = JSON.parse(fs.readFileSync(THEME_JSON_PATH, 'utf8'));
    console.log('✅ Loaded theme data from app-theme.json');
    return themeData;
  } catch (error) {
    console.error('❌ Failed to load theme data:', error.message);
    process.exit(1);
  }
}

/**
 * Generate CSS custom properties for themes
 */
function generateThemeVariables(themeData) {
  const { themes, colors } = themeData;
  
  let css = `/* Color Design Tokens */
/* AUTO-GENERATED from app-theme.json - DO NOT EDIT MANUALLY */
/* Run 'npm run generate:theme' to regenerate this file */

:root {
  /* Light theme colors (default) */
`;

  // Generate default (light) theme variables
  const lightTheme = themes.light;
  for (const [key, value] of Object.entries(lightTheme)) {
    css += `  --color-${key}: ${value};\n`;
  }

  // Add neutral colors (consistent across themes)
  css += `\n  /* Neutral colors - consistent across themes */\n`;
  for (const [shade, value] of Object.entries(colors.neutral)) {
    css += `  --color-neutral-${shade}: ${value};\n`;
  }

  css += `}\n\n`;

  // Generate light theme explicit declaration
  css += `/* Light theme (explicit) */\n[data-theme="light"] {\n`;
  for (const [key, value] of Object.entries(lightTheme)) {
    css += `  --color-${key}: ${value};\n`;
  }
  
  // Add navigation-specific colors for light theme
  css += `\n  /* Navigation-specific colors for sidebar visibility */\n`;
  css += `  --color-nav-text: #2D3748;\n`;
  css += `  --color-nav-hover: ${lightTheme.secondary};\n`;
  css += `  --color-nav-active: ${lightTheme.primary};\n`;
  css += `  --color-nav-background: rgba(255, 255, 255, 0.95);\n`;
  
  // Add filter button colors for light theme
  css += `\n  /* Filter button colors - using theme system */\n`;
  css += `  --color-filter-inactive: var(--color-neutral-100);\n`;
  css += `  --color-filter-inactive-text: var(--color-textSecondary);\n`;
  css += `  --color-filter-active: var(--color-primary);\n`;
  css += `  --color-filter-active-text: var(--color-surface);\n`;
  css += `  --color-filter-hover: var(--color-neutral-100);\n`;
  css += `  --color-filter-hover-text: var(--color-primary);\n`;
  
  css += `}\n\n`;

  // Generate dark theme
  css += `/* Dark theme */\n[data-theme="dark"] {\n`;
  const darkTheme = themes.dark;
  for (const [key, value] of Object.entries(darkTheme)) {
    css += `  --color-${key}: ${value};\n`;
  }
  
  // Add navigation-specific colors for dark theme
  css += `\n  /* Navigation-specific colors for sidebar visibility */\n`;
  css += `  --color-nav-text: #E2E8F0;\n`;
  css += `  --color-nav-hover: ${darkTheme.secondary};\n`;
  css += `  --color-nav-active: ${darkTheme.primary};\n`;
  css += `  --color-nav-background: rgba(0, 0, 0, 0.95);\n`;
  
  // Add filter button colors for dark theme
  css += `\n  /* Filter button colors - using theme system */\n`;
  css += `  --color-filter-inactive: var(--color-neutral-100);\n`;
  css += `  --color-filter-inactive-text: var(--color-textSecondary);\n`;
  css += `  --color-filter-active: var(--color-primary);\n`;
  css += `  --color-filter-active-text: var(--color-surface);\n`;
  css += `  --color-filter-hover: var(--color-neutral-100);\n`;
  css += `  --color-filter-hover-text: var(--color-primary);\n`;
  
  // Override neutral colors for dark theme
  css += `\n  /* Override neutral colors for dark theme */\n`;
  css += `  --color-neutral-50: #1f2937;\n`;
  css += `  --color-neutral-100: #374151;\n`;
  css += `  --color-neutral-200: #4b5563;\n`;
  css += `  --color-neutral-700: #d1d5db;\n`;
  css += `  --color-neutral-800: #1f2937;\n`;
  css += `}\n\n`;

  // Generate system preference fallback
  css += `/* System preference fallback */\n@media (prefers-color-scheme: dark) {\n  :root:not([data-theme]) {\n`;
  for (const [key, value] of Object.entries(darkTheme)) {
    css += `    --color-${key}: ${value};\n`;
  }
  
  // Add navigation-specific colors for system dark theme
  css += `\n    /* Navigation-specific colors for sidebar visibility */\n`;
  css += `    --color-nav-text: #E2E8F0;\n`;
  css += `    --color-nav-hover: ${darkTheme.secondary};\n`;
  css += `    --color-nav-active: ${darkTheme.primary};\n`;
  css += `    --color-nav-background: rgba(0, 0, 0, 0.95);\n`;
  
  // Add filter button colors for system dark theme
  css += `\n    /* Filter button colors - using theme system */\n`;
  css += `    --color-filter-inactive: var(--color-neutral-100);\n`;
  css += `    --color-filter-inactive-text: var(--color-textSecondary);\n`;
  css += `    --color-filter-active: var(--color-primary);\n`;
  css += `    --color-filter-active-text: var(--color-surface);\n`;
  css += `    --color-filter-hover: var(--color-neutral-100);\n`;
  css += `    --color-filter-hover-text: var(--color-primary);\n`;
  
  css += `\n    /* Override neutral colors for dark theme */\n`;
  css += `    --color-neutral-50: #1f2937;\n`;
  css += `    --color-neutral-100: #374151;\n`;
  css += `    --color-neutral-200: #4b5563;\n`;
  css += `    --color-neutral-700: #d1d5db;\n`;
  css += `    --color-neutral-800: #1f2937;\n`;
  css += `  }\n}\n\n`;

  return css;
}

/**
 * Generate Tailwind utility classes
 */
function generateUtilityClasses(themeData) {
  const { themes } = themeData;
  const themeKeys = Object.keys(themes.light);
  
  let css = `/* Tailwind utility classes for theme colors */\n`;
  
  // Text color utilities
  css += `/* Text colors */\n`;
  themeKeys.forEach(key => {
    css += `.text-${key} { color: var(--color-${key}); }\n`;
  });
  
  // Background color utilities
  css += `\n/* Background colors */\n`;
  themeKeys.forEach(key => {
    css += `.bg-${key} { background-color: var(--color-${key}); }\n`;
  });
  
  // Border color utilities
  css += `\n/* Border colors */\n`;
  themeKeys.forEach(key => {
    css += `.border-${key} { border-color: var(--color-${key}); }\n`;
  });
  
  // Navigation-specific utility classes
  css += `\n/* Navigation-specific utility classes */\n`;
  css += `.text-nav-text { color: var(--color-nav-text); }\n`;
  css += `.text-nav-hover { color: var(--color-nav-hover); }\n`;
  css += `.text-nav-active { color: var(--color-nav-active); }\n`;
  css += `.bg-nav-background { background-color: var(--color-nav-background); }\n`;
  
  // Filter button utility classes
  css += `\n/* Filter button utility classes */\n`;
  css += `.bg-filter-inactive { background-color: var(--color-filter-inactive); }\n`;
  css += `.text-filter-inactive-text { color: var(--color-filter-inactive-text); }\n`;
  css += `.bg-filter-active { background-color: var(--color-filter-active); }\n`;
  css += `.text-filter-active-text { color: var(--color-filter-active-text); }\n`;
  css += `.bg-filter-hover { background-color: var(--color-filter-hover); }\n`;
  css += `.text-filter-hover-text { color: var(--color-filter-hover-text); }\n`;
  
  // Neutral color utilities
  css += `\n/* Neutral color utilities */\n`;
  const neutralShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
  
  neutralShades.forEach(shade => {
    css += `.text-neutral-${shade} { color: var(--color-neutral-${shade}); }\n`;
  });
  
  css += `\n`;
  neutralShades.forEach(shade => {
    css += `.bg-neutral-${shade} { background-color: var(--color-neutral-${shade}); }\n`;
  });
  
  css += `\n`;
  neutralShades.forEach(shade => {
    css += `.border-neutral-${shade} { border-color: var(--color-neutral-${shade}); }\n`;
  });
  
  return css;
}

/**
 * Generate theme transitions and accessibility features
 */
function generateThemeFeatures() {
  return `
/* Theme System Features */

/* Theme transition for smooth switching */
:root {
  --theme-transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
}

* {
  transition: var(--theme-transition);
}

/* Disable transitions during theme initialization to prevent flash */
.theme-loading * {
  transition: none !important;
}

/* Focus ring styles for accessibility */
:focus-visible {
  outline: 2px solid var(--color-secondary);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --color-primary: #0066CC;
    --color-secondary: #004499;
  }
  
  [data-theme="dark"] {
    --color-primary: #66B3FF;
    --color-secondary: #99CCFF;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}

/* Print styles */
@media print {
  :root {
    --color-primary: #000000;
    --color-secondary: #666666;
    --color-surface: #ffffff;
    --color-text: #000000;
    --color-textSecondary: #666666;
  }
  
  * {
    transition: none !important;
    box-shadow: none !important;
  }
}

/* Theme-aware selection colors */
::selection {
  background-color: var(--color-secondary);
  color: var(--color-surface);
}

::-moz-selection {
  background-color: var(--color-secondary);
  color: var(--color-surface);
}

/* Scrollbar theming for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-neutral-100);
}

[data-theme="dark"] ::-webkit-scrollbar-track {
  background: var(--color-neutral-800);
}

::-webkit-scrollbar-thumb {
  background: var(--color-neutral-400);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-neutral-500);
}

[data-theme="dark"] ::-webkit-scrollbar-thumb {
  background: var(--color-neutral-600);
}

[data-theme="dark"] ::-webkit-scrollbar-thumb:hover {
  background: var(--color-neutral-500);
}
`;
}

/**
 * Main function to generate the complete CSS file
 */
function generateThemeCSS() {
  console.log('🎨 Generating theme CSS from app-theme.json...');
  
  const themeData = loadThemeData();
  
  // Generate all CSS sections
  const themeVariables = generateThemeVariables(themeData);
  const utilityClasses = generateUtilityClasses(themeData);
  const themeFeatures = generateThemeFeatures();
  
  // Combine all sections
  const completeCSS = themeVariables + utilityClasses + themeFeatures;
  
  // Write to output file
  try {
    // Ensure directory exists
    const outputDir = path.dirname(OUTPUT_CSS_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(OUTPUT_CSS_PATH, completeCSS, 'utf8');
    console.log('✅ Generated theme CSS at:', OUTPUT_CSS_PATH);
    console.log('📊 Generated CSS size:', (completeCSS.length / 1024).toFixed(2), 'KB');
    
    // Validate the generated CSS
    validateGeneratedCSS(completeCSS, themeData);
    
  } catch (error) {
    console.error('❌ Failed to write CSS file:', error.message);
    process.exit(1);
  }
}

/**
 * Validate the generated CSS contains expected content
 */
function validateGeneratedCSS(css, themeData) {
  const { themes } = themeData;
  const lightThemeKeys = Object.keys(themes.light);
  const darkThemeKeys = Object.keys(themes.dark);
  
  console.log('🔍 Validating generated CSS...');
  
  // Check that all theme variables are present
  lightThemeKeys.forEach(key => {
    if (!css.includes(`--color-${key}:`)) {
      console.warn(`⚠️  Missing CSS variable: --color-${key}`);
    }
  });
  
  // Check that utility classes are present
  lightThemeKeys.forEach(key => {
    if (!css.includes(`.text-${key}`)) {
      console.warn(`⚠️  Missing utility class: .text-${key}`);
    }
    if (!css.includes(`.bg-${key}`)) {
      console.warn(`⚠️  Missing utility class: .bg-${key}`);
    }
  });
  
  // Check theme sections
  if (!css.includes('[data-theme="light"]')) {
    console.warn('⚠️  Missing light theme section');
  }
  if (!css.includes('[data-theme="dark"]')) {
    console.warn('⚠️  Missing dark theme section');
  }
  if (!css.includes('@media (prefers-color-scheme: dark)')) {
    console.warn('⚠️  Missing system preference fallback');
  }
  
  console.log('✅ CSS validation complete');
}

// Run the generator
if (require.main === module) {
  generateThemeCSS();
}

module.exports = { generateThemeCSS };