# Content Validation System

## Overview

The personal portfolio website includes a comprehensive content validation system that ensures all content files meet the required schema and provides clear error messages for content authors.

## Features

### ✅ Implemented Validation Features

1. **Frontmatter Validation for Required Fields**
   - Validates all required fields are present and not empty
   - Checks field types (string, number, boolean, array, object)
   - Provides specific error messages for missing or invalid fields

2. **Tag Validation (science, policy, tech only)**
   - Ensures only valid tags are used: `science`, `policy`, `tech`
   - Validates tags are provided as arrays
   - Checks for duplicate tags (warning)
   - Allows multiple tags for interdisciplinary work

3. **Image Path Validation**
   - Validates that referenced image files exist
   - Checks proper path format (starting with `/`, `assets/`, or `static/`)
   - In development: shows warnings for missing images
   - In production: shows errors for missing images

4. **Clear Error Messages for Content Authors**
   - Detailed error messages with file paths and field names
   - Helpful guidance on how to fix validation errors
   - Warnings vs errors distinction
   - Context-specific help messages

## Validation Scripts

### 1. Standalone Content Validation (`npm run validate`)

**File**: `scripts/validate-content.js`

**Purpose**: Comprehensive validation of all content files with detailed reporting.

**Usage**:
```bash
npm run validate          # Validate all content
npm run validate:fix      # Get help fixing errors
```

**Features**:
- Validates all markdown files in `src/content/`
- Checks frontmatter against schema definitions
- Validates image paths and link formats
- Provides detailed error and warning reports
- Includes helpful guidance for fixing issues

### 2. Build-Time Validation (`npm run build:validate`)

**File**: `scripts/build-validation.js`

**Purpose**: Pre-build validation that runs before the site build process.

**Usage**:
```bash
npm run build:validate    # Run pre-build validation
npm run build            # Full build with validation
```

**Features**:
- Validates content files and configuration files
- Checks for common issues (missing directories, no content)
- Integrates with build process to prevent broken builds
- Configurable to fail on warnings or errors

### 3. Eleventy Build Integration

**File**: `.eleventy.js` (enhanced validation functions)

**Purpose**: Real-time validation during Eleventy build process.

**Features**:
- Validates content as collections are created
- Filters out Eleventy system data from validation
- Provides immediate feedback during build
- Stops build on validation errors

## Content Schema

### Experience Entries

**Required Fields**:
- `title` (string): Position or role title
- `organization` (string): Organization or company name
- `dateRange` (string): Date range in format 'YYYY - YYYY' or 'YYYY - Present'
- `tags` (array): Array of tags from: science, policy, tech

**Optional Fields**:
- `location` (string): City, State/Country
- `featured` (boolean): Whether to highlight this entry
- `type` (string): Type of experience entry
- `status` (string): Current status (current, completed, ongoing)

### Work Items (Projects and Publications)

**Required Fields**:
- `title` (string): Project or publication title
- `description` (string): Brief description of the work
- `type` (string): "project" or "publication"
- `tags` (array): Array of tags from: science, policy, tech

**Optional Fields**:
- `collaborators` (array): Array of collaborator names or co-authors
- `technologies` (array): Array of technologies used (for projects)
- `journal` (string): Journal name (for publications)
- `year` (number): Year of completion or publication
- `status` (string): Current status
- `featured` (boolean): Whether to highlight this entry
- `links` (object): Relevant links (demo, github, live, doi, external)
- `media` (object): Media references (screenshot, tocImage, alt)

## Validation Rules

### Tag Validation
- **Valid Tags**: `science`, `policy`, `tech`
- **Format**: Must be an array (e.g., `["science", "policy"]`)
- **Required**: At least one tag must be specified
- **Duplicates**: Warned about but not blocked

### Work Type Validation
- **Valid Types**: `project`, `publication`
- **Type-Specific Fields**:
  - Projects: typically use `technologies` field
  - Publications: typically use `journal` field

### Image Path Validation
- **Valid Formats**: 
  - `/assets/images/filename.jpg` (absolute from site root)
  - `assets/images/filename.jpg` (relative)
  - `/static/filename.pdf` (static files)
- **Development Mode**: Missing images show warnings
- **Production Mode**: Missing images show errors and fail build

