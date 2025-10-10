# Theme System Guide - Quick Reference

> **📖 For complete documentation, see [theme-system-complete-guide.md](.kiro/steering/theme-system-complete-guide.md)**

## CRITICAL: Single Source of Truth

**ALL design values come from `src/_data/app-theme.json`** - this is the ONLY place to define colors, typography, and spacing.

## Quick Usage Guide

### ✅ CORRECT - Use Theme Classes
```html
<div class="bg-surface text-text">Content</div>
<button class="bg-primary text-surface">Primary Button</button>
<h1 class="text-text font-headline">Heading</h1>
<p class="text-textSecondary">Secondary text</p>
```

### ❌ FORBIDDEN - Hardcoded Colors
```html
<!-- NEVER use these -->
<div class="bg-white text-black">Content</div>
<div class="bg-gray-100 text-gray-900">Content</div>
<div class="dark:bg-gray-800 dark:text-white">Content</div>
```

## How to Change Colors

1. **Edit ONLY**: `src/_data/app-theme.json`
2. **Rebuild**: `npm run build`
3. **Test**: Both light and dark modes

## Available Theme Classes

- **Text**: `text-text`, `text-textSecondary`, `text-primary`, `text-secondary`
- **Backgrounds**: `bg-surface`, `bg-primary`, `bg-secondary`
- **States**: `text-success`, `text-warning`, `text-error`, `text-info`
- **Neutrals**: `bg-neutral-100`, `text-neutral-700`, etc.

## Key Files

- `src/_data/app-theme.json` - **Edit this to change colors**
- `scripts/generate-theme-css.js` - Generates CSS from JSON
- `src/assets/css/design-tokens/colors.css` - **Auto-generated, don't edit**

## Remember

1. **NEVER hardcode colors** - always use theme variables
2. **NEVER manually specify dark mode** - theme handles this automatically
3. **ALWAYS test** both light and dark themes after changes

The theme system provides a "Flutter-like experience" where changing colors in one place updates the entire application automatically.