const fs = require("fs");
const lobby = fs.readFileSync("public/assets/lobby-DU5i-580.js", "utf8");

console.log("has lobby 1:", lobby.includes('detailTitle:"Shows at {state} Talkies"'));
console.log("has lobby 2:", lobby.includes('detailTitle:"{state} டாக்கீஸ் காட்சிகள்"'));
