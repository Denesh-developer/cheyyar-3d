// Google Analytics, loaded from the head of every page (the game, privacy, terms). src/analytics.js
// sends the game's events through it.
window.dataLayer = window.dataLayer || [];
window.gtag = function gtag() {
  window.dataLayer.push(arguments);
};
gtag('js', new Date());
gtag('config', 'G-023JCJ908R', { anonymize_ip: true });
