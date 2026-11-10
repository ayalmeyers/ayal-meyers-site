// Connections page: the map stays put while the written connections scroll past.
// The connection being read lights up, with particles travelling along it.
(function () {
  const cv = document.querySelector(".conn .map canvas"); if (!cv) return;
  const ctx = cv.getContext("2d"), S = window.SITE, { reduce, esc, NODE } = window.SITE_UTIL;

  // Write the connections into the page
  const list = document.getElementById("links");
  list.innerHTML = S.edges.map((e, k) => `<div class="link-item" data-edge="${k}">
    <div class="pair"><a href="${NODE[e.a].href}">${esc(NODE[e.a].label)}</a> and <a href="${NODE[e.b].href}">${esc(NODE[e.b].label)}</a></div>
    <p>${esc(e.text)}</p></div>`).join("");
  const blocks = [...list.querySelectorAll(".link-item")];

  let W, H, pos, pts, labels = [], active = -1, hover = null;
  const mouse = { x: -1e4, y: -1e4 };

  function build() {
    const r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pos = window.GRAPH.place(W, H, W < 560 ? { sy: 0.38, sx: 0.38 } : { sy: 0.4, sx: 0.44 });
    pts = window.GRAPH.points(W < 560 ? 1300 : 2400, pos, W < 560 ? 6 : 9).map(p => ({ ...p, ph: Math.random() * 6.28 }));
  }

  function isLit(p) {
    if (hover) return p.node === hover || (p.edge !== undefined && (S.edges[p.edge].a === hover || S.edges[p.edge].b === hover));
    if (active < 0) return true;
    const e = S.edges[active];
    return p.edge === active || p.node === e.a || p.node === e.b;
  }
  function nodeLit(id) {
    if (hover) return id === hover || S.edges.some(e => (e.a === hover && e.b === id) || (e.b === hover && e.a === id));
    if (active < 0) return true;
    return S.edges[active].a === id || S.edges[active].b === id;
  }

  function frame(now) {
    const t = now / 1000;
    ctx.clearRect(0, 0, W, H);
    // lines
    S.edges.forEach((e, k) => {
      const on = hover ? (e.a === hover || e.b === hover) : k === active;
      ctx.globalAlpha = on ? 0.55 : (active < 0 && !hover ? 0.1 : 0.05);
      ctx.strokeStyle = "#f0f2f0"; ctx.lineWidth = on ? 1.2 : 1;
      ctx.beginPath(); ctx.moveTo(...pos[e.a]); ctx.lineTo(...pos[e.b]); ctx.stroke();
    });
    // particles
    ctx.fillStyle = "#f0f2f0";
    for (const p of pts) {
      const d = reduce ? 0 : 1, lit = isLit(p);
      let x = p.x + Math.sin(t * 0.7 + p.ph) * 1.1 * d, y = p.y + Math.cos(t * 0.6 + p.ph) * 1.1 * d;
      const dx = x - mouse.x, dy = y - mouse.y, dist = Math.hypot(dx, dy);
      if (dist < 60) { const f = (60 - dist) / 60 * 14; x += dx / (dist || 1) * f; y += dy / (dist || 1) * f; }
      ctx.globalAlpha = lit ? (p.node ? 0.85 : 0.55) : 0.12;
      ctx.fillRect(x, y, 1.25, 1.25);
    }
    // travellers along the active connection
    const runs = hover ? S.edges.map((e, k) => k).filter(k => S.edges[k].a === hover || S.edges[k].b === hover) : (active >= 0 ? [active] : []);
    if (!reduce) for (const k of runs) {
      const a = pos[S.edges[k].a], b = pos[S.edges[k].b];
      for (let i = 0; i < 6; i++) {
        const u = ((t * 0.18 + i / 6) % 1), x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u;
        ctx.globalAlpha = Math.sin(u * Math.PI) * 0.95; ctx.beginPath(); ctx.arc(x, y, 1.9, 0, 6.283); ctx.fill();
      }
    }
    labels = window.GRAPH.drawLabels(ctx, pos, id => nodeLit(id) ? 1 : 0.28, W < 560 ? 12 : 14);
    if (!reduce || hover !== null) requestAnimationFrame(frame);
  }

  // Which connection is being read
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { active = +en.target.dataset.edge; blocks.forEach(b => b.classList.toggle("on", b === en.target)); if (reduce) requestAnimationFrame(frame); } });
  }, { rootMargin: "-45% 0px -45% 0px" });
  blocks.forEach(b => io.observe(b));
  const lead = document.querySelector(".conn .lead");
  new IntersectionObserver(en => { if (en[0].isIntersecting) { active = -1; blocks.forEach(b => b.classList.remove("on")); if (reduce) requestAnimationFrame(frame); } }, { rootMargin: "-40% 0px -40% 0px" }).observe(lead);

  const hit = (x, y) => labels.find(b => x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1);
  cv.addEventListener("pointermove", e => {
    const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    const h = hit(mouse.x, mouse.y); hover = h ? h.id : null; cv.style.cursor = h ? "pointer" : "default";
    if (reduce) requestAnimationFrame(frame);
  });
  cv.addEventListener("pointerleave", () => { mouse.x = mouse.y = -1e4; hover = null; if (reduce) requestAnimationFrame(frame); });
  cv.addEventListener("click", e => { const r = cv.getBoundingClientRect(), h = hit(e.clientX - r.left, e.clientY - r.top); if (h) location.href = h.href; });

  let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { build(); if (reduce) requestAnimationFrame(frame); }, 120); });
  (document.fonts ? document.fonts.load('400 14px "Inter Tight"') : Promise.resolve()).catch(() => {}).then(() => { build(); requestAnimationFrame(frame); });
})();
