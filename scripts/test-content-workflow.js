#!/usr/bin/env node

/**
 * Content Management Workflow Test Script
 * 
 * This script tests the complete content management workflow to ensure:
 * 1. New content can be added successfully
 * 2. Content validation works properly
 * 3. Filtering integration works automatically
 * 4. Error handling provides clear feedback
 * 5. Content updates work without breaking functionality
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Test content templates
const TEST_EXPERIENCE = `---
title: "Test Experience Entry"
organization: "Test Organization"
dateRange: "2024 - Present"
location: "Test City, State"
tags: ["science", "tech"]
featured: false
status: "current"
---

This is a test experience entry to validate the content management workflow.

Key responsibilities:
- Test content creation and validation
- Verify filtering system integration
- Ensure proper error handling
`;

const TEST_WORK_PROJECT = `---
title: "Test Project Entry"
description: "A test project to validate the content management workflow"
type: "project"
tags: ["tech", "policy"]
collaborators: ["Test Collaborator 1", "Test Collaborator 2"]
technologies: ["JavaScript", "Node.js", "Docker"]
year: 2024
status: "completed"
featured: false
links:
  demo: "https://test-demo.example.com"
  github: "https://github.com/test/test-project"
media:
  screenshot: "/assets/images/test-project-screenshot.jpg"
  alt: "Test project screenshot"
---

This is a test project entry to validate the work item creation workflow.

## Features
- Content validation testing
- Filtering system integration
- Error handling verification
`;

const TEST_WORK_PUBLICATION = `---
title: "Test Publication Entry"
description: "A test publication to validate the content management workflow"
type: "publication"
tags: ["science", "policy"]
collaborators: ["Dr. Test Author", "Prof. Test Coauthor"]
journal: "Test Journal of Content Management"
year: 2024
status: "published"
featured: false
links:
  doi: "https://doi.org/10.1000/test.2024.123456"
  external: "https://test-journal.example.com/article/123"
media:
  tocImage: "/assets/images/test-publication-toc.jpg"
  alt: "Test publication table of contents"
---

This is a test publication entry to validate the publication workflow.

## Abstract
This paper describes the testing methodology for content management workflows
in static site generators with validation systems.
`;

const INVALID_CONTENT = `---
title: "Invalid Test Entry"
# Missing required fields: organization, dateRange, tags
location: "Test City"
tags: ["invalid-tag"]  # Invalid tag
featured: "not-a-boolean"  # Wrong type
---

This content has validation errors for testing error handling.
`;

class ContentWorkflowTester {
  constructor() {
    this.testFiles = [];
    this.errors = [];
    this.successes = [];
  }

  /**
   * Run all workflow tests
   */
  async runAllTests() {
    console.log('🧪 Starting Content Management Workflow Tests\n');

    try {
      // Test 1: Validate current content
      await this.testCurrentContentValidation();

      // Test 2: Add new experience entry
      await this.testAddNewExperience();

      // Test 3: Add new work items (project and publication)
      await this.testAddNewWorkItems();

      // Test 4: Test error handling with invalid content
      await this.testErrorHandling();

      // Test 5: Test content updates
      await this.testContentUpdates();

      // Test 6: Verify filtering integration
      await this.testFilteringIntegration();

      // Clean up test files
      await this.cleanup();

      // Print results
      this.printResults();

    } catch (error) {
      console.error('❌ Test suite failed:', error.message);
      await this.cleanup();
      process.exit(1);
    }
  }

  /**
   * Test current content validation
   */
  async testCurrentContentValidation() {
    console.log('1️⃣ Testing current content validation...');
    
    try {
      execSync('npm run validate', { stdio: 'pipe' });
      this.addSuccess('Current content validation passed');
    } catch (error) {
      // Check if it's just warnings (exit code 0) or actual errors
      if (error.status === 0) {
        this.addSuccess('Current content validation passed with warnings');
      } else {
        throw new Error('Current content validation failed');
      }
    }
  }

  /**
   * Test adding new experience entry
   */
  async testAddNewExperience() {
    console.log('2️⃣ Testing new experience entry creation...');
    
    const testFile = 'src/content/experience/test-workflow-experience.md';
    this.testFiles.push(testFile);
    
    // Create test file
    fs.writeFileSync(testFile, TEST_EXPERIENCE);
    
    // Validate
    try {
      execSync('npm run validate', { stdio: 'pipe' });
      this.addSuccess('New experience entry validated successfully');
    } catch (error) {
      if (error.status === 0) {
        this.addSuccess('New experience entry validated with warnings');
      } else {
        throw new Error('New experience entry validation failed');
      }
    }
    
    // Build
    try {
      execSync('npm run build', { stdio: 'pipe' });
      this.addSuccess('New experience entry built successfully');
    } catch (error) {
      throw new Error('New experience entry build failed');
    }
  }

  /**
   * Test adding new work items
   */
  async testAddNewWorkItems() {
    console.log('3️⃣ Testing new work item creation...');
    
    const projectFile = 'src/content/work/test-workflow-project.md';
    const publicationFile = 'src/content/work/test-workflow-publication.md';
    this.testFiles.push(projectFile, publicationFile);
    
    // Create test files
    fs.writeFileSync(projectFile, TEST_WORK_PROJECT);
    fs.writeFileSync(publicationFile, TEST_WORK_PUBLICATION);
    
    // Validate
    try {
      execSync('npm run validate', { stdio: 'pipe' });
      this.addSuccess('New work items validated successfully');
    } catch (error) {
      if (error.status === 0) {
        this.addSuccess('New work items validated with warnings');
      } else {
        throw new Error('New work items validation failed');
      }
    }
    
    // Build
    try {
      execSync('npm run build', { stdio: 'pipe' });
      this.addSuccess('New work items built successfully');
    } catch (error) {
      throw new Error('New work items build failed');
    }
  }

  /**
   * Test error handling with invalid content
   */
  async testErrorHandling() {
    console.log('4️⃣ Testing error handling...');
    
    const invalidFile = 'src/content/experience/test-invalid-content.md';
    this.testFiles.push(invalidFile);
    
    // Create invalid file
    fs.writeFileSync(invalidFile, INVALID_CONTENT);
    
    // Validation should fail
    try {
      execSync('npm run validate', { stdio: 'pipe' });
      throw new Error('Validation should have failed for invalid content');
    } catch (error) {
      if (error.status !== 0) {
        this.addSuccess('Error handling works - validation correctly failed for invalid content');
      } else {
        throw new Error('Validation should have failed but passed');
      }
    }
    
    // Build should also fail
    try {
      execSync('npm run build', { stdio: 'pipe' });
      throw new Error('Build should have failed for invalid content');
    } catch (error) {
      if (error.status !== 0) {
        this.addSuccess('Error handling works - build correctly failed for invalid content');
      } else {
        throw new Error('Build should have failed but passed');
      }
    }
    
    // Remove invalid file
    fs.unlinkSync(invalidFile);
    this.testFiles = this.testFiles.filter(f => f !== invalidFile);
  }

  /**
   * Test content updates
   */
  async testContentUpdates() {
    console.log('5️⃣ Testing content updates...');
    
    const testFile = 'src/content/experience/test-workflow-experience.md';
    
    // Update the test file
    const updatedContent = TEST_EXPERIENCE.replace(
      'tags: ["science", "tech"]',
      'tags: ["science", "tech", "policy"]'
    ).replace(
      'This is a test experience entry',
      'This is an UPDATED test experience entry'
    );
    
    fs.writeFileSync(testFile, updatedContent);
    
    // Validate updated content
    try {
      execSync('npm run validate', { stdio: 'pipe' });
      this.addSuccess('Content update validated successfully');
    } catch (error) {
      if (error.status === 0) {
        this.addSuccess('Content update validated with warnings');
      } else {
        throw new Error('Content update validation failed');
      }
    }
    
    // Build updated content
    try {
      execSync('npm run build', { stdio: 'pipe' });
      this.addSuccess('Content update built successfully');
    } catch (error) {
      throw new Error('Content update build failed');
    }
  }

  /**
   * Test filtering integration
   */
  async testFilteringIntegration() {
    console.log('6️⃣ Testing filtering system integration...');
    
    // Check if test content appears in built site
    const indexPath = '_site/index.html';
    if (!fs.existsSync(indexPath)) {
      throw new Error('Built site index.html not found');
    }
    
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Check for test content
    if (indexContent.includes('Test Experience Entry')) {
      this.addSuccess('Test experience entry appears in built site');
    } else {
      throw new Error('Test experience entry not found in built site');
    }
    
    if (indexContent.includes('Test Project Entry')) {
      this.addSuccess('Test project entry appears in built site');
    } else {
      throw new Error('Test project entry not found in built site');
    }
    
    if (indexContent.includes('Test Publication Entry')) {
      this.addSuccess('Test publication entry appears in built site');
    } else {
      throw new Error('Test publication entry not found in built site');
    }
    
    // Check for proper data attributes for filtering
    if (indexContent.includes('data-tags="science,tech,policy"')) {
      this.addSuccess('Filtering tags correctly applied to updated content');
    } else {
      throw new Error('Filtering tags not properly applied');
    }
  }

  /**
   * Clean up test files
   */
  async cleanup() {
    console.log('🧹 Cleaning up test files...');
    
    this.testFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
    
    // Rebuild without test files
    try {
      execSync('npm run build', { stdio: 'pipe' });
      console.log('✅ Cleanup completed and site rebuilt');
    } catch (error) {
      console.log('⚠ Cleanup completed but rebuild failed');
    }
  }

  /**
   * Add success message
   */
  addSuccess(message) {
    this.successes.push(message);
    console.log(`  ✅ ${message}`);
  }

  /**
   * Add error message
   */
  addError(message) {
    this.errors.push(message);
    console.log(`  ❌ ${message}`);
  }

  /**
   * Print final results
   */
  printResults() {
    console.log('\n📊 Content Management Workflow Test Results:');
    console.log(`✅ Successes: ${this.successes.length}`);
    console.log(`❌ Errors: ${this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      this.errors.forEach(error => console.log(`  - ${error}`));
      process.exit(1);
    } else {
      console.log('\n🎉 All content management workflow tests passed!');
      console.log('\n✅ Content Management Workflow Validation Complete:');
      console.log('  • New experience entries can be added through markdown');
      console.log('  • Work item creation works for both projects and publications');
      console.log('  • Content validation catches errors and provides clear feedback');
      console.log('  • Content updates work without breaking functionality');
      console.log('  • Filtering system automatically integrates new content');
      console.log('  • Error handling prevents builds with invalid content');
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new ContentWorkflowTester();
  tester.runAllTests().catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = { ContentWorkflowTester };