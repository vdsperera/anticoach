import { isChaosActive } from '../config.js';

export function init() {

  function shake() {
    document.body.classList.add('shaking');
    setTimeout(() => document.body.classList.remove('shaking'), 250);
  }

  function scheduleNext() {
    const delay = (Math.random() * 20000) + 20000;
    setTimeout(() => {
      shake();
      scheduleNext();
    }, delay);
  }

  scheduleNext();

}
