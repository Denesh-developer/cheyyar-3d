const fs = require('fs');

const index = fs.readFileSync('C:/Users/Administrator/.gemini/antigravity/scratch/nestmedia-clone/index.js', 'utf8');

console.log("=== Dynamic imports in index.js ===");
const importMatches = [...index.matchAll(/import\s*\(\s*["']([^"']+)["']\s*\)/g)];
const uniqueImports = [...new Set(importMatches.map(m => m[1]))];
console.log(uniqueImports);

console.log("\n=== Object maps with packs ===");
const packSection = index.match(/\{[^{}]*packs\/[^{}]*\}/g);
if (packSection) {
  console.log(packSection);
}

console.log("\n=== Language mappings ===");
const langSection = index.match(/\{[^{}]*(?:ta|ml|kn)[^{}]*\.js[^{}]*\}/g);
if (langSection) {
  console.log(langSection);
}

console.log("\n=== Audio / Sound files ===");
const audioMatches = [...new Set([...index.matchAll(/["']([^"']+\.(?:mp3|ogg|wav))["']/g)].map(m => m[1]))];
console.log(audioMatches);

console.log("\n=== 3D Models / GLB / GLTF ===");
const modelMatches = [...new Set([...index.matchAll(/["']([^"']+\.(?:glb|gltf))["']/g)].map(m => m[1]))];
console.log(modelMatches);

console.log("\n=== Textures / Images ===");
const imgMatches = [...new Set([...index.matchAll(/["']([^"']+\.(?:webp|png|jpg|svg))["']/g)].map(m => m[1]))];
console.log(imgMatches.filter(x => x.startsWith('/') || x.startsWith('assets/')));

console.log("\n=== Bake files / Maps ===");
const bakeMatches = [...new Set([...index.matchAll(/["']([^"']+\.bin)["']/g)].map(m => m[1]))];
console.log(bakeMatches);
