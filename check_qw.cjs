const fs = require("fs");
const code = fs.readFileSync("public/assets/index-B6ZfsRmH.js", "utf8");

let idx = code.indexOf("Qw=");
console.log("Qw= at:", idx);
if (idx !== -1) {
  console.log(code.slice(idx, idx + 300));
}
