---
inclusion: always
---

# Complete Theme System Guide

## CRITICAL: How the Theme System Works

This project uses a **centralized, automated theme system** where ALL design values come from `src/_data/app-theme.json`. This is the ONLY place where colors, typography, and spacing should be defined.

## Architecture Overview

```
src/_data/app-theme.json (SOURCE OF TRUTH)
        ↓
scripts/generate-theme-css.js (GENERATOR)
        ↓
src/assets/css/design-tokens/colors.css (AUTO-GENERATED)
        ↓
src/assets/css/main.css (IMPORTS)
        ↓
Tailwind CSS (PROCESSES)
        ↓
_site/assets/css/main.css (FINAL OUTPUT)
```

## Key Files and Their Roles

### 1. `src/_data/app-theme.json` - The Single Source of Truth
- Contains ALL theme definitions (colors, typography, spacing)
- Defines light and dark theme variants
- Must be valid JSON
- **NEVER edit CSS files directly - always edit this file**

### 2. `scripts/generate-theme-css.js` - The Theme Generator
- Reads `app-theme.json`
- Generates CSS custom properties for all themes
- Creates Tailwind utility classes
- Outputs to `src/assets/css/design-tokens/colors.css`
- **Runs automatically during build process**

### 3. `src/assets/css/design-tokens/colors.css` - Auto-Generated CSS
- **DO NOT EDIT MANUALLY** - This file is auto-generated
- Contains CSS custom properties for all theme colors
- Includes light theme, dark theme, and system preference fallbacks
- Provides Tailwind utility classes (.bg-surface, .text-text, etc.)

### 4. `src/assets/css/main.css` - Main CSS Entry Point
- Imports design tokens BEFORE Tailwind directives
- Contains base styles using theme variables
- **Import order is critical**: design tokens must come before @tailwind

### 5. `src/assets/js/theme-system.js` - Theme Switching Logic
- Handles light/dark/system theme detection
- Manages theme switching via toggle buttons
- Sets `data-theme` attribute on `<html>` element
- Persists user preference in localStorage

## How Colors Work

### Theme Color Mapping
```json
// Light Mode
{
  "primary": "#00C3FF",     // Bright Cyan
  "secondary": "#006280",   // Deep Teal
  "surface": "#ffffff",     // White
  "text": "#000000"         // Black
}

// Dark Mode  
{
  "primary": "#006280",     // Deep Teal (swapped)
  "secondary": "#00C3FF",   // Bright Cyan (swapped)
  "surface": "#000000",     // Black
  "text": "#ffffff"         // White
}
```

### CSS Variable Generation
The generator creates these CSS custom properties:
```css
:root {
  --color-primary: #00C3FF;
  --color-secondary: #006280;
  --color-surface: #ffffff;
  --color-text: #000000;
}

[data-theme="dark"] {
  --color-primary: #006280;
  --color-secondary: #00C3FF;
  --color-surface: #000000;
  --color-text: #ffffff;
}
```

### Tailwind Utility Classes
The generator also creates utility classes:
```css
.bg-surface { background-color: var(--color-surface); }
.text-text { color: var(--color-text); }
.text-primary { color: var(--color-primary); }
.border-secondary { border-color: var(--color-secondary); }
```

## How to Use the Theme System

### ✅ CORRECT Usage Patterns

**In Templates (Nunjucks):**
```html
<!-- Use theme utility classes -->
<div class="bg-surface text-text">Content</div>
<button class="bg-primary text-surface">Primary Button</button>
<h1 class="text-text font-headline">Heading</h1>

<!-- Use semantic colors -->
<div class="text-success">Success message</div>
<div class="bg-warning text-surface">Warning</div>
```

**In CSS (when needed):**
```css
.custom-component {
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-secondary);
}
```

### ❌ FORBIDDEN Patterns

**Never use hardcoded colors:**
```html
<!-- DON'T DO THIS -->
<div class="bg-white text-black">Content</div>
<div class="bg-gray-100 text-gray-900">Content</div>
<div class="dark:bg-gray-800 dark:text-white">Content</div>
```

