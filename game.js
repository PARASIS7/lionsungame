const FPS_STEP_LIMIT = 0.05;
const UP = Object.freeze({ x: 0, y: -1 });
const DOWN = Object.freeze({ x: 0, y: 1 });
const LEFT = Object.freeze({ x: -1, y: 0 });
const RIGHT = Object.freeze({ x: 1, y: 0 });
const STOP = Object.freeze({ x: 0, y: 0 });
const DIRECTIONS = [UP, LEFT, DOWN, RIGHT];

const COLORS = {
  ink: "#efe2c2", gold: "#c88b35", goldLight: "#f2c36b",
  bg: "#090c0f", panel: "#17191a", board: "#101416",
  basalt: "#222629", sandstone: "#9c7042", bronze: "#78502d", turquoise: "#188f91"
};

const LEVELS = [
  {
    name: "Kashi Palace", tileBlue: "#135ca0", tileAccent: "#22c6c3", sandstone: "#b46f30",
    rows: [
      "###################", "#o.......#.......o#", "#.##.###.#.###.##.#", "#.................#",
      "#.##.#.#####.#.##.#", "#....#...#...#....#", "####.### # ###.####", "   #.#       #.#   ",
      "####.# ##=## #.####", "    ..#1234#...    ", "####.# ##### #.####", "   #.#       #.#   ",
      "####.# ##### #.####", "#........#........#", "#.##.###.#.###.##.#", "#o.#.....P.....#.o#",
      "##.#.#.#####.#.#.##", "#....#...#...#....#", "#.######.#.######.#", "#.................#",
      "###################"
    ]
  },
  {
    name: "Copper Labyrinth", tileBlue: "#13747a", tileAccent: "#45d6af", sandstone: "#a15b2f",
    rows: [
      "#########################", "#o#.#.....#.....#.....#o#", "#.#.#.###.#.###.#.#...#.#", "#...........#.#.....#...#",
      "#.###.#.###.#.#####.###.#", "#...#.....#.#...#.#...#.#", "###.#.###.#.#.#.#.###.###", "#.#...#.#.#.2.#.....#...#",
      "#.#.#.#.#1#.###3##.####.#", "#.#.....#...#...#.....#.#", "#...#.#####4###.#.###.#.#", "#...#.....#.#.....#.#...#",
      "#.#######.#.#.#.###.###.#", "#.#.....#.....#...#.....#", "#.###.#.###.#.#.#.#.##.##", "#o..........P...#......o#",
      "#########################"
    ]
  },
  {
    name: "Crimson Citadel", tileBlue: "#742045", tileAccent: "#e75b7e", sandstone: "#bf7e3a",
    rows: [
      "#########################", "#o..............#......o#", "###.#...#.#####.###.###.#", "#.#...#...#.......#...#.#",
      "#.#.#####.#..####.#####.#", "#...#...#.#.....#.#.....#", "#.###.#.#.#.###.#.#.#.###", "#.....#.#.#.2.3.#.#.....#",
      "#.#.###.#1###.#...###.#.#", "#.#.#.#.#...#.#.#...#.#.#", "#.#.#.#.###4#.#####.###.#", "#...#.......#.#...#.....#",
      "#####.#######.#.#.#...#.#", "#.......#...#.........#.#", "#.###...#...#.####.##.#.#", "#o..#.....#.P.........#o#",
      "#########################"
    ]
  },
  {
    name: "Sapphire Oasis", tileBlue: "#0f4e78", tileAccent: "#20ccd7", sandstone: "#8c5f2d",
    rows: [
      "#########################", "#o..#.........#.......#o#", "###.#...#.###.#...###.#.#", "#.#.#.#.....#...#.#...#.#",
      "#.#.#.#####.#####.###.#.#", "#.#.#...........#...#...#", "#.#.#####.##.##.###.###.#", "#.#.#...#.1.2.#.#.......#",
      "#.#.#.#.#####3#.#.###.#.#", "#...#.#.....4.....#...#.#", "#.#.#.#####.#.#.###.###.#", "#...#.#...#.....#...#...#",
      "#.#.#...#...#####.###.#.#", "#...#.....#.....#.#.....#", "#.#######.#####...#.###.#", "#o........#.P.....#....o#",
      "#########################"
    ]
  },
  {
    name: "Golden Empire", tileBlue: "#784b14", tileAccent: "#ffcd32", sandstone: "#be6e1e",
    rows: [
      "#########################", "#o..........#.....#....o#", "####.######.#.#####.#.#.#", "#.....#...#.#.....#.#...#",
      "#..##.#.#.#.#.###.#.#.#.#", "#...#.#.#.#...#.#...#.#.#", "###.#.#.###.#...#####.###", "#...#...#.1.#.3...#.#...#",
      "#.#.#####.###2#...#.###.#", "#.#.#.....#.4...#.....#.#", "#.###.##..#.#.#.#.#####.#", "#...#.#.........#.#.....#",
      "###.#.#####.#.#.###.###.#", "#...#...#.......#...#...#", "#.#####.#.##..#...###.#.#", "#o..........P.....#....o#",
      "#########################"
    ]
  }
];

const State = Object.freeze({ START: "start", PLAYING: "playing", DYING: "dying", WON: "won", PAUSED: "paused", LEVEL_CLEAR: "level-clear" });
const GhostMode = Object.freeze({ CHASE: "chase", FRIGHTENED: "frightened", RESPAWNING: "respawning" });
const DIFFICULTIES = Object.freeze({
  easy: Object.freeze({ label: "آسان", lives: 5, playerSpeed: 5.7, ghostSpeed: 3.9, frightenedSpeed: 2.8, powerDuration: 11 }),
  normal: Object.freeze({ label: "معمولی", lives: 3, playerSpeed: 5.35, ghostSpeed: 4.65, frightenedSpeed: 3.35, powerDuration: 8 }),
  hard: Object.freeze({ label: "سخت", lives: 2, playerSpeed: 5.1, ghostSpeed: 5.25, frightenedSpeed: 4, powerDuration: 6 })
});

const canvas = document.querySelector("#game");
// Telegram Android WebView can preserve the previous compositor buffer when
// desynchronized rendering is enabled. A synchronized opaque context makes
// every rendered frame replace the previous one reliably.
const ctx = canvas.getContext("2d", { alpha: false });
const loading = document.querySelector("#loading");
const loadingStatus = document.querySelector("#loading-status");
const loadingProgress = document.querySelector("#loading-progress");
const loadingPercent = document.querySelector("#loading-percent");
const loadingRetry = document.querySelector("#loading-retry");
const memorialIntro = document.querySelector("#memorial-intro");
const memorialContinue = document.querySelector("#memorial-continue");
const memorialHint = document.querySelector("#memorial-hint");
const memorialPosterImage = document.querySelector("#memorial-poster-image");
const startScreen = document.querySelector("#start-screen");
const startGameButton = document.querySelector("#start-game");
const difficultyButtons = [...document.querySelectorAll("[data-difficulty]")];
let viewW = 720, viewH = 1280, dpr = 1;

function detectMobileDevice() {
  const launchParams = new URLSearchParams(location.hash.replace(/^#/, ""));
  const telegramPlatform = launchParams.get("tgWebAppPlatform") || window.Telegram?.WebApp?.platform || "";
  if (["android", "android_x", "ios"].includes(telegramPlatform)) return true;
  if (["tdesktop", "macos", "web", "weba", "webk"].includes(telegramPlatform)) return false;
  const ua = navigator.userAgent || "";
  return navigator.userAgentData?.mobile === true ||
    /Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile/i.test(ua) ||
    (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
}

const MOBILE_LAYOUT = detectMobileDevice();
const TARGET_FPS = MOBILE_LAYOUT ? 30 : 60;
const TARGET_FRAME_MS = 1000 / TARGET_FPS;
document.documentElement.classList.toggle("mobile-device", MOBILE_LAYOUT);
document.documentElement.classList.toggle("desktop-device", !MOBILE_LAYOUT);
memorialPosterImage.src = MOBILE_LAYOUT
  ? "assets/memorial-intro-mobile-v12.webp"
  : "assets/memorial-intro-desktop-v12.webp";

function keyOf(x, y) { return `${x},${y}`; }
function sameDir(a, b) { return a.x === b.x && a.y === b.y; }
function reverseOf(a) { return { x: -a.x, y: -a.y }; }
function isReverse(a, b) { return a.x === -b.x && a.y === -b.y; }
function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
function padScore(n) { return String(n).padStart(5, "0"); }

function roundedRect(context, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + w, y, x + w, y + h, r);
  context.arcTo(x + w, y + h, x, y + h, r);
  context.arcTo(x, y + h, x, y, r);
  context.arcTo(x, y, x + w, y, r);
  context.closePath();
}

function fillRound(x, y, w, h, r, fill, stroke = null, lineWidth = 1) {
  roundedRect(ctx, x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.lineWidth = lineWidth; ctx.strokeStyle = stroke; ctx.stroke(); }
}

function loadImage(src, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const timer = setTimeout(() => reject(new Error(`مهلت بارگذاری ${src} تمام شد`)), timeoutMs);
    image.decoding = "async";
    image.onload = () => { clearTimeout(timer); resolve(image); };
    image.onerror = () => { clearTimeout(timer); reject(new Error(`تصویر ${src} بارگذاری نشد`)); };
    image.src = src;
  });
}

