# Manual Sidebar Testing Guide

This guide provides step-by-step instructions for manually testing the sidebar behavior to validate all requirements are met.

## Prerequisites

1. Ensure the development server is running: `docker-compose up eleventy-dev`
2. Open http://localhost:8080 in your browser
3. Open browser DevTools (F12) for debugging

## Test 1: Mobile Behavior (≤1024px)

### 1.1 Initial State
1. Resize browser window to 768px width (or use DevTools device emulation)
2. **Expected**: Sidebar should be hidden, only hamburger button visible in top-left
3. **Verify**: No sidebar content visible, hamburger button has 3 lines

### 1.2 Show Sidebar
1. Click/tap the hamburger button
2. **Expected**: 
   - Sidebar slides in from left
   - Semi-transparent overlay appears over main content
   - Collapse button (<<) visible inside sidebar
3. **Verify**: Sidebar width is 320px max, overlay is clickable

### 1.3 Hide Sidebar (Overlay)
1. With sidebar open, click the overlay (dark area outside sidebar)
2. **Expected**: Sidebar slides out, overlay disappears, hamburger button returns
3. **Verify**: Smooth 300ms animation

### 1.4 Hide Sidebar (Collapse Button)
1. Open sidebar again, click the collapse button (<<) inside sidebar
2. **Expected**: Same behavior as overlay click
3. **Verify**: Button is accessible and responsive

### 1.5 Keyboard Navigation
1. Open sidebar, press Escape key
2. **Expected**: Sidebar closes, focus returns to hamburger button
3. **Verify**: Tab navigation works within open sidebar

## Test 2: Desktop Behavior (>1024px)

### 2.1 Initial State
1. Resize browser window to 1200px width
2. **Expected**: Sidebar visible by default, collapse button visible inside
3. **Verify**: Main content has left margin to accommodate sidebar

### 2.2 Hide Sidebar
1. Click the collapse button inside sidebar
2. **Expected**:
   - Sidebar slides out to left
   - Floating hamburger button appears in top-left
   - Main content expands to full width
3. **Verify**: Smooth animation, floating button is styled differently

### 2.3 Show Sidebar
1. Click the floating hamburger button
2. **Expected**:
   - Sidebar slides in from left
   - Floating button disappears
   - Main content margin adjusts
3. **Verify**: Collapse button is visible inside sidebar again

### 2.4 No Overlay on Desktop
1. With sidebar open or closed
2. **Expected**: No overlay should ever appear on desktop
3. **Verify**: Only sidebar and floating toggle are visible

## Test 3: Window Resize Behavior

### 3.1 Desktop to Mobile
1. Start with desktop view (1200px) with sidebar in any state
2. Resize window to mobile (768px)
3. **Expected**: 
   - Sidebar resets to hidden (mobile default)
   - Hamburger button appears
   - No floating toggle
4. **Verify**: State resets regardless of previous desktop state

### 3.2 Mobile to Desktop
1. Start with mobile view (768px) with sidebar in any state
2. Resize window to desktop (1200px)
3. **Expected**:
   - Sidebar resets to visible (desktop default)
   - Collapse button appears inside sidebar
   - Main content margin adjusts
4. **Verify**: State resets regardless of previous mobile state

### 3.3 Breakpoint Testing
1. Slowly resize window around 1024px breakpoint
2. **Expected**: 
   - At 1024px and below: mobile behavior
   - At 1025px and above: desktop behavior
3. **Verify**: Consistent behavior at exact breakpoint

## Test 4: No Preference Persistence

### 4.1 Page Refresh Test
1. Change sidebar state (open/close) on both mobile and desktop
2. Refresh the page (F5)
3. **Expected**: Sidebar returns to default state for current device
4. **Verify**: No stored preferences affect initial state

### 4.2 Storage Inspection
1. Open DevTools > Application > Storage
2. Check localStorage and sessionStorage
3. **Expected**: No sidebar-related keys stored
4. **Verify**: No 'sidebar', 'menu', or similar keys present

### 4.3 Navigation Test
1. Change sidebar state
2. Navigate to different page (if available) or use browser back/forward
3. **Expected**: Sidebar resets to default state
4. **Verify**: No state persistence across navigation

