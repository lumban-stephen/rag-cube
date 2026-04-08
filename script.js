const canvas = document.getElementById("vector-canvas");
const tooltip = document.getElementById("tooltip");
const pauseButton = document.getElementById("pause-button");
const ctx = canvas.getContext("2d");

const clusters = [
  {
    name: "Knowledge retrieval",
    color: "#69e2ff",
    words: [
      { label: "query", position: [-0.52, 0.36, 0.26] },
      { label: "retrieve", position: [-0.4, 0.31, 0.22] },
      { label: "context", position: [-0.46, 0.21, 0.3] },
      { label: "document", position: [-0.33, 0.24, 0.35] },
      { label: "chunk", position: [-0.56, 0.24, 0.14] },
      { label: "passage", position: [-0.39, 0.12, 0.18] },
      { label: "ranking", position: [-0.28, 0.34, 0.16] },
      { label: "lookup", position: [-0.62, 0.18, 0.22] },
      { label: "source", position: [-0.22, 0.16, 0.4] },
    ],
    links: [
      ["query", "retrieve"],
      ["retrieve", "context"],
      ["context", "document"],
      ["document", "chunk"],
      ["chunk", "passage"],
      ["retrieve", "ranking"],
      ["lookup", "retrieve"],
      ["source", "document"],
    ],
  },
  {
    name: "Embedding space",
    color: "#90ffb2",
    words: [
      { label: "vector", position: [0.2, 0.34, -0.16] },
      { label: "embedding", position: [0.31, 0.26, -0.22] },
      { label: "distance", position: [0.22, 0.16, -0.3] },
      { label: "similarity", position: [0.36, 0.11, -0.16] },
      { label: "cluster", position: [0.14, 0.24, -0.36] },
      { label: "semantic", position: [0.28, 0.17, -0.38] },
      { label: "nearest", position: [0.42, 0.22, -0.2] },
      { label: "index", position: [0.12, 0.38, -0.26] },
      { label: "latent", position: [0.34, 0.3, -0.32] },
    ],
    links: [
      ["vector", "embedding"],
      ["embedding", "distance"],
      ["distance", "similarity"],
      ["embedding", "cluster"],
      ["cluster", "semantic"],
      ["semantic", "nearest"],
      ["vector", "index"],
      ["latent", "semantic"],
    ],
  },
  {
    name: "Answer synthesis",
    color: "#ffb86b",
    words: [
      { label: "prompt", position: [-0.08, -0.34, 0.02] },
      { label: "reason", position: [0.04, -0.26, 0.1] },
      { label: "answer", position: [0.18, -0.34, 0.18] },
      { label: "citation", position: [0.08, -0.16, 0.24] },
      { label: "summary", position: [0.16, -0.22, 0.3] },
      { label: "grounding", position: [-0.02, -0.2, 0.16] },
      { label: "response", position: [0.28, -0.24, 0.08] },
      { label: "compose", position: [0.1, -0.38, 0.08] },
      { label: "evidence", position: [0.2, -0.12, 0.22] },
    ],
    links: [
      ["prompt", "reason"],
      ["reason", "answer"],
      ["reason", "citation"],
      ["citation", "grounding"],
      ["grounding", "summary"],
      ["answer", "response"],
      ["compose", "answer"],
      ["evidence", "citation"],
    ],
  },
  {
    name: "Noise and drift",
    color: "#ff7d9c",
    words: [
      { label: "random", position: [-0.18, 0.48, -0.28] },
      { label: "signal", position: [-0.08, 0.42, -0.2] },
      { label: "drift", position: [0, 0.32, -0.32] },
      { label: "topic", position: [0.1, 0.44, -0.26] },
      { label: "intent", position: [0.16, 0.34, -0.16] },
      { label: "memory", position: [-0.02, 0.54, -0.1] },
      { label: "ambiguity", position: [0.04, 0.24, -0.22] },
      { label: "noise", position: [-0.14, 0.58, -0.24] },
    ],
    links: [
      ["random", "signal"],
      ["signal", "drift"],
      ["drift", "topic"],
      ["topic", "intent"],
      ["intent", "memory"],
      ["noise", "signal"],
      ["ambiguity", "drift"],
    ],
  },
  {
    name: "Mixed vocabulary",
    color: "#c9a6ff",
    words: [
      { label: "apple", position: [-0.42, -0.42, -0.26] },
      { label: "river", position: [-0.32, -0.5, -0.18] },
      { label: "planet", position: [-0.08, -0.46, -0.34] },
      { label: "notebook", position: [0.02, -0.54, -0.22] },
      { label: "signal-42", position: [0.18, -0.48, -0.3] },
      { label: "lattice", position: [0.28, -0.56, -0.18] },
      { label: "violet", position: [-0.22, -0.34, -0.42] },
      { label: "harbor", position: [0.34, -0.4, -0.1] },
    ],
    links: [
      ["apple", "river"],
      ["planet", "notebook"],
      ["signal-42", "lattice"],
      ["violet", "planet"],
      ["harbor", "lattice"],
    ],
  },
  {
    name: "Scattered terms",
    color: "#ffd966",
    words: [
      { label: "archive", position: [-0.72, 0.66, 0.02] },
      { label: "kernel", position: [0.7, 0.58, 0.46] },
      { label: "bridge", position: [-0.68, -0.08, -0.58] },
      { label: "orbit", position: [0.62, -0.18, 0.62] },
      { label: "pebble", position: [-0.18, 0.72, -0.66] },
      { label: "syntax", position: [0.08, -0.72, 0.56] },
      { label: "forest", position: [-0.76, -0.52, 0.28] },
      { label: "thread", position: [0.74, 0.08, -0.46] },
      { label: "magnet", position: [-0.02, 0.02, -0.72] },
      { label: "glimmer", position: [0.52, -0.66, -0.56] },
      { label: "anchor", position: [-0.48, 0.74, 0.58] },
      { label: "delta", position: [0.26, 0.68, -0.02] },
    ],
    links: [],
  },
  {
    name: "Far neighbors",
    color: "#7ce7c7",
    words: [
      { label: "cache", position: [-0.6, -0.72, 0.62] },
      { label: "token", position: [0.68, -0.58, 0.02] },
      { label: "matrix", position: [0.56, 0.46, 0.7] },
      { label: "beacon", position: [-0.74, 0.14, 0.64] },
      { label: "fractal", position: [0.12, 0.74, 0.34] },
      { label: "stream", position: [-0.3, -0.68, -0.64] },
      { label: "signal-map", position: [0.76, 0.2, 0.2] },
      { label: "node", position: [-0.14, -0.02, 0.72] },
    ],
    links: [
      ["cache", "token"],
      ["matrix", "node"],
    ],
  },
  {
    name: "Loose associations",
    color: "#ff9fb3",
    words: [
      { label: "museum", position: [-0.58, -0.26, 0.7] },
      { label: "glass", position: [0.44, 0.72, -0.52] },
      { label: "whisper", position: [0.72, -0.08, -0.7] },
      { label: "canvas", position: [-0.72, 0.4, -0.2] },
      { label: "compass", position: [0.04, 0.56, 0.68] },
      { label: "pulse", position: [-0.04, -0.54, -0.72] },
      { label: "signal-light", position: [0.62, 0.02, -0.18] },
      { label: "paper", position: [-0.4, 0.04, 0.62] },
    ],
    links: [
      ["canvas", "paper"],
      ["glass", "signal-light"],
    ],
  },
];

