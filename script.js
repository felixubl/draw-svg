const svg = document.getElementById("canvas");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const resizeBtn = document.getElementById("resize");
const colorInput = document.getElementById("color");
const strokeInput = document.getElementById("stroke");
const strokeValue = document.getElementById("strokeValue");
const clearBtn = document.getElementById("clear");
const exportBtn = document.getElementById("export");

const SVG_NS = "http://www.w3.org/2000/svg";

let drawing = false;
let points = [];
let currentPath = null;

function applySize() {
  const w = Math.max(1, parseInt(widthInput.value, 10) || 800);
  const h = Math.max(1, parseInt(heightInput.value, 10) || 600);
  svg.setAttribute("width", w);
  svg.setAttribute("height", h);
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
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
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }
}

function exportSvg() {
  const serializer = new XMLSerializer();
  const clone = svg.cloneNode(true);
  clone.setAttribute("xmlns", SVG_NS);
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

svg.addEventListener("pointerdown", pointerDown);
svg.addEventListener("pointermove", pointerMove);
svg.addEventListener("pointerup", pointerUp);
svg.addEventListener("pointercancel", pointerUp);

applySize();
