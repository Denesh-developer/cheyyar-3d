const fs = require("fs");
const code = fs.readFileSync("public/assets/index-B6ZfsRmH.js", "utf8");

const pos = 1586857;
console.log("Around 1586857 (from -1500 to +500):\n", code.slice(pos - 1500, pos + 500));
