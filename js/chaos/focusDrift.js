import { isChaosActive } from '../config.js';

export function init() {

  let idleTimer = null;
  function resetTimer() {
    clearTimeout(idleTimer);
    if (!isChaosActive('focusDrift')) {
      document.body.style.zoom = '';
      return;
    }
    idleTimer = setTimeout(() => {
      document.body.style.zoom = Math.random() < 0.5 ? '135%' : '75%';
      setTimeout(() => { document.body.style.zoom = ''; }, 4000);
    }, 6000);
  }

  ['mousemove', 'keydown', 'scroll', 'click'].forEach(evt => {
    document.addEventListener(evt, resetTimer);
  });
  resetTimer();

}
