document.documentElement.classList.add("js");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover)").matches;
const page = document.body.dataset.page;

// ---------- Placeholder art ----------
// Generated in the browser so the base never depends on an outside image service.
// Replace with real files by giving each project a `poster` and `stills`, e.g. "images/moth-01.jpg".
const svgURI = (svg) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

function shotArt(hue, seed) {
  const r = 150 + (seed % 2) * 50;
  const cx = 520 + (seed % 3) * 220;
  return svgURI(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
    <defs>
      <linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(${hue} 25% 22%)"/><stop offset="1" stop-color="hsl(${hue + 30} 30% 7%)"/></linearGradient>
      <radialGradient id="b" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="hsl(${hue + 180} 55% 78%)"/><stop offset="1" stop-color="hsl(${hue + 200} 40% 22%)"/></radialGradient>
    </defs>
    <rect width="1600" height="900" fill="url(#s)"/>
    <rect y="620" width="1600" height="280" fill="hsl(${hue} 20% 6%)"/>
    <ellipse cx="${cx}" cy="626" rx="${r * 1.15}" ry="${r * 0.16}" fill="rgba(0,0,0,.4)"/>
    <circle cx="${cx}" cy="${620 - r}" r="${r}" fill="url(#b)"/>
    <circle cx="${cx + 6}" cy="${616 - r}" r="${r}" fill="none" stroke="hsl(${hue + 40} 80% 80%)" stroke-width="4" opacity=".35"/>
    <rect x="${cx + r + 110}" y="490" width="130" height="130" fill="url(#b)" transform="rotate(-8 ${cx + r + 175} 555)"/>
  </svg>`);
}

const portraitArt = svgURI(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
  <rect width="800" height="1000" fill="#2a2a2c"/>
  <circle cx="400" cy="400" r="150" fill="#56565a"/>
  <path d="M130 1000c0-190 120-330 270-330s270 140 270 330z" fill="#56565a"/>
</svg>`);

// ---------- Showreel ----------
// Set to the reel file once it exists, e.g. "videos/showreel.mp4".
const REEL = null;

// ---------- Projects ----------
// Placeholder list. Edit this array to add, remove or reorder projects.
// `featured` projects appear as snippets on the home page.
// `loop` is a short muted clip that plays inline; `video` is the full clip for the viewer.
// `slug` is the project's anchor on the Work page (work.html#slug).
const PROJECTS = [
  { slug: "moth-and-lantern", title: "Moth & Lantern", kind: "Character animation", studio: "Short film", year: 2026, hue: 24, featured: true,
    highlight: "Acting shot", blurb: "Placeholder. One or two lines on the shot: what the character feels, what Aidai was responsible for, what was hard.",
    tools: ["Maya", "Arnold"], loop: null, video: null },
  { slug: "tidewalker", title: "Tidewalker", kind: "Creature animation", studio: "Game cinematic", year: 2026, hue: 200, featured: true,
    highlight: "Creature", blurb: "Placeholder. Weight, gait and the moment the creature turns to camera.",
    tools: ["Maya", "Unreal"], loop: null, video: null },
  { slug: "paper-kite", title: "Paper Kite", kind: "Animation & lighting", studio: "Commercial", year: 2025, hue: 330, featured: true,
    highlight: "Commercial", blurb: "Placeholder. A 15-second spot: concept, animation and final lighting.",
    tools: ["Blender", "Cycles"], loop: null, video: null },
  { slug: "forge", title: "Forge", kind: "Body mechanics", studio: "Personal", year: 2025, hue: 12, featured: true,
    highlight: "Body mechanics", blurb: "Placeholder. A heavy lift, from blocking to polish.",
    tools: ["Maya"], loop: null, video: null },
  { slug: "night-market", title: "Night Market", kind: "Crowd & background", studio: "Feature (freelance)", year: 2024, hue: 268, featured: false,
    highlight: "Crowd", blurb: "Placeholder. Background performances that keep a busy frame alive.",
    tools: ["Houdini", "Maya"], loop: null, video: null },
].map((p, i) => ({
  ...p,
  poster: p.poster || shotArt(p.hue, i),
  stills: p.stills || [shotArt(p.hue + 20, i + 1), shotArt(p.hue - 25, i + 2), shotArt(p.hue + 50, i)],
}));

document.querySelectorAll(".js-year").forEach((el) => { el.textContent = new Date().getFullYear(); });

// ---------- Viewer (videos and stills) ----------
const viewer = document.getElementById("viewer");
let viewerItems = [];
let viewerIndex = 0;
let viewerOpener = null;

function showItem(i) {
  const img = document.getElementById("viewer-img");
  const video = document.getElementById("viewer-video");
  const empty = document.getElementById("viewer-empty");
  viewerIndex = (i + viewerItems.length) % viewerItems.length;
  const item = viewerItems[viewerIndex];
  video.pause();
  document.getElementById("viewer-cap").textContent = item.caption;
  img.hidden = item.type !== "image";
  video.hidden = item.type !== "video" || !item.src;
  empty.hidden = item.type !== "video" || Boolean(item.src);
  if (item.type === "image") {
    img.src = item.src;
    img.alt = item.caption;
    img.classList.remove("is-swapping");
    void img.offsetWidth; // restart the fade-in
    img.classList.add("is-swapping");
  } else if (item.src) {
    video.src = item.src;
    video.play().catch(() => {});
  }
}

function openViewer(items, index, from) {
  if (!viewer) return;
  viewerItems = items;
  viewerOpener = from;
  viewer.querySelectorAll(".viewer__nav").forEach((b) => { b.hidden = items.length < 2; });
  showItem(index);
  viewer.hidden = false;
  document.body.classList.add("no-scroll");
  viewer.querySelector(".viewer__close").focus();
}

function closeViewer() {
  const video = document.getElementById("viewer-video");
  video.pause();
  video.removeAttribute("src");
  video.load();
  viewer.hidden = true;
  document.body.classList.remove("no-scroll");
  viewerOpener?.focus();
}

if (viewer) {
  viewer.querySelector(".viewer__close").addEventListener("click", closeViewer);
  viewer.querySelector(".viewer__nav--prev").addEventListener("click", () => showItem(viewerIndex - 1));
  viewer.querySelector(".viewer__nav--next").addEventListener("click", () => showItem(viewerIndex + 1));
  viewer.addEventListener("click", (e) => { if (e.target === viewer) closeViewer(); });

  // Swipe left / right on touch screens
  let touchX = null;
  viewer.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  viewer.addEventListener("touchend", (e) => {
    if (touchX === null || viewerItems.length < 2) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) showItem(viewerIndex + (dx < 0 ? 1 : -1));
    touchX = null;
  });
}

