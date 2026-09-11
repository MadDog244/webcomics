# 💥 InkPanel — a simple webcomics site

A tiny, dependency-free webcomics library: browse comics, save them to your library,
and read episodes in a vertical webtoon-style reader. Hosted free on **GitHub Pages**.

🌐 **Live site:** https://MadDog244.github.io/webcomics/

## Features

- 📚 Comic catalogue with search, genre filters & sorting
- 📖 Vertical-scroll episode reader (keyboard: ←/→ navigate, Esc closes)
- 🔖 Personal library + reading progress (saved in `localStorage`)
- 🌙 Dark / light mode
- 📱 Fully responsive, no frameworks, no build step

## Project structure

```
├── index.html                  # the whole site (single page)
├── 404.html                    # custom GitHub Pages 404
├── .nojekyll                   # serve assets as-is on Pages
├── assets/
│   ├── css/style.css           # comic / neo-brutalist theme
│   ├── js/
│   │   ├── comics.js           # ← catalogue data: add your comics here
│   │   └── app.js              # rendering, filters, modal, reader
│   └── images/
│       ├── covers/             # comic cover art
│       └── episodes/           # episode strips (one tall image per episode)
```

## Add your own comic

1. Drop a cover into `assets/images/covers/` and episode art into `assets/images/episodes/`
   (one tall vertical image per episode works best, e.g. 800×2400).
2. Add an entry to the `COMICS` array in `assets/js/comics.js`:

```js
{
  id: "my-comic",
  title: "My Comic",
  author: "Your Name",
  genres: ["Comedy"],
  status: "ongoing",          // or "completed"
  rating: 5.0,
  ratingsCount: 1,
  year: 2026,
  updated: "Sep 11, 2026",
  cover: "assets/images/covers/my-comic.jpg",
  description: "One-line hook.",
  longDescription: "Full synopsis shown on the detail card.",
  episodes: [
    { n: 1, title: "Pilot", date: "Sep 11, 2026",
      image: "assets/images/episodes/my-comic-e1.jpg", available: true }
  ]
}
```

3. Push — GitHub Pages redeploys automatically. No build step!

## Run locally

```bash
# any static server works, e.g:
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deployment

Hosted on GitHub Pages via the [Deploy to GitHub Pages](../../actions/workflows/pages.yml)
workflow — every push to `main` (or this branch) redeploys automatically.

**One-time setup** (requires repo admin, ~30 seconds):

1. Open **Settings → Pages** (or visit
   `https://github.com/MadDog244/webcomics/settings/pages`).
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Re-run the workflow (or push any commit) — the site goes live at
   **https://MadDog244.github.io/webcomics/** 🎉
