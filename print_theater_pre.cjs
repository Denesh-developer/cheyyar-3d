const fs = require("fs");
const code = fs.readFileSync("public/assets/index-B6ZfsRmH.js", "utf8");

// Search for za definition or where e.film comes from
const pos = 1608723;
console.log("Before 1608723 (from -3000 to -1000):\n", code.slice(pos - 3500, pos - 1500));
