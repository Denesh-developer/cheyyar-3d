const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

async function main() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "chrome-cdp-"));
  const port = 9224;
  console.log("Starting Chrome with user data dir:", userDataDir);

  const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "http://localhost:3000/"
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const listRes = await fetch(`http://localhost:${port}/json/list`);
  const list = await listRes.json();
  console.log("Pages in Chrome:", list.map(p => ({ url: p.url, type: p.type })));

  const page = list.find(p => p.type === "page" && p.url.includes("localhost:3000")) || list[0];
  console.log("Connecting to:", page.webSocketDebuggerUrl);

  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 1;
  const send = (method, params = {}) => {
    ws.send(JSON.stringify({ id: id++, method, params }));
  };

  ws.onopen = () => {
    send("Runtime.enable");
    send("Log.enable");
    send("Page.enable");
    send("Network.enable");
  };

  const logs = [];
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === "Runtime.consoleAPICalled") {
      const line = `[CONSOLE ${msg.params.type}] ` + msg.params.args.map(a => a.value ?? a.description ?? JSON.stringify(a)).join(" ");
      console.log(line);
      logs.push(line);
    } else if (msg.method === "Runtime.exceptionThrown") {
      const line = `[EXCEPTION THROWN] ` + JSON.stringify(msg.params.exceptionDetails);
      console.error(line);
      logs.push(line);
    } else if (msg.method === "Network.responseReceived") {
      if (msg.params.response.status >= 400) {
        console.error("[HTTP ERROR]", msg.params.response.status, msg.params.response.url);
      }
    }
  };

  // Wait 6 seconds for bundle evaluation, loading, and DOM updates
  await new Promise(r => setTimeout(r, 6000));

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

  const state = await evalPromise(`(() => {
    return {
      title: document.title,
      url: window.location.href,
      bodyClass: document.body.className,
      loader: {
        exists: !!document.getElementById("loader"),
        hidden: document.getElementById("loader")?.hasAttribute("hidden"),
        display: document.getElementById("loader") ? window.getComputedStyle(document.getElementById("loader")).display : null,
        fillWidth: document.getElementById("loader-fill")?.style.width,
        noteText: document.getElementById("loader-note")?.textContent
      },
      modalRoot: {
        childrenCount: document.getElementById("modal-root")?.children.length,
        hasModal: !!document.querySelector(".modal"),
        modalTitle: document.querySelector(".modal-card h2")?.textContent,
        joinDistrict: document.getElementById("join-district")?.outerHTML,
        googleBtn: !!document.getElementById("btn-google-login"),
        anonBtn: !!document.getElementById("btn-anon-login")
      }
    };
  })()`);

  console.log("DOM STATE:", JSON.stringify(state, null, 2));

  ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (_) {}
  process.exit(0);
}

main().catch(err => {
  console.error("Main error:", err);
  process.exit(1);
});
