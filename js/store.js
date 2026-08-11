import { bountyData } from './config.js';
import { renderBountyUI } from './ui.js';

export function getSavedFunds() {
  try {
    return JSON.parse(localStorage.getItem('anticoach_bounty_funds')) || {};
  } catch (e) {
    return {};
  }
}

export function saveFunds(funds) {
  try {
    localStorage.setItem('anticoach_bounty_funds', JSON.stringify(funds));
  } catch (e) {}
}

export function getFunds(id) {
  const saved = getSavedFunds();
  if (saved[id] !== undefined) return saved[id];
  return bountyData[id] ? bountyData[id].initial : 0;
}

export function isFixed(id) {
  if (!bountyData[id]) return false;
  return getFunds(id) >= bountyData[id].target;
}

export function addFunds(id, amount) {
  if (!bountyData[id]) return;
  const current = getFunds(id);
  const updated = Math.min(bountyData[id].target, current + amount);
  const saved = getSavedFunds();
  saved[id] = updated;
  saveFunds(saved);
  renderBountyUI();
}

export function resetAllBounties() {
  localStorage.removeItem('anticoach_bounty_funds');
  renderBountyUI();
}
