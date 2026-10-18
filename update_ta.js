const fs = require('fs');

let ta = fs.readFileSync('public/assets/ta-CUxBAER_.js', 'utf8');

ta = ta.replace(
  'loading:"மாவட்டங்களை அமைக்கிறோம்…"',
  'loading:"செய்யாறு நகரத்தை அமைக்கிறோம்…"'
);
ta = ta.replaceAll("மாவட்டப் போட்டி", "செய்யாறு வார்டு போட்டி");
ta = ta.replaceAll("உங்கள் மாவட்டம்", "உங்கள் பகுதி / வார்டு");
ta = ta.replaceAll("மாவட்டம்", "பகுதி");

fs.writeFileSync('public/assets/ta-CUxBAER_.js', ta, 'utf8');
console.log("Updated public/assets/ta-CUxBAER_.js for Cheyyar!");
