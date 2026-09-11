/* InkPanel comic catalogue.
   To add your own comic: copy one entry, point `cover` + episode `image`
   at your files, and you're live. No build step needed. */
const COMICS = [
  {
    id: "pixel-quest",
    title: "Pixel Quest",
    author: "Maya Chen",
    genres: ["Adventure", "Fantasy"],
    status: "ongoing",
    rating: 4.9,
    ratingsCount: 2314,
    year: 2024,
    updated: "Sep 5, 2026",
    featured: true,
    color: "#6bcbff",
    cover: "assets/images/covers/pixel-quest.jpg",
    description: "Gamer girl Juno gets sucked into her favourite RPG — as a level-1 NPC with zero combat skills and a legendary attitude.",
    longDescription: "When a glitched VR headset pulls Juno into the world of Starfall Realms, she spawns as the weakest character class: a tutorial NPC. To log out, she must beat the game from the inside — with nothing but a frying pan, a sarcastic fairy guide, and cheat codes that only half work.",
    episodes: [
      { n: 1, title: "Spawn Point", date: "Sep 5, 2026", image: "assets/images/episodes/pixel-quest-e1.jpg", available: true },
      { n: 2, title: "The Frying Pan of Destiny", date: "Sep 12, 2026", available: false },
      { n: 3, title: "Boss Fight (Mostly Running)", date: "Sep 19, 2026", available: false }
    ]
  },
  {
    id: "midnight-diner",
    title: "Midnight Diner",
    author: "Kenji Sato",
    genres: ["Mystery", "Slice of Life"],
    status: "ongoing",
    rating: 4.8,
    ratingsCount: 1893,
    year: 2023,
    updated: "Sep 4, 2026",
    color: "#ff6b6b",
    cover: "assets/images/covers/midnight-diner.jpg",
    description: "A tiny diner appears only between midnight and 1AM — and every customer brings a mystery with their order.",
    longDescription: "Chef Mara runs a six-seat diner that exists for exactly one hour a night. The menu has one rule: order anything, if she has the ingredients. Ghosts, time travellers and heartbroken insomniacs all find their way to her counter — and leave with more than a full stomach.",
    episodes: [
      { n: 1, title: "The 12AM Special", date: "Sep 4, 2026", image: "assets/images/episodes/midnight-diner-e1.jpg", available: true },
      { n: 2, title: "Coffee for a Ghost", date: "Sep 11, 2026", available: false },
      { n: 3, title: "The Man Who Ordered Yesterday", date: "Sep 18, 2026", available: false }
    ]
  },
  {
    id: "star-hoppers",
    title: "Star Hoppers",
    author: "Priya Nair",
    genres: ["Sci-Fi", "Comedy"],
    status: "ongoing",
    rating: 4.7,
    ratingsCount: 1502,
    year: 2025,
    updated: "Sep 2, 2026",
    color: "#2ecc71",
    cover: "assets/images/covers/star-hoppers.jpg",
    description: "Two frog astronauts. One very unreliable spaceship. The galaxy's worst — and funniest — delivery service.",
    longDescription: "Captain Ribbit and Engineer Croak run Hopper Express, delivering packages across the galaxy. Their ship runs on pond water, their GPS is a rubber duck, and their five-star rating is hanging by a thread. Every delivery is a disaster. Every disaster is hilarious.",
    episodes: [
      { n: 1, title: "Lost in Space (Again)", date: "Sep 2, 2026", image: "assets/images/episodes/star-hoppers-e1.jpg", available: true },
      { n: 2, title: "The Duck Nebula", date: "Sep 9, 2026", available: false },
      { n: 3, title: "Return to Sender: A Black Hole", date: "Sep 16, 2026", available: false }
    ]
  },
  {
    id: "last-librarian",
    title: "The Last Librarian",
    author: "Elena Petrova",
    genres: ["Fantasy", "Drama"],
    status: "completed",
    rating: 4.9,
    ratingsCount: 3120,
    year: 2022,
    updated: "Aug 20, 2026",
    color: "#7c5cff",
    cover: "assets/images/covers/last-librarian.jpg",
    description: "After the Ink Wars burned every book, one librarian guards the last library — and the stories that could rebuild the world.",
    longDescription: "Sable is the last librarian of the Ashen Archive, a fortress-library holding humanity's final thousand books. When a wounded stranger arrives carrying a forbidden page, she must choose: protect the archive's rules, or risk everything to let stories live again. A complete, heart-wrenching tale.",
    episodes: [
      { n: 1, title: "Ashes and Shelves", date: "Aug 20, 2026", image: "assets/images/episodes/last-librarian-e1.jpg", available: true },
      { n: 2, title: "The Forbidden Page", date: "Aug 27, 2026", available: false },
      { n: 3, title: "What Stories Cost", date: "Sep 3, 2026", available: false }
    ]
  },
  {
    id: "ghost-roommates",
    title: "Ghost Roommates",
    author: "Diego Ramos",
    genres: ["Comedy", "Supernatural"],
    status: "ongoing",
    rating: 4.6,
    ratingsCount: 987,
    year: 2025,
    updated: "Aug 30, 2026",
    color: "#ffd93d",
    cover: "assets/images/covers/ghost-roommates.jpg",
    description: "Cheap rent in the big city! The catch: three ghost roommates with strong opinions about dishes, décor and the afterlife.",
    longDescription: "Broke grad student Alex finds a suspiciously cheap apartment — haunted by a Victorian poet, a 1980s rocker and a very judgy medieval knight. Splitting chores with the dead is harder than it sounds. A cozy supernatural sitcom in comic form.",
    episodes: [
      { n: 1, title: "The Lease (and the Deceased)", date: "Aug 30, 2026", image: "assets/images/episodes/ghost-roommates-e1.svg", available: true },
      { n: 2, title: "Who Ate My Leftovers? (It Was Sir Reginald)", date: "Sep 6, 2026", available: false },
      { n: 3, title: "Séance Movie Night", date: "Sep 13, 2026", available: false }
    ]
  },
  {
    id: "ink-ember",
    title: "Ink & Ember",
    author: "Aiko Tanaka",
    genres: ["Romance", "Fantasy"],
    status: "ongoing",
    rating: 4.8,
    ratingsCount: 1764,
    year: 2024,
    updated: "Aug 28, 2026",
    color: "#ff9f43",
    cover: "assets/images/covers/ink-ember.jpg",
    description: "A dragon-blooded tattoo artist inks magical tattoos — but every spell she tattoos takes a memory in return.",
    longDescription: "Ember runs a midnight tattoo parlour where her dragon-fire ink grants small magics: courage, luck, forgetting. Each tattoo costs her one of her own memories. When a mysterious stranger asks for a tattoo that could restore everything she's lost, Ember must decide what her past is worth.",
    episodes: [
      { n: 1, title: "First Session", date: "Aug 28, 2026", image: "assets/images/episodes/ink-ember-e1.svg", available: true },
      { n: 2, title: "The Price of Fire", date: "Sep 4, 2026", available: false },
      { n: 3, title: "A Stranger's Design", date: "Sep 11, 2026", available: false }
    ]
  }
];

const GENRE_META = {
  "Adventure":    { emoji: "🗺️", color: "#6bcbff" },
  "Fantasy":      { emoji: "🐉", color: "#7c5cff" },
  "Mystery":      { emoji: "🔎", color: "#ff6b6b" },
  "Slice of Life":{ emoji: "☕", color: "#2ecc71" },
  "Sci-Fi":       { emoji: "🚀", color: "#00d2d3" },
  "Comedy":       { emoji: "😂", color: "#ffd93d" },
  "Drama":        { emoji: "🎭", color: "#ff9f43" },
  "Supernatural": { emoji: "👻", color: "#c56cf0" },
  "Romance":      { emoji: "💘", color: "#ff6b81" }
};
