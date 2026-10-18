const fs = require('fs');
const index = fs.readFileSync('C:/Users/Administrator/.gemini/antigravity/scratch/nestmedia-clone/index.js', 'utf8');

const regex = /\.post\s*\(\s*["']([a-zA-Z0-9_\-]+)["']/g;
const matches = [...new Set([...index.matchAll(regex)].map(m => m[1]))];
console.log("=== Actions passed to .post() in index.js ===");
console.log(matches);

// Also search in all chunk files
const chunksDir = 'C:/Users/Administrator/.gemini/antigravity/scratch/nestmedia-clone/chunks';
const files = fs.readdirSync(chunksDir);
for (const file of files) {
  if (!file.endsWith('.js')) continue;
  const content = fs.readFileSync(`${chunksDir}/${file}`, 'utf8');
  const m = [...new Set([...content.matchAll(regex)].map(x => x[1]))];
  if (m.length > 0) {
    console.log(`=== Actions in ${file} ===`, m);
  }
}
