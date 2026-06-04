
## Goal

Replace the current single re-themed template with 4 separate, high-fidelity reproductions of the real admissions pages — Tufts, Boston University, Northeastern, and UMass Amherst — each embedding the same "Check my credit transfer" modal flow, themed with that school's colors, logo, and typography. Pages are visual mockups only (links don't need to work). The modal behavior stays identical; only its skin changes per host site.

## Approach

1. **Reference capture.** Take a full-page screenshot of each of the 4 admissions URLs and pull brand assets (logo SVG/PNG, primary/secondary colors, fonts, hero imagery). Store logos under `public/brands/<school>/`.

2. **Extract the modal into a shared module.** Move the existing modal HTML/CSS/JS from `public/navigateembedded.html` into:
   - `public/navigate-modal/modal.css`
   - `public/navigate-modal/modal.js` (exports `mountNavigateModal({ brand })`)
   - `public/navigate-modal/modal.html` (markup snippet injected by the JS)
   The brand object carries `{ name, short, abbr, primary, secondary, accent, light, logoUrl, headingFont, bodyFont }`. The modal reads from CSS custom properties so each host page just sets `--brand-*` and passes its logo.

3. **One static HTML page per school**, each a faithful visual reproduction of the real admissions page (header, top utility bar, main nav, hero with real-style imagery, content blocks, footer). Pages are non-interactive — nav links are `href="#"`. Each page includes the shared modal module and a prominent **"Check my credit transfer"** CTA (placed in the hero and in a sidebar card on the admissions content area) that opens the modal.
   - `public/schools/tufts.html` — navy `#3E8EDE`/`#002E6D`, Tufts wordmark, serif headings
   - `public/schools/bu.html` — BU scarlet `#CC0000`, Terrier shield, BU wordmark
   - `public/schools/northeastern.html` — NU red `#C8102E` on black, "N" mark
   - `public/schools/umass.html` — maroon `#881C1C`, UMass seal/wordmark

4. **Demo switcher.** A thin top strip (only on the preview, not part of the school chrome) lets you jump between the 4 pages. Implemented as a small fixed-position bar in each page that links to the other 3 HTML files. Active school is highlighted.

5. **Routing.** Update `src/routes/index.tsx` to iframe `public/schools/tufts.html` by default, and add lightweight TanStack routes `/tufts`, `/bu`, `/northeastern`, `/umass` that iframe the matching school page. Each route sets its own `head()` title/description.

6. **QA.** Open each route in the preview, open the modal, walk through all stages (school → upload → parsing → review → email → confirm), and confirm the modal picks up that school's brand colors, logo, and progress-bar accent.

## File layout after the change

```text
public/
  navigate-modal/
    modal.css
    modal.js
    modal.html
  brands/
    tufts/logo.svg
    bu/logo.svg
    northeastern/logo.svg
    umass/logo.svg
  schools/
    tufts.html
    bu.html
    northeastern.html
    umass.html
src/routes/
  index.tsx        -> iframes /schools/tufts.html
  tufts.tsx
  bu.tsx
  northeastern.tsx
  umass.tsx
```

The existing `public/navigateembedded.html` is removed once the four pages are wired up.

## Open questions before I start

1. Reference fidelity — should I capture screenshots of the live admissions pages and reproduce them visually (closest match, slightly slower), or work from the brand colors/logos alone and use a generic university layout per school (faster, less faithful)?
2. Where should the "Check my credit transfer" CTA live on each page — hero + sidebar card (current Tufts mock), only the hero, or a floating button bottom-right? Same placement across all four, or per-school?
3. Should the demo switcher strip be visible in the final preview, or only during development (hidden behind `?demo=1`)?
