// Connections page: the full map. One connection at a time lights up, with particles
// travelling along it. Hover a label to see everything it touches; click to go there.
(function () {
  const cv = document.querySelector(".conn .map canvas"); if (!cv) return;
  const ctx = cv.getContext("2d"), S = window.SITE, { reduce } = window.SITE_UTIL;

  let W, H, pos, pts, labels = [], active = 0, hover = null, lastSwitch = 0;
  const mouse = { x: -1e4, y: -1e4 };
  const HOLD = 2600; // ms each connection stays lit

  function build() {
    const r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pos = window.GRAPH.place(W, H, W < 560 ? { sy: 0.38, sx: 0.4 } : { sy: 0.4, sx: 0.42 });
    pts = window.GRAPH.points(W < 560 ? 1500 : 3000, pos, W < 560 ? 6 : 10).map(p => ({ ...p, ph: Math.random() * 6.28 }));
  }

  const touches = (e, id) => e.a === id || e.b === id;
  function isLit(p) {
    if (hover) return p.node === hover || (p.edge !== undefined && touches(S.edges[p.edge], hover));
    const e = S.edges[active];
    return p.edge === active || p.node === e.a || p.node === e.b;
  }
  function nodeLit(id) {
    if (hover) return id === hover || S.edges.some(e => touches(e, hover) && touches(e, id));
    return touches(S.edges[active], id);
  }

  function frame(now) {
    const t = now / 1000;
    if (!hover && !reduce && now - lastSwitch > HOLD) { active = (active + 1) % S.edges.length; lastSwitch = now; }
    ctx.clearRect(0, 0, W, H);
    S.edges.forEach((e, k) => {
      const on = hover ? touches(e, hover) : k === active;
      ctx.globalAlpha = on ? 0.55 : 0.06;
      ctx.strokeStyle = "#f0f2f0"; ctx.lineWidth = on ? 1.2 : 1;
      ctx.beginPath(); ctx.moveTo(...pos[e.a]); ctx.lineTo(...pos[e.b]); ctx.stroke();
    });
    ctx.fillStyle = "#f0f2f0";
    for (const p of pts) {
      const d = reduce ? 0 : 1, lit = isLit(p);
      let x = p.x + Math.sin(t * 0.7 + p.ph) * 1.1 * d, y = p.y + Math.cos(t * 0.6 + p.ph) * 1.1 * d;
      const dx = x - mouse.x, dy = y - mouse.y, dist = Math.hypot(dx, dy);
      if (dist < 70) { const f = (70 - dist) / 70 * 16; x += dx / (dist || 1) * f; y += dy / (dist || 1) * f; }
      ctx.globalAlpha = lit ? (p.node ? 0.9 : 0.6) : 0.14;
      ctx.fillRect(x, y, 1.25, 1.25);
    }
    const runs = hover ? S.edges.map((e, k) => k).filter(k => touches(S.edges[k], hover)) : [active];
    if (!reduce) for (const k of runs) {
      const a = pos[S.edges[k].a], b = pos[S.edges[k].b];
      for (let i = 0; i < 6; i++) {
        const u = (t * 0.22 + i / 6) % 1, x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u;
        ctx.globalAlpha = Math.sin(u * Math.PI) * 0.95; ctx.beginPath(); ctx.arc(x, y, 1.9, 0, 6.283); ctx.fill();
      }
    }
    labels = window.GRAPH.drawLabels(ctx, pos, id => nodeLit(id) ? 1 : 0.3, W < 560 ? 12 : 14);
    requestAnimationFrame(frame);
  }

  const hit = (x, y) => labels.find(b => x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1);
  cv.addEventListener("pointermove", e => {
    const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    const h = hit(mouse.x, mouse.y); hover = h ? h.id : null; cv.style.cursor = h ? "pointer" : "default";
  });
  cv.addEventListener("pointerleave", () => { mouse.x = mouse.y = -1e4; hover = null; });
  cv.addEventListener("click", e => { const r = cv.getBoundingClientRect(), h = hit(e.clientX - r.left, e.clientY - r.top); if (h) location.href = h.href; });

  let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(build, 120); });
  (document.fonts ? document.fonts.load('400 14px "Inter Tight"') : Promise.resolve()).catch(() => {}).then(() => { build(); requestAnimationFrame(frame); });
})();
