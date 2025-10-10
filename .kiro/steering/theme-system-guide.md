# Theme System Guide - Complete Implementation Reference

## CRITICAL: How the Theme System Works

This project uses a **centralized theme system** where ALL design values come from `src/_data/app-theme.json`. Understanding this system is essential for maintaining consistency and avoiding hardcoded values.

## Theme Architecture Overview

### 1. Source of Truth: `app-theme.json`
```
src/_data/app-theme.json
├── colors (brand, semantic, neutral)
├── typography (fonts, sizes, weights)
├── spacing (8-point grid system)
├── themes (light/dark behavior)
└── accessibility (WCAG compliance)
```

### 2. CSS Implementation Layer
```
src/assets/css/design-tokens/
├── colors.css (CSS custom properties + utilities)
├── typography.css (font classes + utilities)
├── spacing.css (spacing utilities)
├── themes.css (AUTO-GENERATED - do not edit)
└── index.css (imports all tokens)
```

### 3. Component Integration Layer
```
src/_data/component-variants.json
├── button (variants, sizes, states)
├── card (container, header, body, footer)
├── heading (h1-h6 styling)
├── text (body, lead, small, caption)
└── modal, alert, etc.
```

## Theme Color System - CRITICAL UNDERSTANDING

### Brand Colors (Primary Theme Variables)
These are the ONLY colors you should use in templates:

```css
/* CSS Custom Properties (use in style attributes) */
var(--color-primary)      /* Main brand color - adapts to theme */
var(--color-secondary)    /* Accent color - adapts to theme */
var(--color-surface)      /* Background color - adapts to theme */
var(--color-text)         /* Text color - adapts to theme */
var(--color-textSecondary) /* Secondary text - adapts to theme */
```

```html
<!-- Tailwind Utility Classes (use in class attributes) -->
text-primary              <!-- Main brand text color -->
text-secondary            <!-- Accent text color -->
text-text                 <!-- Primary text color -->
text-textSecondary        <!-- Secondary text color -->
bg-primary                <!-- Main brand background -->
bg-secondary              <!-- Accent background -->
bg-surface                <!-- Surface background -->
border-primary            <!-- Main brand border -->
border-secondary          <!-- Accent border -->
```

### Semantic Colors (State-Based)
```html
<!-- Success, Warning, Error, Info -->
text-success, bg-success, border-success
text-warning, bg-warning, border-warning
text-error, bg-error, border-error
text-info, bg-info, border-info
```

### Neutral Colors (Subtle Elements)
```html
<!-- Only use these specific neutral classes -->
text-neutral-400, text-neutral-500, text-neutral-600, text-neutral-700
bg-neutral-50, bg-neutral-100, bg-neutral-200, bg-neutral-800, bg-neutral-900
border-neutral-200, border-neutral-300, border-neutral-700
```

## FORBIDDEN: Never Use These Classes

### ❌ Hardcoded Color Classes
```html
<!-- NEVER use these - they don't adapt to themes -->
text-gray-900, text-gray-600, text-gray-400
bg-white, bg-black, text-white, text-black
text-blue-600, bg-green-100, border-red-400
text-yellow-500, bg-sky-500, text-purple-600
```

### ❌ Hardcoded Dark Mode Classes
```html
<!-- NEVER manually specify dark mode - theme handles this -->
dark:text-white, dark:bg-gray-800, dark:text-gray-300
```

## CORRECT: Theme-Aware Patterns

### Text Colors
```html
<!-- ✅ CORRECT: Use theme variables -->
<h1 class="text-text">Main Heading</h1>
<p class="text-textSecondary">Secondary text</p>
<a class="text-secondary hover:text-primary">Link</a>

<!-- ❌ WRONG: Hardcoded colors -->
<h1 class="text-gray-900 dark:text-white">Main Heading</h1>
<p class="text-gray-600 dark:text-gray-300">Secondary text</p>
```

### Background Colors
```html
<!-- ✅ CORRECT: Use theme variables -->
<div class="bg-surface">Content container</div>
<button class="bg-primary text-surface">Primary button</button>
<div class="bg-neutral-50 dark:bg-neutral-800">Subtle background</div>

<!-- ❌ WRONG: Hardcoded colors -->
<div class="bg-white dark:bg-gray-800">Content container</div>
<button class="bg-blue-600 text-white">Primary button</button>
```

### Border Colors
```html
<!-- ✅ CORRECT: Use theme variables -->
<div class="border border-secondary border-opacity-20">Card</div>
<input class="border border-neutral-200 dark:border-neutral-700">

<!-- ❌ WRONG: Hardcoded colors -->
<div class="border border-gray-200 dark:border-gray-700">Card</div>
```

## Component Usage Patterns

### Using UI Components
```html
<!-- ✅ CORRECT: Use UI components with theme integration -->
{% include "components/ui/heading.njk", level: "h1", text: "Page Title" %}
{% include "components/ui/text.njk", text: "Body content", variant: "body" %}
{% include "components/ui/button.njk", label: "Click me", variant: "primary" %}

<!-- ❌ WRONG: Hardcoded styling -->
<h1 class="text-4xl font-bold text-gray-900 dark:text-white">Page Title</h1>
<p class="text-gray-600 dark:text-gray-300">Body content</p>
```

