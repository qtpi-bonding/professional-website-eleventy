# Personal Portfolio Website

A modern, responsive personal portfolio website built with Eleventy (11ty) and Tailwind CSS. Features a centralized theme system, content filtering, and automated deployment to GitHub Pages.

🚀 **Ready for deployment** - Configure GitHub Pages and push to deploy!

## Features

- **Unified Content Filtering**: Filter content by Science, Policy, and Technology domains
- **Responsive Design**: Mobile-first design with automatic light/dark theme detection
- **Content Management**: Easy content updates through markdown files
- **Performance Optimized**: Static site generation with optimized assets
- **Accessibility Compliant**: WCAG-compliant design with proper semantic markup

## Quick Start

### Prerequisites

- Docker and Docker Compose (recommended)
- OR Node.js 18+ and npm (alternative)

### Development with Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/username/repository-name.git
cd repository-name
```

2. Start the development environment:
```bash
docker-compose up eleventy-dev -d
```

3. Open your browser to `http://localhost:8080`

4. Make changes to files in the `src/` directory - the site will automatically rebuild and reload.

### Development without Docker

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run serve
```

## Project Structure

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for a detailed overview of the project organization.

## Testing & Validation

The project includes comprehensive testing and validation:

```bash
# Run unit tests
docker exec -it eleventy-landing-dev npm test

# Validate content
docker exec -it eleventy-landing-dev npm run validate

# Test responsive behavior
docker exec -it eleventy-landing-dev npm run test:responsive

# Test content workflow
docker exec -it eleventy-landing-dev npm run test:workflow
```

3. Open your browser to `http://localhost:8080`

## Content Management

### Adding Experience Entries

Create new markdown files in `src/content/experience/`:

```markdown
---
title: "Your Position Title"
organization: "Organization Name"
dateRange: "2023 - Present"
location: "City, State"
tags: ["science", "policy", "tech"]  # Choose relevant tags
featured: true  # Optional: highlight this entry
---

Description of your role, responsibilities, and achievements.
```

### Adding Work Items (Projects/Publications)

Create new markdown files in `src/content/work/`:

```markdown
---
title: "Project or Publication Title"
description: "Brief description"
type: "project"  # or "publication"
tags: ["science", "tech"]  # Choose relevant tags
collaborators: ["Collaborator Name"]
technologies: ["React", "Python"]  # For projects
journal: "Journal Name"  # For publications
year: 2023
links:
  demo: "https://demo.example.com"
  github: "https://github.com/user/repo"
media:
  screenshot: "/assets/images/project-screenshot.jpg"
  alt: "Screenshot description"
---

Detailed description of the project or publication.
```

### Updating Site Information

Edit configuration files in `src/_data/`:

- `site.json`: Site metadata, author info, social links
- `app-theme.json`: Colors, typography, spacing (design system)
- `navigation.json`: Site navigation structure

## Deployment

### GitHub Pages (Automated)

1. **Enable GitHub Pages**:
   - Go to your repository Settings → Pages
   - Source: "GitHub Actions"

2. **Update Configuration**:
   - Edit `src/_data/site.json`
   - Update the `github.repository` field with your `username/repository-name`
   - Update author information and social links

3. **Push to Main Branch**:
   ```bash
   git add .
   git commit -m "Initial site setup"
   git push origin main
   ```

4. **Automatic Deployment**:
   - GitHub Actions will automatically build and deploy your site
   - Your site will be available at `https://username.github.io/repository-name`

### Manual Deployment

Build the site locally:

```bash
# With Docker
docker exec -it eleventy-landing-dev npm run build

# Without Docker
npm run build
```

The built site will be in the `_site/` directory, ready for deployment to any static hosting service.

## Project Structure

```
src/
├── _data/                    # Configuration files (JSON)
├── _includes/               # Templates and components
│   ├── layouts/            # Page layouts
│   └── components/         # Reusable components
├── assets/                 # CSS, JS, and images
├── content/                # Content collections (Markdown)
│   ├── experience/         # Professional experience
│   └── work/              # Projects and publications
├── pages/                  # Main site pages
└── static/                # Static files (PDFs, etc.)
```

