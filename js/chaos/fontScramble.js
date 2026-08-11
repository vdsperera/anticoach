import { isChaosActive } from '../config.js';

export function init() {

  const funkyFonts = ['"Comic Sans MS", fantasy', 'Papyrus, fantasy', 'Wingdings, fantasy', 'Impact, sans-serif'];
  setInterval(() => {
    if (!isChaosActive('fontScramble')) return;
    const font = funkyFonts[Math.floor(Math.random() * funkyFonts.length)];
    document.body.style.fontFamily = font;
    setTimeout(() => {
      document.body.style.fontFamily = '';
    }, 3000);
  }, 14000);

}
