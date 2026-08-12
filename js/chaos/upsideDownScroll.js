import { isChaosActive } from '../config.js';

export function init() {
  window.addEventListener('scroll', () => {
    if (!isChaosActive('upsideDownScroll')) {
      document.body.style.transform = '';
      document.body.classList.remove('upside-down');
      return;
    }
    const scrollPos = window.scrollY;
    const threshold = document.documentElement.scrollHeight * 0.35;
    if (scrollPos > threshold) {
      document.body.style.transform = 'rotate(180deg)';
      document.body.classList.add('upside-down');
    } else {
      document.body.style.transform = '';
      document.body.classList.remove('upside-down');
    }
  });
}
