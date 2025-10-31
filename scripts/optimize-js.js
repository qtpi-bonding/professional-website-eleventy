#!/usr/bin/env node

const { minify } = require('terser');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function findJSFiles(dir) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const items = await readdir(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stats = await stat(fullPath);
    
    if (stats.isDirectory()) {
      const subFiles = await findJSFiles(fullPath);
      files.push(...subFiles);
    } else if (path.extname(item) === '.js') {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function optimizeJS() {
  const jsDir = '_site/assets/js';
  
  try {
    console.log('Optimizing JavaScript files...');
    
    const jsFiles = await findJSFiles(jsDir);
    
    if (jsFiles.length === 0) {
      console.log('No JavaScript files found, skipping JS optimization');
      return;
    }
    
    let optimizedCount = 0;
    
    for (const filePath of jsFiles) {
      try {
        const code = await readFile(filePath, 'utf8');
        
        const result = await minify(code, {
          compress: {
            // Don't drop console statements as they may be part of control flow
            drop_console: false,
            drop_debugger: true,
            // Don't treat console functions as pure to avoid breaking logic
            pure_funcs: []
          },
          mangle: {
            // Don't mangle top-level names to avoid conflicts
            toplevel: false,
            // Reserve important class names to prevent conflicts
            reserved: ['SimpleSidebarManager', 'ThemeSystem', 'ContentFilter', 'NavigationSystem']
          },
          format: {
            comments: false
          }
        });
        
        if (result.code) {
          await writeFile(filePath, result.code);
          optimizedCount++;
          console.log(`✓ Optimized ${path.relative('_site', filePath)}`);
        }
        
      } catch (error) {
        console.warn(`Warning: Could not optimize ${filePath}:`, error.message);
      }
    }
    
    console.log(`✓ Optimized ${optimizedCount} JavaScript files`);
    
  } catch (error) {
    console.error('Error optimizing JavaScript:', error);
    process.exit(1);
  }
}

// Run optimization
optimizeJS();