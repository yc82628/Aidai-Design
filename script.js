document.documentElement.classList.add("js");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover)").matches;

// ---------- Placeholder art ----------
// Generated in the browser so the base never depends on an outside image service.
// Replace with real renders by giving each project a `thumb` file, e.g. "images/moth-thumb.jpg".
const svgURI = (svg) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

function shotArt(hue, seed, clay = false) {
  const sky = clay ? ["#5b5e64", "#3a3c41"] : [`hsl(${hue} 45% 34%)`, `hsl(${hue + 30} 50% 12%)`];
  const body = clay ? ["#c4c6ca", "#55585d"] : [`hsl(${hue + 180} 70% 72%)`, `hsl(${hue + 200} 55% 28%)`];
  const floor = clay ? "#303236" : `hsl(${hue} 30% 9%)`;
  const r = 150 + (seed % 2) * 50;
  const cx = 520 + (seed % 3) * 220;
  const rim = clay ? "" : `<circle cx="${cx + 6}" cy="${620 - r - 4}" r="${r}" fill="none" stroke="hsl(${hue + 40} 90% 78%)" stroke-width="5" opacity=".45"/>`;
  return svgURI(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
    <defs>
      <linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient>
      <radialGradient id="b" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="${body[0]}"/><stop offset="1" stop-color="${body[1]}"/></radialGradient>
    </defs>
    <rect width="1600" height="900" fill="url(#s)"/>
    <rect y="620" width="1600" height="280" fill="${floor}"/>
    <ellipse cx="${cx}" cy="626" rx="${r * 1.15}" ry="${r * 0.16}" fill="rgba(0,0,0,.35)"/>
    <circle cx="${cx}" cy="${620 - r}" r="${r}" fill="url(#b)"/>
    ${rim}
    <rect x="${cx + r + 110}" y="490" width="130" height="130" fill="url(#b)" transform="rotate(-8 ${cx + r + 175} 555)"/>
  </svg>`);
}

const portraitArt = svgURI(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3d43"/><stop offset="1" stop-color="#26282c"/></linearGradient></defs>
  <rect width="800" height="1000" fill="url(#g)"/>
  <circle cx="400" cy="400" r="150" fill="#55585e"/>
  <path d="M130 1000c0-190 120-330 270-330s270 140 270 330z" fill="#55585e"/>
  <circle cx="400" cy="400" r="150" fill="none" stroke="#f29b38" stroke-width="4" opacity=".6"/>
</svg>`);

// ---------- Showreel ----------
// Set to the reel file once it exists, e.g. "videos/showreel.mp4".
// Until then the hero is a plain stage and the player shows a note.
const REEL = null;

// ---------- Projects ----------
// Placeholder list. Edit this array to add, remove or reorder shots.
// `frames` is the shot's frame range (shots conventionally start at 1001).
// `preview` is a short muted loop that plays on hover (or when scrolled into view on phones).
// `video` is the full clip that opens in the player.
const PROJECTS = [
  { title: "Moth & Lantern", studio: "Short film", role: "Character animation", tools: ["Maya", "Arnold"], year: 2026, frames: "1001–1096", hue: 24, preview: null, video: null },
  { title: "Tidewalker", studio: "Game cinematic", role: "Creature animation", tools: ["Maya", "Unreal"], year: 2026, frames: "1001–1188", hue: 200, preview: null, video: null },
  { title: "Paper Kite", studio: "Commercial", role: "Animation & lighting", tools: ["Blender", "Cycles"], year: 2025, frames: "1001–1072", hue: 330, preview: null, video: null },
  { title: "Forge", studio: "Personal", role: "Body mechanics", tools: ["Maya"], year: 2025, frames: "1001–1240", hue: 12, preview: null, video: null },
  { title: "Night Market", studio: "Feature (freelance)", role: "Crowd & background", tools: ["Houdini", "Maya"], year: 2024, frames: "1001–1144", hue: 268, preview: null, video: null },
  { title: "Small Step", studio: "Personal", role: "Acting shot, lip sync", tools: ["Blender"], year: 2024, frames: "1001–1120", hue: 150, preview: null, video: null },
].map((p, i) => ({ ...p, thumb: p.thumb || shotArt(p.hue, i) }));

const grid = document.getElementById("work-grid");

PROJECTS.forEach((p, i) => {
  const card = document.createElement("button");
  card.className = "card reveal";
  card.dataset.index = i;
  card.style.transitionDelay = `${(i % 3) * 80}ms`;
  card.innerHTML = `
    <span class="card__media">
      <img src="${p.thumb}" alt="" loading="lazy">
      ${p.preview ? `<video muted loop playsinline preload="none" data-src="${p.preview}"></video>` : ""}
      <span class="card__frame">${p.frames}</span>
    </span>
    <span class="card__meta">
      <span class="card__title"><span>${p.title}</span><span>${p.year}</span></span>
      <span class="card__role">${p.role} · ${p.studio}</span>
      <span class="chips">${p.tools.map((t) => `<span>${t}</span>`).join("")}</span>
    </span>`;
  grid.appendChild(card);
});

document.getElementById("work-count").textContent = `${String(PROJECTS.length).padStart(2, "0")} shots`;
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Card previews ----------
function startPreview(card) {
  const video = card.querySelector("video");
  if (!video || reduceMotion) return;
  if (!video.src) video.src = video.dataset.src;
  video.play().then(() => card.classList.add("is-playing")).catch(() => {});
}

function stopPreview(card) {
  const video = card.querySelector("video");
  if (!video) return;
  video.pause();
  card.classList.remove("is-playing");
}

if (canHover) {
  grid.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mouseenter", () => startPreview(card));
    card.addEventListener("mouseleave", () => stopPreview(card));
  });
} else {
  // Phones have no hover: play a card's preview while it's mostly on screen
  const inView = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? startPreview(e.target) : stopPreview(e.target)));
  }, { threshold: 0.6 });
  grid.querySelectorAll(".card").forEach((card) => inView.observe(card));
}

