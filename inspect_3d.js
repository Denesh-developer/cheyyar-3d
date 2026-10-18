const fs = require('fs');

const index = fs.readFileSync('C:/Users/Administrator/.gemini/antigravity/scratch/nestmedia-clone/index.js', 'utf8');

// Find occurrences of "bake"
const bakeMatches = [...index.matchAll(/.{0,50}bake.{0,50}/g)].map(m => m[0]);
console.log("=== Bake references in index.js ===");
bakeMatches.slice(0, 10).forEach(m => console.log(m));

// Find BufferGeometry, InstancedMesh, or GLTFLoader
console.log("\n=== 3D Engine references ===");
['BufferGeometry', 'InstancedMesh', 'GLTFLoader', 'DRACOLoader', 'TextureLoader', 'MeshStandardMaterial', 'ExtrudeGeometry', 'Shape'].forEach(term => {
  const count = (index.match(new RegExp(term, 'g')) || []).length;
  console.log(`${term}: ${count} occurrences`);
});
