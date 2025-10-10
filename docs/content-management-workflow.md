# Content Management Workflow Guide

This document describes the complete content management workflow for the personal portfolio website, including how to add new content, update existing content, and troubleshoot validation issues.

## Overview

The portfolio website uses a **markdown-based content management system** with built-in validation to ensure content quality and consistency. All content is stored in markdown files with YAML frontmatter, and the system automatically validates, builds, and integrates new content into the filtering system.

## Content Types

### Experience Entries
**Location**: `src/content/experience/`
**Purpose**: Professional experience, roles, fellowships, and positions

**Required Fields**:
- `title`: Position or role title
- `organization`: Organization or company name
- `dateRange`: Date range (e.g., "2023 - Present", "2022 - 2023")
- `tags`: Array of tags from: `["science", "policy", "tech"]`

**Optional Fields**:
- `location`: City, State/Country
- `featured`: Boolean to highlight the entry
- `status`: Current status ("current", "completed", "ongoing")

**Example**:
```yaml
---
title: "Senior Data Scientist"
organization: "Research Institute"
dateRange: "2023 - Present"
location: "San Francisco, CA"
tags: ["science", "tech"]
featured: true
status: "current"
---

Description of the role, responsibilities, and achievements...
```

### Work Items (Projects and Publications)
**Location**: `src/content/work/`
**Purpose**: Projects, publications, research papers, and other work outputs

**Required Fields**:
- `title`: Project or publication title
- `description`: Brief description
- `type`: Either "project" or "publication"
- `tags`: Array of tags from: `["science", "policy", "tech"]`

**Optional Fields**:
- `collaborators`: Array of collaborator names or co-authors
- `technologies`: Array of technologies used (for projects)
- `journal`: Journal name (for publications)
- `year`: Year of completion or publication
- `status`: Current status ("completed", "ongoing", "archived", "published")
- `featured`: Boolean to highlight the entry
- `links`: Object with relevant URLs
- `media`: Object with image references

**Project Example**:
```yaml
---
title: "Climate Data Platform"
description: "Interactive platform for visualizing climate change data"
type: "project"
tags: ["science", "tech"]
collaborators: ["Dr. Jane Smith", "Prof. John Doe"]
technologies: ["React", "D3.js", "Python", "PostgreSQL"]
year: 2024
status: "completed"
links:
  demo: "https://climate-platform-demo.example.com"
  github: "https://github.com/username/climate-platform"
  live: "https://climate-platform.example.com"
media:
  screenshot: "/assets/images/climate-platform-screenshot.jpg"
  alt: "Climate platform dashboard screenshot"
---

Detailed description of the project...
```

**Publication Example**:
```yaml
---
title: "Machine Learning Ethics in Policy Making"
description: "Analysis of ethical considerations in AI-driven policy decisions"
type: "publication"
tags: ["policy", "tech"]
collaborators: ["Dr. Sarah Johnson", "Prof. Michael Chen"]
journal: "Journal of Technology Policy"
year: 2024
status: "published"
links:
  doi: "https://doi.org/10.1000/jtp.2024.123456"
  external: "https://journal-website.com/article/123"
media:
  tocImage: "/assets/images/ml-ethics-paper-toc.jpg"
  alt: "Paper table of contents"
---

Abstract and detailed description of the publication...
```

## Workflow Steps

### 1. Adding New Content

#### Step 1: Create the Markdown File
Create a new `.md` file in the appropriate directory:
- Experience: `src/content/experience/filename.md`
- Work: `src/content/work/filename.md`

Use kebab-case for filenames (e.g., `senior-data-scientist.md`, `climate-research-project.md`).

#### Step 2: Add Frontmatter and Content
Include all required fields in the YAML frontmatter and write the content in markdown below.

#### Step 3: Validate Content
Run the validation command to check for errors:
```bash
npm run validate
```

#### Step 4: Build and Test
Build the site to ensure everything integrates properly:
```bash
npm run build
```

#### Step 5: Verify Integration
Check that the new content appears on the site and integrates with the filtering system.

### 2. Updating Existing Content

#### Step 1: Edit the Markdown File
Open the existing file and make your changes to either the frontmatter or content.

