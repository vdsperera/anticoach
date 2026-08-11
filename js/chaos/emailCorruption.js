import { isChaosActive } from '../config.js';

export function init() {
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
}
