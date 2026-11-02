const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const targets = ['public', 'dist', 'build'];

// Helper to copy directory recursively
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Skip build target directories and git
      if (['public', 'dist', 'build', '.git', 'node_modules'].includes(entry.name)) continue;
      copyDirSync(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Top-level files to copy
const topFiles = ['index.html', '404.html', 'package.json', 'vercel.json', 'README.md'];

// Top-level directories to copy
const subDirs = [
  'css', 'fonts', 'images', 'js',
  'booking', 'services', 'our-fleet', 'fleet', 'locations',
  'about-us', 'about', 'contact', 'contact-us', 'faq',
  'rates', 'reviews', 'blog', 'blogs', 'corporate-partners',
  'gallery', 'drive-for-us', 'contract-of-carriage',
  'terms-conditions-privacy-policy', 'liability-disclaimer',
  'privacy-policy', 'terms-and-conditions'
];

targets.forEach(target => {
  const targetDir = path.join(rootDir, target);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Copy top-level files
  topFiles.forEach(file => {
    const srcFile = path.join(rootDir, file);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, path.join(targetDir, file));
    }
  });

  // Copy directories
  subDirs.forEach(dir => {
    const srcSubDir = path.join(rootDir, dir);
    const destSubDir = path.join(targetDir, dir);
    if (fs.existsSync(srcSubDir)) {
      copyDirSync(srcSubDir, destSubDir);
    }
  });

  console.log(`Synced assets and pages to ${target}/`);
});

console.log('Build complete! All assets and subpages synced across root, public/, dist/, and build/.');
