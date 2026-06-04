In `public/navigate-modal/modal.js`, the Review screen hardcodes the unknown‑school name as "Springfield Technical Community College" (line 377). Replace that fallback with `st.school` so the banner shows whatever the user actually typed on step 1.

```js
const displaySchool = st.school || 'your school';
```

This removes the special case for `isUnknownSchool` in the display name (it's still used to decide whether the amber banner shows). The four demo files keep working: the dedicated `transcript-jordan-SCHOOL-NOT-FOUND.pdf` flow already sets `st.school` from the step‑1 input, so the banner will read it back instead of the hardcoded Springfield string.

Out of scope: no other text, styling, or scenario logic changes.
