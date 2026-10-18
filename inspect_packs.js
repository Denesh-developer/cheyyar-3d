const fs = require('fs');

const core = fs.readFileSync('C:/Users/Administrator/.gemini/antigravity/scratch/nestmedia-clone/chunks/core-CnkT7A_l.js', 'utf8');
console.log("=== core.js snippet ===");
console.log(core.slice(0, 1000));

const tn = fs.readFileSync('C:/Users/Administrator/.gemini/antigravity/scratch/nestmedia-clone/chunks/tn-CXBv6geO.js', 'utf8');
console.log("\n=== tn.js snippet ===");
console.log(tn.slice(0, 1000));