// ---------- Home ----------
const reelPoster = document.getElementById("reel-poster");
if (reelPoster) {
  reelPoster.src = shotArt(210, 1);
  const reelVideo = document.getElementById("reel-video");
  if (REEL) {
    reelVideo.src = REEL;
    reelVideo.hidden = false;
  }
  const reelPlay = document.getElementById("reel-play");
  reelPlay.addEventListener("click", () => {
    openViewer([{ type: "video", src: REEL, caption: "Showreel" }], 0, reelPlay);
  });
}

const snippets = document.getElementById("snippets");
if (snippets) {
  PROJECTS.filter((p) => p.featured).forEach((p, i) => {
    const tile = document.createElement("a");
    tile.className = "snip reveal";
    tile.href = `work.html#${p.slug}`;
    tile.style.transitionDelay = `${(i % 4) * 80}ms`;
    tile.innerHTML = `
      <span class="snip__media">
        <img src="${p.poster}" alt="" loading="lazy">
        ${p.loop ? `<video muted loop playsinline preload="none" data-src="${p.loop}"></video>` : ""}
        ${p.loop || p.video ? `<span class="tag snip__badge">Video</span>` : ""}
      </span>
      <span class="snip__meta"><span>${p.title}</span><span>${p.kind}</span></span>`;
    snippets.appendChild(tile);
  });

  // Snippets with a loop play it on hover, or while on screen on phones
  const play = (tile) => {
    const v = tile.querySelector("video");
    if (!v || reduceMotion) return;
    if (!v.src) v.src = v.dataset.src;
    v.play().then(() => tile.classList.add("is-playing")).catch(() => {});
  };
  const stop = (tile) => {
    const v = tile.querySelector("video");
    if (!v) return;
    v.pause();
    tile.classList.remove("is-playing");
  };
  const tiles = snippets.querySelectorAll(".snip");
  if (canHover) {
    tiles.forEach((t) => {
      t.addEventListener("mouseenter", () => play(t));
      t.addEventListener("mouseleave", () => stop(t));
    });
  } else {
    const inView = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? play(e.target) : stop(e.target)));
    }, { threshold: 0.6 });
    tiles.forEach((t) => inView.observe(t));
  }

  document.getElementById("work-door-desc").textContent =
    `${PROJECTS.length} projects, each with its shots, breakdown and stills.`;
}

