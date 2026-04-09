const canvas = document.getElementById("vector-canvas");
const tooltip = document.getElementById("tooltip");
const pauseButton = document.getElementById("pause-button");
const returnButton = document.getElementById("return-button");
const retrievalStatus = document.getElementById("retrieval-status");
const resultModal = document.getElementById("result-modal");
const resultModalSubtitle = document.getElementById("result-modal-subtitle");
const resultModalList = document.getElementById("result-modal-list");
const resultModalClose = document.getElementById("result-modal-close");
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
const masterSentence = "Retrieve relevant chunks before composing a grounded answer.";
let retrievalState = {
  phase: "idle",
  phaseStartedAt: 0,
  startedAt: 0,
  anchor: [0, 0, 0],
  topChunks: [],
  topWords: [],
  persistUntil: 0,
  modalShown: false,
};
const MASTER_PREVIEW_MS = 2200;
const LOADING_MS = 1400;
const REVEAL_MS = 3400;

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

function normalizeToken(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/s$/, "");
}

function averagePosition(sourcePoints) {
  if (!sourcePoints.length) {
    return [0, 0, 0];
  }

  const totals = sourcePoints.reduce(
    (accumulator, point) => {
      accumulator[0] += point.position[0];
      accumulator[1] += point.position[1];
      accumulator[2] += point.position[2];
      return accumulator;
    },
    [0, 0, 0],
  );

  return totals.map((value) => value / sourcePoints.length);
}

function squaredDistance(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return dx * dx + dy * dy + dz * dz;
}

function resolveRetrieval(sentence) {
  const sentenceTokens = sentence
    .split(/\s+/)
    .map(normalizeToken)
    .filter(Boolean);
  const tokenSet = new Set(sentenceTokens);

  const matchedPoints = points.filter((point) => tokenSet.has(normalizeToken(point.label)));
  const anchor = averagePosition(matchedPoints);

  const rankedPoints = points
    .map((point) => ({
      ...point,
      score: squaredDistance(point.position, anchor),
    }))
    .sort((a, b) => a.score - b.score);

  return {
    anchor,
    topChunks: rankedPoints.slice(0, 3),
    topWords: rankedPoints.slice(0, 10),
  };
}

function closeTopWordsModal() {
  resultModal.classList.add("hidden");
}

function openTopWordsModal(topWords) {
  resultModalSubtitle.textContent = `Master sentence: "${masterSentence}"`;
  resultModalList.innerHTML = "";

  topWords.forEach((word) => {
    const item = document.createElement("li");
    const similarity = (1 / (1 + word.score)).toFixed(3);
    item.textContent = `${word.label}  [${word.cluster}]  sim:${similarity}`;
    resultModalList.appendChild(item);
  });

  resultModal.classList.remove("hidden");
}

function getChunkIntensity(label, now) {
  if (retrievalState.phase !== "revealing" && retrievalState.phase !== "done") {
    return 0;
  }

  const index = retrievalState.topChunks.findIndex((chunk) => chunk.label === label);
  if (index === -1) {
    return 0;
  }

  const elapsed = now - retrievalState.startedAt;
  const revealDelay = index * 220;
  const revealWindow = 900;
  const raw = Math.min(Math.max((elapsed - revealDelay) / revealWindow, 0), 1);
  const pulse = 0.55 + 0.45 * Math.sin((elapsed - revealDelay) * 0.02);

  return raw * pulse;
}

function getChunkRevealProgress(label, now) {
  if (retrievalState.phase !== "revealing" && retrievalState.phase !== "done") {
    return 0;
  }

  const index = retrievalState.topChunks.findIndex((chunk) => chunk.label === label);
  if (index === -1) {
    return 0;
  }

  const elapsed = now - retrievalState.startedAt;
  const revealDelay = index * 420;
  return Math.min(Math.max((elapsed - revealDelay) / 580, 0), 1);
}

function easeOutBack(value) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(value - 1, 3) + c1 * Math.pow(value - 1, 2);
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

