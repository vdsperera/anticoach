import { isChaosActive } from '../config.js';
import { openModal } from './modalMultiply.js';

const loadingMessages = [
  "optimizing your potential...",
  "reversing your expectations...",
  "calibrating disappointment levels...",
  "aligning your chakras incorrectly...",
  "downloading self-awareness (0 seeds)...",
  "buffering your breakthrough...",
  "encrypting your excuses..."
];

const resetMessages = [
  "growth takes time. starting over.",
  "almost had it. nope.",
  "99% is close enough. resetting.",
  "the universe wasn't ready. neither were you.",
  "progress deleted for your own good."
];

export function showLoadingBar() {
  if (!isChaosActive('fakeLoadingBar')) {
    // If fakeLoadingBar is disabled, we might still want to open the modal immediately
    // or just let it pass, but typically we just bypass the loading.
    openModal();
    return;
  }

  const overlay = document.getElementById('loading-overlay');
  const fill = document.getElementById('loading-fill');
  const text = document.getElementById('loading-text');
  const percent = document.getElementById('loading-percent');
  let loops = 0;
  const maxLoops = 3;

  overlay.classList.add('active');

  function runLoop() {
    let progress = 0;
    fill.style.width = '0%';
    text.textContent = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    percent.textContent = '0%';

    const interval = setInterval(() => {
      const increment = progress < 60 ? Math.random() * 3 + 1 :
                        progress < 90 ? Math.random() * 1.5 + 0.3 :
                        Math.random() * 0.5 + 0.05;
      progress = Math.min(99, progress + increment);
      fill.style.width = progress + '%';
      percent.textContent = Math.floor(progress) + '%';

      if (Math.random() < 0.02) {
        text.textContent = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
      }

      if (progress >= 99) {
        clearInterval(interval);
        loops++;

        setTimeout(() => {
          fill.style.width = '0%';
          percent.textContent = '0%';
          text.textContent = resetMessages[Math.floor(Math.random() * resetMessages.length)];

          if (loops < maxLoops) {
            setTimeout(runLoop, 1500);
          } else {
            setTimeout(() => {
              overlay.classList.remove('active');
              openModal();
            }, 1200);
          }
        }, 800);
      }
    }, 60);
  }

  runLoop();
}

export function init() {
  // Initialization not strictly needed for this module, as it's triggered by evasiveButton
}