## Test 5: Toggle Button Functionality

### 5.1 Button Responsiveness
1. Test all toggle buttons (hamburger, collapse, floating)
2. **Expected**: Immediate visual feedback on click/tap
3. **Verify**: Buttons don't stick or require multiple clicks

### 5.2 Rapid Click Prevention
1. Rapidly click toggle buttons during animation
2. **Expected**: Additional clicks ignored during 300ms animation
3. **Verify**: No broken states or animation conflicts

### 5.3 ARIA Attributes
1. Inspect toggle buttons in DevTools
2. **Expected**: 
   - `aria-expanded` reflects current state
   - `aria-label` describes current action
   - `aria-hidden` set correctly on sidebar/overlay
3. **Verify**: Attributes update when state changes

### 5.4 Keyboard Support
1. Tab to toggle buttons, press Enter or Space
2. **Expected**: Same behavior as mouse clicks
3. **Verify**: Focus indicators visible, keyboard navigation smooth

## Test 6: Accessibility Features

### 6.1 Screen Reader Support
1. Use screen reader or inspect ARIA attributes
2. **Expected**:
   - Sidebar has `role="navigation"`
   - Toggle buttons have descriptive labels
   - State changes are announced
3. **Verify**: All interactive elements are properly labeled

### 6.2 Focus Management
1. Open sidebar, tab through elements, close sidebar
2. **Expected**: Focus returns to appropriate toggle button
3. **Verify**: No focus traps or lost focus

### 6.3 High Contrast Mode
1. Enable high contrast mode in OS/browser
2. **Expected**: All elements remain visible and usable
3. **Verify**: Sufficient contrast for all states

## Test 7: Animation and Performance

### 7.1 Smooth Animations
1. Test all sidebar transitions
2. **Expected**: 300ms duration, smooth easing
3. **Verify**: No jank or stuttering

### 7.2 Reduced Motion
1. Enable "Reduce motion" in OS accessibility settings
2. **Expected**: Animations disabled or significantly reduced
3. **Verify**: Functionality preserved without animations

### 7.3 Performance
1. Monitor DevTools Performance tab during interactions
2. **Expected**: No significant performance impact
3. **Verify**: Smooth 60fps animations where possible

## Test 8: Edge Cases

### 8.1 Very Small Screens
1. Test on screens smaller than 320px
2. **Expected**: Sidebar adapts gracefully
3. **Verify**: No horizontal scrolling or broken layout

### 8.2 Very Large Screens
1. Test on screens larger than 1920px
2. **Expected**: Sidebar maintains fixed width, content centers
3. **Verify**: No layout issues or excessive whitespace

### 8.3 Orientation Changes (Mobile)
1. Rotate mobile device or simulate in DevTools
2. **Expected**: Sidebar behavior adapts to new dimensions
3. **Verify**: State resets appropriately for new orientation

## Validation Checklist

After completing all tests, verify:

- [ ] Mobile: Sidebar hidden by default, hamburger visible
- [ ] Mobile: Hamburger shows sidebar with overlay
- [ ] Mobile: Overlay and collapse button hide sidebar
- [ ] Desktop: Sidebar visible by default, collapse button visible
- [ ] Desktop: Collapse button hides sidebar, shows floating toggle
- [ ] Desktop: Floating toggle shows sidebar again
- [ ] Window resize resets to appropriate default state
- [ ] No preferences stored in localStorage/sessionStorage
- [ ] All toggle buttons work correctly
- [ ] ARIA attributes update properly
- [ ] Keyboard navigation works (Enter, Space, Escape)
- [ ] Animations are smooth and can be disabled
- [ ] Focus management works correctly
- [ ] High contrast mode supported

## Troubleshooting

If any test fails:

1. Check browser console for JavaScript errors
2. Verify CSS is loaded correctly
3. Ensure JavaScript file is loaded and executed
4. Check for conflicting CSS or JavaScript
5. Test in different browsers
6. Clear browser cache and reload

## Success Criteria

All tests should pass with:
- ✅ Consistent behavior across device types
- ✅ Proper state management without persistence
- ✅ Smooth animations and transitions
- ✅ Full accessibility compliance
- ✅ Responsive design at all screen sizes
- ✅ No JavaScript errors or console warnings