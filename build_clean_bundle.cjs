const fs = require('fs');
const vm = require('vm');

console.log("Reading original pristine index.js...");
let code = fs.readFileSync('index.js', 'utf8');

// 1. Replace wP (Cheyyar single territory)
const wP_start = code.indexOf("wP=JSON.parse('");
if (wP_start === -1) throw new Error("Could not find wP=JSON.parse('");
const wP_end = code.indexOf("}]')", wP_start) + 4;
console.log("Replacing wP from", wP_start, "to", wP_end);
const cheyyarDistricts = [
  { id: "cheyyar", name: "Cheyyar", ta: "செய்யாறு", centre: [0, 0], st: "tn" }
];
code = code.slice(0, wP_start) + `wP=${JSON.stringify(cheyyarDistricts)}` + code.slice(wP_end);

// 2. Replace vP (Cheyyar 9 authentic landmarks)
const vP_start = code.indexOf(",vP=JSON.parse(`");
if (vP_start === -1) throw new Error("Could not find ,vP=JSON.parse(`");
const vP_end = code.indexOf("}]`)", vP_start) + 4;
console.log("Replacing vP from", vP_start, "to", vP_end);
const cheyyarPlaces = [
  { id: "vedapureeswarar", name: "Sri Vedapureeswarar Temple", ta: "ஸ்ரீ வேதபுரீஸ்வரர் திருக்கோயில்", district: "cheyyar", st: "tn", x: 0, z: 60, type: "gopuram", photo: "/images/landmarks/vedapureeswarar.jpg" },
  { id: "cheyyar-talkies", name: "Cheyyar Talkies", ta: "செய்யாறு டாக்கீஸ்", district: "cheyyar", st: "tn", x: -80, z: -40, type: "cinema", photo: "/images/landmarks/cheyyar-talkies.jpg" },
  { id: "cheyyar-busstand", name: "Cheyyar Bus Stand", ta: "செய்யாறு பேருந்து நிலையம்", district: "cheyyar", st: "tn", x: 140, z: -80, type: "bus", photo: "/images/landmarks/cheyyar-busstand.jpg" },
  { id: "cheyyar-river", name: "Cheyyar River & Bridge", ta: "செய்யாறு நதி & பாலம்", district: "cheyyar", st: "tn", x: 0, z: 300, type: "bridge", photo: "/images/landmarks/cheyyar-river.jpg" },
  { id: "anna-college", name: "Arignar Anna Govt Arts College", ta: "அறிஞர் அண்ணா அரசு கலைக்கல்லூரி", district: "cheyyar", st: "tn", x: -180, z: -220, type: "college", photo: "/images/landmarks/anna-college.jpg" },
  { id: "cheyyar-gh", name: "Cheyyar Government Hospital", ta: "செய்யாறு அரசு தலைமை மருத்துவமனை", district: "cheyyar", st: "tn", x: -220, z: -50, type: "hospital", photo: "/images/landmarks/cheyyar-gh.jpg" },
  { id: "cheyyar-sipcot", name: "Cheyyar SIPCOT Industrial Park", ta: "செய்யாறு சிப்காட் தொழிற்பேட்டை", district: "cheyyar", st: "tn", x: 320, z: -220, type: "fort", photo: "/images/landmarks/cheyyar-sipcot.jpg" },
  { id: "clock-tower", name: "Cheyyar Clock Tower & Bazaar", ta: "செய்யாறு மணிக்கூண்டு & காந்தி சிலை", district: "cheyyar", st: "tn", x: 20, z: -20, type: "monument", photo: "/images/landmarks/clock-tower.jpg" },
  { id: "sugar-mill", name: "Cheyyar Cooperative Sugar Mills", ta: "செய்யாறு கூட்டுறவு சர்க்கரை ஆலை", district: "cheyyar", st: "tn", x: 240, z: 160, type: "mill", photo: "/images/landmarks/sugar-mill.jpg" }
];
code = code.slice(0, vP_start) + `,vP=${JSON.stringify(cheyyarPlaces)}` + code.slice(vP_end);

