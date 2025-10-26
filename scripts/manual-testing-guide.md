# Manual Testing Guide for Mobile Responsive Enhancements

This guide provides step-by-step instructions for manually testing all responsive features across different device sizes.

## Prerequisites

1. Ensure the development server is running: `docker-compose up eleventy-dev`
2. Open http://localhost:8080 in your browser
3. Open browser developer tools (F12)
4. Navigate to the device simulation/responsive design mode

## Test 1: Mobile Device Behavior (< 768px)

### Setup
- Set viewport to 375x667 (iPhone SE) or similar mobile size
- Refresh the page

### Expected Behavior
1. **Sidebar Hidden by Default**
   - ✅ Sidebar should not be visible
   - ✅ Content should take full width
   - ✅ Hamburger menu button visible in top-left corner

2. **Hamburger Menu Functionality**
   - ✅ Click hamburger menu → sidebar slides in from left
   - ✅ Semi-transparent overlay appears behind sidebar
   - ✅ Hamburger icon animates to X (close) icon
   - ✅ Sidebar takes full viewport width

3. **Closing Sidebar**
   - ✅ Click overlay → sidebar closes
   - ✅ Click X button in sidebar → sidebar closes
   - ✅ Press Escape key → sidebar closes

4. **Touch Targets**
   - ✅ All buttons are at least 44px in height/width
   - ✅ Adequate spacing between interactive elements
   - ✅ Filter buttons are touch-friendly
   - ✅ Navigation links are easy to tap

### Keyboard Testing
1. **Tab Navigation**
   - ✅ Tab key focuses hamburger menu button
   - ✅ Clear focus indicator visible
   - ✅ Enter/Space activates hamburger menu

2. **Focus Management**
   - ✅ When sidebar opens, focus moves inside sidebar
   - ✅ Tab navigation stays within sidebar (focus trapping)
   - ✅ Escape key closes sidebar and returns focus

## Test 2: Tablet Device Behavior (768px - 1023px)

### Setup
- Set viewport to 768x1024 (iPad) or similar tablet size
- Refresh the page

### Expected Behavior
1. **Sidebar Visible by Default**
   - ✅ Sidebar visible on page load
   - ✅ Content area adjusted to accommodate sidebar
   - ✅ No hamburger menu (should be hidden)

2. **Toggle Functionality**
   - ✅ Toggle button visible in sidebar header
   - ✅ Click toggle → sidebar hides, content expands
   - ✅ Click toggle again → sidebar shows, content adjusts
   - ✅ No overlay used (sidebar pushes content)

3. **Smooth Transitions**
   - ✅ Sidebar slides in/out smoothly
   - ✅ Content area transitions smoothly
   - ✅ No jarring layout shifts

## Test 3: Desktop Device Behavior (≥ 1024px)

### Setup
- Set viewport to 1440x900 or larger desktop size
- Refresh the page

### Expected Behavior
1. **Sidebar Visible by Default**
   - ✅ Sidebar visible on page load
   - ✅ Content optimally positioned
   - ✅ Toggle button available in sidebar

2. **Floating Toggle Button**
   - ✅ Hide sidebar → floating toggle button appears
   - ✅ Floating button positioned in top-left
   - ✅ Click floating button → sidebar returns
   - ✅ Floating button has smooth animations

3. **Preference Persistence**
   - ✅ Hide sidebar, refresh page → sidebar stays hidden
   - ✅ Show sidebar, refresh page → sidebar stays visible
   - ✅ Preferences saved in localStorage

## Test 4: Breakpoint Transitions

### Test Sequence
1. Start at mobile size (375px)
2. Gradually increase width to tablet (768px)
3. Continue to desktop (1024px+)
4. Reverse the process

### Expected Behavior
- ✅ Smooth transitions between device types
- ✅ Appropriate default states for each breakpoint
- ✅ No broken layouts during transitions
- ✅ Overlay disappears when moving from mobile to tablet
- ✅ Floating toggle appears/disappears appropriately

## Test 5: Accessibility Features

### Screen Reader Testing
1. **ARIA Labels**
   - ✅ Toggle buttons have descriptive labels
   - ✅ Labels update based on sidebar state
   - ✅ Sidebar has proper navigation role

2. **ARIA States**
   - ✅ `aria-expanded` updates when toggling
   - ✅ `aria-hidden` updates for sidebar and overlay
   - ✅ `aria-controls` properly references sidebar

### Keyboard Navigation
1. **Focus Management**
   - ✅ All interactive elements focusable with Tab
   - ✅ Focus indicators clearly visible
   - ✅ Logical tab order maintained

2. **Keyboard Shortcuts**
   - ✅ Enter/Space activates toggle buttons
   - ✅ Escape closes sidebar from any focused element
   - ✅ Focus trapping works in mobile overlay mode

## Test 6: Animation and Performance

### Animation Testing
1. **Standard Animations**
   - ✅ Sidebar slides smoothly (300ms duration)
   - ✅ Overlay fades in/out smoothly
   - ✅ Hamburger icon animates to X
   - ✅ Floating toggle has bounce-in effect

2. **Reduced Motion**
   - Enable "Reduce motion" in OS accessibility settings
   - ✅ Animations disabled or significantly reduced
   - ✅ Functionality still works without animations

### Performance
- ✅ No layout thrashing during animations
- ✅ Smooth 60fps animations on mobile
- ✅ No memory leaks after repeated toggling

## Test 7: Theme Integration

### Theme Switching
1. **Light Theme**
   - ✅ All responsive elements use theme colors
   - ✅ Proper contrast maintained
   - ✅ Toggle buttons visible and accessible

2. **Dark Theme**
   - ✅ Switch to dark theme
   - ✅ All responsive elements adapt to dark colors
   - ✅ Overlay opacity appropriate for dark theme
   - ✅ Focus indicators visible in dark theme

## Test 8: Content Integration

### Navigation Testing
1. **Mobile Navigation**
   - ✅ Tap navigation link → sidebar closes automatically
   - ✅ Page scrolls to correct section
   - ✅ Section highlighting works correctly

2. **Filter System**
   - ✅ Filter buttons work on all device sizes
   - ✅ Touch targets adequate on mobile
   - ✅ Content filtering maintains sidebar state

## Test 9: Edge Cases

### Unusual Viewport Sizes
- Test at 320px width (very small mobile)
- Test at 1920px+ width (large desktop)
- Test portrait/landscape orientation changes

### Browser Compatibility
- Test in Chrome, Firefox, Safari, Edge
- Test on actual mobile devices if possible
- Verify fallbacks work in older browsers

## Test 10: Error Scenarios

### JavaScript Disabled
- ✅ Sidebar remains accessible
- ✅ Basic functionality preserved
- ✅ No broken layouts

### CSS Loading Issues
- ✅ Graceful degradation
- ✅ Content remains readable
- ✅ Basic navigation possible

## Reporting Issues

When reporting issues, please include:
1. Device/viewport size
2. Browser and version
3. Steps to reproduce
4. Expected vs actual behavior
5. Screenshots if applicable

## Success Criteria

All tests should pass with:
- ✅ Smooth, intuitive user experience
- ✅ Proper accessibility support
- ✅ Consistent behavior across devices
- ✅ No layout breaks or visual glitches
- ✅ Performance remains good on all devices

---

**Note**: This guide covers manual testing. For automated testing, see the `test-responsive-behavior.js` script.