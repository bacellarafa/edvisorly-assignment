
## Goal

Refresh the credit-transfer modal to match the attached reference: a soft, light, neumorphic-ish surface with rounded pill controls, generous whitespace, and a single bold dark/brand accent for primary actions. Scale up on tablet/desktop, swap every emoji for an icon-library glyph, and rename the footer to "EdVisorly".

## 1. Visual redesign of the modal (`public/navigate-modal/modal.css`)

Move from the current bright-bordered card to a calmer aesthetic inspired by the reference:

- Surface: off-white/cream background (`#f4f1ec` range), subtle inset + soft outer shadow, larger radius (~24px).
- Cards inside (course cards, school items, value/dest boxes, file picker, summary cards): white with very soft shadow, rounded ~18px, no hard borders — same family as the reference's pill cards.
- Stage pills + progress: pill chips with soft shadow, active pill filled with brand color; thinner progress track.
- Primary button: full-width pill, solid `--nv-brand` (each university's primary), white text, soft shadow. Secondary/ghost: white pill with soft shadow, dark text.
- Inputs: pill-shaped, no harsh border, inset shadow on focus using brand color.
- Typography: slightly larger headings, tighter tracking, neutral gray body text.

## 2. Sizing per breakpoint

In `modal.css`:

- Mobile (current): keep as-is — user is happy.
- Tablet (`min-width: 700px`): modal width ~640px, padding bumped, font sizes +1–2px.
- Desktop (`min-width: 1024px`): near full-screen feel — width `min(1100px, 92vw)`, height `min(880px, 92vh)`, two-column inner layout where it helps (e.g. School stage: search list left, "Evaluating transfer to" panel right; Review stage: summary cards as a sticky right rail beside the term list). Header becomes a taller brand bar with the university logo prominently on the left.

The internal stage components stay single-source; the two-column treatment is a CSS grid that collapses back to one column under 1024px, so no JS branching is needed.

## 3. Header / logo treatment

- Taller brand bar on desktop (~72px), logo container `max-width: 160px`, with a thin divider under it.
- White logo plate with soft shadow on all brand colors so wordmarks (Tufts, UMass SVG, BU, Northeastern) sit cleanly.
- "Secure · Encrypted" line uses a lock icon (Lucide) instead of inline SVG string, smaller, muted.

## 4. Remove all emojis, adopt an icon library

Replace every emoji currently in `modal.js` and in the four school HTML files with **Lucide icons** (clean, thin-stroke, matches the soft aesthetic of the reference).

Delivery: include Lucide via CDN once per page (`<script src="https://unpkg.com/lucide@latest"></script>` then `lucide.createIcons()` after render). Use `<i data-lucide="...">` placeholders.

Mapping (modal):
- 🔒 lock notice / secure → `lock`
- 📄 upload icon → `file-text`
- ✅ uploaded / confirm → `check-circle-2`
- ⚠️ file error → `alert-triangle`
- ℹ️ manual-entry banner → `info`
- 🎯 "Evaluating transfer to" → `target`
- 📊 evaluation ready → `bar-chart-3`
- 📧 email chip → `mail`
- 😕 parse failed → `frown` (or drop the face entirely, use `file-x`)
- ✓ stepper check → `check`
- × close button → `x`
- ← back arrow → `arrow-left`
- + add course → `plus`

School pages: audit `tufts.html`, `bu.html`, `northeastern.html`, `umass.html` and swap any emoji in nav, CTAs, feature lists, footers for Lucide equivalents.

## 5. Footer rebrand

In `modal.js` (`ensureMarkup`): change `Powered by <strong>EdVisorly Navigate</strong>` → `Powered by <strong>EdVisorly</strong>`. Replace the inline lock SVG with a Lucide `shield-check` or `lock` icon for consistency.

## 6. QA pass

For each of the 4 schools, at mobile / tablet / desktop:
- Open modal, confirm new sizing and that brand color drives only the primary button + active pill + focus accents (everything else stays neutral).
- Walk school → upload → parsing → review → email → confirm; verify no emoji remains and Lucide icons render.
- Confirm logos sit cleanly in the new header plate.
- Confirm footer reads "Powered by EdVisorly".

## Files touched

- `public/navigate-modal/modal.css` — full restyle + responsive breakpoints + grid layout for desktop stages.
- `public/navigate-modal/modal.js` — emoji → `<i data-lucide>` swaps, call `lucide.createIcons()` after each `render()`, footer text change.
- `public/schools/tufts.html`, `bu.html`, `northeastern.html`, `umass.html` — add Lucide CDN script, remove emojis from page chrome, initial `lucide.createIcons()` call.

No route, asset, or branding-token changes — the per-university `primary` / `secondary` / `logoUrl` passed to `NavigateModal.mount` keep working unchanged.
