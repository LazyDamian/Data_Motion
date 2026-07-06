import Chart from 'chart.js/auto';
import {
  ethicsConcerns, radarLabels, radarRequirement, radarDefaultPlayer,
  recruitChart,
} from '../data.js';

/* ─── Ethik-Donut: Schwerpunkte der Debatte ─── */
export function initEthicsChart(canvasId) {
  const el = document.getElementById(canvasId);
  if (!el) return;
  new Chart(el.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ethicsConcerns.labels,
      datasets: [{
        data: ethicsConcerns.values,
        backgroundColor: ['#ef4444', '#f97316', '#d4537e', '#3b82f6', '#64748b'],
        borderColor: '#0f1117',
        borderWidth: 3,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '62%',
      animation: { animateRotate: true, duration: 1100, easing: 'easeOutQuart' },
      plugins: {
        legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 14, font: { size: 13 } } },
        tooltip: {
          backgroundColor: 'rgba(10,12,26,0.96)', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1,
          titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 12,
          callbacks: { label: c => ` ${c.label}: ${c.parsed} %` },
        },
      },
    },
  });
}

/* ─── Radar: Spieler-Profil vs. Anforderung Drohnenpilot ─── */
export function initRadarChart(canvasId) {
  const el = document.getElementById(canvasId);
  if (!el) return null;
  const chart = new Chart(el.getContext('2d'), {
    type: 'radar',
    data: {
      labels: radarLabels,
      datasets: [
        { label: 'Spieler-Profil', data: [...radarDefaultPlayer],
          backgroundColor: 'rgba(163,230,53,0.2)', borderColor: '#a3e635',
          borderWidth: 2, pointBackgroundColor: '#a3e635' },
        { label: 'Anforderung Drohnenpilot', data: radarRequirement,
          backgroundColor: 'rgba(252, 142, 172, .1)', borderColor: 'rgba(252, 142, 172, 1.0)',
          borderWidth: 1, borderDash: [5, 5], pointRadius: 0 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 900, easing: 'easeOutQuart' },
      scales: {
        r: {
          angleLines: { color: 'rgba(255,255,255,0.08)' },
          grid: { color: 'rgba(255,255,255,0.08)' },
          pointLabels: { color: '#94a3b8', font: { size: 13 } },
          ticks: { display: false }, min: 0, max: 100,
        },
      },
      plugins: { legend: { labels: { color: '#c9d1d9', font: { size: 13 } } } },
    },
  });

  /* Slider koppeln */
  document.querySelectorAll('.skill-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      const idx = parseInt(e.target.getAttribute('data-index'), 10);
      const badge = e.target.parentElement.querySelector('.val-badge');
      if (badge) badge.textContent = val;
      chart.data.datasets[0].data[idx] = val;
      chart.update();
    });
  });
  return chart;
}

/* ─── Rekrutierungen vs. America's Army Spielerzahlen (Original-Chart) ─── */
export function initRecruitChart(canvasId) {
  const el = document.getElementById(canvasId);
  if (!el) return;

  const { labels, recruits, players } = recruitChart;

  const chart = new Chart(el.getContext('2d'), {
    data: {
      labels,
      datasets: [
        { type: 'bar', label: 'Rekrutierungen (Tsd.)', data: recruits,
          backgroundColor: 'rgba(239,68,68,0.85)', borderRadius: 4, yAxisID: 'yRec', order: 2 },
        { type: 'line', label: "America's Army Spieler (Mio.)", data: players,
          borderColor: '#3b82f6', backgroundColor: '#3b82f6', borderWidth: 3,
          pointRadius: 5, pointHoverRadius: 8, tension: 0.3, yAxisID: 'yPly', order: 1 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 1000, easing: 'easeOutQuart' },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: '#94a3b8', font: { size: 13 }, usePointStyle: true } },
        tooltip: {
          backgroundColor: 'rgba(10,12,26,0.96)', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1,
          titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 12,
          callbacks: {
            label: (c) => {
              const unit = c.dataset.type === 'bar' ? ' Tsd.' : ' Mio.';
              return ` ${c.dataset.label.split(' (')[0]}: ${c.parsed.y}${unit}`;
            },
          },
        },
      },
      scales: {
        x: { ticks: { color: '#94a3b8', font: { size: 12 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
        yRec: {
          type: 'linear', position: 'left', beginAtZero: true,
          ticks: { color: '#ef4444', font: { size: 12 } }, grid: { color: 'rgba(255,255,255,0.04)' },
          title: { display: true, text: 'Rekrutierungen (Tsd.)', color: '#ef4444', font: { size: 12 } },
        },
        yPly: {
          type: 'linear', position: 'right', beginAtZero: true,
          ticks: { color: '#3b82f6', font: { size: 12 } }, grid: { drawOnChartArea: false },
          title: { display: true, text: "Spieler (Mio.)", color: '#3b82f6', font: { size: 12 } },
        },
      },
    },
  });
}