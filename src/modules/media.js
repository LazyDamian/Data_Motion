import gsap from 'gsap';
import { media } from '../data.js';

const MIN_PER_ICON = 10;          /* ein Icon = 10 Minuten */
const COLORS = { Jungen: '#3b82f6', Mädchen: '#d4537e' };
const ROWS = [
  { key: 'fernsehen',   label: 'Fernsehen'   },
  { key: 'videospiele', label: 'Videospiele' },
  { key: 'computer',    label: 'Computer'    },
];

const controllerSVG = color => `
<svg viewBox="0 0 24 24" width="22" height="22" fill="${color}" aria-hidden="true">
  <path d="M6 8h12a4 4 0 0 1 4 4v3a3 3 0 0 1-5.4 1.8L15 15H9l-1.6 1.8A3 3 0 0 1 2 15v-3a4 4 0 0 1 4-4zm-1 4v2h2v-2H5zm9 0v2h2v-2h-2z"/>
</svg>`;

export function initMedia() {
  const mount = document.getElementById('media-mount');
  if (!mount) return;

  let current = 'Jungen';

  function render(gender, animate = true) {
    mount.innerHTML = '';
    const data = media[gender];
    const color = COLORS[gender];

    ROWS.forEach((row, ri) => {
      const minutes = data[row.key];
      const count = Math.round(minutes / MIN_PER_ICON);

      const rowEl = document.createElement('div');
      rowEl.className = 'iso-row';

      const head = document.createElement('div');
      head.className = 'iso-head';
      head.innerHTML = `<span class="iso-label">${row.label}</span><span class="iso-min">${minutes} Min./Tag</span>`;

      const icons = document.createElement('div');
      icons.className = 'iso-icons';
      for (let k = 0; k < count; k++) {
        const ic = document.createElement('span');
        ic.className = 'iso-icon';
        ic.innerHTML = controllerSVG(color);
        icons.appendChild(ic);
      }

      rowEl.appendChild(head); rowEl.appendChild(icons);
      mount.appendChild(rowEl);

      if (animate) {
        gsap.fromTo(icons.children,
          { opacity: 0, scale: 0.3, y: 8 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(2)',
            stagger: 0.02, delay: ri * 0.15 });
      }
    });
  }

  /* Toggle-Buttons */
  document.querySelectorAll('#media-toggle .gender-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const g = btn.dataset.gender;
      if (g === current) return;
      current = g;
      document.querySelectorAll('#media-toggle .gender-btn')
        .forEach(b => b.classList.toggle('active', b.dataset.gender === g));
      render(g, true);
    });
  });

  render(current, false);   /* erstes Rendern ohne Animation … */
  /* … Animation erst, wenn sichtbar */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { render(current, true); io.disconnect(); }
    });
  }, { threshold: 0.3 });
  io.observe(mount);
}