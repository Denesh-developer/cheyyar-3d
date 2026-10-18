const fs = require("fs");
const code = fs.readFileSync("public/assets/index-B6ZfsRmH.js", "utf8");

let pos = 0;
while (true) {
  let idx = code.indexOf('.theater({', pos);
  if (idx === -1) break;
  console.log(".theater({ at:", idx);
  console.log(code.slice(idx, idx + 150));
  pos = idx + 10;
}
