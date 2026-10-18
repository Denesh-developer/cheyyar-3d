const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.bin': 'application/octet-stream'
};

// Cheyyar Leaderboard
const players = [
  { name: "Denesh", district: "cheyyar", score: 98450 },
  { name: "Vignesh", district: "cheyyar", score: 87920 },
  { name: "Dinesh", district: "cheyyar", score: 81200 },
  { name: "Kavitha", district: "cheyyar", score: 65400 },
  { name: "Praveen", district: "cheyyar", score: 58300 },
  { name: "Anand", district: "cheyyar", score: 49800 },
  { name: "Mani", district: "cheyyar", score: 45200 },
  { name: "Saravanan", district: "cheyyar", score: 42100 },
  { name: "Karthik", district: "cheyyar", score: 39500 },
  { name: "Deepak", district: "cheyyar", score: 34100 }
];

const sessions = new Map();
const onlineTheaterUsers = new Map();
const livePlayers = new Map();

// Leo Film Object
const LEO_FILM = {
  id: "-VPw6akXfiM",
  key: "leo-cheyyar",
  v: 1,
  title: "Leo",
  poster: "/images/posters/leo.jpg",
  genre: "action",
  pending: false,
  cast: [
    { name: "Thalapathy Vijay" },
    { name: "Trisha" },
    { name: "Sanjay Dutt" },
    { name: "Arjun Sarja" }
  ],
  duration: 9840 // 2h 44m
};

// 4 Daily Shows Schedule: 10:00 AM, 2:00 PM, 6:30 PM, 9:00 PM
function getShowStatus(targetDate = new Date()) {
  const SHOWS = [
    { name: "Morning Show", hours: 10, mins: 0, duration: 2 * 3600 + 44 * 60 },
    { name: "Matinee Show", hours: 14, mins: 0, duration: 2 * 3600 + 44 * 60 },
    { name: "Evening Show", hours: 18, mins: 30, duration: 2 * 3600 + 44 * 60 },
    { name: "Night Show",   hours: 21, mins: 0,  duration: 2 * 3600 + 44 * 60 }
  ];

  const nowMs = targetDate.getTime();
  const nowSecs = Math.floor(nowMs / 1000);

  let activeShow = null;
  let nextShow = null;

  for (let dayOffset = -1; dayOffset <= 1; dayOffset++) {
    for (const show of SHOWS) {
      const showDate = new Date(targetDate);
      showDate.setDate(showDate.getDate() + dayOffset);
      showDate.setHours(show.hours, show.mins, 0, 0);
      const startSecs = Math.floor(showDate.getTime() / 1000);
      const endSecs = startSecs + show.duration;

      if (nowSecs >= startSecs && nowSecs < endSecs) {
        activeShow = { ...show, start: startSecs, end: endSecs };
      } else if (startSecs > nowSecs) {
        if (!nextShow || startSecs < nextShow.start) {
          nextShow = { ...show, start: startSecs, end: endSecs };
        }
      }
    }
  }

  // If a scheduled show is active right now
  if (activeShow) {
    const elapsed = (nowSecs - activeShow.start) % LEO_FILM.duration;
    return {
      mode: "daily",
      phase: "running",
      duration: activeShow.duration,
      start: activeShow.start,
      end: activeShow.end,
      next: nextShow ? nextShow.start : activeShow.end + 3600,
      pos: elapsed, // E.g. at 10:30 AM, elapsed = 1800s (30 mins in)
      left: activeShow.end - nowSecs
    };
  }

  // If between shows (e.g. doors open for next show)
  const nextStart = nextShow ? nextShow.start : nowSecs + 1800;
  return {
    mode: "daily",
    phase: "doors",
    duration: LEO_FILM.duration,
    start: 0,
    end: 0,
    next: nextStart,
    pos: 0,
    left: Math.max(0, nextStart - nowSecs)
  };
}

