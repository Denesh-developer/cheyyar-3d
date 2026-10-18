const fs = require("fs");
const code = fs.readFileSync("public/assets/index-B6ZfsRmH.js", "utf8");

// Search for where the user interacts with the theater door or opens the modal
let pos = 1580000;
console.log("Around 1580000 to 1586000:\n", code.slice(pos, pos + 3000));
