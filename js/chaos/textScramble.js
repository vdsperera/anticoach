import { isChaosActive } from '../config.js';

export function init() {
  const glyphPool = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`¡¢£¤¥¦§¨©ª«¬®¯°±²³µ¶·¸¹º»¼½¾¿×÷';

  function scrambleElement(el) {
    if (!isChaosActive('textScramble')) return;
    if (el._scrambling) return;
    el._scrambling = true;
    el.classList.add('scrambling');

    const original = el.textContent;
    const chars = original.split('');
    const duration = 350;
    const steps = 8;
    const stepTime = duration / steps;
    let step = 0;

    const iv = setInterval(() => {
      step++;
      const fraction = step / steps;
      const result = chars.map((ch, i) => {
        if (ch === ' ') return ' ';
        if (i / chars.length < fraction) return ch;
        return glyphPool[Math.floor(Math.random() * glyphPool.length)];
      });
      el.textContent = result.join('');

      if (step >= steps) {
        clearInterval(iv);
        el.textContent = original;
        el.classList.remove('scrambling');
        el._scrambling = false;
      }
    }, stepTime);
  }

  document.querySelectorAll('.card p, .lede, section > p').forEach(el => {
    el.classList.add('scramble-target');
    el.addEventListener('mouseenter', () => scrambleElement(el));
  });
}