function handleApi(req, res, parsedUrl, body) {
  const action = parsedUrl.query.a;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (action === 'auth-config') {
    res.writeHead(200);
    return res.end(JSON.stringify({ googleClientId: "" }));
  }

  if (action === 'board') {
    res.writeHead(200);
    return res.end(JSON.stringify({
      players,
      online: 128,
      names: ["Denesh", "Vignesh", "Dinesh", "Kavitha", "Praveen"],
      districts: [
        { id: "cheyyar", name: "Cheyyar Town", score: 435200 }
      ]
    }));
  }

  if (action === 'admission') {
    res.writeHead(200);
    return res.end(JSON.stringify({ admitted: true, st: "tn" }));
  }

  if (action === 'load') {
    res.writeHead(200);
    return res.end(JSON.stringify({ ok: true }));
  }

  if (action === 'join') {
    let data = {};
    try { data = JSON.parse(body); } catch (_) {}
    const token = 'tok_' + Math.random().toString(36).substring(2, 12);
    const player = {
      token,
      name: data.name || "செய்யாறு வீரர்",
      district: data.district || "cheyyar",
      score: 100,
      visited: [],
      theaterSeat: null,
      ticketBought: false,
      resumed: false
    };
    sessions.set(token, player);
    players.push({ name: player.name, district: player.district, score: 100 });
    res.writeHead(200);
    return res.end(JSON.stringify({
      admitted: true,
      token: player.token,
      name: player.name,
      district: player.district,
      score: 100,
      visited: [],
      telegramOffered: true,
      whatsappAsked: true
    }));
  }

  if (action === 'sync') {
    let data = {};
    try { data = JSON.parse(body); } catch (_) {}
    const player = sessions.get(data.token) || { score: 100, visited: [] };
    if (Array.isArray(data.events)) {
      player.score += data.events.length * 10;
    }
    res.writeHead(200);
    return res.end(JSON.stringify({
      score: player.score,
      visited: player.visited,
      rank: 1,
      winner: "cheyyar"
    }));
  }

  if (action === 'live') {
    let data = {};
    try { data = JSON.parse(body); } catch (_) {}
    const token = data.token || 'guest';
    let player = sessions.get(token);
    if (!player && token) {
      player = { token, name: "செய்யாறு வீரர்", district: "cheyyar", score: 100 };
      sessions.set(token, player);
    }

    if (data.x !== undefined && data.z !== undefined) {
      livePlayers.set(token, {
        id: token,
        name: player ? player.name : "செய்யாறு வீரர்",
        x: data.x,
        z: data.z,
        h: data.h || 0,
        g: data.g || "m",
        k: data.k || "",
        v: data.v || "",
        say: data.say || "",
        lastSeen: Date.now()
      });
    }

    // Clean up disconnected players (> 15 seconds)
    const now = Date.now();
    for (const [t, p] of livePlayers.entries()) {
      if (now - p.lastSeen > 15000) {
        livePlayers.delete(t);
      }
    }

    // Collect all other active peers
    const peers = [];
    for (const [t, p] of livePlayers.entries()) {
      if (t !== token) {
        peers.push({
          id: p.id,
          name: p.name,
          x: p.x,
          z: p.z,
          h: p.h,
          g: p.g,
          k: p.k,
          v: p.v,
          say: p.say
        });
      }
    }

    // Simulated Cheyyar town citizens for a lively multiplayer world
    const simulatedCitizens = [
      { id: "sim_vignesh", name: "Vignesh (விக்னேஷ்)", g: "m", base: [0, 40], r: 15, speed: 0.0008 },
      { id: "sim_kavitha", name: "Kavitha (கவிதா)", g: "f", base: [-70, -35], r: 12, speed: 0.0006 },
      { id: "sim_dinesh",  name: "Dinesh (தினேஷ்)", g: "m", base: [120, -70], r: 20, speed: 0.0007 },
      { id: "sim_praveen", name: "Praveen (பிரவீன்)", g: "m", base: [20, -15], r: 10, speed: 0.0009 },
      { id: "sim_anand",   name: "Anand (ஆனந்த்)", g: "m", base: [-160, -200], r: 18, speed: 0.0005 }
    ];

    for (const bot of simulatedCitizens) {
      const angle = now * bot.speed;
      const x = +(bot.base[0] + Math.cos(angle) * bot.r).toFixed(2);
      const z = +(bot.base[1] + Math.sin(angle) * bot.r).toFixed(2);
      const h = +(angle + Math.PI / 2).toFixed(3);
      peers.push({
        id: bot.id,
        name: bot.name,
        x,
        z,
        h,
        g: bot.g,
        k: "",
        v: "",
        say: ""
      });
    }

    res.writeHead(200);
    return res.end(JSON.stringify({
      online: Math.max(peers.length + 1, 48),
      leadingDistrict: "cheyyar",
      peers: peers,
      chat: [],
      next: 1000
    }));
  }

  if (action === 'leave') {
    res.writeHead(200);
    return res.end(JSON.stringify({ ok: true }));
  }

  if (action === 'ent') {
    res.writeHead(200);
    return res.end(JSON.stringify({ ok: true, videos: [] }));
  }

  // =========================================================================
  // Cheyyar Talkies Cinema API (Real-Time Playback Sync & Seat Booking)
  // =========================================================================
  if (action === 'theater') {
    let data = {};
    try { data = JSON.parse(body); } catch (_) {}
    const op = data.op || "info";
    const token = data.token;
    let player = token ? sessions.get(token) : null;
    if (!player && token) {
      player = {
        token,
        name: "செய்யாறு ரசிகர்",
        district: "cheyyar",
        score: 100,
        visited: [],
        theaterSeat: null,
        ticketBought: false,
        resumed: false
      };
      sessions.set(token, player);
    }

    const showStatus = getShowStatus();

    // 1. Info Query (Lobby / Cinema Front)
    if (op === 'info') {
      const taken = [];
      for (const [t, u] of onlineTheaterUsers.entries()) {
        if (t !== token && u.seat) {
          taken.push(u.seat);
        }
      }
      res.writeHead(200);
      return res.end(JSON.stringify({
        now: Date.now(),
        film: LEO_FILM,
        status: showStatus,
        shows: [
          { at: "10:00 AM", title: "Morning Show" },
          { at: "2:00 PM", title: "Matinee Show" },
          { at: "6:30 PM", title: "Evening Show" },
          { at: "9:00 PM", title: "Night Show" }
        ],
        ticket: 5,
        audience: Math.max(1, onlineTheaterUsers.size),
        taken: taken,
        seat: player ? player.theaterSeat : null
      }));
    }

    // 2. Buy / Reserve Seat
    if (op === 'buy') {
      const seat = data.seat || (player ? player.theaterSeat : null) || "F12";
      const isResumed = player ? player.ticketBought : false;
      if (player) {
        player.theaterSeat = seat;
        player.ticketBought = true;
        player.resumed = true;
      }
      if (token) {
        onlineTheaterUsers.set(token, {
          seat,
          name: player ? player.name : "செய்யாறு ரசிகர்",
          joinedAt: Date.now()
        });
      }
      res.writeHead(200);
      return res.end(JSON.stringify({
        ok: true,
        seat: seat,
        resumed: isResumed,
        score: player ? player.score : 100,
        free: true
      }));
    }

    // 3. Enter Hall
    if (op === 'enter') {
      const seat = data.seat || (player ? player.theaterSeat : null) || "F12";
      if (player) {
        player.theaterSeat = seat;
        player.ticketBought = true;
      }
      if (token) {
        onlineTheaterUsers.set(token, {
          seat,
          name: player ? player.name : "செய்யாறு ரசிகர்",
          joinedAt: Date.now()
        });
      }
      res.writeHead(200);
      return res.end(JSON.stringify({
        ok: true,
        seat: seat,
        carry: null
      }));
    }

    // 4. Hall Sync Poll
    if (op === 'poll') {
      const members = [];
      for (const [t, u] of onlineTheaterUsers.entries()) {
        if (t !== token) {
          members.push({
            id: t,
            name: u.name,
            seat: u.seat,
            act: "sit"
          });
        }
      }
      res.writeHead(200);
      return res.end(JSON.stringify({
        now: Date.now(),
        status: showStatus,
        film: LEO_FILM,
        me: token || "guest",
        members: members,
        chat: [],
        signals: [],
        ended: false
      }));
    }

    // 5. Exit Hall (Preserves seat booking in player session!)
    if (op === 'leave') {
      if (token) {
        onlineTheaterUsers.delete(token);
      }
      res.writeHead(200);
      return res.end(JSON.stringify({ ok: true }));
    }

    // 6. Ticket Stubs
    if (op === 'stubs') {
      res.writeHead(200);
      return res.end(JSON.stringify({
        stubs: [
          {
            film: "Leo",
            seat: (player ? player.theaterSeat : null) || "F12",
            first: Date.now() - 1800000,
            n: 1,
            state: "cheyyar"
          }
        ]
      }));
    }

    // 7. Cinema Lobby Operations
    if (op === 'lobby') {
      res.writeHead(200);
      return res.end(JSON.stringify({
        members: [],
        chat: [],
        now: Date.now()
      }));
    }

    if (op === 'lobbyleave') {
      res.writeHead(200);
      return res.end(JSON.stringify({ ok: true }));
    }

    if (op === 'tv') {
      res.writeHead(200);
      return res.end(JSON.stringify({ videos: [], offer: null }));
    }

    if (op === 'tvplay' || op === 'tvclaim') {
      res.writeHead(200);
      return res.end(JSON.stringify({ sid: 1, score: 10 }));
    }

    if (op === 'sorry' || op === 'sorrystate') {
      res.writeHead(200);
      return res.end(JSON.stringify({ sorry: "none" }));
    }

    if (op === 'food' || op === 'popcorn' || op === 'grab' || op === 'relax' || op === 'dur' || op === 'rate') {
      if (player && (op === 'food' || op === 'popcorn')) {
        player.score = (player.score || 100) + 10;
      }
      res.writeHead(200);
      return res.end(JSON.stringify({ ok: true, score: player ? player.score : 100 }));
    }

    // Fallback theater response
    res.writeHead(200);
    return res.end(JSON.stringify({ ok: true, now: Date.now(), status: showStatus, film: LEO_FILM }));
  }

  // Default handler
  res.writeHead(200);
  return res.end(JSON.stringify({ ok: true, status: "handled" }));
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.writeHead(204);
    return res.end();
  }

  // API routing
  if (parsedUrl.pathname === '/api/index.php') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      handleApi(req, res, parsedUrl, body);
    });
    return;
  }

  // Static file serving
  let reqPath = decodeURIComponent(parsedUrl.pathname);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  
  const filePath = path.join(PUBLIC_DIR, reqPath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000'
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Cheyyar server running at http://localhost:${PORT}/`);
});
