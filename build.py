#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path("/workspace/ageless-demo")

MARK = """<svg class="brand-mark" viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="22.2" fill="none" stroke="currentColor" stroke-width="1" opacity="0.45"/>
          <g fill="currentColor">
            <circle cx="24" cy="24" r="3.1"/>
            <ellipse cx="24" cy="13.2" rx="3.2" ry="7.2"/>
            <ellipse cx="24" cy="34.8" rx="3.2" ry="7.2"/>
            <ellipse cx="13.2" cy="24" rx="7.2" ry="3.2"/>
            <ellipse cx="34.8" cy="24" rx="7.2" ry="3.2"/>
          </g>
        </svg>"""

V = "20261119-audit"

# Image sizes for width/height attributes (stock photos in images/stock/)
IMG = {
    "interior-cream": (1800, 1318), "lounge": (1800, 1350), "hallway": (1600, 1048),
    "hero-spa": (1800, 1200), "palms": (1800, 1200), "still-life": (1600, 1066),
    "apothecary": (1400, 2100), "leaves-dark": (1238, 2200),
}


def _srcset(name, ext):
    """Build a srcset from any 800/1200 derivatives that exist, plus the original."""
    w, _ = IMG[name]
    parts = []
    for tw in (800, 1200):
        if (ROOT / f"images/stock/{name}-{tw}.{ext}").exists():
            parts.append(f"images/stock/{name}-{tw}.{ext} {tw}w")
    parts.append(f"images/stock/{name}.{ext} {w}w")
    return ", ".join(parts)


def pic(name, alt="", eager=False, cls="", sizes="(max-width: 700px) 92vw, (max-width: 1080px) 48vw, 620px"):
    w, h = IMG[name]
    load = 'fetchpriority="high"' if eager else 'loading="lazy"'
    dec = "sync" if eager else "async"
    c = f' class="{cls}"' if cls else ""
    return (
        f'<picture{c}>'
        f'<source type="image/webp" srcset="{_srcset(name, "webp")}" sizes="{sizes}">'
        f'<img src="images/stock/{name}.jpg" srcset="{_srcset(name, "jpg")}" sizes="{sizes}" '
        f'alt="{alt}" width="{w}" height="{h}" {load} decoding="{dec}"></picture>'
    )


# Her pamphlet's three pillars. Service names follow the pamphlet wording.
# WORDING AWAITS DR. LINDA'S APPROVAL (see /workspace/clients/ageless/clinic-rebuild-wording.md).
PILLARS = [
    {"n": "01", "key": "longevity", "href": "longevity.html", "title": "Longevity and hormones",
     "tag": "A foundation for wellness.", "img": "lounge",
     "img_alt": "A calm sitting room with cream chairs and greenery",
     "items": [("longevity.html#assessments", "Longevity and wellness assessments"),
               ("hormones.html", "Hormone optimization"),
               ("longevity.html#peptides", "Peptide expertise")],
     "pages": {"longevity", "hormones"}},
    {"n": "02", "key": "metabolic", "href": "metabolic.html", "title": "Metabolic and IV care",
     "tag": "Support your health goals.", "img": "leaves-dark",
     "img_alt": "Deep green leaves",
     "items": [("weight-loss.html", "Micro-dose GLP-1 weight loss"),
               ("metabolic.html#iv", "Customized IV therapies")],
     "pages": {"metabolic", "weight"}},
    {"n": "03", "key": "aesthetics", "href": "aesthetics.html", "title": "Skin and aesthetics",
     "tag": "Your beauty. Your way.", "img": "still-life",
     "img_alt": "A linen towel, a bottle, a candle and tulips",
     "items": [("injectables.html", "Botox and dermal fillers"),
               ("skin.html", "Skin and facials"),
               ("prp.html", "PRP Stem-Cell Facial"),
               ("aesthetics.html#supplements", "Age-Less vitamins and supplements"),
               ("site/index.html#shop", "Age-Less skin care")],
     "pages": {"aesthetics", "injectables", "skin", "prp"}},
]
TREAT_PAGES = set().union(*[p["pages"] for p in PILLARS])
PAGEKEY = {"hormones.html": "hormones", "weight-loss.html": "weight", "injectables.html": "injectables", "skin.html": "skin", "prp.html": "prp"}

VISIT_TYPES = [
    "Consultation", "Longevity and wellness assessment", "Hormone optimization", "Peptide consultation",
    "Micro-dose GLP-1 weight loss", "IV therapy", "Botox and dermal fillers", "Skin and facials",
    "PRP Stem-Cell Facial", "Beauty Club", "I am not sure yet",
]

BAG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
PLAY = '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor"/></svg>'
MAPS = "https://maps.google.com/?q=4830+West+Kennedy+Boulevard+Suite+110+Tampa+FL+33609"


def nowidow(text):
    text = text.replace("Stem-Cell", "Stem&#8209;Cell")
    if " " not in text:
        return text
    head, tail = text.rsplit(" ", 1)
    return f"{head}&nbsp;{tail}"


def cur(page, name):
    return ' aria-current="page"' if page == name else ""


def header(active):
    treat_current = ' aria-current="true"' if active in TREAT_PAGES else ""
    cols = ""
    for p in PILLARS:
        items = "\n".join(
            f'                <li><a href="{href}"{cur(active, PAGEKEY.get(href, "-"))}>{label}</a></li>'
            for href, label in p["items"]
        )
        head_cur = ' aria-current="page"' if active == p["key"] else ""
        cols += f"""            <div class="mega-col">
              <a class="mega-head" href="{p['href']}"{head_cur}><span class="mega-n">{p['n']}</span><span>{p['title']}</span></a>
              <p class="mega-tag">{p['tag']}</p>
              <ul>
{items}
              </ul>
            </div>
"""
    return f"""  <header class="site-header is-solid">
    <div class="header-inner">
      <a class="brand" href="index.html" aria-label="Age-Less Medicine home">
        {MARK}
        <span class="brand-text">
          <span class="brand-name">Age-Less</span>
          <span class="brand-sub">Medicine</span>
        </span>
      </a>
      <nav class="nav" id="site-nav" aria-label="Primary">
        <div class="has-sub">
          <button class="nav-label" type="button" aria-expanded="false" aria-controls="treat-menu"{treat_current}>Treatments</button>
          <div class="subnav mega" id="treat-menu">
{cols}            <div class="mega-foot">
              <a href="index.html#approach">The Age-Less approach</a>
              <a href="index.html#find-treatment" data-open-quiz>Not sure where to start? Find your treatment</a>
            </div>
          </div>
        </div>
        <a href="index.html#approach">Our approach</a>
        <a href="about.html"{cur(active, "about")}>Dr. Linda</a>
        <a href="beauty-club.html"{cur(active, "club")}>Beauty Club</a>
        <a href="contact.html"{cur(active, "contact")}>Visit</a>
        <a class="cross-link nav-shop" href="site/index.html">{BAG}<span>Shop</span></a>
        <a class="btn btn--gold nav-book" href="#book" data-open-booking>Book a visit</a>
      </nav>
      <div class="header-tools">
        <a class="cross-link cross-link--bar" href="site/index.html">{BAG}<span>Shop</span></a>
        <div class="lang-switch" role="group" aria-label="Language">
          <button type="button" data-lang="en" aria-pressed="true">EN</button>
          <button type="button" data-lang="es" aria-pressed="false">ES</button>
        </div>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu"><span></span></button>
      </div>
    </div>
  </header>"""


