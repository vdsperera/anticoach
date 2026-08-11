import { isChaosActive } from '../config.js';

export function init() {
  document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      if (!isChaosActive('ghostBackspace')) return;
      if (Math.random() < 0.25 && input.value.length > 0) {
        input.value = input.value.slice(0, -1);
      }
    });
  });
}
