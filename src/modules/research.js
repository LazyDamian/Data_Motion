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

export function initResearch(canvasId) {
  const ctx = document.getElementById(canvasId).getContext('2d');

  /* Animation: Punkte ploppen gestaffelt auf, dann erscheinen die Trendlinien */

  const chart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        { label: 'Jungen', data: researchBoys, backgroundColor: 'rgba(59,130,246,0.65)',
          borderColor: '#3b82f6', borderWidth: 1.5, pointRadius: 10, pointHoverRadius: 14 },
        { label: 'Trend Jungen', data: regression(researchBoys), type: 'line',
          borderColor: 'rgba(59,130,246,0.6)', borderWidth: 2.5, borderDash: [6, 4],
          pointRadius: 0, fill: false, tension: 0 },
        { label: 'Mädchen', data: researchGirls, backgroundColor: 'rgba(212,83,126,0.65)',
          borderColor: '#d4537e', borderWidth: 1.5, pointRadius: 10, pointHoverRadius: 14 },
        { label: 'Trend Mädchen', data: regression(researchGirls), type: 'line',
          borderColor: 'rgba(212,83,126,0.6)', borderWidth: 2.5, borderDash: [6, 4],
          pointRadius: 0, fill: false, tension: 0 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: {
        duration: 700,
        easing: 'easeOutBack',
        delay: (ctx) => {
          if (ctx.type !== 'data' || ctx.mode !== 'default') return 0;
          if (ctx.dataset.label?.startsWith('Trend')) return ctx.dataIndex * 200 + 800;
          return ctx.dataIndex * 80 + (ctx.datasetIndex < 2 ? 0 : 200);
        },
      },
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
          /* Trendlinie erscheint, wenn die Punkte fast fertig sind */
          setTimeout(() => {
            chart.setDatasetVisibility(lineIdx, true);
            chart.update();   /* weiche Standard-Animation zeichnet die Linie */
          }, 320);
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

/* Punkte eines Datasets gestaffelt einploppen lassen (Radius 0 -> Endgröße) */
function animateGroupIn(chart, pointDsIndex) {
  const ds = chart.data.datasets[pointDsIndex];
  const finalR = ds.pointRadius ?? 10;
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