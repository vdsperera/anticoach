import { bountyConfig, bountyData, WALLET_ADDRESS, CONTRACT_ADDRESS } from './config.js';
import { getFunds, getSavedFunds, saveFunds, addFunds } from './store.js';
import { renderBountyUI } from './ui.js';

let activeDonationCategoryId = null;

export function initDonationModal() {
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
      const addr = WALLET_ADDRESS;
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

        const recipient = WALLET_ADDRESS;

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
            console.error('ERC20 transfer failed:', ercErr);
            throw new Error("Token transfer failed. Please make sure you have enough USDT and ETH for gas.");
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

export function openDonationModal(id) {
  activeDonationCategoryId = id;
  const item = bountyData[id];
  if (!item) return;

  const modal = document.getElementById('donation-modal');
  const priorityEl = document.getElementById('donation-modal-priority');
  const titleEl = document.getElementById('donation-modal-title');
  const descEl = document.getElementById('donation-modal-desc');
  const msgEl = document.getElementById('donation-msg');

  if (priorityEl) priorityEl.textContent = `/// ${item.priority} PRIORITY`;
  if (titleEl) titleEl.textContent = `Fix Website Bug: ${item.title}`;
  if (descEl) descEl.innerHTML = `<strong style="color:var(--yellow); display:block; margin-bottom:4px;">💔 Real-Life Cause: ${item.lifeIssue}</strong>${item.lifeDesc}`;
  if (msgEl) msgEl.textContent = '';

  if (modal) modal.style.display = 'flex';
}

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

export async function fetchOnChainBountyTotals() {
  if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    return;
  }

  if (typeof ethers === 'undefined') return;

  for (const rpcUrl of PUBLIC_RPC_URLS) {
    try {
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ANTICOACH_CONTRACT_ABI, provider);
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
