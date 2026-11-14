/* Age-Less Medicine shop demo - interactions.
   Runs locally. The only network calls are optional ones in shopify.js (Storefront API, test store),
   made only when a Storefront token is set there. No real payments either way.

   SHOPIFY: assets/js/shopify.js maps products by handle and, when its Storefront token is set,
   openCheckout() creates a Shopify cart and redirects to cart.checkoutUrl. The local `cart`
   array stays the source of truth until checkout; a full build could sync it with
   cartLinesAdd / cartLinesUpdate as the shopper goes. */
(function () {
  'use strict';
  var P = window.AL_PRODUCTS, PIECES = window.AL_PIECES, EYE = window.AL_EYE_CHART, T = window.AL_I18N;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var byId = {}; P.forEach(function (p) { byId[p.id] = p; });

  var FREE_SHIP = 75, SHIP = 8, TAX = 0.075; // sample values (Tampa / Hillsborough 7.5% estimate)
  var lang = 'en';
  try { lang = localStorage.getItem('al-lang') || 'en'; } catch (e) {}
  var params = new URLSearchParams(location.search);
  // Default look is "mixed" (green hero, cream shop). ?theme=dark and ?theme=light still work.
  var theme = params.get('theme');
  if (theme === 'dark') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'mixed');
  if (params.get('lang') === 'es' || params.get('lang') === 'en') lang = params.get('lang');

  var cart = [];
  try { cart = JSON.parse(sessionStorage.getItem('al-cart') || '[]').filter(function (l) { return byId[l.id]; }); } catch (e) { cart = []; }
  var concern = 'all';

  function t(k) { return (T[lang] && T[lang][k] != null) ? T[lang][k] : (T.en[k] || ''); }
  function L(o) { return o ? (o[lang] || o.en) : ''; }
  function money(n) {
    return new Intl.NumberFormat(lang === 'es' ? 'es-US' : 'en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }).format(n);
  }
  function money2(n) { return new Intl.NumberFormat(lang === 'es' ? 'es-US' : 'en-US', { style: 'currency', currency: 'USD' }).format(n); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }


  /* ---------- i18n ---------- */
  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(function (el) { var v = t(el.getAttribute('data-i18n')); if (v) el.textContent = v; });
    $$('[data-i18n-alt]').forEach(function (el) { var v = t(el.getAttribute('data-i18n-alt')); if (v) el.setAttribute('alt', v); });
    $$('[data-price]').forEach(function (el) { el.textContent = money(+el.getAttribute('data-price')); });
    $$('[data-main-site]').forEach(function (a) { a.setAttribute('aria-label', t('back_main')); a.setAttribute('href', '../index.html?lang=' + lang); });
    $$('.voice-btn').forEach(function (b) { b.setAttribute('aria-label', t('hear')); });
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
    document.title = lang === 'es' ? 'Age-Less Medicine | Cuidado de la piel por la Dra. Linda McClintock' : 'Age-Less Medicine | Skin care by Dr. Linda McClintock';
    renderGrid(false); renderCart();
    if (openDrawerId) fillDrawer(openDrawerId);
    if (!$('#checkout').hidden) renderSummary();
    try { localStorage.setItem('al-lang', lang); } catch (e) {}
    if (window.ALMotion) window.ALMotion.afterLang();
  }
  // EN/ES crossfade: text fades out (140ms), swaps, fades back in
  var langBusy = false;
  $$('[data-lang]').forEach(function (b) { b.addEventListener('click', function () {
    var next = b.getAttribute('data-lang'); if (next === lang || langBusy) return;
    lang = next;
    if (reduce) { applyLang(); return; }
    langBusy = true; document.documentElement.classList.add('lx-out');
    setTimeout(function () { applyLang(); requestAnimationFrame(function () { document.documentElement.classList.remove('lx-out'); langBusy = false; }); }, 150);
  }); });

  /* ---------- Intro + hero ---------- */
  // Layout: "clean" (default) has no intro curtain and no pinned hero. ?layout=full brings back the original.
  var FULL = document.documentElement.getAttribute('data-layout') === 'full';
  var intro = $('#intro');
  function ready() { document.body.classList.add('ready'); if (FULL) heroIn(); }
  if (!FULL || reduce || sessionStorage.getItem('al-intro')) { intro.classList.add('gone'); setTimeout(ready, 0); }
  else {
    setTimeout(function () { intro.classList.add('lift'); ready(); }, 1150);
    setTimeout(function () { intro.classList.add('gone'); }, 1950);
    try { sessionStorage.setItem('al-intro', '1'); } catch (e) {}
  }
  var HV = document.documentElement.getAttribute('data-hero');
  var hero = FULL ? $('#hero') : (HV && $('#hero' + HV.toUpperCase())) || $('#heroClean'), sticky = $('.hero-sticky'), portal = $('#portal');
  function heroIn() {
    if (reduce) { sticky.style.setProperty('--in', 1); return; }
    var start = null, dur = 1400;
    function step(ts) { if (!start) start = ts; var x = Math.min(1, (ts - start) / dur); var e = 1 - Math.pow(1 - x, 4); sticky.style.setProperty('--in', e.toFixed(4)); if (x < 1) requestAnimationFrame(step); }
    setTimeout(function () { requestAnimationFrame(step); }, 250);
  }
  var callouts = $$('.callout'), revealLine = $('.reveal-line'), header = $('#top'), flag = $('.demo-flag');
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      if (FULL) {
        var r = hero.getBoundingClientRect(), span = hero.offsetHeight - window.innerHeight;
        var p = Math.min(1, Math.max(0, -r.top / Math.max(1, span)));
        if (!reduce) sticky.style.setProperty('--p', p.toFixed(4));
        callouts.forEach(function (c, i) { c.classList.toggle('on', reduce || p > 0.12 + i * 0.1); });
        revealLine.classList.toggle('on', reduce || p > 0.58);
      }
      header.classList.toggle('solid', window.scrollY > 40);
      // Mixed theme: header and demo flag stay green while over the hero, cream after
      var overHero = hero.getBoundingClientRect().bottom > header.getBoundingClientRect().bottom;
      header.classList.toggle('on-dark', overHero); flag.classList.toggle('on-dark', overHero && FULL);
      routineProgress();
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ---------- Routine steps ---------- */
  var steps = $$('.step'), shelfImgs = $$('#shelf img'), stepsEl = $('#steps'), routine = $('#routine');
  function routineProgress() {
    var r = routine.getBoundingClientRect(), vh = window.innerHeight;
    var p = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / (r.height * 0.6)));
    var n = reduce ? 3 : Math.min(3, Math.floor(p * 3.2 + (p > 0.02 ? 1 : 0)));
    steps.forEach(function (s, i) { s.classList.toggle('on', i < n); });
    shelfImgs.forEach(function (im) { im.classList.toggle('on', +im.getAttribute('data-g') < n); });
    stepsEl.style.setProperty('--sp', n <= 1 ? 0 : (n - 1) / 2);
  }

  /* ---------- Product grid with concern filter ---------- */
  var grid = $('#grid'), picks = $('#picks');
  function mediaHTML(p, cls) {
    if (p.bundle) return '<div class="cluster">' + p.bundle.map(function (k) { return '<img src="' + PIECES[k].img + '" alt="" loading="lazy">'; }).join('') + '</div>';
    return '<img src="' + p.img + '" alt="' + esc(L(p.name)) + '" loading="lazy">';
  }
  function cardHTML(p, isLead, dim) {
    var price = '<span class="price"><span>' + money(p.price) + '</span>' + (p.compareAt ? '<s>' + money(p.compareAt) + '</s>' : '') + '</span>';
    return '<article class="card' + (isLead ? ' lead' : '') + (dim ? ' dim' : '') + '" data-id="' + p.id + '">' +
      '<button class="media" type="button" data-open="' + p.id + '" aria-label="' + esc(t('details') + ': ' + L(p.name)) + '">' +
      '<span class="badge">' + esc(L(p.badge)) + '</span>' + mediaHTML(p) + '</button>' +
      '<div class="info"><span class="tag-lead">' + (lang === 'es' ? 'Empieza aquí' : 'Start here') + '</span>' +
      '<h3>' + esc(L(p.name)) + (p.supplement ? '*' : '') + '</h3><p>' + esc(L(p.short)) + '</p>' +
      '<div class="price-row">' + price + '<span class="sample">' + esc(t('sample')) + '</span></div>' +
      '<div class="card-actions"><button class="btn gold" type="button" data-add="' + p.id + '">' + esc(t('add')) + '</button>' +
      '<button class="btn ghost" type="button" data-open="' + p.id + '">' + esc(t('details')) + '</button></div></div></article>';
  }
  function renderGrid(animate) {
    var match = concern === 'all' ? P.slice() : P.filter(function (p) { return p.concerns.indexOf(concern) > -1; });
    var rest = concern === 'all' ? [] : P.filter(function (p) { return match.indexOf(p) < 0; });
    var html = match.map(function (p, i) { return cardHTML(p, concern !== 'all' && i === 0, false); }).join('');
    if (rest.length) html += '<p class="also">' + esc(t('also')) + '</p>' + rest.map(function (p) { return cardHTML(p, false, true); }).join('');
    // FLIP: remember where each card was, re-render, then glide each card from old spot to new
    var first = {};
    if (animate && !reduce) $$('.card', grid).forEach(function (c) { first[c.getAttribute('data-id')] = c.getBoundingClientRect(); });
    grid.innerHTML = html;
    if (animate && !reduce) {
      $$('.card', grid).forEach(function (c, i) {
        var f = first[c.getAttribute('data-id')], l = c.getBoundingClientRect();
        if (!f) return;
        var dx = f.left - l.left, dy = f.top - l.top;
        var resized = Math.abs(f.width - l.width) > 8 || Math.abs(f.height - l.height) > 8;
        var kf = resized
          ? [{ transform: 'translate(' + dx * 0.25 + 'px,' + dy * 0.25 + 'px) scale(0.97)', opacity: 0.35 }, { transform: 'none', opacity: c.classList.contains('dim') ? 0.5 : 1 }]
          : [{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }];
        c.animate(kf, { duration: resized ? 520 : 560, delay: Math.min(i, 6) * 18, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'backwards' });
      });
      var al = $('.also', grid); if (al) al.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 160, fill: 'backwards' });
    }
    var chipLabel = $('.chip[data-c="' + concern + '"]');
    picks.textContent = concern === 'all' ? t('picks_all') : t(match.length === 1 ? 'picks_1' : 'picks_n').replace('{n}', match.length).replace('{c}', chipLabel ? chipLabel.textContent.toLowerCase() : '');
  }
  $('#chips').addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    concern = b.getAttribute('data-c');
    $$('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === b)); });
    renderGrid(true);
  });

  /* ---------- Overlays: drawer, cart, checkout ---------- */
  var scrim = $('#scrim'), drawer = $('#drawer'), cartEl = $('#cart'), co = $('#checkout');
  var stack = [], lastFocus = [];
  function show(el) {
    lastFocus.push(document.activeElement);
    el.hidden = false; if (el !== co) { scrim.hidden = false; }
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('on'); if (el !== co) scrim.classList.add('on'); }); });
    stack.push(el); document.body.classList.add('locked');
    setTimeout(function () { var f = el.querySelector('.x, button, input'); if (f) f.focus({ preventScroll: true }); }, 60);
  }
  function hide(el) {
    if (!el || el.hidden) return;
    el.classList.remove('on');
    stack = stack.filter(function (s) { return s !== el; });
    if (!stack.some(function (s) { return s !== co; })) scrim.classList.remove('on');
    setTimeout(function () {
      el.hidden = true;
      if (!stack.some(function (s) { return s !== co; })) scrim.hidden = true;
      if (!stack.length) document.body.classList.remove('locked');
    }, 470);
    var f = lastFocus.pop(); if (f && f.focus) f.focus({ preventScroll: true });
    if (el === drawer) openDrawerId = null;
  }
  scrim.addEventListener('click', function () { var top = stack[stack.length - 1]; if (top && top !== co) hide(top); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && stack.length) { hide(stack[stack.length - 1]); return; }
    if (e.key === 'Tab' && stack.length) { // simple focus trap
      var top = stack[stack.length - 1];
      var f = $$('button:not([disabled]), a[href], input:not([type=hidden]), [tabindex="0"]', top).filter(function (n) { return n.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  document.addEventListener('click', function (e) {
    var c = e.target.closest('[data-close]'); if (c) { hide(c.closest('.drawer, .cart, .checkout')); return; }
    var o = e.target.closest('[data-open]'); if (o) { openDrawer(o.getAttribute('data-open')); return; }
    var a = e.target.closest('[data-add]'); if (a) { addToBag(a.getAttribute('data-add'), +(a.getAttribute('data-qty') || 1), a); return; }
    if (e.target.closest('[data-voice]')) { voice(); return; }
    if (e.target.closest('[data-goto-shop]')) { hide(cartEl); location.hash = '#shop'; }
  });

  /* Product drawer */
  var openDrawerId = null, drawerQty = 1;
  function openDrawer(id) { openDrawerId = id; drawerQty = 1; fillDrawer(id); if (drawer.hidden) show(drawer); $('.drawer-body').scrollTop = 0; }
  function fillDrawer(id) {
    var p = byId[id], h = '';
    h += '<div class="d-media">' + (p.bundle ? '<div class="cluster">' + p.bundle.map(function (k) { return '<img src="' + PIECES[k].img + '" alt="">'; }).join('') + '</div>' : '<img src="' + p.img + '" alt="' + esc(L(p.name)) + '">') + '</div>';
    h += '<div class="d-info"><span class="tag-lead" style="display:inline-flex">' + esc(L(p.badge)) + '</span>';
    h += '<h2 id="drawerTitle">' + esc(L(p.name)) + (p.supplement ? '*' : '') + '</h2><div class="d-size">' + esc(L(p.size)) + '</div>';
    h += '<div class="price-row" style="margin-top:14px"><span class="price">' + money(p.price) + (p.compareAt ? '<s>' + money(p.compareAt) + '</s>' : '') + '</span><span class="sample">' + esc(t('sample')) + '</span></div>';
    h += '<p class="d-long">' + esc(L(p.long)) + '</p>';
    if (p.chart) {
      h += '<div class="eye"><h3>' + esc(t('eye_tap')) + '</h3><div class="eye-chips" role="group">';
      h += EYE.concerns.map(function (c) { return '<button type="button" data-eye="' + c[0] + '" aria-pressed="false">' + esc(L(c[1])) + '</button>'; }).join('');
      h += '</div><ul class="eye-list" id="eyeList">';
      h += EYE.ingredients.map(function (ing) {
        return '<li data-has="' + ing[1].join(' ') + '"><span>' + esc(L(ing[0])) + '</span><span class="dots" aria-hidden="true">' +
          EYE.concerns.map(function (c) { return '<i class="' + (ing[1].indexOf(c[0]) > -1 ? 'y' : '') + '"></i>'; }).join('') + '</span></li>';
      }).join('');
      h += '</ul></div>';
    }
    if (p.keys && p.keys.length) h += '<ul class="d-keys">' + p.keys.map(function (k) { var v = k[lang] || k.en; return '<li><b>' + esc(v[0]) + '</b><span>' + esc(v[1]) + '</span></li>'; }).join('') + '</ul>';
    if (p.bundle) {
      h += '<div class="box"><h3>' + esc(t('in_box')) + '</h3><ol>' + p.bundle.map(function (k) { var x = PIECES[k]; return '<li><img src="' + x.img + '" alt=""><div><b>' + esc(L(x.name)) + '</b><span>' + esc(L(x.note)) + '</span></div></li>'; }).join('') + '</ol></div>';
    }
    if (p.supplement) h += '<p class="d-sub">' + esc(t('foot_supp')) + '</p>';
    h += '</div><div class="d-buy"><div class="stepper" role="group" aria-label="' + esc(t('qty')) + '"><button type="button" data-dq="-1" aria-label="-">&minus;</button><output id="dQty">' + drawerQty + '</output><button type="button" data-dq="1" aria-label="+">+</button></div>' +
      '<button class="btn gold" type="button" data-add="' + p.id + '" data-qty="' + drawerQty + '" id="dAdd">' + esc(t('add')) + ' · ' + money(p.price * drawerQty) + '</button></div>';
    $('#drawerBody').innerHTML = h;
  }
  drawer.addEventListener('click', function (e) {
    var q = e.target.closest('[data-dq]');
    if (q) { drawerQty = Math.max(1, Math.min(9, drawerQty + +q.getAttribute('data-dq'))); var dq = $('#dQty'), up = +q.getAttribute('data-dq') > 0; dq.textContent = drawerQty; if (!reduce) dq.animate([{ transform: 'translateY(' + (up ? 70 : -70) + '%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 260, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }); var b = $('#dAdd'); b.setAttribute('data-qty', drawerQty); b.textContent = t('add') + ' · ' + money(byId[openDrawerId].price * drawerQty); return; }
    var ey = e.target.closest('[data-eye]');
    if (ey) {
      var on = ey.getAttribute('aria-pressed') !== 'true';
      $$('[data-eye]', drawer).forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      var list = $('#eyeList');
      if (on) {
        ey.setAttribute('aria-pressed', 'true');
        var k = ey.getAttribute('data-eye');
        list.classList.add('filtering');
        $$('li', list).forEach(function (li) { li.classList.toggle('hit', li.getAttribute('data-has').split(' ').indexOf(k) > -1); });
      } else { list.classList.remove('filtering'); $$('li', list).forEach(function (li) { li.classList.remove('hit'); }); }
    }
  });

  /* Cart */
  function save() { try { sessionStorage.setItem('al-cart', JSON.stringify(cart)); } catch (e) {} }
  function count() { return cart.reduce(function (s, l) { return s + l.qty; }, 0); }
  function subtotal() { return cart.reduce(function (s, l) { return s + byId[l.id].price * l.qty; }, 0); }
  function addToBag(id, qty, srcBtn) {
    var line = cart.filter(function (l) { return l.id === id; })[0];
    if (line) line.qty = Math.min(20, line.qty + qty); else { cart.push({ id: id, qty: qty }); newLine = id; }
    save(); renderCart();
    fly(id, srcBtn);
    toast(L(byId[id].name) + ' ' + t('toast_added'));
    if (srcBtn && srcBtn.classList.contains('btn')) {
      var old = srcBtn.innerHTML; srcBtn.classList.add('ok'); srcBtn.textContent = t('added');
      setTimeout(function () { srcBtn.classList.remove('ok'); srcBtn.innerHTML = old; }, 1200);
    }
  }
  function fly(id, srcBtn) {
    var bag = $('#bagBtn');
    var bump = function () { bag.classList.remove('bump'); void bag.offsetWidth; bag.classList.add('bump'); };
    var src = srcBtn && (srcBtn.closest('.card') ? $('.media img', srcBtn.closest('.card')) : srcBtn.closest('.drawer') ? $('.d-media img', drawer) : srcBtn.closest('.routine') ? $('#shelf img[data-g="1"]') : null);
    if (reduce || !src || !bag.animate) { bump(); return; }
    var a = src.getBoundingClientRect(), b = bag.getBoundingClientRect();
    var img = document.createElement('img'); img.className = 'flyer'; img.src = byId[id].img || PIECES['peptide-rx'].img; img.alt = '';
    var w = Math.min(a.width, 160), h = Math.min(a.height, 200);
    img.style.cssText = 'left:' + (a.left + a.width / 2 - w / 2) + 'px;top:' + (a.top + a.height / 2 - h / 2) + 'px;width:' + w + 'px;height:' + h + 'px';
    document.body.appendChild(img);
    var dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    // Smooth arc: sample a quadratic curve (control point lifted above the path) into keyframes
    var cx = dx * 0.35, cy = Math.min(dy, 0) - 160, frames = [];
    for (var k = 0; k <= 12; k++) {
      var tt = k / 12, x = 2 * (1 - tt) * tt * cx + tt * tt * dx, y = 2 * (1 - tt) * tt * cy + tt * tt * dy;
      frames.push({ transform: 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + (1 - 0.86 * tt * tt).toFixed(3) + ') rotate(' + (-18 * tt).toFixed(1) + 'deg)', opacity: tt > 0.85 ? 1 - (tt - 0.85) * 4 : 1 });
    }
    var anim = img.animate(frames, { duration: 720, easing: 'cubic-bezier(0.45, 0, 0.25, 1)' });
    anim.onfinish = function () { img.remove(); bump(); bag.classList.remove('ping'); void bag.offsetWidth; bag.classList.add('ping'); };
  }
  var prevQty = {}, newLine = null;
  function renderCart() {
    var n = count(), sub = subtotal();
    var bb = $('#bagBtn'); $('#bagCount').textContent = n; bb.classList.toggle('has', n > 0);
    bb.setAttribute('aria-label', (lang === 'es' ? 'Bolsa, ' : 'Bag, ') + n + (lang === 'es' ? (n === 1 ? ' artículo' : ' artículos') : (n === 1 ? ' item' : ' items')));
    cartEl.classList.toggle('empty', n === 0);
    $('#cartLines').innerHTML = cart.map(function (l) {
      var p = byId[l.id];
      return '<li class="line-item" data-line="' + l.id + '"><div class="thumb"><img src="' + (p.img || PIECES['peptide-rx'].img) + '" alt=""></div><div><h4>' + esc(L(p.name)) + '</h4>' +
        '<div class="meta"><div class="stepper sm" role="group" aria-label="' + esc(t('qty')) + '"><button type="button" data-q="-1" aria-label="-">&minus;</button><output>' + l.qty + '</output><button type="button" data-q="1" aria-label="+">+</button></div>' +
        '<button type="button" class="rm" data-rm>' + esc(t('remove')) + '</button></div></div><span class="lp">' + money2(p.price * l.qty) + '</span></li>';
    }).join('');
    // quantity numbers roll up or down; a newly added line slides in
    if (!reduce) $$('.line-item', cartEl).forEach(function (li) {
      var id = li.getAttribute('data-line'), l = cart.filter(function (x) { return x.id === id; })[0], o = $('output', li);
      if (prevQty[id] != null && prevQty[id] !== l.qty) { var up = l.qty > prevQty[id]; o.animate([{ transform: 'translateY(' + (up ? 70 : -70) + '%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 260, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }); }
      if (id === newLine && cartEl.classList.contains('on')) li.animate([{ transform: 'translateX(24px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    });
    prevQty = {}; cart.forEach(function (l) { prevQty[l.id] = l.qty; }); newLine = null;
    $('#cartSub').textContent = money2(sub);
    var left = Math.max(0, FREE_SHIP - sub);
    $('#shipMeter p').textContent = left > 0 ? t('ship_left').replace('{n}', left.toFixed(2).replace(/\.00$/, '')) : t('ship_free');
    $('#shipMeter').style.setProperty('--fill', Math.min(1, sub / FREE_SHIP));
  }
  cartEl.addEventListener('click', function (e) {
    var li = e.target.closest('[data-line]'); if (!li) return;
    var id = li.getAttribute('data-line'), line = cart.filter(function (l) { return l.id === id; })[0];
    var q = e.target.closest('[data-q]');
    if (q) { line.qty += +q.getAttribute('data-q'); if (line.qty < 1) cart = cart.filter(function (l) { return l !== line; }); }
    else if (e.target.closest('[data-rm]')) cart = cart.filter(function (l) { return l !== line; });
    else return;
    save(); renderCart();
  });
  $('#bagBtn').addEventListener('click', function () { if (drawer.classList.contains('on')) hide(drawer); show(cartEl); staggerCart(); });
  function staggerCart() {
    if (reduce) return;
    $$('.line-item', cartEl).forEach(function (li, i) { li.animate([{ transform: 'translateX(28px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, delay: 140 + i * 60, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'backwards' }); });
    var f = $('#cartFoot'); if (f) f.animate([{ transform: 'translateY(16px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, delay: 200, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'backwards' });
  }

  /* ---------- Checkout (simulated, test mode) ---------- */
  var orderNo = null;
  function method() { var m = $('input[name="method"]:checked'); return m ? m.value : 'ship'; }
  function shipCost() { return method() === 'pickup' || subtotal() >= FREE_SHIP ? 0 : SHIP; }
  function totals() { var s = subtotal(), sh = shipCost(), tx = Math.round(s * TAX * 100) / 100; return { s: s, sh: sh, tx: tx, total: s + sh + tx }; }
  function renderSummary() {
    var x = totals();
    $('#coLines').innerHTML = cart.map(function (l) { var p = byId[l.id]; return '<li><span class="thumb"><img src="' + (p.img || PIECES['peptide-rx'].img) + '" alt=""><span class="q">' + l.qty + '</span></span><span>' + esc(L(p.name)) + '</span><span class="tnum">' + money2(p.price * l.qty) + '</span></li>'; }).join('');
    $('#coSub').textContent = money2(x.s); $('#coShip').textContent = x.sh ? money2(x.sh) : t('free');
    $('#coTax').textContent = money2(x.tx); $('#coTotal').textContent = money2(x.total);
    $('#shipCost').textContent = subtotal() >= FREE_SHIP ? t('free') : money2(SHIP);
    var pa = $('#payAmt'); if (pa) pa.textContent = money2(x.total);
  }
  var curStep = 0;
  function setStep(i) {
    co.setAttribute('data-dir', i >= curStep ? 'fwd' : 'back'); curStep = i;
    $$('#coSteps li').forEach(function (li, j) { li.classList.toggle('on', j <= i); });
    $('#coSteps').style.setProperty('--fill', (i / 2).toFixed(3));
    $('#paneDetails').hidden = i !== 0; $('#panePay').hidden = i !== 1; $('#paneDone').hidden = i !== 2;
    co.scrollTop = 0;
  }
  function openSimCheckout() { hide(cartEl); setStep(0); renderSummary(); show(co); }
  var goingLive = false;
  function openCheckout() {
    if (!cart.length || goingLive) return;
    // Shopify wiring (assets/js/shopify.js): with a Storefront token set, send the bag to Shopify's
    // real test checkout. Without one, or on any error, use the simulated checkout below.
    var S = window.ALShop;
    if (!S || !S.config || !S.config.token) { openSimCheckout(); return; }
    var btn = $('#toCheckout'); goingLive = true; btn.disabled = true; btn.textContent = t('co_opening');
    var lines = cart.map(function (l) { return { id: l.id, qty: l.qty }; });
    S.checkout(lines, lang).then(function (url) {
      window.location.href = url;
      setTimeout(function () { goingLive = false; btn.disabled = false; btn.textContent = t('checkout'); }, 4000);
    }).catch(function (e) {
      S.warn('Shopify checkout unavailable', e && e.message);
      goingLive = false; btn.disabled = false; btn.textContent = t('checkout');
      openSimCheckout();
    });
  }
  $('#toCheckout').addEventListener('click', openCheckout);
  $$('input[name="method"]').forEach(function (r) { r.addEventListener('change', function () { $('#addrSet').hidden = method() === 'pickup'; renderSummary(); }); });
  $$('[data-express]').forEach(function (b) { b.addEventListener('click', function () { fillTest(); toast(lang === 'es' ? 'Pago rápido simulado en modo de prueba' : 'Express pay is simulated in test mode'); }); });
  function fillTest() {
    var f = $('#paneDetails');
    f.email.value = 'test.patient@example.com'; f.first.value = 'Test'; f.last.value = 'Customer';
    f.address.value = '100 Example St'; f.city.value = 'Tampa'; f.state.value = 'FL'; f.zip.value = '33609';
    $$('.f.bad', f).forEach(clearErr);
  }
  $('#fillTest').addEventListener('click', fillTest);
  function clearErr(lbl) { lbl.classList.remove('bad'); var e = $('.err', lbl); if (e) e.remove(); }
  function err(input, msg) { var lbl = input.closest('.f'); clearErr(lbl); lbl.classList.add('bad'); var s = document.createElement('span'); s.className = 'err'; s.textContent = msg; lbl.appendChild(s); }
  function validate(form) {
    var ok = true, first = null;
    $$('input[required]', form).forEach(function (i) {
      if (i.closest('[hidden]')) return;
      clearErr(i.closest('.f'));
      var v = i.value.trim(), m = null;
      if (!v) m = t('err_req');
      else if (i.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) m = t('err_email');
      else if (i.name === 'zip' && !/^\d{5}$/.test(v)) m = t('err_zip');
      else if (i.name === 'card' && v.replace(/\s/g, '').length < 15) m = t('err_card');
      if (m) { err(i, m); ok = false; first = first || i; }
    });
    if (first) first.focus();
    return ok;
  }
  $('#paneDetails').addEventListener('submit', function (e) {
    e.preventDefault(); if (!validate(this)) return;
    var f = this, cn = $('#panePay').cardname; if (!cn.value) cn.value = (f.first.value + ' ' + f.last.value).trim();
    setStep(1); renderSummary(); setTimeout(function () { $('#payBtn').focus(); }, 50);
  });
  $('#backDetails').addEventListener('click', function () { setStep(0); });
  $('#panePay').addEventListener('submit', function (e) {
    e.preventDefault(); if (!validate(this)) return;
    var btn = $('#payBtn'); btn.disabled = true; btn.classList.add('busy');
    setTimeout(function () {
      orderNo = 'AL-' + (1000 + Math.floor(Math.random() * 9000));
      var email = $('#paneDetails').email.value.trim();
      $('#doneBody').textContent = t('done_body').replace('{o}', orderNo).replace('{e}', email);
      $('#doneWhen').textContent = method() === 'pickup' ? t('done_pick') : t('done_ship');
      renderSummary();
      setStep(2); $('#paneDone').focus(); if (window.ALMotion) window.ALMotion.celebrate();
      btn.disabled = false; btn.classList.remove('busy');
      cart = []; save(); renderCart();
      console.info('[demo] Test order ' + orderNo + ' completed locally. No network call, no charge.');
    }, 1400);
  });
  $('#keepShopping').addEventListener('click', function () { hide(co); setTimeout(function () { location.hash = '#shop'; }, 300); });

  /* ---------- Voice welcome placeholder ---------- */
  var vp = $('#voice-pop'), vt = null;
  function voice() {
    // LIVE BUILD: play her recorded welcome here, e.g. new Audio('assets/audio/welcome-' + lang + '.mp3').play()
    vp.hidden = false; vp.style.animation = 'none'; void vp.offsetWidth; vp.style.animation = '';
    clearTimeout(vt); vt = setTimeout(function () { vp.hidden = true; }, 3600);
  }

  /* ---------- Toast ---------- */
  var tEl = $('#toast'), tt = null;
  function toast(msg) { tEl.textContent = msg; tEl.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { tEl.classList.remove('on'); }, 2200); }

  applyLang(); onScroll();
  window.ALDemo = { setLang: function (l) { lang = l; applyLang(); } };
})();
