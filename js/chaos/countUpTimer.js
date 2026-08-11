import { isChaosActive } from '../config.js';

export function init() {
  const display = document.getElementById('countdown-value');
  if (!display) return;

  let seconds = 0;

  setInterval(() => {
    if (!isChaosActive('countUpTimer')) {
      display.textContent = '15:00 (Active)';
      return;
    }
    seconds++;
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const pad = (n) => String(n).padStart(2, '0');

    if (hrs > 0) {
      display.textContent = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    } else {
      display.textContent = `${pad(mins)}:${pad(secs)}`;
    }
  }, 1000);
}
