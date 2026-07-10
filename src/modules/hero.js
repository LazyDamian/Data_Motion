import gsap from 'gsap';
import { headlines } from '../data.js';

export function initHero() {
  const field = document.getElementById('headline-field');
  const hero  = document.getElementById('hero');
  if (!field || !hero) return;

  const isMobile = window.matchMedia('(max-width: 800px)').matches;

  /* Schlagzeilen pseudo-zufällig verteilen.
     Auf Mobile deutlich engere x-Werte (max. 55% statt 80%), damit auch
     lange Texte wie "Ethische Bedenken bleiben" nicht über den rechten
     Bildschirmrand hinausragen, da sie ab ihrem Ankerpunkt nach rechts
     wachsen. */
  const positions = isMobile
    ? [
        { x: 4,  y: 14 }, { x: 30, y: 10 }, { x: 6,  y: 26 },
        { x: 35, y: 34 }, { x: 4,  y: 46 }, { x: 28, y: 54 },
        { x: 8,  y: 64 }, { x: 4,  y: 74 }, { x: 22, y: 84 },
      ]
    : [
        { x: 8,  y: 18 }, { x: 62, y: 12 }, { x: 30, y: 30 },
        { x: 74, y: 38 }, { x: 14, y: 52 }, { x: 55, y: 60 },
        { x: 80, y: 70 }, { x: 22, y: 76 }, { x: 45, y: 86 },
      ];

  const items = [];
  headlines.forEach((text, i) => {
    const pos = positions[i % positions.length];
    const el = document.createElement('span');
    el.className = 'headline-ghost';
    el.textContent = text;
    el.style.left = `${pos.x}%`;
    el.style.top  = `${pos.y}%`;
    el.style.fontSize = isMobile
      ? `${gsap.utils.random(0.75, 1.15).toFixed(2)}rem`
      : `${gsap.utils.random(0.85, 1.7).toFixed(2)}rem`;
    field.appendChild(el);
    items.push({ el, depth: gsap.utils.random(0.4, 1.6) });

    /* sanftes Ein- und Ausblenden */
    gsap.fromTo(el,
      { opacity: 0 },
      {
        opacity: gsap.utils.random(0.12, 0.4),
        duration: gsap.utils.random(2, 4),
        delay: gsap.utils.random(0, 3),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

    /* langsames Driften, auf Mobile deutlich kleinerer Bewegungsradius,
       damit die Elemente nicht doch noch über den Bildschirmrand wandern */
    gsap.to(el, {
      x: isMobile ? gsap.utils.random(-10, 10) : gsap.utils.random(-40, 40),
      y: isMobile ? gsap.utils.random(-10, 10) : gsap.utils.random(-30, 30),
      duration: gsap.utils.random(8, 16),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });

  /* Maus-Parallax +Cursor-Glow */
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width  - 0.5;
    const my = (e.clientY - rect.top)  / rect.height - 0.5;

    hero.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
    hero.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);

    items.forEach(({ el, depth }) => {
      gsap.to(el, {
        xPercent: mx * 30 * depth,
        yPercent: my * 30 * depth,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
  });
}