# Manual course entry

Build a single "Manual entry" screen used in three flows, all inside the existing modal:

1. **Parse-error → "Enter my courses manually"** — opens manual entry with an empty list, then advances to Review on save.
2. **Review → "Add a missing course"** — opens manual entry in single-course mode (one blank row, "Add course" CTA), inserts into the review list on save.
3. **Review → per-course "Edit"** — opens manual entry pre-filled with that one course, updates it on save.

## UX (single screen, reuses modal chrome)

Header
- Back arrow (returns to the previous screen — Parsing-failed or Review).
- H1 swaps by mode: *"Enter your courses"* (bulk) / *"Add a course"* (single add) / *"Edit course"* (single edit).
- Sub: short helper, e.g. *"Add each course as it appears on your transcript. You can edit anything later."*

Form rows (per course)
- Term (select: Fall/Spring/Summer/Winter + year picker, defaults to most recent term already in list).
- Course code (text, e.g. ENG 101) — required.
- Title (text) — required.
- Credits (number, 0.5 step, 0–6) — required.
- Grade (select: A, A-, B+, B, B-, C+, C, C-, D, F, P, IP) — required.
- Row-level "Remove" (trash icon) in bulk mode only; hidden in single-add/edit.

Bulk-mode extras
- "+ Add another course" ghost button below the last row.
- Running summary chip: *"X courses · Y credits"*.
- Starts with one empty row.

Validation
- Inline field errors (red border + 12px message), shown on blur and on submit attempt.
- Primary CTA disabled until every visible row is fully valid.
- Duplicate course code within the same term → inline warning, not blocking.

Footer CTA
- Bulk: *"Save courses & continue →"* (advances to Review, replaces COURSES list, banner becomes the existing blue manual-entry notice).
- Single add: *"Add course"* (appends to COURSES, returns to Review).
- Single edit: *"Save changes"* (updates the row, returns to Review).
- Secondary text link: *"Cancel"* (returns without saving; in bulk mode from parse-error, shows confirm if any data entered).

Empty state polish (bulk)
- Subtle illustration/icon at top of the first row group, fading out once a field gets focus.
- Optional "Paste from clipboard" link → opens a textarea modal that tries to parse `CODE  Title  Credits  Grade` lines (nice-to-have; include only if it fits without bloating the screen).

Mobile (≤560px)
- Each course becomes a stacked card (label above field), full-width inputs, sticky footer CTA.
- "Add another course" stays full-width.

Accessibility
- Each input has a real `<label for>`.
- Errors use `aria-describedby` / `aria-invalid`.
- Focus moves to the first invalid field on failed submit.
- Focus moves to the new row's first field after "Add another course".
- Esc on the screen does not close the modal (matches current behavior).

## Implementation notes (technical)

All changes in `public/navigate-modal/modal.js` + `public/navigate-modal/modal.css`. No new files, no framework — match existing vanilla JS/template-string style.

State additions on `st`:
- `manualMode`: `'bulk' | 'add' | 'edit' | null`
- `editIndex`: number | null
- `draft`: array of `{term, code, title, cr, grade}` used while the screen is open

Routing
- Add a virtual stage `'manual'` rendered by a new `sManual()` function. Don't add it to `STAGES`/`PROG`; instead render it as an overlay state when `st.manualMode` is set, similar to how `parseFailed` short-circuits `sParsing()`. The progress pill stays on "Review".
- Wire `data-act` handlers:
  - `manual` (existing, parse-error screen) → `st.manualMode='bulk'; st.draft=[blankRow()]; render('fwd')`.
  - New `add-course` on Review's "Add a missing course" → `st.manualMode='add'; st.draft=[blankRow()]`.
  - New `edit-course` on each `.nv-edit-btn` (carry `data-i="${index}"`) → `st.manualMode='edit'; st.editIndex=i; st.draft=[{...COURSES[i]}]`.
  - `manual-save` → mutate the in-memory `COURSES` array (replace / append / update by index), clear `manualMode`, `render('back')` to Review.
  - `manual-cancel` → clear `manualMode`, return to previous screen.
  - `manual-add-row` → push blank row, re-render screen only.
  - `manual-remove-row` (data-i) → splice, re-render.

Rendering
- Reuse existing classes (`nv-input-wrap`, `nv-inp`, `nv-btn`, `nv-notice`) and add a small set of new ones: `.nv-manual-row`, `.nv-manual-grid` (CSS grid: term/code/title/cr/grade/remove), `.nv-manual-add`, `.nv-manual-summary`.
- Term options derived from existing COURSES terms + current/last two academic years.
- Validation helpers (`isValidRow`, `firstInvalidField`) live alongside the existing `detectScenario`/`scheduleParsing` helpers — keep all current logic untouched, including wrong-format and scenario detection.

Out of scope
- No backend, no persistence beyond the modal session.
- No changes to upload, parsing scheduling, school search, email, or confirm screens.
- No changes to scenario detection or any of the four demo files' behavior.