## Customization

### Theme System

This project uses a **centralized, automated theme system** that provides a "Flutter-like experience" where all design values are controlled from a single source.

#### How It Works

```
app-theme.json → generate-theme-css.js → colors.css → Tailwind → Final CSS
```

1. **Single Source of Truth**: `src/_data/app-theme.json` defines ALL colors, typography, and spacing
2. **Automatic Generation**: `scripts/generate-theme-css.js` converts JSON to CSS custom properties
3. **Build Integration**: Theme generation runs automatically during `npm run build`
4. **Theme Switching**: JavaScript handles light/dark mode with user preference persistence

#### Changing Colors

To change the site's color scheme:

1. **Edit the source**: Only modify `src/_data/app-theme.json`
   ```json
   {
     "themes": {
       "light": {
         "primary": "#FF6B35",     // Your new primary color
         "secondary": "#004225",   // Your new secondary color
         "surface": "#ffffff",     // Background color
         "text": "#000000"         // Text color
       },
       "dark": {
         "primary": "#004225",     // Colors swap in dark mode
         "secondary": "#FF6B35",   
         "surface": "#000000",
         "text": "#ffffff"
       }
     }
   }
   ```

2. **Rebuild**: Run `npm run build` (or `docker exec -it eleventy-landing-dev npm run build`)

3. **Verify**: Check both light and dark modes work correctly

#### Using Theme Colors

**✅ CORRECT - Use theme utility classes:**
```html
<div class="bg-surface text-text">Content</div>
<button class="bg-primary text-surface">Primary Button</button>
<h1 class="text-text font-headline">Heading</h1>
```

**❌ WRONG - Never use hardcoded colors:**
```html
<div class="bg-white text-black">Content</div>
<div class="bg-gray-100 text-gray-900">Content</div>
<div class="dark:bg-gray-800 dark:text-white">Content</div>
```

#### Available Theme Classes

- **Backgrounds**: `bg-surface`, `bg-primary`, `bg-secondary`
- **Text**: `text-text`, `text-textSecondary`, `text-primary`, `text-secondary`
- **Borders**: `border-primary`, `border-secondary`
- **States**: `text-success`, `text-warning`, `text-error`, `text-info`
- **Neutrals**: `bg-neutral-100`, `text-neutral-700`, etc.

#### Theme Toggle

The site automatically includes a theme toggle button that:
- Switches between light and dark modes
- Remembers user preference in localStorage
- Respects system preference (`prefers-color-scheme`)
- Provides smooth transitions between themes

#### Key Files

- `src/_data/app-theme.json` - **Edit this to change colors**
- `scripts/generate-theme-css.js` - Generates CSS from JSON
- `src/assets/css/design-tokens/colors.css` - **Auto-generated, don't edit**
- `src/assets/js/theme-system.js` - Theme switching logic

**Important**: Never edit generated CSS files or use hardcoded colors. The theme system ensures consistent theming across the entire site.

### Adding New Content Types

1. Create a new content directory in `src/content/`
2. Add validation rules in `.eleventy.js`
3. Create display components in `src/_includes/components/`
4. Update the homepage layout to include the new content type

## Testing

Run the test suite:

```bash
# With Docker
docker exec -it eleventy-landing-dev npm test

# Without Docker
npm test
```

## Troubleshooting

### Common Issues

1. **Build Failures**: Check that all required frontmatter fields are present in content files
2. **Styling Issues**: Ensure you're using theme classes, not hardcoded colors
3. **Asset Loading**: Verify asset paths use the `url` filter for proper base URL handling

### Getting Help

- Check the [Eleventy documentation](https://www.11ty.dev/docs/)
- Review the [Tailwind CSS documentation](https://tailwindcss.com/docs)
- Open an issue in this repository for project-specific questions

## License

MIT License - see LICENSE file for details.