def footer():
    care = "\n".join(f'          <li><a href="{p["href"]}">{p["title"]}</a></li>' for p in PILLARS)
    return f"""  <footer class="site-footer">
    <div class="wrap footer-grid">
      <div class="footer-brand">
        <a class="brand" href="index.html" aria-label="Age-Less Medicine home">
          {MARK}
          <span class="brand-text"><span class="brand-name">Age-Less</span><span class="brand-sub">Medicine</span></span>
        </a>
        <p class="footer-tag">Personalized longevity, wellness and aesthetic care.</p>
        <p>Linda McClintock, M.D.<br>Medical Director and President</p>
        <p>One Urban Centre<br>4830 West Kennedy Boulevard, Suite 110<br>Tampa, Florida 33609</p>
      </div>
      <div>
        <h2>Visit</h2>
        <p>Monday through Thursday<br>10:00 a.m. to 5:00 p.m.<br>Friday through Sunday, closed</p>
        <p><a href="tel:+18132864404">(813) 286-4404</a><br>
        <a href="mailto:info@age-lessmedicine.com">info@age-lessmedicine.com</a></p>
        <ul class="footer-list footer-list--inline">
          <li><a href="{MAPS}" rel="noopener noreferrer" target="_blank">Directions</a></li>
          <li><a href="https://www.facebook.com/296291637095921" rel="noopener noreferrer" target="_blank">Facebook</a></li>
        </ul>
      </div>
      <div>
        <h2>Our care</h2>
        <ul class="footer-list">
{care}
          <li><a href="index.html#approach">The Age-Less approach</a></li>
          <li><a href="about.html">About Dr. Linda</a></li>
          <li><a href="beauty-club.html">Beauty Club</a></li>
          <li><a href="index.html#find-treatment" data-open-quiz>Find your treatment</a></li>
          <li><a href="contact.html">Contact and visit</a></li>
        </ul>
      </div>
      <div>
        <h2>Shop</h2>
        <ul class="footer-list">
          <li><a href="site/index.html#shop">The skin care collection</a></li>
          <li><a href="site/index.html#routine">Morning routine</a></li>
          <li><a href="site/index.html?goal=inside#shop">Wellness from within</a></li>
          <li><a href="#book" data-open-booking>Book a visit</a></li>
        </ul>
        <p class="footer-ship">Shipping is $9.95, free on orders of $100 or more. Free pickup at our Tampa office.</p>
      </div>
    </div>
    <div class="wrap footer-disclaimer">
      <p>Care requires an individual medical evaluation. Treatment eligibility, benefits and risks vary. Results are not guaranteed.</p>
    </div>
    <div class="wrap legal">
      <p>Concept by Argus AI.</p>
      <p>&copy; Age-Less Medicine. Personalized medicine. Every stage.</p>
    </div>
  </footer>"""


def book_bar():
    return """  <div class="book-bar" role="region" aria-label="Quick booking">
    <a class="btn btn--ghost" href="tel:+18132864404">Call</a>
    <a class="btn btn--gold" href="#book" data-open-booking>Book a visit</a>
  </div>"""


VOICE_POP = """  <div class="voice-pop" id="voice-pop" role="status" aria-live="polite" hidden>
    <div class="wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
    <p>Her welcome, in her own voice, is coming soon.</p>
  </div>"""


def voice_button():
    return f"""<button class="voice-big" type="button" data-voice aria-describedby="voice-pop">
            <span class="play" aria-hidden="true">{PLAY}</span>
            <span>Tap to hear Dr. Linda</span>
            <span class="wave sm" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
          </button>"""


def modal():
    options = "\n".join(f'            <option value="{v}">{v}</option>' for v in VISIT_TYPES)
    return f"""  <div class="modal" id="book" aria-hidden="true" role="dialog" aria-labelledby="book-title">
    <div class="modal-backdrop" data-close-booking></div>
    <div class="modal-card">
      <button class="modal-close" type="button" data-close-booking aria-label="Close booking form">&times;</button>
      <form id="booking-form">
        <p class="eyebrow">Request a visit</p>
        <h2 class="display" id="book-title">When would you like to come in?</h2>
        <hr class="gold-rule">
        <p class="form-note">Please do not include medical details. This form is only for scheduling.</p>
        <div class="form-scroll">
        <div class="form-grid">
          <label>How can we help?
            <select id="visit-treatment" name="treatment" required>
              <option value="" disabled selected>Select a visit type</option>
{options}
            </select>
          </label>
          <label>Preferred day
            <input id="visit-date" name="date" type="date" required>
          </label>
          <label>Preferred time
            <select name="time" required>
              <option value="" disabled selected>Select a time of day</option>
              <option>Morning, 10:00 a.m. to 12:00 p.m.</option>
              <option>Early afternoon, 12:00 p.m. to 3:00 p.m.</option>
              <option>Late afternoon, 3:00 p.m. to 5:00 p.m.</option>
            </select>
          </label>
          <label>Full name
            <input name="name" type="text" autocomplete="name" required>
          </label>
          <label>Phone
            <input name="phone" type="tel" autocomplete="tel" required>
          </label>
          <label>Email
            <input name="email" type="email" autocomplete="email" required>
          </label>
          <label>Are you new to our office?
            <select name="patient" required>
              <option value="" disabled selected>Please choose one</option>
              <option>I am a new patient</option>
              <option>I am a returning patient</option>
            </select>
          </label>
        </div>
        <p class="form-note">We are open Monday through Thursday, 10:00 a.m. to 5:00 p.m.</p>
        <p class="form-error" id="booking-error"></p>
        </div>
        <div class="btn-row modal-actions">
          <button class="btn btn--gold" type="submit">Request this time</button>
          <button class="btn btn--line" type="button" data-close-booking>Cancel</button>
        </div>
      </form>
      <div class="confirm" id="booking-confirm" hidden></div>
    </div>
  </div>"""



def quiz_modal():
    return """  <div class="modal" id="quiz" aria-hidden="true" role="dialog" aria-labelledby="quiz-title">
    <div class="modal-backdrop" data-close-quiz></div>
    <div class="modal-card quiz-card">
      <button class="modal-close" type="button" data-close-quiz aria-label="Close treatment guide">&times;</button>
      <div id="quiz-app"></div>
    </div>
  </div>"""


RELATED = {
    "prp": [
        ("skin.html", "hero-spa", "Skin and facials", "PRP facials, micro-needling, peels and more, supervised by Dr. Linda."),
        ("injectables.html", "hallway", "Botox and dermal fillers", "Individualized consultations with an expert injector, focused on facial balance."),
    ],
    "hormones": [
        ("longevity.html", "lounge", "Longevity and hormones", "Assessments, hormone optimization and peptide expertise, built around your goals."),
        ("weight-loss.html", "apothecary", "Micro-dose GLP-1 weight loss", "Physician-guided weight management with nutrition guidance and follow-up."),
    ],
    "weight": [
        ("metabolic.html", "leaves-dark", "Metabolic and IV care", "Our GLP-1 program and customized IV therapies, planned around your health."),
        ("hormones.html", "palms", "Hormone optimization", "An individualized assessment for women and men, with appropriate lab evaluation."),
    ],
    "injectables": [
        ("skin.html", "hero-spa", "Skin and facials", "PRP facials, micro-needling, peels and more, supervised by Dr. Linda."),
        ("aesthetics.html", "still-life", "Skin and aesthetics", "Injectables, facials, Age-Less skin care and supplements in one place."),
    ],
    "skin": [
        ("prp.html", "palms", "PRP Stem-Cell Facial", "A preparation from your own blood, applied with micro-needling."),
        ("injectables.html", "hallway", "Botox and dermal fillers", "Individualized consultations with an expert injector, focused on facial balance."),
    ],
}


def related_section(key):
    cards = ""
    for href, image, title, lede in RELATED[key]:
        cards += f"""          <a class="related-card" href="{href}" data-reveal>
            <div class="related-media">{pic(image)}</div>
            <div class="related-body">
              <h3>{title}</h3>
              <p>{lede}</p>
              <span class="more-link">Explore</span>
            </div>
          </a>
"""
    return f"""    <section class="section related">
      <div class="wrap">
        <div class="section-head" data-reveal>
          <p class="eyebrow">Continue exploring</p>
          <h2 class="display">You might also like</h2>
        </div>
        <div class="related-grid">
{cards}        </div>
      </div>
    </section>
"""


def book_block(treatment, label):
    return f"""        <div class="btn-row" style="margin-top:2rem">
          <a class="btn btn--gold" href="#book" data-open-booking data-treatment="{treatment}">{label}</a>
          <a class="btn btn--line" href="contact.html">Visit our office</a>
        </div>"""


def hero_preload(body):
    """Preload the first hero photo so it is in the first paint (no pop-in)."""
    m = re.search(r'class="p-hero-media[^"]*">\s*(?:<picture[^>]*>)?\s*(<source type="image/webp" srcset="([^"]+)" sizes="([^"]+)">|<img src="([^"]+)")', body)
    if not m:
        return ""
    if m.group(2):
        first = m.group(2).split(",")[0].split()[0]
        return (f'  <link rel="preload" as="image" type="image/webp" href="{first}" '
                f'imagesrcset="{m.group(2)}" imagesizes="{m.group(3)}">\n')
    return f'  <link rel="preload" as="image" href="{m.group(4)}">\n'