**Never manually specify dark mode:**
```html
<!-- DON'T DO THIS -->
<div class="bg-white dark:bg-black">Content</div>
```

**Never edit generated CSS files:**
```css
/* DON'T EDIT colors.css - it's auto-generated */
```

## Build Process Integration

### Automatic Generation
The theme CSS is generated automatically during build:
```json
// package.json
{
  "scripts": {
    "build": "... && npm run generate:theme && npm run build:css && ...",
    "generate:theme": "node scripts/generate-theme-css.js"
  }
}
```

### Build Order (CRITICAL)
1. `npm run generate:theme` - Generate CSS from JSON
2. `npm run build:css` - Process CSS with Tailwind
3. `npm run build:html` - Build HTML with processed CSS

## How to Change Colors

### Step 1: Edit the Source
Only edit `src/_data/app-theme.json`:
```json
{
  "themes": {
    "light": {
      "primary": "#FF6B35",     // Change to orange
      "secondary": "#004225",   // Change to dark green
      "surface": "#ffffff",
      "text": "#000000"
    },
    "dark": {
      "primary": "#004225",     // Swapped
      "secondary": "#FF6B35",   // Swapped  
      "surface": "#000000",
      "text": "#ffffff"
    }
  }
}
```

### Step 2: Rebuild
```bash
docker exec -it eleventy-landing-dev npm run build
```

### Step 3: Verify
- Check that colors changed on the website
- Verify both light and dark modes work
- Test theme toggle functionality

## Theme Toggle Implementation

### HTML Structure
```html
<!-- Theme toggle button -->
<button id="sidebar-theme-toggle" 
        data-theme-toggle
        class="p-2 rounded-md bg-neutral-100 hover:bg-neutral-200"
        aria-label="Toggle theme">
  <svg class="w-5 h-5 text-text"><!-- icon --></svg>
</button>
```

### JavaScript Integration
```javascript
// Theme system initializes automatically
// Toggle is wired up in base.njk:
document.getElementById('sidebar-theme-toggle').addEventListener('click', function() {
  window.themeSystem.toggleTheme();
});
```

### Theme Detection
The system detects themes in this order:
1. User's manual selection (stored in localStorage)
2. System preference (`prefers-color-scheme: dark`)
3. Default to light mode

## Troubleshooting

### Colors Not Changing
1. Check if `app-theme.json` is valid JSON
2. Verify build process ran successfully
3. Check browser dev tools for CSS custom properties
4. Ensure `data-theme` attribute is set on `<html>`

### Theme Toggle Not Working
1. Check if `theme-system.js` is loaded
2. Verify toggle button has correct ID
3. Check browser console for JavaScript errors
4. Ensure `data-theme` attribute changes when clicked

### CSS Not Generated
1. Check if `scripts/generate-theme-css.js` exists
2. Verify it's included in build process
3. Check file permissions
4. Look for errors in build output

## File Structure Summary

```
src/
├── _data/
│   └── app-theme.json              # SOURCE OF TRUTH
├── assets/
│   ├── css/
│   │   ├── main.css               # Imports design tokens
│   │   └── design-tokens/
│   │       └── colors.css         # AUTO-GENERATED
│   └── js/
│       └── theme-system.js        # Theme switching logic
└── _includes/layouts/
    └── base.njk                   # Theme toggle integration

scripts/
└── generate-theme-css.js          # Theme generator

package.json                       # Build process integration
```

## Key Principles

1. **Single Source of Truth**: Only `app-theme.json` defines colors
2. **Automated Generation**: Never edit generated CSS files
3. **Theme Variables**: Always use CSS custom properties or utility classes
4. **No Hardcoded Colors**: Never use specific color values in templates
5. **Build Integration**: Theme generation is part of the build process
6. **Semantic Naming**: Use meaningful color names (primary, surface, text)

## Testing Theme Changes

After making changes, always test:
1. Light mode appearance
2. Dark mode appearance  
3. Theme toggle functionality
4. System preference detection
5. Color contrast and accessibility
6. All components and pages

Remember: The theme system is designed to be a "Flutter-like experience" where changing colors in one place updates the entire application automatically.