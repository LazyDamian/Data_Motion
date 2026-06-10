/* ═══════════════════════════════════════════════════════════════
   simulator.js  ·  Drohnen-Simulator (Game-Modus vs. Realitäts-Modus)
   Reparierte Version: sauberes Respawn-Handling, kein Freeze nach Schuss.
   ═══════════════════════════════════════════════════════════════ */

const CW = 900, CH = 540;

export function initSimulator() {
  const canvas = document.getElementById('terrainCanvas');
  if (!canvas) return;
  const ctx       = canvas.getContext('2d');
  const wrapper   = document.getElementById('simWrapper');
  const crosshair = document.getElementById('crosshair');

  canvas.width = CW;
  canvas.height = CH;

  /* ── State ── */
  let simMode   = 'game';
  let score     = 0;
  let strikes   = 0;
  let civHits   = 0;
  let mouseX    = CW / 2;
  let mouseY    = CH / 2;
  let speedMult = 1.0;
  let clockTick = 0;
  let entities  = [];
  let particles = [];
  let craters   = [];
  let running   = true;

  /* ── Terrain (offscreen, einmal gezeichnet) ── */
  const terrainOff = document.createElement('canvas');
  terrainOff.width = CW;
  terrainOff.height = CH;
  const tCtx = terrainOff.getContext('2d');
  drawTerrain(tCtx);

  /* ── Entity ── */
  function randomWP() {
    return { x: 40 + Math.random() * (CW - 80), y: 40 + Math.random() * (CH - 80) };
  }

  class Entity {
    constructor(type) {
      this.type = type;
      this.respawn();
    }
    respawn() {
      this.x = 40 + Math.random() * (CW - 80);
      this.y = 40 + Math.random() * (CH - 80);
      this.wp = randomWP();
      this.angle = Math.random() * Math.PI * 2;
      this.alive = true;
      this.isCivilian = Math.random() < 0.45;
      this.walkPhase = Math.random() * Math.PI * 2;
      this.respawnTimer = 0;
      if (this.type === 'person') {
        this.speed = 0.4 + Math.random() * 0.5;
        this.size = 5;
      } else {
        this.speed = 0.8 + Math.random() * 0.8;
        this.length = 18 + Math.random() * 8;
        this.width = 8 + Math.random() * 4;
      }
    }
    update(dt) {
      /* Toter Eintrag zählt Respawn-Timer herunter und kommt zurück */
      if (!this.alive) {
        this.respawnTimer -= dt;
        if (this.respawnTimer <= 0) this.respawn();
        return;
      }
      const spd = this.speed * speedMult * dt * 60;
      const dx = this.wp.x - this.x;
      const dy = this.wp.y - this.y;
      if (Math.hypot(dx, dy) < 8) {
        this.wp = randomWP();
      } else {
        let da = Math.atan2(dy, dx) - this.angle;
        while (da >  Math.PI) da -= Math.PI * 2;
        while (da < -Math.PI) da += Math.PI * 2;
        this.angle += da * 0.06;
        this.x += Math.cos(this.angle) * spd;
        this.y += Math.sin(this.angle) * spd;
      }
      if (this.type === 'person') this.walkPhase += 0.15 * speedMult;
      this.x = Math.max(20, Math.min(CW - 20, this.x));
      this.y = Math.max(20, Math.min(CH - 20, this.y));
    }
    draw(c) {
      if (!this.alive) return;
      c.save();
      c.translate(this.x, this.y);
      c.rotate(this.angle + Math.PI / 2);
      this.type === 'person' ? this._person(c) : this._vehicle(c);
      c.restore();
      this._label(c);
      if (Math.hypot(mouseX - this.x, mouseY - this.y) < 40) this._lockOn(c);
    }
    _person(c) {
      const isGame = simMode === 'game';
      const col = isGame ? (this.isCivilian ? '#c4a35a' : '#e8c97a')
                         : (this.isCivilian ? '#ff9999' : '#ff4444');
      c.fillStyle = 'rgba(0,0,0,0.4)';
      c.beginPath(); c.ellipse(2, 2, 3, 2, 0, 0, Math.PI * 2); c.fill();
      const leg = Math.sin(this.walkPhase) * 2.5;
      c.fillStyle = col;
      c.fillRect(-1.5, 2, 1.5, 4 + leg);
      c.fillRect(0.5, 2, 1.5, 4 - leg);
      c.fillRect(-2.5, -3, 5, 6);
      c.beginPath(); c.arc(0, -5, 2.5, 0, Math.PI * 2); c.fill();
      const arm = Math.sin(this.walkPhase) * 1.5;
      c.fillRect(-4, -2 + arm, 1.5, 4);
      c.fillRect(2.5, -2 - arm, 1.5, 4);
      if (!this.isCivilian) {
        c.fillStyle = isGame ? '#a08030' : '#cc2222';
        c.beginPath(); c.arc(0, -5.5, 3, Math.PI, 0); c.fill();
      }
    }
    _vehicle(c) {
      const isGame = simMode === 'game';
      const col = isGame ? (this.isCivilian ? '#8b6914' : '#c4a35a')
                         : (this.isCivilian ? '#cc8844' : '#ef4444');
      const L = this.length / 2, W2 = this.width / 2;
      c.fillStyle = 'rgba(0,0,0,0.4)';
      c.beginPath(); c.ellipse(3, 3, L * 0.9, W2 * 0.7, 0, 0, Math.PI * 2); c.fill();
      c.fillStyle = col;
      c.beginPath(); c.roundRect(-L, -W2, this.length, this.width, 3); c.fill();
      c.fillStyle = isGame ? (this.isCivilian ? '#7a5a10' : '#a08030') : (this.isCivilian ? '#aa6622' : '#cc2222');
      c.beginPath(); c.roundRect(-L * 0.3, -W2 * 0.8, L * 0.8, this.width * 0.7, 2); c.fill();
      c.fillStyle = '#1a1008';
      [[-L * 0.6, -W2], [-L * 0.6, W2], [L * 0.4, -W2], [L * 0.4, W2]].forEach(([wx, wy]) => {
        c.beginPath(); c.arc(wx, wy, 2.5, 0, Math.PI * 2); c.fill();
      });
    }
    _label(c) {
      if (Math.hypot(mouseX - this.x, mouseY - this.y) > 80) return;
      const isGame = simMode === 'game';
      c.save();
      c.font = '9px "Courier New", monospace';
      c.textAlign = 'center';
      const label = isGame
        ? (this.type === 'vehicle' ? 'TGT +300' : 'TGT +500')
        : (this.isCivilian ? (this.type === 'vehicle' ? 'ZIVILFAHRZEUG' : 'ZIVILIST')
                           : (this.type === 'vehicle' ? 'MILITÄRFZG' : 'KOMBATTANT'));
      const col = isGame ? '#e8c97a' : (this.isCivilian ? '#ff9999' : '#ff4444');
      const w = c.measureText(label).width + 8;
      c.fillStyle = 'rgba(0,0,0,0.6)';
      c.fillRect(this.x - w / 2, this.y - 24, w, 12);
      c.fillStyle = col;
      c.fillText(label, this.x, this.y - 14);
      c.restore();
    }
    _lockOn(c) {
      const col = simMode === 'game' ? 'rgba(232,201,122,0.8)' : 'rgba(239,68,68,0.8)';
      const r = this.type === 'vehicle' ? 20 : 14;
      c.save();
      c.strokeStyle = col; c.lineWidth = 1;
      const br = 5;
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => {
        c.beginPath();
        c.moveTo(this.x + sx * (r - br), this.y + sy * r);
        c.lineTo(this.x + sx * r, this.y + sy * r);
        c.lineTo(this.x + sx * r, this.y + sy * (r - br));
        c.stroke();
      });
      const pulse = 0.7 + 0.3 * Math.sin(Date.now() * 0.008);
      c.globalAlpha = pulse;
      c.beginPath(); c.arc(this.x, this.y, r + 4, 0, Math.PI * 2); c.stroke();
      c.restore();
    }
  }

  function spawnEntities() {
    entities = [];
    for (let i = 0; i < 8; i++) entities.push(new Entity('person'));
    for (let i = 0; i < 5; i++) entities.push(new Entity('vehicle'));
  }
  spawnEntities();

  function spawnExplosion(x, y) {
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      const spd = 1.5 + Math.random() * 3;
      particles.push({
        x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
        life: 1.0, size: 2 + Math.random() * 3,
        color: simMode === 'game' ? `hsl(${30 + Math.random() * 30},90%,60%)`
                                   : `hsl(${Math.random() * 20},90%,55%)`,
      });
    }
    craters.push({ x, y, r: 8 + Math.random() * 6, life: 1.0 });
  }

  function showScorePopup(x, y, text, isReal) {
    const rect = wrapper.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'score-popup' + (isReal ? ' real-popup' : '');
    el.textContent = text;
    el.style.left = (rect.left + (x / CW) * rect.width - 20) + 'px';
    el.style.top  = (rect.top + (y / CH) * rect.height - 10 + window.scrollY) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }

  /* ── Klick: nur das NÄCHSTE Ziel treffen (fixt Mehrfachtreffer/Freeze) ── */
  wrapper.addEventListener('click', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (CW / rect.width);
    const cy = (e.clientY - rect.top)  * (CH / rect.height);

    let best = null, bestDist = Infinity;
    entities.forEach((ent) => {
      if (!ent.alive) return;
      const radius = ent.type === 'vehicle' ? 18 : 12;
      const d = Math.hypot(cx - ent.x, cy - ent.y);
      if (d < radius && d < bestDist) { best = ent; bestDist = d; }
    });

    if (!best) {
      craters.push({ x: cx, y: cy, r: 3, life: 0.5 });
      return;
    }

    /* Treffer: Entity markieren und Respawn-Timer setzen (kein Array-Tausch) */
    best.alive = false;
    best.respawnTimer = 2.0;       /* kommt nach 2 s zurück */
    spawnExplosion(best.x, best.y);
    strikes++;

    if (simMode === 'game') {
      const pts = best.type === 'vehicle' ? 300 : 500;
      score += pts;
      showScorePopup(best.x, best.y, `+${pts} PTS`, false);
      setStatus(`> STRIKE CONFIRMED - +${pts} PTS`);
    } else {
      if (best.isCivilian) {
        civHits++;
        showScorePopup(best.x, best.y, '\u26A0 ZIVILIST', true);
        setStatus(best.type === 'vehicle' ? '> \u26A0 ZIVILFAHRZEUG ZERSTÖRT'
                                          : '> \u26A0 ZIVILIST GETROFFEN - INCIDENT LOGGED');
      } else {
        showScorePopup(best.x, best.y, '\u2713 NEUTRALISIERT', true);
        setStatus('> TARGET NEUTRALIZED');
      }
    }
    updateHUD();
  });

  /* ── Maus ── */
  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) * (CW / rect.width);
    mouseY = (e.clientY - rect.top)  * (CH / rect.height);
    crosshair.style.left = (e.clientX - rect.left) + 'px';
    crosshair.style.top  = (e.clientY - rect.top) + 'px';
  });
  wrapper.addEventListener('mouseleave', () => { crosshair.style.opacity = '0'; });
  wrapper.addEventListener('mouseenter', () => { crosshair.style.opacity = '1'; });

  /* ── HUD ── */
  function setStatus(msg) {
    const el = document.getElementById('hudStatus');
    if (el) el.textContent = msg;
  }
  function setText(id, txt) {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  }
  function updateHUD() {
    const active = entities.filter(e => e.alive).length;
    setText('hudScore', `SCORE: ${score.toLocaleString('de-DE')}`);
    setText('hudStrikes', `STRIKES: ${strikes} | ACTIVE: ${active}`);
    setText('statScore', score.toLocaleString('de-DE'));
    setText('statStrikes', strikes);
    setText('statCivs', civHits);
    setText('statActive', active);
  }
  function updateCoords() {
    clockTick++;
    const sec = Math.floor(clockTick / 60);
    const h = String(Math.floor(sec / 3600) % 24).padStart(2, '0');
    const m = String(Math.floor(sec / 60) % 60).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    setText('hudTime', `LOCAL: ${h}:${m}:${s}Z`);
    setText('hudCoords', `${(33.4 + (mouseY / CH) * 0.4).toFixed(4)}°N / ${(44.3 + (mouseX / CW) * 0.4).toFixed(4)}°E`);
  }

  /* ── Hauptschleife (robust gegen Fehler) ── */
  let lastTime = 0;
  function loop(ts) {
    if (!running) return;
    const dt = Math.min((ts - lastTime) / 1000, 0.05);
    lastTime = ts;

    try {
      ctx.drawImage(terrainOff, 0, 0);

      craters.forEach(c => {
        ctx.save();
        ctx.globalAlpha = c.life * 0.8;
        ctx.fillStyle = '#1a0e00';
        ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        c.life -= dt * 0.08;
      });
      craters = craters.filter(c => c.life > 0);

      entities.forEach(e => { e.update(dt); e.draw(ctx); });

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.92; p.vy *= 0.92;
        p.life -= dt * 2.5;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0, p.size * p.life), 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
      particles = particles.filter(p => p.life > 0);

      const chCol = simMode === 'game' ? '#e8c97a' : '#ff4444';
      crosshair.querySelectorAll('[stroke]').forEach(el => {
        if (el.getAttribute('stroke') !== 'none') el.setAttribute('stroke', chCol);
      });
      crosshair.querySelectorAll('[fill]').forEach(el => {
        const f = el.getAttribute('fill');
        if (f && f !== 'none') el.setAttribute('fill', chCol);
      });

      updateCoords();
      updateHUD();
    } catch (err) {
      /* Falls doch ein Fehler auftritt: nicht stehenbleiben, weiterlaufen */
      console.error('Sim-Loop Fehler:', err);
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* Loop nur laufen lassen, wenn der Simulator sichtbar ist (Performance) */
  const visIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting && !running) {
        running = true;
        lastTime = performance.now();
        requestAnimationFrame(loop);
      } else if (!en.isIntersecting) {
        running = false;
      }
    });
  }, { threshold: 0.05 });
  visIO.observe(wrapper);

  /* ── Modus-Umschaltung ── */
  document.querySelectorAll('.sim-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sim-mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      simMode = btn.getAttribute('data-mode');
      wrapper.classList.toggle('mode-real', simMode === 'real');
      wrapper.classList.toggle('mode-game', simMode === 'game');

      const infobox = document.getElementById('simInfobox');
      if (simMode === 'game') {
        setText('hudTitle', '\u25B6 TACTICAL STRIKE SIM v2.4');
        infobox.className = 'sim-infobox mode-game';
        infobox.innerHTML = '\u25B6 &nbsp;<strong>GAME-MODUS:</strong> Klicke auf bewegliche Ziele. Fahrzeuge = +300 Pts, Personen = +500 Pts. Maximiere deinen Score.';
        setStatus('> AWAITING TARGET SELECTION...');
      } else {
        setText('hudTitle', '\u26A0 LIVE OPERATION - WEAPON HOT');
        infobox.className = 'sim-infobox mode-real';
        infobox.innerHTML = '\u26A0 &nbsp;<strong>REALITÄTS-MODUS:</strong> Dieselbe Karte, dieselben Ziele. Aber wer ist wirklich Kombattant und wer Zivilist?';
        setStatus('> LIVE FEED ACTIVE. PROCEED WITH CAUTION.');
      }
      resetSim();
    });
  });

  /* ── Speed-Slider ── */
  const speedSlider = document.getElementById('speedSlider');
  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      speedMult = parseFloat(e.target.value);
      setText('speedVal', speedMult.toFixed(1) + '\u00D7');
    });
  }

  /* ── Reset ── */
  function resetSim() {
    spawnEntities();
    score = 0; strikes = 0; civHits = 0;
    craters = []; particles = [];
    updateHUD();
    setStatus(simMode === 'game' ? '> AWAITING TARGET SELECTION...'
                                 : '> LIVE FEED ACTIVE. PROCEED WITH CAUTION.');
  }
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) resetBtn.addEventListener('click', resetSim);
}

