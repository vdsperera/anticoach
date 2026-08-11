import { isChaosActive } from '../config.js';

export function init() {
  const btn = document.getElementById('dark-toggle');
  if (!btn) return;

  let state = 'normal';

  btn.addEventListener('click', () => {
    if (!isChaosActive('darkModeToggle')) {
      document.body.classList.remove('ultra-dark');
      document.body.classList.toggle('light-mode');
      btn.textContent = document.body.classList.contains('light-mode') ? '☀ Light Mode' : '☾ Dark Mode';
      return;
    }

    document.body.classList.remove('light-mode', 'ultra-dark');

    if (state === 'normal' || state === 'ultra-dark') {
      document.body.classList.add('light-mode');
      btn.textContent = '☀ Light Mode';
      state = 'light';
    } else {
      document.body.classList.add('ultra-dark');
      btn.textContent = '⬛ Dark Mode';
      state = 'ultra-dark';
    }
  });
}
