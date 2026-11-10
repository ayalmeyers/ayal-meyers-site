// Home page: one field of particles that re-forms as you scroll.
// stars -> name -> map of connections -> globe of the world.
(async function () {
  const hero = document.querySelector(".hero"); if (!hero) return;
  const cv = hero.querySelector("canvas"), ctx = cv.getContext("2d");
  const steps = [...hero.querySelectorAll(".step")], hint = hero.querySelector(".scroll-hint");
  const { reduce } = window.SITE_UTIL;
  const KEYS = [[0, "stars"], [0.05, "stars"], [0.19, "name"], [0.31, "name"], [0.47, "network"], [0.65, "network"], [0.81, "globe"], [1, "globe"]];

  let W = 0, H = 0, N = 0, P = [], T = {}, pos = {}, sphere = [], labels = [], netW = 0, globeW = 0;
  const mouse = { x: -1e4, y: -1e4 };

  try { await document.fonts.load('400 120px "Inter Tight"'); } catch (e) {}

  function sampleText(text) {
    const off = document.createElement("canvas"); off.width = W; off.height = H;
    const o = off.getContext("2d");
    let fs = Math.min(W * 0.14, 180);
    o.font = `400 ${fs}px "Inter Tight", system-ui, sans-serif`;
    const tw = o.measureText(text).width; if (tw > W * 0.86) { fs *= W * 0.86 / tw; o.font = `400 ${fs}px "Inter Tight", system-ui, sans-serif`; }
    o.fillStyle = "#fff"; o.textAlign = "center"; o.textBaseline = "middle";
    o.fillText(text, W / 2, H * 0.42);
    const d = o.getImageData(0, 0, W, H).data, pts = [], step = fs > 100 ? 2 : 1;
    for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) if (d[(y * W + x) * 4 + 3] > 140) pts.push([x, y]);
    const r = window.GRAPH.rng(7);
    for (let i = pts.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pts[i], pts[j]] = [pts[j], pts[i]]; }
    return Array.from({ length: N }, (_, i) => { const p = pts[i % pts.length] || [W / 2, H / 2]; return { x: p[0] + (r() - .5) * 1.2, y: p[1] + (r() - .5) * 1.2, a: 0.85 }; });
  }

  function build() {
    const r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.round(r.width); H = Math.round(r.height);
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = W < 700 ? 1700 : 3000;
    if (n !== N) { N = n; P = Array.from({ length: N }, () => ({ x: Math.random() * W, y: Math.random() * H, ph: Math.random() * 6.28, a: 0.5 })); }
    const rnd = window.GRAPH.rng(3);
    T.stars = P.map(() => ({ x: rnd() * W, y: rnd() * H, a: 0.12 + rnd() * 0.5 }));
    T.name = sampleText(window.SITE.name);
    pos = window.GRAPH.place(W, H, W < 700 ? { cy: 0.44, sy: 0.26, sx: 0.38 } : { cy: 0.44, sy: 0.36 });
    T.network = window.GRAPH.points(N, pos, W < 700 ? 7 : 10).map(p => ({ x: p.x, y: p.y, a: p.node ? 0.8 : 0.5 }));
    sphere = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i + 0.5) / N * 2, lat = Math.asin(y), lon = ((i * 2.399963) % (2 * Math.PI)) - Math.PI;
      return { lat, lon, land: isLand(lat, lon) };
    });
  }

  // World map: land bitmap for the particles, coastline and border points for the outline layer.
  const WD = window.WORLD;
  const LAND = WD ? Uint8Array.from(atob(WD.LAND), c => c.charCodeAt(0)) : null;
  function isLand(lat, lon) {
    if (!LAND) return false;
    const row = Math.min(WD.H - 1, Math.max(0, Math.floor(90 - lat * 180 / Math.PI)));
    const col = Math.min(WD.W - 1, Math.max(0, Math.floor(lon * 180 / Math.PI + 180)));
    const k = row * WD.W + col;
    return (LAND[k >> 3] >> (k & 7)) & 1;
  }
  const EDGES = (() => {
    if (!WD) return new Float32Array(0);
    const b = Uint8Array.from(atob(WD.EDGES), c => c.charCodeAt(0)), v = new DataView(b.buffer), n = b.length / 4, out = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) { out[i * 2] = v.getInt16(i * 4, true) / 100 * Math.PI / 180; out[i * 2 + 1] = v.getInt16(i * 4 + 2, true) / 100 * Math.PI / 180; }
    return out;
  })();

  const TILT = 0.38;
  function globeGeom() {
    const small = W < 700;
    return { R: Math.min(W, H) * (small ? 0.4 : 0.34), cx: W / 2, cy: H * (small ? 0.4 : 0.44) };
  }
  // lat/lon to screen; z > 0 faces the viewer
  function project(lat, lon, rot, g) {
    const cl = Math.cos(lat), x = cl * Math.sin(lon + rot), z0 = cl * Math.cos(lon + rot), y0 = Math.sin(lat);
    const y = y0 * Math.cos(TILT) - z0 * Math.sin(TILT), z = z0 * Math.cos(TILT) + y0 * Math.sin(TILT);
    return [g.cx + x * g.R, g.cy - y * g.R, z];
  }
  const spin = t => -1.4 + t * 0.1;

  function globe(t) {
    const g = globeGeom(), rot = spin(t);
    return sphere.map(p => {
      const [x, y, z] = project(p.lat, p.lon, rot, g);
      const face = z * 0.5 + 0.5;
      return { x, y, a: p.land ? 0.1 + 0.85 * face * face : 0.04 + 0.16 * face };
    });
  }

  function drawOutlines(t, w) {
    const g = globeGeom(), rot = spin(t);
    ctx.fillStyle = "#f0f2f0";
    for (let i = 0; i < EDGES.length; i += 2) {
      const [x, y, z] = project(EDGES[i + 1], EDGES[i], rot, g);
      if (z < 0.02) continue;
      ctx.globalAlpha = w * 0.75 * z;
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.globalAlpha = 1;
  }

  function progress() {
    const r = hero.getBoundingClientRect(), total = hero.offsetHeight - innerHeight;
    return Math.min(1, Math.max(0, -r.top / total));
  }
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function frame(now) {
    const t = now / 1000, p = progress();
    let k = 0; while (k < KEYS.length - 2 && p > KEYS[k + 1][0]) k++;
    const [p0, A] = KEYS[k], [p1, B] = KEYS[k + 1];
    const e = p1 > p0 ? ease(Math.min(1, Math.max(0, (p - p0) / (p1 - p0)))) : 0;
    const G = (A === "globe" || B === "globe") ? globe(t) : null;
    const tA = A === "globe" ? G : T[A], tB = B === "globe" ? G : T[B];
    netW = (A === "network" ? 1 - e : 0) + (B === "network" ? e : 0);
    globeW = (A === "globe" ? 1 - e : 0) + (B === "globe" ? e : 0);

    ctx.clearRect(0, 0, W, H);
    // faint edges under the threads
    if (netW > 0.02) {
      ctx.strokeStyle = "#f0f2f0"; ctx.lineWidth = 1; ctx.globalAlpha = netW * 0.07; ctx.beginPath();
      for (const ed of window.SITE.edges) { ctx.moveTo(pos[ed.a][0], pos[ed.a][1]); ctx.lineTo(pos[ed.b][0], pos[ed.b][1]); }
      ctx.stroke();
    }
    ctx.fillStyle = "#f0f2f0";
    const drift = reduce ? 0 : 1, lerp = reduce ? 1 : 0.14;
    for (let i = 0; i < N; i++) {
      const a = tA[i], b = tB[i], q = P[i];
      let x = a.x + (b.x - a.x) * e + Math.sin(t * 0.6 + q.ph) * 1.2 * drift;
      let y = a.y + (b.y - a.y) * e + Math.cos(t * 0.5 + q.ph) * 1.2 * drift;
      const dx = x - mouse.x, dy = y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 90) { const f = (90 - d) / 90 * 26; x += dx / (d || 1) * f; y += dy / (d || 1) * f; }
      q.x += (x - q.x) * lerp; q.y += (y - q.y) * lerp;
      ctx.globalAlpha = a.a + (b.a - a.a) * e;
      ctx.fillRect(q.x, q.y, 1.25, 1.25);
    }
    labels = netW > 0.25 ? window.GRAPH.drawLabels(ctx, pos, () => Math.max(0, (netW - 0.25) / 0.75), W < 700 ? 12 : 14) : [];
    if (globeW > 0.02) drawOutlines(t, globeW);
    steps.forEach(s => { const [a, b] = s.dataset.range.split(",").map(Number); s.classList.toggle("on", p >= a && p <= b); });
    if (hint) hint.style.opacity = p < 0.03 ? 1 : 0;
    requestAnimationFrame(frame);
  }

  cv.addEventListener("pointermove", e => {
    const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    cv.style.cursor = labels.some(b => mouse.x >= b.x0 && mouse.x <= b.x1 && mouse.y >= b.y0 && mouse.y <= b.y1) ? "pointer" : "default";
  });
  cv.addEventListener("pointerleave", () => { mouse.x = mouse.y = -1e4; });
  cv.addEventListener("click", e => {
    const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    const hit = labels.find(b => x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1); if (hit) location.href = hit.href;
  });
  let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(build, 120); });
  build(); requestAnimationFrame(frame);
})();
