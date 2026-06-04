
## Modal (`public/navigate-modal/modal.css` + `modal.js`)

1. **Close button on all viewports**
   - Already exists in markup. Audit CSS to confirm it's visible at every breakpoint; remove any rule that hides it on tablet/mobile (none found, but verify after fullscreen changes).

2. **Mobile = full-screen modal**
   - Add `@media(max-width:560px)` rule: `.nv-modal-overlay { padding:0 }` and `.nv-modal { max-width:100%; width:100%; height:100vh; height:100dvh; border-radius:0; max-height:none }`.
   - Keep close button anchored top-right; ensure brand column + footer remain in place.

3. **Rounded corners — pill aesthetic from the reference button**
   - The reference CTA uses a ~10–12px radius on a tall pill. Apply that family across modal surfaces:
     - `.nv-school-list`, `.nv-dest-box`, `.nv-notice`, `.nv-upload-box`, `.nv-parsing-steps`, `.nv-parse-tips`, `.nv-school-notfound`, `.nv-summary-card`, `.nv-course-card`, `.nv-value-box`, `.nv-next-steps`, `.nv-add-course-btn`, `.nv-parse-failed-icon` (only the cards, not circular icons) → unify to `border-radius: 12px` (currently 14–20px).
   - Keep `.nv-btn` and `.nv-inp` as full pills (99px) — matches the blue CTA in the reference.
   - Logo tile `.nv-modal-logo` → `border-radius: 10px`.

## Floating Demo Switcher (all 4 admission pages)

4. Replace top-bar `.nv-demo-switcher` with a fixed bottom-right floating button:
   - Collapsed: 48px circular pill with "Demo" label / chevron icon, `z-index: 1100` (above modal overlay which is 1000 — bump overlay or use 999 for switcher? Keep switcher above modal so it remains accessible per request → `z-index: 1100`).
   - Expanded on click/tap: vertical stack of school links above the trigger, animated.
   - Works inside modal-open state (no pointer-events blocking).
   - Same component on desktop, tablet, mobile (bottom: 16px, right: 16px).
   - Extract markup into a shared snippet — inject via `modal.js` (new `mountDemoSwitcher({current})` call) so each HTML file only needs one line instead of 8 lines of duplicated markup. Remove old `.nv-demo-switcher` blocks from `bu.html`, `northeastern.html`, `tufts.html`, `umass.html`.

## UMass logo color in modal

5. In `umass.html` `NavigateModal.mount({...})` add `logoFilter` that recolors the black SVG to UMass maroon `#881C1C`. Use a CSS filter chain that produces maroon from black, e.g.:
   ```
   logoFilter: 'brightness(0) saturate(100%) invert(15%) sepia(85%) saturate(2200%) hue-rotate(347deg) brightness(85%) contrast(95%)'
   ```
   - Verify the rendered hue matches `#881C1C` after build; iterate if needed.

## Northeastern header logo size

6. In `northeastern.html`:
   - Desktop: `.ne-top { height: 96px }`, `.ne-logo-wrap { height: 96px }`, `.ne-logo-wrap img { height: 64px }` (up from 56).
   - Tablet (≤900): height 80 / img 52.
   - Mobile (≤560): height 68 / img 44.

## Footer logos use real assets

7. Replace the placeholder marks in each footer with the school's actual logo `<img>`:
   - `tufts.html` footer → tufts logo asset (white/mono variant; apply `filter: brightness(0) invert(1)` if dark footer).
   - `bu.html` footer → BU wordmark (current placeholder swap).
   - `northeastern.html` footer → replace `.ne-foot-mark` "N" tile with `northeastern.webp`, sized ~32–40px tall, white via filter on dark bg.
   - `umass.html` footer → replace `.um-foot-seal` "M" tile with `umass.svg`, white via `brightness(0) invert(1)` filter.
   - Keep adjacent text labels intact.

## Verification

After changes, screenshot each admission page at desktop / tablet / mobile and the modal in each viewport to confirm:
- close button visible
- mobile modal fills viewport, no rounded corners
- card radii match the pill button family
- UMass logo renders maroon inside the modal
- Northeastern header logo is noticeably larger
- footers show real logos
- floating demo switcher is reachable even with modal open
