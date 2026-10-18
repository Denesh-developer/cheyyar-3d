const fs = require('fs');

const index = fs.readFileSync('public/assets/index-B6ZfsRmH.js', 'utf8');

const target = '"ariyalur"';
const idx = index.indexOf(target);

// Search backwards for =[{ or =[
let assignIdx = -1;
for (let i = idx; i >= 0; i--) {
  if (index[i] === '=' && index[i+1] === '[') {
    assignIdx = i;
    break;
  }
}
console.log('Assignment at:', assignIdx);
console.log('Context:', index.slice(Math.max(0, assignIdx - 50), assignIdx + 40));