function setLoadingProgress(value, status) {
  const progress = clamp(Math.round(value), 0, 100);
  loadingProgress.style.width = `${progress}%`;
  loadingPercent.textContent = `${String(progress).replace(/\d/g, digit => "۰۱۲۳۴۵۶۷۸۹"[digit])}٪`;
  if (status) loadingStatus.textContent = status;
}

const ASSET_RECTS = {
  lions: [{ x: 0, y: 65, w: 420, h: 290 }, { x: 420, y: 64, w: 420, h: 291 }],
  lionWalk: [0, 1, 2, 3].map(index => ({ x: index * 420, y: 0, w: 420, h: 320 })),
  clerics: [
    { x: 0, y: 3, w: 280, h: 273 }, { x: 285, y: 0, w: 270, h: 280 },
    { x: 10, y: 280, w: 260, h: 280 }, { x: 280, y: 280, w: 280, h: 280 }
  ],
  clericsFrightened: [
    { x: 0, y: 0, w: 280, h: 280 }, { x: 280, y: 0, w: 280, h: 280 },
    { x: 0, y: 280, w: 280, h: 280 }, { x: 280, y: 280, w: 280, h: 280 }
  ],
  iran: { x: 0, y: 0, w: 520, h: 479 }
};

const assets = {};
let memorials = [];

const faDigits = "۰۱۲۳۴۵۶۷۸۹";
function normalizeMemorial(item) {
  if (item && typeof item === "object") {
    return {
      name: item.name || "نام نامشخص",
      age: item.age ?? null,
      deathDay: item.deathDay || item.death_date || null,
      city: item.city || "شهر نامشخص"
    };
  }
  const text = String(item || "").trim();
  const match = text.match(/^جاوید\s*نام\s+(.+?)\s+(?:(\d+|[۰-۹]+)\s+ساله|سن\s+نامشخص)\s+کشته\s+شده\s+در\s+شهر\s+(.+?)\s+عزیز!$/u);
  if (!match) return { name: text || "نام نامشخص", age: null, deathDay: null, city: "شهر نامشخص" };
  return { name: match[1], age: match[2] || null, deathDay: null, city: match[3] };
}

function formatMemorial(item) {
  const record = normalizeMemorial(item);
  const age = record.age ? `${record.age} ساله` : "سن نامشخص";
  const day = record.deathDay || "تاریخ نامشخص";
  return `فرزند ایران و جان فدای میهن، جاوید نام ${record.name} - ${age} - ${day} - ${record.city} عزیز!`;
}

class AudioEngine {
  constructor() {
    this.enabled = localStorage.getItem("lionSunSound") !== "off";
    this.context = null;
    this.master = null;
    this.musicTimer = null;
    this.musicStep = 0;
    this.lastPellet = 0;
    this.noiseBuffer = null;
    this.noiseSampleRate = 0;
  }

  async ensure() {
    if (!this.enabled) return;
    if (!this.context) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      this.context = new AudioContextClass();
      this.master = this.context.createGain();
      this.master.gain.value = .72;
      this.master.connect(this.context.destination);
    }
    if (this.context.state === "suspended") await this.context.resume();
    this.startMusic();
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    localStorage.setItem("lionSunSound", enabled ? "on" : "off");
    if (enabled) this.ensure(); else this.stopMusic();
  }

  toggle() { this.setEnabled(!this.enabled); return this.enabled; }

  tone(frequency, duration = .1, options = {}) {
    if (!this.enabled || !this.context || !this.master) return;
    const now = this.context.currentTime + (options.delay || 0);
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = options.type || "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    if (options.to) oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, options.to), now + duration);
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(options.volume || .09, now + Math.min(.018, duration / 3));
    gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
    oscillator.connect(gain); gain.connect(this.master);
    oscillator.start(now); oscillator.stop(now + duration + .03);
  }

  noise(duration = .15, volume = .08, options = {}) {
    if (!this.enabled || !this.context || !this.master) return;
    const now = this.context.currentTime + (options.delay || 0);
    if (!this.noiseBuffer || this.noiseSampleRate !== this.context.sampleRate) {
      const frames = Math.max(1, Math.floor(this.context.sampleRate));
      this.noiseBuffer = this.context.createBuffer(1, frames, this.context.sampleRate);
      this.noiseSampleRate = this.context.sampleRate;
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
    }
    const buffer = this.noiseBuffer;
    const offset = Math.random() * Math.max(0, buffer.duration - duration);
    const source = this.context.createBufferSource(), filter = this.context.createBiquadFilter(), gain = this.context.createGain();
    filter.type = options.filter || "lowpass"; filter.frequency.value = options.frequency || 720;
    gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(volume, now + .008); gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
    source.buffer = buffer; source.connect(filter); filter.connect(gain); gain.connect(this.master); source.start(now, offset, duration); source.stop(now + duration + .02);
  }

  heroicChord(root, duration = .28, options = {}) {
    [1, 1.5, 2].forEach((ratio, index) => this.tone(root * ratio, duration, {
      delay: (options.delay || 0) + index * .018,
      type: index === 0 ? "square" : "triangle",
      volume: (options.volume || .04) * (index === 0 ? .8 : .55),
      to: root * ratio * (options.rise || 1.01)
    }));
  }

  marchHit(delay = 0, strength = 1) {
    this.tone(92, .11, { delay, to: 48, type: "square", volume: .052 * strength });
    this.noise(.055, .035 * strength, { delay: delay + .012, filter: "bandpass", frequency: 980 });
  }

  play(name) {
    if (!this.enabled || !this.context) return;
    if (name === "pellet") {
      const now = performance.now(); if (now - this.lastPellet < 45) return; this.lastPellet = now;
      this.tone(720, .055, { to: 930, type: "square", volume: .026 });
      this.tone(1080, .04, { delay: .018, to: 1220, type: "triangle", volume: .014 });
    } else if (name === "power") {
      [146.83, 196, 246.94, 293.66].forEach((note, i) => this.heroicChord(note, .24, { delay: i * .065, volume: .042, rise: 1.08 }));
      this.marchHit(0, 1.15); this.marchHit(.19, .9);
    } else if (name === "enemy") {
      this.tone(185, .2, { to: 740, type: "square", volume: .06 }); this.heroicChord(293.66, .22, { delay: .07, volume: .04, rise: 1.18 });
      this.noise(.09, .045, { delay: .035, filter: "highpass", frequency: 1500 });
    } else if (name === "hurt") {
      this.noise(.22, .095, { filter: "lowpass", frequency: 520 }); this.tone(150, .34, { to: 55, type: "sawtooth", volume: .085 });
      this.marchHit(.03, .85);
    } else if (name === "start") {
      [146.83, 196, 220, 293.66].forEach((note, i) => this.heroicChord(note, .2, { delay: i * .095, volume: .038, rise: 1.025 }));
      this.marchHit(0, .8); this.marchHit(.19, .68); this.marchHit(.38, 1.05);
    } else if (name === "level") {
      [220, 293.66, 369.99, 440].forEach((note, i) => this.heroicChord(note, .32, { delay: i * .105, volume: .043, rise: 1.02 }));
      [0, .21, .42].forEach((delay, i) => this.marchHit(delay, i === 2 ? 1.15 : .75));
    } else if (name === "victory") {
      [146.83, 196, 246.94, 293.66, 392, 440].forEach((note, i) => this.heroicChord(note, .4, { delay: i * .115, volume: .047, rise: 1.015 }));
      [0, .23, .46, .69].forEach((delay, i) => this.marchHit(delay, i === 3 ? 1.2 : .8));
    } else if (name === "button") {
      this.tone(330, .07, { to: 440, type: "square", volume: .03 }); this.tone(660, .055, { delay: .018, to: 720, type: "triangle", volume: .018 });
    }
  }

  startMusic() {
    if (!this.enabled || !this.context || this.musicTimer) return;
    const scale = [146.83, 164.81, 196, 220, 246.94, 293.66, 329.63, 392];
    const melody = [0, 2, 3, 5, 4, 3, 2, 0, 0, 3, 5, 7, 6, 5, 3, 2];
    const tick = () => {
      if (!this.enabled || !this.context) return;
      const step = this.musicStep++ % melody.length;
      const lead = scale[melody[step]];
      this.tone(lead, .29, { type: step % 2 ? "triangle" : "square", volume: step % 4 === 0 ? .023 : .014 });
      this.tone(lead * 1.5, .22, { delay: .018, type: "triangle", volume: .008 });
      if (step % 4 === 0) {
        this.tone(scale[0] / 2, .48, { type: "square", volume: .019 });
        this.marchHit(0, step % 8 === 0 ? .72 : .5);
      } else if (step % 4 === 2) {
        this.noise(.045, .012, { filter: "highpass", frequency: 2100 });
      }
    };
    tick(); this.musicTimer = setInterval(tick, 380);
  }

  stopMusic() { if (this.musicTimer) clearInterval(this.musicTimer); this.musicTimer = null; }
}

const audio = new AudioEngine();

