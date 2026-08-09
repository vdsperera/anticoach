/* ============================================================
   ANTICOACH — script.js
   Chaos module system + Crowdfunded UX Repairs (Bounty System).
============================================================ */

/* ---------- BOUNTY MANAGER ---------- */
const bountyData = {
  invertedCursor: { title: "Fix Inverted Mouse Cursor", target: 50, initial: 35, desc: "Restores normal 1:1 mouse movement so moving right moves right." },
  reverseScroll: { title: "Fix Reverse Page Scroll", target: 35, initial: 20, desc: "Restores standard scroll direction." },
  evasiveButton: { title: "Fix Evasive CTA Button", target: 25, initial: 15, desc: "Stops the 'Start Your Journey' button from running away." },
  formSabotage: { title: "Fix Intake Form Sabotage", target: 40, initial: 10, desc: "Allows live typing without text reversal and lets form submit." },
  lyingCopyButton: { title: "Fix Wallet Copy Button", target: 15, initial: 15, desc: "Makes 'Copy Address' copy the real ERC-20 wallet address." },
  textScramble: { title: "Fix Text Hover Scramble", target: 20, initial: 5, desc: "Stops text from scrambling into glyphs when hovered." },
  fakeToasts: { title: "Fix Annoying Popup Toasts", target: 30, initial: 12, desc: "Mutes random snarky popup notifications." },
  darkModeToggle: { title: "Fix Dark Mode Toggle", target: 15, initial: 8, desc: "Turns Dark Mode into a clean, working theme switcher." },
  emailCorruption: { title: "Fix Email Field Corruption", target: 20, initial: 0, desc: "Prevents email field text corruption and fake domains." },
  countUpTimer: { title: "Fix Session Countdown", target: 10, initial: 10, desc: "Fixes session timer to display clean status." },
  volumeSlider: { title: "Fix Coaching Volume Slider", target: 10, initial: 2, desc: "Prevents volume slider from warping site font size." }
};

function getSavedFunds() {
  try {
    return JSON.parse(localStorage.getItem('anticoach_bounty_funds')) || {};
  } catch (e) {
    return {};
  }
}

function saveFunds(funds) {
  try {
    localStorage.setItem('anticoach_bounty_funds', JSON.stringify(funds));
  } catch (e) {}
}

function getFunds(id) {
  const saved = getSavedFunds();
  if (saved[id] !== undefined) return saved[id];
  return bountyData[id] ? bountyData[id].initial : 0;
}

function isFixed(id) {
  if (!bountyData[id]) return false;
  return getFunds(id) >= bountyData[id].target;
}

function addFunds(id, amount) {
  if (!bountyData[id]) return;
  const current = getFunds(id);
  const updated = Math.min(bountyData[id].target, current + amount);
  const saved = getSavedFunds();
  saved[id] = updated;
  saveFunds(saved);
  renderBountyUI();
}

function resetAllBounties() {
  localStorage.removeItem('anticoach_bounty_funds');
  renderBountyUI();
}

