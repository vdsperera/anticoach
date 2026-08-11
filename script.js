import { renderBountyUI } from './js/ui.js';
import { initDonationModal, fetchOnChainBountyTotals } from './js/web3.js';
import { resetAllBounties } from './js/store.js';
import { chaosModules } from './js/chaos/index.js';

document.addEventListener('DOMContentLoaded', () => {
  renderBountyUI();
  initDonationModal();
  fetchOnChainBountyTotals();
  setInterval(fetchOnChainBountyTotals, 15000);

  const scrollToBounties = (e) => {
    e.preventDefault();
    const bountiesSec = document.getElementById('bounties');
    if (bountiesSec) bountiesSec.scrollIntoView({ behavior: 'smooth' });
  };
  const barFixBtn = document.getElementById('btn-bar-fix');
  const heroFixBtn = document.getElementById('btn-hero-fix');
  if (barFixBtn) barFixBtn.addEventListener('click', scrollToBounties);
  if (heroFixBtn) heroFixBtn.addEventListener('click', scrollToBounties);

  const resetBtn = document.getElementById('reset-bounties-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetAllBounties();
    });
  }

  chaosModules.forEach(m => {
    try { 
      m.init(); 
    } catch (err) { 
      console.warn(`[ANTICOACH] Module "${m.name}" failed:`, err); 
    }
  });
});
