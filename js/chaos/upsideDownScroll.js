import { isChaosActive } from '../config.js';

export function init() {
  window.addEventListener('scroll', () => {
    const bountiesSec = document.getElementById('bounties');

    if (!isChaosActive('upsideDownScroll')) {
      document.body.style.transform = '';
      document.body.classList.remove('upside-down');
      return;
    }

    const scrollPos = window.scrollY;
    const threshold = document.documentElement.scrollHeight * 0.25;
    const bountiesTop = bountiesSec ? bountiesSec.offsetTop - 150 : Infinity;

    // Flip upside-down only in the teaser section before reaching the Bounties section
    if (scrollPos > threshold && scrollPos < bountiesTop) {
      document.body.style.transform = 'rotate(180deg)';
      document.body.classList.add('upside-down');
    } else {
      document.body.style.transform = '';
      document.body.classList.remove('upside-down');
    }
  });
}
