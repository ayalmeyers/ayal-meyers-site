// Forms the home page particles pass through before the visitor scrolls.
// Each pair is something in nature and something people made, or two things in nature
// that share a shape: birds and jets, ocean waves and sound waves, a tree and lungs,
// a neuron, an eye and a galaxy, a nautilus, a forest and a cathedral.
// Each form is drawn to an offscreen canvas and sampled into particle positions.
window.FORMS = (function () {
  const TAU = Math.PI * 2;
  function rng(seed) { let s = seed % 2147483647 || 1; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

  // Each form returns a list of objects; each object draws itself (white) in unit space:
  // (0,0) is the centre, 1 unit is half the drawing box.
  const BIRD_SPOTS = [
    [-0.62, -0.5, 0.24, -0.5], [-0.12, -0.66, 0.2, -0.15], [0.32, -0.6, 0.19, 0.25], [0.7, -0.3, 0.18, 0.7],
    [0.8, 0.12, 0.16, 1.1], [-0.82, 0.02, 0.22, -1.0], [-0.7, 0.5, 0.2, -1.5], [0.18, 0.3, 0.12, 0.15], [-0.15, 0.55, 0.1, 0.1]
  ];
  function place(ctx, x, y, s, rot, draw) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); draw(ctx); ctx.restore(); }

  const forms = {
    birds: () => BIRD_SPOTS.map(([x, y, s, r]) => ctx => place(ctx, x, y, s * 1.15, r * 0.35, c => {
      // a gliding bird seen from below: swept wings, short body, forked tail
      c.beginPath();
      c.moveTo(0, -0.34);
      c.quadraticCurveTo(0.22, -0.3, 0.42, -0.28);
      c.quadraticCurveTo(0.75, -0.24, 1, -0.02);
      c.quadraticCurveTo(0.7, 0.0, 0.4, 0.08);
      c.quadraticCurveTo(0.2, 0.12, 0.12, 0.2);
      c.lineTo(0.22, 0.5); c.lineTo(0.06, 0.36); c.lineTo(0, 0.42);
      c.lineTo(-0.06, 0.36); c.lineTo(-0.22, 0.5); c.lineTo(-0.12, 0.2);
      c.quadraticCurveTo(-0.2, 0.12, -0.4, 0.08);
      c.quadraticCurveTo(-0.7, 0.0, -1, -0.02);
      c.quadraticCurveTo(-0.75, -0.24, -0.42, -0.28);
      c.quadraticCurveTo(-0.22, -0.3, 0, -0.34);
      c.closePath(); c.fill();
    })),

    jets: () => BIRD_SPOTS.map(([x, y, s, r]) => ctx => place(ctx, x, y, s * 1.05, r, c => {
      const half = [[0, -1], [0.07, -0.72], [0.1, -0.2], [0.95, 0.38], [0.95, 0.5], [0.12, 0.34], [0.13, 0.72], [0.42, 0.92], [0.42, 1], [0, 0.9]];
      c.beginPath();
      half.forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py));
      for (let i = half.length - 1; i >= 0; i--) c.lineTo(-half[i][0], half[i][1]);
      c.closePath(); c.fill();
    })),

    ocean: () => [-0.5, 0, 0.5].map((row, k) => ctx => {
      const L = 0.42 - k * 0.04, r = L * 0.15, amp = 1 + k * 0.25;
      ctx.lineWidth = 0.022; ctx.beginPath();
      for (let th = -TAU * 3; th <= TAU * 3; th += 0.04) {
        const x = th / TAU * L - r * Math.sin(th) + k * 0.1, y = row - r * amp * Math.cos(th);
        th === -TAU * 3 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      // curling crests
      for (let n = -3; n <= 3; n++) {
        const cx = n * L + k * 0.1 + L * 0.06, cy = row - r * amp * 0.75;
        ctx.beginPath();
        for (let a = 0; a < TAU * 1.1; a += 0.1) { const rr = r * 0.55 * (1 - a / (TAU * 1.4)); ctx.lineTo(cx + Math.cos(a + 3.6) * rr, cy + Math.sin(a + 3.6) * rr); }
        ctx.stroke();
      }
    }),

    sound: () => [-0.5, 0, 0.5].map((row, k) => ctx => {
      ctx.lineWidth = 0.014;
      for (let x = -1.1; x <= 1.1; x += 0.028) {
        const env = Math.pow(Math.cos(x / 1.1 * Math.PI / 2), 0.6);
        const h = env * (0.05 + 0.13 * Math.abs(Math.sin(x * (7 + k * 3)) * Math.cos(x * (2.3 + k)) + 0.35 * Math.sin(x * 23 + k)));
        ctx.beginPath(); ctx.moveTo(x, row - h); ctx.lineTo(x, row + h); ctx.stroke();
      }
    }),

    tree: () => [ctx => {
      const r = rng(11);
      ctx.lineCap = "round";
      (function branch(x, y, ang, len, w, d) {
        const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
        ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
        if (d === 0) return;
        const spread = 0.32 + r() * 0.18;
        branch(x2, y2, ang - spread + (r() - 0.5) * 0.15, len * (0.68 + r() * 0.1), w * 0.68, d - 1);
        branch(x2, y2, ang + spread + (r() - 0.5) * 0.15, len * (0.68 + r() * 0.1), w * 0.68, d - 1);
      })(0, 0.95, -Math.PI / 2, 0.5, 0.06, 9);
    }],

    lungs: () => {
      const r = rng(23);
      function bronchi(ctx, x, y, ang, len, w, d, side) {
        const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
        ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
        if (d === 0) return;
        const s = 0.34 + r() * 0.2;
        bronchi(ctx, x2, y2, ang - s, len * 0.72, w * 0.7, d - 1, side);
        bronchi(ctx, x2, y2, ang + s, len * 0.72, w * 0.7, d - 1, side);
      }
      return [
        ctx => { ctx.lineCap = "round"; ctx.lineWidth = 0.05; ctx.beginPath(); ctx.moveTo(0, -0.95); ctx.lineTo(0, -0.4); ctx.stroke(); },
        ctx => { ctx.lineCap = "round"; bronchi(ctx, 0, -0.4, Math.PI * 0.72, 0.32, 0.04, 7, -1); },
        ctx => { ctx.lineCap = "round"; bronchi(ctx, 0, -0.4, Math.PI * 0.28, 0.32, 0.04, 7, 1); },
        ctx => {
          ctx.lineWidth = 0.012;
          for (const s of [-1, 1]) {
            ctx.beginPath(); ctx.moveTo(s * 0.12, -0.55);
            ctx.bezierCurveTo(s * 0.55, -0.85, s * 0.95, -0.2, s * 0.85, 0.75);
            ctx.bezierCurveTo(s * 0.6, 0.95, s * 0.2, 0.8, s * 0.12, 0.45);
            ctx.stroke();
          }
        }
      ];
    },

    neuron: () => {
      const r = rng(37);
      function dend(ctx, x, y, ang, len, w, d) {
        const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
        ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo((x + x2) / 2 + (r() - 0.5) * len * 0.4, (y + y2) / 2 + (r() - 0.5) * len * 0.4, x2, y2); ctx.stroke();
        if (d === 0) return;
        dend(ctx, x2, y2, ang - 0.45 - r() * 0.3, len * 0.7, w * 0.7, d - 1);
        dend(ctx, x2, y2, ang + 0.45 + r() * 0.3, len * 0.7, w * 0.7, d - 1);
      }
      const sx = -0.35, sy = 0;
      return [
        ctx => { ctx.beginPath(); ctx.arc(sx, sy, 0.1, 0, TAU); ctx.fill(); },
        ctx => { ctx.lineCap = "round"; for (let i = 0; i < 6; i++) { const a = Math.PI * 0.55 + i / 5 * Math.PI * 0.9; dend(ctx, sx + Math.cos(a) * 0.08, sy + Math.sin(a) * 0.08, a, 0.22, 0.03, 4); } },
        ctx => {
          ctx.lineCap = "round"; ctx.lineWidth = 0.025; ctx.beginPath(); ctx.moveTo(sx + 0.09, sy);
          ctx.bezierCurveTo(0.1, -0.12, 0.35, 0.12, 0.7, 0); ctx.stroke();
          for (let i = 0; i < 5; i++) dend(ctx, 0.7, 0, -0.9 + i * 0.45, 0.14, 0.018, 2);
        }
      ];
    },

    eye: () => [
      ctx => {
        ctx.lineWidth = 0.035; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(-1, 0); ctx.quadraticCurveTo(0, -0.95, 1, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-1, 0); ctx.quadraticCurveTo(0, 0.85, 1, 0); ctx.stroke();
        ctx.lineWidth = 0.018;
        for (let i = 0; i < 13; i++) { const u = -0.75 + i / 12 * 1.5, y = -0.475 * (1 - u * u) * 0.98; ctx.beginPath(); ctx.moveTo(u, y); ctx.lineTo(u * 1.12, y - 0.13); ctx.stroke(); }
      },
      ctx => {
        const r = rng(5); ctx.lineWidth = 0.012;
        for (let i = 0; i < 90; i++) { const a = i / 90 * TAU + r() * 0.05, r0 = 0.13, r1 = 0.33 - r() * 0.04; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); ctx.lineTo(Math.cos(a + 0.05) * r1, Math.sin(a + 0.05) * r1); ctx.stroke(); }
        ctx.lineWidth = 0.025; ctx.beginPath(); ctx.arc(0, 0, 0.34, 0, TAU); ctx.stroke();
      },
      ctx => { ctx.beginPath(); ctx.arc(0, 0, 0.12, 0, TAU); ctx.fill(); }
    ],

    galaxy: () => [0, 1].map(arm => ctx => {
      const r = rng(71 + arm), g = () => (r() + r() + r() - 1.5);
      for (let i = 0; i < 1400; i++) {
        const th = Math.pow(r(), 0.7) * 3.2 * Math.PI, rad = 0.06 * Math.exp(0.2 * th), spread = 0.012 + rad * 0.07;
        const a = th + arm * Math.PI, x = Math.cos(a) * rad + g() * spread, y = (Math.sin(a) * rad + g() * spread) * 0.78;
        ctx.beginPath(); ctx.arc(x * 1.75, y * 1.75, 0.006 + r() * 0.006, 0, TAU); ctx.fill();
      }
      if (arm === 0) for (let i = 0; i < 160; i++) { const a = r() * TAU, d = Math.abs(g()) * 0.09; ctx.beginPath(); ctx.arc(Math.cos(a) * d * 1.2, Math.sin(a) * d * 1.0, 0.012, 0, TAU); ctx.fill(); }
    }),

    nautilus: () => {
      const b = Math.log(1.618) / (Math.PI / 2), a = 0.012, rot = 2.2;
      const P = th => { const rr = a * Math.exp(b * th); return [Math.cos(th + rot) * rr - 0.05, Math.sin(th + rot) * rr * 0.92]; };
      return [
        ctx => { ctx.lineWidth = 0.03; ctx.lineCap = "round"; ctx.beginPath(); for (let th = 2; th <= 4 * Math.PI + 1.4; th += 0.03) ctx.lineTo(...P(th)); ctx.stroke(); },
        ctx => {
          ctx.lineWidth = 0.014;
          for (let th = 2 * Math.PI + 0.3; th <= 4 * Math.PI + 1.3; th += 0.36) {
            const [x1, y1] = P(th), [x0, y0] = P(th - 2 * Math.PI), [mx, my] = P(th - 0.25);
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo((x0 + mx) / 2, (y0 + my) / 2, x0, y0); ctx.stroke();
          }
        }
      ];
    },

    forest: () => {
      const cols = [-0.8, -0.4, 0, 0.4, 0.8], r = rng(91);
      return cols.map((x, i) => ctx => {
        ctx.lineCap = "round"; ctx.lineWidth = 0.035;
        ctx.beginPath(); ctx.moveTo(x, 0.92); ctx.bezierCurveTo(x + 0.02, 0.5, x - 0.02, 0.2, x, -0.05); ctx.stroke();
        ctx.lineWidth = 0.018;
        for (const s of [-1, 1]) {
          if ((i === 0 && s < 0) || (i === cols.length - 1 && s > 0)) continue;
          ctx.beginPath(); ctx.moveTo(x, -0.05); ctx.quadraticCurveTo(x + s * 0.04, -0.3, x + s * 0.2, -0.42); ctx.stroke();
          for (let k = 0; k < 4; k++) { const y = -0.1 - k * 0.08; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + s * (0.06 + r() * 0.06), y - 0.07 - r() * 0.05); ctx.stroke(); }
        }
        for (let k = 0; k < 160; k++) { const a = r() * TAU, d = Math.sqrt(r()) * 0.2; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, -0.6 + Math.sin(a) * d * 0.7, 0.008, 0, TAU); ctx.fill(); }
      });
    },

    cathedral: () => {
      const cols = [-0.8, -0.4, 0, 0.4, 0.8];
      return cols.map((x, i) => ctx => {
        ctx.lineWidth = 0.035; ctx.beginPath(); ctx.moveTo(x, 0.92); ctx.lineTo(x, -0.05); ctx.stroke();
        ctx.lineWidth = 0.02; ctx.beginPath(); ctx.moveTo(x - 0.05, -0.05); ctx.lineTo(x + 0.05, -0.05); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x - 0.05, 0.92); ctx.lineTo(x + 0.05, 0.92); ctx.stroke();
        if (i < cols.length - 1) {
          const x2 = cols[i + 1], m = (x + x2) / 2;
          ctx.lineWidth = 0.018; ctx.beginPath(); ctx.moveTo(x, -0.05); ctx.quadraticCurveTo(x, -0.38, m, -0.45); ctx.quadraticCurveTo(x2, -0.38, x2, -0.05); ctx.stroke();
        }
        if (i === 2) {
          ctx.lineWidth = 0.016; ctx.beginPath(); ctx.arc(0, -0.72, 0.17, 0, TAU); ctx.stroke();
          for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; ctx.beginPath(); ctx.moveTo(0, -0.72); ctx.lineTo(Math.cos(a) * 0.17, -0.72 + Math.sin(a) * 0.17); ctx.stroke(); }
          ctx.beginPath(); ctx.arc(0, -0.72, 0.06, 0, TAU); ctx.stroke();
        }
      });
    }
  };

  const ORDER = ["birds", "jets", "ocean", "sound", "tree", "lungs", "neuron", "eye", "galaxy", "nautilus", "forest", "cathedral"];

  // Sample one form into N particle targets in page pixels.
  function sample(name, W, H, N, box) {
    const f = 0.5, w = Math.max(1, Math.round(W * f)), h = Math.max(1, Math.round(H * f));
    const off = document.createElement("canvas"); off.width = w; off.height = h;
    const c = off.getContext("2d", { willReadFrequently: true });
    const objs = forms[name](), per = Math.floor(N / objs.length), r = rng(name.length * 977 + 3), out = [];
    objs.forEach((draw, k) => {
      c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, w, h);
      c.setTransform(box.s * f, 0, 0, box.s * f, box.cx * f, box.cy * f);
      c.fillStyle = c.strokeStyle = "#fff";
      draw(c);
      const d = c.getImageData(0, 0, w, h).data, px = [];
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 90) px.push(x, y);
      const n = k === objs.length - 1 ? N - out.length : per, cnt = px.length / 2, pts = [];
      let mx = 0, my = 0;
      for (let i = 0; i < n; i++) {
        const j = cnt ? Math.floor(r() * cnt) * 2 : 0;
        const x = cnt ? (px[j] + r()) / f : box.cx, y = cnt ? (px[j + 1] + r()) / f : box.cy;
        pts.push({ x, y, a: 0.62 + r() * 0.33 }); mx += x; my += y;
      }
      mx /= n || 1; my /= n || 1;
      pts.sort((p, q) => Math.atan2(p.y - my, p.x - mx) - Math.atan2(q.y - my, q.x - mx));
      out.push(...pts);
    });
    return out;
  }

  return { ORDER, sample };
})();
