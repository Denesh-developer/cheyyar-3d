const fs = require("fs");
const code = fs.readFileSync("public/assets/index-B6ZfsRmH.js", "utf8");

let idx = code.indexOf("theater(t)");
console.log("theater(t) in index.js at:", idx);
if (idx !== -1) {
  console.log(code.slice(idx - 40, idx + 200));
} else {
  let idx2 = code.indexOf("theater(");
  console.log("theater( in index.js at:", idx2);
  if (idx2 !== -1) {
    console.log(code.slice(idx2 - 40, idx2 + 200));
  }
}
