import { isChaosActive } from '../config.js';

export function init() {

  document.addEventListener('click', (e) => {
    if (!isChaosActive('modalHydra')) return;
    if (e.target.matches('.modal-close-btn') || e.target.matches('[data-action="yes"]')) {
      spawnHydraModal();
      spawnHydraModal();
    }
  });

}
