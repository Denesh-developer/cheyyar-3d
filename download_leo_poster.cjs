const fs = require("fs");
const path = require("path");

fs.mkdirSync("public/images/posters", { recursive: true });

async function download() {
  const urls = [
    "https://i.ytimg.com/vi/-VPw6akXfiM/maxresdefault.jpg",
    "https://i.ytimg.com/vi/-VPw6akXfiM/hqdefault.jpg"
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 5000) {
          fs.writeFileSync("public/images/posters/leo.jpg", buf);
          console.log("Saved poster from", url, "size:", buf.length);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
}

download().catch(console.error);
