const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const indexSrc = path.join(rootDir, 'index.html');
const jsSrc = path.join(rootDir, 'js', 'app.js');
const imgDir = path.join(rootDir, 'images');

const targets = ['public', 'dist', 'build'];

targets.forEach(target => {
  const targetDir = path.join(rootDir, target);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Copy index.html
  if (fs.existsSync(indexSrc)) {
    fs.copyFileSync(indexSrc, path.join(targetDir, 'index.html'));
  }

  // Copy js/app.js
  if (fs.existsSync(jsSrc)) {
    const targetJsDir = path.join(targetDir, 'js');
    if (!fs.existsSync(targetJsDir)) {
      fs.mkdirSync(targetJsDir, { recursive: true });
    }
    fs.copyFileSync(jsSrc, path.join(targetJsDir, 'app.js'));
  }

  // Copy images directory
  if (fs.existsSync(imgDir)) {
    const targetImgDir = path.join(targetDir, 'images');
    if (!fs.existsSync(targetImgDir)) {
      fs.mkdirSync(targetImgDir, { recursive: true });
    }
    const files = fs.readdirSync(imgDir);
    files.forEach(f => {
      fs.copyFileSync(path.join(imgDir, f), path.join(targetImgDir, f));
    });
  }
});

console.log('Build complete! Synced index.html, js, and images across root, public/, dist/, and build/.');
