## Plan

Update only the scenario-detection path in `public/navigate-modal/modal.js` so the attached filenames map to the intended outcomes:

- `transcriptjordanTOOLARGE.pdf` → too-large upload error with `14.2 MB > 10 MB` messaging.
- `transcriptjordanPARSEERROR.pdf` → parsing failure screen.
- `transcriptjordanSCHOOLNOTFOUND.pdf` → unknown-school review banner and request-confirmation flow.
- `transcriptjordanWRONGFORMAT.txt` → existing wrong-format logic remains untouched.
- `transcriptjordanSUCCESS.pdf` → only file that proceeds through the full journey.

## Technical details

The current `detectScenario()` only recognizes hyphenated/underscored tokens like `parse-error`, `too-large`, and `school-not-found`. The uploaded files use compact names like `PARSEERROR`, `TOOLARGE`, and `SCHOOLNOTFOUND`, so they fall through to `success`.

I’ll make `detectScenario()` normalize filenames by removing separators/casing, then check both canonical token forms and compact forms. I won’t change the validation order, wrong-format branch, parsing templates, review templates, or modal styling.

## Verification

After implementation, I’ll verify the mapped scenarios in code and, if browser automation is available, exercise the upload flow at desktop and mobile widths for the attached files.