# Scripts Directory

This directory contains various utility scripts for building, testing, and maintaining the website.

## Build Scripts

### Core Build Tools
- `generate-theme-css.js` - Generates CSS from theme configuration (app-theme.json)
- `optimize-images.js` - Optimizes images for web delivery
- `optimize-js.js` - Minifies and optimizes JavaScript files

### Validation Scripts
- `build-validation.js` - Validates build process and outputs
- `validate-content.js` - Validates content files for required fields and structure

## Testing Scripts

### Automated Testing
- `test-content-workflow.js` - Tests the complete content management workflow
- `test-js-functionality.js` - Tests JavaScript functionality in browser environment
- `test-theme-toggle.js` - Tests theme switching functionality

### Responsive & Accessibility Testing
- `test-responsive-behavior.js` - Comprehensive responsive behavior testing
- `validate-responsive-implementation.js` - Validates responsive implementation
- `validate-accessibility-touch.js` - Validates accessibility and touch interactions

## Debug & Development Scripts

- `debug-sidebar-state.js` - Debug sidebar state and localStorage preferences

## Deployment Scripts

- `verify-deployment.js` - Verifies deployment readiness and functionality

## Documentation

- `manual-testing-guide.md` - Comprehensive manual testing instructions

## Usage

Most scripts are integrated into npm scripts in package.json:

```bash
# Build with all optimizations
npm run build

# Validate content
npm run validate

# Test content workflow
npm run test:workflow

# Verify deployment readiness
npm run verify:deployment
```

## Container Usage

All scripts are designed to run inside the Docker container:

```bash
# Run any script in container
docker exec -it eleventy-landing-dev node scripts/[script-name].js
```