// 3. Replace Li (States list -> Cheyyar Town)
const li_start = code.indexOf('Li=[{id:"tn"');
const li_end = code.indexOf("].filter(a=>O0.states.includes(a.id))", li_start) + "].filter(a=>O0.states.includes(a.id))".length;
if (li_start === -1 || li_end <= li_start) throw new Error("Could not find Li target");
code = code.slice(0, li_start) + 'Li=[{id:"tn",name:"Cheyyar Town",ta:"செய்யாறு நகரம்"}]' + code.slice(li_end);
console.log("Replaced Li with Cheyyar Town!");

// 4. Replace default spawn d3
const d3Target = 'd3={tn:{district:"chennai",place:"marina-beach"}';
const d3Replacement = 'd3={tn:{district:"cheyyar",place:"vedapureeswarar"}';
if (!code.includes(d3Target)) throw new Error("Could not find d3Target");
code = code.replace(d3Target, d3Replacement);
console.log("Replaced default spawn to Cheyyar / Vedapureeswarar Temple!");

// 5. Replace District/State selection in modal with hidden Cheyyar select
const modalDistPattern = '<label>${v(C("yourState"))}</label>\n       <div class="seg join-state" role="radiogroup">${OD(Ts.state)}</div>\n       <label for="join-district">${v(C("yourDistrict"))}</label>\n       <select id="join-district" required>\n         <option value="">${v(C("chooseDistrict"))}</option>\n         ${Q5(Ts.state,V.district)}\n       </select>\n       <p class="talk-note join-hub">${v(ZM(Ts.state))}</p>';
const modalDistReplacement = '<select id="join-district" style="display:none" required><option value="cheyyar" selected>Cheyyar Town</option></select>';
if (!code.includes(modalDistPattern)) {
  const p1 = code.indexOf('<label>${v(C("yourState"))}</label>');
  const p2 = code.indexOf('<p class="talk-note join-hub">${v(ZM(Ts.state))}</p>');
  if (p1 !== -1 && p2 !== -1 && p2 > p1) {
    const end = p2 + '<p class="talk-note join-hub">${v(ZM(Ts.state))}</p>'.length;
    code = code.slice(0, p1) + modalDistReplacement + code.slice(end);
    console.log("Replaced modal district selection flexibly!");
  } else {
    throw new Error("Could not find modal district section!");
  }
} else {
  code = code.replace(modalDistPattern, modalDistReplacement);
  console.log("Replaced modal district selection!");
}

// 6. Replace Google Sign-in button with Clean Single Google Button (NO Guest Quick Enter)
const googleAuthTarget = '${V.account?"":\'<div class="google-signin" id="join-google"></div><p class="auth-divider">— or —</p>\'}';
const modernAuthReplacement = '${V.account?"":`<div class="auth-actions-group"><button type="button" class="btn-auth btn-google" id="btn-google-login"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg><span>Sign in with Google</span></button></div><p class="auth-divider">— or customize avatar below —</p>`}';
if (!code.includes(googleAuthTarget)) {
  throw new Error("Could not find googleAuthTarget");
}
code = code.replace(googleAuthTarget, modernAuthReplacement);
console.log("Replaced Google Auth with Clean Google Auth button!");

// 7. Cheyyar branding string replacements
code = code.replaceAll("Namma Ooru", "Namma Cheyyar");
code = code.replaceAll("நம்ம ஊரு", "நம்ம செய்யாறு");
code = code.replaceAll("Play for your district", "Experience Cheyyar in 3D");
code = code.replaceAll("உங்கள் மாவட்டத்துக்காக விளையாடுங்கள்", "உங்கள் செய்யாறு நகரத்தை 3Dயில் அனுபவியுங்கள்");
code = code.replaceAll("District race", "Cheyyar Leaderboard");
code = code.replaceAll("மாவட்டப் போட்டி", "செய்யாறு லீடர்போர்டு");
code = code.replace(
  'joinText:"Explore a miniature Tamil Nadu, Kerala and Karnataka. Collect jasmine, mangoes, coconuts, tea leaves and more — every point counts for the district you choose."',
  'joinText:"Explore Cheyyar Town in 3D! Visit Cheyyar Talkies, Sri Vedapureeswarar Temple, Clock Tower, Bus Stand, and SIPCOT."'
);

