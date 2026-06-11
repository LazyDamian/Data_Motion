import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { years, pksTsd, marktMio, eventYears, cyclePhases } from '../data.js';

/* Flache Lookup-Liste aller historischen Beispiele aus dem Kreislauf,
   für die Event-Markierung im Paradox-Diagramm (Jahr -> Titel). */
const eventLookup = cyclePhases.flatMap(p => p.examples || []);

gsap.registerPlugin(ScrollTrigger);

export function initParadox() {
  const mount = document.getElementById('paradox-mount');
  const steps = document.querySelectorAll('#paradox-steps .scrolly-step');
  if (!mount) return;

  const NS = 'http://www.w3.org/2000/svg';
  const W = 800, H = 500;
  const pad = { l: 60, r: 65, t: 55, b: 55 };
  const plotW = W - pad.l - pad.r;
  const plotH = H - pad.t - pad.b;

  const n = years.length;
  const xAt = i => pad.l + (i / (n - 1)) * plotW;

  /* getrennte Skalen, angepasst an neue Daten (TVBZ 2007-2019, Umsatz in Mio. €) */
  const pksMin = 400,  pksMax = 1350;
  const mktMin = 1300, mktMax = 6500;
  const yPks = v => pad.t + plotH - ((v - pksMin) / (pksMax - pksMin)) * plotH;
  const yMkt = v => pad.t + plotH - ((v - mktMin) / (mktMax - mktMin)) * plotH;

  const ptsPks = pksTsd.map((v, i) => [xAt(i), yPks(v)]);
  const ptsMkt = marktMio.map((v, i) => [xAt(i), yMkt(v)]);
  const toPath = pts => 'M' + pts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L');

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('class', 'paradox-svg');

  /* Gitterlinien + Jahres-Achse */
  const grid = document.createElementNS(NS, 'g');
  [0, 0.25, 0.5, 0.75, 1].forEach(t => {
    const y = pad.t + plotH * t;
    const l = document.createElementNS(NS, 'line');
    l.setAttribute('x1', pad.l); l.setAttribute('x2', W - pad.r);
    l.setAttribute('y1', y); l.setAttribute('y2', y);
    l.setAttribute('class', 'paradox-grid');
    grid.appendChild(l);
  });
  [0, 3, 6, 9, 12].forEach(i => {
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', xAt(i)); t.setAttribute('y', H - pad.b + 26);
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('class', 'paradox-axis');
    t.textContent = years[i];
    grid.appendChild(t);
  });
  svg.appendChild(grid);

  /* Achsentitel */
  const axL = document.createElementNS(NS, 'text');
  axL.setAttribute('x', pad.l - 6); axL.setAttribute('y', pad.t - 22);
  axL.setAttribute('class', 'paradox-axis-title'); axL.setAttribute('fill', '#ef4444');
  axL.textContent = 'Gewalt-TVBZ (je 100.000 Jugendliche)';
  svg.appendChild(axL);
  const axR = document.createElementNS(NS, 'text');
  axR.setAttribute('x', W - pad.r + 6); axR.setAttribute('y', pad.t - 22);
  axR.setAttribute('text-anchor', 'end');
  axR.setAttribute('class', 'paradox-axis-title'); axR.setAttribute('fill', '#3b82f6');
  axR.textContent = 'Markt (Mio. €)';
  svg.appendChild(axR);

  /* Markt-Fläche (für sanften Look) */
  const areaPath = toPath(ptsMkt) + ` L${ptsMkt[n-1][0]},${pad.t+plotH} L${ptsMkt[0][0]},${pad.t+plotH} Z`;
  const area = document.createElementNS(NS, 'path');
  area.setAttribute('d', areaPath);
  area.setAttribute('class', 'paradox-area');
  area.style.opacity = 0;
  svg.appendChild(area);

  /* Linien */
  const linePks = document.createElementNS(NS, 'path');
  linePks.setAttribute('d', toPath(ptsPks));
  linePks.setAttribute('class', 'paradox-line line-pks');
  const lenPks = 0;
  svg.appendChild(linePks);

  const lineMkt = document.createElementNS(NS, 'path');
  lineMkt.setAttribute('d', toPath(ptsMkt));
  lineMkt.setAttribute('class', 'paradox-line line-mkt');
  svg.appendChild(lineMkt);

  /* Ereignis-Marker */
  const markers = [];
  eventYears.forEach(yr => {
    const i = years.indexOf(yr);
    if (i < 0) return;
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'paradox-marker');
    g.style.opacity = 0;
    const ring = document.createElementNS(NS, 'circle');
    ring.setAttribute('cx', xAt(i)); ring.setAttribute('cy', yPks(pksTsd[i]));
    ring.setAttribute('r', 8); ring.setAttribute('class', 'marker-ring');
    const lab = document.createElementNS(NS, 'text');
    lab.setAttribute('x', xAt(i)); lab.setAttribute('y', yPks(pksTsd[i]) - 20);
    lab.setAttribute('text-anchor', 'middle'); lab.setAttribute('class', 'marker-label');
    lab.textContent = yr;
    g.appendChild(ring); g.appendChild(lab);
    svg.appendChild(g);
    markers.push(g);
  });

  /* Hover-Lesegerät */
  const guide = document.createElementNS(NS, 'line');
  guide.setAttribute('class', 'paradox-guide');
  guide.setAttribute('y1', pad.t); guide.setAttribute('y2', pad.t + plotH);
  guide.style.opacity = 0;
  svg.appendChild(guide);
  const dotPks = document.createElementNS(NS, 'circle');
  dotPks.setAttribute('r', 7); dotPks.setAttribute('class', 'guide-dot dot-pks'); dotPks.style.opacity = 0;
  const dotMkt = document.createElementNS(NS, 'circle');
  dotMkt.setAttribute('r', 7); dotMkt.setAttribute('class', 'guide-dot dot-mkt'); dotMkt.style.opacity = 0;
  svg.appendChild(dotPks); svg.appendChild(dotMkt);

  mount.appendChild(svg);

  /* Tooltip */
  const tip = document.createElement('div');
  tip.className = 'paradox-tip';
  tip.style.opacity = 0;
  mount.appendChild(tip);

  /* ─── Linien für Scroll-Zeichnung vorbereiten ─── */
  const LP = linePks.getTotalLength();
  const LM = lineMkt.getTotalLength();
  linePks.style.strokeDasharray  = LP; linePks.style.strokeDashoffset = LP;
  lineMkt.style.strokeDasharray  = LM; lineMkt.style.strokeDashoffset = LM;

  /* Scroll-Steuerung: zeichnet beide Linien, blendet Marker ein */
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#paradox-steps',
      start: 'top center',
      end: 'bottom bottom',
      scrub: 0.6,
    },
  });
  tl.to(linePks, { strokeDashoffset: 0, ease: 'none', duration: 1.2 })
    .to(area,    { opacity: 1, ease: 'none', duration: 0.6 }, '<0.3')
    .to(lineMkt, { strokeDashoffset: 0, ease: 'none', duration: 1.2 }, '>-0.3')
    .to(markers, { opacity: 1, stagger: 0.15, ease: 'power1.out', duration: 0.5 }, '>-0.2');

  /* Schritt-Texte aktivieren */
  steps.forEach(step => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top center',
      end: 'bottom center',
      onToggle: self => step.classList.toggle('is-active', self.isActive),
    });
  });

  /* ─── Hover-Interaktion ─── */
  function showAt(clientX) {
    const rect = svg.getBoundingClientRect();
    const xRel = ((clientX - rect.left) / rect.width) * W;
    let i = Math.round(((xRel - pad.l) / plotW) * (n - 1));
    i = Math.max(0, Math.min(n - 1, i));

    const gx = xAt(i);
    guide.setAttribute('x1', gx); guide.setAttribute('x2', gx);
    dotPks.setAttribute('cx', gx); dotPks.setAttribute('cy', yPks(pksTsd[i]));
    dotMkt.setAttribute('cx', gx); dotMkt.setAttribute('cy', yMkt(marktMio[i]));
    guide.style.opacity = 1; dotPks.style.opacity = 1; dotMkt.style.opacity = 1;

    const ev = eventLookup.find(e => e.year === years[i]);
    tip.innerHTML = `
      <div class="tip-year">${years[i]}</div>
      <div class="tip-row"><span class="tip-dot dot-pks"></span>${pksTsd[i]} TVBZ Jugendgewalt</div>
      <div class="tip-row"><span class="tip-dot dot-mkt"></span>${marktMio[i].toLocaleString('de-DE')} Mio. € Marktumsatz</div>
      ${ev ? `<div class="tip-event">⚑ ${ev.title}</div>` : ''}
    `;
    const leftPct = (gx / W) * 100;
    tip.style.left = `${leftPct}%`;
    tip.style.opacity = 1;
  }
  function hideHover() {
    guide.style.opacity = 0; dotPks.style.opacity = 0; dotMkt.style.opacity = 0;
    tip.style.opacity = 0;
  }
  svg.addEventListener('mousemove', e => showAt(e.clientX));
  svg.addEventListener('mouseleave', hideHover);
  svg.addEventListener('touchmove', e => {
    if (e.touches[0]) showAt(e.touches[0].clientX);
  }, { passive: true });
}