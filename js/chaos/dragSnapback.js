import { isChaosActive } from '../config.js';

export function init() {

  const tooltips = [
    "you can't rearrange your priorities here.",
    "nice try. everything stays broken.",
    "that card has boundary issues.",
    "dragging won't fix your life either.",
    "this card filed a restraining order."
  ];

  document.querySelectorAll('.card').forEach(card => {
    const tip = document.createElement('div');
    tip.className = 'card-tooltip';
    card.appendChild(tip);
    card.setAttribute('draggable', 'true');

    let startX, startY, isDragging = false;

    card.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      card.style.zIndex = '10';
      card.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      card.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * 0.05}deg)`;
    });

    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      card.style.zIndex = '';
      card.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
      card.style.transform = 'translate(0,0) rotate(0)';

      tip.textContent = tooltips[Math.floor(Math.random() * tooltips.length)];
      card.classList.add('snapped');
      setTimeout(() => card.classList.remove('snapped'), 2000);
    });

    card.addEventListener('dragstart', (e) => e.preventDefault());
  });

}
