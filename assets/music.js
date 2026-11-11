// Music: album covers that play a 30-second preview on hover (tap on phones),
// with links to Spotify and Apple Music. Covers and previews come from Apple's
// public catalog, looked up by track number when the page loads.
(function () {
  const SONGS = [
    { title: "Clair de lune, L. 32", artist: "Claude Debussy", id: 303883400 },
    { title: "Forever Young", artist: "Alphaville", id: 73255043 },
    { title: "Young Forever", artist: "JAY-Z", id: 1440932276 },
    { title: "The Long and Winding Road", artist: "The Beatles", id: 1441164893 },
    { title: "Mystery of Love", artist: "Sufjan Stevens", id: 1318981699 },
    { title: "סע לאט", artist: "Arik Einstein", id: 535100669, dir: "rtl" },
    { title: "Veridis Quo", artist: "Daft Punk", id: 697196125 },
    { title: "Who's Lovin' You", artist: "The Jackson 5", id: 1443222065 },
    { title: "As", artist: "Stevie Wonder", id: 6829016474 },
    { title: "Fade Into You", artist: "Mazzy Star", id: 1440848810 },
    { title: "Losing You", artist: "Solange", id: 1647451003 },
    { title: "Something (Take 39, instrumental)", artist: "The Beatles", id: 1834474210 },
    { title: "I'll Be There", artist: "The Jackson 5", id: 1443186637 },
    { title: "I Live for You", artist: "George Harrison", id: 1666672138 },
    { title: "If Not for You", artist: "George Harrison", id: 1666672134 },
    { title: "Elle ne t'aime pas", artist: "La Femme", id: 1146811244 },
    { title: "Waiting in the Dark", artist: "La Femme" },
    { title: "Godspeed", artist: "Frank Ocean", id: 1146195727 },
    { title: "Dramatic Girl", artist: "Baby Keem", id: 1878400355 },
    { title: "The Dress", artist: "Dijon", id: 1591107492 },
    { title: "End of Summer", artist: "Tame Impala", id: 1827093360 },
    { title: "My Sweet Lord", artist: "Damian Marley", id: 1698189097 },
    { title: "Piece of Heaven", artist: "Tame Impala", id: 1836226734 },
    { title: "Lens", artist: "Frank Ocean" },
    { title: "Mr. Telephone Man", artist: "New Edition", id: 1440796955 },
    { title: "Tattoos", artist: "Tyler Childers", id: 1241484756 },
    { title: "You Should Probably Leave", artist: "Chris Stapleton", id: 1528423169 },
    { title: "Mercy Mercy Me", artist: "Marvin Gaye", id: 1538081615 }
  ];

  const grid = document.getElementById("songs"); if (!grid) return;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const spotify = s => "https://open.spotify.com/search/" + encodeURIComponent(s.title + " " + s.artist);
  const apple = s => s.id ? "https://music.apple.com/us/song/" + s.id : "https://music.apple.com/us/search?term=" + encodeURIComponent(s.title + " " + s.artist);

  grid.innerHTML = SONGS.map((s, i) => `<li class="song" data-i="${i}">
    <button class="art" type="button" aria-label="Play a preview of ${esc(s.title)} by ${esc(s.artist)}" ${s.id ? "" : "disabled"}>
      <span class="art-fallback"${s.dir ? ` dir="${s.dir}"` : ""}>${esc(s.title)}</span>
      <span class="play" aria-hidden="true"></span>
      <span class="progress" aria-hidden="true"></span>
    </button>
    <span class="t"${s.dir ? ` dir="${s.dir}"` : ""}>${esc(s.title)}</span>
    <span class="by">${esc(s.artist)}</span>
    <span class="links"><a href="${spotify(s)}" target="_blank" rel="noopener">Spotify</a> · <a href="${apple(s)}" target="_blank" rel="noopener">Apple Music</a></span>
  </li>`).join("");

  const audio = new Audio(); audio.preload = "none";
  let current = null, fadeTimer = null;
  const cards = [...grid.querySelectorAll(".song")];

  function fade(to, done) {
    clearInterval(fadeTimer);
    fadeTimer = setInterval(() => {
      const v = audio.volume + (to > audio.volume ? 0.08 : -0.08);
      if ((to > audio.volume && v >= to) || (to <= audio.volume && v <= to)) { audio.volume = Math.max(0, Math.min(1, to)); clearInterval(fadeTimer); if (done) done(); }
      else audio.volume = Math.max(0, Math.min(1, v));
    }, 30);
  }
  function setState(card, playing) { cards.forEach(c => c.classList.toggle("playing", c === card && playing)); }
  function play(card) {
    const s = SONGS[+card.dataset.i]; if (!s.preview) return;
    if (current !== card) { audio.src = s.preview; current = card; }
    audio.volume = 0;
    audio.play().then(() => { setState(card, true); fade(0.9); }).catch(() => card.classList.add("tap"));
  }
  function stop(card) {
    if (current !== card) return;
    fade(0, () => { audio.pause(); setState(card, false); });
  }

  audio.addEventListener("timeupdate", () => {
    if (!current || !audio.duration) return;
    current.querySelector(".progress").style.transform = `scaleX(${audio.currentTime / audio.duration})`;
  });
  audio.addEventListener("ended", () => { setState(current, false); if (current) current.querySelector(".progress").style.transform = "scaleX(0)"; });

  const hoverable = matchMedia("(hover: hover)").matches;
  cards.forEach(card => {
    const btn = card.querySelector(".art");
    if (hoverable) {
      btn.addEventListener("mouseenter", () => play(card));
      btn.addEventListener("mouseleave", () => stop(card));
    }
    btn.addEventListener("click", () => {
      card.classList.remove("tap");
      if (current === card && !audio.paused) stop(card); else play(card);
    });
  });

  // Covers and previews from Apple's public catalog
  const ids = SONGS.filter(s => s.id).map(s => s.id);
  fetch("https://itunes.apple.com/lookup?country=US&entity=song&id=" + ids.join(","))
    .then(r => r.json())
    .then(j => {
      const byId = Object.fromEntries((j.results || []).map(r => [r.trackId, r]));
      SONGS.forEach((s, i) => {
        const r = byId[s.id]; if (!r) return;
        s.preview = r.previewUrl || "";
        const art = (r.artworkUrl100 || "").replace("100x100bb", "600x600bb");
        if (art) {
          const img = new Image(); img.alt = ""; img.decoding = "async"; img.loading = "lazy";
          img.onload = () => cards[i].classList.add("has-art");
          img.src = art;
          cards[i].querySelector(".art").prepend(img);
        }
      });
    })
    .catch(() => {});
})();
