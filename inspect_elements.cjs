const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

async function checkElements() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "chrome-inspect-"));
  const port = 9227;
  const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    "--remote-debugging-port=" + port,
    "--user-data-dir=" + userDataDir,
    "--window-size=1280,800",
    "http://localhost:3000/"
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const listRes = await fetch("http://localhost:" + port + "/json/list");
  const list = await listRes.json();
  const page = list.find(p => p.type === "page" && p.url.includes("localhost:3000")) || list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 1;
  const evalPromise = (expr) => new Promise(res => {
    const reqId = id++;
    const listener = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === reqId) {
        ws.removeEventListener("message", listener);
        res(msg.result?.result?.value);
      }
    };
    ws.addEventListener("message", listener);
    ws.send(JSON.stringify({ id: reqId, method: "Runtime.evaluate", params: { expression: expr, returnByValue: true } }));
  });

  await new Promise(r => setTimeout(r, 3000));

  const inspection = await evalPromise(`(() => {
    const all = Array.from(document.querySelectorAll("*"));
    const whiteElements = [];
    for (const el of all) {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      if (rect.right > 900 && rect.width > 50 && rect.height > 100) {
        whiteElements.push({
          tag: el.tagName,
          id: el.id,
          cls: el.className,
          rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
          bg: style.backgroundColor,
          display: style.display,
          visibility: style.visibility
        });
      }
    }
    return {
      bodyBg: window.getComputedStyle(document.body).backgroundColor,
      whiteElements
    };
  })()`);

  console.log("Inspection:", JSON.stringify(inspection, null, 2));
  ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (_) {}
}

checkElements().catch(console.error);