def page(filename, title, description, active, body, solid=True, extra_head=""):
    if not extra_head:
        extra_head = hero_preload(body)
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="robots" content="noindex, nofollow">
  <meta name="view-transition" content="same-origin">
  <title>{title}</title>
  <style>html,body{{background:#faf6ee}}</style>
  <meta name="description" content="{description}">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="preload" href="site/assets/fonts/CormorantGaramond-500.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="site/assets/fonts/CormorantGaramond-500i.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="site/assets/fonts/Outfit-400.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="css/fonts.css?v={V}">
  <link rel="stylesheet" href="css/styles.css?v={V}">
  <link rel="stylesheet" href="css/clinic.css?v={V}">
  <link rel="stylesheet" href="css/premium.css?v={V}">
{extra_head}  <noscript><style>[data-reveal]{{opacity:1;transform:none}}</style></noscript>
  <script>(function(){{var l=new URLSearchParams(location.search).get("lang");try{{l=l||localStorage.getItem("al-lang")}}catch(e){{}}if(l==="es"){{document.documentElement.classList.add("lang-pending");setTimeout(function(){{document.documentElement.classList.remove("lang-pending")}},1500)}}}})();</script>
</head>
<body class="clinic page-{active}">
  <a class="skip" href="#main">Skip to content</a>
{header(active)}
{VOICE_POP}
  <main id="main">
{body}
  </main>
{footer()}
{book_bar()}
{modal()}
{quiz_modal()}
  <script src="js/i18n-es.js?v={V}" defer></script>
  <script src="js/lang.js?v={V}" defer></script>
  <script src="js/main.js?v={V}" defer></script>
  <script src="site/assets/js/premium.js?v={V}" defer></script>
</body>
</html>
"""
    html = re.sub(
        r'(<(?:h1|h2) class="display"[^>]*>)([^<]+)(</(?:h1|h2)>)',
        lambda m: m.group(1) + nowidow(m.group(2)) + m.group(3),
        html,
    )
    (ROOT / filename).write_text(html)
    print("wrote", filename, len(html))


def page_hero(eyebrow, heading, lede, image, image_alt="", extra_btn="", book_label="Book a visit", treatment="", media=None):
    t = f' data-treatment="{treatment}"' if treatment else ""
    fig = media or f'<figure class="p-hero-media">{pic(image, image_alt, eager=True, sizes="(max-width: 1080px) 92vw, 560px")}</figure>'
    return f"""    <section class="p-hero">
      <div class="wrap p-hero-grid">
        <div class="p-hero-copy">
          <p class="eyebrow">{eyebrow}</p>
          <h1 class="display">{heading}</h1>
          <p class="lede">{lede}</p>
          <div class="btn-row">
            <a class="btn btn--gold" href="#book" data-open-booking{t}>{book_label}</a>
            {extra_btn}
          </div>
        </div>
        {fig}
      </div>
    </section>"""


def section_head(eyebrow, title, lede="", center=False, tag="h2", hid=""):
    i = f' id="{hid}"' if hid else ""
    lede_html = f'\n          <p class="lede">{lede}</p>' if lede else ""
    c = " section-head--center" if center else ""
    return f"""        <div class="section-head{c}" data-reveal>
          <p class="eyebrow">{eyebrow}</p>
          <{tag} class="display"{i}>{title}</{tag}>
          <hr class="gold-rule">{lede_html}
        </div>"""


def approach_section(compact=False):
    head = "" if compact else '\n          <p class="approach-foot">Personalized medicine. Every stage.</p>'
    return f"""    <section class="section approach" id="approach" aria-labelledby="approach-title">
      <div class="wrap">
        <div class="approach-grid">
          <div class="approach-intro" data-reveal>
            <p class="eyebrow">The Age-Less approach</p>
            <h2 class="display" id="approach-title">Care built around you.</h2>
            <hr class="gold-rule">
            <p class="lede">Your health history, priorities and goals guide a personalized conversation about next steps.</p>{head}
          </div>
          <ol class="approach-steps">
            <li data-reveal><span class="step-n">01</span><h3>Assess</h3><p>Your goals, symptoms and lifestyle, with relevant testing when it helps.</p></li>
            <li data-reveal><span class="step-n">02</span><h3>Personalize</h3><p>Appropriate options, with their expected benefits and potential risks explained.</p></li>
            <li data-reveal><span class="step-n">03</span><h3>Follow through</h3><p>We review how you respond and adjust your plan with medical guidance.</p></li>
          </ol>
        </div>
      </div>
    </section>
"""


def shop_band(eyebrow="Between visits", title="Age-Less skin&nbsp;care", body="Dr. Linda's own line of medical-grade skin care, the same products she uses in the treatment room. Order online and we ship it to you, or pick it up free at our office.", note=""):
    note_html = f'\n          <p class="skin-shop-note">{note}</p>' if note else ""
    return f"""    <section class="section shop-band-section">
      <div class="wrap skin-shop shop-band" data-reveal>
        <div class="skin-shop-copy">
          <p class="eyebrow">{eyebrow}</p>
          <h2 class="display">{title}</h2>
          <hr class="gold-rule">
          <p>{body}</p>{note_html}
          <div class="btn-row">
            <a class="btn btn--gold" href="site/index.html#shop">Shop the collection</a>
            <a class="btn btn--line" href="site/index.html#routine">See her morning routine</a>
          </div>
        </div>
        <a class="skin-shop-photo" href="site/index.html#shop" aria-label="Shop the Age-Less skin care collection">
          <img src="site/assets/img/hero-lineup-800.webp" alt="The Age-Less Medicine skin care line on a marble counter" width="800" height="599" loading="lazy" decoding="async">
        </a>
      </div>
    </section>
"""


def supplements_grid():
    return """        <div class="shop-grid">
          <a class="product" data-reveal href="site/index.html?goal=inside#shop">
            <div class="product-photo"><picture><source type="image/webp" srcset="images/products/greens.webp"><img src="images/products/greens.jpg" alt="A jar of Age-Less Greens" width="470" height="694" loading="lazy" decoding="async"></picture></div>
            <div class="product-body"><h3>Age-Less Greens</h3><p class="amt">$46.95</p><span class="product-cta">Shop online</span></div>
          </a>
          <div class="product product--ask" data-reveal>
            <div class="product-photo"><picture><source type="image/webp" srcset="images/products/reds.webp"><img src="images/products/reds.jpg" alt="A jar of Age-Less Reds" width="470" height="694" loading="lazy" decoding="async"></picture></div>
            <div class="product-body"><h3>Age-Less Reds</h3><p class="amt-note">Available at our office</p><a class="product-cta" href="tel:+18132864404">Call to ask</a></div>
          </div>
          <div class="product product--ask" data-reveal>
            <div class="product-photo"><picture><source type="image/webp" srcset="images/products/purples.webp"><img src="images/products/purples.jpg" alt="A jar of Age-Less Purples" width="470" height="694" loading="lazy" decoding="async"></picture></div>
            <div class="product-body"><h3>Age-Less Purples</h3><p class="amt-note">Available at our office</p><a class="product-cta" href="tel:+18132864404">Call to ask</a></div>
          </div>
        </div>"""


def service_cards(services):
    out = ""
    for s in services:
        sid = f' id="{s["id"]}"' if s.get("id") else ""
        fine = f'\n            <p class="fine">{s["fine"]}</p>' if s.get("fine") else ""
        extra = f'\n            <p>{s["extra"]}</p>' if s.get("extra") else ""
        links = ""
        if s.get("href"):
            links += f'<a class="btn btn--line" href="{s["href"]}">{s["cta"]}</a>'
        if s.get("book"):
            links += f'<a class="btn btn--gold" href="#book" data-open-booking data-treatment="{s["book"]}">{s["book_label"]}</a>'
        out += f"""          <article class="service-card"{sid} data-reveal>
            <p class="service-n">{s["n"]}</p>
            <h3>{s["title"]}</h3>
            <p>{s["body"]}</p>{extra}{fine}
            <div class="btn-row">{links}</div>
          </article>
"""
    return f"""        <div class="service-grid">
{out}        </div>"""


REVIEWS = [
    ("Always professional, thoughtful, and responsive.", "Jeffrey S."),
    ("From the moment i meet Dr. Linda, I felt genuinely listened to and cared for.", "Laura F."),
    ("Great service and staff.", "Alicia R."),
    ("Easy to make an appointment. Very professional and accommodating. . . Myra is great.", "Susan D."),
    ("Caring healthcare", "Dana L."),
    ("The quality of service is steady and constant.", "Katie H."),
    ("Awesome and always such attention to all details", "Carolyn R."),
    ("Dr M is simply the best. Love her recommendations to keep me looking and feeling my best!", "Victoria P."),
]


def review_cards():
    cards = ""
    for quote, name in REVIEWS:
        cards += f"""          <figure class="quote-card">
            <blockquote><p>“{quote}”</p></blockquote>
            <footer>{name}</footer>
          </figure>
"""
    dup = cards.replace('<figure class="quote-card">', '<figure class="quote-card is-dup" aria-hidden="true">')
    return cards + dup


# DRAFT PLACEHOLDER COPY: Dr. Linda's welcome note. Written by Argus AI for the demo only.
# She needs to approve or rewrite it (and record the audio) before anything goes live.
WELCOME = {
    "en": "Welcome, and thank you for being here. I want everyone who walks through our door to feel heard, cared for, and never rushed. Whether you come in with a clear goal or simply a question, we will take the time to understand what matters to you. I look forward to meeting you.",
    "es": "Te doy la bienvenida, y gracias por estar aquí. Quiero que cada persona que cruza nuestra puerta se sienta escuchada, cuidada y sin prisas. Ya sea que vengas con una meta clara o solo con una pregunta, nos tomaremos el tiempo para entender lo que es importante para ti. Será un gusto conocerte.",
}

def welcome_section(story_link=True, photo=True):
    story = '\n          <a class="btn btn--line" href="about.html">Read Dr. Linda’s story</a>' if story_link else ""
    return f"""    <!-- WELCOME NOTE: DRAFT placeholder copy for Dr. Linda to approve or rewrite. Not her words yet.
         Audio: the play button shows "coming soon" (same as the shop) until her recording is added (js/main.js initVoice). -->
    <section class="welcome" id="welcome" aria-labelledby="welcome-title">
      <div class="wrap welcome-grid{"" if photo else " welcome-grid--text"}">{"" if not photo else """
        <figure class="welcome-photo" data-reveal>
          <img src="images/clinic/dr-linda.jpg" alt="Dr. Linda McClintock, medical director of Age-Less Medicine" width="302" height="319" loading="lazy" decoding="async">
        </figure>"""}
        <div class="welcome-copy" data-reveal>
          <p class="eyebrow" id="welcome-title">A welcome from Dr. Linda</p>
          <p class="welcome-text">{WELCOME["en"]}</p>
          <p class="welcome-sign">Dr. Linda McClintock</p>
          <p class="welcome-role">Medical Director and President</p>
          <div class="welcome-actions">
          {voice_button()}{story}
          </div>
        </div>
      </div>
    </section>
"""


def build_es_js():
    import json, sys
    sys.path.insert(0, str(ROOT))
    from i18n_es import ES
    data = dict(ES)
    data[WELCOME["en"]] = WELCOME["es"]
    js = "/* GENERATED by build.py from i18n_es.py. Edit i18n_es.py, not this file. */\nwindow.AL_ES = " + json.dumps(data, ensure_ascii=False, indent=0, sort_keys=True) + ";\n"
    (ROOT / "js" / "i18n-es.js").write_text(js)
    print("wrote js/i18n-es.js", len(data), "strings")


def pillar_cards():
    out = ""
    for p in PILLARS:
        items = "".join(f'<li><a href="{h}">{l}</a></li>' for h, l in p["items"])
        out += f"""          <article class="pillar-card" data-reveal>
            <a class="pillar-media" href="{p['href']}" tabindex="-1" aria-hidden="true">{pic(p['img'], '')}</a>
            <div class="pillar-body">
              <p class="pillar-n">{p['n']}</p>
              <h3><a href="{p['href']}">{p['title']}</a></h3>
              <p class="pillar-tag">{p['tag']}</p>
              <ul class="pillar-list">{items}</ul>
              <a class="more-link" href="{p['href']}">Explore this area</a>
            </div>
          </article>
"""
    return out


def build_home():
    body = f"""    <section class="c-hero">
      <div class="wrap c-hero-grid">
        <div class="c-hero-copy">
          <p class="eyebrow">Science. Experience. Individual care.</p>
          <h1 class="display c-hero-title"><span>Live well.</span> <em>Age beautifully.</em></h1>
          <p class="lede">Personalized longevity, wellness and aesthetic care with Dr. Linda McClintock in Tampa.</p>
          <div class="btn-row">
            <a class="btn btn--gold" href="#book" data-open-booking data-treatment="Consultation">Book a consultation</a>
            <a class="btn btn--line" href="#care">Explore our care</a>
          </div>
          <ul class="c-hero-facts">
            <li>Physician-led since 2006</li>
            <li>English and Spanish</li>
            <li>Westshore, Tampa</li>
          </ul>
        </div>
        <figure class="c-hero-media">
          {pic("interior-cream", "A calm, sunlit sitting room in soft cream tones", eager=True, sizes="(max-width: 1080px) 92vw, 520px")}
        </figure>
      </div>
    </section>

{welcome_section()}
    <section class="section pillars" id="care">
      <div class="wrap">
{section_head("How we can help", "Three areas of care, one plan for you", "Every plan starts with a conversation about your health history, your priorities and your goals.")}
        <div class="pillar-grid">
{pillar_cards()}        </div>
      </div>
    </section>

    <section class="pm-band" aria-hidden="true">
      <picture><source type="image/webp" srcset="images/stock/band-spa-1000.webp 1000w, images/stock/band-spa-1440.webp 1440w" sizes="100vw"><img src="images/stock/band-spa-1200.jpg" alt="" width="1440" height="720" loading="lazy" decoding="async"></picture>
    </section>

{approach_section()}
{shop_band(eyebrow="Age-Less skin care", title="Her skin care, between&nbsp;visits", body="Medical-grade skin care from Dr. Linda's practice, with a personalized regimen for your skin concerns and daily routine. Order online and we ship it to you, or pick it up free at our office.")}
    <section class="section" id="find-treatment">
      <div class="wrap quiz-band" data-reveal>
        <div>
          <p class="eyebrow">A simple starting point</p>
          <h2 class="display">Not sure where to start?</h2>
          <p class="lede">Answer two short questions and we will point you toward a visit that may fit. No medical details are collected.</p>
        </div>
        <div class="btn-row">
          <a class="btn btn--gold" href="#find-treatment" data-open-quiz>Find your treatment</a>
          <a class="btn btn--line" href="tel:+18132864404">Or call us</a>
        </div>
      </div>
    </section>

    <section class="reviews section section--ivory">
      <div class="wrap section-head" data-reveal>
        <p class="eyebrow">Kind words</p>
        <h2 class="display">What our patients say</h2>
        <hr class="gold-rule">
        <p class="lede">A few notes from people we have been fortunate to care for.</p>
      </div>
      <div class="marquee" aria-label="Patient remarks">
        <div class="marquee-track">
{review_cards()}        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
{section_head("Membership", "The Beauty Club", "Dr. Linda’s Age-less Savings Account lets you set aside a monthly amount and build Age-less Bucks toward our products and services. Retail discounts begin at 8 percent for a Bronze account.")}
        <div class="tiers">
          <article class="tier" data-reveal>
            <h3>Bronze</h3>
            <p class="price">$<span data-count="99">99</span> <span>a month</span></p>
            <ul>
              <li>Service of your choice</li>
              <li>8% off retail products</li>
              <li>$65 in Age-Less Bucks each quarter</li>
            </ul>
          </article>
          <article class="tier" data-reveal>
            <h3>Silver</h3>
            <p class="price">$<span data-count="125">125</span> <span>a month</span></p>
            <ul>
              <li>Service of your choice</li>
              <li>10% off retail products</li>
              <li>$110 in Age-Less Bucks each quarter</li>
            </ul>
          </article>
          <article class="tier tier--gold" data-reveal>
            <h3>Gold</h3>
            <p class="price">$<span data-count="200">200</span> <span>a month</span></p>
            <ul>
              <li>Service of your choice</li>
              <li>12% off retail products</li>
              <li>$185 in Age-Less Bucks each quarter</li>
            </ul>
          </article>
        </div>
        <div class="btn-row" style="margin-top:1.6rem" data-reveal>
          <a class="btn btn--line" href="beauty-club.html">See membership details</a>
        </div>
      </div>
    </section>

{next_chapter()}"""
    page(
        "index.html",
        "Age-Less Medicine | Live well. Age beautifully.",
        "Personalized longevity, wellness and aesthetic care with Dr. Linda McClintock in Tampa: longevity and hormones, metabolic and IV care, and skin and aesthetics.",
        "home",
        body,
        extra_head=(
            '  <link rel="preload" as="image" type="image/webp" href="images/stock/interior-cream-1200.webp" '
            'imagesrcset="images/stock/interior-cream-800.webp 800w, images/stock/interior-cream-1200.webp 1200w, images/stock/interior-cream.webp 1800w" '
            'imagesizes="(max-width: 1080px) 92vw, 520px">\n'
        ),
    )


def next_chapter():
    return f"""    <section class="section next-chapter" id="visit">
      <div class="wrap next-grid">
        <div data-reveal>
          <p class="eyebrow">Begin your next chapter</p>
          <h2 class="display">A thoughtful plan. A healthier outlook.</h2>
          <hr class="gold-rule">
          <p class="lede">Schedule your personalized consultation. We are also happy to answer questions by phone.</p>
          <div class="btn-row">
            <a class="btn btn--gold" href="#book" data-open-booking data-treatment="Consultation">Book a consultation</a>
            <a class="btn btn--line" href="tel:+18132864404">Call (813) 286-4404</a>
          </div>
        </div>
        <div class="visit-card-lite" data-reveal>
          <h3>Visit us</h3>
          <p>One Urban Centre<br>4830 West Kennedy Boulevard, Suite 110<br>Tampa, Florida 33609</p>
          <h3>Hours</h3>
          <p>Monday through Thursday, 10:00 a.m. to 5:00 p.m.<br>Friday through Sunday, closed</p>
          <p class="visit-links"><a href="{MAPS}" rel="noopener noreferrer" target="_blank">Directions</a><a href="mailto:info@age-lessmedicine.com">info@age-lessmedicine.com</a></p>
        </div>
      </div>
    </section>
"""


def pillar_page(filename, key, n, title, tagline, lede, image, alt, services, after="", treatment="Consultation", desc=""):
    hero = page_hero(f"{n} · Our care", title, lede, image, alt,
                     '<a class="btn btn--line" href="#services">See the services</a>',
                     "Book a consultation", treatment)
    body = f"""{hero}
    <section class="section" id="services">
      <div class="wrap">
{section_head(title, tagline)}
{service_cards(services)}
      </div>
    </section>
{after}{approach_section(compact=True)}
{next_chapter()}"""
    page(filename, f"{title} | Age-Less Medicine", desc, key, body)


def build_longevity():
    pillar_page(
        "longevity.html", "longevity", "01", "Longevity and hormones", "A foundation for wellness.",
        "Care that starts with your health history, your lifestyle and what matters most to you.",
        "lounge", "A calm sitting room with cream chairs and greenery",
        [
            {"id": "assessments", "n": "Assess", "title": "Longevity and wellness assessments",
             "body": "A personalized review of your health history, lifestyle and wellness priorities, with testing guided by clinical needs.",
             "extra": "When it helps, testing may include Spectracell micronutrient analysis or ALCAT food sensitivity testing.",
             "book": "Longevity and wellness assessment", "book_label": "Book an assessment"},
            {"n": "Balance", "title": "Hormone optimization",
             "body": "An individualized assessment for women and men, including symptoms, appropriate lab evaluation and a discussion of treatment options.",
             "href": "hormones.html", "cta": "About hormone care"},
            {"id": "peptides", "n": "Understand", "title": "Peptide expertise",
             "body": "Over two decades of peptide expertise to help you understand your options, the evidence, safety and whether a peptide is suitable for you.",
             "fine": "Peptide options differ in evidence and regulatory status. Recommendations depend on the specific product and clinical indication.",
             "book": "Peptide consultation", "book_label": "Ask about peptides"},
        ],
        desc="Longevity and wellness assessments, hormone optimization and peptide expertise with Dr. Linda McClintock at Age-Less Medicine in Tampa.",
    )


def build_metabolic():
    pillar_page(
        "metabolic.html", "metabolic", "02", "Metabolic and IV care", "Support your health goals.",
        "Physician-guided programs planned around your health, your needs and your goals.",
        "leaves-dark", "Deep green leaves",
        [
            {"n": "Weight", "title": "Micro-dose GLP-1 weight loss program",
             "body": "Physician-guided weight management with individualized dosing discussions, nutrition guidance and follow-up for eligible patients.",
             "fine": "“Micro-dose” is not a standardized FDA-approved dosing regimen. Medication choice and dosing require a medical evaluation.",
             "href": "weight-loss.html", "cta": "How the program works"},
            {"id": "iv", "n": "Infusion", "title": "Customized IV therapies",
             "body": "Personalized IV formulations, selected after a review of your medical history, your needs and whether treatment is suitable for you.",
             "book": "IV therapy", "book_label": "Ask about IV therapy"},
        ],
        desc="Micro-dose GLP-1 weight loss and customized IV therapies, physician guided by Dr. Linda McClintock at Age-Less Medicine in Tampa.",
    )


def build_aesthetics():
    after = f"""    <section class="section section--ivory" id="supplements">
      <div class="wrap">
{section_head("From within", "Age-Less vitamins and supplements", "Personalized guidance on Age-Less vitamins and supplements to complement your nutrition and wellness plan. Age-Less Greens is in our online shop. For the others, ask us at your visit or give us a call.")}
{supplements_grid()}
      </div>
    </section>
{shop_band()}"""
    pillar_page(
        "aesthetics.html", "aesthetics", "03", "Skin and aesthetics", "Your beauty. Your way.",
        "Aesthetic care and medical-grade skin care, planned around your features and your preferences.",
        "still-life", "A linen towel, a bottle, a candle and tulips",
        [
            {"n": "Injectables", "title": "Expert Botox and dermal filler injector",
             "body": "Individualized aesthetic consultations with an expert injector, and treatment planning focused on facial balance and your personal preferences.",
             "href": "injectables.html", "cta": "About Botox and fillers"},
            {"n": "In the office", "title": "Skin and facials",
             "body": "Our PRP Stem-Cell Facial, micro-needling, Diamond Tome microdermabrasion, Cosmelan and medical grade peels, supervised by Dr. Linda.",
             "href": "skin.html", "cta": "See skin treatments"},
            {"n": "At home", "title": "Medical-grade skin care",
             "body": "Explore Age-Less Medicine skin care products and a personalized regimen for your skin concerns and daily routine.",
             "href": "site/index.html#shop", "cta": "Shop the collection"},
        ],
        after=after,
        desc="Botox and dermal fillers, skin treatments, Age-Less Medicine skin care and supplements with Dr. Linda McClintock in Tampa.",
    )


def build_prp():
    body = f"""{page_hero(
        "03 · Skin and aesthetics",
        "The PRP Stem-Cell Facial",
        "A facial that uses a preparation from your own blood, paired with micro-needling, to refresh the look of your skin.",
        "palms", "",
        '<a class="btn btn--line" href="skin.html">See all skin treatments</a>',
        "Book a PRP facial", "PRP Stem-Cell Facial",
    )}
    <section class="section">
      <div class="wrap prose" data-reveal>
        <p class="eyebrow">What it is</p>
        <h2 class="display">What is a PRP facial?</h2>
        <hr class="gold-rule">
        <p>PRP stands for platelet-rich plasma, the part of your blood that carries natural growth factors. At Age-Less Medicine we call this treatment our PRP Stem-Cell Facial. We draw a small sample of blood, place it in a special centrifuge to prepare the serum, and apply that serum to your skin with our micro-needling technique.</p>
        <p>Because the facial uses a preparation from your own blood, it is designed for people who want a treatment built from their own cells rather than from an off-the-shelf injectable alone.</p>
      </div>
    </section>
    <section class="section section--ivory">
      <div class="wrap detail-grid">
        <article class="detail" data-reveal>
          <h3>How it pairs with micro-needling</h3>
          <p>Micro-needling is how we deliver the prepared serum during the facial. We also offer micro-needling on its own. It can be used on the face, neck, chest, arms, hands, legs, abdomen, and back.</p>
        </article>
        <article class="detail" data-reveal>
          <h3>A related visit: the PRP Stem-Cell Facelift</h3>
          <p>If you want a more involved option, we also offer a PRP Stem-Cell Facelift. In that visit we place PRP with hyaluronic acid filler, then finish by micro-needling the remaining serum on the surface of the skin.</p>
        </article>
      </div>
    </section>
    <section class="section">
      <div class="wrap" data-reveal>
        <div class="section-head">
          <p class="eyebrow">Questions</p>
          <h2 class="display">A few things people often ask</h2>
          <hr class="gold-rule">
        </div>
        <div class="faq">
          <div class="faq-item">
            <button type="button" aria-expanded="false">Does this use my own blood? <span>+</span></button>
            <div class="faq-a">Yes. We draw a small sample, prepare the serum in a centrifuge, and apply that preparation to your skin.</div>
          </div>
          <div class="faq-item">
            <button type="button" aria-expanded="false">Is this the same as the PRP Stem-Cell Facelift? <span>+</span></button>
            <div class="faq-a">No. The facial applies the prepared serum with micro-needling. The facelift adds an injectable step with hyaluronic acid filler, then finishes with micro-needling.</div>
          </div>
          <div class="faq-item">
            <button type="button" aria-expanded="false">Do you also use PRP for hair? <span>+</span></button>
            <div class="faq-a">Yes. Dr. Linda also offers PRP stem-cell treatments for hair. We can talk through that option when you visit.</div>
          </div>
          <div class="faq-item">
            <button type="button" aria-expanded="false">Who will I see? <span>+</span></button>
            <div class="faq-a">Dr. Linda oversees and medically supervises the aestheticians who practice micro-needling and PRP applications.</div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section--ivory">
      <div class="wrap" data-reveal>
        <div class="section-head">
          <p class="eyebrow">Is this visit right for you?</p>
          <h2 class="display">Who it is for</h2>
          <hr class="gold-rule">
          <p class="lede">We offer the PRP Stem-Cell Facial to women and men, and for all skin types and tones. Many guests come to us when they want a physician-supervised facial that may help the look of pores, fine lines, wrinkles, stretch marks, or acne scarring. We also offer PRP stem-cell treatments for hair.</p>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="section-head" data-reveal>
          <p class="eyebrow">Your visit</p>
          <h2 class="display">What to expect</h2>
          <hr class="gold-rule">
          <p class="lede">Your time with us follows three clear steps.</p>
        </div>
        <div class="steps">
          <article class="step-card" data-reveal>
            <p class="n">01</p>
            <h3>Draw</h3>
            <p>We begin by drawing a small sample of blood. This is the starting point for the rest of your visit.</p>
          </article>
          <article class="step-card" data-reveal>
            <p class="n">02</p>
            <h3>Spin</h3>
            <p>We place the sample in a centrifuge that prepares the blood serum we will use on your skin.</p>
          </article>
          <article class="step-card" data-reveal>
            <p class="n">03</p>
            <h3>Apply</h3>
            <p>We apply the prepared serum with our micro-needling technique, which creates tiny channels in the skin.</p>
          </article>
        </div>
        {book_block("PRP Stem-Cell Facial", "Book a PRP facial")}
      </div>
    </section>
{related_section("prp")}
"""
    page(
        "prp.html",
        "PRP Stem-Cell Facial | Age-Less Medicine",
        "Learn how a PRP Stem-Cell Facial works at Age-Less Medicine in Tampa: a preparation from your own blood, applied to the skin with micro-needling.",
        "prp",
        body,
    )


def build_hormones():
    body = f"""{page_hero(
        "01 · Longevity and hormones",
        "Hormone optimization",
        "An individualized assessment for women and men, including symptoms, appropriate lab evaluation and a discussion of treatment options.",
        "palms", "",
        '<a class="btn btn--line" href="longevity.html">Longevity and hormones</a>',
        "Book this visit", "Hormone optimization",
    )}
    <section class="section">
      <div class="wrap prose" data-reveal>
        <p>Your first visits with Dr. Linda begin with a careful look at your medical history, blood analysis and other biological markers. From there she creates an individualized program that may include bio-identical hormone care, nutrition and exercise.</p>
        <p>We see this work as a partnership. The goal is a plan that fits your life, reviewed over time as your needs change.</p>
      </div>
    </section>
    <section class="section section--ivory">
      <div class="wrap" data-reveal>
        <div class="section-head">
          <p class="eyebrow">Your visit</p>
          <h2 class="display">What to expect</h2>
          <hr class="gold-rule">
        </div>
        <div class="detail-grid">
          <article class="detail">
            <h3>Your initial visit</h3>
            <ul>
              <li>Extensive hormonal labs</li>
              <li>An EKG</li>
              <li>Body fat analysis</li>
              <li>A nutritional consult</li>
            </ul>
          </article>
          <article class="detail">
            <h3>Ongoing care</h3>
            <p>Follow-up visits are typically scheduled every three to four months. Labs are repeated as needed, or as Dr. Linda recommends.</p>
          </article>
        </div>
        {book_block("Hormone optimization", "Book this visit")}
        <p class="fine fine--block">Care requires an individual medical evaluation. Treatment eligibility, benefits and risks vary.</p>
      </div>
    </section>
{related_section("hormones")}
"""
    page(
        "hormones.html",
        "Hormone Optimization | Age-Less Medicine",
        "Individualized hormone assessment for women and men with Dr. Linda McClintock in Tampa, including appropriate lab evaluation and a discussion of treatment options.",
        "hormones",
        body,
    )


def build_weight():
    body = f"""{page_hero(
        "02 · Metabolic and IV care",
        "Micro-dose GLP-1 weight loss",
        "Physician-guided weight management with individualized dosing discussions, nutrition guidance and follow-up for eligible patients.",
        "apothecary", "",
        '<a class="btn btn--line" href="metabolic.html">Metabolic and IV care</a>',
        "Book a consultation", "Micro-dose GLP-1 weight loss",
    )}
    <section class="section">
      <div class="wrap">
{section_head("How the program works", "A plan that fits your life", "Weight care works best when it is personal. Dr. Linda guides each step and adjusts the plan with you over time.")}
        <div class="steps">
          <article class="step-card" data-reveal>
            <p class="n">01</p>
            <h3>Evaluate</h3>
            <p>A medical evaluation to understand your health, your goals and whether the program is a good fit for you.</p>
          </article>
          <article class="step-card" data-reveal>
            <p class="n">02</p>
            <h3>Personalize</h3>
            <p>Individualized dosing discussions and nutrition guidance that fit your daily life.</p>
          </article>
          <article class="step-card" data-reveal>
            <p class="n">03</p>
            <h3>Follow up</h3>
            <p>Regular follow-up visits to review your progress and adjust the plan with medical guidance.</p>
          </article>
        </div>
      </div>
    </section>
    <section class="section section--ivory">
      <div class="wrap detail-grid">
        <article class="detail" data-reveal>
          <h3>Who it is for</h3>
          <p>Adults who want physician-guided weight management. Eligibility is decided after a medical evaluation.</p>
        </article>
        <article class="detail" data-reveal>
          <h3>Good to know</h3>
          <p>“Micro-dose” is not a standardized FDA-approved dosing regimen. Medication choice and dosing require a medical evaluation.</p>
        </article>
      </div>
      <div class="wrap">
        {book_block("Micro-dose GLP-1 weight loss", "Book a consultation")}
      </div>
    </section>
{related_section("weight")}
"""
    page(
        "weight-loss.html",
        "Micro-dose GLP-1 Weight Loss | Age-Less Medicine",
        "Physician-guided weight management with individualized dosing discussions, nutrition guidance and follow-up, with Dr. Linda McClintock in Tampa.",
        "weight",
        body,
    )


def build_injectables():
    body = f"""{page_hero(
        "03 · Skin and aesthetics",
        "Botox and dermal fillers",
        "Individualized aesthetic consultations with an expert injector, and treatment planning focused on facial balance and your personal preferences.",
        "hallway", "",
        '<a class="btn btn--line" href="aesthetics.html">Skin and aesthetics</a>',
        "Book a consultation", "Botox and dermal fillers",
    )}
    <section class="section">
      <div class="wrap prose" data-reveal>
        <p>We use muscle relaxants and dermal fillers to soften lines and restore volume with a natural look in mind. Dr. Linda trained in Botox, Restylane, Juvederm, and Perlane techniques at the institute of Aesthetics Medicine in Houston, and in contouring with cosmetic fillers at Kapps Aesthetic Training in Toronto.</p>
      </div>
    </section>
    <section class="section section--ivory">
      <div class="wrap detail-grid">
        <article class="detail" data-reveal>
          <h3>Muscle relaxants</h3>
          <p>Botox and Dysport are used on the face, around the eyes, the forehead, and the frown line. A 10 percent discount is applied when two or more treatment areas are treated. The amount needed can be higher for men.</p>
        </article>
        <article class="detail" data-reveal>
          <h3>Dermal fillers</h3>
          <p>We offer Restylane, Juvederm, Radiesse, and Restylane Lift, previously known as Perlane. These treatments are used to restore volume and fullness and to address moderate to severe facial wrinkles and folds.</p>
        </article>
        <article class="detail" data-reveal>
          <h3>Liquid facelift</h3>
          <p>Dr. Linda was among the first physicians in the area to lift the mid-face with Restylane Lift. This approach is also known as a Voluma-lift or liquid facelift, and may include Radiesse as well.</p>
        </article>
        <article class="detail" data-reveal>
          <h3>A note on comfort</h3>
          <p>Some filler visits use an anesthesia cream. For lip enhancement with Juvederm, a dental block can be performed so the visit is more comfortable.</p>
        </article>
      </div>
    </section>
    <section class="section">
      <div class="wrap prose" data-reveal>
        <p class="eyebrow">Is this visit right for you?</p>
        <h2 class="display">Who it is for</h2>
        <hr class="gold-rule">
        <p>Dr. Linda offers these treatments to women and men who want to soften lines and restore volume with a natural look in mind. The amount needed can be higher for men. A 10 percent discount is applied when two or more muscle-relaxant areas are treated.</p>
      </div>
    </section>
    <section class="section section--ivory">
      <div class="wrap" data-reveal>
        <div class="section-head">
          <p class="eyebrow">Your visit</p>
          <h2 class="display">What to expect</h2>
          <hr class="gold-rule">
          <p class="lede">Some filler visits use an anesthesia cream. For lip enhancement with Juvederm, a dental block can be performed so the visit is more comfortable.</p>
        </div>
        {book_block("Botox and dermal fillers", "Book a consultation")}
      </div>
    </section>
{related_section("injectables")}
"""
    page(
        "injectables.html",
        "Botox and Dermal Fillers | Age-Less Medicine",
        "Botox, Dysport, Restylane, Juvederm, Radiesse, and liquid facelift treatments with Dr. Linda McClintock at Age-Less Medicine in Tampa.",
        "injectables",
        body,
    )


def build_skin():
    body = f"""{page_hero(
        "03 · Skin and aesthetics",
        "Skin and facials",
        "From our PRP Stem-Cell Facial to peels and medical-grade skin care, our skin treatments are chosen and supervised by Dr. Linda.",
        "hero-spa", "",
        '<a class="btn btn--line" href="prp.html">The PRP facial</a>',
        "Book a skin visit", "Skin and facials",
    )}
    <section class="section">
      <div class="wrap detail-grid">
        <article class="detail" data-reveal>
          <h3>PRP Stem-Cell Facial</h3>
          <p>A preparation from your own blood, applied with micro-needling. It is designed to support the look of pores, fine lines, and wrinkles, and may help the appearance of stretch marks and acne scarring.</p>
          <p style="margin-top:0.8rem"><a href="prp.html">Learn more about the PRP facial</a></p>
        </article>
        <article class="detail" data-reveal>
          <h3>Micro-needling</h3>
          <p>Tiny channels in the skin that can be used on the face, neck, chest, and other areas of the body. We also use this technique to apply PRP serum.</p>
        </article>
        <article class="detail" data-reveal>
          <h3>Diamond Tome microdermabrasion</h3>
          <p>A gentle resurfacing treatment using natural diamond chips. A single session is about 45 minutes, followed by a 15-minute hydrating facial. A series of five to ten sessions is often recommended.</p>
        </article>
        <article class="detail" data-reveal>
          <h3>Dermawave</h3>
          <p>Ultrasonic skin therapy with several protocols, used as a companion to Diamond Tome microdermabrasion. Combined series visits are available.</p>
        </article>
        <article class="detail" data-reveal>
          <h3>Cosmelan</h3>
          <p>A depigmentation treatment adapted to your skin. The package includes two microdermabrasion visits, a mask worn for seven to eight hours, and 30 days of home care.</p>
        </article>
        <article class="detail" data-reveal>
          <h3>Fire and Ice Facial</h3>
          <p>An intensive clinical facial that pairs an Intensive Resurfacing Masque with a soothing Rejuvenating Masque, along with selected serums and creams.</p>
        </article>
      </div>
    </section>
{shop_band(note="Dr. Linda also selects other medical grade lines for our shelves. Ask us at your visit.")}    <section class="section">
      <div class="wrap prose" data-reveal>
        <p class="eyebrow">Is this visit right for you?</p>
        <h2 class="display">Who it is for</h2>
        <hr class="gold-rule">
        <p>Our skin treatments are chosen and supervised by Dr. Linda. We see women and men, and we offer the PRP Stem-Cell Facial for all skin types and tones.</p>
      </div>
    </section>
    <section class="section section--ivory">
      <div class="wrap" data-reveal>
        <div class="section-head">
          <p class="eyebrow">Your visit</p>
          <h2 class="display">What to expect</h2>
          <hr class="gold-rule">
          <p class="lede">Your visit depends on the treatment you choose. A Diamond Tome session is about 45 minutes, followed by a 15-minute hydrating facial. Cosmelan includes two microdermabrasion visits, a mask worn for seven to eight hours, and 30 days of home care. We will help you choose a plan when you come in.</p>
        </div>
        {book_block("Skin and facials", "Book a skin visit")}
      </div>
    </section>
{related_section("skin")}
"""
    page(
        "skin.html",
        "Skin and Facials | Age-Less Medicine",
        "PRP facials, micro-needling, Diamond Tome microdermabrasion, Dermawave, Cosmelan, and Fire and Ice facials at Age-Less Medicine in Tampa.",
        "skin",
        body,
    )


def build_club():
    body = f"""{page_hero(
        "Membership",
        "The Beauty Club",
        "Dr. Linda’s Age-less Savings Account is a simple way to invest in your care each month and build Age-less Bucks toward our products and services.",
        "apothecary", "",
        '<a class="btn btn--line" href="site/index.html">Visit the shop</a>',
        "Ask about joining", "Beauty Club",
    )}
    <section class="section">
      <div class="wrap prose" data-reveal>
        <p>Most of us plan for the years ahead. The Beauty Club is a way to plan for your skin, your health, and the treatments you already love. Each month you add to your Age-less Savings Account. Those funds, plus Age-less Bucks, can be used toward vitamins, nutrients, skin care, and services at Age-Less Medicine.</p>
        <p>There are three levels. Retail discounts begin at 8 percent for Bronze and rise as your monthly amount increases.</p>
      </div>
    </section>
    <section class="section section--ivory">
      <div class="wrap">
        <div class="tiers">
          <article class="tier" data-reveal>
            <h3>Bronze</h3>
            <p class="price">$<span data-count="99">99</span> <span>a month</span></p>
            <ul>
              <li>Service of your choice</li>
              <li>8% off retail products</li>
              <li>Each quarter you invest $297</li>
              <li>Plus $65 in Age-Less Bucks</li>
              <li>$362 to spend on the service of your choice</li>
              <li>22% bonus back</li>
            </ul>
          </article>
          <article class="tier" data-reveal>
            <h3>Silver</h3>
            <p class="price">$<span data-count="125">125</span> <span>a month</span></p>
            <ul>
              <li>Service of your choice</li>
              <li>10% off retail products</li>
              <li>Each quarter you invest $375</li>
              <li>Plus $110 in Age-Less Bucks</li>
              <li>$485 to spend on the service of your choice</li>
              <li>29% bonus back</li>
            </ul>
          </article>
          <article class="tier tier--gold" data-reveal>
            <h3>Gold</h3>
            <p class="price">$<span data-count="200">200</span> <span>a month</span></p>
            <ul>
              <li>Service of your choice</li>
              <li>12% off retail products</li>
              <li>Each quarter you invest $600</li>
              <li>Plus $185 in Age-Less Bucks</li>
              <li>$785 to spend on the service of your choice</li>
              <li>31% bonus back</li>
            </ul>
          </article>
        </div>
        <p class="club-note">Accounts are billed on the first of every month. You may cancel at any time with 30 days of written notice.</p>
        <div class="btn-row" style="margin-top:1.5rem">
          <a class="btn btn--gold" href="#book" data-open-booking data-treatment="Beauty Club">Ask about joining</a>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="section-head" data-reveal>
          <p class="eyebrow">From our dispensary</p>
          <h2 class="display">Shop selected supplements</h2>
          <hr class="gold-rule">
          <p class="lede">Dr. Linda evaluates every supplement we offer. Age-Less Greens is in our online shop. For the others, ask us at your visit or give us a call.</p>
        </div>
{supplements_grid()}
      </div>
    </section>
"""
    page(
        "beauty-club.html",
        "Beauty Club | Age-Less Medicine",
        "Join the Age-less Savings Account at Age-Less Medicine. Monthly membership starts at $99, with retail discounts beginning at 8 percent.",
        "club",
        body,
    )


def build_about():
    body = f"""{page_hero(
        "Our physician",
        "Dr. Linda McClintock",
        "Medical director and president of Age-Less Medicine, and a familiar health voice in Tampa Bay.",
        "lounge", "",
        '<a class="btn btn--line" href="contact.html">Visit the office</a>',
        media='<figure class="p-hero-media p-hero-portrait"><img src="images/clinic/dr-linda.jpg" alt="Dr. Linda McClintock" width="302" height="319" fetchpriority="high" decoding="sync"></figure>',
    )}
{welcome_section(story_link=False, photo=False)}
    <section class="section">
      <div class="wrap about-grid about-grid--text">
        <div class="prose" data-reveal>
          <p>Dr. Linda founded Age-Less Medicine in 2006. She leads the practice by hand and supervises every part of the care we deliver, from hormone and weight programs to injectables and skin treatments.</p>
          <p>For more than a decade she appeared as a health correspondent for Bay News 9. She is a member of the American Academy of Anti-Aging Medicine and the Hillsborough County Medical Association, and she completed in-depth age management training at Cenegenics Medical Institute.</p>
          <p>She trained in Botox, Restylane, Juvederm, and Perlane techniques at the institute of Aesthetics Medicine in Houston, and in contouring with cosmetic fillers at Kapps Aesthetic Training in Toronto. She is fluent in Spanish.</p>
        </div>
      </div>
    </section>
    <section class="section section--ivory">
      <div class="wrap prose" data-reveal>
        <h2 class="display">A longer view of her work</h2>
        <hr class="gold-rule">
        <ul class="cred-list">
          <li>From 1994 to 1998 she served as medical director of Health Ease, a medical plan owned by Tampa General Hospital, and later as its chief executive officer.</li>
          <li>From 1993 to 1994 she was associate medical director for Humana Health Plan, which at the time was Tampa Bay’s largest health plan.</li>
          <li>From 1986 to 1993 she practiced as a pediatrician and served as a clinical instructor of family practice at the University of Texas Medical School in Houston, where she earned an Excellence in Teaching Award for 1987-1988.</li>
          <li>She has been active in Tampa civic life, including founding Friends of the Tampa Police Department.</li>
        </ul>
        <div class="btn-row" style="margin-top:1.8rem">
          <a class="btn btn--gold" href="#book" data-open-booking>Book a visit with us</a>
          <a class="btn btn--line" href="contact.html">Get directions</a>
        </div>
      </div>
    </section>
"""
    page(
        "about.html",
        "About Dr. Linda McClintock | Age-Less Medicine",
        "Meet Dr. Linda McClintock, medical director of Age-Less Medicine in Tampa and a longtime Bay News 9 health correspondent.",
        "about",
        body,
    )


def build_contact():
    body = f"""{page_hero(
        "One Urban Centre",
        "Visit our Tampa office",
        "We would be glad to see you in Suite 110. Call, write, or send a visit request and we will help you find a time.",
        "interior-cream", "",
        '<a class="btn btn--line" href="tel:+18132864404">Call (813) 286-4404</a>',
    )}
    <section class="section">
      <div class="wrap visit-grid">
        <div class="visit-card" data-reveal>
          <h2 class="display">How to find us</h2>
          <hr class="gold-rule">
          <p>One Urban Centre<br>4830 West Kennedy Boulevard, Suite 110<br>Tampa, Florida 33609</p>
          <h3>Call or write</h3>
          <p><a href="tel:+18132864404">(813) 286-4404</a><br>Fax (813) 286-4402<br>
          <a href="mailto:info@age-lessmedicine.com">info@age-lessmedicine.com</a></p>
          <h3>Hours</h3>
          <table class="hours">
            <tbody>
              <tr><td>Monday through Thursday</td><td>10:00 a.m. to 5:00 p.m.</td></tr>
              <tr><td>Friday through Sunday</td><td>Closed</td></tr>
            </tbody>
          </table>
          <h3>A note on payment</h3>
          <p>We do not accept insurance. Some medical spending accounts may be accepted. We welcome cash, debit, Visa, Mastercard, and American Express.</p>
          <div class="btn-row" style="margin-top:1.5rem">
            <a class="btn btn--gold" href="#book" data-open-booking>Book a visit</a>
            <a class="btn btn--line" href="mailto:info@age-lessmedicine.com">Email us</a>
            <a class="btn btn--line" href="https://maps.google.com/?q=4830+West+Kennedy+Boulevard+Suite+110+Tampa+FL+33609" rel="noopener noreferrer" target="_blank">Open directions</a>
          </div>
        </div>
        <div class="visit-visual" data-reveal>
          <figure class="building-photo">
            <img src="images/clinic/urban-centre.jpg" alt="Urban Centre on West Kennedy Boulevard in Tampa" width="322" height="220" loading="lazy" decoding="async">
            <figcaption>One Urban Centre, West Kennedy Boulevard</figcaption>
          </figure>
          <div class="map-frame">
            <iframe title="Map of Age-Less Medicine in Tampa" src="https://maps.google.com/maps?q=4830+West+Kennedy+Boulevard+Suite+110+Tampa+FL+33609&amp;z=16&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </div>
    </section>
"""
    page(
        "contact.html",
        "Visit Us | Age-Less Medicine",
        "Visit Age-Less Medicine at 4830 West Kennedy Boulevard, Suite 110, Tampa. Open Monday through Thursday, 10:00 a.m. to 5:00 p.m.",
        "contact",
        body,
    )


def build_404():
    body = """    <section class="not-found">
      <div>
        <p class="eyebrow">Page not found</p>
        <h1 class="display">Let us take you back</h1>
        <hr class="gold-rule" style="margin-left:auto;margin-right:auto">
        <p class="lede" style="margin:0 auto 1.5rem">That page is not in our site. You can return home or request a visit and we will help from there.</p>
        <div class="btn-row" style="justify-content:center">
          <a class="btn btn--gold" href="index.html">Back to home</a>
          <a class="btn btn--line" href="#book" data-open-booking>Book a visit</a>
        </div>
      </div>
    </section>
"""
    page(
        "404.html",
        "Page not found | Age-Less Medicine",
        "The page you were looking for is not available.",
        "home",
        body,
        solid=True,
    )


if __name__ == "__main__":
    build_es_js()
    build_home()
    build_longevity()
    build_metabolic()
    build_aesthetics()
    build_prp()
    build_hormones()
    build_weight()
    build_injectables()
    build_skin()
    build_club()
    build_about()
    build_contact()
    build_404()
    print("all pages built")
