// Shared image skeleton + lazy-load enhancer for university pages.
// - Wraps every <img> in a shimmer skeleton until it loads (or errors)
// - Adds loading="lazy" + decoding="async" to images outside the hero/header
(function () {
  var STYLE_ID = 'nv-skel-style';
  if (!document.getElementById(STYLE_ID)) {
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = [
      '@keyframes nv-skel-pulse{0%{background-position:-300px 0}100%{background-position:calc(300px + 100%) 0}}',
      '.nv-skel-wrap{position:relative;display:inline-block;overflow:hidden;vertical-align:top}',
      '.nv-skel-wrap.block{display:block}',
      '.nv-skel-wrap::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,255,255,.06) 0%,rgba(255,255,255,.16) 50%,rgba(255,255,255,.06) 100%),#2a2a2a;background-size:300px 100%;animation:nv-skel-pulse 1.2s linear infinite;z-index:0;pointer-events:none}',
      '.nv-skel-wrap.light::before{background:linear-gradient(90deg,#eef0f3 0%,#f7f8fa 50%,#eef0f3 100%);background-size:300px 100%;animation:nv-skel-pulse 1.2s linear infinite}',
      '.nv-skel-wrap.is-loaded::before{display:none}',
      '.nv-skel-wrap > img{position:relative;z-index:1;opacity:0;transition:opacity .35s ease}',
      '.nv-skel-wrap.is-loaded > img{opacity:1}',
      '@media (prefers-reduced-motion: reduce){.nv-skel-wrap::before{animation:none}}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function wrap(img) {
    if (!img || img.__nvWrapped) return;
    img.__nvWrapped = true;
    var parent = img.parentNode;
    if (!parent) return;
    var w = document.createElement('span');
    w.className = 'nv-skel-wrap';
    // Inherit block-level rendering when image is set to fill its container
    var cs = img.currentStyle || window.getComputedStyle(img);
    if (cs.position === 'absolute' || cs.display === 'block' || img.style.width === '100%') {
      w.classList.add('block');
    }
    // Pick light skeleton for images on light backgrounds (logos in light header)
    var bg = window.getComputedStyle(parent).backgroundColor || '';
    if (/rgb\(2[3-9]\d|rgb\(25\d/.test(bg) || /255,\s*255,\s*255/.test(bg)) w.classList.add('light');
    // Make the wrapper match the original image's layout
    if (cs.position === 'absolute') {
      w.style.cssText += 'position:absolute;inset:0;display:block';
    } else {
      w.style.width = img.getAttribute('width') ? img.getAttribute('width') + 'px' : (img.style.width || 'auto');
      w.style.height = img.getAttribute('height') ? img.getAttribute('height') + 'px' : (img.style.height || 'auto');
    }
    parent.insertBefore(w, img);
    w.appendChild(img);
    function done() { w.classList.add('is-loaded'); }
    if (img.complete && img.naturalWidth > 0) { done(); return; }
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  }

  function enhanceAll() {
    var imgs = document.querySelectorAll('img');
    imgs.forEach(function (img, i) {
      // Lazy-load images that are NOT in the hero/header (rough heuristic: not within first 600px)
      var rect = img.getBoundingClientRect();
      var inViewport = rect.top < (window.innerHeight || 800);
      if (!inViewport && !img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
      wrap(img);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceAll);
  } else {
    enhanceAll();
  }
})();
