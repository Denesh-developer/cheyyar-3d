const fs = require("fs");
const code = fs.readFileSync("public/assets/index-B6ZfsRmH.js", "utf8");

let pos = 1575000;
let idx = code.lastIndexOf("fo=", pos);
console.log("fo= before pos at:", idx);
if (idx !== -1) {
  console.log(code.slice(idx, idx + 600));
}