function renderBountyUI() {
  const grid = document.getElementById('bounty-grid');
  const totalRaisedEl = document.getElementById('total-raised-usdt');
  const solvedCountEl = document.getElementById('bounties-solved-count');
  if (!grid) return;

  grid.innerHTML = '';
  let totalRaised = 0;
  let solvedCount = 0;
  const keys = Object.keys(bountyData);

  keys.forEach(id => {
    const item = bountyData[id];
    const funds = getFunds(id);
    totalRaised += funds;
    const fixed = funds >= item.target;
    if (fixed) solvedCount++;

    const percent = Math.min(100, Math.floor((funds / item.target) * 100));

    const card = document.createElement('div');
    card.className = `bounty-card ${fixed ? 'fixed' : ''}`;
    card.innerHTML = `
      <div>
        <div class="bounty-card-header">
          <h3>${item.title}</h3>
          <span class="bounty-status ${fixed ? 'repaired' : 'broken'}">
            ${fixed ? '✓ REPAIRED' : '⚠ BROKEN'}
          </span>
        </div>
        <p class="bounty-desc">${item.desc}</p>
      </div>

      <div>
        <div class="bounty-progress-wrap">
          <div class="bounty-progress-text">
            <span>Funding Progress</span>
            <span>$${funds.toFixed(2)} / $${item.target.toFixed(2)} USDT (${percent}%)</span>
          </div>
          <div class="bounty-progress-bar">
            <div class="bounty-progress-fill" style="width: ${percent}%"></div>
          </div>
        </div>

        <div class="bounty-actions">
          ${fixed ? 
            `<button class="btn btn-simulate" style="opacity: 0.6; cursor: default;" disabled>Fully Funded</button>` :
            `<button class="btn btn-simulate" data-simulate="${id}">+ $10 USDT (Simulate)</button>`
          }
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  if (totalRaisedEl) totalRaisedEl.textContent = `$${totalRaised.toFixed(2)} USDT`;
  if (solvedCountEl) solvedCountEl.textContent = `${solvedCount} / ${keys.length}`;

  grid.querySelectorAll('[data-simulate]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.simulate;
      addFunds(id, 10);
    });
  });
}


/* ---------- MODULE REGISTRY ---------- */
const chaosModules = [];

function registerChaos(name, initFn) {
  chaosModules.push({ name, init: initFn });
}

document.addEventListener('DOMContentLoaded', () => {
  renderBountyUI();
  const resetBtn = document.getElementById('reset-bounties-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetAllBounties();
    });
  }

  chaosModules.forEach(m => {
    try { m.init(); }
    catch (err) { console.warn(`[ANTICOACH] Module "${m.name}" failed:`, err); }
  });
});


/* ============================================================
   1. INVERTED CURSOR
   Real cursor hidden. Fake cursor moves opposite to real mouse
   deltas (unless fixed by USDT bounty!).
============================================================ */
registerChaos('invertedCursor', () => {
  const fakeCursor = document.getElementById('fake-cursor');

  let fx = window.innerWidth / 2;
  let fy = window.innerHeight / 2;
  let lastX = null, lastY = null;

  fakeCursor.style.transform = `translate(${fx}px, ${fy}px) translate(-50%,-50%)`;

  document.addEventListener('mousemove', (e) => {
    if (isFixed('invertedCursor')) {
      fx = e.clientX;
      fy = e.clientY;
      fakeCursor.style.transform = `translate(${fx}px, ${fy}px) translate(-50%,-50%)`;
      return;
    }

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

  window._fakeCursor = { getPos: () => ({ x: fx, y: fy }) };
});


/* ============================================================
   2. REVERSE SCROLL
   Wheel events intercepted; scroll direction flipped.
============================================================ */
registerChaos('reverseScroll', () => {
  window.addEventListener('wheel', (e) => {
    if (isFixed('reverseScroll')) return;
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
      let targetId = link.dataset.target;
      const target = document.getElementById(targetId);
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
  if (isFixed('evasiveButton')) return;
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
  setInterval(() => {
    document.querySelectorAll('.dodge').forEach(btn => {
      if (isFixed('evasiveButton')) {
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
});


/* ============================================================
   5. FORM SABOTAGE
   Typing reverses, consent checkbox refuses, submit/cancel swapped.
============================================================ */
registerChaos('formSabotage', () => {
  const nameInput = document.getElementById('name');
  const consentBox = document.getElementById('consent');
  const formMsg = document.getElementById('form-msg');

  nameInput.addEventListener('input', (e) => {
    if (isFixed('formSabotage')) return;
    const v = e.target.value;
    e.target.value = v.split('').reverse().join('');
    e.target.setSelectionRange(0, 0);
  });

  consentBox.addEventListener('click', (e) => {
    if (isFixed('formSabotage')) return;
    e.preventDefault();
    consentBox.checked = false;
    formMsg.textContent = 'consent denied. try harder.';
    formMsg.style.color = 'var(--yellow)';
    setTimeout(() => { formMsg.textContent = ''; }, 1600);
  });

  document.getElementById('submit-btn').addEventListener('click', () => {
    if (isFixed('formSabotage')) {
      formMsg.textContent = 'Success! Your session has been booked cleanly.';
      formMsg.style.color = 'var(--cyan)';
      return;
    }
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
    if (isFixed('lyingCopyButton')) {
      const realAddress = document.getElementById('wallet-address').textContent.trim();
      try {
        await navigator.clipboard.writeText(realAddress);
      } catch (err) {}
      copyMsg.textContent = `Copied real wallet address: "${realAddress}"`;
      copyMsg.style.color = 'var(--cyan)';
      setTimeout(() => { copyMsg.textContent = ''; }, 3000);
      return;
    }

    const msg = trollMessages[Math.floor(Math.random() * trollMessages.length)];
    try {
      await navigator.clipboard.writeText(msg);
    } catch (err) {}
    copyMsg.textContent = `Copied to clipboard: "${msg}"`;
    copyMsg.style.color = 'var(--yellow)';
    setTimeout(() => { copyMsg.textContent = ''; }, 2200);
  });
});


/* ============================================================
   6. MODAL THAT MULTIPLIES
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

registerChaos('modalMultiply', () => {});


/* ============================================================
   7. FAKE LOADING BAR
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
      const increment = progress < 60 ? Math.random() * 3 + 1 :
                        progress < 90 ? Math.random() * 1.5 + 0.3 :
                        Math.random() * 0.5 + 0.05;
      progress = Math.min(99, progress + increment);
      fill.style.width = progress + '%';
      percent.textContent = Math.floor(progress) + '%';

      if (Math.random() < 0.02) {
        text.textContent = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
      }

      if (progress >= 99) {
        clearInterval(interval);
        loops++;

        setTimeout(() => {
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
============================================================ */
registerChaos('textScramble', () => {
  const glyphPool = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`¡¢£¤¥¦§¨©ª«¬®¯°±²³µ¶·¸¹º»¼½¾¿×÷';

  function scrambleElement(el) {
    if (isFixed('textScramble')) return;
    if (el._scrambling) return;
    el._scrambling = true;
    el.classList.add('scrambling');

    const original = el.textContent;
    const chars = original.split('');
    const duration = 350;
    const steps = 8;
    const stepTime = duration / steps;
    let step = 0;

    const iv = setInterval(() => {
      step++;
      const fraction = step / steps;
      const result = chars.map((ch, i) => {
        if (ch === ' ') return ' ';
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

  document.querySelectorAll('.card p, .lede, section > p').forEach(el => {
    el.classList.add('scramble-target');
    el.addEventListener('mouseenter', () => scrambleElement(el));
  });
});


/* ============================================================
   9. DRAG-AND-DROP SNAPBACK
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
});


/* ============================================================
   10. DARK MODE TOGGLE
============================================================ */
registerChaos('darkModeToggle', () => {
  const btn = document.getElementById('dark-toggle');
  if (!btn) return;

  let state = 'normal';

  btn.addEventListener('click', () => {
    if (isFixed('darkModeToggle')) {
      document.body.classList.remove('ultra-dark');
      document.body.classList.toggle('light-mode');
      btn.textContent = document.body.classList.contains('light-mode') ? '☀ Light Mode' : '☾ Dark Mode';
      return;
    }

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
    if (isFixed('fakeToasts')) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = messages[Math.floor(Math.random() * messages.length)];
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function scheduleNext() {
    const delay = (Math.random() * 15000) + 15000;
    setTimeout(() => {
      showToast();
      scheduleNext();
    }, delay);
  }

  setTimeout(showToast, 5000);
  scheduleNext();
});


/* ============================================================
   12. GLITCH BURST EFFECT
============================================================ */
registerChaos('glitchBurst', () => {
  const glitchEl = document.querySelector('.glitch');
  if (!glitchEl) return;

  function burst() {
    glitchEl.classList.add('burst');
    setTimeout(() => glitchEl.classList.remove('burst'), 400);
  }

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
============================================================ */
registerChaos('pageShake', () => {
  function shake() {
    document.body.classList.add('shaking');
    setTimeout(() => document.body.classList.remove('shaking'), 250);
  }

  function scheduleNext() {
    const delay = (Math.random() * 20000) + 20000;
    setTimeout(() => {
      shake();
      scheduleNext();
    }, delay);
  }

  scheduleNext();
});


/* ============================================================
   14. EMAIL FIELD CORRUPTION
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
    if (isFixed('emailCorruption')) return;
    clearTimeout(corruptTimeout);

    corruptTimeout = setTimeout(() => {
      let val = emailInput.value;

      if (val.includes('@')) {
        const sym = fakeSymbols[Math.floor(Math.random() * fakeSymbols.length)];
        val = val.replace('@', sym);
        emailInput.value = val;
      }
      else if (val.length > 3 && !val.includes('@')) {
        const domain = fakeDomains[Math.floor(Math.random() * fakeDomains.length)];
        emailInput.value = val + domain;
      }
    }, 800);
  });
});


/* ============================================================
   15. INVERTED TAB ORDER
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
============================================================ */
registerChaos('countUpTimer', () => {
  const display = document.getElementById('countdown-value');
  if (!display) return;

  let seconds = 0;

  setInterval(() => {
    if (isFixed('countUpTimer')) {
      display.textContent = '15:00 (Active)';
      return;
    }
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
   17. VOLUME SLIDER
============================================================ */
registerChaos('volumeSlider', () => {
  const slider = document.getElementById('volume-slider');
  const valueDisplay = document.getElementById('volume-value');
  if (!slider || !valueDisplay) return;

  slider.addEventListener('input', () => {
    if (isFixed('volumeSlider')) {
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
