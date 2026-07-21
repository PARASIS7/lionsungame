const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".png": "image/png", ".webp": "image/webp", ".ttf": "font/ttf"
};

const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  const file = path.join(__dirname, pathname === "/" ? "index.html" : pathname.replace(/^\//, ""));
  fs.readFile(file, (error, data) => {
    if (error) { response.writeHead(404); response.end("Not found"); return; }
    response.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    response.end(data);
  });
});

async function openGame(browser, viewport, url, device = viewport.width < 600 ? "mobile" : "desktop") {
  const userAgent = device === "mobile"
    ? "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/126.0 Mobile Safari/537.36"
    : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36";
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, userAgent });
  const errors = [];
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__lionSunGame && document.querySelector("#loading").classList.contains("done"));
  await page.waitForTimeout(520);
  return { page, errors };
}

async function enterGame(page, difficulty = "normal") {
  await page.click("#memorial-continue");
  await page.waitForSelector("#start-screen:not([hidden])");
  await page.click(`[data-difficulty="${difficulty}"]`);
  await page.click("#start-game");
  await page.waitForFunction(() => window.__lionSunGame?.state === "playing");
}

(async () => {
  const liveUrl = process.argv[2];
  if (!liveUrl) await new Promise(resolve => server.listen(8770, "127.0.0.1", resolve));
  const url = liveUrl || "http://127.0.0.1:8770/";
  const browser = await chromium.launch({ headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });

  const loaderPreview = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1 });
  await loaderPreview.route("**/lion-sprites.webp", async route => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    await route.continue();
  });
  await loaderPreview.goto(url, { waitUntil: "domcontentloaded" });
  await loaderPreview.waitForTimeout(220);
  await loaderPreview.screenshot({ path: "loading-mobile-redesign.png", fullPage: true });
  await loaderPreview.close();

  const telegramShort = await openGame(browser, { width: 387, height: 695 }, url);
  const telegramPosterResult = await telegramShort.page.evaluate(() => {
    const copy = document.querySelector(".memorial-copy"), art = document.querySelector(".poster-art img"), rect = art.getBoundingClientRect();
    return {
      viewport: [innerWidth, innerHeight],
      artInsideViewport: rect.top >= 0 && rect.left >= 0 && rect.right <= innerWidth && rect.bottom <= innerHeight,
      artLoaded: art.complete && art.naturalWidth > 0 && art.naturalHeight > 0,
      fixedPoster: getComputedStyle(art).objectFit === "cover" && getComputedStyle(copy).display === "none"
    };
  });
  await telegramShort.page.screenshot({ path: "poster-telegram-short-live.png", fullPage: true });
  await telegramShort.page.click("#memorial-continue");
  await telegramShort.page.waitForSelector("#start-screen:not([hidden])");
  const telegramStartResult = await telegramShort.page.evaluate(() => {
    const card = document.querySelector(".gate-card").getBoundingClientRect(), button = document.querySelector("#start-game").getBoundingClientRect();
    return { cardInsideViewport: card.top >= 0 && card.bottom <= innerHeight, buttonVisible: button.top >= card.top && button.bottom <= card.bottom };
  });
  await telegramShort.page.screenshot({ path: "start-telegram-short-live.png", fullPage: true });
  await telegramShort.page.close();

  const telegramV9Url = `${url}#tgWebAppPlatform=android&tgWebAppVersion=9.0`;
  const mobile = await openGame(browser, { width: 412, height: 915 }, telegramV9Url);
  await mobile.page.waitForFunction(() => window.Telegram?.WebApp);
  await mobile.page.waitForSelector("#memorial-hint:not([hidden])", { timeout: 6500 });
  const introResult = await mobile.page.evaluate(() => ({
    posterVisible: !document.querySelector("#memorial-intro").hidden,
    startHidden: document.querySelector("#start-screen").hidden,
    hintVisible: !document.querySelector("#memorial-hint").hidden,
    verticalSwipesDisabled: document.documentElement.dataset.telegramVerticalSwipes === "disabled",
    fullscreenRequested: document.documentElement.dataset.telegramFullscreenRequested === "true",
    mobilePoster: document.querySelector("#memorial-poster-image").currentSrc.includes("mobile-v12"),
    noForcedFocus: document.activeElement !== document.querySelector("#memorial-continue"),
    posterText: document.querySelector(".memorial-copy").innerText,
    bundledMemorials: window.__LION_SUN_MEMORIALS?.length || 0,
    targetFps: window.__lionSunModule.TARGET_FPS
  }));
  await mobile.page.screenshot({ path: "poster-mobile-live.png", fullPage: true });
  await mobile.page.click("#memorial-continue");
  await mobile.page.waitForSelector("#start-screen:not([hidden])");
  await mobile.page.screenshot({ path: "start-mobile-live.png", fullPage: true });
  await mobile.page.click('[data-difficulty="easy"]');
  await mobile.page.click("#start-game");
  await mobile.page.waitForTimeout(120);
  const mobileResult = await mobile.page.evaluate(async () => {
    const module = window.__lionSunModule;
    const game = window.__lionSunGame;
    const canvas = document.querySelector("canvas");
    const sample = module.formatMemorial({ name: "نام نمونه", age: "۱۸", deathDay: "۱۸ دی", city: "تهران" });
    const longestMemorial = (window.__LION_SUN_MEMORIALS || []).map(module.formatMemorial).sort((a, b) => b.length - a.length)[0] || sample;
    game.activeJavidText = longestMemorial; game.javidPopupTimer = 5;
    const ghost = game.ghosts[0]; game.frightenedTimer = 5; ghost.mode = "respawning"; ghost.respawnTimer = .001;
    game.update(.01); await new Promise(resolve => setTimeout(resolve, 30));
    const respawnMode = ghost.mode;
    game.ghosts.forEach(item => { item.mode = "respawning"; item.respawnTimer = 999; });
    const pelletKey = [...game.maze.pellets][0], pelletBefore = game.maze.pellets.size;
    const [pelletX, pelletY] = pelletKey.split(",").map(Number);
    game.player.x = pelletX; game.player.y = pelletY; game.collectAtPlayer();
    const pelletRemoved = game.maze.pellets.size === pelletBefore - 1 && !game.maze.pellets.has(pelletKey);
    const powerKey = [...game.maze.powerPellets][0], powerBefore = game.maze.powerPellets.size;
    const [powerX, powerY] = powerKey.split(",").map(Number);
    game.player.x = powerX; game.player.y = powerY; game.collectAtPlayer();
    const powerRemoved = game.maze.powerPellets.size === powerBefore - 1 && !game.maze.powerPellets.has(powerKey);
    let powerDraws = 0;
    const originalPowerDraw = game.drawPowerCollectible;
    game.drawPowerCollectible = function (...args) { powerDraws++; return originalPowerDraw.apply(this, args); };
    game.draw(); game.drawPowerCollectible = originalPowerDraw;
    const context = canvas.getContext("2d"), originalFillText = context.fillText, boxes = [];
    context.fillText = function (text, x, y, maxWidth) {
      const metrics = this.measureText(text);
      boxes.push({ text, font: this.font, top: y - metrics.actualBoundingBoxAscent, bottom: y + metrics.actualBoundingBoxDescent });
      return originalFillText.call(this, text, x, y, maxWidth);
    };
    game.drawHeader(); context.fillText = originalFillText;
    const minimumHeaderGap = Math.min(...boxes.slice(1).map((box, index) => box.top - boxes[index].bottom));
    const memorialNameFont = boxes[1]?.font || "";
    const memorialNameSize = Number(memorialNameFont.match(/([\d.]+)px/)?.[1] || 0);
    game.newGame(); module.audio.setEnabled(false);
    game.ghosts.forEach(item => { item.mode = "respawning"; item.respawnTimer = 999; });
    const movementPelletsBefore = game.maze.pellets.size;
    for (let frame = 0; frame < 150; frame++) game.update(1 / 60);
    const movementPelletsAfter = game.maze.pellets.size;
    game.maze.pellets.clear(); game.maze.powerPellets.clear(); game.collectibleLayerDirty = true;
    game.floatingTexts = []; game.superMode = false; game.superBannerTimer = 0;
    game.ghosts.forEach(item => { item.mode = "respawning"; item.respawnTimer = 999; });
    const oldTile = { x: game.player.x, y: game.player.y };
    game.draw();
    let farTile = oldTile, farDistance = -1;
    for (let y = 0; y < game.maze.height; y++) for (let x = 0; x < game.maze.width; x++) {
      if (!game.maze.passable(x, y)) continue;
      const distance = Math.abs(x - oldTile.x) + Math.abs(y - oldTile.y);
      if (distance > farDistance) { farDistance = distance; farTile = { x, y }; }
    }
    game.player.x = farTile.x; game.player.y = farTile.y; game.draw();
    const oldCenter = game.tileCenter(oldTile);
    const radius = Math.max(20, Math.floor(game.tileSize * .7));
    const sampleX = Math.max(0, Math.floor(oldCenter.x - radius));
    const sampleY = Math.max(0, Math.floor(oldCenter.y - radius));
    const sampleW = Math.min(canvas.width - sampleX, radius * 2);
    const sampleH = Math.min(canvas.height - sampleY, radius * 2);
    const currentPixels = context.getImageData(sampleX, sampleY, sampleW, sampleH).data;
    const basePixels = game.staticLayer.getContext("2d").getImageData(sampleX, sampleY, sampleW, sampleH).data;
    let stalePixels = 0;
    for (let i = 0; i < currentPixels.length; i += 4) {
      if (currentPixels[i] !== basePixels[i] || currentPixels[i + 1] !== basePixels[i + 1] || currentPixels[i + 2] !== basePixels[i + 2]) stalePixels++;
    }
    return {
      canvas: [document.querySelector("canvas").width, document.querySelector("canvas").height],
      headerAboveBoard: game.header.y + game.header.h <= game.boardOrigin.y,
      panelBelowBoard: game.panel.y >= game.boardOrigin.y + game.maze.height * game.tileSize,
      memorial: sample,
      memorialExact: sample === "فرزند ایران و جان فدای میهن، جاوید نام نام نمونه - ۱۸ ساله - ۱۸ دی - تهران عزیز!",
      audioCreated: Boolean(module.audio.context),
      soundButton: Boolean(game.soundButton),
      difficulty: game.difficulty,
      targetFps: module.TARGET_FPS,
      lives: game.lives,
      respawnMode,
      pelletRemoved,
      powerRemoved,
      remainingPowerDraws: powerDraws,
      minimumHeaderGap,
      memorialNameFont,
      memorialNameSize,
      memorialHeaderLabel: boxes[0]?.text || "",
      movementCollectedPellets: movementPelletsBefore - movementPelletsAfter,
      stalePixels,
      state: game.state,
      oldEnglishTitleAbsent: !document.body.innerText.includes("LION & SUN MAZE")
    };
  });
  await mobile.page.screenshot({ path: "canvas-mobile-stone.png", fullPage: true });

  const desktop = await openGame(browser, { width: 1440, height: 900 }, url);
  await desktop.page.screenshot({ path: "poster-desktop-live.png", fullPage: true });
  await enterGame(desktop.page, "hard"); await desktop.page.waitForTimeout(420);
  const soundControl = await desktop.page.evaluate(async () => {
    const module = window.__lionSunModule; const canvas = document.querySelector("canvas"), rect = canvas.getBoundingClientRect();
    const button = window.__lionSunGame.soundButton;
    return { x: rect.left + button.x * rect.width / canvas.width, y: rect.top + button.y * rect.height / canvas.height, before: module.audio.enabled };
  });
  await desktop.page.mouse.click(soundControl.x, soundControl.y); await desktop.page.waitForTimeout(40);
  const desktopResult = await desktop.page.evaluate(async soundControlBefore => {
    const module = window.__lionSunModule; const game = window.__lionSunGame, canvas = document.querySelector("canvas");
    const toggled = module.audio.enabled !== soundControlBefore;
    const fits = [];
    const deadEnds = [];
    for (let i = 0; i < module.LEVELS.length; i++) {
      game.loadLevel(i);
      const right = game.boardOrigin.x + game.maze.width * game.tileSize;
      const bottom = game.boardOrigin.y + game.maze.height * game.tileSize;
      fits.push(game.boardOrigin.x >= 0 && game.boardOrigin.y >= 0 && right <= canvas.width && bottom <= canvas.height && game.panel.x >= right);
      const seen = new Set(), queue = [{ ...game.maze.playerSpawn }];
      while (queue.length) {
        const cell = queue.shift(), key = `${cell.x},${cell.y}`;
        if (seen.has(key)) continue; seen.add(key);
        for (const direction of [{x:0,y:-1},{x:0,y:1},{x:-1,y:0},{x:1,y:0}]) {
          const next = game.maze.neighbor(cell, direction);
          if (game.maze.passable(next.x, next.y, false) && !seen.has(`${next.x},${next.y}`)) queue.push(next);
        }
      }
      for (const key of seen) {
        const [x, y] = key.split(",").map(Number);
        const degree = game.maze.legalDirections({ x, y }, false).length;
        if (degree <= 1) deadEnds.push({ level: i + 1, x, y, degree });
      }
    }
    module.audio.toggle(); game.loadLevel(0);
    return {
      canvas: [document.querySelector("canvas").width, document.querySelector("canvas").height],
      landscape: document.querySelector("canvas").width > document.querySelector("canvas").height,
      sidePanel: game.panel.x > game.boardOrigin.x + game.maze.width * game.tileSize,
      headerAboveBoard: game.header.y + game.header.h <= game.boardOrigin.y,
      toggled,
      allLevelsFit: fits.every(Boolean),
      deadEnds,
      difficulty: game.difficulty,
      targetFps: module.TARGET_FPS,
      state: game.state,
      superBannerTimer: game.superBannerTimer,
      memorialTimer: game.javidPopupTimer
    };
  }, soundControl.before);
  await desktop.page.screenshot({ path: "canvas-desktop-stone.png", fullPage: true });

  const narrowWindows = await openGame(browser, { width: 500, height: 800 }, url, "desktop");
  const narrowWindowsResult = await narrowWindows.page.evaluate(() => {
    const canvas = document.querySelector("canvas"), game = window.__lionSunGame;
    return {
      canvas: [canvas.width, canvas.height],
      desktopClass: document.documentElement.classList.contains("desktop-device"),
      landscapeCanvas: canvas.width > canvas.height,
      sidePanel: game.panel.x > game.boardOrigin.x + game.maze.width * game.tileSize,
      desktopPoster: document.querySelector("#memorial-poster-image").currentSrc.includes("desktop-v12"),
      posterContained: getComputedStyle(document.querySelector("#memorial-poster-image")).objectFit === "contain"
    };
  });
  await narrowWindows.page.screenshot({ path: "poster-windows-narrow.png", fullPage: true });
  await narrowWindows.page.close();

  const direct = await openGame(browser, { width: 412, height: 915 }, pathToFileURL(path.join(__dirname, "index.html")).href);
  const directResult = await direct.page.evaluate(() => ({
    loaded: Boolean(window.__lionSunGame),
    loaderDone: document.querySelector("#loading").classList.contains("done"),
    protocol: location.protocol,
    posterVisible: !document.querySelector("#memorial-intro").hidden,
    bundledMemorials: window.__LION_SUN_MEMORIALS?.length || 0,
    targetFps: window.__lionSunModule.TARGET_FPS,
    sampleMemorial: window.__lionSunGame.nextMemorial()
  }));
  await direct.page.close();

  const errors = [...telegramShort.errors, ...mobile.errors, ...desktop.errors, ...narrowWindows.errors, ...direct.errors];
  console.log(JSON.stringify({ telegramShort: { poster: telegramPosterResult, start: telegramStartResult }, intro: introResult, mobile: mobileResult, desktop: desktopResult, narrowWindows: narrowWindowsResult, direct: directResult, errors }, null, 2));
  await browser.close(); if (!liveUrl) server.close();
  if (errors.length || !telegramPosterResult.artInsideViewport || !telegramPosterResult.artLoaded || !telegramPosterResult.fixedPoster || !telegramStartResult.cardInsideViewport || !telegramStartResult.buttonVisible || !introResult.posterVisible || !introResult.startHidden || !introResult.hintVisible || !introResult.verticalSwipesDisabled || !introResult.fullscreenRequested || !introResult.mobilePoster || !introResult.noForcedFocus || introResult.bundledMemorials < 100 || introResult.targetFps !== 30 || !directResult.loaded || !directResult.loaderDone || !directResult.posterVisible || directResult.bundledMemorials < 100 || directResult.sampleMemorial.includes("نام نامشخص") || directResult.sampleMemorial.includes("تاریخ نامشخص") || !mobileResult.memorialExact || !mobileResult.audioCreated || mobileResult.respawnMode !== "frightened" || mobileResult.difficulty !== "easy" || mobileResult.lives !== 5 || !mobileResult.oldEnglishTitleAbsent || !mobileResult.pelletRemoved || !mobileResult.powerRemoved || mobileResult.remainingPowerDraws !== 3 || mobileResult.memorialHeaderLabel !== "فرزند ایران و جانفدای میهن ،" || mobileResult.minimumHeaderGap < 1 || mobileResult.memorialNameSize < 15 || !mobileResult.memorialNameFont.includes("900") || mobileResult.movementCollectedPellets < 1 || mobileResult.stalePixels !== 0 || !desktopResult.sidePanel || !desktopResult.toggled || !desktopResult.allLevelsFit || desktopResult.deadEnds.length || desktopResult.difficulty !== "hard" || desktopResult.targetFps !== 60 || !narrowWindowsResult.desktopClass || !narrowWindowsResult.landscapeCanvas || !narrowWindowsResult.sidePanel || !narrowWindowsResult.desktopPoster || !narrowWindowsResult.posterContained) process.exitCode = 1;
})().catch(error => { console.error(error); if (!process.argv[2]) server.close(); process.exitCode = 1; });
