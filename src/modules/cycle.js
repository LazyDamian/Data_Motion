import gsap from 'gsap';
import { cyclePhases, events } from '../data.js';

export function initCycle() {
  const mount = document.getElementById('cycle-mount');
  const panel = document.getElementById('cycle-panel');
  if (!mount) return;

  const size = 480, c = size / 2, r = 165;
  const NS = 'http://www.w3.org/2000/svg';

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('class', 'cycle-svg');

  /* Leitkreis */
  const ring = document.createElementNS(NS, 'circle');
  ring.setAttribute('cx', c); ring.setAttribute('cy', c); ring.setAttribute('r', r);
  ring.setAttribute('class', 'cycle-ring');
  svg.appendChild(ring);

  /* Pfeil-Marker definieren */
  const defs = document.createElementNS(NS, 'defs');
  const marker = document.createElementNS(NS, 'marker');
  marker.setAttribute('id', 'cycle-arrow');
  marker.setAttribute('viewBox', '0 0 10 10');
  marker.setAttribute('refX', '6');
  marker.setAttribute('refY', '5');
  marker.setAttribute('markerWidth', '8');
  marker.setAttribute('markerHeight', '8');
  marker.setAttribute('orient', 'auto-start-reverse');
  const arrowPath = document.createElementNS(NS, 'path');
  arrowPath.setAttribute('d', 'M0,0 L10,5 L0,10 z');
  arrowPath.setAttribute('class', 'cycle-arrow-head');
  marker.appendChild(arrowPath);
  defs.appendChild(marker);
  svg.appendChild(defs);

  /* Gekrümmte Bögen zwischen den vier Knoten (im Uhrzeigersinn) */
  const angles = [-90, 0, 90, 180];
  const nodeR = 40;
  const gap   = 8;       /* Abstand zwischen Pfeilende und Knotenrand */
  const arcs = [];
  for (let i = 0; i < 4; i++) {
    const a1 = (angles[i] * Math.PI) / 180;
    const a2 = (angles[(i + 1) % 4] * Math.PI) / 180;
    /* Winkelversatz, damit der Pfeil neben dem Knotenrand startet/endet */
    const off = (nodeR + gap) / r;
    const sx = c + r * Math.cos(a1 + off);
    const sy = c + r * Math.sin(a1 + off);
    const ex = c + r * Math.cos(a2 - off);
    const ey = c + r * Math.sin(a2 - off);

    const arc = document.createElementNS(NS, 'path');
    /* Kreisbogen entlang des großen Rings (radius=r, sweep=1 für Uhrzeigersinn) */
    arc.setAttribute('d', `M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`);
    arc.setAttribute('class', 'cycle-arc');
    arc.setAttribute('marker-end', 'url(#cycle-arrow)');
    svg.appendChild(arc);
    arcs.push(arc);
  }

  /* Fließende Energie-Punkte entlang der Bögen */
  arcs.forEach((arc, i) => {
    const len = arc.getTotalLength();
    const pulse = document.createElementNS(NS, 'circle');
    pulse.setAttribute('r', 3.5);
    pulse.setAttribute('class', 'cycle-pulse');
    svg.appendChild(pulse);

    gsap.to({ t: 0 }, {
      t: 1,
      duration: 2,
      repeat: -1,
      delay: i * 0.5,
      ease: 'none',
      onUpdate() {
        const pt = arc.getPointAtLength(this.targets()[0].t * len);
        pulse.setAttribute('cx', pt.x);
        pulse.setAttribute('cy', pt.y);
      },
    });
  });

  /* Knoten oben, rechts, unten, links */
  const nodes = [];
  cyclePhases.forEach((phase, i) => {
    const a = (angles[i] * Math.PI) / 180;
    const x = c + r * Math.cos(a);
    const y = c + r * Math.sin(a);

    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'cycle-node');
    g.setAttribute('data-i', i);
    g.style.cursor = 'pointer';

    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('cx', x); dot.setAttribute('cy', y);
    dot.setAttribute('r', 40);
    dot.setAttribute('class', phase.key === 'kein' ? 'node-dot node-dot-end' : 'node-dot');

    const label = document.createElementNS(NS, 'text');
    label.setAttribute('x', x); label.setAttribute('y', y + 5);
    label.setAttribute('class', 'node-label');
    label.setAttribute('text-anchor', 'middle');
    /* mehrzeilig: einfacher Umbruch per tspan bei Bedarf */
    const words = phase.label.split(' ');
    if (words.length > 1) {
      label.setAttribute('y', y - 3);
      words.forEach((w, k) => {
        const ts = document.createElementNS(NS, 'tspan');
        ts.setAttribute('x', x); ts.setAttribute('dy', k === 0 ? 0 : 16);
        ts.textContent = w;
        label.appendChild(ts);
      });
    } else {
      label.textContent = phase.label;
    }

    g.appendChild(dot); g.appendChild(label);
    g.addEventListener('click', () => selectPhase(i));
    svg.appendChild(g);
    nodes.push({ g, dot, x, y });
  });

  /* Zentrum: Refresh-/Schleifen-Symbol */
  const centerSymbol = document.createElementNS(NS, 'path');
  /* zwei halbkreisförmige Pfeile, die einen Kreislauf andeuten */
  centerSymbol.setAttribute('d',
    `M ${c - 16} ${c} A 16 16 0 0 1 ${c + 16} ${c} M ${c + 13} ${c - 5} L ${c + 16} ${c} L ${c + 19} ${c - 5} ` +
    `M ${c + 16} ${c} A 16 16 0 0 1 ${c - 16} ${c} M ${c - 13} ${c + 5} L ${c - 16} ${c} L ${c - 19} ${c + 5}`);
  centerSymbol.setAttribute('class', 'cycle-center-symbol');
  svg.appendChild(centerSymbol);

  /* Zentraltext darunter */
  const center = document.createElementNS(NS, 'text');
  center.setAttribute('x', c); center.setAttribute('y', c + 36);
  center.setAttribute('text-anchor', 'middle');
  center.setAttribute('class', 'cycle-center');
  center.textContent = 'Endlosschleife';
  svg.appendChild(center);

  mount.appendChild(svg);

  /* Sanftes Pulsieren des Zentralsymbols */
  gsap.to(centerSymbol, {
    opacity: 0.3,
    duration: 1.6,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  function selectPhase(i) {
    nodes.forEach((n, k) => n.g.classList.toggle('active', k === i));
    const phase = cyclePhases[i];
    const ev = events[i];
    panel.innerHTML = `
      <div class="cycle-panel-phase">${phase.label}</div>
      <p class="cycle-panel-desc">${phase.desc}</p>
      ${ev ? `<div class="cycle-panel-event"><span class="cycle-panel-year">${ev.year} · ${ev.title}</span>${ev.text}</div>` : ''}
    `;
    gsap.fromTo(panel, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
  }

  /* Start mit erster Phase */
  selectPhase(0);
}