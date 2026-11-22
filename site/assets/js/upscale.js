/* Upscale draft (2026-11-21): gentle fade-in for shop text blocks below the fold.
   No product images, nothing on the first screen, off for prefers-reduced-motion. */
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  var sel = '.shop-head .lede, .chips, .ingr .wrap, .routine-copy .lede, .steps, .routine-buy, .about-copy .lede, .about-copy blockquote, .about-copy .voice-big, .about-more, .visit .lede, .visit-row, .visit .where';
  var vh = window.innerHeight;
  var els = Array.prototype.slice.call(document.querySelectorAll(sel)).filter(function (n) { return n.getBoundingClientRect().top > vh * 0.92; });
  if (!els.length) return;
  document.documentElement.classList.add('up-fade');
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('up-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  els.forEach(function (n, i) { n.classList.add('up-f'); io.observe(n); });
})();
