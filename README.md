# Felix' Workshop

A small collection of self-serve browser tools, hosted at
[workshop.fubl.org](https://workshop.fubl.org). No accounts, no build step, no
server: every tool runs entirely client-side, and the whole thing is open
source so that claim is checkable rather than just asserted.

## Tools

- [Draw SVG](draw-svg/) — set a pixel-sized canvas, draw freehand in any
  color, export exactly what you drew as a real SVG file.
- PDF Toolkit (coming soon) — merge, split, compress, convert, sign, and
  redact PDFs, fully client-side.

More tools land here over time, each in its own top-level folder linked from
the homepage ([index.html](index.html)).

## Stack

Plain HTML/CSS/JS per tool, no bundler, no framework. Shared chrome (fonts,
colors, buttons, cards) lives in [`assets/`](assets/) and is pulled in in the
[neo-retro](https://github.com/felixubl/neo-retro) design language:
JetBrains Mono body, Hepta Slab display, warm paper/ink palette, light/dark
via `data-theme`. See [`assets/tokens.css`](assets/tokens.css) for the
current values, and the neo-retro repo if the palette ever gets re-themed.

## Adding a new tool

1. Create `<tool-name>/index.html`, `style.css`, `script.js`.
2. Link `../assets/theme.js` (in `<head>`, before other stylesheets),
   `../assets/tokens.css`, and `../assets/base.css`; write only the
   tool-specific layout in the tool's own `style.css`.
3. Add a card for it to the root [index.html](index.html).

## License

Code in this repo is unlicensed (all rights reserved) unless stated
otherwise. The fonts in `assets/fonts/` are JetBrains Mono and Hepta Slab,
both SIL Open Font License 1.1 — see the `LICENSE-*.txt` files alongside
them.
