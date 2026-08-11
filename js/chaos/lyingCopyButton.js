import { isChaosActive } from '../config.js';

export function init() {
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
}
