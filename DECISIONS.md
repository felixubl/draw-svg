## 2026-07-23 — Draw directly onto SVG instead of canvas-to-SVG conversion
**Decided:** The drawing surface is an inline `<svg>` element itself; each stroke
is appended as a `<path>` while the user drags. "Export" just serializes that
SVG element to a file.
**Why:** A raster `<canvas>` would need a separate vectorization step (e.g.
tracing pixels into paths) to produce a clean SVG on export. Drawing straight
into SVG paths means the exported file is always exactly what's on screen,
with no conversion step or fidelity loss.
**Not explicitly requested** — flagged for review.

## 2026-07-23 — No build step or framework
**Decided:** Plain HTML/CSS/JS served as static files, no bundler, no
dependencies.
**Why:** The request was for a "very simple" one-shot app. A static site is
also the easiest thing to host later (e.g. GitHub Pages) with zero extra setup.
**Not explicitly requested** — flagged for review.

## 2026-07-23 — Repo name and visibility
**Decided:** Created the GitHub repo as `felixubl/draw-svg`, public.
**Why:** Matches the working directory name; "public" was explicitly requested.
**Not explicitly requested** — repo name specifically was inferred, flagged for review.
