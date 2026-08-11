import { isChaosActive } from '../config.js';
import { checkDodge } from './evasiveButton.js';

export function init() {
  const fakeCursor = document.getElementById('fake-cursor');

  let fx = window.innerWidth / 2;
  let fy = window.innerHeight / 2;
  let lastX = null, lastY = null;
  let ticking = false;

  fakeCursor.style.transform = `translate(${fx}px, ${fy}px) translate(-50%,-50%)`;

  document.addEventListener('mousemove', (e) => {
    if (!ticking) {
      const { clientX, clientY } = e;
      requestAnimationFrame(() => {
        if (!isChaosActive('invertedCursor')) {
          fx = clientX;
          fy = clientY;
          fakeCursor.style.transform = `translate(${fx}px, ${fy}px) translate(-50%,-50%)`;
        } else {
          if (lastX === null) { lastX = clientX; lastY = clientY; }
          else {
            const dx = clientX - lastX;
            const dy = clientY - lastY;
            lastX = clientX; lastY = clientY;

            fx -= dx;
            fy -= dy;

            fx = Math.max(0, Math.min(window.innerWidth, fx));
            fy = Math.max(0, Math.min(window.innerHeight, fy));

            fakeCursor.style.transform = `translate(${fx}px, ${fy}px) translate(-50%,-50%)`;
            checkDodge(fx, fy);
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  let isSynthesizing = false;

  document.addEventListener('mousedown', (e) => {
    if (isSynthesizing) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();

    isSynthesizing = true;
    const target = document.elementFromPoint(fx, fy);
    if (target) {
      target.dispatchEvent(new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: fx,
        clientY: fy
      }));
    }
    isSynthesizing = false;
  }, true);

  document.addEventListener('mouseup', (e) => {
    if (isSynthesizing) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();

    isSynthesizing = true;
    const target = document.elementFromPoint(fx, fy);
    if (target) {
      target.dispatchEvent(new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: fx,
        clientY: fy
      }));
    }
    isSynthesizing = false;
  }, true);

  document.addEventListener('click', (e) => {
    if (isSynthesizing) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();

    isSynthesizing = true;
    const target = document.elementFromPoint(fx, fy);
    if (target) {
      const interactable = target.closest('a, button, input, textarea, label, [tabindex], .card') || target;
      if (typeof interactable.focus === 'function') {
        interactable.focus();
      }
      if (typeof interactable.click === 'function') {
        interactable.click();
      } else {
        target.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: fx,
          clientY: fy
        }));
      }
    }
    isSynthesizing = false;
  }, true);

  window._fakeCursor = { getPos: () => ({ x: fx, y: fy }) };
}
