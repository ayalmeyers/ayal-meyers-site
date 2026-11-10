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

  items: [
    // Writing
    { page: "writing", section: "Essays",   title: "Personal essays", note: "Essays on mind, belief and how I'm learning to live.", links: ["philosophy", "consciousness"] },
    { page: "writing", section: "Essays",   title: "Poems", note: "Collected as they're finished.", links: ["consciousness"] },
    { page: "writing", section: "Research", title: "Spontaneous speech and AI", note: "Research on how relying on AI changes our ability to speak without a script.", links: ["neuroscience", "politics"], featured: true },
    { page: "writing", section: "Work",     title: "Reporting", by: "The Daily Californian", note: "Journalism at Berkeley.", links: ["politics"] },
    { page: "writing", section: "Work",     title: "Speechwriting", by: "Strategic communication", note: "Writing in other people's voices.", links: ["politics"] },
    { page: "writing", section: "Work",     title: "Policy writing", by: "Mitvim", note: "Ghostwriting policy for international parliamentarians.", links: ["politics"] },

    // Books
    { page: "books", section: "Reading now", title: "Surfing Uncertainty", by: "Andy Clark", note: "The brain as a prediction machine.", links: ["neuroscience", "consciousness", "philosophy"], featured: true },
    { page: "books", section: "Favorites",   title: "Descartes' Error", by: "Antonio Damasio", note: "Emotion as part of reason.", links: ["neuroscience", "consciousness"] },
    { page: "books", section: "Favorites",   title: "Mortal Questions", by: "Thomas Nagel", note: "Short essays on death, luck and the mind.", links: ["consciousness", "philosophy"] },
    { page: "books", section: "Shelf",       title: "Thinking, Fast and Slow", by: "Daniel Kahneman", note: "Where behavioral economics started for me.", links: ["neuroscience", "politics"] },
    { page: "books", section: "Shelf",       title: "The Human Condition", by: "Hannah Arendt", note: "Labor, work and action.", links: ["politics", "philosophy"] },
    { page: "books", section: "Shelf",       title: "The Conscious Mind", by: "David Chalmers", note: "The hard problem, stated as sharply as anyone has.", links: ["consciousness", "philosophy"] },
    { page: "books", section: "Shelf",       title: "Nudge", by: "Richard Thaler and Cass Sunstein", note: "Choice architecture.", links: ["politics", "neuroscience"] },

    // Music
    { page: "music", section: "Building",              title: "Melo", by: "In development", note: "A social app for music and podcasts. Reviews, discussion, shared libraries, and pages for albums, artists and genres.", links: ["people", "music"], featured: true },
    { page: "music", section: "On rotation",           title: "Music for Airports", by: "Brian Eno", note: "", links: ["consciousness"] },
    { page: "music", section: "On rotation",           title: "22, A Million", by: "Bon Iver", note: "", links: ["philosophy"] },
    { page: "music", section: "Albums that shaped me", title: "Blonde", by: "Frank Ocean", note: "", links: ["consciousness"] },
    { page: "music", section: "Albums that shaped me", title: "To Pimp a Butterfly", by: "Kendrick Lamar", note: "", links: ["politics", "philosophy"] },
    { page: "music", section: "Albums that shaped me", title: "Kid A", by: "Radiohead", note: "", links: ["consciousness", "politics"] },

    // Art & Design
    { page: "art", section: "My work",    title: "This site", note: "Designed around one idea: everything I do is connected.", links: ["art", "philosophy"] },
    { page: "art", section: "References", title: "Skyspaces", by: "James Turrell", note: "Light as material.", links: ["consciousness", "neuroscience"] },
    { page: "art", section: "References", title: "The grid paintings", by: "Agnes Martin", note: "Quiet, repeated lines.", links: ["consciousness"] },
    { page: "art", section: "References", title: "Ten principles of good design", by: "Dieter Rams", note: "", links: ["philosophy"] },
    { page: "art", section: "References", title: "Envisioning Information", by: "Edward Tufte", note: "Information design as honest argument.", links: ["politics"] },

    // Modeling
    { page: "modeling", section: "Representation", title: "Wilhelmina Sports", by: "New York", note: "Sports and fitness modeling. Booking through the agency.", links: ["adventure", "neuroscience"] },

    // Exploring our world
    { page: "world", section: "Nature",    title: "Mountains", note: "The Alps, mostly on foot.", links: ["nature", "consciousness"] },
    { page: "world", section: "Nature",    title: "Ocean", note: "Where I surf.", links: ["nature"] },
    { page: "world", section: "Adventure", title: "Tour du Mont Blanc", by: "Solo", note: "The full loop through France, Italy and Switzerland.", links: ["adventure", "nature", "philosophy"], featured: true },
    { page: "world", section: "Adventure", title: "Surfing", note: "", links: ["adventure", "nature"] },
    { page: "world", section: "Adventure", title: "Skiing", note: "", links: ["adventure", "nature"] },
    { page: "world", section: "Adventure", title: "Brazilian jiu-jitsu", note: "", links: ["adventure", "neuroscience"] },
    { page: "world", section: "Adventure", title: "Basketball", note: "", links: ["adventure"] },

    // People
    { page: "people", section: "Thinkers", title: "Thomas Nagel", note: "Showed me what the question of consciousness actually is.", links: ["consciousness", "philosophy"] },
    { page: "people", section: "Thinkers", title: "Antonio Damasio", note: "Put the body back into the mind.", links: ["neuroscience"] },
    { page: "people", section: "Thinkers", title: "Andy Clark", note: "The predictive brain and the extended mind.", links: ["neuroscience", "philosophy"] },
    { page: "people", section: "Thinkers", title: "Daniel Kahneman", note: "How people actually decide.", links: ["politics", "neuroscience"] },
    { page: "people", section: "Thinkers", title: "Hannah Arendt", note: "What it means to act in public.", links: ["politics", "philosophy"] },
    { page: "people", section: "Thinkers", title: "Brian Eno", note: "Music as a way of shaping attention.", links: ["music", "consciousness"] }
  ]
};
