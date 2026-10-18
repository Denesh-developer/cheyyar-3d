const fs = require("fs");
let lobby = fs.readFileSync("public/assets/lobby-DU5i-580.js", "utf8");

lobby = lobby.replaceAll('detailTitle:"Shows at {state} Talkies"', 'detailTitle:"Shows at Cheyyar Talkies"');
lobby = lobby.replaceAll('detailTitle:"{state} டாக்கீஸ் காட்சிகள்"', 'detailTitle:"செய்யாறு டாக்கீஸ் காட்சிகள்"');

fs.writeFileSync("public/assets/lobby-DU5i-580.js", lobby, "utf8");
console.log("Updated lobby-DU5i-580.js with Cheyyar Talkies!");
