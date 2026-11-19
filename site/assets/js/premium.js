/* Age-Less premium motion layer (v2, 2026-11-19). Shared by the clinic site and the shop.
   Performance rules: IntersectionObserver for reveals (no scroll handlers), parallax writes a
   composited transform only and never reads layout during scroll (geometry is cached and only
   re-measured on resize / load), hover effects pause while the page is scrolling, ambient photo
   drift pauses off-screen. Everything here is off for prefers-reduced-motion.
   Smooth wheel scrolling (Lenis 1.3.27, MIT, vendored) runs only on desktop mouse wheels:
   trackpads, touch screens, low-power devices and ?smooth=off keep native scrolling.
   Shop: product images have no entrance effects at all (Vito, 2026-11-19). */
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

  /* ---------- First-visit intro: CSS draws it, any input skips it ---------- */
  function endIntro() { html.classList.remove('pm-intro'); }
  if (html.classList.contains('pm-intro')) {
    ['keydown', 'pointerdown', 'wheel', 'touchstart'].forEach(function (ev) { window.addEventListener(ev, endIntro, { once: true, passive: true }); });
    setTimeout(endIntro, 900);
  }

  if (reduce) { html.classList.add('pm-reduce'); return; }
  html.classList.add('pm');

  var vh = window.innerHeight;
  var hasIO = 'IntersectionObserver' in window;
  function belowFold(el) { return el.getBoundingClientRect().top > vh * 0.9; } // init only, never during scroll

  /* ---------- Clinic reveals (IntersectionObserver only) ---------- */
  if (CLINIC && hasIO) {
    // main.js already reveals [data-reveal]; add a gentle stagger and a longer ease while it runs.
    var rv = $$('[data-reveal]').filter(function (n) { return !n.classList.contains('is-in') && belowFold(n); });
    var groups = new Map();
    rv.forEach(function (n) { var p = n.parentElement; if (!groups.has(p)) groups.set(p, []); groups.get(p).push(n); });
    groups.forEach(function (list) { if (list.length > 1) list.forEach(function (n, i) { n.style.setProperty('--pm-d', Math.min(i, 4) * 90 + 'ms'); }); });
    rv.forEach(function (n) { n.classList.add('pm-reveal'); });
    var rvIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target; rvIO.unobserve(t);
        var extra = parseFloat(t.style.getPropertyValue('--pm-d')) || 0;
        setTimeout(function () { t.classList.remove('pm-reveal'); t.style.removeProperty('--pm-d'); }, 1500 + extra);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.14 });
    rv.forEach(function (n) { rvIO.observe(n); });

    // Photos below the fold settle from a slight zoom (transform only, composited).
    var imgIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var img = e.target; imgIO.unobserve(img);
        img.classList.add('pm-in');
        setTimeout(function () { img.classList.remove('pm-img', 'pm-in'); }, 1500);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    $$('main section:not(.c-hero):not(.p-hero) img, .pm-band img').forEach(function (img) {
      if (img.closest('.marquee, .modal')) return;
      var w = img.getAttribute('width'); if (w && +w < 160) return;
      if (!belowFold(img)) return;
      img.classList.add('pm-img'); imgIO.observe(img);
    });
  }

  /* ---------- Ambient drift on hero photos pauses when off-screen ---------- */
  if (hasIO) {
    var driftIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('pm-still', !e.isIntersecting); });
    });
    $$('.c-hero-media, .p-hero-media, .hv-photo, .wave').forEach(function (el) { driftIO.observe(el); });
  }

  /* ---------- Shop: bag polish (no product image entrances) ---------- */
  if (!CLINIC && window.MutationObserver) {
    var bag = $('#bagBtn');
    if (bag) {
      var tick = d.createElement('span'); tick.className = 'pm-tick'; tick.setAttribute('aria-hidden', 'true'); bag.appendChild(tick);
      new MutationObserver(function () {
        if (!bag.classList.contains('bump')) return;
        tick.classList.remove('go'); void tick.offsetWidth; tick.classList.add('go');
      }).observe(bag, { attributes: true, attributeFilter: ['class'] });
    }
  }

  /* ---------- Pause hover effects while the page is moving ---------- */
  // Cards sliding under a still cursor would otherwise start lift/shadow transitions mid-scroll.
  var scrollIdle = null;
  function markScrolling() {
    if (!scrollIdle) html.classList.add('pm-scrolling');
    clearTimeout(scrollIdle);
    scrollIdle = setTimeout(function () { scrollIdle = null; html.classList.remove('pm-scrolling'); }, 140);
  }
  if (fine) window.addEventListener('scroll', markScrolling, { passive: true });

  /* ---------- Desktop parallax: cached geometry, transform-only writes ---------- */
  // Where the browser supports scroll-driven animations (Chrome/Edge 115+, Safari 26+), the CSS
  // file does the parallax on the compositor, perfectly in step with the scroll, and no JS runs.
  var cssPar = !!(window.CSS && CSS.supports && CSS.supports('animation-timeline: view()') && q.get('par') !== 'js');
  if (cssPar) html.classList.add('pm-sda');
  var wideMQ = window.matchMedia('(min-width: 901px)');
  var par = [];
  if (fine && !cssPar) {
    var parSel = CLINIC
      ? [['.c-hero-media picture', 24, 1.08], ['.p-hero-media picture', 20, 1.08], ['.pm-band picture', 64, 1]]
      : [['.hv-b .hv-photo picture', 40, 1.07]];
    parSel.forEach(function (p) { $$(p[0]).forEach(function (el) { el.classList.add('pm-par'); par.push({ el: el, amp: p[1], sc: p[2], top: 0, h: 0, last: null }); }); });
  }
  var parOn = false, parRaf = null, scrollPos = window.scrollY;
  function measure() {
    vh = window.innerHeight;
    parOn = wideMQ.matches && par.length > 0;
    html.classList.toggle('pm-par-on', parOn);
    var y = window.scrollY;
    par.forEach(function (o) {
      if (!parOn) { o.el.style.transform = ''; o.last = null; return; }
      var r = o.el.parentElement.getBoundingClientRect();
      o.top = r.top + y; o.h = r.height;
    });
    scrollPos = y; parFrame();
  }
  function parFrame() {
    parRaf = null; if (!parOn) return;
    var y = scrollPos;
    for (var i = 0; i < par.length; i++) {
      var o = par[i], top = o.top - y;
      if (top > vh + 80 || top + o.h < -80) continue;          // off-screen: no write at all
      var p = (top + o.h / 2 - vh / 2) / (vh / 2 + o.h / 2);
      p = p < -1 ? -1 : p > 1 ? 1 : p;
      var v = Math.round(p * o.amp * 10) / 10;
      if (v === o.last) continue;
      o.last = v;
      o.el.style.transform = 'translate3d(0,' + v + 'px,0) scale(' + o.sc + ')';
    }
  }
  function onScrollPos(y) { scrollPos = y; if (!parRaf) parRaf = requestAnimationFrame(parFrame); }
  if (par.length) {
    window.addEventListener('scroll', function () { onScrollPos(window.scrollY); }, { passive: true });
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(measure, 120); });
    window.addEventListener('load', measure);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(measure);
    if ('ResizeObserver' in window) { var ro = new ResizeObserver(function () { clearTimeout(rt); rt = setTimeout(measure, 120); }); ro.observe(body); }
    measure();
  }

  /* ---------- Smooth wheel scrolling (Lenis), desktop mouse wheels only ---------- */
  var lenis = null;
  var LOCK = /\b(is-overlay|is-booking|is-modal|locked)\b/;
  function isLocked() { return LOCK.test(body.className) || body.style.overflow === 'hidden' || !!$('.site-header.nav-open'); }
  var PREVENT = '.modal, .cart, .drawer, .checkout, .nav, .subnav, .co-summary, .lines, .drawer-body, [data-lenis-prevent]';
  // Trackpads already glide natively; smoothing them again feels laggy. Chrome/Safari report a
  // trackpad gesture as wheelDeltaY === -3 * deltaY; mouse wheels report steps of 120.
  var padUntil = 0;
  function isTrackpad(e) {
    if (e.deltaMode !== 0) return false;                       // line/page steps = classic mouse wheel
    if (typeof e.wheelDeltaY === 'number' && e.wheelDeltaY !== 0) return e.wheelDeltaY === -3 * e.deltaY;
    if (e.deltaX && Math.abs(e.deltaX) > 0.5) return true;      // two-axis gesture
    return Math.abs(e.deltaY) < 40;                             // small pixel deltas (Firefox trackpads)
  }
  function lowPower() {
    var n = navigator, c = n.connection || {};
    return (n.hardwareConcurrency && n.hardwareConcurrency < 4) || (n.deviceMemory && n.deviceMemory < 4) || c.saveData === true;
  }
  function startLenis() {
    if (!window.Lenis || lenis) return;
    lenis = new window.Lenis({
      lerp: 0.14, smoothWheel: true, wheelMultiplier: 1, autoRaf: true, syncTouch: false,
      prevent: function (n) { return !!(n && n.matches && n.matches(PREVENT)); },
      virtualScroll: function (data) {
        var e = data.event;
        if (!e || e.type !== 'wheel') return true;
        var now = performance.now();
        if (now < padUntil || isTrackpad(e)) {
          if (now >= padUntil && lenis && lenis.isScrolling === 'smooth') { lenis.stop(); lenis.start(); } // hand over cleanly
          padUntil = now + 900;                                // momentum events keep coming for a while
          return false;                                        // native scroll, untouched
        }
        return true;
      }
    });
    window.ALLenis = lenis;
    // Keep JS parallax (fallback browsers) in the same frame as Lenis' scroll write.
    if (par.length) lenis.on('scroll', function (l) { scrollPos = l.scroll; if (parRaf) { cancelAnimationFrame(parRaf); parRaf = null; } parFrame(); });
    if (isLocked()) lenis.stop();
    var sync = function () { if (isLocked()) lenis.stop(); else lenis.start(); };
    new MutationObserver(sync).observe(body, { attributes: true, attributeFilter: ['class', 'style'] });
    var hdr = $('.site-header'); if (hdr) new MutationObserver(sync).observe(hdr, { attributes: true, attributeFilter: ['class'] });
  }
  // Same-page anchors glide with Lenis. Runs after the site's own handlers (window, bubble).
  window.addEventListener('click', function (e) {
    if (!lenis || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href*="#"]'); if (!a) return;
    if (a.hasAttribute('data-open-booking') || a.hasAttribute('data-open-quiz')) return;
    var u = new URL(a.href, location.href);
    if (u.pathname !== location.pathname || u.search !== location.search || !u.hash || u.hash === '#') return;
    var t; try { t = d.getElementById(decodeURIComponent(u.hash.slice(1))); } catch (err) { t = null; }
    if (!t || t.closest('.modal, [hidden]')) return;
    e.preventDefault();
    lenis.scrollTo(t, { duration: 1.1 });                      // Lenis honours scroll-margin / scroll-padding
    try { history.pushState(null, '', u.hash); } catch (err) {}
  });
  var touchFirst = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && !fine;
  if (fine && !touchFirst && !lowPower() && q.get('smooth') !== 'off' && !/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
    var s = d.createElement('script');
    s.src = base + 'vendor/lenis.min.js?v=1.3.27'; s.async = true; s.onload = startLenis;
    d.head.appendChild(s);
  }
})();
