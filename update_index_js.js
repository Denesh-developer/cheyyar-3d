const fs = require('fs');

let index = fs.readFileSync('public/assets/index-B6ZfsRmH.js', 'utf8');

// Replace default spawn
const beforeSpawn = 'd3={tn:{district:"chennai",place:"marina-beach"}';
const afterSpawn = 'd3={tn:{district:"sannidhi",place:"vedapureeswarar"}';

if (index.includes(beforeSpawn)) {
  index = index.replace(beforeSpawn, afterSpawn);
  console.log("Successfully replaced default spawn to Sannidhi / Vedapureeswarar Temple!");
} else {
  console.log("Could not find exact spawn string, searching...");
  const match = index.match(/d3=\{tn:\{district:"[^"]+",place:"[^"]+"\}/);
  if (match) {
    console.log("Found match:", match[0]);
    index = index.replace(match[0], 'd3={tn:{district:"sannidhi",place:"vedapureeswarar"}');
    console.log("Replaced via regex!");
  }
}

// Update title and welcoming text in index.js
index = index.replaceAll("Namma Ooru", "Namma Cheyyar");
index = index.replaceAll("நம்ம ஊரு", "நம்ம செய்யாறு");
index = index.replaceAll("Play for your district", "Play for your Cheyyar ward");
index = index.replaceAll("உங்கள் மாவட்டத்துக்காக விளையாடுங்கள்", "உங்கள் செய்யாறு பகுதிக்காக விளையாடுங்கள்");
index = index.replaceAll("District race", "Ward race");
index = index.replaceAll("மாவட்டப் போட்டி", "வார்டு போட்டி");

// Update Chennai starting text to Cheyyar
index = index.replaceAll(
  "Your journey starts in Chennai, where everyone meets.",
  "Your journey starts at Sri Vedapureeswarar Temple in Cheyyar, where everyone meets."
);
index = index.replaceAll(
  "உங்கள் பயணம் சென்னையில் தொடங்குகிறது, இங்கு அனைவரும் சந்திக்கிறார்கள்.",
  "உங்கள் பயணம் செய்யாறு வேதபுரீஸ்வரர் திருக்கோயிலில் தொடங்குகிறது."
);

fs.writeFileSync('public/assets/index-B6ZfsRmH.js', index, 'utf8');
console.log("Updated index-B6ZfsRmH.js for Cheyyar!");
