# Age-Less Medicine shop demo
Open index.html in a browser, or serve the parent folder: `cd .. && python3 -m http.server 8000` then visit http://localhost:8000/site/.
No build step. Fonts and images are local.

- Default look is "mixed" (green hero, cream shop). `?theme=dark` and `?theme=light` still work. All colors are CSS variables at the top of assets/css/style.css.
- Spanish: EN / ES toggle in the header, or `?lang=es`.
- Prices are SAMPLE prices. The "Test mode - no real charge" banner stays on in every mode.
- "Back to Age-Less Medicine" links to ../index.html (the clinic demo one folder up).
- Motion lives in assets/js/motion.js plus the "MOTION POLISH" block at the end of style.css. Everything respects prefers-reduced-motion; pointer effects only run on desktop.

## Shopify (test store)
Wiring lives in assets/js/shopify.js:

```js
window.AL_SHOPIFY = { domain: 'age-less-demo.myshopify.com', token: '<public Storefront token>', apiVersion: '2025-01' };
```

The token is set, so checkout goes to the Age-Less Demo Shopify development store (Bogus test gateway, no real charges). That store is password protected, so a visitor sees Shopify's password page first; after entering it, open checkout again from the shop. Set `token: ''` to switch back to the fully simulated checkout.

- `token: ''` (default): no network calls. Checkout is the built-in simulated test checkout. Nothing is charged and no order goes anywhere.
- `token` set to a public Storefront API access token: on load the shop looks up each product by handle (the handle equals the product id in assets/js/data.js, for example `peptide-rx`) and stores its first variant ID. At checkout it calls `cartCreate` with the bag lines and redirects to `cart.checkoutUrl`, Shopify's own checkout. On the dev store that checkout runs with test payments only.
- Fallback: if the token is missing, the API fails, or a product in the bag is not found in Shopify, the shop logs a console warning and opens the simulated checkout instead.
- Only ever put a Storefront API token here (it is meant to be public). Never an Admin API token.
- Prices on the page come from data.js. Keep them equal to the Shopify product prices.

To load the products into Shopify: Admin > Products > Import, using products.csv (kept outside this site folder), then upload one image per product.

Product photos are demo crops from her product cards (background removed). The real store needs original images and rights from her supplier. No before/after photos are used.
