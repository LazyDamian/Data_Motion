import Chart from 'chart.js/auto';
import { researchBoys, researchGirls } from '../data.js';

/* einfache lineare Regression für eine Trendlinie */
function regression(points) {
  const n = points.length;
  const sx = points.reduce((s, p) => s + p.x, 0);
  const sy = points.reduce((s, p) => s + p.y, 0);
  const sxy = points.reduce((s, p) => s + p.x * p.y, 0);
  const sxx = points.reduce((s, p) => s + p.x * p.x, 0);
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;
  const xs = points.map(p => p.x);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  return [{ x: x0, y: slope * x0 + intercept }, { x: x1, y: slope * x1 + intercept }];
}

/* Plugin: zeichnet ausgewählte Datasets (per Index) nur innerhalb einer
   Clip-Box, deren Breite animierbar ist. Damit lässt sich eine Linie von
   links nach rechts "selbst zeichnen", ähnlich dem SVG-Trick beim
   Paradox-Graph, nur eben für ein Canvas-basiertes Chart.js-Diagramm. */
const lineDrawClipPlugin = {
  id: 'lineDrawClip',
  beforeDatasetDraw(chart, args) {
    const clip = chart.$lineClip;
    if (!clip || !clip.dsIndices.includes(args.index)) return;
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.beginPath();
    ctx.rect(chartArea.left, chartArea.top - 20, clip.width, chartArea.height + 40);
    ctx.clip();
  },
  afterDatasetDraw(chart, args) {
    const clip = chart.$lineClip;
    if (!clip || !clip.dsIndices.includes(args.index)) return;
    chart.ctx.restore();
  },
};

/* Lässt eine oder mehrere Trendlinien von links nach rechts "wachsen".
   dsIndices: die Dataset-Indizes der betroffenen Linien. */
function animateLinesDraw(chart, dsIndices, duration = 700) {
  dsIndices.forEach(i => chart.setDatasetVisibility(i, true));
  chart.$lineClip = { dsIndices, width: 0 };
  const start = performance.now();

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    chart.$lineClip.width = chart.chartArea.width * easeOutCubic(t);
    chart.draw();
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      chart.$lineClip = null;   /* Clip entfernen, danach ganz normal weiterzeichnen */
      chart.draw();
    }
  }
  requestAnimationFrame(frame);
}

export function initResearch(canvasId) {
  const ctx = document.getElementById(canvasId).getContext('2d');

  /* Chart.js' eigene Init-Animation läuft sofort beim Erstellen ab, egal ob
     der Container zu dem Zeitpunkt sichtbar ist. Läuft initResearch() also
     erst nach dem Scrollen ins Bild, ist sie oft schon vorbei, bevor man
     hinschaut, oder wirkt bei falsch berechneter Canvas-Größe unsauber.
     Deshalb starten die Punkte hier mit Radius 0 (unsichtbar), die
     Trendlinien sind zu Beginn ausgeblendet. Die eigentliche, garantiert
     sichtbare Animation übernimmt danach animateGroupIn() / animateLinesDraw()
     manuell. */
  const chart = new Chart(ctx, {
    type: 'scatter',
    plugins: [lineDrawClipPlugin],
    data: {
      datasets: [
        { label: 'Jungen', data: researchBoys, backgroundColor: 'rgba(59,130,246,0.65)',
          borderColor: '#3b82f6', borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 14 },
        { label: 'Trend Jungen', data: regression(researchBoys), type: 'line',
          borderColor: 'rgba(59,130,246,0.6)', borderWidth: 2.5, borderDash: [6, 4],
          pointRadius: 0, fill: false, tension: 0, hidden: true },
        { label: 'Mädchen', data: researchGirls, backgroundColor: 'rgba(212,83,126,0.65)',
          borderColor: '#d4537e', borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 14 },
        { label: 'Trend Mädchen', data: regression(researchGirls), type: 'line',
          borderColor: 'rgba(212,83,126,0.6)', borderWidth: 2.5, borderDash: [6, 4],
          pointRadius: 0, fill: false, tension: 0, hidden: true },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(10,12,26,0.96)', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1,
          titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 12,
          filter: item => !item.dataset.label.startsWith('Trend'),
          callbacks: { label: c => `${c.dataset.label}: ${c.raw.x} h/Tag, Ø Note ${c.raw.y.toFixed(1)}` },
        },
      },
      scales: {
        x: { title: { display: true, text: 'Tägliche Spielzeit (Stunden)', color: '#94a3b8', font: { size: 14 } },
             min: -0.3, max: 7, ticks: { color: '#94a3b8', font: { size: 12 } },
             grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { title: { display: true, text: 'Ø Schulnote', color: '#94a3b8', font: { size: 14 } },
             min: 1.8, max: 3.7, ticks: { color: '#94a3b8', callback: v => v.toFixed(1), font: { size: 12 } },
             grid: { color: 'rgba(255,255,255,0.04)' } },
      },
    },
  });

  /* Initiale Aufplopp-Animation: erst nach zwei rAF-Ticks starten, damit
     Chart.js seine Canvas-Größe garantiert final berechnet hat (verhindert
     Ruckeln durch nachträgliches Neu-Skalieren mitten in der Animation). */
  requestAnimationFrame(() => requestAnimationFrame(() => {
    animateGroupIn(chart, 0);                 /* Jungen-Punkte */
    setTimeout(() => animateGroupIn(chart, 2), 180); /* Mädchen-Punkte, leicht versetzt */
    /* Trendlinien zeichnen sich von links nach rechts, wenn die Punkte
       fast fertig geploppt sind */
    setTimeout(() => animateLinesDraw(chart, [1, 3], 800), 900);
  }));

  /* Geschlechter-Filter: Datasets paarweise (Punkte + Trend) schalten */
  const container = document.getElementById(canvasId).closest('.chart-container');
  if (container) {
    container.querySelectorAll('.chart-legend-toggle .leg-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const pair = btn.dataset.ds === '0' ? [0, 1] : [2, 3];
        const willShow = !chart.isDatasetVisible(pair[0]);

        const visibleGroups = chart.isDatasetVisible(0) + chart.isDatasetVisible(2);
        if (!willShow && visibleGroups <= 1) return; /* nie beide aus */

        pair.forEach(i => chart.setDatasetVisibility(i, willShow));
        btn.classList.toggle('disabled', !willShow);
        btn.setAttribute('aria-pressed', String(willShow));

        if (willShow) {
          /* Punkte sofort registrieren, Linie kurz verzögert weich einblenden */
          const lineIdx = pair[1];
          chart.setDatasetVisibility(lineIdx, false);
          chart.update('none');
          animateGroupIn(chart, pair[0]);
          /* Trendlinie zeichnet sich von links nach rechts, wenn die
             Punkte fast fertig sind */
          setTimeout(() => animateLinesDraw(chart, [lineIdx], 700), 320);
        } else {
          /* Ausblenden: erst Punkte gestaffelt schrumpfen, dann verbergen */
          /* Sichtbarkeit oben war schon gesetzt → für die Schrumpf-Animation rückgängig */
          pair.forEach(i => chart.setDatasetVisibility(i, true));
          chart.update('none');
          animateGroupOut(chart, pair[0], pair[1]);
        }
      });
    });
  }
}