/* ─── Terrain-Zeichnung (einmalig) ─── */
function drawTerrain(tCtx) {
  const base = tCtx.createLinearGradient(0, 0, CW, CH);
  base.addColorStop(0, '#2e2010');
  base.addColorStop(0.4, '#4a3520');
  base.addColorStop(0.7, '#3d2e1a');
  base.addColorStop(1, '#2a1c0c');
  tCtx.fillStyle = base;
  tCtx.fillRect(0, 0, CW, CH);

  const patches = [
    { x: 0.15, y: 0.25, rx: 180, ry: 110, c: 'rgba(74,53,32,0.7)' },
    { x: 0.70, y: 0.18, rx: 130, ry: 160, c: 'rgba(61,46,26,0.6)' },
    { x: 0.55, y: 0.68, rx: 160, ry: 100, c: 'rgba(92,68,37,0.5)' },
    { x: 0.85, y: 0.78, rx: 100, ry: 140, c: 'rgba(58,42,20,0.6)' },
    { x: 0.08, y: 0.78, rx: 160, ry: 80,  c: 'rgba(79,59,34,0.5)' },
    { x: 0.40, y: 0.42, rx: 220, ry: 80,  c: 'rgba(50,36,16,0.4)' },
    { x: 0.90, y: 0.40, rx: 80,  ry: 120, c: 'rgba(70,50,28,0.5)' },
  ];
  patches.forEach(p => {
    const g = tCtx.createRadialGradient(p.x * CW, p.y * CH, 0, p.x * CW, p.y * CH, Math.max(p.rx, p.ry));
    g.addColorStop(0, p.c);
    g.addColorStop(1, 'transparent');
    tCtx.save();
    tCtx.scale(1, p.ry / p.rx);
    tCtx.fillStyle = g;
    tCtx.beginPath();
    tCtx.arc(p.x * CW, p.y * CH * (p.rx / p.ry), p.rx, 0, Math.PI * 2);
    tCtx.fill();
    tCtx.restore();
  });

  tCtx.strokeStyle = 'rgba(90,65,30,0.55)';
  tCtx.lineWidth = 5;
  tCtx.beginPath();
  tCtx.moveTo(0, CH * 0.48);
  tCtx.bezierCurveTo(CW * 0.25, CH * 0.46, CW * 0.6, CH * 0.52, CW, CH * 0.50);
  tCtx.stroke();
  tCtx.lineWidth = 3;
  tCtx.beginPath();
  tCtx.moveTo(CW * 0.3, 0);
  tCtx.bezierCurveTo(CW * 0.35, CH * 0.3, CW * 0.45, CH * 0.6, CW * 0.5, CH);
  tCtx.stroke();

  const buildings = [
    { x: 120, y: 80, w: 28, h: 20 }, { x: 155, y: 75, w: 18, h: 28 }, { x: 130, y: 108, w: 22, h: 16 },
    { x: 600, y: 380, w: 32, h: 24 }, { x: 640, y: 370, w: 20, h: 30 }, { x: 620, y: 408, w: 26, h: 18 },
    { x: 750, y: 120, w: 24, h: 20 }, { x: 780, y: 115, w: 18, h: 26 },
    { x: 300, y: 280, w: 30, h: 22 }, { x: 335, y: 275, w: 20, h: 18 }, { x: 310, y: 305, w: 24, h: 16 },
    { x: 820, y: 430, w: 28, h: 20 }, { x: 850, y: 425, w: 16, h: 24 },
  ];
  buildings.forEach(b => {
    tCtx.fillStyle = 'rgba(0,0,0,0.35)';
    tCtx.fillRect(b.x + 4, b.y + 4, b.w, b.h);
    tCtx.fillStyle = '#6b4f2e';
    tCtx.fillRect(b.x, b.y, b.w, b.h);
    tCtx.fillStyle = '#7a5a34';
    tCtx.fillRect(b.x + 2, b.y + 2, b.w - 4, b.h - 4);
  });

  tCtx.fillStyle = 'rgba(0,0,0,0.15)';
  for (let i = 0; i < 300; i++) {
    tCtx.beginPath();
    tCtx.arc(Math.random() * CW, Math.random() * CH, Math.random() * 2 + 0.5, 0, Math.PI * 2);
    tCtx.fill();
  }
}