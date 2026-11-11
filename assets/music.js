// Music: album covers that play a 30-second preview on hover (tap on phones),
// with links to Spotify and Apple Music. Covers and previews come from Apple's
// public catalog, looked up by track number when the page loads.
(function () {
  // id: Apple track number (cover and 30-second preview). sp: Spotify track id (exact link and cover).
  // The page sorts everything by artist.
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
    { title: "Mercy Mercy Me", artist: "Marvin Gaye", id: 1538081615 },
    { title: "Gioventù di notte (Seq. 4)", artist: "Piero Piccioni", id: 1740416542, sp: "0ALalDuLs2EUtGZ9Ax9lCh" },
    { title: "The Planets: Jupiter, the Bringer of Jollity", artist: "Gustav Holst", id: 1452232841, sp: "59Id4KrBWiizuq53doxWtp" },
    { title: "Blackbird (Live on MTV Unplugged)", artist: "Paul McCartney", id: 1440940605, sp: "2btxirdpF1sIMN5Sdln1K1" },
    { title: "Knockin' on Heaven's Door", artist: "Bob Dylan", id: 717157149, sp: "6HSXNV0b4M4cLJ7ljgVVeh" },
    { title: "Baby Come Back", artist: "Player", id: 1458825378, sp: "2eRYuzlSOBk3HlMsCSOLPJ" },
    { title: "Through the Wire", artist: "Kanye West", id: 1437467903, sp: "4mmkhcEm1Ljy1U9nwtsxUo" },
    { title: "Int'l Players Anthem (I Choose You)", artist: "UGK feat. Outkast", sp: "4ns1XFP3W5JPyzvnAjMdHD" },
    { title: "My Favorite Things", artist: "John Coltrane", id: 962193194, sp: "3ZikLQCnH3SIswlGENBcKe" },
    { title: "Mr. Right Now", artist: "21 Savage & Metro Boomin feat. Drake", id: 1534264268, sp: "4Q34FP1AT7GEl9oLgNtiWj" },
    { title: "Here Comes the Sun", artist: "The Beatles", id: 1441164589, sp: "45yEy5WJywhJ3sDI28ajTm" },
    { title: "Changes", artist: "2Pac", id: 1440662037, sp: "1ofhfV90EnYhEr7Un2fWiv" },
    { title: "La fille aux cheveux de lin, L. 33", artist: "Claude Debussy", id: 1055753498, sp: "0fpqOyC5DLDe5gAYKBB6X7" },
    { title: "Amazing Grace", artist: "Judy Collins", id: 40287193, sp: "6Sueudn0VQA4AXRsFKQbFl" },
    { title: "Girls, Girls, Girls", artist: "JAY-Z", id: 1440934007, sp: "0vzb8Ii9B2fP9c0POFGPOZ" },
    { title: "Girls, Girls, Girls (Part 2)", artist: "JAY-Z", id: 1440934218, sp: "6Mtt0rvg195HXHEJU3LeMr" },
    { title: "Izzo (H.O.V.A.)", artist: "JAY-Z", id: 1440933880, sp: "4h5KBcltGefua73AUPYps7" },
    { title: "Maybe I'm Amazed", artist: "Paul McCartney", id: 1440941649, sp: "1Qa0Y05al633fG8f9Peytc" },
    { title: "93 'Til Infinity", artist: "Souls of Mischief", id: 369570892, sp: "0PV1TFUMTBrDETzW6KQulB" },
    { title: "'Till Forever", artist: "Labi Siffre", id: 955676430, sp: "7vVywc6HuOtPzwdMkSxhI2" },
    { title: "Annie's Song", artist: "John Denver", id: 1458663244, sp: "4J0DbyODwZJcmIAiTSJfMF" },
    { title: "Son of a Preacher Man", artist: "Dusty Springfield", id: 257837972, sp: "7odHgoLFi3GQ90E9PeraI3" },
    { title: "Hallelujah", artist: "Leonard Cohen", id: 192678693, sp: "7yzbimr8WVyAtBX3Eg6UL9" },
    { title: "Weak", artist: "SWV", id: 266800009, sp: "71EHOyEOhNx1SzTebRRyng" },
    { title: "I'll Never Love This Way Again", artist: "Dionne Warwick", id: 1363890930, sp: "4V3AGIIQeJoBUPaTCLiscB" },
    { title: "Cannock Chase", artist: "Labi Siffre", id: 1010789756, sp: "0WAEGVylZjbe2mQ6Or6HxY" },
    { title: "on one tonight", artist: "Gunna", id: 1745391797, sp: "6EUcP55GlbmsmCzfL2vxtZ" },
    { title: "Loom", artist: "Zach Bryan", sp: "46dUiDTF3xDchz5lZ3T36s" },
    { title: "bebe", artist: "Steve Lacy", sp: "4SDXk4sWVBIJBHC9bv8i9u" },
    { title: "Ce matin-là", artist: "Air", id: 693064050, sp: "0pEmzblUxXvzIYnJpu8gWW" },
    { title: "Las Mañanitas", artist: "Vicente Fernández", id: 322338942, sp: "5kWzM5dWoG54dGyFb5uMuX" },
    { title: "Abraham, Martin & John", artist: "Marvin Gaye", id: 1434918049, sp: "5SbH1zs8ZfvwAJXUhsE5zO" },
    { title: "Dance for Me", artist: "Queen Latifah", id: 1604634099, sp: "3AyIPA6NBnaR7XtItEuJHH" },
    { title: "Call It Fate, Call It Karma", artist: "The Strokes", id: 601140646, sp: "3Y4rUyw7XBCK6hGHCOt6rp" },
    { title: "Acompáñeme Civil", artist: "Juan Luis Guerra 4.40", id: 19468974, sp: "2iNJSllCwLVZSlxZ6kAkwd" },
    { title: "Stop This Train", artist: "John Mayer", id: 184335777, sp: "3E6iea9uEmB7gRru4lyP6h" },
    { title: "Bold as Love", artist: "John Mayer", id: 184335816, sp: "50DMG6AvtNzbrxMc62w6ph" },
    { title: "Doin' It Right", artist: "Daft Punk feat. Panda Bear", id: 617154645, sp: "36c4JohayB9qd64eidQMBi" },
    { title: "Instant Crush", artist: "Daft Punk feat. Julian Casablancas", id: 617154362, sp: "2cGxRwrMyEAp8dEbuZaVv6" },
    { title: "Ode to the Mets", artist: "The Strokes", sp: "1BLOVHYYlH4JUHQGcpt75R" },
    { title: "Digital Love", artist: "Daft Punk", id: 697195633, sp: "2VEZx7NWsZ1D0eJ4uv5Fym" },
    { title: "Le sud", artist: "Nino Ferrer", id: 1442448396, sp: "7zjkSx1EUums3s1Yg2jPJD" },
    { title: "Change", artist: "Big Thief", id: 1591284602, sp: "3HFBqhotJeEKHJzMEW31jZ" },
    { title: "独り言", artist: "Asagaya Romantics", sp: "3bQU7W0zlDSYkVMdWo9Dls" },
    { title: "Another Star", artist: "Stevie Wonder", id: 1440788747, sp: "5owFj7EOftzR9x5zciL0Bm" },
    { title: "Cool Colorado", artist: "La Femme", id: 1622895515, sp: "6lbkdQ51nx1XPMGoiG3BZ6" },
    { title: "Septembre", artist: "La Femme", id: 1146811128, sp: "38N652WFlybpjmR0YsPGCp" }
  ];
  const sortKey = s => s.artist.replace(/^the\s+/i, "");
  SONGS.sort((a, b) => sortKey(a).localeCompare(sortKey(b), "en", { sensitivity: "base", numeric: true }) || a.title.localeCompare(b.title, "en", { sensitivity: "base" }));

  const grid = document.getElementById("songs"); if (!grid) return;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const spotify = s => s.sp ? "https://open.spotify.com/track/" + s.sp : "https://open.spotify.com/search/" + encodeURIComponent(s.title + " " + s.artist);
  const apple = s => s.id ? "https://music.apple.com/us/song/" + s.id : "https://music.apple.com/us/search?term=" + encodeURIComponent(s.title + " " + s.artist);

  grid.innerHTML = SONGS.map((s, i) => `<li class="song" data-i="${i}">
    <button class="art" type="button" aria-label="${s.id ? "Play a preview of" : "Open in Spotify:"} ${esc(s.title)} by ${esc(s.artist)}" ${s.id || s.sp ? "" : "disabled"}>
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
    clearInterval(fadeTimer);
    if (current !== card) { if (current) setState(current, false); audio.src = s.preview; current = card; }
    audio.volume = 0;
    audio.play().then(() => { setState(card, true); fade(0.9); }).catch(() => card.classList.add("tap"));
  }
  function stop(card) {
    if (current !== card) return;
    fade(0, () => { if (current === card) { audio.pause(); setState(card, false); } });
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
      const s = SONGS[+card.dataset.i];
      if (!s.id && s.sp) { window.open(spotify(s), "_blank", "noopener"); return; }
      card.classList.remove("tap");
      if (current === card && !audio.paused) stop(card); else play(card);
    });
  });

  function setArt(i, url) {
    if (!url || cards[i].querySelector(".art img")) return;
    const img = new Image(); img.alt = ""; img.decoding = "async";
    img.onload = () => cards[i].classList.add("has-art");
    img.src = url;
    cards[i].querySelector(".art").prepend(img);
  }

  // Previews (and covers for songs without a Spotify link) from Apple's public catalog
  const ids = SONGS.filter(s => s.id).map(s => s.id);
  fetch("https://itunes.apple.com/lookup?country=US&entity=song&id=" + ids.join(","))
    .then(r => r.json())
    .then(j => {
      const byId = Object.fromEntries((j.results || []).map(r => [r.trackId, r]));
      SONGS.forEach((s, i) => {
        const r = byId[s.id]; if (!r) return;
        s.preview = r.previewUrl || "";
        s.appleArt = (r.artworkUrl100 || "").replace("100x100bb", "600x600bb");
        if (!s.sp) setArt(i, s.appleArt);
      });
    })
    .catch(() => {});

  // Exact covers for Spotify links, loaded as each card scrolls near the screen
  const loadSpotifyArt = i => {
    const s = SONGS[i];
    fetch("https://open.spotify.com/oembed?url=" + encodeURIComponent("https://open.spotify.com/track/" + s.sp))
      .then(r => r.json())
      .then(o => setArt(i, o.thumbnail_url))
      .catch(() => setArt(i, s.appleArt));
  };
  const io = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { io.unobserve(en.target); loadSpotifyArt(+en.target.dataset.i); } });
  }, { rootMargin: "400px 0px" }) : null;
  cards.forEach((c, i) => { if (SONGS[i].sp) { if (io) io.observe(c); else loadSpotifyArt(i); } });
})();
