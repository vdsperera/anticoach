import { isChaosActive } from '../config.js';

export function init() {
  const glitchEl = document.querySelector('.glitch');
  if (!glitchEl) return;

  function burst() {
    glitchEl.classList.add('burst');
    setTimeout(() => glitchEl.classList.remove('burst'), 400);
  }

  function scheduleNext() {
    const delay = (Math.random() * 12000) + 8000;
    setTimeout(() => {
      burst();
      scheduleNext();
    }, delay);
  }

  scheduleNext();
});


/* ============================================================
   13. PAGE SHAKE / TREMOR
============================================================ */
registerChaos('pageShake', () => {
  function shake() {
    document.body.classList.add('shaking');
    setTimeout(() => document.body.classList.remove('shaking'), 250);
  }

  function scheduleNext() {
    const delay = (Math.random() * 20000) + 20000;
    setTimeout(() => {
      shake();
      scheduleNext();
    }, delay);
  }

  scheduleNext();
}