const points = clusters.flatMap((cluster) =>
  cluster.words.map((word) => ({
    ...word,
    cluster: cluster.name,
    color: cluster.color,
  })),
);

const pointMap = new Map(points.map((point) => [point.label, point]));
const links = clusters.flatMap((cluster) =>
  cluster.links.map(([from, to]) => ({
    from: pointMap.get(from),
    to: pointMap.get(to),
    color: cluster.color,
  })),
);

let width = 0;
let height = 0;
let rotationX = -0.5;
let rotationY = 0.65;
let autoSpinX = 0.0016;
let autoSpinY = 0.0022;
let isDragging = false;
let lastPointer = null;
let hoveredPoint = null;
let isPaused = false;
let selectedPointLabel = null;

function createVector(label) {
  let seed = 0;

  for (let index = 0; index < label.length; index += 1) {
    seed = (seed * 31 + label.charCodeAt(index)) >>> 0;
  }

  const values = [];

  for (let index = 0; index < 6; index += 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const normalized = (seed / 4294967295) * 2 - 1;
    values.push(normalized.toFixed(2));
  }

  return `[${values.join(", ")}]`;
}

function resize() {
  const dpr = window.devicePixelRatio || 1;
  const bounds = canvas.getBoundingClientRect();
  width = bounds.width;
  height = bounds.height;
  canvas.width = Math.round(bounds.width * dpr);
  canvas.height = Math.round(bounds.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function rotatePoint([x, y, z]) {
  const cosY = Math.cos(rotationY);
  const sinY = Math.sin(rotationY);
  const xz = x * cosY - z * sinY;
  const zz = x * sinY + z * cosY;

  const cosX = Math.cos(rotationX);
  const sinX = Math.sin(rotationX);
  const yz = y * cosX - zz * sinX;
  const zz2 = y * sinX + zz * cosX;

  return [xz, yz, zz2];
}

function project(point) {
  const [x, y, z] = rotatePoint(point);
  const camera = 3.2;
  const depth = camera / (camera - z);
  const scale = Math.min(width, height) * 0.22;

  return {
    x: width / 2 + x * scale * depth,
    y: height / 2 + y * scale * depth,
    z,
    depth,
  };
}

function drawBackgroundGlow() {
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.04,
    width / 2,
    height / 2,
    Math.min(width, height) * 0.5,
  );

  gradient.addColorStop(0, "rgba(114, 255, 244, 0.15)");
  gradient.addColorStop(0.35, "rgba(73, 173, 255, 0.08)");
  gradient.addColorStop(1, "rgba(3, 8, 16, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawCube() {
  const vertices = [
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],
  ];

  const projected = vertices.map(project);
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];

  ctx.strokeStyle = "rgba(176, 234, 255, 0.32)";
  ctx.lineWidth = 1.15;

  edges.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(projected[a].x, projected[a].y);
    ctx.lineTo(projected[b].x, projected[b].y);
    ctx.stroke();
  });
}

