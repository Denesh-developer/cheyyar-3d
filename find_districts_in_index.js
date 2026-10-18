const fs = require('fs');

const index = fs.readFileSync('public/assets/index-B6ZfsRmH.js', 'utf8');

const target = '"ariyalur"';
const idx = index.indexOf(target);
console.log('Index:', idx);
const startIdx = index.lastIndexOf('[', idx);
console.log('Array starts at:', startIdx);
console.log('Context before array:', index.slice(Math.max(0, startIdx - 80), startIdx));
