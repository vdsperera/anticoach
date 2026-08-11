import { isChaosActive } from '../config.js';

export function init() {

  setInterval(() => {
    if (!isChaosActive('uiGravity')) return;
    const targets = document.querySelectorAll('.logo, nav a, .eyebrow');
    if (!targets.length) return;
    const el = targets[Math.floor(Math.random() * targets.length)];
    if (el._dropped) return;
    el._dropped = true;
    el.classList.add('gravity-dropped');
    el.style.transform = `translateY(${window.innerHeight - 150}px) rotate(${Math.random() * 40 - 20}deg)`;
    
    el.addEventListener('click', function restore() {
      el.style.transform = '';
      el._dropped = false;
      el.removeEventListener('click', restore);
    }, { once: true });
  }, 25000);

}
