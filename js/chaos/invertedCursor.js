import { isChaosActive } from '../config.js';

export function init() {
  const fakeCursor = document.getElementById('fake-cursor');

  let fx = window.innerWidth / 2;
  let fy = window.innerHeight / 2;
  let lastX = null, lastY = null;

  fakeCursor.style.transform = `translate(${fx}px, ${fy}px) translate(-50%,-50%)`;

  document.addEventListener('mousemove', (e) => {
    if (!isChaosActive('invertedCursor')) {
      fx = e.clientX;
      fy = e.clientY;
      fakeCursor.style.transform = `translate(${fx}px, ${fy}px) translate(-50%,-50%)`;
      return;
    }

    if (lastX === null) { lastX = e.clientX; lastY = e.clientY; return; }

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;

    fx -= dx;
    fy -= dy;

    fx = Math.max(0, Math.min(window.innerWidth, fx));
    fy = Math.max(0, Math.min(window.innerHeight, fy));

    fakeCursor.style.transform = `translate(${fx}px, ${fy}px) translate(-50%,-50%)`;

    checkDodge(fx, fy);
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
