/* Navigate Modal — shared module.
 * Usage: <script src="https://unpkg.com/lucide@latest"></script>
 *        <script src="/navigate-modal/modal.js"></script>
 *        NavigateModal.mount({ name, short, primary, secondary, accent, light, logoUrl, abbr })
 *        Buttons with [data-navigate-open] open the modal.
 */
(function () {
  const SCHOOLS = [
    'Bunker Hill Community College',
    'Mass Bay Community College',
    'Middlesex Community College',
    'Bristol Community College',
    'Cape Cod Community College',
    'Northern Essex Community College',
    'Quincy College',
    'Roxbury Community College',
    'Holyoke Community College',
    'Springfield Technical Community College',
    'Greenfield Community College',
    'Berkshire Community College',
    'North Shore Community College',
    'Massasoit Community College',
    'UMass Boston',
    'UMass Lowell',
    'UMass Dartmouth',
    'Salem State University',
    'Bridgewater State University',
    'Framingham State University',
    'Worcester State University',
    'Fitchburg State University',
    'Westfield State University',
    'Boston College',
    'Boston University',
    'Northeastern University',
    'Tufts University',
    'Harvard University',
    'Massachusetts Institute of Technology',
    'Suffolk University',
    'Emerson College',
    'Wellesley College',
    'Smith College',
    'Amherst College',
    'Williams College',
    'Brandeis University',
    'Wentworth Institute of Technology',
    'Simmons University',
  ];
  const POPULAR_LIMIT = 6;
  const RESULTS_LIMIT = 8;
  const COURSES = [
    { term: 'Fall 2023',   code: 'ENG 101', title: 'English Composition I',  cr: 3, grade: 'A'  },
    { term: 'Fall 2023',   code: 'MAT 120', title: 'Calculus I',             cr: 4, grade: 'B+' },
    { term: 'Fall 2023',   code: 'PSY 100', title: 'Intro to Psychology',    cr: 3, grade: 'A-' },
    { term: 'Spring 2024', code: 'BIO 110', title: 'General Biology',        cr: 4, grade: 'A-' },
    { term: 'Spring 2024', code: 'CHE 101', title: 'General Chemistry I',    cr: 4, grade: 'B'  },
    { term: 'Spring 2024', code: 'ENG 201', title: 'English Composition II', cr: 3, grade: 'B+' },
  ];
  const STAGES = ['school', 'upload', 'parsing', 'review', 'email', 'confirm'];
  const PROG   = [0, 1, 2, 2, 3, 4];
  const MAX_MB = 10;

  // Lucide icon shorthand
  const ic = (n, extra = '') => `<i data-lucide="${n}"${extra ? ' ' + extra : ''}></i>`;

  let brand = null;
  let st;
  function resetState() {
    st = {
      idx: 0,
      school: '',
      schoolKnown: false,
      forceSchoolNotFound: false,
      file: null,
      parseFailed: false,
      manualEntry: false,
      name: '',
      email: '',
      emailTouched: false,
      scenario: 'success',
      manualMode: null,   // 'bulk' | 'add' | 'edit' | null
      editIndex: null,
      draft: [],
    };
  }

  // ── Manual-entry helpers ──
  const GRADES = ['A','A-','B+','B','B-','C+','C','C-','D','F','P','IP'];
  function blankRow() {
    const existing = Array.from(new Set(COURSES.map(c => c.term)));
    return { term: existing[existing.length - 1] || `Fall ${new Date().getFullYear()}`, code: '', title: '', cr: '', grade: '' };
  }
  function termOptions() {
    const seasons = ['Fall','Spring','Summer','Winter'];
    const now = new Date().getFullYear();
    const years = [now - 3, now - 2, now - 1, now, now + 1];
    const out = [];
    years.forEach(y => seasons.forEach(s => out.push(`${s} ${y}`)));
    Array.from(new Set(COURSES.map(c => c.term))).forEach(t => { if (!out.includes(t)) out.unshift(t); });
    return out;
  }
  function isValidRow(r) {
    return !!(r.term && r.code && String(r.code).trim() && r.title && String(r.title).trim() && Number(r.cr) > 0 && r.grade);
  }
  function toCourse(r) {
    return { term: r.term, code: String(r.code).trim(), title: String(r.title).trim(), cr: Number(r.cr), grade: r.grade };
  }
  function detectScenario(filename) {
    const raw = (filename || '').toLowerCase();
    // Normalize: strip separators so PARSEERROR, parse-error, parse_error, "parse error" all match.
    const n = raw.replace(/[\s\-_.]+/g, '');
    if (n.includes('wrongformat'))    return 'wrong-format';
    if (n.includes('toolarge'))       return 'too-large';
    if (n.includes('parseerror'))     return 'parse-error';
    if (n.includes('schoolnotfound')) return 'school-not-found';
    return 'success';
  }

  function hexToRgba(hex, a) {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
  }
  function esc(s) { return (s || '').replace(/'/g, "\\'").replace(/"/g, '&quot;'); }

  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch (_) { /* noop */ }
    }
  }

  function showToast(msg) {
    const host = document.getElementById('nv-root') || document.body;
    let t = document.getElementById('nv-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'nv-toast';
      t.className = 'nv-toast';
      t.setAttribute('role', 'status');
      t.setAttribute('aria-live', 'polite');
      host.appendChild(t);
    }
    t.innerHTML = `<span class="nv-toast-icon">${ic('check-circle-2')}</span><span>${msg}</span>`;
    renderIcons();
    t.classList.remove('nv-toast-show');
    void t.offsetWidth;
    t.classList.add('nv-toast-show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => t.classList.remove('nv-toast-show'), 3200);
  }

  function ensureMarkup() {
    if (document.getElementById('nv-modal-overlay')) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = `
<div class="nv-modal-overlay" id="nv-modal-overlay">
  <div class="nv-modal" id="nv-modal">
    <div class="nv-modal-brandcol">
      <div class="nv-modal-topbar">
        <div class="nv-modal-brand">
          <div class="nv-modal-logo" id="nv-modal-logo"></div>
          <div>
            <div class="nv-modal-school" id="nv-modal-school"></div>
            <div class="nv-modal-secure">${ic('lock-keyhole')} Secure · Encrypted</div>
          </div>
        </div>
        <button class="nv-modal-close" aria-label="Close" id="nv-modal-close">${ic('x')}</button>
      </div>
      <div class="nv-prog-wrap">
        <div class="nv-prog-track"><div class="nv-prog-bar" id="nv-prog"></div></div>
        <div class="nv-stage-names">
          <div class="nv-stage-pill active" data-n="0">School</div>
          <div class="nv-stage-pill" data-n="1">Upload</div>
          <div class="nv-stage-pill" data-n="2">Review</div>
          <div class="nv-stage-pill" data-n="3">Results</div>
          <div class="nv-stage-pill" data-n="4">Done</div>
        </div>
      </div>
    </div>
    <div class="nv-modal-main">
      <div class="nv-stages" id="nv-sc"></div>
      <div class="nv-modal-footer">
        <img src="/__l5e/assets-v1/0b999754-a270-4521-b6f7-b4aae9016fba/edvisorly-owl.png" alt="" class="nv-foot-owl" aria-hidden="true"> Powered by <a href="https://www.edvisorly.com/" target="_blank" rel="noopener noreferrer" class="nv-edvisorly-link"><strong>EdVisorly</strong></a>
      </div>
    </div>
  </div>
</div>`;
    document.body.appendChild(wrap.firstElementChild);
    document.getElementById('nv-modal-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'nv-modal-overlay') closeModal();
    });
    document.getElementById('nv-modal-close').addEventListener('click', closeModal);
    renderIcons();
  }

  function applyBrand() {
    const root = document.documentElement;
    root.style.setProperty('--nv-brand', brand.primary);
    root.style.setProperty('--nv-brand-secondary', brand.secondary || brand.primary);
    root.style.setProperty('--nv-brand-accent', brand.accent || brand.primary);
    root.style.setProperty('--nv-brand-light', brand.light || hexToRgba(brand.primary, 0.08));
    root.style.setProperty('--nv-brand-shadow', hexToRgba(brand.primary, 0.22));

    const logo = document.getElementById('nv-modal-logo');
    if (brand.logoUrl) {
      const filter = brand.logoFilter ? ` style="filter:${brand.logoFilter}"` : '';
      logo.innerHTML = `<img src="${brand.logoUrl}" alt="${esc(brand.name)} logo"${filter}>`;
      logo.style.background = 'transparent';
      logo.style.padding = '0';
      logo.style.boxShadow = 'none';
    } else {
      logo.textContent = brand.abbr || (brand.short || brand.name || '').slice(0, 2).toUpperCase();
      logo.style.background = brand.secondary || brand.primary;
    }
    document.getElementById('nv-modal-school').textContent = brand.name;
  }

  function openModal() {
    ensureMarkup();
    applyBrand();
    resetState();
    document.getElementById('nv-modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    render('fwd');
    updateDemoHelp();
  }
  function closeModal() {
    const o = document.getElementById('nv-modal-overlay');
    if (o) o.classList.remove('open');
    document.body.style.overflow = '';
    updateDemoHelp();
  }
  function next() { st.idx = Math.min(st.idx + 1, STAGES.length - 1); render('fwd'); }
  function back() { st.idx = Math.max(st.idx - 1, 0); render('back'); }
  function restart() { resetState(); render('back'); }

  function updateProg() {
    const p = PROG[st.idx];
    document.getElementById('nv-prog').style.width = ((p + 1) / 5 * 100) + '%';
    document.querySelectorAll('.nv-stage-pill').forEach((el, i) => {
      el.classList.toggle('active', i === p);
      el.classList.toggle('done', i < p);
    });
  }

  function render(dir) {
    updateProg();
    const sc = document.getElementById('nv-sc');
    while (sc.firstChild) sc.removeChild(sc.firstChild);
    const div = document.createElement('div');
    div.className = 'nv-slide active' + (dir === 'back' ? ' back-anim' : '');
    if (st.manualMode) {
      div.innerHTML = sManual();
      sc.appendChild(div);
      renderIcons();
      updateDemoHelp();
      return;
    }
    const s = STAGES[st.idx];
    const html =
      s === 'school'  ? sSchool()  :
      s === 'upload'  ? sUpload()  :
      s === 'parsing' ? sParsing() :
      s === 'review'  ? sReview()  :
      s === 'email'   ? sEmail()   :
                        sConfirm();
    div.innerHTML = html;
    sc.appendChild(div);
    if (s === 'parsing') scheduleParsing();
    renderIcons();
    updateDemoHelp();
  }

  // ── Stage builders ──
  function sSchool() {
    const popular = SCHOOLS.slice(0, POPULAR_LIMIT);
    const items = popular.map(s => `<div class="nv-school-item${st.school===s?' sel':''}" data-pick="${esc(s)}">${s}${st.school===s?`<span class="nv-chk">${ic('check')}</span>`:''}</div>`).join('');
    const canContinue = !!(st.school && st.school.trim().length >= 2);
    return `
      <div><p class="nv-h1">Where are you transferring from?</p>
      <p class="nv-sub">Tell us your current school and we'll check how your credits transfer to ${brand.short}.</p></div>
      <div class="nv-input-wrap"><label class="nv-input-label">Search schools</label>
      <input class="nv-inp" id="nv-school-inp" placeholder="Type your school name…" value="${esc(st.school)}" autocomplete="off"></div>
      <div class="nv-school-list" id="nv-school-list"><div class="nv-list-header">Popular schools</div>${items}</div>
      <div class="nv-dest-box">
        <div class="nv-dest-icon">${ic('target')}</div>
        <div><div class="nv-dest-label">Evaluating transfer to</div><div class="nv-dest-val">${brand.name}</div></div>
      </div>
      <button class="nv-btn nv-btn-primary" data-act="next" ${canContinue?'':'disabled'}>Continue ${ic('arrow-right')}</button>`;
  }

  function sUpload() {
    const hasFile = !!st.file;
    return `
      <div><button class="nv-back-btn" data-act="back">${ic('arrow-left')} Back</button>
      <p class="nv-h1">Upload your transcript</p>
      <p class="nv-sub">We'll check how your credits transfer — before you apply.</p></div>
      <div class="nv-notice nv-notice-amber">${ic('lock-keyhole')} <span>Your transcript is encrypted and only used for this evaluation. <a href="/help/finding-your-transcript" target="_blank" rel="noopener noreferrer" class="nv-banner-link">Need help finding your transcript?</a></span></div>
      <label class="nv-upload-box ${hasFile?'has-file':''}" for="nv-file-inp">
        <div class="nv-upload-icon-wrap">${hasFile?ic('file-check-2'):ic('file-text')}</div>
        <span class="nv-upload-title">${hasFile?st.file:'Tap to upload your transcript'}</span>
        <span class="nv-upload-hint">${hasFile?'Tap to change':'PDF, JPG, or PNG · Max 10 MB'}</span>
        <input type="file" id="nv-file-inp" style="display:none">
      </label>
      <div id="nv-file-error" class="nv-notice nv-notice-red">${ic('alert-triangle')} <span id="nv-file-err-msg"></span></div>
      <label class="nv-consent-row"><input type="checkbox" id="nv-consent-chk" ${st.consent?'checked':''}>
      I agree my transcript data may be processed to evaluate credit transfer eligibility.</label>
      <button class="nv-btn nv-btn-primary" id="nv-upload-btn" data-act="next" ${hasFile&&st.consent?'':'disabled'}>Continue ${ic('arrow-right')}</button>`;
  }

  function sParsing() {
    if (st.parseFailed) return `
      <div><p class="nv-h1">We couldn't read your transcript</p>
      <p class="nv-sub">Our parser had trouble extracting your course information. This happens with low-resolution scans or certain formats.</p></div>
      <div class="nv-parse-failed-icon">${ic('file-x-2')}</div>
      <div class="nv-parse-tips"><div class="nv-parse-tips-title">What usually helps</div>
      <div class="nv-tip-item"><div class="nv-tip-dot"></div><span>Use an official PDF from your school portal, not a scan</span></div>
      <div class="nv-tip-item"><div class="nv-tip-dot"></div><span>If scanning, ensure the page is flat and well-lit</span></div>
      <div class="nv-tip-item"><div class="nv-tip-dot"></div><span>JPG/PNG work best when text is sharp and unrotated</span></div></div>
      <button class="nv-btn nv-btn-primary" data-act="retry">Try a different file</button>
      <button class="nv-btn nv-btn-ghost" data-act="manual">Enter my courses manually</button>`;
    return `<div class="nv-parsing-wrap">
      <div class="nv-spinner"></div>
      <div><p style="font-size:15px;font-weight:600;color:#1a1a1a">Reading your transcript…</p>
      <p style="font-size:12px;color:#8a857d;line-height:1.5;max-width:260px;margin:6px auto 0">Finding your courses, credits, and grades.</p></div>
      <div class="nv-parsing-steps">
        <div class="nv-ps active" id="nv-ps0"><div class="nv-ps-icon">1</div><span>Uploading transcript</span></div>
        <div class="nv-ps" id="nv-ps1"><div class="nv-ps-icon">2</div><span>Detecting course records</span></div>
        <div class="nv-ps" id="nv-ps2"><div class="nv-ps-icon">3</div><span>Extracting grades &amp; credits</span></div>
        <div class="nv-ps" id="nv-ps3"><div class="nv-ps-icon">4</div><span>Preparing your review</span></div>
      </div></div>`;
  }

  function markDone(i) {
    const el = document.getElementById('nv-ps' + i);
    if (!el) return;
    el.classList.remove('active');
    el.classList.add('done');
    const ico = el.querySelector('.nv-ps-icon');
    if (ico) ico.innerHTML = ic('check');
  }
  function activate(i) {
    const el = document.getElementById('nv-ps' + i);
    if (el) el.classList.add('active');
  }
  function failStep(i, label) {
    const el = document.getElementById('nv-ps' + i);
    if (!el) return;
    el.classList.remove('active');
    el.classList.add('failed');
    const ico = el.querySelector('.nv-ps-icon');
    if (ico) ico.innerHTML = ic('x');
    const lbl = el.querySelector('span');
    if (lbl) lbl.textContent = label;
  }

  function scheduleParsing() {
    if (st.parseFailed) return;
    const isError = st.scenario === 'parse-error';
    setTimeout(() => { if (st.parseFailed) return; markDone(0); activate(1); renderIcons(); }, 800);
    setTimeout(() => { if (st.parseFailed) return; markDone(1); activate(2); renderIcons(); }, 1700);
    if (isError) {
      setTimeout(() => { if (st.parseFailed) return; failStep(2, 'Unable to extract course data'); renderIcons(); }, 2600);
      setTimeout(() => { st.parseFailed = true; render('fwd'); }, 3500);
    } else {
      setTimeout(() => { if (st.parseFailed) return; markDone(2); activate(3); renderIcons(); }, 2600);
      setTimeout(() => { if (st.parseFailed) return; markDone(3); renderIcons(); next(); }, 3400);
    }
  }

  function sReview() {
    const terms = {};
    COURSES.forEach((c, i) => { (terms[c.term] = terms[c.term] || []).push(Object.assign({ _i: i }, c)); });
    const total = COURSES.reduce((s, c) => s + c.cr, 0);
    const isUnknownSchool = st.scenario === 'school-not-found';
    const displaySchool = st.school || 'your school';
    const banner = st.manualEntry
      ? `<div class="nv-notice nv-notice-blue" id="nv-review-banner">${ic('info')} We couldn't parse your transcript automatically. Fill in your actual courses before continuing.</div>`
      : (isUnknownSchool
        ? `<div class="nv-notice nv-notice-amber" id="nv-review-banner"><span>${ic('alert-triangle')}</span><span><strong>${displaySchool}</strong> isn't in our transfer database yet. We've parsed your courses, but credit mapping may be estimated. <a href="#" class="nv-banner-link" data-act="request-school">Request it be added →</a></span></div>`
        : '');
    return `
      <div><button class="nv-back-btn" data-act="back">${ic('arrow-left')} Back</button>
      <p class="nv-h1">Does this look right?</p>
      <p class="nv-sub">We found <strong>${COURSES.length} courses</strong> from <strong>${displaySchool}</strong>.</p></div>
      ${banner}
      <div class="nv-summary-row">
        <div class="nv-summary-card"><div class="nv-summary-num">${COURSES.length}</div><div class="nv-summary-sub">Courses</div></div>
        <div class="nv-summary-card"><div class="nv-summary-num">${total}</div><div class="nv-summary-sub">Credits</div></div>
      </div>
      ${Object.entries(terms).map(([term, cs]) => `<div>
        <div class="nv-term-label">${term}</div>
        ${cs.map(c => `<div class="nv-course-card">
          <div class="nv-course-top"><span>${c.title}</span><button class="nv-edit-btn" data-act="edit-course" data-i="${c._i}">Edit</button></div>
          <div class="nv-course-meta"><span>${c.code}</span><span>·</span><span>${c.cr} cr</span><span>·</span><span class="${c.grade.startsWith('A')?'nv-grade-good':''}">${c.grade}</span></div>
        </div>`).join('')}
      </div>`).join('')}
      <button class="nv-add-course-btn" data-act="add-course">${ic('plus')} Add a missing course</button>
      <button class="nv-btn nv-btn-primary" data-act="next">Looks correct — continue ${ic('arrow-right')}</button>`;
  }

  function sManual() {
    const mode = st.manualMode;
    const titles = { bulk: 'Enter your courses', add: 'Add a course', edit: 'Edit course' };
    const ctas   = { bulk: 'Save courses & continue', add: 'Add course', edit: 'Save changes' };
    const subs   = {
      bulk: "Add each course as it appears on your transcript. You can edit anything later.",
      add:  "Fill in the details for the missing course.",
      edit: "Update the details for this course."
    };
    const showRemove = mode === 'bulk' && st.draft.length > 1;
    const allValid = st.draft.length > 0 && st.draft.every(isValidRow);
    const totalCr  = st.draft.reduce((s, r) => s + (Number(r.cr) || 0), 0);
    const TERMS = termOptions();

    const rowsHtml = st.draft.map((r, i) => `
      <div class="nv-manual-row" data-row="${i}">
        ${mode === 'bulk' ? `<div class="nv-manual-row-head">
          <span class="nv-manual-row-num">Course ${i + 1}</span>
          ${showRemove ? `<button class="nv-manual-remove" data-act="manual-remove-row" data-i="${i}" aria-label="Remove course">${ic('trash-2')}</button>` : ''}
        </div>` : ''}
        <div class="nv-manual-grid">
          <div class="nv-input-wrap nv-mf-term">
            <label class="nv-input-label" for="nv-mf-term-${i}">Term</label>
            <select class="nv-inp" id="nv-mf-term-${i}" data-row="${i}" data-field="term">
              ${TERMS.map(t => `<option value="${esc(t)}"${r.term===t?' selected':''}>${t}</option>`).join('')}
            </select>
          </div>
          <div class="nv-input-wrap nv-mf-code">
            <label class="nv-input-label" for="nv-mf-code-${i}">Course code</label>
            <input class="nv-inp" id="nv-mf-code-${i}" data-row="${i}" data-field="code" placeholder="ENG 101" value="${esc(r.code)}" autocomplete="off">
          </div>
          <div class="nv-input-wrap nv-mf-title">
            <label class="nv-input-label" for="nv-mf-title-${i}">Course title</label>
            <input class="nv-inp" id="nv-mf-title-${i}" data-row="${i}" data-field="title" placeholder="English Composition I" value="${esc(r.title)}" autocomplete="off">
          </div>
          <div class="nv-input-wrap nv-mf-cr">
            <label class="nv-input-label" for="nv-mf-cr-${i}">Credits</label>
            <input class="nv-inp" id="nv-mf-cr-${i}" type="number" inputmode="decimal" min="0" max="6" step="0.5" data-row="${i}" data-field="cr" placeholder="3" value="${r.cr}">
          </div>
          <div class="nv-input-wrap nv-mf-grade">
            <label class="nv-input-label" for="nv-mf-grade-${i}">Grade</label>
            <select class="nv-inp" id="nv-mf-grade-${i}" data-row="${i}" data-field="grade">
              <option value="">—</option>
              ${GRADES.map(g => `<option value="${g}"${r.grade===g?' selected':''}>${g}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>`).join('');

    return `
      <div><button class="nv-back-btn" data-act="manual-cancel">${ic('arrow-left')} Back</button>
      <p class="nv-h1">${titles[mode]}</p>
      <p class="nv-sub">${subs[mode]}</p></div>
      ${mode === 'bulk'
        ? `<div class="nv-manual-summary" id="nv-manual-summary">${st.draft.length} ${st.draft.length===1?'course':'courses'} · ${totalCr} ${totalCr===1?'credit':'credits'}</div>`
        : ''}
      ${rowsHtml}
      ${mode === 'bulk'
        ? `<button class="nv-add-course-btn" data-act="manual-add-row">${ic('plus')} Add another course</button>`
        : ''}
      <button class="nv-btn nv-btn-primary" data-act="manual-save" ${allValid ? '' : 'disabled'}>${ctas[mode]}${mode==='bulk' ? ' ' + ic('arrow-right') : ''}</button>
      <button class="nv-text-link" data-act="manual-cancel">Cancel</button>`;
  }

  function updateManualState() {
    const slide = document.querySelector('#nv-sc .nv-slide');
    if (!slide) return;
    const allValid = st.draft.length > 0 && st.draft.every(isValidRow);
    const btn = slide.querySelector('[data-act="manual-save"]');
    if (btn) btn.disabled = !allValid;
    const sum = document.getElementById('nv-manual-summary');
    if (sum && st.manualMode === 'bulk') {
      const totalCr = st.draft.reduce((s, r) => s + (Number(r.cr) || 0), 0);
      sum.textContent = `${st.draft.length} ${st.draft.length===1?'course':'courses'} · ${totalCr} ${totalCr===1?'credit':'credits'}`;
    }
  }

  function sEmail() {
    const emailOk = st.email.includes('@') && st.email.includes('.');
    const showErr = st.emailTouched && st.email && !emailOk;
    return `
      <div><button class="nv-back-btn" data-act="back">${ic('arrow-left')} Back</button>
      <p class="nv-h1">Where should we send your results?</p>
      <p class="nv-sub">Your evaluation is almost ready — we'll email you the full breakdown.</p></div>
      <div class="nv-value-box">
        <div class="nv-value-icon">${ic('bar-chart-3')}</div>
        <div><div class="nv-value-title">Evaluation ready to run</div>
        <div class="nv-value-sub">${COURSES.length} courses from ${st.school||'your school'} → ${brand.name}</div></div>
      </div>
      <div class="nv-input-wrap"><label class="nv-input-label">Your name</label>
      <input class="nv-inp" id="nv-name-inp" placeholder="Jordan Smith" value="${st.name}" autocomplete="name"></div>
      <div class="nv-input-wrap"><label class="nv-input-label">Email address</label>
      <input class="nv-inp${showErr?' nv-inp-error':''}" id="nv-email-inp" type="email" placeholder="jordan@email.com" value="${st.email}" autocomplete="email">
      <div class="nv-field-err-msg" id="nv-email-err" style="${showErr?'display:block':''}">Please enter a valid email address.</div>
      <div class="nv-field-hint" id="nv-email-hint" style="${showErr?'display:none':''}">We'll only use this to send your evaluation.</div></div>
      <button class="nv-btn nv-btn-primary" id="nv-email-btn" data-act="next" ${st.name&&emailOk?'':'disabled'}>Send my results ${ic('arrow-right')}</button>`;
  }

  function sConfirm() {
    const first = (st.name || '').trim().split(' ')[0];
    return `
      <div style="text-align:center;padding-top:8px">
        <div class="nv-confirm-icon-wrap">${ic('check-circle-2')}</div>
        <p class="nv-h1" style="margin-top:14px">Your evaluation is on its way${first?', '+first:''}!</p>
        <p class="nv-sub" style="margin-top:6px">We're analyzing your transcript. Expect your ${brand.short} credit evaluation within <strong>1–2 business days</strong>.</p>
        ${st.email?`<div style="margin-top:12px;display:flex;justify-content:center"><div class="nv-email-chip">${ic('mail')} <span>${st.email}</span></div></div>`:''}
      </div>
      <div class="nv-next-steps">
        <div class="nv-next-title">What happens next</div>
        <div class="nv-next-item"><div class="nv-next-num">1</div><span>We finish analyzing your ${COURSES.length} courses from ${st.school||'your school'}</span></div>
        <div class="nv-next-item"><div class="nv-next-num">2</div><span>You'll receive a full credit transfer report by email</span></div>
        <div class="nv-next-item"><div class="nv-next-num">3</div><span>See exactly which courses count toward your ${brand.short} degree</span></div>
      </div>
      <button class="nv-resend-btn" data-act="resend-email">Resend confirmation email</button>
      <button class="nv-btn nv-btn-secondary" data-act="restart">Start a new evaluation</button>`;
  }

  // ── Delegated handlers within the modal ──
  document.addEventListener('click', (e) => {
    const open = e.target.closest('[data-navigate-open]');
    if (open) { e.preventDefault(); openModal(); return; }

    const sc = e.target.closest('#nv-sc');
    if (!sc) return;
    const act = e.target.closest('[data-act]');
    if (act) {
      const a = act.dataset.act;
      if (a === 'next') next();
      else if (a === 'back') back();
      else if (a === 'restart') restart();
      else if (a === 'resend-email') {
        const btn = act;
        const prev = btn.textContent;
        btn.disabled = true;
        showToast(`Confirmation email sent to ${st.email || 'your inbox'}.`);
        btn.textContent = 'Email sent ✓';
        setTimeout(() => { btn.disabled = false; btn.textContent = prev; }, 4000);
      }
      else if (a === 'retry') { st.parseFailed = false; st.file = null; st.scenario = 'success'; st.idx = STAGES.indexOf('upload'); render('back'); }
      else if (a === 'manual') { st.parseFailed = false; st.manualMode = 'bulk'; st.draft = [blankRow()]; st.editIndex = null; render('fwd'); }
      else if (a === 'add-course') { st.manualMode = 'add'; st.draft = [blankRow()]; st.editIndex = null; render('fwd'); }
      else if (a === 'edit-course') {
        const i = Number(act.dataset.i);
        if (!Number.isFinite(i) || !COURSES[i]) return;
        st.manualMode = 'edit'; st.editIndex = i;
        st.draft = [{ term: COURSES[i].term, code: COURSES[i].code, title: COURSES[i].title, cr: COURSES[i].cr, grade: COURSES[i].grade }];
        render('fwd');
      }
      else if (a === 'manual-add-row') {
        st.draft.push(blankRow());
        render('fwd');
        const last = st.draft.length - 1;
        const focusEl = document.getElementById('nv-mf-code-' + last);
        if (focusEl) focusEl.focus();
      }
      else if (a === 'manual-remove-row') {
        const i = Number(act.dataset.i);
        if (!Number.isFinite(i)) return;
        st.draft.splice(i, 1);
        if (!st.draft.length) st.draft.push(blankRow());
        render('fwd');
      }
      else if (a === 'manual-save') {
        if (!st.draft.every(isValidRow)) return;
        if (st.manualMode === 'bulk') {
          COURSES.length = 0;
          st.draft.forEach(r => COURSES.push(toCourse(r)));
          st.manualEntry = true;
          st.manualMode = null;
          st.draft = [];
          st.idx = STAGES.indexOf('review');
          render('fwd');
        } else if (st.manualMode === 'add') {
          COURSES.push(toCourse(st.draft[0]));
          st.manualMode = null; st.draft = [];
          render('back');
        } else if (st.manualMode === 'edit') {
          COURSES[st.editIndex] = toCourse(st.draft[0]);
          st.manualMode = null; st.editIndex = null; st.draft = [];
          render('back');
        }
      }
      else if (a === 'manual-cancel') {
        st.manualMode = null; st.editIndex = null; st.draft = [];
        render('back');
      }
      
      else if (a === 'skip') { st.parseFailed = false; st.idx = STAGES.indexOf('email'); render('fwd'); }
      else if (a === 'request-school') {
        e.preventDefault();
        const banner = document.getElementById('nv-review-banner');
        if (banner) {
          banner.innerHTML = `<span>${ic('check-circle-2')}</span><span>Request submitted! We'll notify you when this school is added.</span>`;
          renderIcons();
        }
      }
      return;
    }
    const pick = e.target.closest('[data-pick]');
    if (pick) {
      st.school = pick.dataset.pick;
      st.schoolKnown = true;
      st.forceSchoolNotFound = false;
      const inp = document.getElementById('nv-school-inp'); if (inp) inp.value = st.school;
      const list = document.getElementById('nv-school-list');
      if (list) list.innerHTML = `<div class="nv-list-header">Selected</div><div class="nv-school-item sel">${st.school}<span class="nv-chk">${ic('check')}</span></div>`;
      const btn = document.querySelector('#nv-sc .nv-btn-primary'); if (btn) btn.disabled = false;
      renderIcons();
    }
  });

  document.addEventListener('input', (e) => {
    if (e.target.id === 'nv-school-inp') {
      const q = e.target.value;
      const q2 = q.trim().toLowerCase();
      const exact = SCHOOLS.find(s => s.toLowerCase() === q2);
      st.school = q.trim();
      st.schoolKnown = !!exact;
      st.forceSchoolNotFound = !!(st.school.length >= 2 && !exact);
      const list = document.getElementById('nv-school-list');
      if (list) {
        const f = q2 ? SCHOOLS.filter(s => s.toLowerCase().includes(q2)) : SCHOOLS.slice(0, POPULAR_LIMIT);
        const hdr = q2 ? 'Results' : 'Popular schools';
        if (!q2 || f.length) {
          const shown = f.slice(0, RESULTS_LIMIT);
          const more = f.length > RESULTS_LIMIT ? `<div class="nv-list-more">+${f.length - RESULTS_LIMIT} more — keep typing to narrow down</div>` : '';
          list.innerHTML = `<div class="nv-list-header">${hdr}</div>${shown.map(s => `<div class="nv-school-item${st.school===s?' sel':''}" data-pick="${esc(s)}">${s}</div>`).join('')}${more}`;
        } else {
          list.innerHTML = `<div class="nv-school-notfound">
            <div class="nv-notfound-title">We don't have "${esc(q)}" in our database yet</div>
            <div class="nv-notfound-sub">No problem — tap <strong>Continue</strong> below and we'll flag this on the next step.</div>
          </div>`;
        }
      }
      const btn = document.querySelector('#nv-sc .nv-btn-primary');
      if (btn) btn.disabled = !(st.school.length >= 2);
    }
    if (e.target.id === 'nv-name-inp')  { st.name = e.target.value; syncEmailBtn(); }
    if (e.target.id === 'nv-email-inp') { st.email = e.target.value; syncEmailBtn(); }
    const t = e.target;
    if (st.manualMode && t && t.dataset && t.dataset.row !== undefined && t.dataset.field) {
      const i = Number(t.dataset.row);
      const f = t.dataset.field;
      if (st.draft[i]) { st.draft[i][f] = t.value; updateManualState(); }
    }
  });
  document.addEventListener('change', (e) => {
    if (e.target.id === 'nv-consent-chk') { st.consent = e.target.checked; syncUploadBtn(); }
    if (e.target.id === 'nv-file-inp') handleFile(e.target);
    const t = e.target;
    if (st.manualMode && t && t.dataset && t.dataset.row !== undefined && t.dataset.field) {
      const i = Number(t.dataset.row);
      const f = t.dataset.field;
      if (st.draft[i]) { st.draft[i][f] = t.value; updateManualState(); }
    }
  });
  document.addEventListener('blur', (e) => {
    if (e.target && e.target.id === 'nv-email-inp') {
      st.emailTouched = true;
      const ok = st.email.includes('@') && st.email.includes('.');
      const show = st.emailTouched && st.email && !ok;
      const inp = document.getElementById('nv-email-inp');
      const errEl = document.getElementById('nv-email-err');
      const hintEl = document.getElementById('nv-email-hint');
      if (inp) inp.classList.toggle('nv-inp-error', show);
      if (errEl) errEl.style.display = show ? 'block' : 'none';
      if (hintEl) hintEl.style.display = show ? 'none' : '';
      syncEmailBtn();
    }
  }, true);

  function syncUploadBtn() { const b = document.getElementById('nv-upload-btn'); if (b) b.disabled = !(st.file && st.consent); }
  function syncEmailBtn() {
    const ok = st.email.includes('@') && st.email.includes('.');
    const b = document.getElementById('nv-email-btn'); if (b) b.disabled = !(st.name && ok);
  }
  function handleFile(input) {
    const f = input.files[0]; if (!f) return;
    const errEl = document.getElementById('nv-file-error');
    const errMsg = document.getElementById('nv-file-err-msg');

    // 1) Detect scenario from filename FIRST — must happen before any validation.
    const scenario = detectScenario(f.name);
    const simulated = scenario === 'too-large' || scenario === 'parse-error' || scenario === 'school-not-found' || scenario === 'success';

    const accepted = ['application/pdf', 'image/jpeg', 'image/png'];
    let err = null;

    // 2) Wrong-format check (simulated OR real MIME mismatch). Simulated non-wrong-format
    // scenarios bypass the MIME check so demo PDFs with empty/odd MIME types still proceed.
    if (scenario === 'wrong-format' || (!simulated && !accepted.includes(f.type))) {
      err = `That file format isn't supported. Navigate only accepts PDF, JPG, or PNG transcripts.`;
    } else {
      // 3) Too-large check (simulated OR real size) — runs AFTER scenario detection.
      const simulatedMB = '14.2';
      const displayMB = scenario === 'too-large' ? simulatedMB : (f.size / 1024 / 1024).toFixed(1);
      if (scenario === 'too-large' || f.size > MAX_MB * 1024 * 1024) {
        err = `This file is too large (${displayMB} MB). The maximum is ${MAX_MB} MB. Try exporting a compressed PDF from your school portal, or take a clear photo instead.`;
      }
    }

    if (err) {
      if (errMsg) errMsg.textContent = err;
      if (errEl) errEl.style.display = 'flex';
      st.file = null;
      st.scenario = 'success';
      syncUploadBtn();
      input.value = '';
      return;
    }

    if (errEl) errEl.style.display = 'none';
    // 4) Valid — store scenario for later stages (parsing + review read st.scenario).
    st.file = f.name;
    st.scenario = (st.forceSchoolNotFound && scenario === 'success') ? 'school-not-found' : scenario;
    const slide = document.querySelector('#nv-sc .nv-slide');
    if (slide) { slide.innerHTML = sUpload(); renderIcons(); }
  }


  function mountDemoSwitcher() {
    if (document.querySelector('.nv-demo-fab')) return;
    const schools = [
      { slug: 'tufts', name: 'Tufts' },
      { slug: 'bu', name: 'BU' },
      { slug: 'northeastern', name: 'Northeastern' },
      { slug: 'umass', name: 'UMass' },
    ];
    const path = (location.pathname || '').toLowerCase();
    const items = schools.map(s => {
      const active = path.indexOf('/' + s.slug) === 0 || path.indexOf('/schools/' + s.slug) === 0;
      return `<a class="nv-demo-fab-item${active?' active':''}" href="/${s.slug}">${s.name}</a>`;
    }).join('');
    const wrap = document.createElement('div');
    wrap.className = 'nv-demo-fab';
    wrap.innerHTML = `
      <div class="nv-demo-fab-menu" role="menu">
        <div class="nv-demo-fab-blurb">
          <strong>Demo navigator</strong>
          Switch between mock university pages to see the EdVisorly Navigate
          experience embedded in different brands. Click "Check my credit
          transfer" on any page to open the credit-transfer modal.
        </div>
        ${items}
      </div>
      <button class="nv-demo-fab-toggle" aria-label="Switch demo school" aria-expanded="false">
        Demo ${ic('chevron-up')}
      </button>`;
    document.body.appendChild(wrap);
    const toggle = wrap.querySelector('.nv-demo-fab-toggle');
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = wrap.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      updateDemoHelp();
    });
    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        updateDemoHelp();
      }
    });

    // Desktop-only "Demo files" cheat-sheet shown beside the open Demo dropdown during the upload stage.
    if (!wrap.querySelector('.nv-demo-help')) {
      const help = document.createElement('aside');
      help.className = 'nv-demo-help';
      help.innerHTML = `
        <div class="nv-demo-help-title">Demo files — upload each to trigger a scenario:</div>
        <ul class="nv-demo-help-list">
          <li><span class="nv-demo-help-emoji">✅</span><code>transcript-jordan-SUCCESS.pdf</code> <span class="nv-demo-help-arrow">→</span> Happy path</li>
          <li><span class="nv-demo-help-emoji">❌</span><code>transcript-jordan-WRONG-FORMAT.txt</code> <span class="nv-demo-help-arrow">→</span> Wrong file type</li>
          <li><span class="nv-demo-help-emoji">⚠️</span><code>transcript-jordan-TOO-LARGE.pdf</code> <span class="nv-demo-help-arrow">→</span> File too large</li>
          <li><span class="nv-demo-help-emoji">🐞</span><code>transcript-jordan-PARSE-ERROR.pdf</code> <span class="nv-demo-help-arrow">→</span> Parsing failure</li>
          <li><span class="nv-demo-help-emoji">🔍</span><code>transcript-jordan-SCHOOL-NOT-FOUND.pdf</code> <span class="nv-demo-help-arrow">→</span> Unknown school</li>
        </ul>`;
      wrap.appendChild(help);
    }

    renderIcons();
    updateDemoHelp();
  }

  function updateDemoHelp() {
    const help = document.querySelector('.nv-demo-help');
    if (!help) return;
    const overlay = document.getElementById('nv-modal-overlay');
    const fab = document.querySelector('.nv-demo-fab');
    const modalOpen = !!(overlay && overlay.classList.contains('open'));
    const onUpload = !!(st && STAGES[st.idx] === 'upload');
    const fabOpen = !!(fab && fab.classList.contains('open'));
    help.classList.toggle('visible', modalOpen && onUpload && fabOpen);
  }

  window.NavigateModal = {
    mount(b) { brand = b; ensureMarkup(); applyBrand(); mountDemoSwitcher(); },
    open: openModal,
    close: closeModal,
  };
})();
