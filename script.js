/* ============================================================
   ANTICOACH — script.js
   Chaos module system + Life Struggles Bounty System + Web3.
============================================================ */

/* ---------- GLOBAL CHAOS FEATURE TOGGLES ---------- */
/*
  Set any feature to true to enable chaos, or false to disable it globally.
  If set to true, it can also be dynamically repaired when visitors fund its
  USDT bounty target!
*/
const chaosFeatureToggles = {
  invertedCursor: true,
  reverseScroll: true,
  menuRedirection: true,
  evasiveButton: true,
  formSabotage: true,
  lyingCopyButton: true,
  modalMultiply: true,
  fakeLoadingBar: true,
  textScramble: true,
  dragSnapback: true,
  darkModeToggle: true,
  fakeToasts: true,
  glitchBurst: true,
  pageShake: true,
  emailCorruption: true,
  invertedTabOrder: true,
  countUpTimer: true,
  volumeSlider: true,

  // NEW CHAOS MODULES
  upsideDownScroll: true,
  modalHydra: true,
  uiGravity: true,
  fontScramble: true,
  customContextMenu: true,
  focusDrift: true,
  ghostBackspace: true,
  glitchAudio: true
};

function isChaosActive(id) {
  // If explicitly disabled in config, or if fixed by bounty, chaos is inactive
  if (chaosFeatureToggles[id] === false) return false;
  return !isFixed(id);
}


