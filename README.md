# Ayal Meyers — WordPress theme

Personal site built around how everything connects: a particle intro, a map of connections, and notebook pages for Writing, Books, Music, Art & Design, Modeling, Subjects, Exploring our world, and People.

This repository is the theme itself. The repo root is the theme folder.

## Install on WordPress

Pick one:

- **WP Pusher** (self-hosted WordPress): install the WP Pusher plugin, then *WP Pusher › Install Theme*, repository `ayalmeyers/ayal-meyers-site`, branch `main`. Turn on push-to-deploy so every push to GitHub updates the site. The free version only pulls public repos.
- **WordPress.com** (Business plan or above): *Settings › Hosting › GitHub Deployments*, connect this repo, branch `main`, destination `/wp-content/themes/ayal-meyers`, then activate the theme.
- **Manual**: on GitHub, *Code › Download ZIP*, then in WordPress *Appearance › Themes › Add New › Upload Theme*.

Then activate **Ayal Meyers** under *Appearance › Themes*.

## What happens on activation

- Creates the section pages if they don't exist: Connections, Writing, Books, Music, Art & Design, Modeling, Subjects, Exploring our world, People.
- Switches permalinks to `/%postname%/` if they were still on the default, so pages live at `/writing/`, `/books/` and so on.
- The home page uses `front-page.php`, so it works whether WordPress shows latest posts or a static front page.

## Editing

- **Page intros**: edit each page's text in WordPress. If a page is empty, the theme's default intro shows.
- **Lists, connections and the map**: everything lives in `assets/data.js`.
  - `nodes`: the parts of life and thought on the map.
  - `edges`: each connection and the sentence that explains it. These appear on the Connections page, on the home map, and under "How it connects" on every page.
  - `items`: every entry on the section pages. `links` sets what each one connects to. `featured: true` puts it in Selected work on the home page.
- **Home page text**: `front-page.php`.
- **Styles**: `assets/style.css`.

## Photos

- Portrait: in `front-page.php`, replace the canvas in the sidebar with an `<img>` pointing at `assets/portrait.jpg`.
- Modeling portfolio: in `page-modeling.php`, replace each canvas in `.frames` with an `<img>`.

## Files

| File | Page |
| --- | --- |
| `front-page.php` | Home |
| `page-connections.php` | Connections |
| `page-writing.php`, `page-books.php`, `page-music.php`, `page-art-and-design.php`, `page-modeling.php`, `page-people.php` | Sections |
| `page-subjects.php` | Subjects |
| `page-exploring-our-world.php` | Exploring our world |
| `page.php`, `index.php`, `404.php` | Any other page, fallback, not found |
| `functions.php` | Setup, page creation, scripts |
