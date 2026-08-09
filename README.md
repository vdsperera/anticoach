# ANTICOACH™

> A personal growth portal engineered from the ground up to work against you.

---

## Overview

ANTICOACH looks like a normal life-coaching website. It is not. Every interaction has been carefully and deliberately broken. The mouse moves backwards, the scroll goes the wrong way, buttons run away from you, forms sabotage themselves, and the dark mode toggle makes everything worse.

This is not a bug report. This is the product.

## Installation

```
1. Open index.html in a browser.
```

That's it. There is no step 2. There is no build step, no `npm install`, no Docker, no Kubernetes, no microservices architecture. It is a website. You open it.

If you managed to make this more complicated than that, you may already be an ANTICOACH client.

## Features

### Original Chaos Suite
| Feature | What It Says | What It Does |
|---|---|---|
| Custom Cursor | Follows your mouse | Moves in the opposite direction |
| Scroll | Scrolls the page | Scrolls the page the wrong way |
| Navigation | Links to sections | Links to the wrong sections |
| "Start Your Journey" | Starts your journey | Runs away from your cursor |
| Submit Button | Submits your form | Shows an error message |
| Cancel Button | Cancels | Sends the form (we won't respond) |
| Consent Checkbox | Accepts consent | Refuses to stay checked |
| Name Field | Accepts your name | Reverses your name as you type |
| Copy Address | Copies the wallet address | Copies a troll message instead |
| Confirmation Modal | Yes = yes, No = no | Yes = no, No = opens another modal |

### New Chaos Modules (v2)
| Feature | What It Says | What It Does |
|---|---|---|
| Loading Bar | Loading your growth... | Reaches 99%, resets, loops 3 times |
| Dark Mode Toggle | Toggles dark mode | Switches to blinding white, then ultra-dark |
| Text Scramble | Readable paragraphs | Scrambles into glyphs when you hover |
| Service Cards | Draggable cards | Snap back with a snarky message |
| Toast Notifications | Important updates | Random fake alerts every 15–30 seconds |
| Countdown Timer | Session starts in... | Counts up forever. Session never starts. |
| Volume Slider | Coaching Volume | Changes the page font size |
| Email Field | Accepts your email | Corrupts it after you stop typing |
| Tab Order | Normal tab navigation | Reversed. Good luck with the form. |

### True Web3 On-Chain Bounties & Smart Contract
All category progress bars are backed by our Solidity Smart Contract (`contracts/AnticoachBounties.sol`). Every visitor on Earth reads global progress directly from the blockchain via public RPC nodes — zero database or server required.

### Visual Polish
- **Glitch effect** on hero text with periodic intense bursts
- **CRT scanline overlay** for that broken-TV aesthetic
- **Random page tremor** every 20–40 seconds — because stability is overrated

## Smart Contract Deployment Guide (Remix IDE in 2 Minutes)

1. Open [Remix IDE](https://remix.ethereum.org/).
2. Create a file `AnticoachBounties.sol` and paste the contents from `contracts/AnticoachBounties.sol`.
3. Compile with Solidity `0.8.20`.
4. Deploy under "Injected Provider - MetaMask" on Polygon / BSC / Arbitrum using your USDT token address as the constructor parameter:
   - **Polygon USDT**: `0xc2132D05D31c914a87C6611C10748AEb04B58e8F`
   - **Ethereum USDT**: `0xdAC17F958D2ee523a2206206994597C13D831ec7`
   - **BSC USDT**: `0x55d398326f99059fF775485246999027B3197955`
5. Copy your deployed contract address and set `const ANTICOACH_CONTRACT_ADDRESS = "0xYourDeployedAddress"` in `script.js`!

## File Structure

```
index.html                      ← Clean HTML markup
styles.css                      ← All visual chaos & dark themes
script.js                       ← All behavioral chaos + Web3 On-Chain RPC reader
contracts/AnticoachBounties.sol ← Solidity 0.8.20 Smart Contract
PROJECT.md                      ← Technical documentation
README.md                       ← You are here. Congratulations.
```

## Contributing

We are not currently accepting contributions. If you'd like to contribute anyway, please open a pull request and we will close it without reading it.

If you find a bug, it's a feature. If you find a feature, it's probably also a bug. We're not sure anymore.

## FAQ

**Q: How do I use this website?**
A: You don't. It uses you.

**Q: The cursor is moving the wrong way.**
A: That's not a question.

**Q: My scroll is broken.**
A: You're welcome.

**Q: I filled out the form and nothing happened.**
A: Something happened. It just wasn't what you wanted.

**Q: Is the wallet address real?**
A: Yes. The copy button is not.

**Q: Can I turn off the chaos?**
A: The chaos was always on. You just didn't notice until now.

**Q: Who made this?**
A: Someone who believes you deserve worse UX.

## Donations

The Contribute section contains a real ERC-20 wallet address. It accepts ETH, USDT, USDC, and any other ERC-20 token. The "Copy Address" button will not help you. Select the address manually like a functioning adult.

```
0x32f6f912133d4c36879c79a1415f2e1fb39432ee
```

## License

All rights reversed. Do whatever you want. We can't stop you. We tried — the button ran away.
