const https = require('https');
const fs = require('fs');
const path = require('path');

const chunks = [
  'ta-CUxBAER_.js',
  'ml-CifySex0.js',
  'kn-D-kLTUSe.js',
  'core-CnkT7A_l.js',
  'ka-BvrdYJtA.js',
  'kl-Lw99zddm.js',
  'tn-CXBv6geO.js',
  'lobby-DU5i-580.js',
  'theaterhall-u7bMEcwh.js',
  'theaterfight-B2k-hIkV.js',
  'menu-BTNkvwM_.js',
  'stageshow-DzHSup2a.js',
  'cook-CWEadmcr.js',
  'scene-DeWLli6X.js',
  'sound-BuQ_gNNg.js',
  'commentary-pUB1MWWY.js',
  'mate-Y9gUXTBF.js',
  'filmtest-CeY4UVLt.js',
  'mate-Cj_EUvfH.css'
];

const targetDir = 'C:/Users/Administrator/.gemini/antigravity/scratch/nestmedia-clone/chunks';
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

async function download(chunk) {
  return new Promise((resolve) => {
    const url = `https://explore.nestmedia.in/assets/${chunk}`;
    const filePath = path.join(targetDir, chunk);
    const file = fs.createWriteStream(filePath);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${chunk} (${fs.statSync(filePath).size} bytes)`);
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Error downloading ${chunk}:`, err.message);
      resolve();
    });
  });
}

(async () => {
  for (const c of chunks) {
    await download(c);
  }
  console.log("All chunks downloaded successfully!");
})();
