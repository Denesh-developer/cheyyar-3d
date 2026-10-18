const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// Title & Meta
html = html.replace(/<title>[^<]+<\/title>/, '<title>Namma Cheyyar — Play for your ward | நம்ம செய்யாறு</title>');
html = html.replace(
  /<meta name="description" content="[^"]*">/,
  '<meta name="description" content="Explore Cheyyar town in 3D. Visit Sri Vedapureeswarar Temple, Cheyyar River, Central Bus Stand, SIPCOT, and climb the Cheyyar ward leaderboard.">'
);
html = html.replace(
  /<meta property="og:title" content="[^"]*">/,
  '<meta property="og:title" content="Namma Cheyyar — Play for your ward">'
);
html = html.replace(
  /<meta property="og:description" content="[^"]*">/,
  '<meta property="og:description" content="Explore Cheyyar town in 3D. Visit Sri Vedapureeswarar Temple, Cheyyar River, Central Bus Stand, SIPCOT, and climb the Cheyyar ward leaderboard.">'
);
html = html.replace(
  /<meta name="apple-mobile-web-app-title" content="[^"]*">/,
  '<meta name="apple-mobile-web-app-title" content="Namma Cheyyar">'
);

// Canvas
html = html.replace(
  /aria-label="3D map of Tamil Nadu and Kerala"/,
  'aria-label="3D map of Cheyyar Town"'
);

// Loader
html = html.replaceAll("Namma Ooru", "Namma Cheyyar");
html = html.replace(
  /<p class="loader-note" data-i18n="loading">[^<]*<\/p>/,
  '<p class="loader-note" data-i18n="loading">Laying out the streets of Cheyyar…</p>'
);

// Rail Card
html = html.replace(
  /<h2 data-i18n="districtRace">[^<]*<\/h2>/,
  '<h2 data-i18n="districtRace">Cheyyar Ward Race</h2>'
);
html = html.replace(
  /<p data-i18n="howText">[^<]*<\/p>/,
  '<p data-i18n="howText">Walk with WASD or the arrow keys. Press E near an auto or bus to ride. Every point you collect counts for your Cheyyar ward.</p>'
);

fs.writeFileSync('public/index.html', html, 'utf8');
console.log("Updated public/index.html for Cheyyar!");
