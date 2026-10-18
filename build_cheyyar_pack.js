const fs = require('fs');

console.log("Generating strict schema-compliant Cheyyar Town pack...");

const bounds = [-600, -600, 600, 600];

// State outer boundary ring
const state = [
  [
    [-590, -590],
    [590, -590],
    [590, 590],
    [-590, 590],
    [-590, -590]
  ]
];

const st = "tn";

function makeBox(cx, cz, w, h) {
  const hw = w / 2;
  const hh = h / 2;
  return [
    [cx - hw, cz - hh],
    [cx + hw, cz - hh],
    [cx + hw, cz + hh],
    [cx - hw, cz + hh],
    [cx - hw, cz - hh]
  ];
}

const districts = [
  {
    id: "sannidhi",
    name: "Sannidhi Street",
    ta: "சந்நிதி தெரு (கோயில் பகுதி)",
    centre: [0, 50],
    st: "tn",
    rings: [[makeBox(0, 50, 180, 160)]]
  },
  {
    id: "gandhi-nagar",
    name: "Gandhi Nagar",
    ta: "காந்தி நகர்",
    centre: [-200, 100],
    st: "tn",
    rings: [[makeBox(-200, 100, 180, 160)]]
  },
  {
    id: "bus-stand",
    name: "Cheyyar Bus Stand",
    ta: "புதிய பேருந்து நிலையம்",
    centre: [150, -100],
    st: "tn",
    rings: [[makeBox(150, -100, 180, 160)]]
  },
  {
    id: "bazaar",
    name: "Old Bus Stand & Bazaar",
    ta: "பழைய பஸ் ஸ்டாண்ட் & கடைவீதி",
    centre: [30, -30],
    st: "tn",
    rings: [[makeBox(30, -30, 160, 140)]]
  },
  {
    id: "kanchipuram-rd",
    name: "Kanchipuram Road",
    ta: "காஞ்சிபுரம் சாலை",
    centre: [250, 200],
    st: "tn",
    rings: [[makeBox(250, 200, 200, 180)]]
  },
  {
    id: "arani-rd",
    name: "Arani Road",
    ta: "ஆரணி சாலை",
    centre: [-280, -50],
    st: "tn",
    rings: [[makeBox(-280, -50, 200, 180)]]
  },
  {
    id: "vandavasi-rd",
    name: "Vandavasi Road",
    ta: "வந்தவாசி சாலை",
    centre: [100, -300],
    st: "tn",
    rings: [[makeBox(100, -300, 200, 180)]]
  },
  {
    id: "river-bed",
    name: "Cheyyar River Bed",
    ta: "செய்யாறு ஆற்றுப்படுகை",
    centre: [0, 320],
    st: "tn",
    rings: [[makeBox(0, 320, 500, 140)]]
  },
  {
    id: "sipcot",
    name: "Cheyyar SIPCOT",
    ta: "சிப்காட் தொழிற்பேட்டை",
    centre: [350, -250],
    st: "tn",
    rings: [[makeBox(350, -250, 240, 220)]]
  },
  {
    id: "college-rd",
    name: "Anna Arts College Road",
    ta: "அண்ணா கலைக்கல்லூரி பகுதி",
    centre: [-220, -280],
    st: "tn",
    rings: [[makeBox(-220, -280, 200, 180)]]
  }
];

