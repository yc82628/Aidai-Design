# Aidai-Design

A starting point for a 3D animator's portfolio. Placeholder names, copy and art throughout.

## The idea

The page borrows from the tools an animator works in:

- **Reel**: the showreel fills the first screen. Until the video exists, a live wireframe ball bounces across a viewport grid, with squash and stretch and onion-skin ghosts.
- **Selected shots**: a grid of shots with frame ranges. Hovering a card outlines it in "selection orange" and plays its preview loop; on phones the preview plays while the card is on screen. Clicking opens the player.
- **Shot breakdown**: drag to compare the clay pass with the final render, with the pipeline stages below.
- **About / Contact**: bio, toolkit, studios, and contact links.
- **Timeline**: instead of a nav bar, a timeline sits at the bottom. Scroll position is the playhead (with a running timecode), each section is a keyframe you can tap, and you can drag along it to scrub through the page.

## Files

| File | What's in it |
| --- | --- |
| `index.html` | Page structure. Any element with `data-label` becomes a keyframe on the timeline. |
| `styles.css` | Look and layout. Colours and fonts are tokens at the top (`--accent`, `--viewport`). |
| `script.js` | `REEL` (showreel file), the `PROJECTS` list (title, role, tools, frame range, `thumb`, `preview`, `video`), the player, breakdown slider, timeline and the placeholder viewport. |

## Adding real work

- Showreel: set `REEL` in `script.js`, e.g. `"videos/showreel.mp4"`. The wireframe placeholder switches off automatically.
- Each shot: add `thumb` (image), `preview` (short muted loop) and `video` (full clip) to its entry in `PROJECTS`.
- Breakdown: point `compare-before` / `compare-after` in `script.js` at the clay and final frames.

## Preview locally

```bash
python -m http.server 5174
```