// Default name and gender so guest play enters immediately
code = code.replace('name:jn.name??""', 'name:jn.name||"Cheyyar Hero"');
code = code.replace('settings:jn.settings??{}', 'settings:Object.assign({gender:"m"},jn.settings)');

// 8. Cheyyar Talkies naming inside theater
code = code.replaceAll('const i=`${t.toUpperCase()} TALKIES`', 'const i="CHEYYAR TALKIES"');
code = code.replaceAll('WELCOME · ${n.toUpperCase()} TALKIES', 'WELCOME · CHEYYAR TALKIES');
code = code.replace(
  'Qw={tn:{en:"Tamil Nadu",ta:"தமிழ்நாடு"},kl:{en:"Kerala",ml:"കേരളം"},ka:{en:"Karnataka",kn:"ಕರ್ನಾಟಕ"}}',
  'Qw={tn:{en:"Cheyyar",ta:"செய்யாறு"},cheyyar:{en:"Cheyyar",ta:"செய்யாறு"},kl:{en:"Kerala",ml:"കേരളம்"},ka:{en:"Karnataka",kn:"ಕರ್ನಾಟಕ"}}'
);
console.log("Updated theater internal signs to CHEYYAR TALKIES / செய்யாறு டாக்கீஸ்!");

// 9. Mobile Touch Activation & Virtual Joystick
code = code.replace(
  'this.touch=matchMedia("(pointer: coarse)").matches',
  'this.touch=matchMedia("(pointer: coarse)").matches||"ontouchstart"in window||navigator.maxTouchPoints>0||window.innerWidth<=1024'
);
console.log("Enabled responsive mobile touch controls!");

// 10. Cheyyar Talkies Door Advance Booking & Lobby Choice
const doorTarget = 'if(!this.away)return this.openLobby(t);';
const doorReplacement = 'const m=we(`<button class="close-x" data-close>×</button><div style="text-align:center;padding:12px 6px"><h2 style="font-size:22px;margin:0 0 4px">🎬 Cheyyar Talkies</h2><h4 style="color:#38bdf8;margin:0 0 10px;font-size:15px">செய்யாறு டாக்கீஸ்</h4><p style="margin:0 0 16px;font-size:13.5px;color:#cbd5e1"><b>Leo</b> · Starring Thalapathy Vijay & Trisha</p><div style="display:flex;flex-direction:column;gap:10px"><button type="button" class="btn btn-primary" id="btn-door-book" style="min-height:48px;font-size:15px;font-weight:800;background:linear-gradient(135deg,#38bdf8,#6366f1);border:none;border-radius:14px;color:#fff;cursor:pointer">🎟 Book Seat in Advance / முன்பதிவு</button><button type="button" class="btn" id="btn-door-lobby" style="min-height:44px;font-size:14px;font-weight:700;background:rgba(30,41,59,0.8);border:1px solid rgba(148,163,184,0.3);border-radius:14px;color:#f8fafc;cursor:pointer">🏛 Enter Cinema Lobby / தியேட்டர் லாபி</button></div></div>`);m.querySelector("#btn-door-book").onclick=async()=>{te();const d=await this.refresh(t.state)??((i=this.info.get(t.state))==null?void 0:i.data);this.seatCard(t,d,za(d.status,this.serverNow(t.state)))};m.querySelector("#btn-door-lobby").onclick=()=>{te();this.openLobby(t)};return;';
if (!code.includes(doorTarget)) throw new Error("Could not find doorTarget");
code = code.replace(doorTarget, doorReplacement);
console.log("Enabled advance ticket booking modal on Cheyyar Talkies door!");

// 9. Verify Syntax with vm.SourceTextModule
console.log("Verifying clean build syntax...");
try {
  new vm.SourceTextModule(code);
  console.log("SUCCESS: Clean bundle has 0 syntax errors!");
} catch (err) {
  console.error("Syntax Error in clean build:", err);
  process.exit(1);
}

// 10. Write to public/assets/index-B6ZfsRmH.js
fs.writeFileSync('public/assets/index-B6ZfsRmH.js', code, 'utf8');
console.log("Written successfully to public/assets/index-B6ZfsRmH.js! (Size: " + code.length + " bytes)");
