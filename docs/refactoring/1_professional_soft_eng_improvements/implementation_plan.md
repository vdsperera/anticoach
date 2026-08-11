# Anticoach Refactoring & Improvements Implementation Plan

This plan details the step-by-step approach to applying the suggested professional software engineering improvements to the Anticoach project. Each phase will be executed, committed, and pushed separately to `origin/main` as requested.

## User Review Required

> [!WARNING]
> **ES Modules Breaking Change:** Phase 1 involves refactoring `script.js` into ES Modules (`type="module"`). This means the project will need to be served via a local web server (like `npm run dev` or VSCode Live Server) rather than just opening the `index.html` file directly in a browser due to standard CORS restrictions with `file://` protocol. If you rely on `file://` access, let me know, and we can use a build tool like Vite/Webpack instead, or skip the module splitting.

## Open Questions

> [!IMPORTANT]
> 1. Do you have a preferred bundler for this project (e.g., Vite, Webpack) or should I use native ES Modules in the browser?
> 2. Are you okay with creating a `js/` directory to house all the new module files?

## Proposed Changes

We will execute this plan in 5 distinct phases. I will commit and push after each phase is completed.

---

### Phase 1: Architecture & Modularity
Split the 1500-line monolithic `script.js` into manageable modules.
- **`index.html`**: Add `type="module"` to the script tag.
- **`js/config.js`**: Extract `bountyConfig` and `chaosFeatureToggles`.
- **`js/store.js`**: Extract `localStorage` wrapper functions and state management.
- **`js/web3.js`**: Extract `initDonationModal` and `fetchOnChainBountyTotals`.
- **`js/ui.js`**: Extract `renderBountyUI` and UI helper functions.
- **`js/chaos/*.js`**: Extract all 25 chaos modules into individual files (e.g., `invertedCursor.js`).
- **`script.js`**: Turn into the main entry point that imports and initializes the app.
- **Git Action**: `git commit -m "Refactor: Split script.js into ES modules for maintainability"` & `git push`

---

### Phase 2: State Management & DOM Updates
Refactor UI rendering to be more performant.
- **`js/ui.js`**: Rewrite `renderBountyUI` so it doesn't use `grid.innerHTML = ...` on every update. Instead, it will selectively update the text content and style of existing DOM nodes, avoiding the destruction and recreation of event listeners.
- **Git Action**: `git commit -m "Perf: Optimize UI rendering by surgically updating DOM nodes"` & `git push`

---

### Phase 3: Web3 Integration & Error Handling
Improve the robustness of the Web3 features.
- **`js/config.js`**: Move hardcoded addresses (like `0x32f6f9...`) to constants at the top level.
- **`js/web3.js`**: Fix the fallback logic so if the ERC-20 USDT transfer fails, it doesn't silently fall back to a 0-ETH transaction. Instead, it will gracefully alert the user. 
- Improve RPC connection resilience with a fallback sequence.
- **Git Action**: `git commit -m "Fix: Improve Web3 fallback logic and error handling"` & `git push`

---

### Phase 4: Performance & Event Listeners
Clean up aggressive DOM event listeners.
- **`js/chaos/reverseScroll.js`**: Evaluate `passive: false` usage and optimize scrolling performance.
- **`js/chaos/invertedCursor.js`**: Add requestAnimationFrame debouncing for the mouse tracker to relieve main thread pressure.
- **`js/web3.js` & `js/chaos/*.js`**: Use the Page Visibility API (`document.hidden`) to pause intensive `setInterval` loops (like fetching on-chain data) when the user is not actively viewing the tab.
- **Git Action**: `git commit -m "Perf: Optimize event listeners and polling intervals"` & `git push`

---

### Phase 5: Type Safety & Documentation
Improve maintainability with JSDoc types.
- **`js/config.js` & `js/store.js`**: Add extensive JSDoc types (`@typedef`, `@param`, `@returns`) so IDEs can provide autocomplete and catch type errors related to priority levels, bounty targets, and module toggles.
- **Git Action**: `git commit -m "Docs: Add JSDoc types for core structures"` & `git push`

## Verification Plan

### Manual Verification
- After Phase 1, ensure the application still loads correctly and chaos modules execute.
- After Phase 2, ensure donating and simulating correctly updates the progress bar without UI jank.
- After Phase 3, trigger a Web3 transaction and ensure the appropriate error/success modals show up.
- After Phase 4, check browser performance devtools to ensure main thread isn't maxed out by idle chaos listeners.
