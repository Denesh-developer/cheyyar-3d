const fs = require('fs');
const index = fs.readFileSync('C:/Users/Administrator/.gemini/antigravity/scratch/nestmedia-clone/index.js', 'utf8');

const regex = /`\$\{vs\.api\}[^`]+`/g;
const matches = [...new Set(index.match(regex) || [])];
console.log("=== All vs.api endpoints in index.js ===");
matches.forEach(m => console.log(m));

// Also check lobby, mate, theater, etc.
const chunksDir = 'C:/Users/Administrator/.gemini/antigravity/scratch/nestmedia-clone/chunks';
const files = fs.readdirSync(chunksDir);
for (const file of files) {
  if (!file.endsWith('.js')) continue;
  const content = fs.readFileSync(`${chunksDir}/${file}`, 'utf8');
  const m = [...new Set(content.match(regex) || [])];
  if (m.length > 0) {
    console.log(`=== In chunk ${file} ===`);
    m.forEach(x => console.log(x));
  }
}
