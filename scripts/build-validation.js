#!/usr/bin/env node

/**
 * Build Validation Script
 * 
 * This script runs during the build process to validate content and configuration.
 * It provides clear error messages and guidance for content authors.
 */

const fs = require('fs');
const path = require('path');
const { ContentValidator } = require('./validate-content');

// Load validation configuration
const validationConfig = require('../src/_data/validation-config.json').validation;

class BuildValidator extends ContentValidator {
  constructor() {
    super();
    this.config = validationConfig;
  }

  /**
   * Run pre-build validation
   */
  async runPreBuildValidation() {
    console.log('🔍 Running pre-build validation...\n');

    if (!this.config.enabled) {
      console.log('⚠ Content validation is disabled');
      return true;
    }

    // Validate content files
    this.validateAllContent();

    // Validate configuration files
    this.validateConfiguration();

    // Check for common issues
    this.checkCommonIssues();

    return this.handleResults();
  }

  /**
   * Validate configuration files
   */
  validateConfiguration() {
    console.log('Validating configuration files:');

    const configFiles = [
      'src/_data/site.json',
      'src/_data/app-theme.json',
      'src/_data/component-variants.json',
      'src/_data/navigation.json',
      'src/_data/content-schemas.json'
    ];

    configFiles.forEach(configFile => {
      try {
        if (fs.existsSync(configFile)) {
          const content = fs.readFileSync(configFile, 'utf8');
          JSON.parse(content); // Validate JSON syntax
          console.log(`✓ ${configFile}`);
        } else {
          this.addWarning(`Configuration file not found: ${configFile}`, configFile);
        }
      } catch (error) {
        this.errors.push({
          message: `Invalid JSON in configuration file: ${error.message}`,
          file: configFile,
          field: null
        });
      }
    });

    console.log('');
  }

  /**
   * Check for common issues
   */
  checkCommonIssues() {
    console.log('Checking for common issues:');

    // Check if required directories exist
    const requiredDirs = [
      'src/content/experience',
      'src/content/work',
      'src/assets/images',
      'src/static'
    ];

    requiredDirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        this.addWarning(`Required directory not found: ${dir}`, dir);
      } else {
        console.log(`✓ ${dir}`);
      }
    });

    // Check if there's at least some content
    const experienceFiles = fs.existsSync('src/content/experience') 
      ? fs.readdirSync('src/content/experience').filter(f => f.endsWith('.md')).length 
      : 0;
    const workFiles = fs.existsSync('src/content/work') 
      ? fs.readdirSync('src/content/work').filter(f => f.endsWith('.md')).length 
      : 0;

    if (experienceFiles === 0 && workFiles === 0) {
      this.addWarning('No content files found. Add some experience or work entries.', 'content');
    } else {
      console.log(`✓ Found ${experienceFiles} experience entries and ${workFiles} work items`);
    }

    console.log('');
  }

  /**
   * Handle validation results
   */
  handleResults() {
    const hasErrors = this.errors.length > 0;
    const hasWarnings = this.warnings.length > 0;

    if (hasErrors) {
      console.log(`\n❌ Build validation failed with ${this.errors.length} error(s):`);
      this.errors.forEach((error, index) => {
        const relativePath = path.relative(process.cwd(), error.file);
        const fieldInfo = error.field ? ` (${error.field})` : '';
        console.log(`\n${index + 1}. ${relativePath}${fieldInfo}:`);
        console.log(`   ${error.message}`);
      });

      this.printHelpMessages();
      return false;
    }

    if (hasWarnings) {
      console.log(`\n⚠ Build validation passed with ${this.warnings.length} warning(s):`);
      this.warnings.forEach((warning, index) => {
        const relativePath = path.relative(process.cwd(), warning.file);
        const fieldInfo = warning.field ? ` (${warning.field})` : '';
        console.log(`${index + 1}. ${relativePath}${fieldInfo}: ${warning.message}`);
      });

      if (this.config.failOnWarnings) {
        console.log('\n❌ Build configured to fail on warnings');
        return false;
      }
    }

    if (!hasErrors && !hasWarnings) {
      console.log('\n✅ All build validation checks passed!');
    } else {
      console.log('\n✅ Build validation passed (warnings can be addressed later)');
    }

    return true;
  }

  /**
   * Print helpful messages for fixing errors
   */
  printHelpMessages() {
    console.log('\n💡 How to fix validation errors:\n');

    const helpMessages = this.config.helpMessages;

    console.log('General Guidelines:');
    helpMessages.general.forEach(msg => console.log(`  • ${msg}`));

    console.log('\nTag Guidelines:');
    helpMessages.tags.forEach(msg => console.log(`  • ${msg}`));

    console.log('\nWork Type Guidelines:');
    helpMessages.workTypes.forEach(msg => console.log(`  • ${msg}`));

    console.log('\nImage Guidelines:');
    helpMessages.images.forEach(msg => console.log(`  • ${msg}`));

    console.log('\nQuick Commands:');
    console.log('  • npm run validate        - Run detailed content validation');
    console.log('  • npm run validate:fix    - Get help fixing validation errors');
    console.log('  • npm run build           - Run full build with validation');

    console.log('\nFor more help, check:');
    console.log('  • Content schema: src/_data/content-schemas.json');
    console.log('  • Validation config: src/_data/validation-config.json');
    console.log('  • Sample content files in src/content/');
  }
}

/**
 * Main function
 */
async function main() {
  const validator = new BuildValidator();
  
  try {
    const success = await validator.runPreBuildValidation();
    
    if (!success) {
      console.log('\n🚫 Build stopped due to validation errors.');
      console.log('Fix the errors above and run the build again.');
      process.exit(1);
    }
    
    console.log('✅ Pre-build validation completed successfully');
  } catch (error) {
    console.error('\n❌ Build validation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { BuildValidator, main };