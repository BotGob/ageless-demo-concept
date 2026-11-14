/* Age-Less shop demo - motion polish layer.
   Rules (BRAIN-NOTES.md): transform/opacity only, strong ease-out, short UI durations,
   pointer effects only on fine pointers, everything off for prefers-reduced-motion. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

  /* ---------- Callouts: thin gold leader draws toward the bottle, then the label settles ---------- */
  function buildCallouts() {
    $$('.callout').forEach(function (c) {
      if (c.querySelector('.box')) return;
      var box = document.createElement('span'); box.className = 'box';
      while (c.firstChild) box.appendChild(c.firstChild);
      var lead = document.createElement('span'); lead.className = 'leader';
      c.appendChild(lead); c.appendChild(box);
    });
  }

  /* ---------- Headline mask reveal, line by line ---------- */
  var heads = [];
  function splitLines(el) {
    var text = el.textContent.trim(); if (!text) return;
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split(/\s+/).map(function (w) { return '<span class="w">' + w.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span>'; }).join(' ');
    var lines = [], last = null;
    $$('.w', el).forEach(function (w) { var top = w.offsetTop; if (last === null || Math.abs(top - last) > 4) { lines.push([]); last = top; } lines[lines.length - 1].push(w.textContent); });
    el.innerHTML = lines.map(function (ws, i) { return '<span class="ln" aria-hidden="true"><span class="li" style="--i:' + i + '">' + ws.join(' ') + '</span></span>'; }).join(' ');
  }
  function splitAll() { heads.forEach(splitLines); }
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px' }) : null;

  /* ---------- Hero: cursor glow + pointer parallax (desktop only) ---------- */
  function heroPointer() {
    var sticky = $('.hero-sticky'), glow = $('#cursorGlow'); if (!sticky || !glow) return;
    if (reduce || !fine) { glow.remove(); return; }
    var tx = 0, ty = 0, gx = 0, gy = 0, nx = 0, ny = 0, px = 0, py = 0, raf = null, inside = false;
    var portal = $('#portal'), r1 = $('.ring.r1'), r2 = $('.ring.r2'), calls = $$('.callout');
    function loop() {
      gx += (tx - gx) * 0.14; gy += (ty - gy) * 0.14;   // glow trails the cursor softly
      px += (nx - px) * 0.08; py += (ny - py) * 0.08;   // depth layers ease toward the target
      glow.style.transform = 'translate3d(' + (gx - 300).toFixed(1) + 'px,' + (gy - 300).toFixed(1) + 'px,0)';
      portal.style.translate = (px * 12).toFixed(2) + 'px ' + (py * 10).toFixed(2) + 'px';
      r1.style.translate = (px * -6).toFixed(2) + 'px ' + (py * -6).toFixed(2) + 'px';
      r2.style.translate = (px * -14).toFixed(2) + 'px ' + (py * -12).toFixed(2) + 'px';
      calls.forEach(function (c, i) { var d = i % 2 ? 18 : 22; c.style.translate = (px * d).toFixed(2) + 'px ' + (py * d * 0.8).toFixed(2) + 'px'; });
      if (Math.abs(tx - gx) + Math.abs(ty - gy) + Math.abs(nx - px) + Math.abs(ny - py) > 0.05 || inside) raf = requestAnimationFrame(loop); else raf = null;
    }
    sticky.addEventListener('pointermove', function (e) {
      var r = sticky.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top;
      nx = (e.clientX - r.left) / r.width * 2 - 1; ny = (e.clientY - r.top) / r.height * 2 - 1;
      if (!inside) { inside = true; gx = tx; gy = ty; glow.classList.add('on'); }
      if (!raf) raf = requestAnimationFrame(loop);
    });
    sticky.addEventListener('pointerleave', function () { inside = false; nx = 0; ny = 0; glow.classList.remove('on'); if (!raf) raf = requestAnimationFrame(loop); });
  }

  /* ---------- Magnetic primary buttons (desktop only) ---------- */
  function magnetic() {
    if (reduce || !fine) return;
    document.addEventListener('pointermove', function (e) {
      var b = e.target.closest && e.target.closest('.btn.gold');
      if (!b || b.disabled) return;
      var r = b.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width / 2) / (r.width / 2), y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      b.classList.add('mag'); b.style.translate = (x * 5).toFixed(1) + 'px ' + (y * 4).toFixed(1) + 'px';
    }, { passive: true });
    document.addEventListener('pointerout', function (e) {
      var b = e.target.closest && e.target.closest('.btn.gold');
      if (b && !b.contains(e.relatedTarget)) b.style.translate = '';
    });
  }

  /* ---------- Shop panel: cream sheet widens out of the green as it enters ---------- */
  function shopPanel() {
    var shop = $('#shop'); if (!shop) return;
    function upd() {
      var r = shop.getBoundingClientRect(), vh = window.innerHeight;
      var p = reduce ? 1 : Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.7)));
      shop.style.setProperty('--sh', p.toFixed(3));
    }
    window.addEventListener('scroll', function () { requestAnimationFrame(upd); }, { passive: true });
    window.addEventListener('resize', upd); upd();
  }

  /* ---------- Order confirmation: ring draws, check draws, a few gold glints drift out ---------- */
  function celebrate() {
    var sp = $('#sparks'); if (!sp) return;
    sp.innerHTML = '';
    if (reduce) return;
    for (var i = 0; i < 14; i++) {
      var s = document.createElement('i');
      var a = (i / 14) * 360 + (i % 2 ? 9 : -6);
      s.style.setProperty('--a', a + 'deg');
      s.style.setProperty('--d', (34 + (i * 7) % 22) + 'px');
      s.style.setProperty('--t', (560 + (i * 37) % 260) + 'ms');
      s.style.animationDelay = (520 + (i * 23) % 140) + 'ms';
      sp.appendChild(s);
    }
  }

  function init() {
    buildCallouts();
    heads = $$('h2.display.md');
    if (!reduce) { splitAll(); heads.forEach(function (h) { if (io) io.observe(h); else h.classList.add('in'); }); }
    else heads.forEach(function (h) { h.classList.add('in'); });
    heroPointer(); magnetic(); shopPanel();
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (!reduce) splitAll(); }, 180); });
  }

  window.ALMotion = {
    afterLang: function () { if (!reduce && heads.length) splitAll(); },
    celebrate: celebrate
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