#### Step 2: Validate Changes
Run validation to ensure the updates are valid:
```bash
npm run validate
```

#### Step 3: Rebuild
Rebuild the site to apply changes:
```bash
npm run build
```

### 3. Error Handling and Troubleshooting

#### Common Validation Errors

**Missing Required Fields**:
```
❌ Missing required field: organization
```
**Solution**: Add the missing field to the frontmatter.

**Invalid Tags**:
```
❌ Invalid tags: machine-learning. Valid tags are: science, policy, tech
```
**Solution**: Use only the allowed tags: `science`, `policy`, `tech`.

**Invalid Work Type**:
```
❌ Invalid work type: research. Valid types are: project, publication
```
**Solution**: Use either `project` or `publication` for the `type` field.

**Wrong Field Type**:
```
❌ Field featured must be a boolean
```
**Solution**: Use `true` or `false` (not quoted) for boolean fields.

#### Validation Commands

- `npm run validate` - Run content validation
- `npm run validate:fix` - Get help fixing validation errors
- `npm run test:workflow` - Run comprehensive workflow tests

#### Build Commands

- `npm run build` - Full build with validation
- `npm run build:validate` - Run pre-build validation only
- `npm run serve` - Build and serve for development

## Content Guidelines

### Tags Usage
- **science**: Research, scientific work, data analysis, academic publications
- **policy**: Policy analysis, governance, regulatory work, policy papers
- **tech**: Software development, technical projects, programming, tools

### Multi-disciplinary Work
Use multiple tags for work that spans disciplines:
```yaml
tags: ["science", "policy", "tech"]  # For AI governance research with technical implementation
```

### Content Quality
- Write clear, concise descriptions
- Use proper markdown formatting
- Include relevant links and media when available
- Keep frontmatter consistent and complete

### Image Management
- Place images in `src/assets/images/` or `src/static/`
- Use descriptive filenames
- Include alt text for accessibility
- Optimize images for web use

## Automated Testing

### Workflow Test Suite
Run the complete workflow test suite:
```bash
npm run test:workflow
```

This tests:
- ✅ New content creation and validation
- ✅ Content updates without breaking functionality
- ✅ Error handling for invalid content
- ✅ Filtering system integration
- ✅ Build process validation

### Individual Tests
- `npm run validate` - Content validation only
- `npm run test` - JavaScript unit tests
- `npm run verify:deployment` - Deployment verification

## Best Practices

### File Organization
- Use descriptive, kebab-case filenames
- Group related content logically
- Keep file structure consistent

### Content Maintenance
- Regularly validate all content: `npm run validate`
- Update content as roles and projects evolve
- Remove outdated or irrelevant entries
- Keep tags consistent across similar content

### Development Workflow
1. Create/edit content in markdown files
2. Validate content: `npm run validate`
3. Build site: `npm run build`
4. Test locally: `npm run serve`
5. Commit changes to version control

### Production Deployment
1. Run full test suite: `npm run test:workflow`
2. Validate deployment: `npm run deploy:check`
3. Deploy to production
4. Verify live site functionality

## Troubleshooting

### Build Failures
If the build fails:
1. Check validation output: `npm run validate`
2. Fix any validation errors
3. Ensure all required fields are present
4. Verify image paths exist
5. Check for syntax errors in frontmatter

### Content Not Appearing
If new content doesn't appear:
1. Verify file is in correct directory
2. Check frontmatter syntax
3. Ensure required fields are present
4. Rebuild the site: `npm run build`
5. Clear browser cache

### Filtering Issues
If content doesn't filter properly:
1. Verify tags are valid: `science`, `policy`, `tech`
2. Check tags are in array format: `["science", "tech"]`
3. Ensure no typos in tag names
4. Rebuild to update filtering data

## Support

For additional help:
- Check validation output for specific error messages
- Review sample content files in `src/content/`
- Run workflow tests: `npm run test:workflow`
- Check content schema: `src/_data/content-schemas.json`

The content management system is designed to be user-friendly while maintaining quality and consistency. Follow these guidelines to ensure smooth content updates and a professional portfolio presentation.