/* Punkte eines Datasets gestaffelt einploppen lassen (Radius 0 -> Endgröße).
   finalR explizit übergeben, da ds.pointRadius beim initialen Aufbau selbst
   0 ist (Ausgangszustand) und sonst fälschlich als Zielgröße gelesen würde. */
function animateGroupIn(chart, pointDsIndex, finalR = 10) {
  const ds = chart.data.datasets[pointDsIndex];
  const STAGGER = 70;   /* ms zwischen Punkten */
  const GROW = 380;     /* ms Aufplopp-Dauer pro Punkt */
  const start = performance.now();

  function easeOutBack(t) {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function frame(now) {
    let done = true;
    const radii = ds.data.map((_, i) => {
      const local = (now - start - i * STAGGER) / GROW;
      if (local < 1) done = false;
      const t = Math.max(0, Math.min(1, local));
      return finalR * easeOutBack(t);
    });
    ds.pointRadius = radii;
    chart.update('none');
    if (!done) {
      requestAnimationFrame(frame);
    } else {
      ds.pointRadius = finalR;   /* sauberer Endzustand, Hover funktioniert wieder */
      chart.update('none');
    }
  }
  requestAnimationFrame(frame);
}

/* Punkte gestaffelt schrumpfen, dann Dataset + Trendlinie ausblenden */
function animateGroupOut(chart, pointDsIndex, lineDsIndex) {
  const ds = chart.data.datasets[pointDsIndex];
  const startR = ds.pointRadius ?? 10;
  const STAGGER = 50;   /* ms zwischen Punkten (von rechts nach links) */
  const SHRINK = 280;   /* ms Schrumpf-Dauer pro Punkt */
  const total  = ds.data.length;
  const start  = performance.now();

  function easeInCubic(t) { return t * t * t; }

  /* Trendlinie schon zu Beginn der Schrumpfung weich ausblenden */
  chart.setDatasetVisibility(lineDsIndex, false);
  chart.update();

  function frame(now) {
    let done = true;
    const radii = ds.data.map((_, i) => {
      /* von rechts beginnen: letzter Punkt schrumpft zuerst */
      const reverseIndex = total - 1 - i;
      const local = (now - start - reverseIndex * STAGGER) / SHRINK;
      if (local < 1) done = false;
      const t = Math.max(0, Math.min(1, local));
      return startR * (1 - easeInCubic(t));
    });
    ds.pointRadius = radii;
    chart.update('none');
    if (!done) {
      requestAnimationFrame(frame);
    } else {
      /* Punkte komplett verstecken, Radius für nächste Einblendung zurücksetzen */
      chart.setDatasetVisibility(pointDsIndex, false);
      ds.pointRadius = startR;
      chart.update('none');
    }
  }
  requestAnimationFrame(frame);
}