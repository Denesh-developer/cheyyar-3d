/* firebase-net.js
 * Serverless replacement for /api/index.php using Firebase Auth + Realtime Database.
 * Put this file in your site root (public/firebase-net.js) and load it as the FIRST
 * <script> in <head> of index.html, before the game bundle.
 *
 * Step 1 covers: admission, leave, join, sync (score/visited), live (multiplayer
 * players), board (leaderboard). Everything else answers "not available" for now.
 */
(function () {
  'use strict';

  var API_PATH = '/api/index.php';
  var SDK = 'https://www.gstatic.com/firebasejs/10.14.1/';
  var CONFIG = {
    apiKey: 'AIzaSyA1fTOCSYtLd8m9bhZkgGKFzj-Dh2YDkO0',
    authDomain: 'cheyyar-3d.firebaseapp.com',
    databaseURL: 'https://cheyyar-3d-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'cheyyar-3d',
    storageBucket: 'cheyyar-3d.firebasestorage.app',
    messagingSenderId: '884742180730',
    appId: '1:884742180730:web:89d031667e7a7b1de650c3'
  };

  var LIVE_EVERY_MS = 1500;   // how often the game should send its position
  var STALE_MS = 25000;       // players not updated for this long are hidden
  var MAX_EVENT_POINTS = 5000;

  var nativeFetch = window.fetch.bind(window);
  var fbPromise = null;
  var state = { profile: null, liveStarted: false, peers: {}, offset: 0 };

  function json(obj, status) {
    return new Response(JSON.stringify(obj), {
      status: status || 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  function load() {
    if (fbPromise) return fbPromise;
    fbPromise = (async function () {
      var mods = await Promise.all([
        import(SDK + 'firebase-app.js'),
        import(SDK + 'firebase-auth.js'),
        import(SDK + 'firebase-database.js')
      ]);
      var appM = mods[0], authM = mods[1], dbM = mods[2];
      var app = appM.getApps().length ? appM.getApp() : appM.initializeApp(CONFIG);
      var auth = authM.getAuth(app);
      await auth.authStateReady();
      if (!auth.currentUser) await authM.signInAnonymously(auth);
      var db = dbM.getDatabase(app);
      return { authM: authM, dbM: dbM, auth: auth, db: db, uid: auth.currentUser.uid };
    })();
    fbPromise.catch(function () { fbPromise = null; });
    return fbPromise;
  }

  function numId(uid) {
    var h = 2166136261;
    for (var i = 0; i < uid.length; i++) {
      h ^= uid.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return (h % 900000000) + 1000;
  }

  function toArray(v) {
    if (!v) return [];
    return Array.isArray(v) ? v.slice() : Object.keys(v).map(function (k) { return v[k]; });
  }

  function cleanName(n) {
    n = String(n == null ? '' : n).replace(/[<>]/g, '').trim().slice(0, 24);
    return n || ('Guest_' + Math.floor(1000 + Math.random() * 9000));
  }

  /* ---------------- actions ---------------- */

  async function admission() {
    return json({ admitted: true });
  }

  async function leave() {
    try {
      var f = await load();
      await f.dbM.remove(f.dbM.ref(f.db, 'players/' + f.uid));
    } catch (e) { /* ignore */ }
    return json({ ok: true });
  }

  async function join(b) {
    var f = await load(), d = f.dbM, uid = f.uid;
    var ref = d.ref(f.db, 'users/' + uid);
    var snap = await d.get(ref);
    var cur = snap.val();
    var name = cleanName(b.name || (cur && cur.name));
    var district = String(b.district || (cur && cur.district) || 'cheyyar');
    var score = cur && !b.reset ? (cur.score || 0) : 0;
    var visited = cur && !b.reset ? toArray(cur.visited) : [];
    await d.set(ref, { name: name, district: district, score: score, visited: visited, seen: d.serverTimestamp() });
    state.profile = { name: name, district: district };
    d.set(d.ref(f.db, 'board/' + uid), { name: name, district: district, score: score });
    return json({
      token: uid, name: name, district: district, score: score, visited: visited,
      rank: null, rated: true
    });
  }

  async function sync(b) {
    var f = await load(), d = f.dbM, uid = f.uid;
    var events = Array.isArray(b.events) ? b.events : [];
    var ref = d.ref(f.db, 'users/' + uid);
    var res = await d.runTransaction(ref, function (cur) {
      cur = cur || { name: (state.profile && state.profile.name) || 'Guest', district: 'cheyyar', score: 0, visited: [] };
      var vis = toArray(cur.visited);
      var score = cur.score || 0;
      events.forEach(function (e) {
        if (typeof e.p === 'number' && isFinite(e.p)) {
          score += Math.max(-MAX_EVENT_POINTS, Math.min(MAX_EVENT_POINTS, e.p));
        }
        if (e.k === 'visit' && e.id != null && vis.indexOf(e.id) < 0) vis.push(e.id);
      });
      cur.score = Math.max(0, Math.round(score));
      cur.visited = vis;
      return cur;
    });
    var v = res.snapshot.val() || { score: 0, visited: [] };
    d.set(d.ref(f.db, 'board/' + uid), {
      name: v.name || 'Guest', district: v.district || 'cheyyar', score: v.score || 0
    });
    return json({ score: v.score || 0, visited: toArray(v.visited), rank: null });
  }

  async function startLive(f) {
    var d = f.dbM;
    state.liveStarted = true;
    d.onDisconnect(d.ref(f.db, 'players/' + f.uid)).remove();
    d.onValue(d.ref(f.db, '.info/serverTimeOffset'), function (s) { state.offset = s.val() || 0; });
    d.onValue(d.ref(f.db, 'players'), function (s) { state.peers = s.val() || {}; });
  }

  async function live(b) {
    var f = await load(), d = f.dbM, uid = f.uid;
    if (!state.liveStarted) await startLive(f);

    var rec = {
      n: (state.profile && state.profile.name) || 'Guest',
      x: +b.x || 0, z: +b.z || 0, h: +b.h || 0,
      v: typeof b.v === 'string' ? b.v : '',
      g: typeof b.g === 'string' ? b.g : '',
      k: typeof b.k === 'string' ? b.k : '',
      ts: d.serverTimestamp()
    };
    d.set(d.ref(f.db, 'players/' + uid), rec);

    var now = Date.now() + state.offset;
    var peers = [];
    Object.keys(state.peers).forEach(function (id) {
      if (id === uid) return;
      var p = state.peers[id];
      if (!p || typeof p.x !== 'number') return;
      if (typeof p.ts === 'number' && now - p.ts > STALE_MS) return;
      peers.push({
        id: numId(id), name: p.n || 'Guest', x: p.x, z: p.z, h: p.h || 0,
        v: p.v || '', g: p.g || '', k: p.k || '', t: 0, a: 0
      });
    });
    return json({ peers: peers, next: LIVE_EVERY_MS, voices: [], me: numId(uid) });
  }

  async function board() {
    var f = await load(), d = f.dbM;
    var q = d.query(d.ref(f.db, 'board'), d.orderByChild('score'), d.limitToLast(50));
    var snap = await d.get(q);
    var rows = [];
    snap.forEach(function (c) { rows.push(c.val()); });
    rows.sort(function (a, b) { return (b.score || 0) - (a.score || 0); });
    var byDistrict = {};
    rows.forEach(function (r) {
      var id = r.district || 'cheyyar';
      var o = byDistrict[id] || (byDistrict[id] = { id: id, players: 0, score: 0 });
      o.players++; o.score += r.score || 0;
    });
    var now = Date.now() + state.offset, online = 0;
    Object.keys(state.peers).forEach(function (id) {
      var p = state.peers[id];
      if (p && (typeof p.ts !== 'number' || now - p.ts <= STALE_MS)) online++;
    });
    return json({
      districts: Object.keys(byDistrict).map(function (k) { return byDistrict[k]; })
        .sort(function (a, b) { return b.score - a.score; }),
      players: rows.map(function (r) {
        return { name: r.name || 'Guest', district: r.district || 'cheyyar', score: r.score || 0 };
      }),
      online: online
    });
  }

  var handlers = {
    admission: admission,
    leave: leave,
    join: join,
    sync: sync,
    live: live,
    board: board,
    'auth-config': async function () { return json({}); },
    ref: async function () { return json({ ok: true }); },
    load: async function () { return json({}); }
  };

  /* ---------------- fetch interception ---------------- */

  window.fetch = function (input, init) {
    try {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      var u = new URL(url, location.href);
      if (u.origin === location.origin && u.pathname === API_PATH) {
        var action = u.searchParams.get('a') || '';
        var body = {};
        try { body = init && init.body ? JSON.parse(init.body) : {}; } catch (e) { body = {}; }
        var h = handlers[action];
        if (!h) return Promise.resolve(json({ error: 'not_available' }, 501));
        return h(body).catch(function (err) {
          console.error('[firebase-net]', action, err);
          return json({ error: 'server' }, 500);
        });
      }
    } catch (e) { /* fall through to the real fetch */ }
    return nativeFetch(input, init);
  };

  window.__firebaseNet = { state: state, handlers: handlers };
})();
