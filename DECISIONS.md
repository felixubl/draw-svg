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

## 2026-07-23 — Zoom is separate from the canvas's true pixel size
**Decided:** The canvas keeps a "logical" pixel size (used for the SVG
`viewBox`, the coordinate space strokes are drawn in, and the exported file's
width/height) that is independent from its on-screen display size. Zoom only
scales the display size; export always uses the logical size regardless of
current zoom.
**Why:** Otherwise a large pixel size (e.g. 4000x3000) would overflow the
page, and a small one (e.g. 100x80) would be too tiny to draw on comfortably.
Decoupling the two lets the canvas always render at a usable on-screen size
while the exported SVG stays exactly the pixel dimensions the user asked for.
**Not explicitly requested** — flagged for review.

## 2026-07-23 — Auto-fit algorithm and zoom range
**Decided:** On load and whenever "Set canvas" or "Fit" is clicked, zoom is
computed as `min(availableWidth / canvasWidth, availableHeight / canvasHeight)`,
clamped to 5%-800%. Manual zoom (+/-) steps by 1.25x per click within the same
bounds. A window resize re-fits automatically unless the user has manually
zoomed since the last fit.
**Why:** No specific numbers were given, so these are reasonable defaults for
"decently sized" and "zoom in/out": the fit formula keeps the canvas fully
visible without needing to scroll, and 5%-800% comfortably covers both very
large and very small pixel canvases.
**Not explicitly requested** — flagged for review.

## 2026-07-23 — Pixel grid implementation
**Decided:** The grid is a single SVG `<rect>` filled with a 1x1 unit tiled
`<pattern>` (one line per logical pixel), toggled via a checkbox and off by
default. It's stripped out of the file when exporting.
**Why:** A pattern fill avoids generating thousands of individual grid-line
elements for large canvases. It's excluded from export because it's a drawing
aid, not part of the artwork.
**Not explicitly requested** — flagged for review.
