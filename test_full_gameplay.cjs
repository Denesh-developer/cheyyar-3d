const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const ARTIFACT_DIR = "C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\79b79cf4-82f9-4a57-ada8-ee294ddd80db";

async function main() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "chrome-gameplay-"));
  const port = 9230;
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

  // Wait 3s for page load
  await new Promise(r => setTimeout(r, 3000));

  console.log("Filling nickname and submitting join-form...");
  const joinResult = await evalPromise(`(() => {
    const input = document.getElementById("join-name");
    const form = document.getElementById("join-form");
    if (!input || !form) return "missing elements";
    input.value = "Denesh";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    form.requestSubmit();
    return "submitted";
  })()`);
  console.log("Join result:", joinResult);

  // Wait 5s for 3D engine initialization and world spawn
  await new Promise(r => setTimeout(r, 5000));

  console.log("Enabling Mobile Touch Controls (Joystick & Action Buttons)...");
  await evalPromise(`(() => {
    document.body.classList.add("touch-mode");
    const app = document.getElementById("app");
    if (app) app.classList.add("touch-mode");
    const touchEl = document.getElementById("touch");
    if (touchEl) touchEl.hidden = false;
  })()`);

  await new Promise(r => setTimeout(r, 1000));

  console.log("Capturing 3D town with Mobile Touch Joystick & Buttons...");
  await captureScreenshot("cheyyar_gameplay_touch_joystick.png");

  // Inspect touch controls DOM rects
  const touchRects = await evalPromise(`(() => {
    const stick = document.getElementById("stick");
    const action = document.getElementById("t-action");
    return {
      stick: stick ? stick.getBoundingClientRect() : null,
      action: action ? action.getBoundingClientRect() : null,
      touchHidden: document.getElementById("touch")?.hidden
    };
  })()`);
  console.log("Touch Controls Info:", JSON.stringify(touchRects, null, 2));

  ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (_) {}
  process.exit(0);
}

main().catch(err => {
  console.error("Test error:", err);
  process.exit(1);
});
