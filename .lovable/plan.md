Two small changes to `public/navigate-modal/modal.js`, scoped to the school‑search step. No other flows change.

## 1. Bigger "simulated database" of suggestions

Today `SCHOOLS` has only 6 community colleges, which are shown as "Popular schools" and used to filter as the user types. Replace it with a broader list (~30–40) that mixes community colleges, state schools, and well‑known universities so the typeahead feels real (e.g. Bunker Hill CC, Mass Bay CC, Middlesex CC, Bristol CC, Cape Cod CC, Northern Essex CC, Quincy College, Roxbury CC, Holyoke CC, Springfield Technical CC, UMass Boston, UMass Lowell, UMass Dartmouth, Salem State, Bridgewater State, Framingham State, Boston College, Boston University, Northeastern, Tufts, Harvard, MIT, Suffolk, Emerson, Wellesley, Smith, Amherst College, Williams, etc.).

Keep the existing render: show the first ~6 under "Popular schools" by default, then "Results" when filtering. Cap visible results at ~8 with a small "+N more" hint when the filter still matches many.

## 2. Fix the Continue button on step 1

Current behavior:
- Bottom primary `Continue` is disabled until the user clicks a row from the list.
- A separate inline `Continue anyway` button only appears when the typed query matches zero rows.
- Even if the user gets through with an unknown school, the not‑found scenario on Review is keyed off the upload filename, so typing a random school never actually drives the SCHOOL NOT FOUND experience.

New behavior:
- The bottom primary `Continue` becomes the single source of truth and is enabled whenever either (a) the user picked a row from the list, or (b) the input has a non‑empty trimmed value of at least 2 characters.
- Track how the school was chosen via a new state flag `st.schoolKnown` (`true` when picked from the list, `false` when free‑typed and not matching any list entry; matching list entry by case‑insensitive equality also counts as known).
- Clicking `Continue`:
  - Known school → proceeds to Upload exactly as today (no scenario override).
  - Unknown school → proceeds to Upload and sets a sticky flag `st.forceSchoolNotFound = true`.
- In `handleFile`, after `detectScenario(f.name)` runs, if `st.forceSchoolNotFound` is true and the detected scenario is `success` (i.e. the filename didn't already pick a specific scenario), override to `school-not-found`. Filename‑driven scenarios (too‑large, parse‑error, the explicit school‑not‑found demo file) still win, so the four demo files keep behaving exactly as they do now.
- Remove the inline "Continue anyway" button from the empty‑results state; instead show a friendly "We don't have '<x>' yet — you can still continue and we'll flag it on the next step." hint, since the main Continue now handles it.
- Inline `Continue anyway` markup, the `data-continue-unknown` click handler, and the related notfound block can be deleted once the bottom button covers both paths.

## Out of scope
- No changes to upload, parsing, review, manual entry, email, confirm, or the disclaimer footer.
- No changes to the four demo filenames or `detectScenario`.
- No new files; all edits stay in `public/navigate-modal/modal.js` (plus any tiny CSS tweak in `modal.css` if the empty‑state hint needs styling).
