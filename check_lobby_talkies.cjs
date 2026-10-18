const fs = require("fs");
const code = fs.readFileSync("public/assets/lobby-DU5i-580.js", "utf8");

let idx = code.indexOf("Talkies");
console.log("Talkies in lobby-DU5i-580.js at:", idx);
if (idx !== -1) {
  console.log(code.slice(idx - 60, idx + 120));
}
