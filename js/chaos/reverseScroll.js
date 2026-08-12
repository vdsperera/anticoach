import { isChaosActive } from '../config.js';

export function init() {
  // Mouse Wheel Axis-Swapped & Reversed Scrolling Chaos
  const handleWheel = (e) => {
    if (!isChaosActive('reverseScroll')) return;
    e.preventDefault();
    e.stopPropagation();

    const dy = e.deltaY;
    const dx = e.deltaX;

    // Scrolling DOWN (dy > 0) -> Moves page RIGHT (+X) and UP (-Y)
    // Scrolling UP (dy < 0) -> Moves page LEFT (-X) and DOWN (+Y)
    const scrollX = dy !== 0 ? dy * 1.6 : -dx * 1.6;
    const scrollY = dy !== 0 ? -dy * 1.3 : dx * 1.3;

    window.scrollBy({
      left: scrollX,
      top: scrollY,
      behavior: 'auto'
    });
  };

  // Attach with capture: true & passive: false to hijack wheel event before native scrolling
  window.addEventListener('wheel', handleWheel, { capture: true, passive: false });
  document.addEventListener('wheel', handleWheel, { capture: true, passive: false });

  // Keyboard Arrow Keys & Navigation Keys Axis-Swapped & Reversed Scrolling Chaos
  const handleKeydown = (e) => {
    if (!isChaosActive('reverseScroll')) return;

    // Do not hijack arrow keys when user is typing in form inputs
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
        stepX = 180;
        stepY = -120;
        break;

      case 'ArrowUp':
      case 'PageUp':
        stepX = -180;
        stepY = 120;
        break;

      case 'ArrowRight':
        stepX = 0;
        stepY = 150;
        break;

      case 'ArrowLeft':
        stepX = 0;
        stepY = -150;
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
