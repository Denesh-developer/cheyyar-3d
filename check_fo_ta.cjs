const fs = require("fs");
const code = fs.readFileSync("public/assets/index-B6ZfsRmH.js", "utf8");

let idx = code.indexOf("ta:{", 1539238);
console.log("fo.ta at:", idx);
if (idx !== -1) {
  console.log(code.slice(idx, idx + 1500));
}
