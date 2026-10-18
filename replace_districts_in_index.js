const fs = require('fs');

console.log("Replacing hardcoded districts, places, and states in index-B6ZfsRmH.js...");

let index = fs.readFileSync('public/assets/index-B6ZfsRmH.js', 'utf8');

// 1. Cheyyar Localities (districts)
const cheyyarDistricts = [
  { id: "sannidhi", name: "Sannidhi Street", ta: "சந்நிதி தெரு (கோயில் பகுதி)", centre: [0, 50], st: "tn" },
  { id: "gandhi-nagar", name: "Gandhi Nagar", ta: "காந்தி நகர்", centre: [-200, 100], st: "tn" },
  { id: "bus-stand", name: "Cheyyar Bus Stand", ta: "புதிய பேருந்து நிலையம்", centre: [150, -100], st: "tn" },
  { id: "bazaar", name: "Old Bus Stand & Bazaar", ta: "பழைய பஸ் ஸ்டாண்ட் & கடைவீதி", centre: [30, -30], st: "tn" },
  { id: "kanchipuram-rd", name: "Kanchipuram Road", ta: "காஞ்சிபுரம் சாலை", centre: [250, 200], st: "tn" },
  { id: "arani-rd", name: "Arani Road", ta: "ஆரணி சாலை", centre: [-280, -50], st: "tn" },
  { id: "vandavasi-rd", name: "Vandavasi Road", ta: "வந்தவாசி சாலை", centre: [100, -300], st: "tn" },
  { id: "river-bed", name: "Cheyyar River Bed", ta: "செய்யாறு ஆற்றுப்படுகை", centre: [0, 320], st: "tn" },
  { id: "sipcot", name: "Cheyyar SIPCOT", ta: "சிப்காட் தொழிற்பேட்டை", centre: [350, -250], st: "tn" },
  { id: "college-rd", name: "Anna Arts College Road", ta: "அண்ணா கலைக்கல்லூரி பகுதி", centre: [-220, -280], st: "tn" }
];

// 2. Cheyyar Places (landmarks)
const cheyyarPlaces = [
  { id: "vedapureeswarar", name: "Sri Vedapureeswarar Temple", ta: "வேதபுரீஸ்வரர் திருக்கோயில்", district: "sannidhi", st: "tn", x: 0, z: 50, type: "gopuram" },
  { id: "cheyyar-river", name: "Cheyyar River & Bridge", ta: "செய்யாறு நதி & பாலம்", district: "river-bed", st: "tn", x: 0, z: 320, type: "bridge" },
  { id: "cheyyar-busstand", name: "Cheyyar Central Bus Stand", ta: "செய்யாறு பேருந்து நிலையம்", district: "bus-stand", st: "tn", x: 150, z: -100, type: "bus" },
  { id: "clock-tower", name: "Clock Tower & Gandhi Statue", ta: "மணிக்கூண்டு காந்தி சிலை", district: "bazaar", st: "tn", x: 30, z: -30, type: "monument" },
  { id: "cheyyar-sipcot", name: "Cheyyar SIPCOT Industrial Park", ta: "சிப்காட் தொழிற்பேட்டை", district: "sipcot", st: "tn", x: 350, z: -250, type: "fort" },
  { id: "anna-college", name: "Aringnar Anna Govt Arts College", ta: "அறிஞர் அண்ணா அரசு கலைக்கல்லூரி", district: "college-rd", st: "tn", x: -220, z: -280, type: "monument" },
  { id: "anaicut", name: "Cheyyar Check Dam & Anaicut", ta: "செய்யாறு அணைக்கட்டு", district: "river-bed", st: "tn", x: -300, z: 340, type: "lake" }
];

// Replace wP
const wP_start = index.indexOf('wP=JSON.parse(');
if (wP_start !== -1) {
  const quoteChar = index[wP_start + 'wP=JSON.parse('.length]; // ' or `
  const closeIdx = index.indexOf(')' + (index[wP_start + 'wP=JSON.parse('.length] === '`' ? '' : ''), wP_start);
  // find the closing quote and paren
  const endIdx = index.indexOf(quoteChar + ')', wP_start);
  if (endIdx !== -1) {
    const fullCall = index.slice(wP_start, endIdx + 2);
    const replacement = `wP=${JSON.stringify(cheyyarDistricts)}`;
    index = index.replace(fullCall, replacement);
    console.log("Replaced wP with Cheyyar wards!");
  }
}

// Replace vP
const vP_start = index.indexOf('vP=JSON.parse(');
if (vP_start !== -1) {
  const quoteChar = index[vP_start + 'vP=JSON.parse('.length];
  const endIdx = index.indexOf(quoteChar + ')', vP_start);
  if (endIdx !== -1) {
    const fullCall = index.slice(vP_start, endIdx + 2);
    const replacement = `vP=${JSON.stringify(cheyyarPlaces)}`;
    index = index.replace(fullCall, replacement);
    console.log("Replaced vP with Cheyyar places!");
  }
}

// Replace Li (states array)
const liTarget = 'Li=[{id:"tn",name:"Tamil Nadu",ta:"தமிழ்நாடு",ml:"തമിഴ്നാട്",kn:"ತಮಿಳುನಾಡು"},{id:"kl",name:"Kerala",ta:"கேரளா",ml:"കേരളம்",kn:"ಕೇರಳ"},{id:"ka",name:"Karnataka",ta:"கர்நாடகா",ml:"കർണാടക",kn:"ಕರ್ನಾಟಕ"}]';
const liReplacement = 'Li=[{id:"tn",name:"Cheyyar Town",ta:"செய்யாறு நகரம்"}]';
if (index.includes(liTarget)) {
  index = index.replace(liTarget, liReplacement);
  console.log("Replaced Li with Cheyyar Town!");
} else {
  // Regex replacement for Li
  index = index.replace(
    /Li=\[\{id:"tn",name:"Tamil Nadu"[^\]]+\]/,
    'Li=[{id:"tn",name:"Cheyyar Town",ta:"செய்யாறு நகரம்"}]'
  );
  console.log("Replaced Li via regex!");
}

// Replace "Your state" / "உங்கள் மாநிலம்" label with "Your Town" / "உங்கள் நகரம்"
index = index.replaceAll("Your state", "Your Town");
index = index.replaceAll("உங்கள் மாநிலம்", "உங்கள் நகரம்");
index = index.replaceAll("Your district", "Your Ward / Area");
index = index.replaceAll("உங்கள் மாவட்டம்", "உங்கள் பகுதி / வார்டு");
index = index.replaceAll("Choose your district", "Choose your Cheyyar Ward");
index = index.replaceAll("உங்கள் மாவட்டத்தைத் தேர்ந்தெடுக்கவும்", "செய்யாறு பகுதியைத் தேர்ந்தெடுக்கவும்");

fs.writeFileSync('public/assets/index-B6ZfsRmH.js', index, 'utf8');
console.log("Updated index-B6ZfsRmH.js successfully with Cheyyar Wards!");
