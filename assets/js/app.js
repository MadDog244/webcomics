/* InkPanel app logic — no dependencies, no build step. */
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const grid = $("#comicsGrid");
  const genrePills = $("#genrePills");
  const genreGrid = $("#genreGrid");
  const searchInput = $("#searchInput");
  const sortSelect = $("#sortSelect");
  const resultsMeta = $("#resultsMeta");
  const emptyState = $("#emptyState");

  const store = {
    get(k, fb) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? fb; } catch { return fb; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };

  let activeGenre = "All";
  let showBookmarksOnly = false;
  let bookmarks = new Set(store.get("inkpanel:bookmarks", []));
  let progress = store.get("inkpanel:progress", {}); // { comicId: lastReadEpN }

  /* ---------- theme ---------- */
  const themeToggle = $("#themeToggle");
  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    themeToggle.textContent = t === "dark" ? "☀️" : "🌙";
    store.set("inkpanel:theme", t);
  }
  setTheme(store.get("inkpanel:theme", "light"));
  themeToggle.addEventListener("click", () =>
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));

  /* ---------- mobile menu ---------- */
  const menuBtn = $("#menuBtn"), mainNav = $("#mainNav");
  menuBtn.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  mainNav.addEventListener("click", (e) => { if (e.target.tagName === "A") mainNav.classList.remove("open"); });

  /* ---------- toast ---------- */
  const toast = $("#toast");
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toast.hidden = true), 2200);
  }

  /* ---------- image fallback (broken art never breaks the layout) ---------- */
  const PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#FFD93D"/><text x="400" y="290" font-size="120" text-anchor="middle">💥</text><text x="400" y="420" font-size="48" font-weight="bold" text-anchor="middle" font-family="Arial" fill="#1a1a2e">Art coming soon!</text></svg>`);
  document.addEventListener("error", (e) => {
    if (e.target && e.target.tagName === "IMG" && !e.target.dataset.fb) {
      e.target.dataset.fb = "1";
      e.target.src = PLACEHOLDER;
    }
  }, true);

  /* ---------- stats ---------- */
  function renderStats() {
    const eps = COMICS.reduce((a, c) => a + c.episodes.filter((e) => e.available).length, 0);
    const avg = (COMICS.reduce((a, c) => a + c.rating, 0) / COMICS.length).toFixed(1);
    $("#statComics").textContent = COMICS.length;
    $("#statEpisodes").textContent = eps;
    $("#statRating").textContent = avg;
  }

  /* ---------- featured ---------- */
  function renderFeatured() {
    const c = COMICS.find((x) => x.featured) || COMICS[0];
    const firstEp = c.episodes.find((e) => e.available);
    $("#featuredCard").innerHTML = `
      <img src="${c.cover}" alt="Cover of ${c.title}" loading="lazy" />
      <div>
        <h3>${c.title}</h3>
        <p class="byline">by ${c.author} · since ${c.year}</p>
        <div class="featured-meta">
          ${c.genres.map((g) => `<span class="pill genre">${g}</span>`).join("")}
          <span class="pill rating">★ ${c.rating} (${c.ratingsCount.toLocaleString()})</span>
          <span class="pill status">${c.status === "ongoing" ? "🟢 Ongoing" : "🏁 Completed"}</span>
        </div>
        <p>${c.longDescription}</p>
        <div class="featured-actions">
          <button class="btn btn-primary" data-read="${c.id}">📖 Read Episode 1</button>
          <button class="btn btn-ghost" data-details="${c.id}">Details</button>
        </div>
      </div>`;
  }

  /* ---------- genre pills + genre cards ---------- */
  function allGenres() {
    const s = new Set();
    COMICS.forEach((c) => c.genres.forEach((g) => s.add(g)));
    return ["All", ...[...s].sort()];
  }
  function renderGenrePills() {
    genrePills.innerHTML = allGenres()
      .map((g) => `<button data-genre="${g}" aria-pressed="${g === activeGenre}">${g === "All" ? "✨ All" : g}</button>`)
      .join("");
  }
  function renderGenreGrid() {
    const counts = {};
    COMICS.forEach((c) => c.genres.forEach((g) => (counts[g] = (counts[g] || 0) + 1)));
    genreGrid.innerHTML = Object.keys(counts).sort().map((g) => {
      const meta = GENRE_META[g] || { emoji: "📖", color: "#ffd93d" };
      return `<button class="genre-card" data-genre-jump="${g}" style="background:${meta.color}">
        <span>${meta.emoji}</span>${g}<small>${counts[g]} comic${counts[g] > 1 ? "s" : ""}</small>
      </button>`;
    }).join("");
  }

  /* ---------- comics grid ---------- */
  function filteredComics() {
    const q = searchInput.value.trim().toLowerCase();
    let list = COMICS.filter((c) => {
      const inGenre = activeGenre === "All" || c.genres.includes(activeGenre);
      const inLib = !showBookmarksOnly || bookmarks.has(c.id);
      const inSearch = !q || (c.title + " " + c.author + " " + c.genres.join(" ")).toLowerCase().includes(q);
      return inGenre && inLib && inSearch;
    });
    const sort = sortSelect.value;
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sort === "title") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "newest") list = [...list].sort((a, b) => b.year - a.year);
    return list;
  }

  function starBar(r) {
    const full = Math.round(r);
    return "★".repeat(full) + "☆".repeat(5 - full);
  }

  function renderGrid() {
    const list = filteredComics();
    resultsMeta.textContent = showBookmarksOnly
      ? `📚 Your library: ${list.length} saved comic${list.length === 1 ? "" : "s"}`
      : `Showing ${list.length} of ${COMICS.length} comics${activeGenre !== "All" ? ` in “${activeGenre}”` : ""}`;
    emptyState.hidden = list.length > 0;
    grid.innerHTML = list.map((c) => {
      const saved = bookmarks.has(c.id);
      const last = progress[c.id];
      return `
      <article class="comic-card" data-details="${c.id}" tabindex="0" role="button" aria-label="Open ${c.title}">
        <div class="comic-cover-wrap">
          <img src="${c.cover}" alt="Cover of ${c.title}" loading="lazy" />
          <button class="icon-btn bookmark-btn ${saved ? "saved" : ""}" data-bookmark="${c.id}"
            aria-label="${saved ? "Remove from" : "Save to"} library" title="${saved ? "Remove from" : "Save to"} library">${saved ? "🔖" : "📑"}</button>
        </div>
        <div class="comic-body">
          <h3>${c.title}</h3>
          <p class="byline">by ${c.author}</p>
          <div class="featured-meta" style="margin:.3rem 0">
            ${c.genres.map((g) => `<span class="pill genre">${g}</span>`).join("")}
          </div>
          <p class="comic-desc">${c.description}</p>
          <div class="comic-foot">
            <span class="stars" title="${c.rating} / 5 from ${c.ratingsCount.toLocaleString()} ratings">${starBar(c.rating)} ${c.rating}</span>
            <span class="status-dot ${c.status}">${c.status}</span>
          </div>
          ${last ? `<p class="byline">📌 Continue: Episode ${last}</p>` : ""}
        </div>
      </article>`;
    }).join("");
    $("#libCount").textContent = bookmarks.size;
  }

  /* ---------- events: grid / pills / search / sort ---------- */
  document.addEventListener("click", (e) => {
    const bm = e.target.closest("[data-bookmark]");
    if (bm) {
      e.stopPropagation();
      toggleBookmark(bm.dataset.bookmark);
      return;
    }
    const read = e.target.closest("[data-read]");
    if (read) { openReader(read.dataset.read, 1); return; }
    const det = e.target.closest("[data-details]");
    if (det) { openModal(det.dataset.details); return; }
    const pill = e.target.closest("[data-genre]");
    if (pill) {
      activeGenre = pill.dataset.genre;
      showBookmarksOnly = false;
      renderGenrePills(); renderGrid();
      return;
    }
    const jump = e.target.closest("[data-genre-jump]");
    if (jump) {
      activeGenre = jump.dataset.genreJump;
      showBookmarksOnly = false;
      renderGenrePills(); renderGrid();
      document.querySelector("#browse").scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (e.target.closest("[data-filter-bookmarks]")) {
      e.preventDefault();
      showBookmarksOnly = !showBookmarksOnly;
      renderGrid();
      document.querySelector("#browse").scrollIntoView({ behavior: "smooth" });
      showToast(showBookmarksOnly ? "📚 Showing your library" : "📚 Showing all comics");
    }
  });

  grid.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.dataset.details) {
      e.preventDefault();
      openModal(e.target.dataset.details);
    }
  });

  let searchDeb;
  searchInput.addEventListener("input", () => { clearTimeout(searchDeb); searchDeb = setTimeout(renderGrid, 150); });
  sortSelect.addEventListener("change", renderGrid);
  $("#resetFilters").addEventListener("click", () => {
    searchInput.value = ""; activeGenre = "All"; showBookmarksOnly = false;
    renderGenrePills(); renderGrid();
  });

  function toggleBookmark(id) {
    const c = COMICS.find((x) => x.id === id);
    if (bookmarks.has(id)) { bookmarks.delete(id); showToast(`Removed “${c.title}” from library`); }
    else { bookmarks.add(id); showToast(`🔖 Saved “${c.title}” to library`); }
    store.set("inkpanel:bookmarks", [...bookmarks]);
    renderGrid();
    if (!$("#modalBackdrop").hidden) openModal(id, true); // refresh modal button
  }

  /* ---------- modal ---------- */
  const backdrop = $("#modalBackdrop");
  const modalBody = $("#modalBody");
  function openModal(id, keepOpen) {
    const c = COMICS.find((x) => x.id === id);
    if (!c) return;
    const saved = bookmarks.has(id);
    modalBody.innerHTML = `
      <div class="modal-hero">
        <img src="${c.cover}" alt="Cover of ${c.title}" />
        <div>
          <h3 id="modalTitle">${c.title}</h3>
          <p class="byline">by ${c.author} · since ${c.year} · updated ${c.updated}</p>
          <div class="featured-meta">
            ${c.genres.map((g) => `<span class="pill genre">${g}</span>`).join("")}
            <span class="pill rating">★ ${c.rating} (${c.ratingsCount.toLocaleString()})</span>
            <span class="pill status">${c.status === "ongoing" ? "🟢 Ongoing" : "🏁 Completed"}</span>
          </div>
          <p>${c.longDescription}</p>
          <div class="featured-actions">
            <button class="btn btn-primary" data-read="${c.id}">📖 Start reading</button>
            <button class="btn btn-ghost" data-bookmark="${c.id}">${saved ? "🔖 Saved" : "📑 Save to library"}</button>
          </div>
        </div>
      </div>
      <ol class="episode-list">
        <h4>Episodes (${c.episodes.filter((e) => e.available).length}/${c.episodes.length} available)</h4>
        ${c.episodes.map((ep) => `
          <li class="ep ${ep.available ? "" : "locked"}">
            <span class="ep-num">${ep.n}</span>
            <div class="ep-info"><strong>${ep.title}</strong><small>${ep.date}${ep.available ? "" : " · 🔒 coming soon"}</small></div>
            ${ep.available
              ? `<button class="btn btn-primary btn-sm" data-read-ep="${c.id}:${ep.n}">Read</button>`
              : `<button class="btn btn-ghost btn-sm" disabled>Soon</button>`}
          </li>`).join("")}
      </ol>`;
    if (!keepOpen) {
      backdrop.hidden = false;
      document.body.style.overflow = "hidden";
      $("#modalClose").focus();
    }
  }
  function closeModal() { backdrop.hidden = true; document.body.style.overflow = ""; }
  $("#modalClose").addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeModal(); });
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-read-ep]");
    if (b) { const [id, n] = b.dataset.readEp.split(":"); closeModal(); openReader(id, +n); }
  });

  /* ---------- reader ---------- */
  const reader = $("#reader");
  const readerScroll = $("#readerScroll");
  const readerPages = $("#readerPages");
  const readerEnd = $("#readerEnd");
  let current = { id: null, n: 1 };

  function openReader(id, n) {
    const c = COMICS.find((x) => x.id === id);
    if (!c) return;
    const ep = c.episodes.find((e) => e.n === n && e.available) || c.episodes.find((e) => e.available);
    if (!ep) { showToast("🔒 This episode isn't out yet"); return; }
    current = { id, n: ep.n };
    progress[id] = ep.n;
    store.set("inkpanel:progress", progress);

    $("#readerComicTitle").textContent = c.title;
    $("#readerEpTitle").textContent = `Episode ${ep.n}: ${ep.title}`;
    readerPages.innerHTML = `<img src="${ep.image}" alt="${c.title} episode ${ep.n}: ${ep.title}" />`;
    const idx = c.episodes.indexOf(ep);
    const next = c.episodes[idx + 1];
    readerEnd.innerHTML = `
      <h3 style="font-family:Bangers;font-size:1.8rem;margin:.2rem 0">🎉 End of Episode ${ep.n}</h3>
      <p style="opacity:.8">${next
        ? (next.available ? `Up next: “${next.title}”` : `“${next.title}” drops ${next.date} — save this comic to your library so you don't miss it!`)
        : `You've finished “${c.title}”. Nice binge! 📚`}</p>
      <div class="featured-actions" style="justify-content:center">
        ${next && next.available ? `<button class="btn btn-primary" id="endNext">Next episode →</button>` : ""}
        <button class="btn btn-ghost" data-bookmark="${c.id}" style="background:#26263a;color:#fff;border-color:#000">${bookmarks.has(c.id) ? "🔖 Saved" : "📑 Save comic"}</button>
      </div>`;
    const endNext = $("#endNext");
    if (endNext) endNext.addEventListener("click", () => openReader(id, next.n));

    updateReaderNav(c, ep);
    reader.hidden = false;
    document.body.style.overflow = "hidden";
    readerScroll.scrollTop = 0;
    updateProgress();
    renderGrid(); // refresh "Continue" labels
  }

  function updateReaderNav(c, ep) {
    const avail = c.episodes.filter((e) => e.available).map((e) => e.n);
    const i = avail.indexOf(ep.n);
    $("#prevEp").disabled = i <= 0;
    $("#nextEp").disabled = i >= avail.length - 1;
  }
  function stepEp(dir) {
    const c = COMICS.find((x) => x.id === current.id);
    if (!c) return;
    const avail = c.episodes.filter((e) => e.available).map((e) => e.n).sort((a, b) => a - b);
    const i = avail.indexOf(current.n) + dir;
    if (avail[i]) openReader(current.id, avail[i]);
    else showToast(dir > 0 ? "🏁 That's the latest episode!" : "👆 This is the first episode");
  }
  $("#prevEp").addEventListener("click", () => stepEp(-1));
  $("#nextEp").addEventListener("click", () => stepEp(1));
  $("#readerBack").addEventListener("click", closeReader);
  $("#readerTop").addEventListener("click", () => readerScroll.scrollTo({ top: 0, behavior: "smooth" }));

  function updateProgress() {
    const max = readerScroll.scrollHeight - readerScroll.clientHeight;
    const pct = max > 0 ? (readerScroll.scrollTop / max) * 100 : 0;
    $("#readerProgress").style.width = pct + "%";
  }
  readerScroll.addEventListener("scroll", updateProgress, { passive: true });

  function closeReader() {
    reader.hidden = true;
    document.body.style.overflow = "";
  }

  document.addEventListener("keydown", (e) => {
    if (!reader.hidden) {
      if (e.key === "Escape") closeReader();
      if (e.key === "ArrowRight") stepEp(1);
      if (e.key === "ArrowLeft") stepEp(-1);
    } else if (!backdrop.hidden && e.key === "Escape") closeModal();
  });

  /* ---------- init ---------- */
  renderStats();
  renderFeatured();
  renderGenrePills();
  renderGenreGrid();
  renderGrid();
})();
