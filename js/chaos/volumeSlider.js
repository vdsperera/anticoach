import { isChaosActive } from '../config.js';

export function init() {
  const slider = document.getElementById('volume-slider');
  const valueDisplay = document.getElementById('volume-value');
  if (!slider || !valueDisplay) return;

  slider.addEventListener('input', () => {
    if (!isChaosActive('volumeSlider')) {
      document.documentElement.style.setProperty('--font-size-base', '16px');
      valueDisplay.textContent = `Volume: ${slider.value}% (Normal)`;
      return;
    }
    const vol = parseInt(slider.value);
    valueDisplay.textContent = `Volume: ${vol}%`;

    const fontSize = 8 + (vol / 100) * 24;
    document.documentElement.style.setProperty('--font-size-base', fontSize + 'px');
  });
});


/* ============================================================
   18. UPSIDE-DOWN VIEWPORT FLIP
   Scrolling past 35% flips the whole page upside down.
============================================================ */
registerChaos('upsideDownScroll', () => {
  window.addEventListener('scroll', () => {
    if (!isChaosActive('upsideDownScroll')) {
      document.body.style.transform = '';
      return;
    }
    const scrollPos = window.scrollY;
    const threshold = document.documentElement.scrollHeight * 0.35;
    if (scrollPos > threshold) {
      document.body.style.transform = 'rotate(180deg)';
    } else {
      document.body.style.transform = '';
    }
  });
});


/* ============================================================
   19. MODAL HYDRA
   Closing a modal spawns two smaller hydra modals.
============================================================ */
registerChaos('modalHydra', () => {
  document.addEventListener('click', (e) => {
    if (!isChaosActive('modalHydra')) return;
    if (e.target.matches('.modal-close-btn') || e.target.matches('[data-action="yes"]')) {
      spawnHydraModal();
      spawnHydraModal();
    }
  });
});

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


/* ============================================================
   20. UI GRAVITY DROP
   UI elements randomly lose support and drop to floor.
============================================================ */
registerChaos('uiGravity', () => {
  setInterval(() => {
    if (!isChaosActive('uiGravity')) return;
    const targets = document.querySelectorAll('.logo, nav a, .eyebrow');
    if (!targets.length) return;
    const el = targets[Math.floor(Math.random() * targets.length)];
    if (el._dropped) return;
    el._dropped = true;
    el.classList.add('gravity-dropped');
    el.style.transform = `translateY(${window.innerHeight - 150}px) rotate(${Math.random() * 40 - 20}deg)`;
    
    el.addEventListener('click', function restore() {
      el.style.transform = '';
      el._dropped = false;
      el.removeEventListener('click', restore);
    }, { once: true });
  }, 25000);
});


/* ============================================================
   21. FONT SCRAMBLE
   Fonts temporarily turn into Comic Sans / Papyrus / Wingdings.
============================================================ */
registerChaos('fontScramble', () => {
  const funkyFonts = ['"Comic Sans MS", fantasy', 'Papyrus, fantasy', 'Wingdings, fantasy', 'Impact, sans-serif'];
  setInterval(() => {
    if (!isChaosActive('fontScramble')) return;
    const font = funkyFonts[Math.floor(Math.random() * funkyFonts.length)];
    document.body.style.fontFamily = font;
    setTimeout(() => {
      document.body.style.fontFamily = '';
    }, 3000);
  }, 14000);
});


/* ============================================================
   22. CUSTOM CONTEXT MENU (Right-Click Sabotage)
============================================================ */
registerChaos('customContextMenu', () => {
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
      <div class="custom-menu-item">🔍 Inspect Soul</div>
      <div class="custom-menu-item">📄 View Source of Regret</div>
      <div class="custom-menu-item">🌐 Translate to Silence</div>
      <div class="custom-menu-item">🚩 Report to Coach</div>
    `;
    document.body.appendChild(menu);

    const close = () => menu.remove();
    document.addEventListener('click', close, { once: true });
  });
});


/* ============================================================
   23. FOCUS DRIFT (Random Zoom Jumps)
============================================================ */
registerChaos('focusDrift', () => {
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