// ---------- Player ----------
const player = document.getElementById("player");
const playerVideo = document.getElementById("player-video");
const playerEmpty = document.getElementById("player-empty");
let opener = null;

function openPlayer({ src, title, meta }, from) {
  opener = from;
  document.getElementById("player-title").textContent = title;
  document.getElementById("player-meta").textContent = meta;
  playerVideo.hidden = !src;
  playerEmpty.hidden = Boolean(src);
  if (src) {
    playerVideo.src = src;
    playerVideo.play().catch(() => {});
  }
  player.hidden = false;
  document.body.classList.add("no-scroll");
  player.querySelector(".player__close").focus();
}

function closePlayer() {
  playerVideo.pause();
  playerVideo.removeAttribute("src");
  playerVideo.load();
  player.hidden = true;
  document.body.classList.remove("no-scroll");
  opener?.focus();
}

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  const p = PROJECTS[Number(card.dataset.index)];
  openPlayer({ src: p.video, title: p.title, meta: `${p.role} · ${p.studio} · ${p.year}` }, card);
});

const playReel = document.getElementById("play-reel");
playReel.addEventListener("click", () => {
  openPlayer({ src: REEL, title: "Showreel", meta: new Date().getFullYear() }, playReel);
});

player.querySelector(".player__close").addEventListener("click", closePlayer);
player.addEventListener("click", (e) => { if (e.target === player) closePlayer(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !player.hidden) closePlayer(); });

// ---------- Breakdown compare ----------
const compare = document.getElementById("compare");
document.getElementById("compare-after").src = shotArt(210, 1);
document.getElementById("compare-before").src = shotArt(210, 1, true);
document.getElementById("compare-range").addEventListener("input", (e) => {
  compare.style.setProperty("--pos", `${e.target.value}%`);
});
document.getElementById("portrait").src = portraitArt;

// ---------- Timeline ----------
// The page reads as one shot: scroll position is the playhead, sections are keyframes.
const FPS = 24;
const SHOT_SECONDS = 60;
const sections = [...document.querySelectorAll("[data-label]")];
const track = document.getElementById("track");
const playhead = document.getElementById("playhead");
const timecode = document.getElementById("timecode");
const timelineLabel = document.getElementById("timeline-label");

const maxScroll = () => Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
const clamp01 = (n) => Math.min(Math.max(n, 0), 1);

const keyframes = sections.map((section) => {
  const label = section.dataset.label;
  const kf = document.createElement("button");
  kf.type = "button";
  kf.className = "keyframe";
  kf.setAttribute("aria-label", `Go to ${label}`);
  kf.innerHTML = `<span class="keyframe__label">${label}</span>`;
  kf.addEventListener("click", () => section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }));
  track.appendChild(kf);
  return kf;
});

function layoutKeyframes() {
  sections.forEach((section, i) => {
    const pct = clamp01(section.offsetTop / maxScroll());
    keyframes[i].style.left = `${pct * 100}%`;
    keyframes[i].dataset.pct = pct;
  });
}

function formatTimecode(progress) {
  const total = Math.round(progress * SHOT_SECONDS * FPS);
  const ff = total % FPS;
  const s = Math.floor(total / FPS);
  return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60, ff]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}

function updateTimeline() {
  const progress = clamp01(window.scrollY / maxScroll());
  playhead.style.left = `${progress * 100}%`;
  timecode.textContent = formatTimecode(progress);
  keyframes.forEach((kf) => kf.classList.toggle("is-passed", Number(kf.dataset.pct) <= progress + 0.001));
  let current = sections[0];
  sections.forEach((s) => { if (s.offsetTop <= window.scrollY + window.innerHeight * 0.4) current = s; });
  timelineLabel.textContent = current.dataset.label;
}

// Drag along the track to scrub through the page
let scrubbing = false;
function scrubTo(e) {
  const rect = track.getBoundingClientRect();
  window.scrollTo({ top: clamp01((e.clientX - rect.left) / rect.width) * maxScroll(), behavior: "instant" });
}
track.addEventListener("pointerdown", (e) => {
  if (e.target.closest(".keyframe")) return;
  scrubbing = true;
  track.setPointerCapture(e.pointerId);
  scrubTo(e);
});
track.addEventListener("pointermove", (e) => { if (scrubbing) scrubTo(e); });
track.addEventListener("pointerup", () => { scrubbing = false; });
track.addEventListener("pointercancel", () => { scrubbing = false; });

let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => { updateTimeline(); ticking = false; });
    ticking = true;
  }
}, { passive: true });
new ResizeObserver(() => { layoutKeyframes(); updateTimeline(); }).observe(document.body);

// ---------- Scroll reveal ----------
document.querySelectorAll(".section__head, .compare, .pipeline li, .about__portrait, .about__text, .contact > *")
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

// ---------- Showreel in the hero ----------
const heroVideo = document.getElementById("hero-video");
if (REEL) {
  heroVideo.hidden = false;
  heroVideo.src = REEL;
  if (!reduceMotion) heroVideo.play().catch(() => {});
}
