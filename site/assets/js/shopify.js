/* Age-Less shop demo - optional Shopify wiring (Storefront API, test store).
   With token '' (default) nothing here touches the network and the demo uses its own
   simulated test-mode checkout. With a public Storefront API token set:
     1. On load: look up each product in AL_PRODUCTS by handle (handle = our product id)
        and store its first variant ID in product.shopify.variantId.
     2. At checkout: cartCreate with the bag lines, then send the shopper to cart.checkoutUrl
        (Shopify's own checkout, in test payment mode on the dev store).
   Any failure (no token, network, API error, product missing) falls back to the simulated
   checkout with a console warning only. The Storefront token is a public, read-only-scoped
   token meant for browsers; never put an Admin API token here. */
window.AL_SHOPIFY = window.AL_SHOPIFY || {
  domain: 'age-less-demo.myshopify.com',
  token: 'e3be9f7d34278ffe6446a28dda47787e',
  apiVersion: '2025-01'
};
(function () {
  'use strict';
  var C = window.AL_SHOPIFY, P = window.AL_PRODUCTS || [];
  var state = { live: false, mapped: 0, reason: '' };

  function warn(msg, detail) { try { console.warn('[shop] ' + msg + (detail ? ': ' + detail : '') + ' - using the simulated test checkout.'); } catch (e) {} }

  function gql(query, variables) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 8000) : null;
    return fetch('https://' + C.domain + '/api/' + C.apiVersion + '/graphql.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': C.token },
      body: JSON.stringify({ query: query, variables: variables || {} }),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      if (timer) clearTimeout(timer);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (j) {
      if (j.errors && j.errors.length) throw new Error(j.errors.map(function (e) { return e.message; }).join('; '));
      return j.data;
    });
  }

  function loadProducts() {
    // One request, one alias per product: p0: product(handle: "peptide-rx") { ... }
    var q = 'query Products {' + P.map(function (p, i) {
      return ' p' + i + ': product(handle: ' + JSON.stringify(p.id) + ') { id handle availableForSale variants(first: 1) { nodes { id availableForSale price { amount currencyCode } } } }';
    }).join('') + ' }';
    return gql(q).then(function (d) {
      P.forEach(function (p, i) {
        var n = d && d['p' + i], v = n && n.variants && n.variants.nodes[0];
        p.shopify = p.shopify || {};
        if (v) { p.shopify.variantId = v.id; p.shopify.productId = n.id; p.shopify.price = v.price && +v.price.amount; state.mapped++; }
        else p.shopify.variantId = null;
      });
      var missing = P.filter(function (p) { return !p.shopify.variantId; }).map(function (p) { return p.id; });
      if (missing.length) warn('Not found in Shopify: ' + missing.join(', '), 'a bag with these items');
      state.live = state.mapped > 0;
      return state;
    });
  }

  var ready = Promise.resolve(state);
  if (!C.token) { state.reason = 'no token'; }
  else if (!window.fetch || !window.Promise) { state.reason = 'old browser'; warn('This browser cannot reach Shopify'); }
  else {
    ready = loadProducts().catch(function (e) { state.live = false; state.reason = String(e && e.message || e); warn('Shopify products could not be loaded', state.reason); return state; });
  }

  /* lines: [{id, qty}] with our product ids. Resolves to a checkout URL, or rejects (caller falls back). */
  function checkout(lines, lang) {
    return ready.then(function () {
      if (!state.live) throw new Error(state.reason || 'Shopify not connected');
      var byId = {}; P.forEach(function (p) { byId[p.id] = p; });
      var gone = lines.filter(function (l) { return !(byId[l.id] && byId[l.id].shopify && byId[l.id].shopify.variantId); });
      if (gone.length) throw new Error('No Shopify variant for ' + gone.map(function (l) { return l.id; }).join(', '));
      var m = 'mutation CartCreate($input: CartInput!) { cartCreate(input: $input) { cart { id checkoutUrl } userErrors { field message } } }';
      return gql(m, { input: {
        lines: lines.map(function (l) { return { merchandiseId: byId[l.id].shopify.variantId, quantity: l.qty }; }),
        attributes: [{ key: 'source', value: 'age-less shop demo' }, { key: 'language', value: lang || 'en' }]
      } }).then(function (d) {
        var r = d && d.cartCreate;
        if (!r) throw new Error('Empty cartCreate response');
        if (r.userErrors && r.userErrors.length) throw new Error(r.userErrors.map(function (e) { return e.message; }).join('; '));
        if (!r.cart || !r.cart.checkoutUrl) throw new Error('No checkoutUrl');
        var url = r.cart.checkoutUrl;
        if (lang === 'es') url += (url.indexOf('?') < 0 ? '?' : '&') + 'locale=es';
        return url;
      });
    });
  }

  window.ALShop = {
    config: C,
    ready: ready,
    isLive: function () { return state.live; },
    status: function () { return { live: state.live, mapped: state.mapped, reason: state.reason }; },
    checkout: checkout,
    warn: warn
  };
})();