// ---------- Work ----------
const indexList = document.getElementById("index-list");
const projectsEl = document.getElementById("projects");
if (projectsEl) {
  const pad = (n) => String(n).padStart(2, "0");
  document.getElementById("work-count").textContent = `${pad(PROJECTS.length)} projects`;

  PROJECTS.forEach((p, i) => {
    indexList.insertAdjacentHTML("beforeend", `
      <li><a href="#${p.slug}"><span>${pad(i + 1)}</span><span>${p.title}</span><span>${p.kind} · ${p.year}</span></a></li>`);

    const article = document.createElement("article");
    article.className = "project";
    article.id = p.slug;
    article.innerHTML = `
      <header class="panel project__cover">
        <div class="labels"><span>${pad(i + 1)} / ${pad(PROJECTS.length)}</span><span>${p.studio} · ${p.year}</span></div>
        <div class="reveal">
          <h2 class="project__title">${p.title}</h2>
          <p class="project__kind">( ${p.kind} )</p>
        </div>
      </header>
      <div class="panel panel--dark project__stage">
        <div class="screen reveal">
          <img class="screen__poster" src="${p.poster}" alt="${p.title} (placeholder)">
          ${p.loop ? `<video class="screen__video autoplay" src="${p.loop}" muted loop playsinline preload="metadata"></video>` : ""}
          <button class="screen__play" data-project="${i}"><span aria-hidden="true"></span>Play with sound</button>
        </div>
        <div class="stage__text reveal">
          <span class="tag">${p.highlight}</span>
          <p>${p.blurb}</p>
          <ul class="stage__tools">${p.tools.map((t) => `<li>${t}</li>`).join("")}</ul>
        </div>
        <span class="stage__vertical" aria-hidden="true">( ${p.kind} )</span>
      </div>
      <div class="project__stills">
        ${p.stills.map((src, k) => `
          <button class="still" data-project="${i}" data-still="${k}" aria-label="View ${p.title}, still ${k + 1}">
            <img src="${src}" alt="" loading="lazy">
          </button>`).join("")}
      </div>`;
    projectsEl.appendChild(article);
  });

  projectsEl.addEventListener("click", (e) => {
    const play = e.target.closest(".screen__play");
    const still = e.target.closest(".still");
    if (play) {
      const p = PROJECTS[Number(play.dataset.project)];
      openViewer([{ type: "video", src: p.video, caption: `${p.title} — ${p.kind}` }], 0, play);
    } else if (still) {
      const p = PROJECTS[Number(still.dataset.project)];
      const items = p.stills.map((src, k) => ({ type: "image", src, caption: `${p.title} — still ${k + 1} / ${p.stills.length}` }));
      openViewer(items, Number(still.dataset.still), still);
    }
  });

  // Projects are built by this script, so the browser can't jump to work.html#slug on its own.
  // Jump now, then again once fonts and images have settled the layout.
  const target = location.hash && document.getElementById(location.hash.slice(1));
  if (target) {
    const jump = () => target.scrollIntoView({ behavior: "instant", block: "start" });
    jump();
    document.fonts?.ready.then(jump);
    window.addEventListener("load", jump, { once: true });
  }
}

// ---------- About ----------
document.getElementById("portrait")?.setAttribute("src", portraitArt);

// ---------- Inline loops (showreel and project stages) ----------
// Play while on screen, pause when off, so phones don't run every video at once
const loops = [...document.querySelectorAll("video.autoplay")].filter((v) => v.getAttribute("src"));
if (loops.length && !reduceMotion) {
  const watcher = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause()));
  }, { threshold: 0.25 });
  loops.forEach((v) => watcher.observe(v));
}

// ---------- Backdrop menu ----------
const toggle = document.querySelector(".menu-toggle");
const backdrop = document.getElementById("backdrop");
const backdropArt = backdrop.querySelector(".backdrop__art");
const toggleLabel = toggle.querySelector(".menu-toggle__label");
const MENU_ART = {
  home: shotArt(210, 1),
  work: PROJECTS[0].poster,
  about: portraitArt,
  contact: PROJECTS[1].poster,
};

function showMenuArt(key) {
  backdropArt.style.backgroundImage = `url("${MENU_ART[key] || MENU_ART.home}")`;
  backdropArt.classList.add("is-visible");
}

function setMenu(open) {
  backdrop.classList.toggle("is-open", open);
  backdrop.setAttribute("aria-hidden", String(!open));
  toggle.setAttribute("aria-expanded", String(open));
  toggleLabel.textContent = open ? "Close" : "Menu";
  document.body.classList.toggle("no-scroll", open);
  // Opens over the current page's art, so touch screens (no hover) see it too
  if (open) showMenuArt(page);
  else backdropArt.classList.remove("is-visible");
}

toggle.addEventListener("click", () => setMenu(!backdrop.classList.contains("is-open")));

backdrop.querySelectorAll("a").forEach((link) => {
  if (link.dataset.page === page) link.setAttribute("aria-current", "page");
  link.addEventListener("mouseenter", () => showMenuArt(link.dataset.page));
  link.addEventListener("focus", () => showMenuArt(link.dataset.page));
  link.addEventListener("mouseleave", () => showMenuArt(page));
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (e) => {
  if (viewer && !viewer.hidden) {
    if (e.key === "Escape") closeViewer();
    if (e.key === "ArrowLeft" && viewerItems.length > 1) showItem(viewerIndex - 1);
    if (e.key === "ArrowRight" && viewerItems.length > 1) showItem(viewerIndex + 1);
  } else if (e.key === "Escape" && backdrop.classList.contains("is-open")) {
    setMenu(false);
  }
});

// ---------- Scroll reveal ----------
document.querySelectorAll(".cover__body, .labels, .screen, .door, .index__list, .about__head, .about__portrait, .about__bio, .about__cols, .contact__email, .next__title")
  .forEach((el) => el.classList.add("reveal"));

const revealer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-in");
      revealer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => revealer.observe(el));
