import { bountyData } from './config.js';
import { renderBountyUI } from './ui.js';

/**
 * Retrieves saved funds from localStorage.
 * @returns {Object.<string, number>} Dictionary of saved fund amounts.
 */
export function getSavedFunds() {
  try {
    return JSON.parse(localStorage.getItem('anticoach_bounty_funds')) || {};
  } catch (e) {
    return {};
  }
}

/**
 * Saves funds dictionary to localStorage.
 * @param {Object.<string, number>} funds - Dictionary of fund amounts.
 */
export function saveFunds(funds) {
  try {
    localStorage.setItem('anticoach_bounty_funds', JSON.stringify(funds));
  } catch (e) {}
}

/**
 * Gets the current funds for a specific bounty.
 * @param {string} id - The bounty ID.
 * @returns {number} The current funded amount.
 */
export function getFunds(id) {
  const saved = getSavedFunds();
  if (saved[id] !== undefined) return saved[id];
  return bountyData[id] ? bountyData[id].initial : 0;
}

/**
 * Checks if a specific bounty has been fully funded.
 * @param {string} id - The bounty ID.
 * @returns {boolean} True if funded >= target.
 */
export function isFixed(id) {
  if (!bountyData[id]) return false;
  return getFunds(id) >= bountyData[id].target;
}

/**
 * Simulates adding funds to a specific bounty.
 * @param {string} id - The bounty ID.
 * @param {number} amount - The amount to add.
 */
export function addFunds(id, amount) {
  if (!bountyData[id]) return;
  const current = getFunds(id);
  const updated = Math.min(bountyData[id].target, current + amount);
  const saved = getSavedFunds();
  saved[id] = updated;
  saveFunds(saved);
  renderBountyUI();
}

/**
 * Resets all saved bounties in localStorage and re-renders UI.
 */
export function resetAllBounties() {
  localStorage.removeItem('anticoach_bounty_funds');
  renderBountyUI();
}
