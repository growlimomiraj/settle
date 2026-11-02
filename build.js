const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const indexSrc = path.join(rootDir, 'index.html');
const jsSrc = path.join(rootDir, 'js', 'app.js');

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
});

console.log('Build complete! Generated static files in root, public/, dist/, and build/.');
