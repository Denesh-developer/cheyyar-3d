const https = require('https');
const fs = require('fs');
const path = require('path');

const base = 'https://explore.nestmedia.in';
const root = 'C:/Users/Administrator/.gemini/antigravity/scratch/nestmedia-clone';

const filesToDownload = [
  { url: `${base}/favicon.svg`, local: `${root}/favicon.svg` },
  { url: `${base}/og.jpg`, local: `${root}/og.jpg` },
  { url: `${base}/ga.js`, local: `${root}/ga.js` },
  { url: `${base}/privacy.html`, local: `${root}/privacy.html` },
  { url: `${base}/terms.html`, local: `${root}/terms.html` },
  { url: `${base}/fonts/baloo-thambi-2-latin.woff2`, local: `${root}/fonts/baloo-thambi-2-latin.woff2` },
  { url: `${base}/fonts/baloo-thambi-2-tamil.woff2`, local: `${root}/fonts/baloo-thambi-2-tamil.woff2` },
  { url: `${base}/fonts/baloo-chettan-2-malayalam.woff2`, local: `${root}/fonts/baloo-chettan-2-malayalam.woff2` },
  { url: `${base}/images/tamilnadu-welcome-v1.webp`, local: `${root}/images/tamilnadu-welcome-v1.webp` },
  { url: `${base}/images/icon-192.png`, local: `${root}/images/icon-192.png` },
  { url: `${base}/images/icon-512.png`, local: `${root}/images/icon-512.png` }
];

async function fetchFile(item) {
  return new Promise((resolve) => {
    const dir = path.dirname(item.local);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    const file = fs.createWriteStream(item.local);
    https.get(item.url, (res) => {
      if (res.statusCode !== 200) {
        console.warn(`[${res.statusCode}] Failed: ${item.url}`);
        resolve();
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${path.relative(root, item.local)} (${fs.statSync(item.local).size} bytes)`);
        resolve();
      });
    }).on('error', (err) => {
      console.warn(`Error on ${item.url}:`, err.message);
      resolve();
    });
  });
}

(async () => {
  for (const item of filesToDownload) {
    await fetchFile(item);
  }
  console.log("All static assets fetched!");
})();
