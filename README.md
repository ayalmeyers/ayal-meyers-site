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
| `/door/` | `door/index.html` (not linked anywhere; not indexed by search engines) |
| anything else | `404.html` |

## Editing

- **Section pages**: each page's `index.html`. Writing, Books, Music, Art & Design, People and Subjects hold only their headings, ready to fill.
- **Modeling**: photos live in `assets/photos/`. Add one by copying an `<a><img></a>` line inside `<div class="gallery">` in `modeling/index.html`. Click any photo to view it large.
- **Exploring our world**: videos live in `assets/video/` (MP4, H.264). Each `<video>` in `exploring-our-world/index.html` points to one, with a poster image of the same name.
- **The map and connections**: `assets/data.js`. `nodes` are the parts of life on the map; `edges` are the connections and the sentence for each, shown on the Connections page.
- **Home globe**: `assets/world.js` holds the world map data (Natural Earth, public domain).
- **Home forms**: `assets/forms.js` draws the shapes the particles pass through before scrolling (birds, jets, waves, sound, tree, lungs, neuron, eye, galaxy, nautilus, forest, cathedral). `ORDER` sets the sequence.
- **Books**: `books/index.html`.
- **Styles**: `assets/style.css`.

## The door (`/door/`)

One text box. Return clears it.

- The access word opens a request form: name, email, a brief note, and a password.
- `ADM` asks for the admin password. Signed in as admin: approve or deny requests, see members, post, delete posts or comments, and read and answer each member's thread.
- An approved member types their email, then their password: they see posts, comment, and have a private thread with Ayal.

Backend: Supabase project `ayalmeyers-site` (Chuk's Org). The schema and every access rule are in `supabase/schema.sql`.
`assets/door-config.js` holds the project address and its public key; visitors can only call the member functions, never read the tables.
The admin is the Supabase Auth user `adm@ayalmeyers.com`, created in the Supabase dashboard (Authentication › Users › Add user, with Auto Confirm).

## Other files

- `CNAME`: tells GitHub Pages to serve the site at ayalmeyers.com. Keep it.
- `.nojekyll`: serves files as they are.
- `assets/og.png`: the image shown when a link to the site is shared.

## WordPress version

The same site as a WordPress theme lives on the `wordpress-theme` branch, if the site ever moves to WordPress hosting.