/* ---------- BOUNTY CONFIG (Life Struggles Mapping) ---------- */
const bountyConfig = [
  {
    id: 'invertedCursor',
    bugTitle: 'Inverted Mouse Cursor',
    lifeIssue: 'Family Emergency Fund',
    lifeDesc: 'Critical family situation requiring emergency financial support. This is the most urgent thing in my life right now.',
    priority: 'CRITICAL',
    targetUSDT: 30000,
    initialUSDT: 0
  },
  {
    id: 'reverseScroll',
    bugTitle: 'Reverse Page Scroll',
    lifeIssue: 'Outstanding Debt & Bills',
    lifeDesc: 'Accumulated debt and overdue bills that keep piling up — just like this page scrolls the wrong way, my finances move backwards.',
    priority: 'CRITICAL',
    targetUSDT: 5000,
    initialUSDT: 0
  },
  {
    id: 'upsideDownScroll',
    bugTitle: 'Upside-Down Page Flip',
    lifeIssue: 'Impending Burnout & Overwork',
    lifeDesc: 'Pushing too hard turns your whole world upside down. Need to manage stress and workload before life flips completely.',
    priority: 'CRITICAL',
    targetUSDT: 4000,
    initialUSDT: 0
  },
  {
    id: 'formSabotage',
    bugTitle: 'Form Input Sabotage',
    lifeIssue: 'Laptop/PC Upgrade for Work',
    lifeDesc: 'My current setup sabotages my productivity the same way this form sabotages your input. Need a proper workstation to build a future.',
    priority: 'HIGH',
    targetUSDT: 2000,
    initialUSDT: 0
  },
  {
    id: 'modalHydra',
    bugTitle: 'Modal Hydra Multiplication',
    lifeIssue: 'Multi-Tasking Overload',
    lifeDesc: 'Solving one problem only creates two more. Need breathing room to handle issues one at a time.',
    priority: 'HIGH',
    targetUSDT: 1800,
    initialUSDT: 0
  },
  {
    id: 'evasiveButton',
    bugTitle: 'Evasive CTA Button',
    lifeIssue: 'Online Course & Education',
    lifeDesc: 'Opportunities keep running away from me like this button runs from your cursor. Investing in education to catch them.',
    priority: 'HIGH',
    targetUSDT: 1500,
    initialUSDT: 0
  },
  {
    id: 'uiGravity',
    bugTitle: 'UI Elements Fall to Floor',
    lifeIssue: 'Collapsing Infrastructure & Car Repairs',
    lifeDesc: 'Everything feels like it is falling apart at the seams. Need funds for emergency vehicle and home maintenance.',
    priority: 'HIGH',
    targetUSDT: 1400,
    initialUSDT: 0
  },
  {
    id: 'fakeToasts',
    bugTitle: 'Annoying Popup Toasts',
    lifeIssue: 'Health Insurance & Medical',
    lifeDesc: 'Unexpected health concerns pop up like these annoying notifications — need proper coverage to handle them.',
    priority: 'MEDIUM',
    targetUSDT: 1200,
    initialUSDT: 0
  },
  {
    id: 'darkModeToggle',
    bugTitle: 'Broken Dark Mode Toggle',
    lifeIssue: 'PlayStation 5 (Mental Health & Fun)',
    lifeDesc: 'Life needs a break sometimes. A PS5 for unwinding and mental reset — because even dark mode should work properly.',
    priority: 'MEDIUM',
    targetUSDT: 1000,
    initialUSDT: 0
  },
  {
    id: 'fontScramble',
    bugTitle: 'Font Family Sabotage',
    lifeIssue: 'Imposter Syndrome & Confidence',
    lifeDesc: 'Everything feels fake and unprofessional under pressure. Working on mental confidence and clarity.',
    priority: 'MEDIUM',
    targetUSDT: 800,
    initialUSDT: 0
  },
  {
    id: 'customContextMenu',
    bugTitle: 'Right-Click Context Sabotage',
    lifeIssue: 'Bad Advice & Unhelpful Guidance',
    lifeDesc: 'Surrounded by unhelpful options when looking for solutions. Seeking genuine mentorship.',
    priority: 'MEDIUM',
    targetUSDT: 600,
    initialUSDT: 0
  },
  {
    id: 'emailCorruption',
    bugTitle: 'Email Field Corruption',
    lifeIssue: 'Proper Domain & Hosting',
    lifeDesc: 'My online presence is as corrupted as this email field. Need proper hosting and a real domain to build credibility.',
    priority: 'LOW',
    targetUSDT: 500,
    initialUSDT: 0
  },
  {
    id: 'textScramble',
    bugTitle: 'Text Hover Scramble',
    lifeIssue: 'GoPro for Content Creation',
    lifeDesc: 'Want to create content but everything I try to capture comes out scrambled. A GoPro would help me tell my story clearly.',
    priority: 'LOW',
    targetUSDT: 400,
    initialUSDT: 0
  },
  {
    id: 'focusDrift',
    bugTitle: 'Random Zoom Focus Drift',
    lifeIssue: 'ADHD & Brain Fog Management',
    lifeDesc: 'Focus drifts in and out uncontrollably. Wellness fund for attention management tools.',
    priority: 'LOW',
    targetUSDT: 300,
    initialUSDT: 0
  },
  {
    id: 'lyingCopyButton',
    bugTitle: 'Lying Copy Button',
    lifeIssue: 'Quality Microphone for Content',
    lifeDesc: 'My voice deserves to be heard clearly, not copied wrong. A quality mic for podcasts and content creation.',
    priority: 'LOW',
    targetUSDT: 250,
    initialUSDT: 0
  },
  {
    id: 'countUpTimer',
    bugTitle: 'Countdown Timer Counts Up',
    lifeIssue: 'Monthly Groceries & Food Fund',
    lifeDesc: 'Time keeps ticking and the fridge keeps emptying. This fund helps keep food on the table.',
    priority: 'LOW',
    targetUSDT: 200,
    initialUSDT: 0
  },
  {
    id: 'ghostBackspace',
    bugTitle: 'Ghost Backspace in Inputs',
    lifeIssue: 'Communication & Tech Obstacles',
    lifeDesc: 'Every time I try to express myself, things get deleted or miscommunicated.',
    priority: 'LOW',
    targetUSDT: 150,
    initialUSDT: 0
  },
  {
    id: 'glitchAudio',
    bugTitle: 'Annoying Glitch Audio Bleeps',
    lifeIssue: 'Noise-Cancelling Headphones',
    lifeDesc: 'Constant noise disrupting focus. Need proper noise-cancelling equipment for deep work.',
    priority: 'LOW',
    targetUSDT: 120,
    initialUSDT: 0
  },
  {
    id: 'volumeSlider',
    bugTitle: 'Volume Slider Warps Font',
    lifeIssue: 'Streaming Subscription Bundle',
    lifeDesc: 'Small comfort that keeps the volume of life manageable. Netflix, Spotify, the basics.',
    priority: 'LOW',
    targetUSDT: 100,
    initialUSDT: 0
  }
];

// Build lookup map from config
const bountyData = {};
bountyConfig.forEach(item => {
  bountyData[item.id] = {
    title: item.bugTitle,
    lifeIssue: item.lifeIssue,
    lifeDesc: item.lifeDesc,
    priority: item.priority,
    target: item.targetUSDT,
    initial: item.initialUSDT
  };
});

