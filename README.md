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

- **Section pages**: each page's `index.html`. Writing, Books, Music, Art & Design, People and Subjects hold only their headings, ready to fill.
- **Modeling**: photos live in `assets/photos/`. Add one by copying an `<a><img></a>` line inside `<div class="gallery">` in `modeling/index.html`. Click any photo to view it large.
- **Exploring our world**: videos live in `assets/video/` (MP4, H.264). Each `<video>` in `exploring-our-world/index.html` points to one, with a poster image of the same name.
- **The map and connections**: `assets/data.js`. `nodes` are the parts of life on the map; `edges` are the connections and the sentence for each, shown on the Connections page.
- **Home globe**: `assets/world.js` holds the world map data (Natural Earth, public domain).
- **Styles**: `assets/style.css`.

## Other files

- `CNAME`: tells GitHub Pages to serve the site at ayalmeyers.com. Keep it.
- `.nojekyll`: serves files as they are.
- `assets/og.png`: the image shown when a link to the site is shared.

## WordPress version

The same site as a WordPress theme lives on the `wordpress-theme` branch, if the site ever moves to WordPress hosting.
