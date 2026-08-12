import { isChaosActive } from '../config.js';

export function init() {
  // Pure 90-degree Axis-Swapped Wheel Scrolling
  const handleWheel = (e) => {
    if (!isChaosActive('reverseScroll')) return;
    e.preventDefault();
    e.stopPropagation();

    // Vertical wheel (deltaY) ONLY scrolls page horizontally sideways
    // Horizontal wheel (deltaX) ONLY scrolls page vertically up & down
    const scrollX = e.deltaY * 1.8;
    const scrollY = e.deltaX * 1.8;

    window.scrollBy({
      left: scrollX,
      top: scrollY,
      behavior: 'auto'
    });
  };

  window.addEventListener('wheel', handleWheel, { capture: true, passive: false });
  document.addEventListener('wheel', handleWheel, { capture: true, passive: false });

  // Pure 90-degree Axis-Swapped Keyboard Navigation
  const handleKeydown = (e) => {
    if (!isChaosActive('reverseScroll')) return;

    if (e.target && e.target.matches && e.target.matches('input, textarea, select')) return;

    const navKeys = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp', 'Space', ' '];
    if (!navKeys.includes(e.key) && !navKeys.includes(e.code)) return;

    e.preventDefault();
    e.stopPropagation();

    let stepX = 0;
    let stepY = 0;

    switch (e.key) {
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
      case 'Spacebar':
        stepX = 220; // Down arrow / spacebar -> Scrolls page RIGHT
        stepY = 0;
        break;

      case 'ArrowUp':
      case 'PageUp':
        stepX = -220; // Up arrow -> Scrolls page LEFT
        stepY = 0;
        break;

      case 'ArrowRight':
        stepX = 0;
        stepY = 220; // Right arrow -> Scrolls page DOWN
        break;

      case 'ArrowLeft':
        stepX = 0;
        stepY = -220; // Left arrow -> Scrolls page UP
        break;
    }

    window.scrollBy({
      left: stepX,
      top: stepY,
      behavior: 'smooth'
    });
  };

  window.addEventListener('keydown', handleKeydown, { capture: true });
  document.addEventListener('keydown', handleKeydown, { capture: true });
}
