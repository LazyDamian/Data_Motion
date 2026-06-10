import './style.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import { initHero }       from './modules/hero.js';
import { initCycle }      from './modules/cycle.js';
import { initParadox }    from './modules/paradox.js';
import { initMythbuster } from './modules/mythbuster.js';
import { initResearch }   from './modules/research.js';
import { initMedia }      from './modules/media.js';

/* ─── Scroll-Fortschritt ─────────────────────────────────────── */
const bar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const t = document.body.scrollHeight - window.innerHeight;
  bar.style.width = `${Math.min((window.scrollY / t) * 100, 100)}%`;
}, { passive: true });

/* ─── Nav: Stil + aktiver Link ───────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 80), { passive: true });

const navLinks = document.querySelectorAll('.nav-links a');
const sectionIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('section[id]').forEach(s => sectionIO.observe(s));

/* ─── Reveal-Animationen ─────────────────────────────────────── */
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealIO.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal-up, .reveal-scale').forEach(el => revealIO.observe(el));

/* ─── Counter-Animation ──────────────────────────────────────── */
function animateCounter(el) {
  const raw = el.dataset.target, suffix = el.dataset.suffix || '';
  const target = parseInt(raw, 10), isNeg = target < 0;
  const prefix = raw.startsWith('+') ? '+' : isNeg ? '−' : '';
  const abs = Math.abs(target), dur = 1300, t0 = performance.now();
  function tick(now) {
    const p = Math.min((now - t0) / dur, 1);
    el.textContent = `${prefix}${Math.round(abs * (1 - Math.pow(1 - p, 3)))}${suffix}`;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counterIO = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.querySelectorAll('[data-target]').forEach(animateCounter); counterIO.unobserve(e.target); } });
}, { threshold: 0.3 });
const ms = document.getElementById('section-metrics');
if (ms) counterIO.observe(ms);

/* ─── Module starten ─────────────────────────────────────────── */
initHero();
initCycle();
initParadox();
initMythbuster();

/* Lazy-init für Charts/Medien (erst bei Sichtbarkeit) */
const lazyIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const id = e.target.id;
    if (id === 'chartResearch') initResearch(id);
    if (id === 'media-mount')   initMedia();
    lazyIO.unobserve(e.target);
  });
}, { threshold: 0.05 });
['chartResearch', 'media-mount'].forEach(id => {
  const el = document.getElementById(id);
  if (el) lazyIO.observe(el);
});