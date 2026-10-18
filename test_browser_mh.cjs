const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

async function testBrowserMh() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "chrome-mh-"));
  const port = 9229;
  const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    "--remote-debugging-port=" + port,
    "--user-data-dir=" + userDataDir,
    "http://localhost:3000/"
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const listRes = await fetch("http://localhost:" + port + "/json/list");
  const list = await listRes.json();
  const page = list.find(p => p.type === "page" && p.url.includes("localhost:3000")) || list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 1;
  const send = (method, params = {}) => ws.send(JSON.stringify({ id: id++, method, params }));

  ws.onopen = () => {
    send("Runtime.enable");
  };

  const evalPromise = (expr) => new Promise(res => {
    const reqId = id++;
    const listener = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === reqId) {
        ws.removeEventListener("message", listener);
        res(msg.result);
      }
    };
    ws.addEventListener("message", listener);
    ws.send(JSON.stringify({ id: reqId, method: "Runtime.evaluate", params: { expression: expr, awaitPromise: true, returnByValue: true } }));
  });

  await new Promise(r => setTimeout(r, 3000));

  console.log("Evaluating fetch in browser...");
  const res = await evalPromise(`(async () => {
    try {
      const r = await fetch("/api/index.php?a=admission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket: "test" })
      });
      return { status: r.status, data: await r.json() };
    } catch (e) {
      return { error: e.message, stack: e.stack };
    }
  })()`);

  console.log("Fetch admission from browser:", JSON.stringify(res, null, 2));

  // Check what happens on join-form submit
  const submitRes = await evalPromise(`(async () => {
    const form = document.getElementById("join-form");
    if (!form) return "no form";
    const nameInput = document.getElementById("join-name");
    if (nameInput) nameInput.value = "Denesh";
    return {
      name: nameInput?.value,
      district: document.getElementById("join-district")?.value,
      action: form.action
    };
  })()`);

  console.log("Join Form State:", JSON.stringify(submitRes, null, 2));

  ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (_) {}
}

testBrowserMh().catch(console.error);
