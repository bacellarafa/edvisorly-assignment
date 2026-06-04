## Goal

Add two layers of contextual help inside the floating "Demo" switcher (bottom-right of every school page), without changing how the modal itself looks.

## 1. Small explainer inside the Demo menu (all screen sizes)

Edit: `public/navigate-modal/modal.js` → `mountDemoSwitcher()` and `public/navigate-modal/modal.css`.

Inside the existing `.nv-demo-fab-menu` dropdown, prepend a short helper block above the school list:

> **Demo navigator** — Switch between mock university pages to see the EdVisorly Navigate experience embedded in different brands. Click "Check my credit transfer" on any page to open the credit-transfer modal.

Styling: muted text (`#aaa`), 11px, 1.45 line-height, padding `10px 12px 8px`, a thin `border-bottom: 1px solid rgba(255,255,255,.08)` separating it from the school list. Always visible when the menu is open, on mobile and desktop.

## 2. Desktop-only "Demo files" panel during upload stage

Edit: `public/navigate-modal/modal.js` and `public/navigate-modal/modal.css`.

Add a second floating panel anchored to the left of the existing Demo FAB, only rendered when:
- the modal is open, AND
- the current stage is `'upload'` (i.e. `STAGES[st.idx] === 'upload'`), AND
- viewport ≥ 900px (CSS media query — hidden on tablet/mobile).

Content mirrors the attached screenshot:

```text
Demo files — upload each to trigger a scenario:
✅  transcript-jordan-SUCCESS.pdf        → Happy path
❌  transcript-jordan-WRONG-FORMAT.txt   → Wrong file type
⚠️  transcript-jordan-TOO-LARGE.pdf      → File too large
🐞  transcript-jordan-PARSE-ERROR.pdf    → Parsing failure
🔍  transcript-jordan-SCHOOL-NOT-FOUND.pdf → Unknown school
```

Header in the same yellow/amber accent as the screenshot (`#f5c451`), filenames in monospace (`'JetBrains Mono', monospace`), 12px, on the same dark translucent surface as the demo FAB (`rgba(20,20,30,.92)` with blur). Width ~360px, rounded `12px`, soft shadow matching the FAB.

### Wiring the visibility

- In `mountDemoSwitcher()`, also create a sibling `.nv-demo-help` element appended once to `<body>`, hidden by default (`display:none`).
- Expose a tiny internal helper `updateDemoHelp()` that toggles `display` based on:
  - `document.querySelector('.nv-modal.is-open')` existence (modal open), AND
  - `STAGES[st.idx] === 'upload'`.
- Call `updateDemoHelp()` from `render()` (every slide transition), from `openModal()`, and from `closeModal()`.
- Final visibility on mobile/tablet is enforced via CSS: `@media (max-width: 899px) { .nv-demo-help { display:none !important; } }`.

### Positioning

`.nv-demo-help` is `position:fixed; bottom:16px; right:120px;` (sits to the left of the Demo FAB so they don't overlap). `z-index:1100` to stay above the modal backdrop, just like the FAB.

## Out of scope

- No changes to the modal upload flow itself or to the scenario-detection logic.
- No new copy on school pages.
- No restyling of the existing FAB toggle button.