### Card Components
```html
<!-- ✅ CORRECT: Use card component -->
{% set cardContent %}
  <p class="text-text">Card content here</p>
{% endset %}
{% include "components/ui/card.njk", title: "Card Title", content: cardContent %}

<!-- ❌ WRONG: Hardcoded card styling -->
<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <div class="p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Card Title</h3>
    <p class="text-gray-600 dark:text-gray-300">Card content here</p>
  </div>
</div>
```

## Theme Switching Behavior

### How Colors Adapt
- **Light Mode**: Primary = Bright Cyan (#00C3FF), Secondary = Deep Teal (#006280)
- **Dark Mode**: Primary = Deep Teal (#006280), Secondary = Bright Cyan (#00C3FF)
- **Surface**: White in light mode, Black in dark mode
- **Text**: Black in light mode, White in dark mode

### System Detection
- Automatically detects user's system preference
- Manual override with theme toggle
- Persists user choice in localStorage
- Smooth transitions between themes

## Typography System

### Font Families (from app-theme.json)
```html
<!-- ✅ CORRECT: Use theme font classes -->
<h1 class="font-headline">Geologica font for headlines</h1>
<p class="font-body">Source Sans 3 for body text</p>
<code class="font-mono">JetBrains Mono for code</code>

<!-- ❌ WRONG: Hardcoded fonts -->
<h1 style="font-family: Geologica">Headlines</h1>
```

### Typography Components
```html
<!-- ✅ CORRECT: Use typography components -->
{% include "components/ui/heading.njk", level: "h1", text: "Hero Title" %}
{% include "components/ui/text.njk", text: "Lead paragraph", variant: "lead" %}

<!-- ❌ WRONG: Hardcoded typography -->
<h1 class="text-5xl font-black">Hero Title</h1>
<p class="text-lg font-semibold">Lead paragraph</p>
```

## Spacing System

### 8-Point Grid (from app-theme.json)
```html
<!-- ✅ CORRECT: Use semantic spacing -->
<div class="p-section">Section padding (3rem)</div>
<div class="mb-page">Page margin bottom (4rem)</div>
<div class="gap-normal">Normal gap (1rem)</div>

<!-- ✅ ALSO CORRECT: Use scale spacing -->
<div class="p-6">3rem padding</div>
<div class="mb-8">4rem margin</div>
<div class="gap-2">1rem gap</div>
```

## Common Mistakes and Fixes

### 1. Blog Post Styling
```html
<!-- ❌ WRONG -->
<h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">{{ title }}</h1>
<p class="text-xl text-gray-600 dark:text-gray-300">{{ description }}</p>

<!-- ✅ CORRECT -->
{% include "components/ui/heading.njk", level: "h1", text: title, class: "mb-4" %}
{% include "components/ui/text.njk", text: description, variant: "lead" %}
```

### 2. Card Styling
```html
<!-- ❌ WRONG -->
<article class="bg-white dark:bg-gray-800 rounded-lg shadow-md">

<!-- ✅ CORRECT -->
<article class="bg-surface rounded-lg shadow-md">
```

### 3. Icon Colors
```html
<!-- ❌ WRONG -->
<svg class="w-5 h-5 text-yellow-500">

<!-- ✅ CORRECT -->
<svg class="w-5 h-5 text-secondary">
```

### 4. Button Styling
```html
<!-- ❌ WRONG -->
<button class="bg-blue-600 text-white hover:bg-blue-700">

<!-- ✅ CORRECT -->
{% include "components/ui/button.njk", label: "Button Text", variant: "primary" %}
```

## Testing Theme Consistency

### Manual Testing Checklist
1. **Theme Toggle**: Switch between light/dark/system modes
2. **Color Consistency**: All elements should use theme colors
3. **No Hardcoded Values**: No gray-*, blue-*, etc. classes
4. **Component Usage**: All UI elements use components when possible
5. **Accessibility**: High contrast mode works properly

### Code Review Checklist
1. **No hardcoded colors**: Search for `text-gray-`, `bg-white`, etc.
2. **No manual dark mode**: Search for `dark:text-`, `dark:bg-`, etc.
3. **Component usage**: UI elements use `components/ui/` includes
4. **Theme variables**: CSS uses `var(--color-*)` or theme classes
5. **Configuration**: Content comes from `_data/` files, not hardcoded

## Quick Reference

### Most Common Theme Classes
```html
<!-- Text -->
text-text, text-textSecondary, text-primary, text-secondary

<!-- Backgrounds -->
bg-surface, bg-primary, bg-secondary

<!-- Borders -->
border-secondary, border-neutral-200, border-neutral-700

<!-- States -->
text-success, text-warning, text-error, text-info
bg-success, bg-warning, bg-error, bg-info
```

### Most Common Components
```html
{% include "components/ui/heading.njk", level: "h1", text: "Title" %}
{% include "components/ui/text.njk", text: "Content", variant: "body" %}
{% include "components/ui/button.njk", label: "Click", variant: "primary" %}
{% include "components/ui/card.njk", title: "Title", content: content %}
```

## Remember

1. **NEVER hardcode colors** - always use theme variables
2. **NEVER manually specify dark mode** - theme handles this automatically  
3. **ALWAYS use components** when available instead of custom styling
4. **ALWAYS test** both light and dark themes
5. **CONFIGURATION over hardcoding** - use `_data/` files for all content

This system ensures consistent theming, accessibility compliance, and easy maintenance across the entire application.