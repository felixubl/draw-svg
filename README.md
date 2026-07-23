# Draw SVG

A tiny browser drawing app. Set a canvas size in pixels, draw freehand with a
chosen color and stroke width, then export the drawing as a real SVG file.

No build step, no dependencies. Just open [index.html](index.html) in a
browser, or serve the folder with any static file server.

## How it works

Strokes are drawn directly as `<path>` elements inside an inline SVG element,
so "export" is just serializing that SVG to a `.svg` file — no raster-to-vector
conversion involved.
