const fs = require('fs');

const code = fs.readFileSync('index.js', 'utf8');

const p1 = code.indexOf('<label>${v(C("yourState"))}</label>');
const p2 = code.indexOf('<p class="talk-note join-hub">${v(ZM(Ts.state))}</p>');
console.log('p1:', p1, 'p2:', p2);

if (p1 !== -1 && p2 !== -1) {
  console.log('Modal section:', JSON.stringify(code.slice(p1, p2 + 55)));
}