async function loadAssets() {
  memorials = (window.__LION_SUN_MEMORIALS || []).map(normalizeMemorial);
  const portrait = MOBILE_LAYOUT;
  const primarySkinKey = portrait ? "skinPortrait" : "skinDesktop";
  const secondarySkinKey = portrait ? "skinDesktop" : "skinPortrait";
  const primarySkinUrl = portrait ? "assets/persepolis-ui-skin-v2.webp?v=4" : "assets/persepolis-ui-skin-desktop-v2.webp?v=4";
  const secondarySkinUrl = portrait ? "assets/persepolis-ui-skin-desktop-v2.webp?v=4" : "assets/persepolis-ui-skin-v2.webp?v=4";
  const required = [
    ["lion", "assets/lion-sprites.webp"],
    ["lionWalk", "assets/lion-walk-v2.webp"],
    ["clerics", "assets/clerics-sheet.webp"],
    ["clericsFrightened", "assets/clerics-frightened-v2.webp"],
    ["iran", "assets/iran-power.webp"],
    ["flag", "assets/lion-sun-flag.webp"],
    [primarySkinKey, primarySkinUrl]
  ];
  let finished = 0;
  await Promise.all(required.map(async ([key, url]) => {
    assets[key] = await loadImage(url);
    finished += 1;
    setLoadingProgress(12 + finished / required.length * 78, finished < required.length ? "چیدن سنگ‌های هزارتو…" : "آماده‌سازی نگهبانان…");
  }));

  // The inactive orientation is never allowed to hold up the first playable frame.
  assets[secondarySkinKey] = assets[primarySkinKey];
  loadImage(secondarySkinUrl).then(image => {
    assets[secondarySkinKey] = image;
    if (game) game.invalidateStaticLayer();
  }).catch(() => {});

  // Browsers block fetch() for local file:// pages. Memorials are optional at boot,
  // so local preview and the Telegram game both start even if this request fails.
  if (location.protocol !== "file:") {
    fetch("assets/memorials.json", { cache: "no-cache" })
      .then(response => response.ok ? response.json() : Promise.reject(new Error("memorials")))
      .then(names => { if (Array.isArray(names)) memorials = names.map(normalizeMemorial); })
      .catch(() => {});
  }
}

function requestTelegramFullscreen() {
  const webApp = window.Telegram?.WebApp;
  if (!webApp) return;
  webApp.expand?.();
  try {
    if (webApp.isVersionAtLeast?.("8.0") && !webApp.isFullscreen) {
      webApp.requestFullscreen?.();
      document.documentElement.dataset.telegramFullscreenRequested = "true";
    }
  } catch (_) {
    // Older Telegram clients may reject fullscreen; expanded mode remains usable.
  }
}

function connectTelegram() {
  const initialize = () => {
    const webApp = window.Telegram?.WebApp;
    webApp?.ready(); webApp?.expand();
    requestTelegramFullscreen();
    webApp?.disableVerticalSwipes?.();
    document.documentElement.dataset.telegramVerticalSwipes = "disabled";
    webApp?.setHeaderColor?.("#060c1b");
    webApp?.setBackgroundColor?.("#060c1b");
  };
  if (window.Telegram?.WebApp) { initialize(); return; }
  const script = document.createElement("script");
  script.src = "telegram-web-app.js"; script.async = true; script.onload = initialize;
  document.head.appendChild(script);
}

function removeReachableDeadEnds(rows) {
  const width = Math.max(...rows.map(row => [...row].length));
  const grid = rows.map(row => [...row.padEnd(width, "#")]);
  const height = grid.length;
  const inside = (x, y) => x >= 0 && x < width && y >= 0 && y < height;
  const playerPassable = (x, y) => inside(x, y) && grid[y][x] !== "#" && grid[y][x] !== "=";
  const spawn = { x: 1, y: 1 };
  grid.forEach((row, y) => row.forEach((tile, x) => { if (tile === "P") { spawn.x = x; spawn.y = y; } }));

  const reachable = () => {
    const seen = new Set([keyOf(spawn.x, spawn.y)]), queue = [{ ...spawn }];
    for (let head = 0; head < queue.length; head++) {
      const cell = queue[head];
      for (const direction of DIRECTIONS) {
        const x = cell.x + direction.x, y = cell.y + direction.y, key = keyOf(x, y);
        if (playerPassable(x, y) && !seen.has(key)) { seen.add(key); queue.push({ x, y }); }
      }
    }
    return seen;
  };

  for (let pass = 0; pass < width * height; pass++) {
    const seen = reachable();
    const deadEnds = [...seen].map(key => key.split(",").map(Number)).filter(([x, y]) =>
      DIRECTIONS.filter(direction => playerPassable(x + direction.x, y + direction.y)).length <= 1
    );
    if (!deadEnds.length) break;
    let opened = false;
    for (const [x, y] of deadEnds) {
      const candidates = DIRECTIONS.map(direction => ({ x: x + direction.x, y: y + direction.y }))
        .filter(cell => cell.x > 0 && cell.x < width - 1 && cell.y > 0 && cell.y < height - 1 && grid[cell.y][cell.x] === "#")
        .map(cell => ({ ...cell, links: DIRECTIONS.filter(direction => {
          const nx = cell.x + direction.x, ny = cell.y + direction.y;
          return (nx !== x || ny !== y) && seen.has(keyOf(nx, ny));
        }).length }))
        .filter(cell => cell.links > 0)
        .sort((a, b) => b.links - a.links);
      if (candidates[0]) { grid[candidates[0].y][candidates[0].x] = "."; opened = true; }
    }
    if (!opened) break;
  }
  return grid.map(row => row.join(""));
}

class Maze {
  constructor(rows) {
    this.rows = removeReachableDeadEnds(rows);
    this.width = this.rows[0].length;
    this.height = this.rows.length;
    this.playerSpawn = { x: 1, y: 1 };
    this.ghostSpawns = {};
    this.initialPellets = new Set();
    this.initialPower = new Set();
    this.rows.forEach((row, y) => [...row].forEach((tile, x) => {
      if (tile === "P") this.playerSpawn = { x, y };
      else if (/^[1-4]$/.test(tile)) this.ghostSpawns[Number(tile)] = { x, y };
      else if (tile === ".") this.initialPellets.add(keyOf(x, y));
      else if (tile === "o") this.initialPower.add(keyOf(x, y));
    }));
    this.resetCollectibles();
  }

  resetCollectibles() {
    this.pellets = new Set(this.initialPellets);
    this.powerPellets = new Set(this.initialPower);
  }

  tileAt(x, y) {
    if (y < 0 || y >= this.height) return "#";
    return this.rows[y][((x % this.width) + this.width) % this.width];
  }

  passable(x, y, forGhost = false) {
    const tile = this.tileAt(x, y);
    return tile !== "#" && (tile !== "=" || forGhost);
  }

  neighbor(tile, direction) {
    return { x: ((tile.x + direction.x) % this.width + this.width) % this.width, y: tile.y + direction.y };
  }

  legalDirections(tile, forGhost = false) {
    return DIRECTIONS.filter(direction => {
      const n = this.neighbor(tile, direction);
      return this.passable(n.x, n.y, forGhost);
    });
  }

  distance(start, goal) {
    goal = { x: ((goal.x % this.width) + this.width) % this.width, y: clamp(goal.y, 0, this.height - 1) };
    const queue = [[start, 0]];
    const visited = new Set([keyOf(start.x, start.y)]);
    for (let head = 0; head < queue.length; head++) {
      const [tile, distance] = queue[head];
      if (tile.x === goal.x && tile.y === goal.y) return distance;
      for (const direction of DIRECTIONS) {
        const next = this.neighbor(tile, direction);
        const key = keyOf(next.x, next.y);
        if (!visited.has(key) && this.passable(next.x, next.y, true)) {
          visited.add(key); queue.push([next, distance + 1]);
        }
      }
    }
    return Math.abs(start.x - goal.x) + Math.abs(start.y - goal.y) + 100;
  }
}

class Game {
  constructor() {
    this.difficulty = "normal";
    this.difficultySpec = DIFFICULTIES.normal;
    this.currentLevel = 0;
    this.maze = new Maze(LEVELS[0].rows);
    this.state = State.START;
    this.score = 0;
    this.highScore = Number(localStorage.getItem("lionSunHighScore") || 0);
    this.lives = this.difficultySpec.lives;
    this.desiredDirection = LEFT;
    this.playerFacing = LEFT;
    this.frightenedTimer = 0;
    this.frightenedChain = 0;
    this.superMode = false;
    this.superBannerTimer = 0;
    this.stateTimer = 0;
    this.animationTime = 0;
    this.floatingTexts = [];
    this.javidPopupTimer = 0;
    this.activeJavidText = "";
    this.javidPool = [];
    this.touchStart = null;
    this.boardOrigin = { x: 0, y: 0 };
    this.panel = { x: 0, y: 0, w: 0, h: 0 };
    this.header = { x: 0, y: 0, w: 0, h: 0 };
    this.soundButton = null;
    this.pauseButton = null;
    this.staticLayer = document.createElement("canvas");
    this.staticLayerDirty = true;
    this.collectibleLayer = document.createElement("canvas");
    this.collectibleLayerDirty = true;
    this.sunSprite = null;
    this.resetActors();
    this.updateLayout();
  }

  isPowerActive() { return this.frightenedTimer > 0; }

  setDifficulty(key) {
    this.difficulty = DIFFICULTIES[key] ? key : "normal";
    this.difficultySpec = DIFFICULTIES[this.difficulty];
  }

  newGame() {
    this.score = 0; this.lives = this.difficultySpec.lives; this.frightenedTimer = 0; this.frightenedChain = 0;
    this.superMode = false; this.superBannerTimer = 0; this.currentLevel = 0;
    this.loadLevel(0); this.state = State.PLAYING; audio.play("start");
  }

  loadLevel(index) {
    this.currentLevel = index;
    this.maze = new Maze(LEVELS[index].rows);
    this.collectibleLayerDirty = true;
    this.updateLayout(); this.resetActors();
  }

