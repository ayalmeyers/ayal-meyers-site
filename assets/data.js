// All site content lives here. Edit this file to change what appears on every page.
// href values are page keys (writing, books, music, art, modeling, subjects, world, people, connections),
// optionally with #section. The theme turns them into the real WordPress page addresses.
// nodes: the parts of life and thought that the site connects.
// edges: each connection between two nodes.
// items: everything listed on the section pages. `links` ties an item to nodes.

window.SITE = {
  name: "Ayal Meyers",

  nodes: [
    // subjects
    { id: "neuroscience",  label: "Neuroscience",  href: "subjects#neuroscience",  x: -0.30, y: -0.30 },
    { id: "consciousness", label: "Consciousness", href: "subjects#consciousness", x:  0.28, y: -0.34 },
    { id: "philosophy",    label: "Philosophy",    href: "subjects#philosophy",    x:  0.32, y:  0.14 },
    { id: "politics",      label: "Politics",      href: "subjects#politics",      x: -0.32, y:  0.16 },
    // life
    { id: "writing",   label: "Writing",      href: "writing",        x: -0.78, y:  0.30 },
    { id: "books",     label: "Books",        href: "books",          x:  0.02, y:  0.02 },
    { id: "music",     label: "Music",        href: "music",          x:  0.74, y: -0.56 },
    { id: "art",       label: "Art & Design", href: "art",            x:  0.82, y: -0.02 },
    { id: "modeling",  label: "Modeling",     href: "modeling",       x: -0.74, y: -0.52 },
    { id: "people",    label: "People",       href: "people",         x:  0.66, y:  0.58 },
    { id: "nature",    label: "Nature",       href: "world#nature",   x:  0.00, y: -0.80 },
    { id: "adventure", label: "Adventure",    href: "world#adventure",x: -0.30, y:  0.74 }
  ],

  edges: [
    { a: "neuroscience",  b: "modeling" },
    { a: "neuroscience",  b: "consciousness" },
    { a: "consciousness", b: "philosophy" },
    { a: "politics",      b: "neuroscience" },
    { a: "politics",      b: "writing" },
    { a: "philosophy",    b: "books" },
    { a: "books",         b: "writing" },
    { a: "books",         b: "neuroscience" },
    { a: "music",         b: "consciousness" },
    { a: "music",         b: "people" },
    { a: "people",        b: "philosophy" },
    { a: "art",           b: "consciousness" },
    { a: "art",           b: "modeling" },
    { a: "nature",        b: "consciousness" },
    { a: "nature",        b: "adventure" },
    { a: "adventure",     b: "neuroscience" },
    { a: "adventure",     b: "philosophy" },
    { a: "modeling",      b: "adventure" }
  ],

  // Entries for the section pages: { page: "books", section: "Shelf", title: "...", by: "...", note: "...", links: ["philosophy"] }
  items: []
};
