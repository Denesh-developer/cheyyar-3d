const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const ARTIFACT_DIR = "C:\\Users\\Administrator\\.gemini\antigravity\\brain\\79b79cf4-82f9-4a57-ada8-ee294ddd80db";

async function main() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "chrome-th-"));
  const port = 9231;
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

  await new Promise(r => setTimeout(r, 3000));

  console.log("Submitting join...");
  await evalPromise(`(() => {
    const form = document.getElementById("join-form");
    if (form) form.requestSubmit();
  })()`);

  // Wait 4s for world spawn
  await new Promise(r => setTimeout(r, 4000));

  // Find cinema spot in game and trigger door
  console.log("Locating cinema and triggering door...");
  const doorResult = await evalPromise(`(async () => {
    try {
      // Find door or trigger theater
      const markers = Array.from(document.querySelectorAll(".marker, .th-door, [data-theater]"));
      const cinemaEl = document.querySelector('[data-search*="talkies"]');
      
      // Also fetch theater info directly to check status
      const res = await fetch("/api/index.php?a=theater", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "info" })
      });
      const info = await res.json();
      return {
        info,
        markersCount: markers.length,
        hasCinemaEl: !!cinemaEl
      };
    } catch (e) {
      return { error: e.message };
    }
  })()`);

  console.log("Door Interaction Info:", JSON.stringify(doorResult, null, 2));

  // Test buying ticket and entering hall
  const bookingResult = await evalPromise(`(async () => {
    try {
      // 1. Buy ticket for seat E10
      const buyRes = await fetch("/api/index.php?a=theater", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "buy", seat: "E10" })
      });
      const buy = await buyRes.json();

      // 2. Poll theater
      const pollRes = await fetch("/api/index.php?a=theater", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "poll" })
      });
      const poll = await pollRes.json();

      // 3. Re-enter test
      const reenterRes = await fetch("/api/index.php?a=theater", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "buy" })
      });
      const reenter = await reenterRes.json();

      return { buy, poll, reenter };
    } catch (e) {
      return { error: e.message };
    }
  })()`);

  console.log("Booking & Playback Verification:", JSON.stringify(bookingResult, null, 2));

  ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (_) {}
  process.exit(0);
}

main().catch(err => {
  console.error("Interaction test failed:", err);
  process.exit(1);
});
