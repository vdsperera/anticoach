# ANTICOACH

A single-page, deliberately broken "life coaching" web app that inverts every
standard UI/UX convention as a joke — built with plain HTML/CSS/JS, no
framework, no build step.

## Concept

ANTICOACH looks like a normal personal-growth / coaching portal, but every
interaction is intentionally subverted: mouse movement is inverted, scroll
direction is reversed, nav links redirect to the wrong sections, the primary
CTA button dodges the cursor, form inputs sabotage themselves, and a
confirmation modal's Yes/No logic is flipped.

## Tech stack

- Vanilla HTML, CSS (custom properties for theming), and JS — no
  dependencies, no bundler
- Split into three files: `index.html`, `styles.css`, `script.js`
  (opens directly in a browser, no build step required)

## Key features

### Original chaos suite

1. **Inverted cursor** — the real OS cursor is hidden (`cursor: none`); a
   custom fake cursor moves opposite to the real mouse delta. A faint
   "ghost" dot tracks the true pointer position for reference.
2. **Reverse scroll** — `wheel` events are intercepted and the scroll
   direction is flipped via `window.scrollBy`.
3. **Menu redirection** — nav link labels intentionally don't match their
   `data-target` scroll destination (e.g. "Home" scrolls to a different
   section).
4. **Evasive CTA button** — the primary button flees the cursor on
   proximity, then drifts back to its original position over time.
5. **Self-sabotaging intake form** — typed text reverses live, the consent
   checkbox refuses to stay checked, and Submit/Cancel actions are swapped
   (Submit shows an error, Cancel shows a success message).
6. **Lying confirmation modal** — "Yes" cancels, "No" confirms; closing one
   modal opens another, capped at 3 to stay (relatively) merciful.
7. **Contribute section** — displays an ERC-20 wallet address (accepts any
   token: ETH, USDT, USDC, etc.) for donations. The "Copy Address" button
   copies a troll message instead of the real address; the address itself
   stays visible and selectable so people can still copy it manually.

### New chaos modules (v2)

8. **Fake loading bar** — crawls to 99%, resets with a snarky message, loops
   3 times, then finally opens the modal.
9. **Text scramble on hover** — hovering over paragraph text scrambles
   characters into random glyphs for ~350ms before settling back.
10. **Drag-and-drop snapback** — service cards are draggable but rubber-band
    back to their original position with a snarky tooltip.
11. **Dark mode toggle** — "Dark Mode" switches to blinding white; toggling
    again goes ultra-dark. Cycles between the two forever. Never returns
    to normal.
12. **Fake toast notifications** — unsolicited snarky popups every 15–30
    seconds ("Your coach has left the session", "Achievement unlocked:
    Nothing", etc.).
13. **Glitch burst effect** — the hero `.glitch` text has a persistent CSS
    glitch animation with periodic intense bursts triggered by JS.
14. **Page shake / tremor** — random subtle body shake every 20–40 seconds.
15. **Email field corruption** — the email field swaps `@` with random
    symbols or appends garbage domains after the user stops typing.
16. **Inverted tab order** — `tabindex` values are set in reverse order so
    keyboard-tabbing goes backwards through the form.
17. **Countdown timer that counts up** — "Session starts in…" counts up from
    00:00, never counting down. The session never starts.
18. **Volume slider** — labeled "Coaching Volume" but actually controls the
    page's base font size.

### Visual polish

- **CRT scanline overlay** — subtle full-page repeating gradient that gives
  the whole page a retro broken-TV look.
- **Glitch animation on hero text** — layered `clip-path` pseudo-elements
  with cyan/magenta color shifts.
- **Dark mode / ultra-dark CSS themes** — custom property overrides for both
  blinding-white and pitch-black states.

## Design language

- Background: near-black void (`#0b0b12`)
- Accents: glitch magenta (`#ff2e88`), cyan (`#00f0ff`), warning yellow
  (`#ffd23f`)
- Display / headers: monospace (IBM Plex Mono / Courier fallback)
- Body text: Inter / system sans-serif

## File structure

```
index.html                      # clean markup — no inline styles or scripts
styles.css                      # all visual chaos — tokens, layout, animations, themes
script.js                       # all behavioral chaos + Web3 & On-Chain RPC reader
contracts/AnticoachBounties.sol # Solidity 0.8.20 Smart Contract for EVM network
PROJECT.md                      # this file — technical documentation
README.md                       # deadpan public-facing documentation
```

### True Web3 On-Chain Smart Contract & Decentralized State Reader

19. **Pay to Fix the Portal (USDT Bounties)** — Each broken interaction maps to a real-life struggle with a USDT target.
    The `contracts/AnticoachBounties.sol` smart contract records all category contributions on the EVM blockchain and forwards USDT directly to the owner address `0x32f6f912133d4c36879c79a1415f2e1fb39432ee`.
    Front-end `script.js` uses `ethers.JsonRpcProvider` to read category totals directly from the smart contract on-chain every 15 seconds. Global progress bars are 100% serverless, decentralized, and tamper-proof for all visitors worldwide!

## Architecture — chaos module system & bounty manager

All JavaScript chaos is organized via a simple registration pattern:

```js
registerChaos('moduleName', () => {
  // self-contained prank logic with isFixed('moduleName') state hooks
});
```

The `bountyManager` tracks current USDT contributions via `fetchOnChainBountyTotals()` and `localStorage`. When `isFixed(id)` evaluates to `true`, the corresponding chaos module automatically disables its sabotage behavior.

Modules are booted on `DOMContentLoaded`. Each is wrapped in a try/catch so
one broken prank can't take down the whole page. Adding a new module is a
single `registerChaos()` call.

## Notes for whoever picks this up

- All chaos behavior is intentional and self-contained — there is no
  backend, no build step, no external services besides the clipboard API
  (used by the lying copy button) and `navigator.clipboard`.
- The wallet address in the Contribute section is a real address the owner
  controls — treat any changes to it carefully.
- The `--font-size-base` CSS custom property is used for the volume slider
  font-size prank — avoid hardcoding `font-size: 16px` on body-level
  elements or the slider will stop working.
