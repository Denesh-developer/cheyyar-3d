const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

async function checkJoin() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "chrome-join-"));
  const port = 9228;
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
  const send = (method, params = {}) => ws.send(JSON.stringify({ id: id++, method, params }));

  ws.onopen = () => {
    send("Runtime.enable");
    send("Network.enable");
  };

  const netLogs = [];
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === "Network.requestWillBeSent") {
      netLogs.push(`[REQ] ${msg.params.request.method} ${msg.params.request.url}`);
    } else if (msg.method === "Network.responseReceived") {
      netLogs.push(`[RES] ${msg.params.response.status} ${msg.params.response.url}`);
    } else if (msg.method === "Runtime.consoleAPICalled") {
      netLogs.push(`[CONSOLE] ` + msg.params.args.map(a => a.value ?? a.description ?? "").join(" "));
    }
  };

  await new Promise(r => setTimeout(r, 3000));

  console.log("Clicking join-go...");
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

  await evalPromise(`document.getElementById("join-go").click()`);

  await new Promise(r => setTimeout(r, 4000));

  console.log("Logs:", netLogs.join("\n"));

  ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (_) {}
}

checkJoin().catch(console.error);
