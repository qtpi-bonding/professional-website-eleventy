module.exports = function(eleventyConfig) {
  // Copy static assets with optimization-friendly structure
  eleventyConfig.addPassthroughCopy({
    "src/assets/images": "assets/images",
    "src/assets/js": "assets/js",
    "src/static": "static"
  });
  
  // Add base URL filter for proper asset paths
  eleventyConfig.addFilter("url", function(url) {
    const environment = this.ctx.environment || {};
    const baseUrl = environment.baseUrl || '/';
    
    if (!url) return baseUrl;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    
    // Ensure proper path joining
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    
    return `${cleanBase}${cleanUrl}`;
  });
  
  // Add cache busting for CSS and JS files in production
  if (process.env.NODE_ENV === 'production') {
    const timestamp = Date.now();
    eleventyConfig.addGlobalData("cacheBuster", timestamp);
  } else {
    eleventyConfig.addGlobalData("cacheBuster", "dev");
  }
  
  // Watch for changes in CSS files
  eleventyConfig.addWatchTarget("src/assets/css/");
  
  // Load content schemas for validation
  const contentSchemas = require('./src/_data/content-schemas.json');
  const VALID_TAGS = contentSchemas.validation.tags.validValues;
  const VALID_WORK_TYPES = contentSchemas.validation.workTypes.validValues;
  
  // Enhanced content validation function with better error messages
  function validateContent(item, type) {
    // Only validate frontmatter data, not Eleventy-injected data
    const frontmatterData = {};
    const data = item.data;
    const filePath = item.inputPath;
    
    // Extract only frontmatter fields (exclude Eleventy system fields)
    const systemFields = ['page', 'collections', 'eleventy', 'pkg', 'cacheBuster', 'environment'];
    const dataFields = Object.keys(contentSchemas).reduce((acc, key) => {
      if (contentSchemas[key].fields) {
        acc.push(...Object.keys(contentSchemas[key].fields));
      }
      return acc;
    }, []);
    
    // Copy only known content fields to avoid validating system data
    Object.keys(data).forEach(key => {
      if (!systemFields.includes(key) && !key.startsWith('app-') && !key.startsWith('component-') && !key.startsWith('content-') && !key.startsWith('navigation') && !key.startsWith('site') && !key.startsWith('validation-')) {
        frontmatterData[key] = data[key];
      }
    });
    
    const errors = [];
    const warnings = [];
    
    // Get schema for this content type
    const schema = contentSchemas[type];
    if (!schema) {
      errors.push(`Unknown content type: ${type}`);
    } else {
      // Required fields validation
      schema.required.forEach(field => {
        if (frontmatterData[field] === undefined || frontmatterData[field] === null || frontmatterData[field] === '') {
          errors.push(`Missing required field: ${field}`);
        }
      });
      
      // Field type validation
      Object.keys(frontmatterData).forEach(fieldName => {
        const fieldValue = frontmatterData[fieldName];
        const fieldDef = schema.fields[fieldName];
        
        if (!fieldDef) {
          warnings.push(`Unknown field: ${fieldName} (not in schema)`);
          return;
        }
        
        // Type validation
        switch (fieldDef.type) {
          case 'string':
            if (typeof fieldValue !== 'string') {
              errors.push(`Field ${fieldName} must be a string, got ${typeof fieldValue}`);
            }
            break;
          case 'number':
            if (typeof fieldValue !== 'number') {
              errors.push(`Field ${fieldName} must be a number, got ${typeof fieldValue}`);
            }
            break;
          case 'boolean':
            if (typeof fieldValue !== 'boolean') {
              errors.push(`Field ${fieldName} must be a boolean, got ${typeof fieldValue}`);
            }
            break;
          case 'array':
            if (!Array.isArray(fieldValue)) {
              errors.push(`Field ${fieldName} must be an array, got ${typeof fieldValue}`);
            }
            break;
          case 'object':
            if (typeof fieldValue !== 'object' || Array.isArray(fieldValue)) {
              errors.push(`Field ${fieldName} must be an object, got ${typeof fieldValue}`);
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
                errors.push(`Field ${fieldName} contains invalid values: ${invalidValues.join(', ')}. Valid values are: ${fieldDef.validValues.join(', ')}`);
              }
            }
          } else {
            // For non-arrays, check the value directly
            if (!fieldDef.validValues.includes(fieldValue)) {
              errors.push(`Field ${fieldName} has invalid value: ${fieldValue}. Valid values are: ${fieldDef.validValues.join(', ')}`);
            }
          }
        }
      });
    }
    
    // Tag validation
    if (frontmatterData.tags) {
      if (!Array.isArray(frontmatterData.tags)) {
        errors.push(`Tags must be an array, got ${typeof frontmatterData.tags}: ${frontmatterData.tags}`);
      } else {
        if (frontmatterData.tags.length === 0) {
          errors.push("At least one tag is required");
        }
        
        const invalidTags = frontmatterData.tags.filter(tag => !VALID_TAGS.includes(tag));
        if (invalidTags.length > 0) {
          errors.push(`Invalid tags: ${invalidTags.join(", ")}. Valid tags are: ${VALID_TAGS.join(", ")}`);
        }
        
        // Check for duplicate tags
        const uniqueTags = [...new Set(frontmatterData.tags)];
        if (uniqueTags.length !== frontmatterData.tags.length) {
          warnings.push('Duplicate tags found');
        }
      }
    }
    
    // Work item specific validation
    if (type === "work") {
      if (!frontmatterData.type) {
        errors.push("Work type is required");
      } else if (!VALID_WORK_TYPES.includes(frontmatterData.type)) {
        errors.push(`Invalid work type: ${frontmatterData.type}. Valid types are: ${VALID_WORK_TYPES.join(", ")}`);
      }
      
      // Type-specific field validation
      if (frontmatterData.type === "project" && frontmatterData.journal) {
        warnings.push("Journal field is typically used for publications, not projects");
      }
      if (frontmatterData.type === "publication" && frontmatterData.technologies) {
        warnings.push("Technologies field is typically used for projects, not publications");
      }
    }
    
    // Image path validation
    if (frontmatterData.media) {
      ['screenshot', 'tocImage'].forEach(imageField => {
        if (frontmatterData.media[imageField]) {
          const imagePath = frontmatterData.media[imageField];
          // Basic path validation - more thorough validation in separate script
          if (!imagePath.startsWith('/') && !imagePath.startsWith('assets/') && !imagePath.startsWith('static/')) {
            warnings.push(`Image path ${imageField} should start with /, assets/, or static/: ${imagePath}`);
          }
        }
      });
    }
    
    // Print warnings
    if (warnings.length > 0) {
      console.warn(`⚠ Warnings in ${filePath}:`);
      warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
    
    // Handle errors
    if (errors.length > 0) {
      console.error(`\n❌ Validation errors in ${filePath}:`);
      errors.forEach(error => console.error(`  - ${error}`));
      console.error(`\n💡 How to fix:`);
      console.error(`  1. Check the content schema in src/_data/content-schemas.json`);
      console.error(`  2. Ensure all required fields are present: ${schema ? schema.required.join(', ') : 'see schema'}`);
      console.error(`  3. Use only valid tags: ${VALID_TAGS.join(', ')}`);
      if (type === 'work') {
        console.error(`  4. Use valid work type: ${VALID_WORK_TYPES.join(', ')}`);
      }
      console.error(`  5. Run 'npm run validate' for detailed validation\n`);
      
      throw new Error(`Content validation failed for ${filePath}`);
    }
  }
  
  // Collections for content organization with validation
  eleventyConfig.addCollection("experience", function(collectionApi) {
    const items = collectionApi.getFilteredByGlob("src/content/experience/*.md");
    items.forEach(item => validateContent(item, "experience"));
    return items.sort((a, b) => {
      // Sort by featured first, then by date
      if (a.data.featured && !b.data.featured) return -1;
      if (!a.data.featured && b.data.featured) return 1;
      return new Date(b.date) - new Date(a.date);
    });
  });
  
  eleventyConfig.addCollection("work", function(collectionApi) {
    const items = collectionApi.getFilteredByGlob("src/content/work/*.md");
    items.forEach(item => validateContent(item, "work"));
    return items.sort((a, b) => {
      // Sort by featured first, then by year (descending)
      if (a.data.featured && !b.data.featured) return -1;
      if (!a.data.featured && b.data.featured) return 1;
      return (b.data.year || 0) - (a.data.year || 0);
    });
  });
  
  // Filter for filtering content by tags
  eleventyConfig.addFilter("filterByTag", function(collection, tag) {
    if (!tag || tag === "all") return collection;
    return collection.filter(item => {
      const tags = item.data.tags || [];
      return tags.includes(tag);
    });
  });
  
  // Filter for getting unique tags
  eleventyConfig.addFilter("getAllTags", function(collection) {
    const tagSet = new Set();
    collection.forEach(item => {
      const tags = item.data.tags || [];
      tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  });
  
  // Filter for filtering work items by type
  eleventyConfig.addFilter("filterByType", function(collection, type) {
    return collection.filter(item => item.data.type === type);
  });
  
  // Filter for getting featured items
  eleventyConfig.addFilter("getFeatured", function(collection) {
    return collection.filter(item => item.data.featured === true);
  });
  
  // Filter for safe external links
  eleventyConfig.addFilter("safeExternalLink", function(url) {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return `${url}" target="_blank" rel="noopener noreferrer`;
    }
    return url;
  });
  
  // Date formatting filter
  eleventyConfig.addFilter("dateFormat", function(date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  });
  
  // Current year filter
  eleventyConfig.addFilter("currentYear", function() {
    return new Date().getFullYear();
  });
  
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};