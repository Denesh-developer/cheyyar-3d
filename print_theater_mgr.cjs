const fs = require("fs");
const code = fs.readFileSync("public/assets/index-B6ZfsRmH.js", "utf8");

// Search for where this.info or film is used in the theater manager
let pos = 1575761;
console.log("Theater manager methods around 1575761:\n", code.slice(pos - 1500, pos + 2500));
