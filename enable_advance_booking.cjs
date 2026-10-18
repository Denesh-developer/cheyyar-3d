const fs = require('fs');

let lobby = fs.readFileSync('public/assets/lobby-DU5i-580.js', 'utf8');

// 1. Always allow ticket booking before show (opensIn returns 0)
const targetOpensIn = 'opensIn(){const t=this.data;if(!(t!=null&&t.film))return 0;const s=this.th.phaseOf(t,this.state);return s.phase==="doors"&&s.left>L?s.left-L:0}';
const replacementOpensIn = 'opensIn(){return 0}';

if (lobby.includes(targetOpensIn)) {
  lobby = lobby.replace(targetOpensIn, replacementOpensIn);
  console.log("Replaced opensIn with 0 (Advance booking enabled)!");
} else {
  console.log("targetOpensIn not found directly, searching...");
  const p = lobby.indexOf('opensIn(){');
  if (p !== -1) {
    const end = lobby.indexOf('}', p);
    console.log("Found opensIn at", p, lobby.slice(p, end + 1));
    lobby = lobby.slice(0, p) + replacementOpensIn + lobby.slice(end + 1);
    console.log("Replaced via slice!");
  }
}

// 2. Allow advance ticket booking in notOnSale
const p2 = lobby.indexOf('notOnSale(t){');
if (p2 !== -1) {
  const end2 = lobby.indexOf('leaveQueue', p2);
  const oldNotOnSale = lobby.slice(p2, end2);
  console.log("Old notOnSale:", oldNotOnSale);
  const newNotOnSale = 'notOnSale(t){if(t.phase==="cancelled")return this.th.hud.toast(this.T("cancelled"),5e3),!0;return!1}';
  lobby = lobby.slice(0, p2) + newNotOnSale + lobby.slice(end2);
  console.log("Updated notOnSale!");
}

fs.writeFileSync('public/assets/lobby-DU5i-580.js', lobby, 'utf8');
console.log("Successfully updated lobby-DU5i-580.js for advance booking!");
