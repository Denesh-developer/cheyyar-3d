const fs = require('fs');

const tn = fs.readFileSync('chunks/tn-CXBv6geO.js', 'utf8');

// Find landmarks definition
const lmMatch = tn.match(/const\s+([a-zA-Z0-9_]+)\s*=\s*\[\{"id":"[a-zA-Z0-9_\-]+","name":/);
console.log('Landmarks match:', lmMatch ? lmMatch[0].slice(0, 100) : 'none');

// Find a single landmark object
const sampleLm = tn.match(/\{"id":"[^"]+","name":"[^"]+","ta":"[^"]+","district":"[^"]+","type":"[^"]+","blurb":"[^"]*","x":-?[0-9\.]+,"z":-?[0-9\.]+\}/);
if (sampleLm) console.log('Sample landmark:', sampleLm[0]);

// Find a single district object
const sampleDist = tn.match(/\{"id":"[^"]+","name":"[^"]+","ta":"[^"]+","centre":\[-?[0-9\.]+,-?[0-9\.]+\],"st":"[^"]+","rings":\[\[\[[^\]]+\]\]\]\}/);
if (sampleDist) console.log('Sample district:', sampleDist[0].slice(0, 200));

// Find a single item
const sampleItem = tn.match(/\{"id":"[^"]+","type":"[^"]+","x":-?[0-9\.]+,"z":-?[0-9\.]+,"pts":[0-9]+\}/);
if (sampleItem) console.log('Sample item:', sampleItem[0]);

// Find a single stall
const sampleStall = tn.match(/\{"id":"[^"]+","name":"[^"]+","type":"[^"]+","x":-?[0-9\.]+,"z":-?[0-9\.]+[^\}]*\}/);
if (sampleStall) console.log('Sample stall:', sampleStall[0]);
