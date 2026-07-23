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

## 2026-07-23 — Repo and folder renamed draw-svg -> workshop
**Decided:** Renamed the GitHub repo (`gh repo rename`, which updated the
`origin` remote automatically) and the local project folder from `draw-svg`
to `workshop`.
**Why:** The project's scope changed this turn from a single SVG tool to a
multi-tool hub ("Felix' Workshop"). Keeping the old name would misdescribe
what's in the repo. Low risk: the repo is only a few hours old and not
referenced anywhere external yet.
**Not explicitly requested** — flagged for review.

## 2026-07-23 — Information architecture: one folder per tool
**Decided:** The root `index.html` is the workshop homepage (tool listing);
each tool lives in its own top-level folder (`draw-svg/`) with its own
`index.html`/`style.css`/`script.js`, importing shared chrome from
`../assets/`.
**Why:** Keeps each tool's markup/script self-contained and easy to add to
(just drop a new folder + a card on the homepage) without a build step or
router. Scales fine for a handful of small tools; would need revisiting if
the workshop grows into dozens of tools or needs shared app state.
**Not explicitly requested** — flagged for review.

## 2026-07-23 — Vendored neo-retro as static files, not a live dependency
**Decided:** Copied `dist/tokens.css` and the font files from
`felixubl/neo-retro` directly into `assets/`, rather than fetching them from
a CDN or the neo-retro repo at request time. A comment in `tokens.css` notes
where to re-copy from if the palette is rebranded.
**Why:** Per neo-retro's own README, this is the supported no-build-tool
integration path ("Not on Tailwind? Use `dist/tokens.css` alone"). Vendoring
means the workshop keeps working even if neo-retro changes or is unreachable,
at the cost of needing a manual re-copy to pick up future rebrands.
**Not explicitly requested** — flagged for review.

## 2026-07-23 — Theme toggle added (light/dark via neo-retro tokens)
**Decided:** Added a moon/sun icon-button that flips `data-theme` on
`<html>`, following neo-retro's documented pattern: OS preference on first
visit (`prefers-color-scheme`), explicit choice persisted in `localStorage`
after that, set by a synchronous pre-paint script (`assets/theme.js`) to
avoid a flash.
**Why:** Not explicitly asked for, but neo-retro's own design language
document lists this as a core principle ("Theme-aware through tokens,
toggled explicitly") and the tokens already ship both themes — implementing
only light mode would be a partial, non-conformant use of the language.
**Not explicitly requested** — flagged for review.

## 2026-07-23 — Drawing canvas stays paper-light regardless of site theme
**Decided:** In `draw-svg/style.css`, `#canvasWrap`'s background is hardcoded
to a fixed light "paper" color (`#fdfcfb`) rather than `var(--surface)`,
which flips dark in dark mode.
**Why:** The default pen color is near-black. If the canvas surface flipped
dark with the rest of the UI, the default stroke would be nearly invisible
against it. A drawing surface is conceptually paper, not UI chrome — it stays
light the way a real sketchpad would, independent of the app's theme, and the
exported SVG has no background fill either way.
**Not explicitly requested** — flagged for review.

## 2026-07-23 — PDF Toolkit is a placeholder card, not built yet
**Decided:** Added a "Coming soon" card on the homepage describing the
planned PDF tool (merge/split/compress/convert, sign, redact, client-side
only) but did not implement it this turn.
**Why:** The request described it as "what will come next," and building a
full PDF editor with signing/redaction is a substantial separate project —
out of scope for a design-language pass on the existing tool + homepage.
**Not explicitly requested** — flagged for review.

## 2026-07-23 — GitHub Pages enabled with custom domain, DNS still pending
**Decided:** Enabled GitHub Pages on the `workshop` repo (source: `main`
branch, root) via the API and set its custom domain to `workshop.fubl.org`
(also committed a `CNAME` file with that value, and a `.nojekyll` file so
Pages serves the static files as-is instead of running them through Jekyll).
**Why:** Requested hosting at `workshop.fubl.org`. I cannot configure DNS
myself (it's on the user's registrar/DNS provider for `fubl.org`, outside
anything I have access to) — the user still needs to add a `CNAME` record
for the `workshop` subdomain pointing to `felixubl.github.io` before the
domain resolves.
**Not explicitly requested** — flagged for review (the Pages/API setup
specifically; the domain itself was requested).