  nextLevel() {
    if (this.currentLevel + 1 >= LEVELS.length) { this.state = State.WON; audio.play("victory"); return; }
    this.loadLevel(this.currentLevel + 1);
    this.frightenedTimer = 0; this.frightenedChain = 0; this.state = State.PLAYING; audio.play("start");
  }

  resetActors() {
    const p = this.maze.playerSpawn;
    this.player = { x: p.x, y: p.y, direction: LEFT, speed: this.difficultySpec.playerSpeed };
    this.desiredDirection = LEFT; this.playerFacing = LEFT;
    const defs = [
      [1, "Chaser", "chaser", "#e03f4d", { x: this.maze.width - 2, y: 1 }],
      [2, "Ambusher", "ambusher", "#ec57a8", { x: 1, y: 1 }],
      [3, "Wanderer", "random", "#33c1d4", { x: this.maze.width - 2, y: this.maze.height - 2 }],
      [4, "Shy", "shy", "#f68e34", { x: 1, y: this.maze.height - 2 }]
    ];
    this.ghosts = defs.map(([number, name, personality, color, scatterTarget]) => {
      const spawn = this.maze.ghostSpawns[number];
      return { x: spawn.x, y: spawn.y, direction: number === 4 ? UP : LEFT, speed: this.difficultySpec.ghostSpeed,
        name, personality, color, spawn: { ...spawn }, scatterTarget, mode: GhostMode.CHASE, respawnTimer: 0 };
    });
  }

  updateLayout() {
    const width = viewW, height = viewH;
    if (MOBILE_LAYOUT) {
      const sx = width / 942, sy = height / 1668;
      const region = { x: 34 * sx, y: 320 * sy, w: 874 * sx, h: 884 * sy };
      this.tileSize = Math.max(14, Math.floor(Math.min(region.w / this.maze.width, region.h / this.maze.height)));
      const boardWidth = this.maze.width * this.tileSize;
      const boardHeight = this.maze.height * this.tileSize;
      this.boardOrigin = { x: region.x + (region.w - boardWidth) / 2, y: region.y + (region.h - boardHeight) / 2 };
      this.header = { x: 145 * sx, y: 145 * sy, w: 652 * sx, h: 118 * sy };
      this.panel = { x: 180 * sx, y: 1300 * sy, w: 580 * sx, h: 150 * sy };
      this.pauseButton = { x: 96 * sx, y: 1583 * sy, r: 47 * sx };
      this.soundButton = { x: 842 * sx, y: 1583 * sy, r: 47 * sx };
    } else {
      const sx = width / 1668, sy = height / 942;
      const region = { x: 30 * sx, y: 310 * sy, w: 1080 * sx, h: 540 * sy };
      this.tileSize = Math.max(16, Math.floor(Math.min(region.w / this.maze.width, region.h / this.maze.height)));
      const boardWidth = this.maze.width * this.tileSize;
      const boardHeight = this.maze.height * this.tileSize;
      this.boardOrigin = { x: region.x + (region.w - boardWidth) / 2, y: region.y + (region.h - boardHeight) / 2 };
      this.header = { x: 180 * sx, y: 145 * sy, w: 1275 * sx, h: 122 * sy };
      this.panel = { x: 1220 * sx, y: 315 * sy, w: 315 * sx, h: 315 * sy };
      this.pauseButton = { x: 1208 * sx, y: 797 * sy, r: 43 * sy };
      this.soundButton = { x: 1568 * sx, y: 797 * sy, r: 43 * sy };
    }
    this.invalidateStaticLayer();
  }

  invalidateStaticLayer() {
    this.staticLayerDirty = true;
    this.collectibleLayerDirty = true;
    this.sunSprite = null;
  }

  loseLife() {
    if (this.state !== State.PLAYING || this.superMode) return;
    this.lives--; this.frightenedTimer = 0; this.state = State.DYING; this.stateTimer = 1.35; audio.play("hurt");
  }

  activateSuperMode() {
    this.superMode = true; this.superBannerTimer = 3.25; this.score += 1000;
    this.resetActors(); this.frightenedTimer = this.difficultySpec.powerDuration; this.frightenedChain = 0;
    this.ghosts.forEach(g => g.mode = GhostMode.FRIGHTENED);
    this.state = State.PLAYING;
  }

  setDirection(direction) { this.desiredDirection = direction; }

  update(dt) {
    this.animationTime += dt;
    this.superBannerTimer = Math.max(0, this.superBannerTimer - dt);
    this.javidPopupTimer = Math.max(0, this.javidPopupTimer - dt);
    this.floatingTexts.forEach(ft => ft.timer -= dt);
    this.floatingTexts = this.floatingTexts.filter(ft => ft.timer > 0);

    if (this.state === State.DYING) {
      this.stateTimer -= dt;
      if (this.stateTimer <= 0) {
        if (this.lives <= 0) this.activateSuperMode();
        else { this.resetActors(); this.state = State.PLAYING; }
      }
      return;
    }
    if (this.state !== State.PLAYING) return;

    this.frightenedTimer = Math.max(0, this.frightenedTimer - dt);
    if (!this.isPowerActive()) {
      this.ghosts.forEach(g => { if (g.mode === GhostMode.FRIGHTENED) g.mode = GhostMode.CHASE; });
    }
    this.updatePlayer(dt); this.collectAtPlayer(); this.updateGhosts(dt); this.resolveCollisions();
    if (this.score > this.highScore) {
      this.highScore = this.score;
      try { localStorage.setItem("lionSunHighScore", String(this.highScore)); } catch (_) {}
    }
    if (!this.maze.pellets.size && !this.maze.powerPellets.size) {
      this.state = this.currentLevel + 1 < LEVELS.length ? State.LEVEL_CLEAR : State.WON;
      audio.play(this.state === State.WON ? "victory" : "level");
    }
  }

  actorTile(actor) { return { x: Math.round(actor.x), y: Math.round(actor.y) }; }
  atTileCenter(actor) { return Math.abs(actor.x - Math.round(actor.x)) < .0001 && Math.abs(actor.y - Math.round(actor.y)) < .0001; }

  updatePlayer(dt) {
    const p = this.player;
    if (isReverse(this.desiredDirection, p.direction)) p.direction = this.desiredDirection;
    if (this.atTileCenter(p)) {
      p.x = Math.round(p.x); p.y = Math.round(p.y);
      const tile = this.actorTile(p);
      const desired = this.maze.neighbor(tile, this.desiredDirection);
      if (this.maze.passable(desired.x, desired.y)) p.direction = this.desiredDirection;
      const forward = this.maze.neighbor(tile, p.direction);
      if (!this.maze.passable(forward.x, forward.y)) p.direction = STOP;
    }
    if (!sameDir(p.direction, STOP)) this.playerFacing = p.direction;
    this.advanceActor(p, p.speed * dt); this.wrapActor(p);
  }

  collectAtPlayer() {
    const tile = this.actorTile(this.player), key = keyOf(tile.x, tile.y);
    if (this.maze.pellets.delete(key)) {
      this.collectibleLayerDirty = true;
      this.score += 10; this.floatingTexts.push({ x: tile.x, y: tile.y, text: "+10", color: "#ffee71", timer: 1 }); audio.play("pellet");
    }
    if (this.maze.powerPellets.delete(key)) {
      this.collectibleLayerDirty = true;
      this.score += 50; this.floatingTexts.push({ x: tile.x, y: tile.y, text: "+50", color: "#ffbe2d", timer: 1 });
      audio.play("power");
      this.frightenedTimer = this.difficultySpec.powerDuration; this.frightenedChain = 0;
      this.ghosts.forEach(g => {
        if (g.mode !== GhostMode.RESPAWNING) { g.mode = GhostMode.FRIGHTENED; g.direction = reverseOf(g.direction); }
      });
    }
  }

  updateGhosts(dt) {
    for (const ghost of this.ghosts) {
      if (ghost.mode === GhostMode.RESPAWNING) {
        ghost.respawnTimer -= dt;
        if (ghost.respawnTimer <= 0) {
          ghost.x = ghost.spawn.x; ghost.y = ghost.spawn.y; ghost.direction = UP;
          // The global power timer is authoritative. A cleric returning while
          // it is active must still be blue and edible until that timer ends.
          ghost.mode = this.isPowerActive() ? GhostMode.FRIGHTENED : GhostMode.CHASE;
        }
        continue;
      }
      if (this.atTileCenter(ghost)) {
        ghost.x = Math.round(ghost.x); ghost.y = Math.round(ghost.y);
        this.chooseGhostDirection(ghost);
      }
      const speed = ghost.mode === GhostMode.FRIGHTENED ? this.difficultySpec.frightenedSpeed : ghost.speed;
      this.advanceActor(ghost, speed * dt); this.wrapActor(ghost);
    }
  }

  advanceActor(actor, distance) {
    const oldX = actor.x, oldY = actor.y;
    actor.x += actor.direction.x * distance; actor.y += actor.direction.y * distance;
    if (actor.direction.x && Math.abs(oldX - Math.round(oldX)) > .0001) {
      const center = actor.direction.x < 0 ? Math.floor(oldX) : Math.ceil(oldX);
      if (actor.direction.x < 0 ? actor.x <= center : actor.x >= center) actor.x = center;
    }
    if (actor.direction.y && Math.abs(oldY - Math.round(oldY)) > .0001) {
      const center = actor.direction.y < 0 ? Math.floor(oldY) : Math.ceil(oldY);
      if (actor.direction.y < 0 ? actor.y <= center : actor.y >= center) actor.y = center;
    }
  }

