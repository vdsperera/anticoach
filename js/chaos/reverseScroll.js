import { isChaosActive } from '../config.js';

export function init() {
  window.addEventListener('wheel', (e) => {
    if (!isChaosActive('reverseScroll')) return;
    e.preventDefault();
    window.scrollBy({ top: -e.deltaY, left: -e.deltaX, behavior: 'auto' });
  }, { passive: false });
}
