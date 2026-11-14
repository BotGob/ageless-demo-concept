# Age-Less Medicine demo (clinic site)

Static concept site. Pages are generated: edit `build.py` (and `i18n_es.py` for Spanish), then run `python3 build.py`.
Do not hand-edit the root `*.html` files or `js/i18n-es.js`; the next build overwrites them.

## English / Spanish
- EN | ES switch in the header on every page (and in the mobile header next to the menu button).
- Spanish copy: `i18n_es.py` (English text -> Spanish). `build.py` writes it to `js/i18n-es.js`; `js/lang.js` swaps the text in the browser.
- The choice is remembered (localStorage `al-lang`, same key as the shop), can be forced with `?lang=es` / `?lang=en`,
  and is passed to the shop link (`site/index.html?lang=es`). The shop's "Back to Age-Less Medicine" link passes it back.
- Patient reviews are intentionally left in their original English (her patients' own words).
- New copy needs a matching line in `i18n_es.py`, or it stays in English in Spanish mode.

## DRAFT: "A welcome from Dr. Linda" (home page)
- The welcome note text is DRAFT placeholder copy written by Argus AI for the demo. It is not Dr. Linda's words.
  She needs to approve or rewrite it (EN and ES) before anything goes live. Source: `WELCOME` in `build.py`.
- It deliberately makes no claims about her credentials, years, or results.
- "Hear it from Dr. Linda" shows "Her welcome, in her own voice, is coming soon." until her recording exists.
  Hook point: `initVoiceNote()` in `js/main.js`.

## Shop
See `site/README.md`. Clean landing is the default; `site/?layout=full` shows the original motion-heavy hero.