  chooseGhostDirection(ghost) {
    const tile = this.actorTile(ghost), reverse = reverseOf(ghost.direction);
    let choices = this.maze.legalDirections(tile, true);
    const nonReverse = choices.filter(c => !sameDir(c, reverse));
    if (nonReverse.length) choices = nonReverse;
    if (!choices.length) { ghost.direction = reverse; return; }
    if (ghost.mode === GhostMode.FRIGHTENED || ghost.personality === "random") {
      ghost.direction = choices[Math.floor(Math.random() * choices.length)]; return;
    }
    const target = this.ghostTarget(ghost);
    const ranked = choices.map(direction => ({ direction, distance: this.maze.distance(this.maze.neighbor(tile, direction), target), tie: Math.random() }));
    ranked.sort((a, b) => a.distance - b.distance || a.tie - b.tie);
    ghost.direction = ranked[0].direction;
  }

  ghostTarget(ghost) {
    const p = this.actorTile(this.player), d = this.player.direction;
    if (ghost.personality === "chaser") return p;
    if (ghost.personality === "ambusher") return { x: p.x + d.x * 4, y: p.y + d.y * 4 };
    if (ghost.personality === "shy") {
      const distance = Math.abs(ghost.x - this.player.x) + Math.abs(ghost.y - this.player.y);
      return distance < 6 ? ghost.scatterTarget : p;
    }
    return ghost.scatterTarget;
  }

