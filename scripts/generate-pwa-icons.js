// Generate PWA icons from source PNG
// Run: node scripts/generate-pwa-icons.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const inputPng = path.join(__dirname, '../public/yana-diia-icon.png');
const outputDir = path.join(__dirname, '../public');

async function generateIcons() {
  console.log('🎨 Generating PWA icons from yana-diia-icon.png...\n');
  
  if (!fs.existsSync(inputPng)) {
    console.error('❌ Source file not found:', inputPng);
    process.exit(1);
  }
  
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}.png`);
    
    try {
      await sharp(inputPng)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated icon-${size}.png`);
    } catch (error) {
      console.error(`❌ Failed to generate ${size}x${size}:`, error.message);
    }
  }
  
  console.log('\n🎉 PWA icons generated successfully!');
}

generateIcons().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
