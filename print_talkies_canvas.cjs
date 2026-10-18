const fs = require("fs");
const code = fs.readFileSync("public/assets/index-B6ZfsRmH.js", "utf8");

console.log("Around 1661319:\n", code.slice(1661319 - 150, 1661319 + 250));
console.log("Around 1811248:\n", code.slice(1811248 - 150, 1811248 + 250));
