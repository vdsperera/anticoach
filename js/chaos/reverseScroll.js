import { isChaosActive } from '../config.js';

export function init() {
  // Mouse Wheel Axis-Swapped & Reversed Scrolling
  window.addEventListener('wheel', (e) => {
    if (!isChaosActive('reverseScroll')) return;
    e.preventDefault();

    const stepX = e.deltaY;
    const stepY = e.deltaX !== 0 ? -e.deltaX : -e.deltaY * 0.6;

    window.scrollBy({
      left: stepX,
      top: stepY,
      behavior: 'auto'
    });
  }, { passive: false });

  // Keyboard Arrow Keys & Navigation Keys Axis-Swapped & Reversed Scrolling
  window.addEventListener('keydown', (e) => {
    if (!isChaosActive('reverseScroll')) return;

    // Do not hijack arrow keys when user is typing in form inputs
    if (e.target.matches('input, textarea, select')) return;

    const navKeys = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp', 'Space', ' '];
    if (!navKeys.includes(e.key) && !navKeys.includes(e.code)) return;

    e.preventDefault();

    let stepX = 0;
    let stepY = 0;

    switch (e.key) {
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
      case 'Spacebar':
        stepX = 140;
        stepY = -90;
        break;

      case 'ArrowUp':
      case 'PageUp':
        stepX = -140;
        stepY = 90;
        break;

      case 'ArrowRight':
        stepX = 0;
        stepY = 120;
        break;

      case 'ArrowLeft':
        stepX = 0;
        stepY = -120;
        break;
    }

    window.scrollBy({
      left: stepX,
      top: stepY,
      behavior: 'smooth'
    });
  });
}
