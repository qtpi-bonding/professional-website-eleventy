# Personal Portfolio Website

A modern, responsive personal portfolio website built with Eleventy (11ty) and Tailwind CSS. Features a centralized theme system, content filtering, and automated deployment to GitHub Pages.

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
docker-compose up eleventy-dev
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

The site uses a centralized theme system defined in `src/_data/app-theme.json`. All colors, typography, and spacing are configured here and automatically generate CSS custom properties and Tailwind utility classes.

**Important**: Never use hardcoded colors like `text-gray-900` or `bg-white`. Always use theme classes like `text-text`, `bg-surface`, or `text-primary`.

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