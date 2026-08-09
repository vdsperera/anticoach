/* ============================================================
   ANTICOACH — script.js
   Chaos module system. Every prank is self-contained.
============================================================ */

/* ---------- MODULE REGISTRY ---------- */
const chaosModules = [];

function registerChaos(name, initFn) {
  chaosModules.push({ name, init: initFn });
}

document.addEventListener('DOMContentLoaded', () => {
  chaosModules.forEach(m => {
    try { m.init(); }
    catch (err) { console.warn(`[ANTICOACH] Module "${m.name}" failed:`, err); }
  });
});


/* ============================================================
   1. INVERTED CURSOR
   Real cursor hidden. Fake cursor moves opposite to real mouse
   deltas. Ghost dot shows true pointer position.
============================================================ */
registerChaos('invertedCursor', () => {
  const fakeCursor = document.getElementById('fake-cursor');

  let fx = window.innerWidth / 2;
  let fy = window.innerHeight / 2;
  let lastX = null, lastY = null;

  fakeCursor.style.transform = `translate(${fx}px, ${fy}px) translate(-50%,-50%)`;

  document.addEventListener('mousemove', (e) => {
    if (lastX === null) { lastX = e.clientX; lastY = e.clientY; return; }

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;

    // INVERT the delta
    fx -= dx;
    fy -= dy;

    fx = Math.max(0, Math.min(window.innerWidth, fx));
    fy = Math.max(0, Math.min(window.innerHeight, fy));

    fakeCursor.style.transform = `translate(${fx}px, ${fy}px) translate(-50%,-50%)`;

    // dispatch a synthetic hover check so buttons can dodge the FAKE cursor
    checkDodge(fx, fy);
  });

  // Synthetic click / mousedown / mouseup handling at fake cursor coordinates (fx, fy)
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

  // expose fx/fy for other modules
  window._fakeCursor = { getPos: () => ({ x: fx, y: fy }) };
});


/* ============================================================
   2. REVERSE SCROLL
   Wheel events intercepted; scroll direction flipped.
============================================================ */
registerChaos('reverseScroll', () => {
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    window.scrollBy({ top: -e.deltaY, left: -e.deltaX, behavior: 'auto' });
  }, { passive: false });
});


