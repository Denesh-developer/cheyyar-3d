const fs = require('fs');

const code = fs.readFileSync('index.js', 'utf8');

// 1. wP
const wP_start = code.indexOf("wP=JSON.parse('");
const wP_end = code.indexOf("}]')", wP_start) + 4;
console.log('wP:', wP_start, wP_end, code.slice(wP_end - 10, wP_end));

// 2. vP
const vP_start = code.indexOf(",vP=JSON.parse(`");
const vP_end = code.indexOf("}]`)", vP_start) + 4;
console.log('vP:', vP_start, vP_end, code.slice(vP_end - 10, vP_end));

// 3. Li
const li_start = code.indexOf("Li=[{id:\"tn\"");
const li_end = code.indexOf("].filter(a=>O0.states.includes(a.id))", li_start) + "].filter(a=>O0.states.includes(a.id))".length;
console.log('Li:', li_start, li_end, code.slice(li_start, li_end));

// 4. d3
const d3_start = code.indexOf('d3={tn:{district:"chennai"');
console.log('d3:', d3_start);

// 5. Google Auth
const googleAuthTarget = '${V.account?"":\'<div class="google-signin" id="join-google"></div><p class="auth-divider">— or —</p>\'}';
console.log('googleAuthTarget found:', code.includes(googleAuthTarget));

// 6. Touch target
const touch_p = code.indexOf('this.touch=');
console.log('this.touch found at:', touch_p, code.slice(touch_p, touch_p + 50));

// 7. Door method
const door_p = code.indexOf('async door(t){var i;const e=this.busy()');
console.log('door found at:', door_p, code.slice(door_p, door_p + 80));
