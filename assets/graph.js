// Shared geometry for the map of connections (used on the home page and the Connections page).
window.GRAPH = (function () {
  const S = window.SITE;

  // Pixel position of every node for a W x H drawing area.
  function place(W, H, opts = {}) {
    const cy = H * (opts.cy ?? 0.5);
    const sy = H * (opts.sy ?? 0.38);
    const sx = Math.min(W * (opts.sx ?? 0.42), sy * 2.1);
    const cx = W * (opts.cx ?? 0.5);
    const out = {};
    for (const n of S.nodes) out[n.id] = [cx + n.x * sx, cy + n.y * sy];
    return out;
  }

  // Seeded random so the map looks the same on every visit.
  function rng(seed) { let s = seed % 2147483647 || 1; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }
  const gauss = r => (r() + r() + r() + r() - 2) / 2;

  // Spread N particles over the nodes (as small clusters) and along the edges (as threads).
  function points(N, pos, spread = 11) {
    const r = rng(42), pts = [];
    const nNode = Math.round(N * 0.46), per = Math.floor(nNode / S.nodes.length);
    for (const n of S.nodes) {
      const [x, y] = pos[n.id];
      for (let i = 0; i < per; i++) pts.push({ x: x + gauss(r) * spread * 1.6, y: y + gauss(r) * spread * 1.6, node: n.id });
    }
    const lens = S.edges.map(e => { const a = pos[e.a], b = pos[e.b]; return Math.hypot(b[0] - a[0], b[1] - a[1]); });
    const total = lens.reduce((s, l) => s + l, 0), rest = N - pts.length;
    S.edges.forEach((e, k) => {
      const a = pos[e.a], b = pos[e.b], m = k === S.edges.length - 1 ? N - pts.length : Math.round(rest * lens[k] / total);
      const dx = b[0] - a[0], dy = b[1] - a[1], L = lens[k] || 1, nx = -dy / L, ny = dx / L;
      for (let i = 0; i < m; i++) { const t = r(), j = gauss(r) * 1.4; pts.push({ x: a[0] + dx * t + nx * j, y: a[1] + dy * t + ny * j, edge: k }); }
    });
    return pts.slice(0, N);
  }

  // Labels as hit boxes so they can be clicked.
  function drawLabels(ctx, pos, alphaFor, size = 14) {
    const boxes = [];
    ctx.font = `400 ${size}px "Inter Tight", system-ui, sans-serif`;
    ctx.textBaseline = "middle";
    for (const n of S.nodes) {
      const [x, y] = pos[n.id], a = alphaFor(n.id);
      if (a <= 0.01) continue;
      const w = ctx.measureText(n.label).width;
      const narrow = ctx.canvas.clientWidth < 560;
      const left = n.x > 0.45;
      const tx = narrow ? x - w / 2 : (left ? x - 22 - w : x + 22);
      const ty = narrow ? y + 18 : y;
      ctx.globalAlpha = a; ctx.fillStyle = "#f0f2f0"; ctx.textAlign = "left";
      ctx.fillText(n.label, tx, ty);
      boxes.push({ id: n.id, href: n.href, x0: Math.min(tx, x - 16), x1: Math.max(tx + w, x + 16), y0: y - 16, y1: ty + 12 });
    }
    ctx.globalAlpha = 1;
    return boxes;
  }

  return { place, points, drawLabels, rng };
})();
