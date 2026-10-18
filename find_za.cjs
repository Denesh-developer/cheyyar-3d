const fs = require("fs");
const code = fs.readFileSync("public/assets/index-B6ZfsRmH.js", "utf8");

const idx = code.indexOf("function za(");
console.log("function za( at:", idx);
if (idx !== -1) {
  console.log(code.slice(idx, idx + 1000));
}
