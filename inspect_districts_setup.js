const fs = require('fs');

const index = fs.readFileSync('public/assets/index-B6ZfsRmH.js', 'utf8');

const start = 612050;
console.log('Snippet 612050-613500:');
console.log(index.slice(start, start + 800));

// find where ji is initialized
const jiIdx = index.indexOf('ji=');
console.log('\nji= snippet:');
console.log(index.slice(jiIdx, jiIdx + 300));
