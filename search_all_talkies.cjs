const fs = require("fs");
const path = require("path");

function searchDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".git") {
      searchDir(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith(".js") || entry.name.endsWith(".json") || entry.name.endsWith(".html") || entry.name.endsWith(".css"))) {
      try {
        const text = fs.readFileSync(fullPath, "utf8");
        const lower = text.toLowerCase();
        if (lower.includes("tamil nadu talkies") || lower.includes("tamilnadu talkies") || text.includes("தமிழ்நாடு டாக்கீஸ்")) {
          console.log(`FOUND in ${fullPath}!`);
        }
        // Also check "talkies"
        let p = 0;
        while (true) {
          let idx = lower.indexOf("talkies", p);
          if (idx === -1) break;
          console.log(`"talkies" in ${fullPath} at ${idx}:`, text.slice(Math.max(0, idx - 40), idx + 80));
          p = idx + 7;
        }
      } catch (_) {}
    }
  }
}

searchDir("public");
