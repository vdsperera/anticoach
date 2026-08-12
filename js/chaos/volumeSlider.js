import { isChaosActive } from '../config.js';

export function init() {
  const slider = document.getElementById('volume-slider');
  const valueDisplay = document.getElementById('volume-value');
  if (!slider || !valueDisplay) return;

  slider.addEventListener('input', () => {
    if (!isChaosActive('volumeSlider')) {
      document.documentElement.style.setProperty('--font-size-base', '16px');
      valueDisplay.textContent = `Volume: ${slider.value}% (Normal)`;
      return;
    }
    const vol = parseInt(slider.value);
    valueDisplay.textContent = `Volume: ${vol}%`;

    const fontSize = 8 + (vol / 100) * 24;
    document.documentElement.style.setProperty('--font-size-base', fontSize + 'px');
  });
}
