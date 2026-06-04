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
  ];
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
      file: null,
      consent: false,
      parseFailed: false,
      manualEntry: false,
      name: '',
      email: '',
      emailTouched: false,
      scenario: 'success',
    };
  }
  function detectScenario(filename) {
    const n = (filename || '').toLowerCase();
    if (n.includes('wrong-format') || n.includes('wrong_format')) return 'wrong-format';
    if (n.includes('too-large')    || n.includes('too_large'))    return 'too-large';
    if (n.includes('parse-error')  || n.includes('parse_error'))  return 'parse-error';
    if (n.includes('school-not-found') || n.includes('school_not_found')) return 'school-not-found';
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
        ${ic('shield-check')} Powered by <a href="https://www.edvisorly.com/" target="_blank" rel="noopener noreferrer" class="nv-edvisorly-link"><strong>EdVisorly</strong></a>
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
    const s = STAGES[st.idx];
    const html =
      s === 'school'  ? sSchool()  :
      s === 'upload'  ? sUpload()  :
      s === 'parsing' ? sParsing() :
      s === 'review'  ? sReview()  :
      s === 'email'   ? sEmail()   :
                        sConfirm();
    const div = document.createElement('div');
    div.className = 'nv-slide active' + (dir === 'back' ? ' back-anim' : '');
    div.innerHTML = html;
    sc.appendChild(div);
    if (s === 'parsing') scheduleParsing();
    renderIcons();
    updateDemoHelp();
  }

  // ── Stage builders ──
  function sSchool() {
    const items = SCHOOLS.map(s => `<div class="nv-school-item${st.school===s?' sel':''}" data-pick="${esc(s)}">${s}${st.school===s?`<span class="nv-chk">${ic('check')}</span>`:''}</div>`).join('');
    return `
      <div><p class="nv-h1">Where are you transferring from?</p>
      <p class="nv-sub">Tell us your current school and we'll check how your credits transfer to ${brand.short}.</p></div>
      <div class="nv-input-wrap"><label class="nv-input-label">Search schools</label>
      <input class="nv-inp" id="nv-school-inp" placeholder="Type your school name…" value="${st.school}" autocomplete="off"></div>
      <div class="nv-school-list" id="nv-school-list"><div class="nv-list-header">Popular schools</div>${items}</div>
      <div class="nv-dest-box">
        <div class="nv-dest-icon">${ic('target')}</div>
        <div><div class="nv-dest-label">Evaluating transfer to</div><div class="nv-dest-val">${brand.name}</div></div>
      </div>
      <button class="nv-btn nv-btn-primary" data-act="next" ${st.school?'':'disabled'}>Continue ${ic('arrow-right')}</button>`;
  }

  function sUpload() {
    const hasFile = !!st.file;
    return `
      <div><button class="nv-back-btn" data-act="back">${ic('arrow-left')} Back</button>
      <p class="nv-h1">Upload your transcript</p>
      <p class="nv-sub">We'll check how your credits transfer — before you apply.</p></div>
      <div class="nv-notice nv-notice-amber">${ic('lock-keyhole')} Your transcript is encrypted and only used for this evaluation.</div>
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
      <button class="nv-btn nv-btn-ghost" data-act="manual">Enter my courses manually</button>
      <button class="nv-text-link" data-act="skip-review">Skip and proceed anyway</button>`;
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
    COURSES.forEach(c => { (terms[c.term] = terms[c.term] || []).push(c); });
    const total = COURSES.reduce((s, c) => s + c.cr, 0);
    const isUnknownSchool = st.scenario === 'school-not-found';
    const displaySchool = isUnknownSchool
      ? 'Springfield Technical Community College'
      : (st.school || 'your school');
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
          <div class="nv-course-top"><span>${c.title}</span><button class="nv-edit-btn">Edit</button></div>
          <div class="nv-course-meta"><span>${c.code}</span><span>·</span><span>${c.cr} cr</span><span>·</span><span class="${c.grade.startsWith('A')?'nv-grade-good':''}">${c.grade}</span></div>
        </div>`).join('')}
      </div>`).join('')}
      <button class="nv-add-course-btn">${ic('plus')} Add a missing course</button>
      <button class="nv-btn nv-btn-primary" data-act="next">Looks correct — continue ${ic('arrow-right')}</button>`;
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
      <button class="nv-resend-btn">Resend confirmation email</button>
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
      else if (a === 'retry') { st.parseFailed = false; st.file = null; st.scenario = 'success'; st.idx = STAGES.indexOf('upload'); render('back'); }
      else if (a === 'manual') { st.parseFailed = false; st.manualEntry = true; st.idx = STAGES.indexOf('review'); render('fwd'); }
      else if (a === 'skip-review') { st.parseFailed = false; st.idx = STAGES.indexOf('review'); render('fwd'); }
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
      st.school = '';
      const list = document.getElementById('nv-school-list');
      if (!list) return;
      const q2 = q.trim().toLowerCase();
      const f = q2 ? SCHOOLS.filter(s => s.toLowerCase().includes(q2)) : SCHOOLS;
      const hdr = q2 ? 'Results' : 'Popular schools';
      if (!q2 || f.length) {
        list.innerHTML = `<div class="nv-list-header">${hdr}</div>${f.map(s => `<div class="nv-school-item" data-pick="${esc(s)}">${s}</div>`).join('')}`;
      } else {
        list.innerHTML = `<div class="nv-school-notfound">
          <div class="nv-notfound-title">We don't have "${q}" in our system yet</div>
          <div class="nv-notfound-sub">Your school may not be in our transfer database.</div>
          <button class="nv-btn nv-btn-primary" style="font-size:13px" data-continue-unknown="${esc(q)}">Continue anyway</button>
        </div>`;
      }
      const btn = document.querySelector('#nv-sc .nv-btn-primary'); if (btn) btn.disabled = true;
    }
    if (e.target.id === 'nv-name-inp')  { st.name = e.target.value; syncEmailBtn(); }
    if (e.target.id === 'nv-email-inp') { st.email = e.target.value; syncEmailBtn(); }
  });
  document.addEventListener('change', (e) => {
    if (e.target.id === 'nv-consent-chk') { st.consent = e.target.checked; syncUploadBtn(); }
    if (e.target.id === 'nv-file-inp') handleFile(e.target);
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
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-continue-unknown]');
    if (!t) return;
    st.school = t.dataset.continueUnknown;
    const inp = document.getElementById('nv-school-inp'); if (inp) inp.value = st.school;
    const list = document.getElementById('nv-school-list');
    if (list) list.innerHTML = `<div class="nv-list-header">Continuing with</div><div class="nv-school-item sel">${st.school}<span class="nv-chk">${ic('check')}</span></div>`;
    const btn = document.querySelector('#nv-sc .nv-btn-primary'); if (btn) btn.disabled = false;
    renderIcons();
  });

  function syncUploadBtn() { const b = document.getElementById('nv-upload-btn'); if (b) b.disabled = !(st.file && st.consent); }
  function syncEmailBtn() {
    const ok = st.email.includes('@') && st.email.includes('.');
    const b = document.getElementById('nv-email-btn'); if (b) b.disabled = !(st.name && ok);
  }
  function handleFile(input) {
    const f = input.files[0]; if (!f) return;
    const errEl = document.getElementById('nv-file-error');
    const errMsg = document.getElementById('nv-file-err-msg');
    const scenario = detectScenario(f.name);
    const accepted = ['application/pdf', 'image/jpeg', 'image/png'];
    let err = null;

    // Check 1 — wrong format (simulated OR real MIME mismatch)
    if (scenario === 'wrong-format' || !accepted.includes(f.type)) {
      err = `That file format isn't supported. Navigate only accepts PDF, JPG, or PNG transcripts.`;
    } else {
      // Check 2 — file too large (simulated OR real size)
      const simulatedMB = 14.2;
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
    st.file = f.name;
    st.scenario = scenario;
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
      <div class="nv-demo-fab-menu" role="menu">${items}</div>
      <button class="nv-demo-fab-toggle" aria-label="Switch demo school" aria-expanded="false">
        Demo ${ic('chevron-up')}
      </button>`;
    document.body.appendChild(wrap);
    const toggle = wrap.querySelector('.nv-demo-fab-toggle');
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = wrap.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    renderIcons();
  }

  window.NavigateModal = {
    mount(b) { brand = b; ensureMarkup(); applyBrand(); mountDemoSwitcher(); },
    open: openModal,
    close: closeModal,
  };
})();
