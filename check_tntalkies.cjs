const fs = require("fs");
const code = fs.readFileSync("public/assets/index-B6ZfsRmH.js", "utf8");

let idx = code.indexOf('name:"Tamil Nadu Talkies"');
console.log('name:"Tamil Nadu Talkies" at:', idx);

let idx2 = code.indexOf('name:"தமிழ்நாடு டாக்கீஸ்"');
console.log('name:"தமிழ்நாடு டாக்கீஸ்" at:', idx2);

let idx3 = code.indexOf('Tamil Nadu Talkies');
console.log('Tamil Nadu Talkies at:', idx3);
if (idx3 !== -1) {
  console.log(code.slice(idx3 - 40, idx3 + 80));
}

let idx4 = code.indexOf('தமிழ்நாடு டாக்கீஸ்');
console.log('தமிழ்நாடு டாக்கீஸ் at:', idx4);
if (idx4 !== -1) {
  console.log(code.slice(idx4 - 40, idx4 + 80));
}
