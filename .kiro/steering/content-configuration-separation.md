# Content/Configuration Separation - CRITICAL PRINCIPLE

## MANDATORY: Content and Configuration Must Be Separated

This project enforces a **strict separation** between content and configuration. This is not optional - it's a core architectural principle that must be followed in all implementations.

## The Separation Principle

### 📝 Content (Markdown Files)
**What**: User-facing information that content managers edit
**Where**: `src/pages/*.md`, `src/content/*/*.md`, `src/blog/*.md`
**Who**: Content managers, marketing team, non-technical users
**Examples**: 
- Company information and mission statements
- Team member bios and descriptions
- Service descriptions and features
- Blog posts and articles
- Contact information and business hours

### 🔧 Configuration (JSON Files)
**What**: Technical settings that developers manage
**Where**: `src/_data/*.json`
**Who**: Developers, technical team
**Examples**:
- Site URLs and technical metadata
- Analytics and tracking IDs
- Integration settings (APIs, forms)
- Brand colors and design tokens
- Component styling definitions
- Navigation structure and menus

## Why This Matters

### For Content Managers
- **Edit content without touching code** - Safe to update text without breaking functionality
- **Rich formatting support** - Use markdown for formatting, links, lists, images
- **Version control friendly** - Easy to track what content changed when
- **No technical knowledge required** - Focus on content, not code

### For Developers
- **Clean separation of concerns** - Content changes don't affect technical functionality
- **Easier maintenance** - Technical settings are structured and predictable
- **Better collaboration** - Content team can work independently
- **Reduced bugs** - Content updates can't break technical features

## Implementation Rules

### ✅ CORRECT Patterns

**Content in Markdown:**
```markdown
---
# src/pages/about.md
title: "About Our Company"
description: "Learn about our mission and team"
layout: "page"
permalink: "/about/"
---

# About Our Company

We are a forward-thinking technology company dedicated to creating innovative solutions.
```

**Configuration in JSON:**
```json
// src/_data/site.json
{
  "title": "Site Name",
  "url": "https://example.com",
  "analytics": {
    "plausible": {
      "domain": "example.com",
      "enabled": true
    }
  }
}
```

**Template Usage:**
```njk
<!-- Content from markdown -->
<h1>{{ title }}</h1>
<div class="prose">{{ content | safe }}</div>

<!-- Configuration from JSON -->
<img src="{{ site.branding.logo.svg }}" alt="{{ site.branding.logo.alt }}">
```

### ❌ PROHIBITED Patterns

**Never put content in JSON:**
```json
// DON'T do this in site.json
{
  "aboutPageTitle": "About Our Company",
  "aboutPageContent": "We are a technology company...",
  "teamMemberBio": "John is a great developer..."
}
```

**Never hardcode content in templates:**
```njk
<!-- DON'T do this -->
<h1>My Company Name</h1>
<p>We are the best company ever!</p>
```

**Never put technical settings in content:**
```markdown
<!-- DON'T do this in about.md -->
---
title: "About"
analytics_id: "GA-XXXXXXXXX"
api_endpoint: "https://api.example.com"
---
```

## File Organization

### Content Files Structure
```
src/
├── pages/                    # Main site pages
│   ├── about.md             # Company information
│   ├── contact.md           # Contact information
│   └── services.md          # Services overview
├── content/                 # Structured content collections
│   ├── team/                # Individual team members
│   │   ├── sarah-johnson.md
│   │   └── mike-chen.md
│   ├── services/            # Individual service descriptions
│   │   ├── web-development.md
│   │   └── mobile-apps.md
│   └── testimonials/        # Customer testimonials
│       ├── client-a.md
│       └── client-b.md
└── blog/                    # Blog posts and articles
```

### Configuration Files Structure
```
src/_data/
├── site.json              # Site configuration (URLs, analytics, integrations)
├── app-theme.json         # Design system (colors, typography, spacing)
├── component-variants.json # Component styling definitions
├── navigation.json        # Menu structure and navigation
└── social.json           # Social media platform configurations
```

## Decision Matrix

When adding new data, use this matrix to determine where it belongs:

| Question | Content (Markdown) | Configuration (JSON) |
|----------|-------------------|---------------------|
| Who will edit this? | Content managers, marketing team | Developers, technical team |
| How often does it change? | Frequently (weekly/monthly) | Rarely (quarterly/yearly) |
| Is it user-facing text? | ✅ Yes | ❌ No |
| Is it a technical setting? | ❌ No | ✅ Yes |
| Does it need rich formatting? | ✅ Yes | ❌ No |
| Is it a URL or integration? | ❌ No | ✅ Yes |

## Template Data Access Patterns

### Accessing Content Data
```njk
<!-- From page frontmatter -->
<h1>{{ title }}</h1>
<p>{{ description }}</p>

<!-- From page content -->
{{ content | safe }}

<!-- From collections -->
{% for member in collections.team %}
  <h3>{{ member.data.name }}</h3>
  <p>{{ member.data.role }}</p>
  <div>{{ member.templateContent | safe }}</div>
{% endfor %}
```

### Accessing Configuration Data
```njk
<!-- From site configuration -->
<img src="{{ site.branding.logo.svg }}" alt="{{ site.branding.logo.alt }}">

<!-- From navigation configuration -->
{% for item in navigation.main %}
  <a href="{{ item.url }}">{{ item.title }}</a>
{% endfor %}

<!-- From theme configuration -->
<div class="bg-primary text-surface">Themed content</div>
```

## Enforcement in Code Reviews

### Must Check
- [ ] Is user-facing text in markdown files?
- [ ] Are technical settings in JSON files?
- [ ] Are templates using correct data access patterns?
- [ ] Is there any hardcoded content in templates?
- [ ] Is there any content mixed into configuration files?

### Red Flags
- Content strings in JSON files
- Hardcoded text in templates
- Technical settings in markdown frontmatter
- Mixed content/configuration in single files

## Migration Guidelines

When updating existing mixed content/configuration:

1. **Audit existing data**: Identify what is content vs configuration
2. **Create content files**: Move user-facing text to markdown files with proper frontmatter
3. **Clean configuration**: Remove content from JSON files, keep only technical settings
4. **Update templates**: Change data access patterns to use new structure
5. **Test thoroughly**: Verify all content appears and functionality works
6. **Document changes**: Update any references to old data structure

## Benefits Summary

### Content Managers Can
- ✅ Update text without touching code
- ✅ Use rich markdown formatting
- ✅ Work independently from developers
- ✅ Focus on content quality, not technical details

### Developers Can
- ✅ Change technical settings without affecting content
- ✅ Maintain clean, structured configuration
- ✅ Implement features without content dependencies
- ✅ Collaborate effectively with content teams

### The Project Gets
- ✅ Clear separation of concerns
- ✅ Easier maintenance and updates
- ✅ Better collaboration between teams
- ✅ Reduced risk of breaking changes
- ✅ Scalable content management

## Remember

**This separation is MANDATORY, not optional.**

- **Content** (user-facing text) → **Markdown files**
- **Configuration** (technical settings) → **JSON files**
- **Never mix them** in the same file or location

Following this principle ensures maintainable, scalable content management while keeping technical configuration properly organized.