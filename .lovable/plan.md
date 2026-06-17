## Goal
Give students on the Upload step a discreet path to get help retrieving their transcript, without crowding the modal UI.

## UX
- On the Upload step, inside the existing amber "Your transcript is encrypted…" notice, append a small inline link: **"Need help finding your transcript?"**
- The link opens in a new browser tab (`target="_blank"` + `rel="noopener noreferrer"`) so the modal/upload state is preserved.
- Styled using the existing `.nv-banner-link` class (same treatment used in the Review step's "Request it be added →" link) — underlined, inherits banner color, weight 600. No new component, no extra row.
- Only added to the Upload step (`sUpload()`), not other steps.

## Help article
EdVisorly's public site has no dedicated student-facing "how to download your transcript" article (its student-side product is mobile-app based; the marketing site is institution-focused). To keep the link "from EdVisorly itself" and avoid sending students to a third-party site, ship a small help page hosted on this same deployment, written in EdVisorly's voice.

- New route: `src/routes/help.finding-your-transcript.tsx` → URL `/help/finding-your-transcript`.
- Full `head()` metadata (unique title + description + og tags) per TanStack route conventions.
- Layout: simple centered article, neutral background matching the site, EdVisorly owl + wordmark at top, back-to-home link, single H1, short intro, then sections.

### Content outline (written concisely, friendly, ~400–600 words)
1. **What is a transcript?** One short paragraph: an official record of courses, credits, and grades issued by your current/previous school.
2. **Unofficial vs official** — for a transfer evaluation here, an unofficial PDF from your student portal is fine.
3. **How to download it (step-by-step generic)**
   - Sign in to your student portal (Banner, Workday, MyCollege, Self-Service, etc.).
   - Look under **Academics → Records / Transcripts / Grades / Academic History**.
   - Choose **View / Print Unofficial Transcript** and save as **PDF**.
   - If only an on-screen view is offered, use your browser's **Print → Save as PDF**.
4. **Common portal names** — short bulleted list (Banner / Workday Student / Self-Service / MyCollege / Slate / PeopleSoft Campus Solutions) with the path each uses.
5. **Tips for a clean upload**
   - Prefer the official PDF over a phone photo.
   - If scanning, keep the page flat and well-lit.
   - PDF, JPG, or PNG, under 10 MB.
6. **Privacy** — one line repeating the modal banner: encrypted, used only for this evaluation.
7. **Still stuck?** — suggest contacting their current school's registrar; mention they can also enter courses manually inside the modal.

No external EdVisorly URL is linked, since none exists for this content. The page sits on the same domain so it reads as part of the EdVisorly-powered experience.

## Files
- `public/navigate-modal/modal.js` — in `sUpload()`, change the `.nv-notice-amber` block to include `<a href="/help/finding-your-transcript" target="_blank" rel="noopener noreferrer" class="nv-banner-link">Need help finding your transcript?</a>` after the existing text, separated by a space/middot.
- `src/routes/help.finding-your-transcript.tsx` — new TanStack route with `head()` metadata and the article content described above. Uses semantic HTML (`<main>`, single `<h1>`, `<h2>` per section, `<ol>`/`<ul>`).
- No CSS changes needed (`.nv-banner-link` already exists in `modal.css`).

## Out of scope
- No changes to other modal steps.
- No analytics, no i18n, no CMS.
- No edits to `routeTree.gen.ts` (auto-generated).
