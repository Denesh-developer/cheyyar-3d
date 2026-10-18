const fs = require('fs');
const path = require('path');

const chunksDir = 'C:/Users/Administrator/.gemini/antigravity/scratch/nestmedia-clone/chunks';
const files = fs.readdirSync(chunksDir);

for (const file of files) {
  if (!file.endsWith('.js')) continue;
  const content = fs.readFileSync(path.join(chunksDir, file), 'utf8');
  console.log(`\n=== CHUNK: ${file} (${content.length} chars) ===`);
  
  // Find exports
  const exportMatches = content.match(/export\s*\{[^}]+\}/g);
  if (exportMatches) {
    console.log("  Exports:", exportMatches[0].slice(0, 200));
  }
  
  // Find strings like URLs, endpoints, or keys
  const keys = [...new Set([...content.matchAll(/"([a-zA-Z0-9_\-\.]+)"\s*:/g)].map(m => m[1]))];
  console.log("  Top keys:", keys.slice(0, 15).join(', '));

  // Find any urls or fetches
  const urls = [...new Set([...content.matchAll(/["'](https?:\/\/[^"']+|\/api\/[^"']+|\/bake\/[^"']+)["']/g)].map(m => m[1]))];
  if (urls.length > 0) {
    console.log("  URLs/APIs:", urls.slice(0, 10).join(', '));
  }
}
