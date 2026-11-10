// Home page: one field of particles that re-forms as you scroll.
// stars -> name -> map of connections -> globe.
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
    sphere = Array.from({ length: N }, (_, i) => { const y = 1 - (i + 0.5) / N * 2, rr = Math.sqrt(1 - y * y), t = i * 2.399963; return [Math.cos(t) * rr, y, Math.sin(t) * rr]; });
  }

  function globe(t) {
    const R = Math.min(W, H) * (W < 700 ? 0.4 : 0.34), cx = W / 2, cy = H * (W < 700 ? 0.4 : 0.44), rot = t * 0.12, c = Math.cos(rot), s = Math.sin(rot), tilt = 0.35, ct = Math.cos(tilt), st = Math.sin(tilt);
    return sphere.map(([x, y, z]) => { const X = x * c - z * s, Z = x * s + z * c, Y = y * ct - Z * st, Z2 = y * st + Z * ct; return { x: cx + X * R, y: cy + Y * R, a: 0.12 + 0.75 * (Z2 * 0.5 + 0.5) }; });
  }

  function progress() {
    const r = hero.getBoundingClientRect(), total = hero.offsetHeight - innerHeight;
    return Math.min(1, Math.max(0, -r.top / total));
  }
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function arcText(text, cx, cy, R, center) {
    ctx.font = `400 ${W < 700 ? 15 : 19}px "Inter Tight", system-ui, sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    const widths = [...text].map(ch => ctx.measureText(ch).width), total = widths.reduce((a, b) => a + b, 0);
    let ang = center - total / R / 2;
    [...text].forEach((ch, i) => {
      const a = ang + widths[i] / R / 2;
      ctx.save(); ctx.translate(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.rotate(a + Math.PI / 2); ctx.fillText(ch, 0, 0); ctx.restore();
      ang += widths[i] / R;
    });
  }

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
    if (globeW > 0.3) {
      ctx.globalAlpha = (globeW - 0.3) / 0.7; ctx.fillStyle = "#f0f2f0";
      const R = Math.min(W, H) * (W < 700 ? 0.4 : 0.34) + 18, cy = H * (W < 700 ? 0.4 : 0.44);
      arcText("Nature", W / 2, cy, R, -Math.PI * 0.68);
      arcText("Adventure", W / 2, cy, R, Math.PI * 0.32);
      ctx.globalAlpha = 1;
    }
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
