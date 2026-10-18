const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const ARTIFACT_DIR = "C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\79b79cf4-82f9-4a57-ada8-ee294ddd80db";

async function main() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "chrome-test-"));
  const port = 9225;
  console.log("Starting Chrome...");

  const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "--window-size=1280,800",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "http://localhost:3000/"
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const listRes = await fetch(`http://localhost:${port}/json/list`);
  const list = await listRes.json();
  const page = list.find(p => p.type === "page" && p.url.includes("localhost:3000")) || list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 1;
  const send = (method, params = {}) => ws.send(JSON.stringify({ id: id++, method, params }));

  ws.onopen = () => {
    send("Runtime.enable");
    send("Page.enable");
    send("DOM.enable");
  };

  const evalPromise = (expression) => new Promise(resolve => {
    const reqId = id++;
    const listener = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === reqId) {
        ws.removeEventListener("message", listener);
        resolve(msg.result?.result?.value);
      }
    };
    ws.addEventListener("message", listener);
    ws.send(JSON.stringify({ id: reqId, method: "Runtime.evaluate", params: { expression, returnByValue: true } }));
  });

  const captureScreenshot = (filename) => new Promise(resolve => {
    const reqId = id++;
    const listener = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === reqId) {
        ws.removeEventListener("message", listener);
        const buffer = Buffer.from(msg.result.data, "base64");
        const outPath = path.join(ARTIFACT_DIR, filename);
        fs.writeFileSync(outPath, buffer);
        console.log(`Saved screenshot to ${outPath}`);
        resolve(outPath);
      }
    };
    ws.addEventListener("message", listener);
    ws.send(JSON.stringify({ id: reqId, method: "Page.captureScreenshot", params: { format: "png" } }));
  });

  // Wait 4s for login screen
  await new Promise(r => setTimeout(r, 4000));

  console.log("Capturing clean login screen...");
  await captureScreenshot("cheyyar_clean_login_leo.png");

  // Enter game by clicking `#join-go`
  console.log("Clicking join button...");
  await evalPromise(`(() => {
    const btn = document.getElementById("join-go");
    if (btn) btn.click();
    return !!btn;
  })()`);

  // Wait 4s for game world to render
  await new Promise(r => setTimeout(r, 4000));

  console.log("Capturing 3D town gameplay...");
  await captureScreenshot("cheyyar_town_leo_gameplay.png");

  // Check state inside game
  const gameState = await evalPromise(`(() => {
    return {
      bodyClass: document.body.className,
      railHidden: window.getComputedStyle(document.getElementById("rail")).display === "none",
      stageWidth: document.getElementById("stage")?.clientWidth,
      stageHeight: document.getElementById("stage")?.clientHeight,
      whereText: document.querySelector(".where")?.textContent,
      hasTalkiesMarker: document.body.innerHTML.includes("Cheyyar Talkies") || document.body.innerHTML.includes("செய்யாறு டாக்கீஸ்")
    };
  })()`);

  console.log("Game State:", JSON.stringify(gameState, null, 2));

  // Inspect theater info via window.game if available or test door interaction
  const theaterState = await evalPromise(`(async () => {
    try {
      const res = await fetch("/api/index.php?a=theater", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "info" })
      });
      return await res.json();
    } catch (e) {
      return { error: e.message };
    }
  })()`);

  console.log("Theater In-Engine Response:", JSON.stringify(theaterState, null, 2));

  ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (_) {}
  process.exit(0);
}

main().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
