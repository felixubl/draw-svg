const svg = document.getElementById("canvas");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const resizeBtn = document.getElementById("resize");
const colorInput = document.getElementById("color");
const strokeInput = document.getElementById("stroke");
const strokeValue = document.getElementById("strokeValue");
const clearBtn = document.getElementById("clear");
const exportBtn = document.getElementById("export");
const zoomInBtn = document.getElementById("zoomIn");
const zoomOutBtn = document.getElementById("zoomOut");
const zoomFitBtn = document.getElementById("zoomFit");
const zoomValue = document.getElementById("zoomValue");
const gridToggle = document.getElementById("gridToggle");
const gridOverlay = document.getElementById("gridOverlay");

const SVG_NS = "http://www.w3.org/2000/svg";
const MIN_ZOOM = 0.05;
const MAX_ZOOM = 8;
const ZOOM_STEP = 1.25;

let drawing = false;
let points = [];
let currentPath = null;
let logicalWidth = Math.max(1, parseInt(widthInput.value, 10) || 800);
let logicalHeight = Math.max(1, parseInt(heightInput.value, 10) || 600);
let zoom = 1;
let manualZoom = false;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// Keeps the canvas from either overflowing the viewport (huge pixel sizes)
// or rendering imperceptibly small (tiny pixel sizes) before any manual zoom.
function computeFitZoom(w, h) {
  const maxW = Math.min(window.innerWidth - 96, 1100);
  const maxH = Math.min(window.innerHeight - 260, 640);
  return clamp(Math.min(maxW / w, maxH / h), MIN_ZOOM, MAX_ZOOM);
}

function applyZoom() {
  svg.setAttribute("width", Math.round(logicalWidth * zoom));
  svg.setAttribute("height", Math.round(logicalHeight * zoom));
  zoomValue.textContent = `${Math.round(zoom * 100)}%`;
}

function applySize() {
  logicalWidth = Math.max(1, parseInt(widthInput.value, 10) || 800);
  logicalHeight = Math.max(1, parseInt(heightInput.value, 10) || 600);
  svg.setAttribute("viewBox", `0 0 ${logicalWidth} ${logicalHeight}`);
  zoom = computeFitZoom(logicalWidth, logicalHeight);
  manualZoom = false;
  applyZoom();
}

function getPoint(evt) {
  const rect = svg.getBoundingClientRect();
  const scaleX = svg.viewBox.baseVal.width / rect.width;
  const scaleY = svg.viewBox.baseVal.height / rect.height;
  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY,
  };
}

function pointerDown(evt) {
  drawing = true;
  points = [getPoint(evt)];
  currentPath = document.createElementNS(SVG_NS, "path");
  currentPath.setAttribute("fill", "none");
  currentPath.setAttribute("stroke", colorInput.value);
  currentPath.setAttribute("stroke-width", strokeInput.value);
  currentPath.setAttribute("stroke-linecap", "round");
  currentPath.setAttribute("stroke-linejoin", "round");
  currentPath.setAttribute("d", pathData(points));
  svg.appendChild(currentPath);
  svg.setPointerCapture(evt.pointerId);
}

function pointerMove(evt) {
  if (!drawing) return;
  points.push(getPoint(evt));
  currentPath.setAttribute("d", pathData(points));
}

function pointerUp(evt) {
  if (!drawing) return;
  drawing = false;
  currentPath = null;
  svg.releasePointerCapture(evt.pointerId);
}

function pathData(pts) {
  if (pts.length === 0) return "";
  const [first, ...rest] = pts;
  let d = `M ${first.x.toFixed(2)} ${first.y.toFixed(2)}`;
  for (const p of rest) {
    d += ` L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  }
  return d;
}

function clearCanvas() {
  svg.querySelectorAll("path").forEach((p) => p.remove());
}

function exportSvg() {
  const serializer = new XMLSerializer();
  const clone = svg.cloneNode(true);
  clone.setAttribute("xmlns", SVG_NS);
  // The on-screen size follows zoom; the exported file must always be the
  // true pixel dimensions the canvas was set to.
  clone.setAttribute("width", logicalWidth);
  clone.setAttribute("height", logicalHeight);
  const overlay = clone.querySelector("#gridOverlay");
  if (overlay) overlay.remove();
  const defs = clone.querySelector("defs");
  if (defs) defs.remove();
  const source = serializer.serializeToString(clone);
  const blob = new Blob(
    [`<?xml version="1.0" encoding="UTF-8"?>\n${source}`],
    { type: "image/svg+xml" }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "drawing.svg";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

resizeBtn.addEventListener("click", applySize);
strokeInput.addEventListener("input", () => {
  strokeValue.textContent = `${strokeInput.value}px`;
});
clearBtn.addEventListener("click", clearCanvas);
exportBtn.addEventListener("click", exportSvg);

zoomInBtn.addEventListener("click", () => {
  zoom = clamp(zoom * ZOOM_STEP, MIN_ZOOM, MAX_ZOOM);
  manualZoom = true;
  applyZoom();
});
zoomOutBtn.addEventListener("click", () => {
  zoom = clamp(zoom / ZOOM_STEP, MIN_ZOOM, MAX_ZOOM);
  manualZoom = true;
  applyZoom();
});
zoomFitBtn.addEventListener("click", () => {
  zoom = computeFitZoom(logicalWidth, logicalHeight);
  manualZoom = false;
  applyZoom();
});

gridToggle.addEventListener("change", () => {
  gridOverlay.style.display = gridToggle.checked ? "" : "none";
});

window.addEventListener("resize", () => {
  if (manualZoom) return;
  zoom = computeFitZoom(logicalWidth, logicalHeight);
  applyZoom();
});

svg.addEventListener("pointerdown", pointerDown);
svg.addEventListener("pointermove", pointerMove);
svg.addEventListener("pointerup", pointerUp);
svg.addEventListener("pointercancel", pointerUp);

applySize();
