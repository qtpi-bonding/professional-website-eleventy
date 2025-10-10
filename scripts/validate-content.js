#!/usr/bin/env node

/**
 * Content Validation Script
 * 
 * This script validates all content files to ensure they meet the required schema
 * and provides clear error messages for content authors.
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Load content schemas
const contentSchemas = require('../src/_data/content-schemas.json');

// Valid tags from schema
const VALID_TAGS = contentSchemas.validation.tags.validValues;
const VALID_WORK_TYPES = contentSchemas.validation.workTypes.validValues;

// Content directories to validate
const CONTENT_DIRS = {
  experience: 'src/content/experience',
  work: 'src/content/work'
};

// Image directories to check
const IMAGE_DIRS = [
  'src/assets/images',
  'src/static'
];

class ValidationError extends Error {
  constructor(message, file, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.file = file;
    this.field = field;
  }
}

class ContentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Validate a single content file
   */
  validateFile(filePath, contentType) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const parsed = matter(fileContent);
      const data = parsed.data;
      const content = parsed.content;

      // Get schema for this content type
      const schema = contentSchemas[contentType];
      if (!schema) {
        throw new ValidationError(`Unknown content type: ${contentType}`, filePath);
      }

      // Validate required fields
      this.validateRequiredFields(data, schema.required, filePath);

      // Validate field types and values
      this.validateFieldTypes(data, schema.fields, filePath);

      // Validate tags
      this.validateTags(data.tags, filePath);

      // Validate work type (for work items)
      if (contentType === 'work') {
        this.validateWorkType(data.type, filePath);
      }

      // Validate image paths
      this.validateImagePaths(data, filePath);

      // Validate links
      this.validateLinks(data.links, filePath);

      // Validate content is not empty
      if (!content || content.trim().length === 0) {
        this.addWarning(`Content body is empty`, filePath);
      }

      console.log(`✓ ${path.relative(process.cwd(), filePath)}`);

    } catch (error) {
      if (error instanceof ValidationError) {
        this.errors.push(error);
      } else {
        this.errors.push(new ValidationError(`Failed to parse file: ${error.message}`, filePath));
      }
    }
  }

  /**
   * Validate required fields are present
   */
  validateRequiredFields(data, requiredFields, filePath) {
    requiredFields.forEach(field => {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        throw new ValidationError(`Missing required field: ${field}`, filePath, field);
      }
    });
  }

  /**
   * Validate field types and values
   */
  validateFieldTypes(data, fieldSchema, filePath) {
    Object.keys(data).forEach(fieldName => {
      const fieldValue = data[fieldName];
      const fieldDef = fieldSchema[fieldName];

      if (!fieldDef) {
        this.addWarning(`Unknown field: ${fieldName}`, filePath, fieldName);
        return;
      }

      // Type validation
      switch (fieldDef.type) {
        case 'string':
          if (typeof fieldValue !== 'string') {
            throw new ValidationError(`Field ${fieldName} must be a string`, filePath, fieldName);
          }
          break;
        case 'number':
          if (typeof fieldValue !== 'number') {
            throw new ValidationError(`Field ${fieldName} must be a number`, filePath, fieldName);
          }
          break;
        case 'boolean':
          if (typeof fieldValue !== 'boolean') {
            throw new ValidationError(`Field ${fieldName} must be a boolean`, filePath, fieldName);
          }
          break;
        case 'array':
          if (!Array.isArray(fieldValue)) {
            throw new ValidationError(`Field ${fieldName} must be an array`, filePath, fieldName);
          }
          break;
        case 'object':
          if (typeof fieldValue !== 'object' || Array.isArray(fieldValue)) {
            throw new ValidationError(`Field ${fieldName} must be an object`, filePath, fieldName);
          }
          break;
      }

      // Valid values validation
      if (fieldDef.validValues) {
        if (fieldDef.type === 'array') {
          // For arrays, check each element
          if (Array.isArray(fieldValue)) {
            const invalidValues = fieldValue.filter(val => !fieldDef.validValues.includes(val));
            if (invalidValues.length > 0) {
              throw new ValidationError(
                `Field ${fieldName} contains invalid values: ${invalidValues.join(', ')}. Valid values are: ${fieldDef.validValues.join(', ')}`,
                filePath,
                fieldName
              );
            }
          }
        } else {
          // For non-arrays, check the value directly
          if (!fieldDef.validValues.includes(fieldValue)) {
            throw new ValidationError(
              `Field ${fieldName} has invalid value: ${fieldValue}. Valid values are: ${fieldDef.validValues.join(', ')}`,
              filePath,
              fieldName
            );
          }
        }
      }
    });
  }

  /**
   * Validate tags array
   */
  validateTags(tags, filePath) {
    if (!tags) {
      throw new ValidationError('Tags field is required', filePath, 'tags');
    }

    if (!Array.isArray(tags)) {
      throw new ValidationError('Tags must be an array', filePath, 'tags');
    }

    if (tags.length === 0) {
      throw new ValidationError('At least one tag is required', filePath, 'tags');
    }

    const invalidTags = tags.filter(tag => !VALID_TAGS.includes(tag));
    if (invalidTags.length > 0) {
      throw new ValidationError(
        `Invalid tags: ${invalidTags.join(', ')}. Valid tags are: ${VALID_TAGS.join(', ')}`,
        filePath,
        'tags'
      );
    }

    // Check for duplicate tags
    const uniqueTags = [...new Set(tags)];
    if (uniqueTags.length !== tags.length) {
      this.addWarning('Duplicate tags found', filePath, 'tags');
    }
  }

  /**
   * Validate work type
   */
  validateWorkType(type, filePath) {
    if (!type) {
      throw new ValidationError('Work type is required', filePath, 'type');
    }

    if (!VALID_WORK_TYPES.includes(type)) {
      throw new ValidationError(
        `Invalid work type: ${type}. Valid types are: ${VALID_WORK_TYPES.join(', ')}`,
        filePath,
        'type'
      );
    }
  }

  /**
   * Validate image paths exist
   */
  validateImagePaths(data, filePath) {
    const imagePaths = [];

    // Check media object
    if (data.media) {
      if (data.media.screenshot) {
        imagePaths.push(data.media.screenshot);
      }
      if (data.media.tocImage) {
        imagePaths.push(data.media.tocImage);
      }
    }

    // Check any other image fields that might exist
    ['image', 'photo', 'avatar'].forEach(field => {
      if (data[field]) {
        imagePaths.push(data[field]);
      }
    });

    imagePaths.forEach(imagePath => {
      if (!this.imageExists(imagePath)) {
        // In development, treat missing images as warnings instead of errors
        const isDevelopment = process.env.NODE_ENV !== 'production';
        if (isDevelopment) {
          this.addWarning(`Image file not found: ${imagePath} (will need to be added before production)`, filePath, 'media');
        } else {
          throw new ValidationError(`Image file not found: ${imagePath}`, filePath, 'media');
        }
      }
    });
  }

  /**
   * Check if image file exists
   */
  imageExists(imagePath) {
    // Handle different path formats
    let checkPaths = [];

    if (imagePath.startsWith('/')) {
      // Absolute path from site root
      checkPaths.push(path.join('src', imagePath.substring(1)));
      checkPaths.push(path.join('_site', imagePath.substring(1)));
    } else {
      // Relative path
      checkPaths.push(path.join('src', imagePath));
      checkPaths.push(imagePath);
    }

    return checkPaths.some(checkPath => fs.existsSync(checkPath));
  }

  /**
   * Validate links object
   */
  validateLinks(links, filePath) {
    if (!links) return;

    if (typeof links !== 'object' || Array.isArray(links)) {
      throw new ValidationError('Links must be an object', filePath, 'links');
    }

    // Validate URL format for external links
    Object.entries(links).forEach(([linkType, url]) => {
      if (url && typeof url === 'string') {
        // Basic URL validation for external links
        if (linkType !== 'internal' && !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
          this.addWarning(`Link ${linkType} should be a full URL or start with /: ${url}`, filePath, 'links');
        }
      }
    });
  }

  /**
   * Add a warning (non-fatal)
   */
  addWarning(message, filePath, field = null) {
    this.warnings.push({
      message,
      file: filePath,
      field
    });
  }

  /**
   * Validate all content files
   */
  validateAllContent() {
    console.log('🔍 Validating content files...\n');

    Object.entries(CONTENT_DIRS).forEach(([contentType, dirPath]) => {
      if (!fs.existsSync(dirPath)) {
        console.log(`⚠ Content directory not found: ${dirPath}`);
        return;
      }

      console.log(`Validating ${contentType} files:`);
      
      const files = fs.readdirSync(dirPath)
        .filter(file => file.endsWith('.md'))
        .map(file => path.join(dirPath, file));

      files.forEach(file => {
        this.validateFile(file, contentType);
      });

      console.log('');
    });
  }

  /**
   * Print validation results
   */
  printResults() {
    console.log('\n📊 Validation Results:');
    
    if (this.warnings.length > 0) {
      console.log(`\n⚠ Warnings (${this.warnings.length}):`);
      this.warnings.forEach(warning => {
        const relativePath = path.relative(process.cwd(), warning.file);
        const fieldInfo = warning.field ? ` (${warning.field})` : '';
        console.log(`  ${relativePath}${fieldInfo}: ${warning.message}`);
      });
    }

    if (this.errors.length > 0) {
      console.log(`\n❌ Errors (${this.errors.length}):`);
      this.errors.forEach(error => {
        const relativePath = path.relative(process.cwd(), error.file);
        const fieldInfo = error.field ? ` (${error.field})` : '';
        console.log(`  ${relativePath}${fieldInfo}: ${error.message}`);
      });
      
      console.log('\n💡 How to fix these errors:');
      console.log('1. Check the content schema in src/_data/content-schemas.json');
      console.log('2. Ensure all required fields are present in frontmatter');
      console.log('3. Use only valid tags: science, policy, tech');
      console.log('4. For work items, use type: "project" or "publication"');
      console.log('5. Ensure image paths point to existing files');
      
      return false;
    }

    if (this.warnings.length === 0 && this.errors.length === 0) {
      console.log('\n✅ All content validation passed!');
    } else if (this.errors.length === 0) {
      console.log('\n✅ Content validation passed with warnings.');
    }

    return true;
  }
}

/**
 * Main validation function
 */
function main() {
  const validator = new ContentValidator();
  
  try {
    validator.validateAllContent();
    const success = validator.printResults();
    
    if (!success) {
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Validation failed:', error.message);
    process.exit(1);
  }
}

// Run validation if called directly
if (require.main === module) {
  main();
}

module.exports = { ContentValidator, main };