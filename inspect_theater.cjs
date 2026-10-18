const fs = require("fs");
const code = fs.readFileSync("public/assets/theaterhall-u7bMEcwh.js", "utf8");
console.log("theaterhall length:", code.length);

const terms = ["Tamil Nadu Talkies", "தமிழ்நாடு டாக்கீஸ்", "Talkies", "talkies", "seat", "ticket", "video", "youtube", "iframe", "show", "showtime", "leo", "Leo", "film", "movie", "screen"];
for (const t of terms) {
  let count = 0, firstIdx = -1;
  let pos = 0;
  while (true) {
    let idx = code.indexOf(t, pos);
    if (idx === -1) break;
    count++;
    if (firstIdx === -1) firstIdx = idx;
    pos = idx + t.length;
  }
  console.log(`Term "${t}": count=${count}, firstIdx=${firstIdx}`);
  if (firstIdx !== -1) {
    console.log("Context:", code.slice(Math.max(0, firstIdx - 60), firstIdx + 120));
  }
}
