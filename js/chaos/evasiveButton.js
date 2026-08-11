import { isChaosActive } from '../config.js';
import { showLoadingBar } from './fakeLoadingBar.js';

let dodgeOffsets = new WeakMap();

export function checkDodge(cx, cy) {
  if (!isChaosActive('evasiveButton')) return;
  const dodgeButtons = document.querySelectorAll('.dodge');
  dodgeButtons.forEach(btn => {
    const rect = btn.getBoundingClientRect();
    const bx = rect.left + rect.width / 2;
    const by = rect.top + rect.height / 2;
    const dist = Math.hypot(cx - bx, cy - by);
    if (dist < 90) {
      const angle = Math.atan2(by - cy, bx - cx);
      const push = 70;
      const offX = Math.cos(angle) * push;
      const offY = Math.sin(angle) * push;
      const prev = dodgeOffsets.get(btn) || { x: 0, y: 0 };
      const nx = prev.x + offX;
      const ny = prev.y + offY;
      dodgeOffsets.set(btn, { x: nx, y: ny });
      btn.style.transform = `translate(${nx}px, ${ny}px)`;
      btn.style.transition = 'transform 0.15s ease-out';
    }
  });
}

export function init() {
  setInterval(() => {
    document.querySelectorAll('.dodge').forEach(btn => {
      if (!isChaosActive('evasiveButton')) {
        btn.style.transform = 'translate(0,0)';
        return;
      }
      const prev = dodgeOffsets.get(btn) || { x: 0, y: 0 };
      const nx = prev.x * 0.9;
      const ny = prev.y * 0.9;
      dodgeOffsets.set(btn, { x: nx, y: ny });
      btn.style.transform = `translate(${nx}px, ${ny}px)`;
    });
  }, 300);

  document.getElementById('cta-start').addEventListener('click', () => {
    showLoadingBar();
  });
}
