const fs = require("fs");
const code = fs.readFileSync("public/assets/index-B6ZfsRmH.js", "utf8");

const pos = 1575761;
console.log("Around 1575761 (from -200 to +1000):\n", code.slice(pos - 200, pos + 1000));
