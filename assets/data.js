// All site content lives here. Edit this file to change what appears on every page.
// href values are page keys (writing, books, music, art, modeling, subjects, world, people, connections),
// optionally with #section. The theme turns them into the real WordPress page addresses.
// nodes: the parts of life and thought that the site connects.
// edges: each connection between two nodes, with the sentence that explains it.
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
    { a: "neuroscience",  b: "modeling",      text: "Modeling put my degree into my body. Training, posing and shoot prep are embodied cognition I can feel while it happens." },
    { a: "neuroscience",  b: "consciousness", text: "Neuroscience explains how the brain does what it does. Consciousness is the part it still can't account for, and that gap is where I want to work." },
    { a: "consciousness", b: "philosophy",    text: "Every question about consciousness turns into a philosophy question once you push on it long enough." },
    { a: "politics",      b: "neuroscience",  text: "Behavioral economics sits between the two. Policy acts on real brains, and real brains don't behave the way the models say they should." },
    { a: "politics",      b: "writing",       text: "I learned to write by writing for other people: reporting at the Daily Californian, speechwriting, and policy writing for international parliamentarians." },
    { a: "philosophy",    b: "books",         text: "I'm building my own system of belief, and most of the material comes from reading how other thinkers built theirs." },
    { a: "books",         b: "writing",       text: "Reading is where my writing starts. Most essays begin as notes in the margin of someone else's book." },
    { a: "books",         b: "neuroscience",  text: "The books that stayed with me are the ones that tied the brain to everyday experience." },
    { a: "music",         b: "consciousness", text: "Music is the most reliable way I know to change my own state of mind on purpose." },
    { a: "music",         b: "people",        text: "This is the idea behind Melo. People find each other through what they listen to, and the conversation around music is the valuable part." },
    { a: "people",        b: "philosophy",    text: "The thinkers I read show me how to build a worldview. The people around me test whether it holds." },
    { a: "art",           b: "consciousness", text: "Art makes perception visible. The work I keep returning to is about how we see." },
    { a: "art",           b: "modeling",      text: "On set I'm part of someone else's image. Being inside it taught me how images get made." },
    { a: "nature",        b: "consciousness", text: "Long days outside quiet everything down. It's the clearest my head gets." },
    { a: "nature",        b: "adventure",     text: "Adventure is how I meet nature: surfing, skiing, and walking the Tour du Mont Blanc alone." },
    { a: "adventure",     b: "neuroscience",  text: "Jiu-jitsu, surfing and skiing are problems the body solves faster than the mind can describe them." },
    { a: "adventure",     b: "philosophy",    text: "Walking the Tour du Mont Blanc solo was the longest uninterrupted stretch of thinking I've had." },
    { a: "modeling",      b: "adventure",     text: "Training for the camera and training for the mountains are the same discipline pointed at different things." }
  ],

  // Entries for the section pages: { page: "books", section: "Shelf", title: "...", by: "...", note: "...", links: ["philosophy"] }
  items: []
};
