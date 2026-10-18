const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const ARTIFACT_DIR = "C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\79b79cf4-82f9-4a57-ada8-ee294ddd80db";

async function main() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "chrome-test-features-"));
  const port = 9232;
  console.log("Starting Chrome with mobile simulation...");

  const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "--window-size=850,420", // Mobile smartphone landscape dimensions
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
    ws.send(JSON.stringify({ id: reqId, method: "Runtime.evaluate", params: { expression, awaitPromise: true, returnByValue: true } }));
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

  // Wait 4s for modal
  await new Promise(r => setTimeout(r, 4000));

  console.log("Submitting join in mobile view...");
  await evalPromise(`(() => {
    const nameInput = document.getElementById("join-name");
    if (nameInput) {
      nameInput.value = "Denesh";
      nameInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
    const form = document.getElementById("join-form");
    if (form) form.requestSubmit();
  })()`);

  // Wait 6s for world, multiplayer peers and joystick to initialize
  await new Promise(r => setTimeout(r, 6000));

  console.log("Capturing Mobile Screen with Touch Controls & 3D Town...");
  await captureScreenshot("cheyyar_mobile_touch_controls.png");

  // Inspect state
  const state = await evalPromise(`(() => {
    const touchEl = document.getElementById("touch");
    const stick = document.getElementById("stick");
    const tAction = document.getElementById("t-action");
    return {
      bodyClass: document.body.className,
      appClass: document.getElementById("app")?.className,
      touchVisible: touchEl ? !touchEl.hidden : false,
      stickRect: stick ? stick.getBoundingClientRect() : null,
      tActionRect: tAction ? tAction.getBoundingClientRect() : null
    };
  })()`);

  console.log("Mobile Controls State:", JSON.stringify(state, null, 2));

  ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (_) {}
  process.exit(0);
}

main().catch(err => {
  console.error("Test error:", err);
  process.exit(1);
});
