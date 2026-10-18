const fs = require("fs");
const path = require("path");

const dir = "public/assets";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".js"));

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), "utf8");
  const searches = ["Tamil Nadu Talkies", "தமிழ்நாடு டாக்கீஸ்", "tamil nadu talkies", "Tamilnadu Talkies", "talkies", "cinema", "theaterhall", "showVideo"];
  for (const s of searches) {
    if (content.includes(s)) {
      let idx = content.indexOf(s);
      console.log(`Found "${s}" in ${file} at ${idx}:`);
      console.log(content.slice(Math.max(0, idx - 40), idx + 100));
    }
  }
}
