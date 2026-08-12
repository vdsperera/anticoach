import { isChaosActive } from '../config.js';

let modalCount = 0;

export function openModal() {
  if (!isChaosActive('modalMultiply')) return;
  if (modalCount >= 3) { modalCount = 0; return; }
  modalCount++;
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal">
      <h4>ARE YOU READY TO GROW?</h4>
      <p>Clicking "Yes" cancels your growth. Clicking "No" confirms it. This is by design.</p>
      <button class="btn primary" data-action="no">No</button>
      <button class="btn" data-action="yes">Yes</button>
    </div>
  `;
  document.body.appendChild(backdrop);

  backdrop.querySelector('[data-action="yes"]').addEventListener('click', () => {
    backdrop.remove();
  });
  backdrop.querySelector('[data-action="no"]').addEventListener('click', () => {
    backdrop.remove();
    openModal();
  });
}

export function init() {}