const landmarks = [
  {
    id: "vedapureeswarar",
    name: "Sri Vedapureeswarar Temple",
    ta: "வேதபுரீஸ்வரர் திருக்கோயில்",
    district: "sannidhi",
    type: "gopuram",
    blurb: "7th-century Chola temple where Thirugnanasambandar turned a male palm tree into a female palm tree.",
    x: 0,
    z: 50,
    r: 35
  },
  {
    id: "cheyyar-river",
    name: "Cheyyar River & Bridge",
    ta: "செய்யாறு நதி & பாலம்",
    district: "river-bed",
    type: "bridge",
    blurb: "The lifeline river originating in Javadi Hills flowing right past the town.",
    x: 0,
    z: 320,
    r: 50
  },
  {
    id: "cheyyar-busstand",
    name: "Cheyyar Central Bus Terminal",
    ta: "செய்யாறு பேருந்து நிலையம்",
    district: "bus-stand",
    type: "bus",
    blurb: "Busy transport hub connecting Cheyyar to Kanchipuram, Arani, Vandavasi, and Chennai.",
    x: 150,
    z: -100,
    r: 30
  },
  {
    id: "clock-tower",
    name: "Clock Tower & Gandhi Statue",
    ta: "மணிக்கூண்டு காந்தி சிலை",
    district: "bazaar",
    type: "monument",
    blurb: "Historic heart of Cheyyar town and the central market square.",
    x: 30,
    z: -30,
    r: 25
  },
  {
    id: "cheyyar-sipcot",
    name: "Cheyyar SIPCOT Industrial Park",
    ta: "சிப்காட் தொழிற்பேட்டை",
    district: "sipcot",
    type: "fort",
    blurb: "Major industrial hub housing global footwear and engineering manufacturing.",
    x: 350,
    z: -250,
    r: 45
  },
  {
    id: "anna-college",
    name: "Aringnar Anna Govt Arts College",
    ta: "அறிஞர் அண்ணா அரசு கலைக்கல்லூரி",
    district: "college-rd",
    type: "monument",
    blurb: "Estd 1967, premier institution of higher learning in the Cheyyar region.",
    x: -220,
    z: -280,
    r: 35
  },
  {
    id: "anaicut",
    name: "Cheyyar Check Dam & Anaicut",
    ta: "செய்யாறு அணைக்கட்டு",
    district: "river-bed",
    type: "lake",
    blurb: "Scenic water check dam across Cheyyar river for surrounding paddy agriculture.",
    x: -300,
    z: 340,
    r: 40
  }
];

const towns = [
  { name: "Cheyyar", ta: "செய்யாறு", p: [0, 0], r: 100 },
  { name: "Gandhi Nagar", ta: "காந்தி நகர்", p: [-200, 100], r: 60 },
  { name: "SIPCOT", ta: "சிப்காட்", p: [350, -250], r: 70 }
];

const stations = [
  { name: "Cheyyar Bus Stand", ta: "செய்யாறு பேருந்து நிலையம்", p: [150, -100] },
  { name: "Cheyyar Old Bus Stand", ta: "பழைய பஸ் ஸ்டாண்ட்", p: [30, -30] }
];

const stalls = [
  { id: "tea-busstand", kind: "tea", name: "அண்ணா டீ கடை", ta: "அண்ணா டீ கடை", pts: 5, x: 140, z: -85 },
  { id: "tea-sannidhi", kind: "tea", name: "வேலன் டீ பார்", ta: "வேலன் டீ பார்", pts: 5, x: -15, z: 40 },
  { id: "tea-kanchipuram", kind: "tea", name: "காவிரி டீ ஸ்டால்", ta: "காவிரி டீ ஸ்டால்", pts: 5, x: 230, z: 180 },
  { id: "tea-river", kind: "tea", name: "ஆற்றங்கரை டீ கடை", ta: "ஆற்றங்கரை டீ கடை", pts: 5, x: -20, z: 290 },
  { id: "tea-sipcot", kind: "tea", name: "சிப்காட் கபே", ta: "சிப்காட் கபே", pts: 5, x: 330, z: -230 }
];

