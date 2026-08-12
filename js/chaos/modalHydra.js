import { isChaosActive } from '../config.js';

function spawnHydraModal() {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop hydra-modal-backdrop';
  const rx = Math.floor(Math.random() * 60) + 20;
  const ry = Math.floor(Math.random() * 60) + 20;
  backdrop.innerHTML = `
    <div class="modal hydra-modal" style="position:fixed; top:${ry}%; left:${rx}%; transform:translate(-50%,-50%) scale(0.85);">
      <button class="modal-close-btn" type="button">&times;</button>
      <h4>HYDRA MULTIPLIED!</h4>
      <p>Solving one problem creates two more. Cut off one head, two take its place.</p>
    </div>
  `;
  document.body.appendChild(backdrop);
  backdrop.querySelector('.modal-close-btn').addEventListener('click', () => backdrop.remove());
}

export function init() {
  document.addEventListener('click', (e) => {
    if (!isChaosActive('modalHydra')) return;
    if (e.target.matches('.modal-close-btn') || e.target.matches('[data-action="yes"]')) {
      spawnHydraModal();
      spawnHydraModal();
    }
  });
}
