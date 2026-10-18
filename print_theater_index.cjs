const fs = require("fs");
const code = fs.readFileSync("public/assets/index-B6ZfsRmH.js", "utf8");

const pos = 1608723;
console.log("Around 1608723:\n", code.slice(pos - 1000, pos + 1500));
