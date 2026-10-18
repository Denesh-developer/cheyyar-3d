const fs = require('fs');

let core = fs.readFileSync('public/assets/core-CnkT7A_l.js', 'utf8');

// Replace projection and bounds
core = core.replace(
  /a=\{lat0:[0-9\.]+,lon0:[0-9\.]+,unitsPerKm:[0-9\.]+\},t=\[[^\]]+\]/,
  'a={lat0:12.6599,lon0:79.5422,unitsPerKm:50},t=[-600,-600,600,600]'
);

fs.writeFileSync('public/assets/core-CnkT7A_l.js', core, 'utf8');
console.log("Updated core-CnkT7A_l.js with Cheyyar coordinates and bounds!");
