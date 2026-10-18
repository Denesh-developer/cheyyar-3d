const fs = require("fs");
const orig = fs.readFileSync("index.js", "utf8");

console.log("has talkies 1:", orig.includes("const i=`${t.toUpperCase()} TALKIES`"));
console.log("has talkies 2:", orig.includes("WELCOME · ${n.toUpperCase()} TALKIES"));
console.log("has Qw:", orig.includes('Qw={tn:{en:"Tamil Nadu",ta:"தமிழ்நாடு"}'));
