const fs = require("fs");
const code = fs.readFileSync("public/assets/index-B6ZfsRmH.js", "utf8");

let pos = code.indexOf("iframe_api");
console.log("iframe_api at:", pos);
if (pos !== -1) {
  console.log(code.slice(pos - 100, pos + 200));
}
