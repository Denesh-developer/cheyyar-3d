const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const ARTIFACT_DIR = "C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\79b79cf4-82f9-4a57-ada8-ee294ddd80db";

async function main() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "chrome-controls-"));
  const port = 9234;
  console.log("Starting Chrome...");

  const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "--window-size=1280,800",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-webgl",
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

  // Wait 3s
  await new Promise(r => setTimeout(r, 3000));

  console.log("Setting nickname, clicking Male gender, and submitting join-form...");
  const joinRes = await evalPromise(`(() => {
    const nameInput = document.getElementById("join-name");
    if (nameInput) {
      nameInput.value = "Denesh";
      nameInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
    const maleBtn = document.querySelector('[data-gender="m"]');
    if (maleBtn) maleBtn.click();

    const goBtn = document.getElementById("join-go");
    if (goBtn) goBtn.click();
    else {
      const form = document.getElementById("join-form");
      if (form) form.requestSubmit();
    }
    return "submitted";
  })()`);
  console.log("Join result:", joinRes);

  // Wait until engine enters in-game state
  console.log("Waiting for in-game state...");
  await evalPromise(`(async () => {
    for (let i = 0; i < 20; i++) {
      if (document.body.classList.contains("in-game")) return "ready";
      await new Promise(r => setTimeout(r, 500));
    }
    return document.body.className;
  })()`);

  // Activate touch controls in-game
  console.log("Activating touch joystick and buttons in-game...");
  await evalPromise(`(() => {
    document.body.classList.add("touch-mode");
    const app = document.getElementById("app");
    if (app) app.classList.add("touch-mode");
    const touchEl = document.getElementById("touch");
    if (touchEl) touchEl.hidden = false;
  })()`);

  await new Promise(r => setTimeout(r, 2000));

  console.log("Capturing 3D town world with Mobile Touch Controls & Multiplayer...");
  await captureScreenshot("cheyyar_touch_controls_multiplayer.png");

  // Inspect world state
  const worldState = await evalPromise(`(() => {
    const touchEl = document.getElementById("touch");
    return {
      bodyClass: document.body.className,
      loaderHidden: document.getElementById("loader")?.hasAttribute("hidden"),
      hasModal: !!document.querySelector(".modal"),
      where: document.querySelector(".where")?.textContent,
      score: document.querySelector(".score-num")?.textContent,
      touchVisible: touchEl ? !touchEl.hidden : false
    };
  })()`);

  console.log("World & Touch Controls State:", JSON.stringify(worldState, null, 2));

  ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (_) {}
  process.exit(0);
}

main().catch(err => {
  console.error("Test error:", err);
  process.exit(1);
});