function drawRetrievalOverlay(now) {
  if (
    !retrievalState.topChunks.length ||
    (retrievalState.phase !== "revealing" && retrievalState.phase !== "done")
  ) {
    return;
  }

  const elapsed = now - retrievalState.startedAt;
  const anchorProjection = project(retrievalState.anchor);
  const anchorAlpha = retrievalState.phase === "revealing" ? Math.min(0.95, elapsed / 450) : 0.75;

  retrievalState.topChunks.forEach((chunk, index) => {
    const chunkProjection = project(chunk.position);
    const reveal = retrievalState.phase === "revealing"
      ? Math.min(Math.max((elapsed - index * 240) / 700, 0), 1)
      : 1;

    if (reveal <= 0) {
      return;
    }

    ctx.strokeStyle = `rgba(255, 214, 102, ${0.18 + reveal * 0.45})`;
    ctx.lineWidth = 1.2 + reveal * 1.3;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(anchorProjection.x, anchorProjection.y);
    ctx.lineTo(chunkProjection.x, chunkProjection.y);
    ctx.stroke();
    ctx.setLineDash([]);
  });

  ctx.beginPath();
  ctx.fillStyle = `rgba(255, 214, 102, ${anchorAlpha})`;
  ctx.shadowColor = "rgba(255, 214, 102, 0.7)";
  ctx.shadowBlur = retrievalState.phase === "revealing" ? 28 : 18;
  ctx.arc(anchorProjection.x, anchorProjection.y, 6.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '500 11px "IBM Plex Mono", monospace';
  ctx.fillStyle = `rgba(255, 234, 185, ${anchorAlpha})`;
  ctx.fillText("MASTER", anchorProjection.x + 9, anchorProjection.y - 9);
  ctx.shadowBlur = 0;
}

function drawPoints(pointer, now) {
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
    const chunkBoost = getChunkIntensity(point.label, now);
    const revealProgress = getChunkRevealProgress(point.label, now);
    const poppedScale = revealProgress ? 1 + easeOutBack(revealProgress) * 0.5 : 1;
    const drawRadius = point.radius * poppedScale;
    ctx.shadowBlur =
      hoveredPoint?.label === point.label || selectedPointLabel === point.label
        ? 28
        : 16 + chunkBoost * 18;
    ctx.shadowColor = point.color;
    ctx.arc(point.x, point.y, drawRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.arc(point.x, point.y, Math.max(1.5, drawRadius * 0.3), 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.shadowBlur = 0;
}

function draw(now) {
  ctx.clearRect(0, 0, width, height);
  drawBackgroundGlow();
  drawCube();
  drawLinks();
  drawRetrievalOverlay(now);
  drawPoints(lastPointer, now);
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

function animate(now) {
  if (!isDragging && !isPaused) {
    rotationX += autoSpinX;
    rotationY += autoSpinY;
  }

  if (retrievalState.phase === "showing-master" && now - retrievalState.phaseStartedAt > MASTER_PREVIEW_MS) {
    retrievalState.phase = "loading";
    retrievalState.phaseStartedAt = now;
    retrievalStatus.classList.add("is-loading");
    retrievalStatus.textContent = "Searching vector space...";
  }

  if (retrievalState.phase === "loading" && now - retrievalState.phaseStartedAt > LOADING_MS) {
    retrievalState.phase = "revealing";
    retrievalState.phaseStartedAt = now;
    retrievalState.startedAt = now;
    retrievalStatus.classList.remove("is-loading");
    retrievalStatus.textContent = "Returning chunks...";
  }

  if (retrievalState.phase === "revealing" && now - retrievalState.startedAt > REVEAL_MS) {
    retrievalState.phase = "done";
    retrievalState.persistUntil = now + 3600;
    retrievalStatus.textContent = `Top chunks: ${retrievalState.topChunks
      .map((chunk) => chunk.label)
      .join(" -> ")}`;
    returnButton.classList.remove("is-running");
    returnButton.textContent = "Return chunks";
    returnButton.setAttribute("aria-pressed", "false");
    returnButton.disabled = false;
    if (!retrievalState.modalShown && retrievalState.topWords.length) {
      openTopWordsModal(retrievalState.topWords);
      retrievalState.modalShown = true;
    }
  }

  if (retrievalState.phase === "done" && retrievalState.persistUntil && now > retrievalState.persistUntil) {
    retrievalState.phase = "idle";
    retrievalState.topChunks = [];
    retrievalState.topWords = [];
    retrievalState.persistUntil = 0;
    retrievalStatus.textContent = "Click Return chunks to fetch related chunks.";
  }

  draw(now);
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

returnButton.addEventListener("click", () => {
  const { anchor, topChunks, topWords } = resolveRetrieval(masterSentence);

  retrievalState = {
    phase: "showing-master",
    phaseStartedAt: performance.now(),
    startedAt: 0,
    anchor,
    topChunks,
    topWords,
    persistUntil: 0,
    modalShown: false,
  };

  closeTopWordsModal();
  selectedPointLabel = topChunks[0]?.label ?? null;
  returnButton.classList.add("is-running");
  returnButton.textContent = "Running...";
  returnButton.setAttribute("aria-pressed", "true");
  returnButton.disabled = true;
  retrievalStatus.classList.remove("is-loading");
  retrievalStatus.textContent = `Master sentence: "${masterSentence}"`;
});

resultModalClose.addEventListener("click", closeTopWordsModal);

resultModal.addEventListener("click", (event) => {
  if (event.target === resultModal) {
    closeTopWordsModal();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !resultModal.classList.contains("hidden")) {
    closeTopWordsModal();
  }
});

window.addEventListener("resize", resize);

resize();
animate();
