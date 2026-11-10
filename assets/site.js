// Shared page chrome and rendering. Reads content from data.js.
(function () {
  const S = window.SITE;
  const NODE = Object.fromEntries(S.nodes.map(n => [n.id, n]));
  const URLS = window.SITE_URLS || {};
  const U = key => {
    const [k, hash] = String(key).split("#");
    const base = URLS[k] || (k === "home" ? "index.html" : k + ".html");
    return base + (hash ? "#" + hash : "");
  };
  S.nodes.forEach(n => { n.href = U(n.href); });
  const NAV = [
    ["connections", "Connections"],
    ["writing", "Writing"],
    ["books", "Books"],
    ["music", "Music"],
    ["art", "Art & Design"],
    ["modeling", "Modeling"],
    ["subjects", "Subjects"],
    ["world", "Exploring our world"],
    ["people", "People"]
  ];
  const here = window.SITE_HERE || "";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function barHTML() {
    return `<div class="bar-inner"><a class="home" href="${U("home")}">${esc(S.name)}</a>
      <nav aria-label="Sections">${NAV.map(([k, l]) => `<a href="${U(k)}"${k === here ? ' aria-current="page"' : ""}>${esc(l)}</a>`).join("")}</nav></div>`;
  }

  // Header bar with a slow star field behind it
  document.querySelectorAll("[data-bar]").forEach(el => {
    el.classList.add("bar");
    el.innerHTML = `<canvas aria-hidden="true"></canvas>${barHTML()}`;
    starField(el.querySelector("canvas"), 0.00035);
  });
  document.querySelectorAll("[data-bar-plain]").forEach(el => { el.classList.add("bar", "plain"); el.innerHTML = barHTML(); });
  document.querySelectorAll("[data-foot]").forEach(el => {
    el.classList.add("foot");
    el.innerHTML = `<div class="bar-inner"><span>${esc(S.name)} · New York</span><a href="${U("connections")}" style="color:inherit">How it all connects</a></div>`;
  });

  // "Connects to …" line for an item
  function tags(links, skip) {
    const ls = links.filter(l => l !== skip && NODE[l]);
    if (!ls.length) return "";
    return `<span class="tags">Connects to ${ls.map(l => `<a href="${NODE[l].href}">${esc(NODE[l].label.toLowerCase())}</a>`).join(", ")}</span>`;
  }
  function itemLI(it, skip) {
    const by = it.by ? `, <span class="by">${esc(it.by)}</span>` : "";
    const note = it.note ? `. ${esc(it.note)}` : "";
    return `<li><span class="t">${esc(it.title)}</span>${by}${note}${tags(it.links, skip)}</li>`;
  }

  // Section pages: <div data-list="books"></div>
  document.querySelectorAll("[data-list]").forEach(el => {
    const page = el.dataset.list, only = el.dataset.section;
    const items = S.items.filter(i => i.page === page && (!only || i.section === only));
    const sections = [...new Set(items.map(i => i.section))];
    el.innerHTML = sections.map(sec => `${only ? "" : `<h2 id="${sec.toLowerCase().replace(/[^a-z]+/g, "-")}">${esc(sec)}</h2>`}
      <ul class="items">${items.filter(i => i.section === sec).map(i => itemLI(i)).join("")}</ul>`).join("");
  });

  // Connections that touch a node: <div data-edges="music"></div>
  document.querySelectorAll("[data-edges]").forEach(el => {
    const id = el.dataset.edges;
    const es = S.edges.filter(e => e.a === id || e.b === id);
    el.innerHTML = `<ul class="how">${es.map(e => {
      const o = NODE[e.a === id ? e.b : e.a];
      return `<li><span class="pair">${esc(NODE[id].label)} and <a href="${o.href}">${esc(o.label.toLowerCase())}</a></span>${esc(e.text)}</li>`;
    }).join("")}</ul>`;
  });

  // Everything tied to a subject, across the site: <div data-related="politics"></div>
  const PAGE_NAME = { writing: "Writing", books: "Books", music: "Music", art: "Art & Design", modeling: "Modeling", world: "Exploring our world", people: "People" };
  const PAGE_HREF = new Proxy({}, { get: (_, k) => U(k) });
  document.querySelectorAll("[data-related]").forEach(el => {
    const id = el.dataset.related;
    const items = S.items.filter(i => i.links.includes(id));
    const pages = [...new Set(items.map(i => i.page))];
    el.innerHTML = pages.map(p => `<h3><a href="${PAGE_HREF[p]}">${PAGE_NAME[p]}</a></h3>
      <ul class="items">${items.filter(i => i.page === p).map(i => itemLI(i, id)).join("")}</ul>`).join("");
  });

  // Selected work grid on the home page
  document.querySelectorAll("[data-featured]").forEach(el => {
    const items = S.items.filter(i => i.featured);
    el.innerHTML = items.map((i, k) => `<a href="${PAGE_HREF[i.page]}"><canvas data-dots="${k}" aria-hidden="true"></canvas>${esc(i.title)}<small>${PAGE_NAME[i.page]}</small></a>`).join("");
  });

  // Particle thumbnails
  const KINDS = ["sphere", "ring", "wave", "cluster", "grid", "spiral"];
  function drawDots(cv) {
    const k = +cv.dataset.dots || 0, kind = cv.dataset.kind || KINDS[k % KINDS.length];
    const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    if (!r.width) return;
    cv.width = r.width * dpr; cv.height = r.height * dpr;
    const ctx = cv.getContext("2d"); ctx.scale(dpr, dpr);
    const W = r.width, H = r.height, cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.34;
    let seed = (k + 1) * 9973; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    ctx.fillStyle = "#f0f2f0";
    const n = Math.round(W * H / 18);
    for (let i = 0; i < n; i++) {
      let x, y, a = 0.25 + rnd() * 0.6;
      if (kind === "sphere") { const u = rnd() * 2 - 1, t = rnd() * Math.PI * 2, s = Math.sqrt(1 - u * u); x = cx + R * s * Math.cos(t); y = cy + R * u; a *= 0.4 + 0.6 * (s * Math.sin(t) * 0.5 + 0.5); }
      else if (kind === "ring") { const t = rnd() * Math.PI * 2, rr = R * (0.85 + (rnd() - .5) * 0.25); x = cx + Math.cos(t) * rr; y = cy + Math.sin(t) * rr; }
      else if (kind === "wave") { x = rnd() * W; const band = Math.floor(rnd() * 5); y = cy + (band - 2) * H * 0.11 + Math.sin(x / W * Math.PI * 2 + band) * H * 0.07 + (rnd() - .5) * 4; }
      else if (kind === "cluster") { const c = Math.floor(rnd() * 4), ang = c * 1.7 + 0.4, d = R * 0.8; const g = () => (rnd() + rnd() + rnd() - 1.5) * R * 0.35; x = cx + Math.cos(ang) * d * (c ? 1 : 0) + g(); y = cy + Math.sin(ang) * d * (c ? 1 : 0) * 0.7 + g(); }
      else if (kind === "grid") { x = Math.round(rnd() * 18) / 18 * W * 0.8 + W * 0.1; y = Math.round(rnd() * 12) / 12 * H * 0.8 + H * 0.1; x += (rnd() - .5) * 3; y += (rnd() - .5) * 3; }
      else { const t = rnd() * 14, rr = t / 14 * R * 1.2; x = cx + Math.cos(t) * rr + (rnd() - .5) * 3; y = cy + Math.sin(t) * rr + (rnd() - .5) * 3; }
      ctx.globalAlpha = a; ctx.fillRect(x, y, rnd() < 0.04 ? 1.6 : 1, rnd() < 0.04 ? 1.6 : 1);
    }
  }
  const paintAll = () => document.querySelectorAll("canvas[data-dots]").forEach(drawDots);
  paintAll();
  let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(paintAll, 150); });

  // Drifting star field
  function starField(cv, speed) {
    const ctx = cv.getContext("2d"); let W, H, stars = [];
    function size() {
      const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
      W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: Math.round(W * H / 900) }, () => ({ x: Math.random() * W, y: Math.random() * H, a: 0.15 + Math.random() * 0.55, s: Math.random() < 0.05 ? 1.6 : 1, v: 0.3 + Math.random() }));
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = "#f0f2f0";
      for (const s of stars) { const x = (s.x + t * speed * 40 * s.v) % W; ctx.globalAlpha = s.a; ctx.fillRect(x, s.y, s.s, s.s); }
      if (!reduce) requestAnimationFrame(draw);
    }
    size(); addEventListener("resize", size); requestAnimationFrame(draw);
  }

  window.SITE_UTIL = { NODE, esc, reduce, starField, U };
})();