const priorityMeta = {
  CRITICAL: { emoji: '🔴', color: 'var(--magenta)', label: 'CRITICAL' },
  HIGH:     { emoji: '🟡', color: 'var(--yellow)',  label: 'HIGH' },
  MEDIUM:   { emoji: '🟡', color: 'var(--yellow)',  label: 'MEDIUM' },
  LOW:      { emoji: '🟢', color: 'var(--cyan)',    label: 'LOW' }
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

function formatUSDT(val) {
  if (val >= 1000) return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  return '$' + val.toFixed(2);
}

function renderBountyUI() {
  const grid = document.getElementById('bounty-grid');
  const totalRaisedEl = document.getElementById('total-raised-usdt');
  const solvedCountEl = document.getElementById('bounties-solved-count');
  if (!grid) return;

  grid.innerHTML = '';
  let totalRaised = 0;
  let solvedCount = 0;

  bountyConfig.forEach(cfg => {
    const id = cfg.id;
    const item = bountyData[id];
    const funds = getFunds(id);
    totalRaised += funds;
    const fixed = funds >= item.target;
    if (fixed) solvedCount++;

    const percent = Math.min(100, Math.floor((funds / item.target) * 100));
    const pm = priorityMeta[item.priority] || priorityMeta.LOW;

    const card = document.createElement('div');
    card.className = `bounty-card ${fixed ? 'fixed' : ''} priority-${item.priority.toLowerCase()}`;
    card.innerHTML = `
      <div>
        <div class="bounty-card-header">
          <div>
            <span class="bounty-priority" style="color: ${pm.color}">${pm.emoji} ${pm.label}</span>
            <h3>${item.lifeIssue}</h3>
          </div>
          <span class="bounty-status ${fixed ? 'repaired' : 'broken'}">
            ${fixed ? '✓ FIXED' : '⚠ STRUGGLING'}
          </span>
        </div>
        <p class="bounty-desc">${item.lifeDesc}</p>
        <p class="bounty-bug-label">🔧 Website Bug: <em>${item.title}</em></p>
      </div>

      <div>
        <div class="bounty-progress-wrap">
          <div class="bounty-progress-text">
            <span>Funding Progress</span>
            <span>${formatUSDT(funds)} / ${formatUSDT(item.target)} USDT (${percent}%)</span>
          </div>
          <div class="bounty-progress-bar">
            <div class="bounty-progress-fill" style="width: ${percent}%"></div>
          </div>
        </div>

        <div class="bounty-actions">
          ${fixed ?
            `<button class="btn btn-simulate" style="opacity: 0.6; cursor: default;" disabled>✓ Life Issue Resolved</button>` :
            `<button class="btn btn-donate-card" data-donate="${id}">💎 Donate USDT</button>
             <button class="btn btn-simulate" data-simulate="${id}">+$10 Simulate</button>`
          }
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  if (totalRaisedEl) totalRaisedEl.textContent = `${formatUSDT(totalRaised)} USDT`;
  if (solvedCountEl) solvedCountEl.textContent = `${solvedCount} / ${bountyConfig.length}`;

  grid.querySelectorAll('[data-donate]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.donate;
      openDonationModal(id);
    });
  });

  grid.querySelectorAll('[data-simulate]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.simulate;
      addFunds(id, 10);
    });
  });
}


/* ---------- WEB3 DONATION MANAGER ---------- */
let activeDonationCategoryId = null;

function initDonationModal() {
  const modal = document.getElementById('donation-modal');
  const closeBtn = document.getElementById('donation-modal-close');
  const customAmountInput = document.getElementById('custom-donation-amount');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const toggleQrBtn = document.getElementById('btn-toggle-qr');
  const qrPanel = document.getElementById('qr-panel');
  const modalCopyBtn = document.getElementById('modal-copy-address-btn');
  const web3PayBtn = document.getElementById('btn-web3-connect-pay');
  const msgEl = document.getElementById('donation-msg');

  if (!modal) return;

  const closeModal = () => {
    modal.style.display = 'none';
    if (msgEl) msgEl.textContent = '';
    if (qrPanel) qrPanel.style.display = 'none';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const amount = btn.dataset.amount;
      if (customAmountInput) customAmountInput.value = amount;
    });
  });

  if (customAmountInput) {
    customAmountInput.addEventListener('input', () => {
      const val = customAmountInput.value;
      presetBtns.forEach(b => {
        b.classList.toggle('active', b.dataset.amount === val);
      });
    });
  }

  if (toggleQrBtn && qrPanel) {
    toggleQrBtn.addEventListener('click', () => {
      qrPanel.style.display = qrPanel.style.display === 'none' ? 'block' : 'none';
    });
  }

  if (modalCopyBtn) {
    modalCopyBtn.addEventListener('click', async () => {
      const addr = '0x32f6f912133d4c36879c79a1415f2e1fb39432ee';
      try {
        await navigator.clipboard.writeText(addr);
        modalCopyBtn.textContent = '✓ Copied Address!';
        setTimeout(() => { modalCopyBtn.textContent = 'Copy Wallet Address'; }, 2000);
      } catch (err) {
        modalCopyBtn.textContent = 'Failed to copy';
      }
    });
  }

  if (web3PayBtn) {
    web3PayBtn.addEventListener('click', async () => {
      const amount = parseFloat(customAmountInput.value) || 25;
      if (!activeDonationCategoryId) return;

      msgEl.textContent = 'Connecting Web3 wallet...';
      msgEl.style.color = 'var(--cyan)';

      if (typeof window.ethereum === 'undefined') {
        msgEl.textContent = 'No Web3 wallet detected (MetaMask, Rabby, etc.). Please use the QR code or copy address below!';
        msgEl.style.color = 'var(--yellow)';
        if (qrPanel) qrPanel.style.display = 'block';
        return;
      }

      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const sender = accounts[0];
        
        msgEl.textContent = `Wallet connected: ${sender.substring(0, 6)}...${sender.substring(38)}. Initiating transfer...`;
        msgEl.style.color = 'var(--cyan)';

        const recipient = '0x32f6f912133d4c36879c79a1415f2e1fb39432ee';

        if (typeof ethers !== 'undefined') {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();

          const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
          const erc20Abi = ["function transfer(address to, uint256 amount) returns (bool)"];
          
          try {
            const usdtContract = new ethers.Contract(usdtAddress, erc20Abi, signer);
            const amountInUnits = ethers.parseUnits(amount.toString(), 6);
            const tx = await usdtContract.transfer(recipient, amountInUnits);
            msgEl.textContent = `Transaction sent! TxHash: ${tx.hash.substring(0, 10)}... Waiting for confirmation...`;
            await tx.wait(1);
          } catch (ercErr) {
            console.log('ERC20 transfer fallback to direct sendTransaction');
            await window.ethereum.request({
              method: 'eth_sendTransaction',
              params: [{
                from: sender,
                to: recipient,
                value: '0x0'
              }]
            });
          }
        }

        addFunds(activeDonationCategoryId, amount);
        msgEl.textContent = `🎉 Thank you! Received $${amount} USDT contribution for this issue!`;
        msgEl.style.color = 'var(--cyan)';

        setTimeout(closeModal, 2500);

      } catch (err) {
        console.error('Web3 error:', err);
        msgEl.textContent = `Payment cancelled or error: ${err.message || 'User rejected'}`;
        msgEl.style.color = 'var(--magenta)';
      }
    });
  }
}

function openDonationModal(id) {
  activeDonationCategoryId = id;
  const item = bountyData[id];
  if (!item) return;

  const modal = document.getElementById('donation-modal');
  const priorityEl = document.getElementById('donation-modal-priority');
  const titleEl = document.getElementById('donation-modal-title');
  const descEl = document.getElementById('donation-modal-desc');
  const msgEl = document.getElementById('donation-msg');

  if (priorityEl) priorityEl.textContent = `/// ${item.priority}`;
  if (titleEl) titleEl.textContent = `Donate to Fix: ${item.lifeIssue}`;
  if (descEl) descEl.textContent = item.lifeDesc;
  if (msgEl) msgEl.textContent = '';

  if (modal) modal.style.display = 'flex';
}


/* ---------- ON-CHAIN SMART CONTRACT INTEGRATION ---------- */
const ANTICOACH_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

const ANTICOACH_CONTRACT_ABI = [
  "function getAllCategoryTotals() external view returns (uint256[11] memory)",
  "function categoryRaisedUSDT(uint8 categoryId) external view returns (uint256)",
  "function donateToGoal(uint8 categoryId, uint256 usdtAmount) external"
];

const PUBLIC_RPC_URLS = [
  "https://polygon-rpc.com",
  "https://rpc.ankr.com/polygon",
  "https://bsc-dataseed.binance.org"
];

async function fetchOnChainBountyTotals() {
  if (ANTICOACH_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    return;
  }

  if (typeof ethers === 'undefined') return;

  for (const rpcUrl of PUBLIC_RPC_URLS) {
    try {
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const contract = new ethers.Contract(ANTICOACH_CONTRACT_ADDRESS, ANTICOACH_CONTRACT_ABI, provider);
      const totals = await contract.getAllCategoryTotals();

      bountyConfig.forEach((cfg, idx) => {
        if (totals[idx] !== undefined) {
          const usdtVal = parseFloat(ethers.formatUnits(totals[idx], 6));
          const id = cfg.id;
          const currentLocal = getFunds(id);
          if (usdtVal > currentLocal) {
            const saved = getSavedFunds();
            saved[id] = usdtVal;
            saveFunds(saved);
          }
        }
      });

      renderBountyUI();
      break;
    } catch (err) {
      console.warn(`[ANTICOACH] On-chain RPC fetch failed on ${rpcUrl}, trying next...`, err);
    }
  }
}


/* ---------- MODULE REGISTRY ---------- */
const chaosModules = [];

function registerChaos(name, initFn) {
  chaosModules.push({ name, init: initFn });
}

document.addEventListener('DOMContentLoaded', () => {
  renderBountyUI();
  initDonationModal();
  fetchOnChainBountyTotals();
  setInterval(fetchOnChainBountyTotals, 15000);

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
============================================================ */
registerChaos('invertedCursor', () => {
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
});


/* ============================================================
   2. REVERSE SCROLL
============================================================ */
registerChaos('reverseScroll', () => {
  window.addEventListener('wheel', (e) => {
    if (!isChaosActive('reverseScroll')) return;
    e.preventDefault();
    window.scrollBy({ top: -e.deltaY, left: -e.deltaX, behavior: 'auto' });
  }, { passive: false });
});


/* ============================================================
   3. MENU REDIRECTION
============================================================ */
registerChaos('menuRedirection', () => {
  document.querySelectorAll('nav a[data-target]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      let targetId = link.dataset.target;
      if (!isChaosActive('menuRedirection')) {
        const label = link.textContent.trim().toLowerCase();
        if (label.includes('home')) targetId = 'home';
        else if (label.includes('about')) targetId = 'about';
        else if (label.includes('services')) targetId = 'services';
        else if (label.includes('help')) targetId = 'help';
        else if (label.includes('pay-to-fix')) targetId = 'bounties';
        else if (label.includes('contribute')) targetId = 'contribute';
      }
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
});


/* ============================================================
   4. EVASIVE BUTTON
============================================================ */
let dodgeOffsets = new WeakMap();

function checkDodge(cx, cy) {
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

registerChaos('evasiveButton', () => {
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
});


/* ============================================================
   5. FORM SABOTAGE
============================================================ */
registerChaos('formSabotage', () => {
  const nameInput = document.getElementById('name');
  const consentBox = document.getElementById('consent');
  const formMsg = document.getElementById('form-msg');

  nameInput.addEventListener('input', (e) => {
    if (!isChaosActive('formSabotage')) return;
    const v = e.target.value;
    e.target.value = v.split('').reverse().join('');
    e.target.setSelectionRange(0, 0);
  });

  consentBox.addEventListener('click', (e) => {
    if (!isChaosActive('formSabotage')) return;
    e.preventDefault();
    consentBox.checked = false;
    formMsg.textContent = 'consent denied. try harder.';
    formMsg.style.color = 'var(--yellow)';
    setTimeout(() => { formMsg.textContent = ''; }, 1600);
  });

  document.getElementById('submit-btn').addEventListener('click', () => {
    if (!isChaosActive('formSabotage')) {
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
    if (!isChaosActive('lyingCopyButton')) {
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
    if (!isChaosActive('textScramble')) return;
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
    if (!isChaosActive('darkModeToggle')) {
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
    if (!isChaosActive('fakeToasts')) return;
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
    if (!isChaosActive('emailCorruption')) return;
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
    if (!isChaosActive('countUpTimer')) {
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
});


/* ============================================================
   24. GHOST BACKSPACE IN INPUTS
============================================================ */
registerChaos('ghostBackspace', () => {
  document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      if (!isChaosActive('ghostBackspace')) return;
      if (Math.random() < 0.25 && input.value.length > 0) {
        input.value = input.value.slice(0, -1);
      }
    });
  });
});


/* ============================================================
   25. GLITCH AUDIO FEEDBACK
============================================================ */
registerChaos('glitchAudio', () => {
  let audioCtx = null;
  function playGlitchSound() {
    if (!isChaosActive('glitchAudio')) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150 + Math.random() * 600, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch(e) {}
  }

  document.addEventListener('click', playGlitchSound);
});
