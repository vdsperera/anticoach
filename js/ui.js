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

  const barActiveCountEl = document.getElementById('bar-active-count');
  const barFixedCountEl = document.getElementById('bar-fixed-count');
  const activeCount = bountyConfig.length - solvedCount;
  if (barActiveCountEl) barActiveCountEl.textContent = `${activeCount}`;
  if (barFixedCountEl) barFixedCountEl.textContent = `${solvedCount}/${bountyConfig.length}`;

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
