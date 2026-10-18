const fs = require("fs");
const code = fs.readFileSync("public/assets/index-B6ZfsRmH.js", "utf8");

let pos = 1575761;
console.log(code.slice(pos - 4000, pos - 3000));
