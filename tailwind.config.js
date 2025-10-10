/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,md,njk,js}",
    "./src/_includes/**/*.{html,md,njk,js}",
    "./src/pages/**/*.{html,md,njk,js}",
    "./src/content/**/*.{html,md,njk,js}"
  ],
  theme: {
    extend: {
      colors: {
        // Theme colors - will be populated by design tokens
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        textSecondary: 'var(--color-textSecondary)',
        
        // Navigation-specific colors
        'nav-text': 'var(--color-nav-text)',
        'nav-hover': 'var(--color-nav-hover)',
        'nav-active': 'var(--color-nav-active)',
        'nav-background': 'var(--color-nav-background)',
        
        // Filter button colors
        'filter-inactive': 'var(--color-filter-inactive)',
        'filter-inactive-text': 'var(--color-filter-inactive-text)',
        'filter-active': 'var(--color-filter-active)',
        'filter-active-text': 'var(--color-filter-active-text)',
        'filter-hover': 'var(--color-filter-hover)',
        'filter-hover-text': 'var(--color-filter-hover-text)',
        
        // Semantic colors
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
        
        // Neutral colors for subtle elements
        neutral: {
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        }
      },
      fontFamily: {
        headline: 'var(--font-headline)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      spacing: {
        'section': 'var(--spacing-section)',
        'page': 'var(--spacing-page)',
        'normal': 'var(--spacing-normal)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}