const roads = [
  {
    pts: [
      [350, 350], [250, 200], [150, -100], [100, -300], [80, -450]
    ],
    width: 14,
    nh: "SH-116"
  },
  {
    pts: [
      [-450, -50], [-280, -50], [30, -30], [150, -100]
    ],
    width: 12,
    nh: "Arani Rd"
  },
  {
    pts: [
      [30, -30], [0, 10], [-50, 50], [0, 90], [50, 50], [0, 10]
    ],
    width: 10
  },
  {
    pts: [
      [0, 10], [-100, 60], [-200, 100], [-300, 120]
    ],
    width: 10
  },
  {
    pts: [
      [-280, -50], [-250, -180], [-220, -280], [-200, -400]
    ],
    width: 10
  },
  {
    pts: [
      [150, -100], [250, -180], [350, -250], [450, -300]
    ],
    width: 12
  },
  {
    pts: [
      [-350, 280], [-150, 290], [0, 295], [200, 290], [350, 280]
    ],
    width: 10
  }
];

const rivers = [
  {
    name: "Cheyyar",
    ta: "செய்யாறு",
    width: 28,
    pts: [
      [-500, 340], [-350, 330], [-200, 325], [0, 320], [180, 315], [350, 310], [500, 305]
    ]
  }
];

const hills = [
  {
    name: "Javadi",
    p: [-450, 420],
    r: 90,
    h: 40
  }
];

const forests = [
  {
    id: "cheyyar-grove",
    name: "Cheyyar Grove",
    ta: "செய்யாறு தோப்பு",
    gate: "Main Gate",
    gateTa: "முதன்மை வாசல்",
    p: [-300, 150],
    r: 50,
    track: [[-320, 150], [-280, 150]]
  }
];

const items = [];
const itemTypes = ["jasmine", "mango", "coconut", "jasmine"];
let itemId = 0;

for (let x = -400; x <= 400; x += 35) {
  for (let z = -400; z <= 400; z += 35) {
    if (z > 300 && z < 340) continue;
    const type = itemTypes[(Math.abs(x * 7 + z * 13)) % itemTypes.length];
    items.push({
      id: `cheyyar-item-${itemId++}`,
      type: type,
      x: x + (Math.sin(itemId) * 12),
      z: z + (Math.cos(itemId) * 12),
      pts: type === "jasmine" ? 5 : (type === "mango" ? 10 : 8)
    });
  }
}

const railways = [];
const borderPosts = [];
const crossings = [];
const attribution = "Namma Cheyyar Map Data © Cheyyar Open Project";

const code = `
const i = ${JSON.stringify(attribution)};
const z = ${JSON.stringify(borderPosts)};
const a = ${JSON.stringify(bounds)};
const p = ${JSON.stringify(districts)};
const m = ${JSON.stringify(forests)};
const s = ${JSON.stringify(hills)};
const e = ${JSON.stringify(items)};
const d = ${JSON.stringify(landmarks)};
const y = ${JSON.stringify(railways)};
const o = ${JSON.stringify(rivers)};
const n = ${JSON.stringify(roads)};
const r = "tn";
const x = ${JSON.stringify(stalls)};
const t = ${JSON.stringify(state)};
const g = ${JSON.stringify(stations)};
const l = ${JSON.stringify(towns)};
const crossings = ${JSON.stringify(crossings)};

const u = {
  attribution: i,
  borderPosts: z,
  bounds: a,
  districts: p,
  forests: m,
  hills: s,
  items: e,
  landmarks: d,
  railways: y,
  rivers: o,
  roads: n,
  st: r,
  stalls: x,
  state: t,
  stations: g,
  towns: l,
  crossings: crossings
};

export {
  i as attribution,
  z as borderPosts,
  a as bounds,
  u as default,
  p as districts,
  m as forests,
  s as hills,
  e as items,
  d as landmarks,
  y as railways,
  o as rivers,
  n as roads,
  r as st,
  x as stalls,
  t as state,
  g as stations,
  l as towns,
  crossings as crossings
};
`;

fs.writeFileSync('public/assets/tn-CXBv6geO.js', code, 'utf8');
console.log(`Saved Schema-Compliant Cheyyar Town pack to public/assets/tn-CXBv6geO.js (${code.length} bytes)`);
