/* Age-Less premium motion layer (2026-11-18). Shared by the clinic site and the shop.
   - Desktop only: gentle inertial scroll (Lenis 1.3.27, MIT, vendored) and photo parallax.
   - Everywhere: staggered reveals, photo wipe-in, image fade-in, bag/drawer polish, first-visit intro.
   - Everything here is off for prefers-reduced-motion. Transform/opacity/clip only, no layout shift.
   - ?smooth=off disables the inertial scroll for comparison. */
(function () {
  'use strict';
  var d = document, html = d.documentElement, body = d.body;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var q = new URLSearchParams(location.search);
  var CLINIC = body.classList.contains('clinic');
  var src = (d.currentScript && d.currentScript.src) || '';
  var base = src.replace(/premium\.js.*$/, '');
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var $ = function (s, r) { return (r || d).querySelector(s); };

  /* ---------- First-visit intro: CSS draws it, we just let any input skip it ---------- */
  function endIntro() { html.classList.remove('pm-intro'); }
  if (html.classList.contains('pm-intro')) {
    ['keydown', 'pointerdown', 'wheel', 'touchstart'].forEach(function (ev) { window.addEventListener(ev, endIntro, { once: true, passive: true }); });
    setTimeout(endIntro, 900);
  }

  if (reduce) { html.classList.add('pm-reduce'); return; }
  html.classList.add('pm');

  var vh = window.innerHeight;
  function belowFold(el) { var r = el.getBoundingClientRect(); return r.top > vh * 0.9; }
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- Reveals ---------- */
  var io = hasIO ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var t = e.target; io.unobserve(t);
      t.classList.add('pm-in');
      var hold = 1700 + (parseFloat(t.style.getPropertyValue('--pm-d')) || 0);
      setTimeout(function () { t.classList.remove('pm-img', 'pm-rv'); t.classList.remove('pm-in'); t.style.removeProperty('--pm-d'); }, hold);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }) : null;

  function stagger(nodes) {
    var groups = new Map();
    nodes.forEach(function (n) { var p = n.parentElement; if (!groups.has(p)) groups.set(p, []); groups.get(p).push(n); });
    groups.forEach(function (list) { if (list.length < 2) return; list.forEach(function (n, i) { n.style.setProperty('--pm-d', Math.min(i, 4) * 90 + 'ms'); }); });
  }

  // Clinic: main.js already reveals [data-reveal]; we add a stagger and a softer, longer ease while it runs.
  if (CLINIC) {
    var rv = $$('[data-reveal]').filter(function (n) { return !n.classList.contains('is-in') && belowFold(n); });
    stagger(rv);
    rv.forEach(function (n) { n.classList.add('pm-reveal'); });
    if (window.MutationObserver) {
      var mo = new MutationObserver(function (ms) {
        ms.forEach(function (m) {
          var t = m.target;
          if (t.classList.contains('pm-reveal') && t.classList.contains('is-in') && !t.__pmDone) {
            t.__pmDone = true;
            setTimeout(function () { t.classList.remove('pm-reveal'); t.style.removeProperty('--pm-d'); }, 1600 + (parseFloat(t.style.getPropertyValue('--pm-d')) || 0));
          }
        });
      });
      rv.forEach(function (n) { mo.observe(n, { attributes: true, attributeFilter: ['class'] }); });
    }
  } else if (io) {
    // Shop: soft rise for the static sections below the product grid.
    var shopRv = $$('.shop-head > *, .ingr .wrap > *, .routine-copy > *, .about-photo, .about-copy > *, .visit-wrap > *, .foot-grid > *')
      .filter(function (n) { return belowFold(n) && !n.closest('[hidden]'); });
    stagger(shopRv);
    shopRv.forEach(function (n) { n.classList.add('pm-rv'); io.observe(n); });
  }

  // Photos below the fold wipe up into place (a slow settle of scale + clip).
  if (io) {
    var imgSel = CLINIC
      ? 'main section:not(.c-hero):not(.p-hero) img, .pm-band img'
      : '.about-photo img';
    $$(imgSel).forEach(function (img) {
      if (img.closest('.marquee, .quiz-modal, .modal')) return;
      var w = img.getAttribute('width');
      if (w && +w < 160) return;
      if (!belowFold(img)) return;
      img.classList.add('pm-img'); io.observe(img);
    });
  }

  /* ---------- Shop: images fade in where they load, instead of popping ---------- */
  function prepImg(img) {
    if (img.__pm || (img.complete && img.naturalWidth)) return;
    img.__pm = true; img.classList.add('pm-fade');
    var done = function () { img.classList.add('pm-loaded'); setTimeout(function () { img.classList.remove('pm-fade', 'pm-loaded'); }, 900); };
    img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true });
  }
  if (!CLINIC) {
    ['#grid', '#drawer', '#cart', '.ingr', '.routine'].forEach(function (s) {
      var root = $(s); if (!root) return;
      $$('img', root).forEach(prepImg);
      if (window.MutationObserver) new MutationObserver(function (ms) {
        ms.forEach(function (m) { Array.prototype.forEach.call(m.addedNodes, function (n) { if (n.nodeType !== 1) return; if (n.tagName === 'IMG') prepImg(n); else $$('img', n).forEach(prepImg); }); });
      }).observe(root, { childList: true, subtree: true });
    });
  }

  /* ---------- Shop: bag and drawer polish ---------- */
  if (!CLINIC && window.MutationObserver) {
    var bag = $('#bagBtn');
    if (bag) {
      var tick = d.createElement('span'); tick.className = 'pm-tick'; tick.setAttribute('aria-hidden', 'true'); bag.appendChild(tick);
      new MutationObserver(function () {
        if (!bag.classList.contains('bump')) return;
        tick.classList.remove('go'); void tick.offsetWidth; tick.classList.add('go');
      }).observe(bag, { attributes: true, attributeFilter: ['class'] });
    }
    ['#cart', '#drawer'].forEach(function (s) {
      var el = $(s); if (!el) return; var was = false, t;
      new MutationObserver(function () {
        var on = el.classList.contains('on');
        if (on && !was) { el.classList.add('pm-open'); clearTimeout(t); t = setTimeout(function () { el.classList.remove('pm-open'); }, 1100); }
        was = on;
      }).observe(el, { attributes: true, attributeFilter: ['class'] });
    });
    // Product drawer content is replaced when another product opens; replay the settle.
    var dBody = $('.drawer-body');
    if (dBody) new MutationObserver(function () {
      var dr = $('#drawer'); if (!dr || !dr.classList.contains('on')) return;
      dr.classList.remove('pm-open'); void dr.offsetWidth; dr.classList.add('pm-open');
      setTimeout(function () { dr.classList.remove('pm-open'); }, 1100);
    }).observe(dBody, { childList: true });
  }

  /* ---------- Desktop parallax on large photos ---------- */
  var wideMQ = window.matchMedia('(min-width: 901px)');
  var par = [];
  if (fine) {
    var parSel = CLINIC
      ? [['.c-hero-media picture', 26], ['.p-hero-media picture', 22], ['.pm-band picture', 70]]
      : [['.hv-b .hv-photo picture', 46], ['.about-photo img', 14]];
    parSel.forEach(function (p) { $$(p[0]).forEach(function (el) { el.classList.add('pm-par'); par.push({ el: el, amp: p[1] }); }); });
  }
  var parRaf = null;
  function parTick() {
    parRaf = null;
    var on = wideMQ.matches;
    html.classList.toggle('pm-par-on', on && par.length > 0);
    par.forEach(function (o) {
      if (!on) { o.el.style.translate = ''; return; }
      var host = o.el.parentElement, r = host.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh + 50) return;
      var p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // -1 (leaving top) .. 1 (entering bottom)
      p = Math.max(-1, Math.min(1, p));
      o.el.style.translate = '0 ' + (p * o.amp).toFixed(1) + 'px';
    });
  }
  function parQueue() { if (!parRaf) parRaf = requestAnimationFrame(parTick); }
  if (par.length) {
    window.addEventListener('scroll', parQueue, { passive: true });
    window.addEventListener('resize', function () { vh = window.innerHeight; parQueue(); });
    parTick();
  }

  /* ---------- Desktop inertial scroll (Lenis) ---------- */
  var lenis = null;
  var LOCK = /\b(is-overlay|is-booking|is-modal|locked)\b/;
  function isLocked() {
    return LOCK.test(body.className) || body.style.overflow === 'hidden' || !!$('.site-header.nav-open');
  }
  var PREVENT = '.modal, .cart, .drawer, .checkout, .nav, .subnav, .co-summary, .lines, .drawer-body, [data-lenis-prevent]';
  function startLenis() {
    if (!window.Lenis || lenis) return;
    lenis = new window.Lenis({
      lerp: 0.11, smoothWheel: true, wheelMultiplier: 0.95, autoRaf: true,
      prevent: function (n) { return !!(n && n.matches && n.matches(PREVENT)); }
    });
    window.ALLenis = lenis;
    if (isLocked()) lenis.stop();
    new MutationObserver(function () { if (isLocked()) lenis.stop(); else lenis.start(); })
      .observe(body, { attributes: true, attributeFilter: ['class', 'style'] });
    var hdr = $('.site-header, .clinic .site-header');
    if (hdr) new MutationObserver(function () { if (isLocked()) lenis.stop(); else lenis.start(); }).observe(hdr, { attributes: true, attributeFilter: ['class'] });
    lenis.on('scroll', parQueue);
  }
  // Same-page anchors glide with Lenis. Runs after the site's own handlers (window, bubble), so modal and quiz links are untouched.
  window.addEventListener('click', function (e) {
    if (!lenis || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href*="#"]'); if (!a) return;
    if (a.hasAttribute('data-open-booking') || a.hasAttribute('data-open-quiz')) return;
    var u = new URL(a.href, location.href);
    if (u.pathname !== location.pathname || u.search !== location.search || !u.hash || u.hash === '#') return;
    var t; try { t = d.getElementById(decodeURIComponent(u.hash.slice(1))); } catch (err) { t = null; }
    if (!t || t.closest('.modal, [hidden]')) return;
    e.preventDefault();
    // Lenis 1.3 already honours the page's scroll-margin / scroll-padding, so no extra offset here.
    lenis.scrollTo(t, { duration: 1.15 });
    try { history.pushState(null, '', u.hash); } catch (err) {}
  });
  if (fine && q.get('smooth') !== 'off' && !/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
    var s = d.createElement('script');
    s.src = base + 'vendor/lenis.min.js?v=1.3.27'; s.async = true; s.onload = startLenis;
    d.head.appendChild(s);
  }
})();