### Link Validation
- **External Links**: Should start with `http://` or `https://`
- **Internal Links**: Should start with `/`
- **DOI Links**: Should be full URLs (e.g., `https://doi.org/10.1000/...`)

## Configuration

### Validation Configuration (`src/_data/validation-config.json`)

Controls validation behavior:

```json
{
  "validation": {
    "enabled": true,
    "strictMode": false,
    "failOnWarnings": false,
    "rules": {
      "requiredFields": { "enabled": true, "severity": "error" },
      "tagValidation": { "enabled": true, "severity": "error" },
      "imagePathValidation": { "enabled": true, "severity": "warning" },
      "linkValidation": { "enabled": true, "severity": "warning" }
    }
  }
}
```

### Content Schema (`src/_data/content-schemas.json`)

Defines the structure and validation rules for all content types.

## Error Messages and Help

### Common Error Messages

1. **Missing Required Field**:
   ```
   Missing required field: dateRange
   ```
   **Fix**: Add the missing field to your frontmatter

2. **Invalid Tag**:
   ```
   Invalid tags: research, development. Valid tags are: science, policy, tech
   ```
   **Fix**: Use only the allowed tags: science, policy, tech

3. **Invalid Work Type**:
   ```
   Invalid work type: article. Valid types are: project, publication
   ```
   **Fix**: Use either "project" or "publication"

4. **Image Not Found**:
   ```
   Image file not found: /assets/images/screenshot.jpg
   ```
   **Fix**: Add the image file or update the path

### Getting Help

1. **Run validation**: `npm run validate`
2. **Check schema**: Review `src/_data/content-schemas.json`
3. **View examples**: Look at existing content files in `src/content/`
4. **Read error messages**: They include specific guidance for fixes

## Integration with Build Process

### Build Pipeline

1. **Pre-build validation** (`npm run build:validate`)
   - Validates all content and configuration
   - Checks for common issues
   - Fails build if errors found

2. **Clean and build assets** (`npm run clean && npm run build:css`)
   - Removes old build files
   - Compiles CSS with Tailwind

3. **Eleventy build** (`npm run build:html`)
   - Validates content during collection creation
   - Generates static HTML files
   - Fails if validation errors occur

4. **Asset optimization** (`npm run optimize:images && npm run optimize:js`)
   - Optimizes images (if dependencies installed)
   - Minifies JavaScript files

### Continuous Integration

The validation system integrates with CI/CD pipelines:

- **GitHub Actions**: Validation runs on every push
- **Build Failures**: Invalid content prevents deployment
- **Clear Feedback**: Developers see specific validation errors

## Best Practices

### For Content Authors

1. **Use the schema**: Check `src/_data/content-schemas.json` for field requirements
2. **Validate early**: Run `npm run validate` before committing changes
3. **Follow tag conventions**: Use only science, policy, tech tags
4. **Add images properly**: Place images in `src/assets/images/` and reference correctly
5. **Test your changes**: Run the full build to ensure everything works

### For Developers

1. **Update schema first**: Modify `content-schemas.json` before adding new fields
2. **Add validation rules**: Update validation scripts for new requirements
3. **Test validation**: Create invalid content to verify validation catches errors
4. **Document changes**: Update this documentation when modifying validation

## Troubleshooting

### Common Issues

1. **Build fails with validation errors**:
   - Run `npm run validate` to see detailed errors
   - Fix the reported issues in content files
   - Re-run the build

2. **Images not found warnings**:
   - In development: These are warnings and won't fail the build
   - Add actual image files or remove references before production

3. **Unknown field warnings**:
   - Remove unused fields from frontmatter
   - Or add new fields to the content schema if needed

4. **Tag validation errors**:
   - Ensure tags are arrays: `["science", "policy"]`
   - Use only valid tags: science, policy, tech

### Debug Mode

For detailed debugging, check the validation configuration and enable additional logging:

```bash
DEBUG=true npm run validate
```

## Future Enhancements

Potential improvements to the validation system:

1. **Link checking**: Validate external URLs are accessible
2. **Image optimization**: Automatic image resizing and format conversion
3. **Content linting**: Check for common writing issues
4. **Schema evolution**: Support for schema versioning and migration
5. **Performance validation**: Check content doesn't impact site performance

## Summary

The validation system ensures content quality and consistency while providing clear guidance for content authors. It integrates seamlessly with the build process and provides multiple levels of validation from development to production deployment.