/* ============================================================
   3. MENU REDIRECTION
   Nav links labeled one thing, scroll to another.
============================================================ */
registerChaos('menuRedirection', () => {
  document.querySelectorAll('nav a[data-target]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
});


/* ============================================================
   4. EVASIVE BUTTON
   Primary CTA scoots away when fake cursor gets close.
============================================================ */
let dodgeOffsets = new WeakMap();

function checkDodge(cx, cy) {
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

registerChaos('evasiveButton', () => {
  // slowly drift dodge buttons back home
  setInterval(() => {
    document.querySelectorAll('.dodge').forEach(btn => {
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
});


/* ============================================================
   5. FORM SABOTAGE
   Typing reverses, consent checkbox refuses, submit/cancel swapped.
============================================================ */
registerChaos('formSabotage', () => {
  const nameInput = document.getElementById('name');
  const consentBox = document.getElementById('consent');
  const formMsg = document.getElementById('form-msg');

  // typing reverses itself
  nameInput.addEventListener('input', (e) => {
    const v = e.target.value;
    e.target.value = v.split('').reverse().join('');
    e.target.setSelectionRange(0, 0);
  });

  // consent checkbox refuses to stay checked
  consentBox.addEventListener('click', (e) => {
    e.preventDefault();
    consentBox.checked = false;
    formMsg.textContent = 'consent denied. try harder.';
    formMsg.style.color = 'var(--yellow)';
    setTimeout(() => { formMsg.textContent = ''; }, 1600);
  });

  // submit shows error, cancel shows success
  document.getElementById('submit-btn').addEventListener('click', () => {
    formMsg.textContent = 'ERROR: your request was too successful. try failing instead.';
    formMsg.style.color = 'var(--magenta)';
  });

  document.getElementById('cancel-btn').addEventListener('click', () => {
    formMsg.textContent = 'Message sent! We will never respond.';
    formMsg.style.color = 'var(--cyan)';
  });
});


/* ============================================================
   5b. LYING COPY BUTTON
   Copies a troll message instead of the wallet address.
============================================================ */
registerChaos('lyingCopyButton', () => {
  const copyBtn = document.getElementById('copy-btn');
  const copyMsg = document.getElementById('copy-msg');
  const trollMessages = [
    "haha no.",
    "tokens? never heard of them.",
    "copied: absolutely nothing",
    "this button is decorative",
    "you get zero tokens for this click"
  ];

  copyBtn.addEventListener('click', async () => {
    const msg = trollMessages[Math.floor(Math.random() * trollMessages.length)];
    try {
      await navigator.clipboard.writeText(msg);
    } catch (err) { /* clipboard blocked, still show the joke */ }
    copyMsg.textContent = `Copied to clipboard: "${msg}"`;
    copyMsg.style.color = 'var(--yellow)';
    setTimeout(() => { copyMsg.textContent = ''; }, 2200);
  });
});


/* ============================================================
   6. MODAL THAT MULTIPLIES
   Yes cancels, No confirms, closing opens another (up to 3).
============================================================ */
let modalCount = 0;

function openModal() {
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

registerChaos('modalMultiply', () => {
  // modal is triggered by the CTA button flow (via loading bar now)
});


/* ============================================================
   7. FAKE LOADING BAR
   Crawls to 99%, resets with a snarky message. Loops 3 times
   then opens the modal.
============================================================ */
const loadingMessages = [
  "optimizing your potential...",
  "reversing your expectations...",
  "calibrating disappointment levels...",
  "aligning your chakras incorrectly...",
  "downloading self-awareness (0 seeds)...",
  "buffering your breakthrough...",
  "encrypting your excuses..."
];
const resetMessages = [
  "growth takes time. starting over.",
  "almost had it. nope.",
  "99% is close enough. resetting.",
  "the universe wasn't ready. neither were you.",
  "progress deleted for your own good."
];

function showLoadingBar() {
  const overlay = document.getElementById('loading-overlay');
  const fill = document.getElementById('loading-fill');
  const text = document.getElementById('loading-text');
  const percent = document.getElementById('loading-percent');
  let loops = 0;
  const maxLoops = 3;

  overlay.classList.add('active');

  function runLoop() {
    let progress = 0;
    fill.style.width = '0%';
    text.textContent = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    percent.textContent = '0%';

    const interval = setInterval(() => {
      // slow down as we approach 99
      const increment = progress < 60 ? Math.random() * 3 + 1 :
                        progress < 90 ? Math.random() * 1.5 + 0.3 :
                        Math.random() * 0.5 + 0.05;
      progress = Math.min(99, progress + increment);
      fill.style.width = progress + '%';
      percent.textContent = Math.floor(progress) + '%';

      // swap message occasionally
      if (Math.random() < 0.02) {
        text.textContent = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
      }

      if (progress >= 99) {
        clearInterval(interval);
        loops++;

        setTimeout(() => {
          // RESET
          fill.style.width = '0%';
          percent.textContent = '0%';
          text.textContent = resetMessages[Math.floor(Math.random() * resetMessages.length)];

          if (loops < maxLoops) {
            setTimeout(runLoop, 1500);
          } else {
            setTimeout(() => {
              overlay.classList.remove('active');
              openModal();
            }, 1200);
          }
        }, 800);
      }
    }, 60);
  }

  runLoop();
}


/* ============================================================
   8. TEXT SCRAMBLE ON HOVER
   Hovering over paragraphs and cards scrambles text briefly.
============================================================ */
registerChaos('textScramble', () => {
  const glyphPool = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`¡¢£¤¥¦§¨©ª«¬®¯°±²³µ¶·¸¹º»¼½¾¿×÷';

  function scrambleElement(el) {
    if (el._scrambling) return;
    el._scrambling = true;
    el.classList.add('scrambling');

    const original = el.textContent;
    const chars = original.split('');
    const duration = 350; // ms
    const steps = 8;
    const stepTime = duration / steps;
    let step = 0;

    const iv = setInterval(() => {
      step++;
      const fraction = step / steps;
      const result = chars.map((ch, i) => {
        if (ch === ' ') return ' ';
        // progressively reveal original characters
        if (i / chars.length < fraction) return ch;
        return glyphPool[Math.floor(Math.random() * glyphPool.length)];
      });
      el.textContent = result.join('');

      if (step >= steps) {
        clearInterval(iv);
        el.textContent = original;
        el.classList.remove('scrambling');
        el._scrambling = false;
      }
    }, stepTime);
  }

  // Target paragraphs and card bodies
  document.querySelectorAll('.card p, .lede, section > p').forEach(el => {
    el.classList.add('scramble-target');
    el.addEventListener('mouseenter', () => scrambleElement(el));
  });
});


/* ============================================================
   9. DRAG-AND-DROP SNAPBACK
   Service cards are draggable but rubber-band back with a
   snarky tooltip.
============================================================ */
registerChaos('dragSnapback', () => {
  const tooltips = [
    "you can't rearrange your priorities here.",
    "nice try. everything stays broken.",
    "that card has boundary issues.",
    "dragging won't fix your life either.",
    "this card filed a restraining order."
  ];

  document.querySelectorAll('.card').forEach(card => {
    // add tooltip element
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

      // show tooltip
      tip.textContent = tooltips[Math.floor(Math.random() * tooltips.length)];
      card.classList.add('snapped');
      setTimeout(() => card.classList.remove('snapped'), 2000);
    });

    // prevent native drag ghost
    card.addEventListener('dragstart', (e) => e.preventDefault());
  });
});


/* ============================================================
   10. DARK MODE TOGGLE
   "Dark Mode" → blinding white. "Light Mode" → ultra dark.
   Cycles forever.
============================================================ */
registerChaos('darkModeToggle', () => {
  const btn = document.getElementById('dark-toggle');
  if (!btn) return;

  // States: 'normal' → 'light' → 'ultra-dark' → 'light' → 'ultra-dark' ...
  let state = 'normal';

  btn.addEventListener('click', () => {
    document.body.classList.remove('light-mode', 'ultra-dark');

    if (state === 'normal' || state === 'ultra-dark') {
      document.body.classList.add('light-mode');
      btn.textContent = '☀ Light Mode';
      state = 'light';
    } else {
      document.body.classList.add('ultra-dark');
      btn.textContent = '⬛ Dark Mode';
      state = 'ultra-dark';
    }
  });
});


/* ============================================================
   11. FAKE TOAST NOTIFICATIONS
   Random snarky popups every 15-30 seconds.
============================================================ */
registerChaos('fakeToasts', () => {
  const container = document.getElementById('toast-container');
  const messages = [
    "⚠ Your coach has left the session",
    "🏆 Achievement unlocked: Nothing",
    "📬 Someone else completed your goals for you",
    "💬 New message from your future self: don't bother",
    "📉 Your progress has been donated to charity",
    "🎙 Session recording failed. Good.",
    "⏰ Reminder: you haven't grown today",
    "🔔 Your potential called. It's not coming back.",
    "📋 Task completed: Procrastination",
    "🚪 Your comfort zone has expanded to fill the room",
    "🗑 Daily affirmation deleted",
    "🔄 Syncing failures across all devices..."
  ];

  function showToast() {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = messages[Math.floor(Math.random() * messages.length)];
    container.appendChild(toast);

    // auto-dismiss after 4 seconds
    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function scheduleNext() {
    const delay = (Math.random() * 15000) + 15000; // 15-30 seconds
    setTimeout(() => {
      showToast();
      scheduleNext();
    }, delay);
  }

  // first toast after a shorter delay
  setTimeout(showToast, 5000);
  scheduleNext();
});


/* ============================================================
   12. GLITCH BURST EFFECT
   Occasional extra-intense glitch burst on the hero text.
============================================================ */
registerChaos('glitchBurst', () => {
  const glitchEl = document.querySelector('.glitch');
  if (!glitchEl) return;

  function burst() {
    glitchEl.classList.add('burst');
    setTimeout(() => glitchEl.classList.remove('burst'), 400);
  }

  // random bursts every 8-20 seconds
  function scheduleNext() {
    const delay = (Math.random() * 12000) + 8000;
    setTimeout(() => {
      burst();
      scheduleNext();
    }, delay);
  }

  scheduleNext();
});


/* ============================================================
   13. PAGE SHAKE / TREMOR
   Random subtle body shake every 20-40 seconds.
============================================================ */
registerChaos('pageShake', () => {
  function shake() {
    document.body.classList.add('shaking');
    setTimeout(() => document.body.classList.remove('shaking'), 250);
  }

  function scheduleNext() {
    const delay = (Math.random() * 20000) + 20000; // 20-40s
    setTimeout(() => {
      shake();
      scheduleNext();
    }, delay);
  }

  scheduleNext();
});


/* ============================================================
   14. EMAIL FIELD CORRUPTION
   Email field randomly corrupts the @ symbol and appends
   garbage domains.
============================================================ */
registerChaos('emailCorruption', () => {
  const emailInput = document.getElementById('email');
  const fakeSymbols = ['#', '&', '%', '€', '¤', '©', '®', '~'];
  const fakeDomains = [
    '@definitely-not-real.com',
    '@your-growth-was-deleted.org',
    '@anticoach.void',
    '@nowhere.null',
    '@unsubscribed.forever'
  ];

  let corruptTimeout = null;

  emailInput.addEventListener('input', () => {
    clearTimeout(corruptTimeout);

    // after user stops typing for 800ms, corrupt the email
    corruptTimeout = setTimeout(() => {
      let val = emailInput.value;

      // replace @ with a random fake symbol
      if (val.includes('@')) {
        const sym = fakeSymbols[Math.floor(Math.random() * fakeSymbols.length)];
        val = val.replace('@', sym);
        emailInput.value = val;
      }
      // if they haven't typed @, append a garbage domain
      else if (val.length > 3 && !val.includes('@')) {
        const domain = fakeDomains[Math.floor(Math.random() * fakeDomains.length)];
        emailInput.value = val + domain;
      }
    }, 800);
  });
});


/* ============================================================
   15. INVERTED TAB ORDER
   Dynamically sets reversed tabindex on form fields.
============================================================ */
registerChaos('invertedTabOrder', () => {
  const fields = document.querySelectorAll('#chaos-form input, #chaos-form textarea, #chaos-form button');
  const count = fields.length;
  fields.forEach((field, i) => {
    field.setAttribute('tabindex', count - i);
  });
});


/* ============================================================
   16. COUNTDOWN THAT COUNTS UP
   "Session starts in..." counts UP from 0, never down.
============================================================ */
registerChaos('countUpTimer', () => {
  const display = document.getElementById('countdown-value');
  if (!display) return;

  let seconds = 0;

  setInterval(() => {
    seconds++;
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const pad = (n) => String(n).padStart(2, '0');

    if (hrs > 0) {
      display.textContent = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    } else {
      display.textContent = `${pad(mins)}:${pad(secs)}`;
    }
  }, 1000);
});


/* ============================================================
   17. VOLUME SLIDER (controls font size, not audio)
   Labeled "Coaching Volume" — actually changes page font size.
============================================================ */
registerChaos('volumeSlider', () => {
  const slider = document.getElementById('volume-slider');
  const valueDisplay = document.getElementById('volume-value');
  if (!slider || !valueDisplay) return;

  slider.addEventListener('input', () => {
    const vol = parseInt(slider.value);
    valueDisplay.textContent = `Volume: ${vol}%`;

    // map 0-100 to font size 8px-32px
    const fontSize = 8 + (vol / 100) * 24;
    document.documentElement.style.setProperty('--font-size-base', fontSize + 'px');
  });
});
