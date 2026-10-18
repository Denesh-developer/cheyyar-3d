const fs = require("fs");
const code = fs.readFileSync("public/assets/lobby-DU5i-580.js", "utf8");

let pos = 0;
while (true) {
  let idx = code.indexOf("{state}", pos);
  if (idx === -1) break;
  console.log("{state} in lobby at:", idx, code.slice(idx - 40, idx + 80));
  pos = idx + 7;
}
