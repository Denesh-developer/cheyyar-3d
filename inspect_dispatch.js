const fs = require('fs');
const index = fs.readFileSync('C:/Users/Administrator/.gemini/antigravity/scratch/nestmedia-clone/index.js', 'utf8');

const target = '`${vs.api}?a=${t}`';
const idx = index.indexOf(target);
if (idx !== -1) {
  console.log(index.slice(Math.max(0, idx - 300), idx + 300));
}
