const fs = require('fs');
const path = require('path');

const root = 'C:/Users/Administrator/.gemini/antigravity/scratch/nestmedia-clone';
const pub = path.join(root, 'public');
const assetsDir = path.join(pub, 'assets');

// Create directories
[pub, assetsDir, path.join(pub, 'fonts'), path.join(pub, 'images')].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Copy root html/svg/manifest
const rootFiles = ['index.html', 'favicon.svg', 'og.jpg', 'manifest.json', 'ga.js', 'privacy.html', 'terms.html'];
for (const f of rootFiles) {
  const src = path.join(root, f);
  if (fs.existsSync(src)) {
    const dest = f === 'manifest.json' ? path.join(pub, 'manifest.webmanifest') : path.join(pub, f);
    fs.copyFileSync(src, dest);
    console.log(`Copied ${f} -> ${path.relative(root, dest)}`);
  }
}

// Copy fonts
const fonts = fs.readdirSync(path.join(root, 'fonts'));
for (const f of fonts) {
  fs.copyFileSync(path.join(root, 'fonts', f), path.join(pub, 'fonts', f));
  console.log(`Copied font ${f}`);
}

// Copy images
const images = fs.readdirSync(path.join(root, 'images'));
for (const f of images) {
  fs.copyFileSync(path.join(root, 'images', f), path.join(pub, 'images', f));
  console.log(`Copied image ${f}`);
}

// Copy index css and js to assets/ with their original hashed names
fs.copyFileSync(path.join(root, 'index.css'), path.join(assetsDir, 'index-B3-ik3Si.css'));
fs.copyFileSync(path.join(root, 'index.js'), path.join(assetsDir, 'index-B6ZfsRmH.js'));
console.log("Copied index.css and index.js to assets/");

// Copy all chunks into assets/
const chunks = fs.readdirSync(path.join(root, 'chunks'));
for (const c of chunks) {
  fs.copyFileSync(path.join(root, 'chunks', c), path.join(assetsDir, c));
  console.log(`Copied chunk ${c}`);
}

console.log("Organization complete! Assets in public/");