function drawLinks() {
  links.forEach((link) => {
    const from = project(link.from.position);
    const to = project(link.to.position);

    const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
    gradient.addColorStop(0, `${link.color}20`);
    gradient.addColorStop(0.5, `${link.color}88`);
    gradient.addColorStop(1, `${link.color}20`);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  });
}

function drawPoints(pointer) {
  const projectedPoints = points
    .map((point) => {
      const projection = project(point.position);
      return {
        ...point,
        ...projection,
        radius: 4 + projection.depth * 4.5,
      };
    })
    .sort((a, b) => a.z - b.z);

  hoveredPoint = null;

  projectedPoints.forEach((point) => {
    if (pointer) {
      const dx = pointer.x - point.x;
      const dy = pointer.y - point.y;
      if (Math.sqrt(dx * dx + dy * dy) < point.radius + 6) {
        hoveredPoint = point;
      }
    }

    ctx.beginPath();
    ctx.fillStyle = `${point.color}cc`;
    ctx.shadowBlur =
      hoveredPoint?.label === point.label || selectedPointLabel === point.label ? 28 : 16;
    ctx.shadowColor = point.color;
    ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.arc(point.x, point.y, Math.max(1.5, point.radius * 0.3), 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.shadowBlur = 0;
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  drawBackgroundGlow();
  drawCube();
  drawLinks();
  drawPoints(lastPointer);
  updateTooltip();
}

function updateTooltip() {
  const activePoint = hoveredPoint || points.find((point) => point.label === selectedPointLabel);

  if (!activePoint) {
    tooltip.classList.add("hidden");
    return;
  }

  const projectedActivePoint =
    hoveredPoint && hoveredPoint.label === activePoint.label
      ? hoveredPoint
      : { ...activePoint, ...project(activePoint.position) };

  tooltip.textContent =
    selectedPointLabel === activePoint.label ? createVector(activePoint.label) : activePoint.label;
  tooltip.style.left = `${projectedActivePoint.x}px`;
  tooltip.style.top = `${projectedActivePoint.y}px`;
  tooltip.classList.remove("hidden");
}

function animate() {
  if (!isDragging && !isPaused) {
    rotationX += autoSpinX;
    rotationY += autoSpinY;
  }

  draw();
  requestAnimationFrame(animate);
}

function getPointer(event) {
  const bounds = canvas.getBoundingClientRect();
  return {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  };
}

canvas.addEventListener("pointerdown", (event) => {
  isDragging = true;
  lastPointer = getPointer(event);
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
  const pointer = getPointer(event);

  if (isDragging && lastPointer) {
    const deltaX = pointer.x - lastPointer.x;
    const deltaY = pointer.y - lastPointer.y;
    rotationY += deltaX * 0.008;
    rotationX += deltaY * 0.008;
    lastPointer = pointer;
  } else {
    lastPointer = pointer;
  }
});

function releaseDrag() {
  isDragging = false;
}

canvas.addEventListener("click", (event) => {
  const pointer = getPointer(event);
  const clickedPoint = points
    .map((point) => {
      const projection = project(point.position);
      return {
        ...point,
        ...projection,
        radius: 4 + projection.depth * 4.5,
      };
    })
    .find((point) => {
      const dx = pointer.x - point.x;
      const dy = pointer.y - point.y;
      return Math.sqrt(dx * dx + dy * dy) < point.radius + 6;
    });

  if (!clickedPoint) {
    selectedPointLabel = null;
    return;
  }

  selectedPointLabel = selectedPointLabel === clickedPoint.label ? null : clickedPoint.label;
});

canvas.addEventListener("pointerup", releaseDrag);
canvas.addEventListener("pointerleave", () => {
  releaseDrag();
  lastPointer = null;
});
canvas.addEventListener("pointercancel", releaseDrag);

pauseButton.addEventListener("click", () => {
  isPaused = !isPaused;
  pauseButton.classList.toggle("is-paused", isPaused);
  pauseButton.textContent = isPaused ? "Resume motion" : "Pause motion";
  pauseButton.setAttribute("aria-pressed", String(isPaused));
});

window.addEventListener("resize", resize);

resize();
animate();
