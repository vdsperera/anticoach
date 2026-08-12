import { isChaosActive } from '../config.js';
import { checkDodge } from './evasiveButton.js';

export function init() {
  const fakeCursor = document.getElementById('fake-cursor');
  if (!fakeCursor) return;

  let fx = window.innerWidth / 2;
  let fy = window.innerHeight / 2;
  let lastX = null, lastY = null;

  fakeCursor.style.transform = `translate(${fx}px, ${fy}px) translate(-50%,-50%)`;

  document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;

    if (!isChaosActive('invertedCursor')) {
      fx = clientX;
      fy = clientY;
      fakeCursor.style.transform = `translate(${fx}px, ${fy}px) translate(-50%,-50%)`;
      lastX = clientX;
      lastY = clientY;
      return;
    }

    if (lastX === null) {
      lastX = clientX;
      lastY = clientY;
    } else {
      const dx = clientX - lastX;
      const dy = clientY - lastY;
      lastX = clientX;
      lastY = clientY;

      fx -= dx;
      fy -= dy;

      fx = Math.max(0, Math.min(window.innerWidth, fx));
      fy = Math.max(0, Math.min(window.innerHeight, fy));

      fakeCursor.style.transform = `translate(${fx}px, ${fy}px) translate(-50%,-50%)`;
      checkDodge(fx, fy);
    }
  });

  let isSynthesizing = false;

  document.addEventListener('mousedown', (e) => {
    if (!isChaosActive('invertedCursor')) return;
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
    if (!isChaosActive('invertedCursor')) return;
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
    if (!isChaosActive('invertedCursor')) return;
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
