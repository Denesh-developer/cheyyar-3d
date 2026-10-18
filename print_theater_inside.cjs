const fs = require("fs");
const code = fs.readFileSync("public/assets/index-B6ZfsRmH.js", "utf8");

const pos = 1612000;
console.log("Around 1612000 to 1616000:\n", code.slice(pos, pos + 4000));
