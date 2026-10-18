const fs = require("fs");
const code = fs.readFileSync("public/assets/index-B6ZfsRmH.js", "utf8");

function showAround(target, before = 200, after = 600) {
  let pos = 0;
  while (true) {
    let idx = code.indexOf(target, pos);
    if (idx === -1) break;
    console.log(`=== Found "${target}" at ${idx} ===`);
    console.log(code.slice(Math.max(0, idx - before), idx + after));
    pos = idx + target.length;
  }
}

showAround('.theater({op:"enter"');
showAround('.theater({op:"buy"');
