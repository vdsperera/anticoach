import { isChaosActive } from '../config.js';

export function init() {
  window.addEventListener('wheel', (e) => {
    if (!isChaosActive('reverseScroll')) return;
    e.preventDefault();

    // Axis-swapped chaotic scrolling:
    // Scrolling down (deltaY > 0) moves page RIGHT (left: +deltaY) and UP (top: -deltaY * 0.6)
    // Scrolling up (deltaY < 0) moves page LEFT (left: -deltaY) and DOWN (top: +deltaY * 0.6)
    // Horizontal scroll (deltaX) controls vertical page scroll
    const stepX = e.deltaY;
    const stepY = e.deltaX !== 0 ? -e.deltaX : -e.deltaY * 0.6;

    window.scrollBy({
      left: stepX,
      top: stepY,
      behavior: 'auto'
    });
  }, { passive: false });
}
