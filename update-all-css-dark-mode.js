#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const stylesDir = '/home/milkplusplus/hackriceproject/afya-quest-frontend/src/styles';

// List of CSS files that need dark mode updates
const cssFiles = [
  'DailyReport.css',
  'InteractiveLearning.css',
  'VideoModules.css',
  'MapView.css',
  'Itinerary.css'
];

// Common replacements for dark mode support
const replacements = [
  // Background colors
  { from: /background:\s*white;/g, to: 'background: var(--white);' },
  { from: /background:\s*#[Ff]+;/g, to: 'background: var(--white);' },
  { from: /background:\s*#[Ff]{6};/g, to: 'background: var(--white);' },
  
  // Border colors  
  { from: /border:\s*1px solid #[Ee]0[Ee]0[Ee]0;/g, to: 'border: 1px solid var(--border-color);' },
  { from: /border-top:\s*1px solid #[Ee]0[Ee]0[Ee]0;/g, to: 'border-top: 1px solid var(--border-color);' },
  { from: /border-bottom:\s*1px solid #[Ee]0[Ee]0[Ee]0;/g, to: 'border-bottom: 1px solid var(--border-color);' },
  { from: /border:\s*2px solid #[Ee]0[Ee]0[Ee]0;/g, to: 'border: 2px solid var(--border-color);' },
  
  // Text colors
  { from: /color:\s*#111827;/g, to: 'color: var(--text-primary);' },
  { from: /color:\s*#212121;/g, to: 'color: var(--text-primary);' },
  { from: /color:\s*#374151;/g, to: 'color: var(--text-primary);' },
  { from: /color:\s*#6B7280;/g, to: 'color: var(--text-secondary);' },
  { from: /color:\s*#757575;/g, to: 'color: var(--text-secondary);' },
  
  // Box shadows
  { from: /box-shadow:\s*0 1px 3px rgba\(0,0,0,0\.1\);/g, to: 'box-shadow: var(--box-shadow);' },
  { from: /box-shadow:\s*0 2px 4px rgba\(0,0,0,0\.1\);/g, to: 'box-shadow: var(--box-shadow);' },
  { from: /box-shadow:\s*0 2px 8px rgba\(0,0,0,0\.1\);/g, to: 'box-shadow: var(--box-shadow);' }
];

function updateCSSFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Apply all replacements
    replacements.forEach(replacement => {
      if (replacement.from.test(content)) {
        content = content.replace(replacement.from, replacement.to);
        modified = true;
      }
    });
    
    // Add transition for smooth theme switching to main containers
    if (content.includes('.dashboard') || content.includes('.daily-questions') || 
        content.includes('.interactive-learning') || content.includes('.video-modules') ||
        content.includes('.daily-report') || content.includes('.itinerary') || 
        content.includes('.map-view')) {
      
      const transitionRegex = /(\.[a-z-]+\s*{[^}]*background:[^;}]*;)/g;
      content = content.replace(transitionRegex, (match) => {
        if (!match.includes('transition:')) {
          return match.slice(0, -1) + '\n  transition: background-color 0.3s ease;\n}';
        }
        return match;
      });
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated ${path.basename(filePath)}`);
    } else {
      console.log(`⏭️  No changes needed for ${path.basename(filePath)}`);
    }
    
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

function main() {
  console.log('🌙 Starting comprehensive dark mode CSS updates...\n');
  
  cssFiles.forEach(fileName => {
    const filePath = path.join(stylesDir, fileName);
    updateCSSFile(filePath);
  });
  
  console.log('\n🎉 Dark mode CSS updates completed!');
  console.log('\n📝 Manual steps still needed:');
  console.log('1. Restart the frontend server');
  console.log('2. Test dark mode toggle in Profile → Settings');
  console.log('3. Check all pages for proper dark theme support');
}

if (require.main === module) {
  main();
}

module.exports = { updateCSSFile, replacements };
