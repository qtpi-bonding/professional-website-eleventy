#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Check if imagemin dependencies are available
let imagemin, imageminMozjpeg, imageminPngquant, imageminSvgo, imageminWebp;
let dependenciesAvailable = true;

try {
  imagemin = require('imagemin');
  imageminMozjpeg = require('imagemin-mozjpeg');
  imageminPngquant = require('imagemin-pngquant');
  imageminSvgo = require('imagemin-svgo');
  imageminWebp = require('imagemin-webp');
} catch (error) {
  dependenciesAvailable = false;
}

async function optimizeImages() {
  const inputDir = '_site/assets/images';
  const outputDir = '_site/assets/images';
  
  // Check if dependencies are available
  if (!dependenciesAvailable) {
    console.log('⚠ Image optimization dependencies not installed, skipping optimization');
    console.log('  To enable image optimization, install: npm install imagemin imagemin-mozjpeg imagemin-pngquant imagemin-svgo imagemin-webp');
    return;
  }
  
  // Check if images directory exists
  if (!fs.existsSync(inputDir)) {
    console.log('No images directory found, skipping image optimization');
    return;
  }
  
  try {
    console.log('Optimizing images...');
    
    // Optimize JPEG images
    await imagemin([`${inputDir}/**/*.{jpg,jpeg}`], {
      destination: outputDir,
      plugins: [
        imageminMozjpeg({
          quality: 85,
          progressive: true
        })
      ]
    });
    
    // Optimize PNG images
    await imagemin([`${inputDir}/**/*.png`], {
      destination: outputDir,
      plugins: [
        imageminPngquant({
          quality: [0.6, 0.8]
        })
      ]
    });
    
    // Optimize SVG images
    await imagemin([`${inputDir}/**/*.svg`], {
      destination: outputDir,
      plugins: [
        imageminSvgo({
          plugins: [
            {
              name: 'removeViewBox',
              active: false
            },
            {
              name: 'addAttributesToSVGElement',
              params: {
                attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }]
              }
            }
          ]
        })
      ]
    });
    
    // Generate WebP versions for better performance
    const imageFiles = await imagemin([`${inputDir}/**/*.{jpg,jpeg,png}`], {
      destination: `${outputDir}/webp`,
      plugins: [
        imageminWebp({
          quality: 80
        })
      ]
    });
    
    console.log(`✓ Optimized ${imageFiles.length} images`);
    
  } catch (error) {
    console.error('Error optimizing images:', error);
    process.exit(1);
  }
}

// Run optimization
optimizeImages();