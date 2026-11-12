# Aidai-Design

Portfolio site for Aidai, 3D animator. Placeholder copy and art throughout.

## The idea

Laid out like a printed portfolio: paper pages with big type for titles, black stages where the work plays, and one highlighter colour. No nav bar: a corner **Menu** opens a full-screen menu on every page, and every page ends with a "Next" link so a visit never dead-ends.

| Page | File | What's on it |
| --- | --- | --- |
| Home | `index.html` | Cover, showreel, snippets from featured projects (each links to that project on Work), and "Where to start" doors to Work and About. |
| Work | `work.html` | Project index, then a spread per project: title page, black stage with the video, highlight tag, notes, tools, and stills. |
| About | `about.html` | Bio, portrait, experience, education, toolkit, contact. |

## Files

| File | What's in it |
| --- | --- |
| `styles.css` | Shared look and layout. Colours and fonts are tokens at the top (`--accent`, `--paper`, `--stage`). |
| `script.js` | Shared script. `REEL` (showreel file) and the `PROJECTS` list (title, kind, year, highlight, blurb, tools, `featured`, `loop`, `video`, `poster`, `stills`), plus the menu, viewer and page-specific building. |

## Adding real work

- Showreel: set `REEL` in `script.js`, e.g. `"videos/showreel.mp4"`. It loops muted on the home page; "Play with sound" opens it in the viewer.
- Each project in `PROJECTS`: `poster` (image), `stills` (list of images), `loop` (short muted clip that plays inline and on home-page snippets) and `video` (full clip for the viewer).
- `featured: true` puts a project in the home-page snippets.

## Preview locally

```bash
python -m http.server 5174
```
