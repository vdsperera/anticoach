import { isChaosActive } from '../config.js';

export function init() {

  document.addEventListener('contextmenu', (e) => {
    if (!isChaosActive('customContextMenu')) return;
    e.preventDefault();

    let oldMenu = document.getElementById('custom-context-menu');
    if (oldMenu) oldMenu.remove();

    const menu = document.createElement('div');
    menu.id = 'custom-context-menu';
    menu.className = 'custom-menu';
    menu.style.top = e.clientY + 'px';
    menu.style.left = e.clientX + 'px';
    menu.innerHTML = `
      <div class="custom-menu-item">≡ƒöì Inspect Soul</div>
      <div class="custom-menu-item">≡ƒôä View Source of Regret</div>
      <div class="custom-menu-item">≡ƒîÉ Translate to Silence</div>
      <div class="custom-menu-item">≡ƒÜ⌐ Report to Coach</div>
    `;
    document.body.appendChild(menu);

    const close = () => menu.remove();
    document.addEventListener('click', close, { once: true });
  });

}