  nextMemorial() {
    if (!this.javidPool.length) {
      this.javidPool = [...memorials];
      for (let i = this.javidPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.javidPool[i], this.javidPool[j]] = [this.javidPool[j], this.javidPool[i]];
      }
    }
    return formatMemorial(this.javidPool.pop() || "");
  }

  resolveCollisions() {
    for (const ghost of this.ghosts) {
      if (ghost.mode === GhostMode.RESPAWNING) continue;
      const dx = Math.abs(this.player.x - ghost.x), dy = this.player.y - ghost.y;
      const wrappedDx = Math.min(dx, this.maze.width - dx);
      if (Math.min(Math.hypot(dx, dy), Math.hypot(wrappedDx, dy)) >= .68) continue;
      if (ghost.mode === GhostMode.FRIGHTENED || this.isPowerActive() || this.superMode) {
        const base = this.superMode ? 500 : 200;
        const points = base * (2 ** this.frightenedChain);
        this.score += points;
        this.activeJavidText = this.nextMemorial(); this.javidPopupTimer = 5;
        audio.play("enemy");
        this.floatingTexts.push({ x: ghost.x, y: ghost.y, text: `+${points}`, color: "#ff6f6f", timer: .8 });
        this.frightenedChain = Math.min(3, this.frightenedChain + 1);
        ghost.mode = GhostMode.RESPAWNING; ghost.respawnTimer = 2;
      } else { this.loseLife(); break; }
    }
  }

  wrapActor(actor) {
    if (actor.x < -.55) actor.x = this.maze.width - .45;
    else if (actor.x > this.maze.width - .45) actor.x = -.55;
  }

  tileCenter(tile) {
    return { x: this.boardOrigin.x + (tile.x + .5) * this.tileSize, y: this.boardOrigin.y + (tile.y + .5) * this.tileSize };
  }

  draw() {
    this.drawStaticScene(); this.drawHeader(); this.drawCollectibles();
    if (this.state !== State.DYING || Math.floor(this.stateTimer * 10) % 2 === 0) this.drawLion();
    this.ghosts.forEach((g, i) => { if (g.mode !== GhostMode.RESPAWNING) this.drawCleric(g, i); });
    this.drawFloatingTexts();
    if (this.superMode) this.drawSuperScreenEffect();
    this.drawHud();
    if (this.state === State.PAUSED) this.drawOverlay("توقف", "", "برای ادامه کلید P را بزنید");
    else if (this.state === State.LEVEL_CLEAR) this.drawOverlay("نقشه آزاد شد", `امتیاز: ${this.score}`, "برای نقشه بعدی لمس کنید");
    else if (this.state === State.WON) this.drawVictoryOverlay();
    else if (this.superBannerTimer > 0) this.drawSuperBanner();
  }

  drawBackground() {
    ctx.fillStyle = "#07090b"; ctx.fillRect(0, 0, viewW, viewH);
    const skin = MOBILE_LAYOUT ? assets.skinPortrait : assets.skinDesktop;
    ctx.drawImage(skin, 0, 0, viewW, viewH);
  }

  drawStaticScene() {
    const layer = this.staticLayer;
    if (this.staticLayerDirty || layer.width !== canvas.width || layer.height !== canvas.height) {
      this.drawBackground();
      this.drawMaze();
      layer.width = canvas.width;
      layer.height = canvas.height;
      const layerContext = layer.getContext("2d", { alpha: false });
      layerContext.setTransform(1, 0, 0, 1, 0, 0);
      layerContext.drawImage(canvas, 0, 0);
      this.staticLayerDirty = false;
      return;
    }
    // Replace the entire previous dynamic frame, including stale compositor pixels.
    ctx.save();
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(layer, 0, 0, viewW, viewH);
    ctx.restore();
  }

  drawHeader() {
    const p = this.header, active = this.javidPopupTimer > 0 && this.activeJavidText;
    ctx.direction = "rtl"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    if (active) {
      const prefix = "فرزند ایران و جان فدای میهن، جاوید نام ";
      const body = this.activeJavidText.startsWith(prefix) ? this.activeJavidText.slice(prefix.length) : this.activeJavidText;
      const parts = body.replace(/ عزیز!$/, "").split(" - ");
      const name = parts.shift() || "جاویدنام ایران";
      const city = parts.pop() || "ایران";
      const details = [...parts, `${city} عزیز`].join("  •  ");
      const centerX = p.x + p.w / 2, maxWidth = p.w - 34;
      const labelSize = Math.max(10, Math.min(13, p.h * .12));
      const nameStart = Math.max(20, Math.min(MOBILE_LAYOUT ? 24 : 30, p.h * .3));
      const nameSize = this.fitText(name, maxWidth, nameStart, 15, "Kalameh", 900);
      const detailStart = Math.max(12, Math.min(MOBILE_LAYOUT ? 13 : 15, p.h * .15));
      const detailSize = this.fitText(details, maxWidth, detailStart, 10, "Kalameh", 500);

      ctx.font = `700 ${labelSize}px LionSunPersian`;
      ctx.fillStyle = COLORS.goldLight;
      ctx.fillText("فرزند ایران و جانفدای میهن ،", centerX, p.y + p.h * .27);

      ctx.save();
      ctx.font = `900 ${nameSize}px Kalameh`;
      ctx.lineWidth = Math.max(2, nameSize * .14);
      ctx.strokeStyle = "rgba(5, 4, 4, .96)";
      ctx.shadowColor = "rgba(177, 20, 30, .8)";
      ctx.shadowBlur = Math.max(7, nameSize * .48);
      ctx.strokeText(name, centerX, p.y + p.h * .54);
      ctx.fillStyle = "#fff3dc";
      ctx.fillText(name, centerX, p.y + p.h * .54);
      ctx.restore();

      ctx.font = `500 ${detailSize}px Kalameh`;
      ctx.fillStyle = "#f0d6aa";
      ctx.fillText(details, centerX, p.y + p.h * .80);
      ctx.direction = "ltr";
      return;
    }

    const titleSize = Math.max(13, Math.min(23, p.h * .24));
    const titleY = p.y + p.h * .26;
    ctx.font = `700 ${titleSize}px LionSunPersian`;
    ctx.fillStyle = COLORS.goldLight; ctx.fillText("یادبود جاویدنامان", p.x + p.w / 2, titleY);
    const message = "فرزند ایران و جان فدای میهن";
    const maxWidth = p.w - 28;
    const startSize = Math.max(10, Math.min(18, p.h * .2));
    const size = this.fitText(message, maxWidth, startSize, 10);
    ctx.font = `${size}px LionSunPersian`; ctx.fillStyle = COLORS.ink;
    ctx.fillText(message, p.x + p.w / 2, p.y + p.h * .67);
    ctx.direction = "ltr";
  }
  drawMaze() {
    const t = this.tileSize, ox = this.boardOrigin.x, oy = this.boardOrigin.y;
    this.maze.rows.forEach((row, y) => [...row].forEach((tile, x) => {
      if (tile === "#") {
        const rx = ox + x * t + 1, ry = oy + y * t + 1, rw = t - 2, rh = t - 2, r = Math.max(3, t / 8);
        fillRound(rx + 2, ry + 3, rw, rh, r, "#080a0b");
        fillRound(rx, ry, rw, rh, r, "#9a6d3f");
        const inset = Math.max(4, t / 8), ix = rx + inset / 2, iy = ry + inset / 2, iw = rw - inset, ih = rh - inset;
        fillRound(ix, iy, iw, ih, Math.max(2, t / 10), null, "#d1a46b", 1);
        const bhh = Math.max(4, ih / 3);
        fillRound(ix + 1, iy + 1, iw - 2, bhh, Math.max(2, t / 12), "#167f82");
        ctx.strokeStyle = "#45b4ae"; ctx.lineWidth = Math.max(1, t / 24); ctx.beginPath(); ctx.moveTo(ix + 3, iy + bhh - 2); ctx.lineTo(ix + iw - 3, iy + bhh - 2); ctx.stroke();
        if (t >= 34) {
          const cx = ix + iw / 2, cy = iy + 1 + bhh / 2, radius = Math.max(2, t / 12);
          ctx.strokeStyle = COLORS.goldLight; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx, cy - radius); ctx.lineTo(cx + radius, cy); ctx.lineTo(cx, cy + radius); ctx.lineTo(cx - radius, cy); ctx.closePath(); ctx.stroke();
        }
        ctx.strokeStyle = "#624224"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(rx + 2, ry + rh / 2); ctx.lineTo(rx + rw - 2, ry + rh / 2); ctx.stroke();
      } else if (tile === "=") {
        const c = this.tileCenter({ x, y });
        ctx.strokeStyle = "#ff8bcd"; ctx.lineWidth = Math.max(4, t / 9); ctx.beginPath(); ctx.moveTo(c.x - t / 2 + 5, c.y); ctx.lineTo(c.x + t / 2 - 5, c.y); ctx.stroke();
      }
    }));
  }

  drawSun(center, size, drawing = ctx) {
    drawing.save(); drawing.translate(center.x, center.y); drawing.lineCap = "round";
    const outer = Math.max(5, size / 2), inner = Math.max(3, outer * .58);
    drawing.strokeStyle = "rgba(255,161,23,.92)"; drawing.lineWidth = Math.max(1, size / 10);
    for (let i = 0; i < 12; i++) { const a = Math.PI * 2 * i / 12; drawing.beginPath(); drawing.moveTo(Math.cos(a) * inner, Math.sin(a) * inner); drawing.lineTo(Math.cos(a) * outer, Math.sin(a) * outer); drawing.stroke(); }
    drawing.fillStyle = "rgba(255,129,12,.35)"; drawing.beginPath(); drawing.arc(0, 0, inner + Math.max(2, size / 7), 0, Math.PI * 2); drawing.fill();
    drawing.fillStyle = "#ffbc23"; drawing.beginPath(); drawing.arc(0, 0, inner, 0, Math.PI * 2); drawing.fill();
    drawing.fillStyle = "#ffee71"; drawing.beginPath(); drawing.arc(-inner / 4, -inner / 4, Math.max(2, inner / 2), 0, Math.PI * 2); drawing.fill();
    drawing.strokeStyle = "#c45b0b"; drawing.lineWidth = Math.max(1, size / 12); drawing.beginPath(); drawing.arc(0, 0, inner, 0, Math.PI * 2); drawing.stroke(); drawing.restore();
  }

  getSunSprite(size) {
    const box = Math.ceil(size * 1.55);
    const pixelRatio = Math.max(1, dpr);
    const key = `${box}:${pixelRatio}`;
    if (this.sunSprite?.key === key) return this.sunSprite;
    const sprite = document.createElement("canvas");
    sprite.width = Math.ceil(box * pixelRatio);
    sprite.height = Math.ceil(box * pixelRatio);
    const spriteContext = sprite.getContext("2d");
    spriteContext.scale(pixelRatio, pixelRatio);
    this.drawSun({ x: box / 2, y: box / 2 }, size, spriteContext);
    this.sunSprite = { key, canvas: sprite, box };
    return this.sunSprite;
  }

  drawCollectibles() {
    const size = Math.max(14, this.tileSize * .43);
    const sprite = this.getSunSprite(size);
    const layer = this.collectibleLayer;
    if (this.collectibleLayerDirty || layer.width !== canvas.width || layer.height !== canvas.height) {
      layer.width = canvas.width; layer.height = canvas.height;
      const layerContext = layer.getContext("2d");
      layerContext.setTransform(1, 0, 0, 1, 0, 0);
      layerContext.clearRect(0, 0, layer.width, layer.height);
      layerContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.maze.pellets.forEach(key => {
        const [x, y] = key.split(",").map(Number), center = this.tileCenter({ x, y });
        layerContext.drawImage(sprite.canvas, center.x - sprite.box / 2, center.y - sprite.box / 2, sprite.box, sprite.box);
      });
      this.collectibleLayerDirty = false;
    }
    ctx.drawImage(layer, 0, 0, viewW, viewH);
    this.maze.powerPellets.forEach(key => { const [x, y] = key.split(",").map(Number); this.drawPowerCollectible(this.tileCenter({ x, y })); });
  }
  drawPowerCollectible(center) {
    const wave = (Math.sin(this.animationTime * 5.2) + 1) / 2;
    const pulse = .88 + wave * .28;
    const base = Math.max(50, this.tileSize * 1.5), glowRadius = base * (.72 + wave * .2);
    ctx.save();
    const glow = ctx.createRadialGradient(center.x, center.y, base * .08, center.x, center.y, glowRadius);
    glow.addColorStop(0, `rgba(255,239,135,${.38 + wave * .2})`);
    glow.addColorStop(.36, `rgba(245,170,38,${.24 + wave * .12})`);
    glow.addColorStop(1, "rgba(21,170,164,0)");
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(center.x, center.y, glowRadius, 0, Math.PI * 2); ctx.fill();
    ctx.translate(center.x, center.y); ctx.rotate(this.animationTime * .55);
    ctx.strokeStyle = `rgba(255,214,91,${.48 + wave * .34})`; ctx.lineWidth = Math.max(2, this.tileSize * .055);
    ctx.setLineDash([Math.max(5, this.tileSize * .14), Math.max(4, this.tileSize * .1)]);
    ctx.beginPath(); ctx.arc(0, 0, base * .55, 0, Math.PI * 2); ctx.stroke();
    ctx.rotate(-this.animationTime * 1.25); ctx.strokeStyle = `rgba(46,205,196,${.38 + wave * .28})`;
    ctx.beginPath(); ctx.arc(0, 0, base * .68, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
    ctx.save(); ctx.shadowColor = "#ffc84c"; ctx.shadowBlur = base * (.2 + wave * .22);
    this.drawImageFit(assets.iran, ASSET_RECTS.iran, center, base * pulse);
    ctx.restore();
  }

  drawImageFit(image, source, center, boxSize, options = {}) {
    const scale = Math.min(boxSize / source.w, boxSize / source.h), w = source.w * scale, h = source.h * scale;
    ctx.save(); ctx.translate(center.x, center.y); if (options.rotate) ctx.rotate(options.rotate); if (options.flipX) ctx.scale(-1, 1);
    if (options.alpha != null) ctx.globalAlpha = options.alpha;
    ctx.drawImage(image, source.x, source.y, source.w, source.h, -w / 2, -h / 2, w, h);
    if (options.tint) { ctx.globalCompositeOperation = "source-atop"; ctx.fillStyle = options.tint; ctx.fillRect(-w / 2, -h / 2, w, h); }
    ctx.restore();
  }

  drawLion() {
    const center = this.tileCenter(this.player), size = Math.max(74, this.tileSize * 2.55);
    const moving = !sameDir(this.player.direction, STOP) && this.state === State.PLAYING;
    const frame = moving ? Math.floor(this.animationTime * 8.5) % 4 : 0;
    if (this.superMode || this.isPowerActive()) this.drawSuperAura(center, size);
    ctx.fillStyle = "rgba(0,0,0,.42)"; ctx.beginPath(); ctx.ellipse(center.x, center.y + size * .34, size * .28, Math.max(3, size * .07), 0, 0, Math.PI * 2); ctx.fill();
    let rotate = 0, flipX = false;
    if (sameDir(this.playerFacing, RIGHT)) flipX = true;
    else if (sameDir(this.playerFacing, UP)) rotate = Math.PI / 2;
    else if (sameDir(this.playerFacing, DOWN)) rotate = -Math.PI / 2;
    this.drawImageFit(assets.lionWalk, ASSET_RECTS.lionWalk[frame], center, size, { rotate, flipX });
  }

  drawSuperAura(center, size) {
    ctx.save(); ctx.translate(center.x, center.y); ctx.lineCap = "round";
    const rotation = this.animationTime * .65, inner = size * .34, outer = size * .78;
    ctx.strokeStyle = "rgba(255,181,34,.57)"; ctx.lineWidth = Math.max(2, size / 28);
    for (let i = 0; i < 32; i++) { const a = Math.PI * 2 * i / 32 + rotation, len = i % 2 === 0 ? outer : outer * .78; ctx.beginPath(); ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner); ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len); ctx.stroke(); }
    ctx.fillStyle = "rgba(255,126,10,.23)"; ctx.beginPath(); ctx.arc(0, 0, size * .48, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,201,55,.33)"; ctx.beginPath(); ctx.arc(0, 0, inner, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(255,239,132,.71)"; ctx.lineWidth = Math.max(2, size / 35); ctx.beginPath(); ctx.arc(0, 0, inner * .74, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 14; i++) { const a = rotation * 1.9 + i * Math.PI * 2 / 14, orbit = size * (.5 + .2 * Math.sin(this.animationTime * 2.2 + i)); ctx.fillStyle = "rgba(255,231,104,.86)"; ctx.beginPath(); ctx.arc(Math.cos(a) * orbit, Math.sin(a) * orbit, Math.max(2, size / 30 + i % 3), 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }

  drawCleric(ghost, index) {
    const center = this.tileCenter(ghost), size = Math.max(62, this.tileSize * 1.86);
    const frightened = ghost.mode === GhostMode.FRIGHTENED || this.isPowerActive();
    if (!frightened) {
      const auraSize = size * (1.08 + .06 * Math.sin(this.animationTime * 5 + index));
      ctx.fillStyle = "rgba(229,28,45,.16)"; ctx.beginPath(); ctx.arc(center.x, center.y, auraSize / 2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(229,28,45,.31)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(center.x, center.y, auraSize / 3, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.beginPath(); ctx.ellipse(center.x, center.y + size * .34, size * .26, Math.max(3, size * .055), 0, 0, Math.PI * 2); ctx.fill();
    if (frightened) {
      this.drawImageFit(assets.clericsFrightened, ASSET_RECTS.clericsFrightened[index], center, size);
    } else {
      this.drawImageFit(assets.clerics, ASSET_RECTS.clerics[index], center, size);
    }
  }

  drawFloatingTexts() {
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = `700 ${Math.max(13, this.tileSize * .44)}px Arial`;
    for (const ft of this.floatingTexts) {
      const p = this.tileCenter(ft);
      ctx.globalAlpha = clamp(ft.timer * 2, 0, 1);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, p.x, p.y - (1 - ft.timer) * this.tileSize * .28);
    }
    ctx.globalAlpha = 1;
  }

  fitText(text, maxWidth, startSize, minSize = 14, family = "LionSunPersian", weight = 400) {
    let size = startSize;
    while (size > minSize) { ctx.font = `${weight} ${size}px ${family}`; if (ctx.measureText(text).width <= maxWidth) break; size--; }
    return size;
  }

  drawSuperScreenEffect() {
    const pulse = (55 + 22 * Math.sin(this.animationTime * 4)) / 255, border = Math.max(6, viewH / 90);
    fillRound(border / 2, border / 2, viewW - border, viewH - border, 20, null, `rgba(255,177,31,${pulse})`, border);
    fillRound(border * 2.5, border * 2.5, viewW - border * 5, viewH - border * 5, 18, null, `rgba(255,232,115,${pulse / 2})`, 2);
  }

  panelFrame(panel, spec) {
    fillRound(panel.x + 6, panel.y + 7, panel.w, panel.h, 18, "#000");
    fillRound(panel.x, panel.y, panel.w, panel.h, 18, "#1d1e1d", COLORS.sandstone, 3);
    fillRound(panel.x + 8, panel.y + 8, panel.w - 16, panel.h - 16, 12, null, COLORS.bronze, 2);
    ctx.strokeStyle = "rgba(24,143,145,.65)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(panel.x + 18, panel.y + 14); ctx.lineTo(panel.x + panel.w - 18, panel.y + 14); ctx.stroke();
  }

  drawControlButton(button, kind) {
    const { x, y, r } = button;
    ctx.save();
    const gradient = ctx.createRadialGradient(x - r * .2, y - r * .25, 2, x, y, r);
    gradient.addColorStop(0, "#3d3830"); gradient.addColorStop(1, "#141718");
    ctx.fillStyle = "rgba(0,0,0,.65)"; ctx.beginPath(); ctx.arc(x + 3, y + 4, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = COLORS.sandstone; ctx.lineWidth = Math.max(2, r * .08); ctx.stroke();
    ctx.strokeStyle = COLORS.bronze; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r * .76, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = COLORS.goldLight; ctx.strokeStyle = COLORS.goldLight; ctx.lineWidth = Math.max(2, r * .08); ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (kind === "pause") {
      ctx.fillRect(x - r * .25, y - r * .34, r * .16, r * .68); ctx.fillRect(x + r * .09, y - r * .34, r * .16, r * .68);
    } else {
      ctx.beginPath(); ctx.moveTo(x - r * .34, y - r * .13); ctx.lineTo(x - r * .16, y - r * .13); ctx.lineTo(x + r * .04, y - r * .32); ctx.lineTo(x + r * .04, y + r * .32); ctx.lineTo(x - r * .16, y + r * .13); ctx.lineTo(x - r * .34, y + r * .13); ctx.closePath(); ctx.fill();
      if (audio.enabled) {
        ctx.beginPath(); ctx.arc(x + r * .02, y, r * .28, -Math.PI / 3, Math.PI / 3); ctx.stroke();
        ctx.beginPath(); ctx.arc(x + r * .02, y, r * .48, -Math.PI / 3, Math.PI / 3); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.moveTo(x + r * .16, y - r * .25); ctx.lineTo(x + r * .5, y + r * .25); ctx.moveTo(x + r * .5, y - r * .25); ctx.lineTo(x + r * .16, y + r * .25); ctx.stroke();
      }
    }
    ctx.restore();
  }

  drawHud() {
    const p = this.panel, spec = LEVELS[this.currentLevel];
    if (p.w > p.h * 1.45) this.drawHudPortrait(p, spec); else this.drawHudSide(p, spec);
    if (!audio.enabled && this.soundButton) {
      const b = this.soundButton; ctx.save(); ctx.strokeStyle = "#efbf6a"; ctx.lineWidth = Math.max(3, b.r * .1); ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(b.x - b.r * .3, b.y - b.r * .3); ctx.lineTo(b.x + b.r * .3, b.y + b.r * .3); ctx.stroke(); ctx.restore();
    }
    if (this.state === State.PAUSED && this.pauseButton) {
      const b = this.pauseButton; ctx.save(); ctx.strokeStyle = "rgba(242,195,107,.9)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 1.08, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    }
  }

  text(text, x, y, size, color, align = "center", family = "Arial", direction = "ltr") {
    ctx.font = `${Math.round(size)}px ${family}`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "middle"; ctx.direction = direction; ctx.fillText(text, x, y);
  }

  drawHudPortrait(p, spec) {
    const remaining = this.maze.pellets.size + this.maze.powerPellets.size;
    const total = this.maze.initialPellets.size + this.maze.initialPower.size;
    const xs = [p.x + p.w * .1, p.x + p.w * .37, p.x + p.w * .64, p.x + p.w * .9];
    const labelY = p.y + p.h * .28, valueY = p.y + p.h * .69;
    ["MAP", "SCORE", "LIVES", "SUNS"].forEach((label, i) => this.text(label, xs[i], labelY, Math.max(12, p.h * .14), "#c9a66b"));
    this.text(`${this.currentLevel + 1} / ${LEVELS.length}`, xs[0], valueY, Math.max(20, p.h * .24), COLORS.goldLight);
    this.text(padScore(this.score), xs[1], valueY, Math.max(22, p.h * .27), COLORS.goldLight);
    this.text(`${total - remaining} / ${total}`, xs[3], valueY, Math.max(17, p.h * .2), COLORS.ink);
    if (this.superMode) this.text("∞", xs[2], valueY, Math.max(25, p.h * .28), COLORS.goldLight);
    else {
      const iconSize = this.lives > 3 ? Math.max(19, p.h * .19) : Math.max(23, p.h * .24);
      const spacing = iconSize * .98, firstX = xs[2] - spacing * (this.lives - 1) / 2;
      for (let i = 0; i < this.lives; i++) this.drawImageFit(assets.lion, ASSET_RECTS.lions[0], { x: firstX + i * spacing, y: valueY }, iconSize);
    }
  }

  drawHudSide(p, spec) {
    const total = this.maze.initialPellets.size + this.maze.initialPower.size;
    const remaining = this.maze.pellets.size + this.maze.powerPellets.size;
    const rows = [p.y + p.h * .12, p.y + p.h * .38, p.y + p.h * .64, p.y + p.h * .89];
    const lx = p.x + p.w * .3, vx = p.x + p.w * .7;
    const labelSize = Math.max(15, p.w * .055), valueSize = Math.max(19, p.w * .075);
    ["MAP", "SCORE", "LIVES", "SUNS"].forEach((label, i) => this.text(label, lx, rows[i], labelSize, "#c9a66b"));
    this.text(`${this.currentLevel + 1} / ${LEVELS.length}`, vx, rows[0], valueSize, COLORS.goldLight);
    this.text(padScore(this.score), vx, rows[1], valueSize, COLORS.goldLight);
    if (this.superMode) this.text("∞", vx, rows[2], valueSize * 1.2, COLORS.goldLight);
    else {
      const spacing = Math.max(19, p.w * .075), first = vx - spacing * (this.lives - 1) / 2;
      for (let i = 0; i < this.lives; i++) this.drawImageFit(assets.lion, ASSET_RECTS.lions[0], { x: first + i * spacing, y: rows[2] }, Math.max(24, p.w * .09));
    }
    this.text(`${total - remaining} / ${total}`, vx, rows[3], valueSize, COLORS.ink);
  }

  drawOverlay(title, subtitle, prompt) {
    ctx.fillStyle = "rgba(4,5,14,.8)"; ctx.fillRect(0, 0, viewW, viewH);
    const w = Math.min(820, viewW - 80), h = Math.min(370, viewH - 80), x = (viewW - w) / 2, y = (viewH - h) / 2, spec = LEVELS[this.currentLevel];
    fillRound(x + 8, y + 9, w, h, 30, "#000"); fillRound(x, y, w, h, 30, "#0c1931", spec.sandstone, 5); fillRound(x + 10, y + 10, w - 20, h - 20, 22, null, spec.tileBlue, 2);
    const titleSize = this.fitText(title, w - 50, Math.max(64, viewH / 11), 28); this.text(title, viewW / 2, y + h * .31, titleSize, COLORS.goldLight, "center", "LionSunPersian", "rtl");
    this.text(subtitle, viewW / 2, y + h * .56, Math.max(22, viewH / 36), COLORS.ink, "center", "LionSunPersian", "rtl");
    if (Math.floor(this.animationTime * 2) % 2 === 0 || this.state === State.PAUSED) this.text(prompt, viewW / 2, y + h * .76, Math.max(22, viewH / 36), spec.tileAccent, "center", "LionSunPersian", "rtl");
  }

  drawSuperBanner() {
    const w = Math.min(880, viewW - 80), h = Math.max(100, viewH / 8), x = (viewW - w) / 2, y = viewH / 5 - h / 2, alpha = Math.min(.92, this.superBannerTimer * .49);
    fillRound(x, y, w, h, 24, `rgba(80,36,5,${alpha})`, `rgba(255,196,50,${alpha})`, 4);
    this.text("شیر و خورشید بیدار شد", viewW / 2, y + h * .4, Math.max(32, viewH / 25), "#fff1a4", "center", "LionSunPersian", "rtl");
    const persian = "قدرت ایران در رگ‌های شیر جاری‌ست"; const size = this.fitText(persian, w - 40, Math.max(24, viewH / 31), 14);
    this.text(persian, viewW / 2, y + h * .75, size, COLORS.ink, "center", "LionSunPersian", "rtl");
  }

  drawVictoryOverlay() {
    ctx.fillStyle = "rgba(3,8,18,.88)"; ctx.fillRect(0, 0, viewW, viewH);
    const w = Math.min(940, viewW - 70), h = Math.min(600, viewH - 60), x = (viewW - w) / 2, y = (viewH - h) / 2;
    fillRound(x + 10, y + 12, w, h, 34, "#000"); fillRound(x, y, w, h, 34, "#0f2131", "#e59d20", 6); fillRound(x + 11, y + 11, w - 22, h - 22, 26, null, "#23985e", 3);
    const emblem = { x: viewW / 2, y: y + h * .26 }, emblemSize = Math.min(220, h / 3); this.drawSuperAura(emblem, emblemSize); this.drawImageFit(assets.iran, ASSET_RECTS.iran, emblem, Math.min(190, h / 3));
    this.text("هر پنج نقشه آزاد شد", viewW / 2, y + h * .52, Math.max(32, viewH / 25), "#b3dcbc", "center", "LionSunPersian", "rtl");
    const msg = "ایران به تو افتخار می‌کند", msgSize = this.fitText(msg, w - 60, Math.max(64, viewH / 11), 24); this.text(msg, viewW / 2, y + h * .65, msgSize, COLORS.goldLight, "center", "LionSunPersian", "rtl");
    this.text(`امتیاز نهایی ${padScore(this.score)}`, viewW / 2, y + h * .79, Math.max(22, viewH / 36), COLORS.ink, "center", "LionSunPersian", "rtl");
    if (Math.floor(this.animationTime * 2) % 2 === 0) this.text("برای بازی دوباره لمس کنید", viewW / 2, y + h * .9, Math.max(22, viewH / 36), "#58d8ae", "center", "LionSunPersian", "rtl");
  }
}

let game;

function resize() {
  const rect = canvas.getBoundingClientRect();
  if (MOBILE_LAYOUT) {
    viewW = 720;
    viewH = 1280;
    dpr = 1;
  } else {
    viewW = Math.max(640, Math.round(rect.width));
    viewH = Math.round(viewW * 9 / 16);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
  }
  canvas.width = Math.round(viewW * dpr); canvas.height = Math.round(viewH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (game) game.updateLayout();
}

function activateOrAdvance() {
  if (!game) return;
  if (game.state === State.START || game.state === State.WON) showStartScreen();
  else if (game.state === State.LEVEL_CLEAR) game.nextLevel();
}

let selectedDifficulty = "normal";
function selectDifficulty(key) {
  selectedDifficulty = DIFFICULTIES[key] ? key : "normal";
  difficultyButtons.forEach(button => {
    const selected = button.dataset.difficulty === selectedDifficulty;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function showStartScreen() {
  clearTimeout(memorialHintTimer);
  memorialHint.hidden = true;
  memorialIntro.hidden = true;
  startScreen.hidden = false;
  startGameButton.focus({ preventScroll: true });
}

let memorialHintTimer = null;
function showMemorialIntro() {
  memorialIntro.hidden = false;
  memorialHint.hidden = true;
  clearTimeout(memorialHintTimer);
  memorialHintTimer = setTimeout(() => {
    if (!memorialIntro.hidden) memorialHint.hidden = false;
  }, 5000);
}

function beginSelectedGame() {
  if (!game) return;
  requestTelegramFullscreen();
  audio.ensure(); audio.play("button");
  game.setDifficulty(selectedDifficulty);
  startScreen.hidden = true;
  game.newGame();
  canvas.focus({ preventScroll: true });
}

function togglePause() {
  if (!game || ![State.PLAYING, State.PAUSED].includes(game.state)) return;
  game.state = game.state === State.PLAYING ? State.PAUSED : State.PLAYING;
  audio.play("button");
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return { x: (event.clientX - rect.left) * viewW / rect.width, y: (event.clientY - rect.top) * viewH / rect.height };
}

function hits(point, button) { return button && Math.hypot(point.x - button.x, point.y - button.y) <= button.r * 1.22; }

window.addEventListener("keydown", event => {
  audio.ensure();
  const key = event.key.toLowerCase();
  if ((key === "enter" || key === " ") && !memorialIntro.hidden) { event.preventDefault(); showStartScreen(); return; }
  if ((key === "enter" || key === " ") && !startScreen.hidden) { event.preventDefault(); beginSelectedGame(); return; }
  const moves = { arrowup: UP, w: UP, arrowdown: DOWN, s: DOWN, arrowleft: LEFT, a: LEFT, arrowright: RIGHT, d: RIGHT };
  if (moves[key]) { event.preventDefault(); game?.setDirection(moves[key]); }
  else if (key === "enter" || key === " ") { event.preventDefault(); activateOrAdvance(); }
  else if (key === "p") togglePause();
  else if (key === "m") { event.preventDefault(); audio.toggle(); }
  else if (key === "f11") { event.preventDefault(); document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.(); }
});

canvas.addEventListener("pointerdown", event => {
  audio.ensure();
  canvas.setPointerCapture?.(event.pointerId); canvas.focus({ preventScroll: true });
  const point = canvasPoint(event);
  if (hits(point, game?.soundButton)) { audio.toggle(); game.touchStart = null; return; }
  if (hits(point, game?.pauseButton)) { togglePause(); game.touchStart = null; return; }
  if (game && [State.START, State.WON, State.LEVEL_CLEAR].includes(game.state)) { activateOrAdvance(); game.touchStart = null; return; }
  game.touchStart = { x: event.clientX, y: event.clientY };
});

canvas.addEventListener("pointerup", event => {
  if (!game?.touchStart) return;
  const dx = event.clientX - game.touchStart.x, dy = event.clientY - game.touchStart.y;
  game.touchStart = null;
  if (Math.max(Math.abs(dx), Math.abs(dy)) >= Math.max(18, viewH * .025)) game.setDirection(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? RIGHT : LEFT) : (dy > 0 ? DOWN : UP));
});

canvas.addEventListener("pointercancel", () => { if (game) game.touchStart = null; });
window.addEventListener("resize", resize, { passive: true });
window.visualViewport?.addEventListener("resize", resize, { passive: true });
memorialContinue.addEventListener("click", () => { requestTelegramFullscreen(); audio.ensure(); audio.play("button"); showStartScreen(); });
startGameButton.addEventListener("click", beginSelectedGame);
difficultyButtons.forEach(button => button.addEventListener("click", () => { audio.ensure(); audio.play("button"); selectDifficulty(button.dataset.difficulty); }));

let last = performance.now(), lastFrame = last;
function frame(now) {
  requestAnimationFrame(frame);
  if (document.hidden) { last = now; lastFrame = now; return; }
  const elapsed = now - lastFrame;
  if (elapsed + .5 < TARGET_FRAME_MS) return;
  lastFrame = now - (elapsed % TARGET_FRAME_MS);
  const dt = Math.min((now - last) / 1000, FPS_STEP_LIMIT); last = now;
  game.update(dt); game.draw();
}
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) { last = performance.now(); lastFrame = last; }
});

let booting = false;
async function boot() {
  if (booting) return;
  booting = true;
  loadingRetry.hidden = true;
  loading.classList.remove("done");
  setLoadingProgress(4, "گشودن دروازه‌های بازی…");
  try {
    resize();
    setLoadingProgress(10, "آماده‌سازی میدان نبرد…");
    await loadAssets();
    game = new Game();
    // Read-only handle used by the automated browser checks and removable in
    // production without affecting gameplay.
    window.__lionSunGame = game;
    setLoadingProgress(100, "آماده است");
    setTimeout(() => { loading.classList.add("done"); showMemorialIntro(); }, 180);
    requestAnimationFrame(frame);
    connectTelegram();
    // Persian text is first needed after a power-up. Fetch its font in the
    // background so it never delays the first playable frame.
    setTimeout(() => {
      document.fonts.load('24px "LionSunPersian"').catch(() => {});
      document.fonts.load('900 24px "Kalameh"').catch(() => {});
      document.fonts.load('500 16px "Kalameh"').catch(() => {});
    }, 800);
  } catch (error) {
    console.error(error);
    loadingStatus.textContent = "بارگذاری کامل نشد؛ اتصال را بررسی و دوباره تلاش کنید";
    loadingRetry.hidden = false;
  } finally {
    booting = false;
  }
}

loadingRetry.addEventListener("click", boot);
boot();

window.__lionSunModule = { Game, Maze, GhostMode, State, DIFFICULTIES, LEVELS, formatMemorial, normalizeMemorial, removeReachableDeadEnds, audio, TARGET_FPS };
