const fs = require('fs');

const allFiles = ['index.html', 'index.css', 'index.js', 'manifest.json'];
const chunksDir = 'C:/Users/Administrator/.gemini/antigravity/scratch/nestmedia-clone/chunks';
const chunkFiles = fs.readdirSync(chunksDir);

const foundAssets = new Set();

function scan(content) {
  const matches = content.matchAll(/["'](\/[a-zA-Z0-9_\-\.\/]+\.(?:png|jpg|jpeg|webp|svg|woff2|woff|ttf|mp3|ogg|wav|json|bin))["']/g);
  for (const m of matches) {
    foundAssets.add(m[1]);
  }
}

for (const f of allFiles) {
  scan(fs.readFileSync(`C:/Users/Administrator/.gemini/antigravity/scratch/nestmedia-clone/${f}`, 'utf8'));
}

for (const f of chunkFiles) {
  scan(fs.readFileSync(`${chunksDir}/${f}`, 'utf8'));
}

console.log("=== Found Static Asset Paths ===");
console.log([...foundAssets].sort());
