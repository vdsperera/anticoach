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
}

