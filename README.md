# ayalmeyers.com

Personal site of Ayal Meyers, served by GitHub Pages from the `main` branch at https://ayalmeyers.com.

Plain HTML, CSS and JavaScript. No build step. Every push to `main` goes live within a minute or two.

## Pages

| Address | File |
| --- | --- |
| `/` | `index.html` |
| `/connections/` | `connections/index.html` |
| `/writing/` | `writing/index.html` |
| `/books/` | `books/index.html` |
| `/music/` | `music/index.html` |
| `/art-and-design/` | `art-and-design/index.html` |
| `/modeling/` | `modeling/index.html` |
| `/subjects/` | `subjects/index.html` |
| `/exploring-our-world/` | `exploring-our-world/index.html` |
| `/people/` | `people/index.html` |
| anything else | `404.html` |

## Editing

- **Lists, connections and the map**: everything lives in `assets/data.js`.
  - `nodes`: the parts of life and thought on the map.
  - `edges`: each connection and the sentence that explains it. These show on the Connections page, on the home map, and under "How it connects" on every page.
  - `items`: every entry on the section pages. `links` sets what each one connects to. `featured: true` puts it in Selected work on the home page.
- **Page intros and the home page text**: the `<p>` paragraphs in each page's `index.html`.
- **Styles**: `assets/style.css`.

## Photos

Put images in `assets/photos/`.

- Portrait: in `index.html`, replace the canvas inside `<aside class="side">` with `<img src="/assets/photos/portrait.jpg" alt="Ayal Meyers">`.
- Modeling portfolio: in `modeling/index.html`, replace each canvas in `<div class="frames">` with an `<img>`.

## Other files

- `CNAME`: tells GitHub Pages to serve the site at ayalmeyers.com. Keep it.
- `.nojekyll`: serves files as they are.
- `assets/og.png`: the image shown when a link to the site is shared.

## WordPress version

The same site as a WordPress theme lives on the `wordpress-theme` branch, if the site ever moves to WordPress hosting.
