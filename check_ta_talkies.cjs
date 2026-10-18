const fs = require("fs");
const path = require("path");

const taFile = "public/assets/ta-CUxBAER_.js";
const content = fs.readFileSync(taFile, "utf8");

let pos = 0;
while (true) {
  let idx = content.indexOf("டாக்கீஸ்", pos);
  if (idx === -1) break;
  console.log("டாக்கீஸ் in ta at:", idx);
  console.log(content.slice(Math.max(0, idx - 40), idx + 80));
  pos = idx + 8;
}

let pos2 = 0;
while (true) {
  let idx = content.indexOf("Talkies", pos2);
  if (idx === -1) break;
  console.log("Talkies in ta at:", idx);
  console.log(content.slice(Math.max(0, idx - 40), idx + 80));
  pos2 = idx + 7;
}
