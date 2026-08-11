import { bountyConfig, bountyData, priorityMeta } from './config.js';
import { getFunds } from './store.js';
import { addFunds } from './store.js';
import { openDonationModal } from './web3.js';

export function formatUSDT(val) {
  if (val >= 1000) return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  return '$' + val.toFixed(2);
}

export function renderBountyUI() {
  const grid = document.getElementById('bounty-grid');
  const totalRaisedEl = document.getElementById('total-raised-usdt');
  const solvedCountEl = document.getElementById('bounties-solved-count');
  if (!grid) return;

  const isInitialRender = grid.children.length === 0;
  let totalRaised = 0;
  let solvedCount = 0;

  bountyConfig.forEach((cfg, index) => {
    const id = cfg.id;
    const item = bountyData[id];
    const funds = getFunds(id);
    totalRaised += funds;
    const fixed = funds >= item.target;
    if (fixed) solvedCount++;

    const percent = Math.min(100, Math.floor((funds / item.target) * 100));
    const pm = priorityMeta[item.priority] || priorityMeta.LOW;

    if (isInitialRender) {
      const card = document.createElement('div');
      card.className = `bounty-card ${fixed ? 'fixed' : ''} priority-${item.priority.toLowerCase()}`;
      card.id = `bounty-card-${id}`;
      card.innerHTML = `
        <div>
          <div class="bounty-card-header">
            <div>
              <span class="bounty-priority" style="color: ${pm.color}">${pm.emoji} ${pm.label}</span>
              <h3>${item.lifeIssue}</h3>
            </div>
            <span class="bounty-status ${fixed ? 'repaired' : 'broken'}" id="bounty-status-${id}">
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
              <span id="bounty-progress-text-${id}">${formatUSDT(funds)} / ${formatUSDT(item.target)} USDT (${percent}%)</span>
            </div>
            <div class="bounty-progress-bar">
              <div class="bounty-progress-fill" id="bounty-progress-fill-${id}" style="width: ${percent}%"></div>
            </div>
          </div>

          <div class="bounty-actions" id="bounty-actions-${id}">
            ${fixed ?
              `<button class="btn btn-simulate" style="opacity: 0.6; cursor: default;" disabled>✓ Life Issue Resolved</button>` :
              `<button class="btn btn-donate-card" data-donate="${id}">💎 Donate USDT</button>
               <button class="btn btn-simulate" data-simulate="${id}">+$10 Simulate</button>`
            }
          </div>
        </div>
      `;
      grid.appendChild(card);
    } else {
      // Update existing DOM
      const card = document.getElementById(`bounty-card-${id}`);
      if (card) {
        card.className = `bounty-card ${fixed ? 'fixed' : ''} priority-${item.priority.toLowerCase()}`;
        
        const statusEl = document.getElementById(`bounty-status-${id}`);
        if (statusEl) {
          statusEl.className = `bounty-status ${fixed ? 'repaired' : 'broken'}`;
          statusEl.textContent = fixed ? '✓ FIXED' : '⚠ STRUGGLING';
        }

        const progTextEl = document.getElementById(`bounty-progress-text-${id}`);
        if (progTextEl) progTextEl.textContent = `${formatUSDT(funds)} / ${formatUSDT(item.target)} USDT (${percent}%)`;

        const progFillEl = document.getElementById(`bounty-progress-fill-${id}`);
        if (progFillEl) progFillEl.style.width = `${percent}%`;

        const actionsEl = document.getElementById(`bounty-actions-${id}`);
        if (actionsEl && fixed && !actionsEl.querySelector('button[disabled]')) {
           actionsEl.innerHTML = `<button class="btn btn-simulate" style="opacity: 0.6; cursor: default;" disabled>✓ Life Issue Resolved</button>`;
        }
      }
    }
  });

  if (totalRaisedEl) totalRaisedEl.textContent = `${formatUSDT(totalRaised)} USDT`;
  if (solvedCountEl) solvedCountEl.textContent = `${solvedCount} / ${bountyConfig.length}`;

  const barActiveCountEl = document.getElementById('bar-active-count');
  const barFixedCountEl = document.getElementById('bar-fixed-count');
  const activeCount = bountyConfig.length - solvedCount;
  if (barActiveCountEl) barActiveCountEl.textContent = `${activeCount}`;
  if (barFixedCountEl) barFixedCountEl.textContent = `${solvedCount}/${bountyConfig.length}`;

  if (isInitialRender) {
    grid.addEventListener('click', (e) => {
      const donateBtn = e.target.closest('[data-donate]');
      if (donateBtn) {
        e.preventDefault();
        openDonationModal(donateBtn.dataset.donate);
      }
      
      const simulateBtn = e.target.closest('[data-simulate]');
      if (simulateBtn) {
        e.preventDefault();
        addFunds(simulateBtn.dataset.simulate, 10);
      }
    });
  }
}
