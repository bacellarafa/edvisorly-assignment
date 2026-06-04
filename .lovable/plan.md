# Align Navigate modal upload/parsing flow with spec

All changes are confined to `public/navigate-modal/modal.js` (with minor CSS additions in `public/navigate-modal/modal.css` for the text-link "Skip and proceed anyway" style). No other files are touched. UI, branding, layout, fonts, and progress bar are preserved.

## 1. `detectScenario` — accept underscore variants

Update to match both hyphen and underscore filename hints:

```js
function detectScenario(filename) {
  const n = (filename || '').toLowerCase();
  if (n.includes('wrong-format') || n.includes('wrong_format')) return 'wrong-format';
  if (n.includes('too-large')    || n.includes('too_large'))    return 'too-large';
  if (n.includes('parse-error')  || n.includes('parse_error'))  return 'parse-error';
  if (n.includes('school-not-found') || n.includes('school_not_found')) return 'school-not-found';
  return 'success';
}
```

Result is stored as `st.scenario` (already named that — kept).

## 2. `handleFile` — real + simulated validation, in order

Replace current logic so both real-file and filename-simulated errors are caught, with the exact messages from the spec:

- Compute `scenario = detectScenario(f.name)`.
- Check 1 (wrong format): if `scenario === 'wrong-format'` OR `f.type` not in `['application/pdf','image/jpeg','image/png']`, show:
  `"That file format isn't supported. Navigate only accepts PDF, JPG, or PNG transcripts."`
- Check 2 (too large): `MAX_MB = 10`, `simulatedMB = 14.2`. `displayMB = scenario === 'too-large' ? 14.2 : (f.size/1024/1024).toFixed(1)`. If simulated OR real `f.size > MAX_MB*1024*1024`, show:
  `` `This file is too large (${displayMB} MB). The maximum is 10 MB. Try exporting a compressed PDF from your school portal, or take a clear photo instead.` ``
- On error: show inline red banner, clear `st.file`, reset input value, keep Continue disabled. Never advance.
- On success: store `st.file = f.name`, `st.scenario = scenario`, clear error, re-render upload slide so `syncUploadBtn()` enables Continue only when consent is also checked.

## 3. Parsing screen — labels and timing

Update step labels to spec wording:
- step 0 "Uploading transcript"
- step 1 "Detecting course records"
- step 2 "Extracting grades & credits"
- step 3 "Preparing your review"

Rewrite `scheduleParsing` to the spec schedule (step indexes shift compared to current code):

```text
mount        → step 0 active
@800ms       → step 0 ✓ done, step 1 active
@1700ms      → step 1 ✓ done, step 2 active
@2600ms      → step 2 ✓ done, step 3 active   [skipped on parse-error]
@3400ms      → step 3 ✓ done, advance to Review
```

Parse-error branch:
```text
@800ms   → step 0 ✓, step 1 active
@1700ms  → step 1 ✓, step 2 active
@2600ms  → step 2 icon → ✗ red, label → "Unable to extract course data"
@3500ms  → set st.parseFailed = true, render parse-failure screen
```

Implementation: drive the sequence with explicit `setTimeout`s rather than the current generic loop so the parse-error path lines up with the spec timestamps exactly.

## 4. Parse failure screen — copy + buttons

Update `sParsing()` failure branch:

- Body text: `"Our parser had trouble extracting your course information. This happens with low-resolution scans or certain formats."`
- Tips box content stays as the three spec bullets.
- Buttons (stacked, in order):
  1. Primary: "Try a different file" → existing `data-act="retry"` (resets file, scenario, parseFailed, returns to upload).
  2. Ghost (use `nv-btn-ghost` class — not secondary): "Enter my courses manually" → `data-act="manual"` sets `manualEntry=true` and jumps to review.
  3. Text link: "Skip and proceed anyway" → new `data-act="skip-review"` jumps to Review (not Email as today) without `manualEntry`. Add a small `.nv-text-link` style in `modal.css` for the link appearance (underlined, brand color, transparent background).

## 5. Review screen banners + school override

`sReview()`:
- When `st.scenario === 'school-not-found'`, display the parsed school name as the hardcoded `"Springfield Technical Community College"` everywhere the school name appears on this screen (subtitle "We found N courses from …" and the amber banner). The user's originally selected school in `st.school` is preserved for later screens.
- Amber banner copy uses that hardcoded name and includes the "Request it be added →" button.
- `manualEntry` blue banner unchanged in intent; copy matches spec.
- `success` → no banner.

`data-act="request-school"` handler: replace the banner contents inline with a confirmation message: `"Request submitted! We'll notify you when this school is added."` (keeps amber styling, no link).

## 6. State reset on "Start a new evaluation"

`restart()` already calls `resetState()`, which initializes every field. Extend `resetState()` to explicitly include all keys named in the spec (file, consent, scenario→'success', parseFailed, manualEntry, name, email, plus existing idx/school/emailTouched) so the reset contract is explicit. `idx:0` returns to school selection.

## Technical notes

- All edits to `public/navigate-modal/modal.js`; minor `.nv-text-link` rule added to `public/navigate-modal/modal.css`.
- No framework code, routes, or React components are touched.
- Branding system, progress bar, footer, and existing slide transitions remain untouched.
