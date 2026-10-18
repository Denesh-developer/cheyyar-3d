const fs = require('fs');

const index = fs.readFileSync('C:/Users/Administrator/.gemini/antigravity/scratch/nestmedia-clone/index.js', 'utf8');

function showContext(pattern, len = 400) {
  const match = index.match(new RegExp(pattern));
  if (match) {
    const idx = match.index;
    console.log(`=== Match for ${pattern} ===`);
    console.log(index.slice(Math.max(0, idx - 100), idx + len));
  } else {
    console.log(`=== No match for ${pattern} ===`);
  }
}

showContext('a=admission');
showContext('a=load');
showContext('"join"', 500);
showContext('"sync"', 500);
