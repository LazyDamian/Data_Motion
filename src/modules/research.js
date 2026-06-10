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
        const nowVisible = chart.isDatasetVisible(pair[0]);

        const visibleGroups = chart.isDatasetVisible(0) + chart.isDatasetVisible(2);
        if (nowVisible && visibleGroups <= 1) return; /* nie beide aus */

        pair.forEach(i => chart.setDatasetVisibility(i, !nowVisible));
        btn.classList.toggle('disabled', nowVisible);
        btn.setAttribute('aria-pressed', String(!nowVisible));
        chart.update();
      });
    });
  }
}