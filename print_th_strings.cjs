const fs = require("fs");
const code = fs.readFileSync("public/assets/index-B6ZfsRmH.js", "utf8");

// Search for where theater name in Tamil is defined
let pos = 1530000;
let end = 1550000;
console.log("Theater strings between 1530000 and 1550000:\n", code.slice(pos, pos + 3000));
