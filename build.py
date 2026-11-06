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

TREATMENTS = [
    ("hormones.html", "Hormone and age management", "hormones"),
    ("weight-loss.html", "Medical weight loss", "weight"),
    ("injectables.html", "Injectables", "injectables"),
    ("skin.html", "Skin and facials", "skin"),
    ("prp.html", "PRP Stem-Cell Facial", "prp"),
]


def nowidow(text):
    text = text.replace("Stem-Cell", "Stem&#8209;Cell")
    if " " not in text:
        return text
    head, tail = text.rsplit(" ", 1)
    return f"{head}&nbsp;{tail}"


def cur(page, name):
    return ' aria-current="page"' if page == name else ""


def header(active):
    treat_current = ' aria-current="page"' if active in {t[2] for t in TREATMENTS} else ""
    links = "\n".join(
        f'            <a href="{href}"{cur(active, key)}>{label}</a>'
        for href, label, key in TREATMENTS
    )
    return f"""  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="index.html" aria-label="Age-Less Medicine home">
        {MARK}
        <span class="brand-text">
          <span class="brand-name">Age-Less</span>
          <span class="brand-sub">Medicine</span>
        </span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-label="Open menu"><span></span></button>
      <nav class="nav" aria-label="Primary">
        <div class="has-sub">
          <button class="nav-label" type="button" aria-expanded="false"{treat_current}>Treatments</button>
          <div class="subnav">
{links}
          </div>
        </div>
        <a href="about.html"{cur(active, "about")}>The doctor</a>
        <a href="beauty-club.html"{cur(active, "club")}>Beauty Club</a>
        <a href="index.html#find-treatment" data-open-quiz>Find your treatment</a>
        <a href="https://agelessbydrlinda.com/shop/" rel="noopener noreferrer" target="_blank">Shop</a>
        <a href="contact.html"{cur(active, "contact")}>Visit</a>
        <a class="btn btn--gold" href="#book" data-open-booking>Book a visit</a>
      </nav>
    </div>
  </header>"""


def footer():
    return f"""  <footer class="site-footer">
    <div class="wrap footer-grid">
      <div>
        <a class="brand" href="index.html">
          {MARK}
          <span class="brand-text"><span class="brand-name">Age-Less</span><span class="brand-sub">Medicine</span></span>
        </a>
        <p>Linda McClintock, M.D.<br>Medical Director and President</p>
        <p>One Urban Centre<br>4830 West Kennedy Boulevard, Suite 110<br>Tampa, Florida 33609</p>
      </div>
      <div>
        <h2>Visit</h2>
        <p>Monday through Thursday<br>10:00 a.m. to 5:00 p.m.<br>Friday through Sunday, closed</p>
        <p><a href="tel:+18132864404">(813) 286-4404</a><br>
        <a href="mailto:info@age-lessmedicine.com">info@age-lessmedicine.com</a></p>
      </div>
      <div>
        <h2>Explore</h2>
        <ul class="footer-list">
          <li><a href="about.html">About Dr. Linda</a></li>
          <li><a href="hormones.html">Hormone and age management</a></li>
          <li><a href="weight-loss.html">Medical weight loss</a></li>
          <li><a href="injectables.html">Injectables</a></li>
          <li><a href="skin.html">Skin and facials</a></li>
          <li><a href="prp.html">PRP Stem-Cell Facial</a></li>
          <li><a href="beauty-club.html">Beauty Club</a></li>
          <li><a href="index.html#find-treatment" data-open-quiz>Find your treatment</a></li>
          <li><a href="contact.html">Contact and visit</a></li>
        </ul>
      </div>
      <div>
        <h2>Connect</h2>
        <ul class="footer-list">
          <li><a href="https://agelessbydrlinda.com/shop/" rel="noopener noreferrer" target="_blank">Online shop</a></li>
          <li><a href="https://www.facebook.com/296291637095921" rel="noopener noreferrer" target="_blank">Facebook</a></li>
          <li><a href="https://maps.google.com/?q=4830+West+Kennedy+Boulevard+Suite+110+Tampa+FL+33609" rel="noopener noreferrer" target="_blank">Directions</a></li>
          <li><a href="#book" data-open-booking>Book a visit</a></li>
        </ul>
      </div>
    </div>
    <div class="wrap legal">
      <p>Concept by Argus AI.</p>
      <p>&copy; Age-Less Medicine. Care for women and men in Tampa.</p>
    </div>
  </footer>"""


def book_bar():
    return """  <div class="book-bar" role="region" aria-label="Quick booking">
    <a class="btn btn--ghost" href="tel:+18132864404">Call</a>
    <a class="btn btn--gold" href="#book" data-open-booking>Book a visit</a>
  </div>"""


def modal():
    options = "\n".join(
        f'            <option value="{label}">{label}</option>'
        for _, label, _ in [
            ("", "Consultation", ""),
            *TREATMENTS,
            ("", "Beauty Club", ""),
            ("", "I am not sure yet", ""),
        ]
    )
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
        ("skin.html", "images/stock/still-life", "Skin and facials", "Micro-needling, Diamond Tome, Cosmelan, Fire and Ice, and medical grade peels supervised by Dr. Linda."),
        ("injectables.html", "images/stock/hallway", "Injectables", "Botox, Dysport, Restylane, Juvederm, Radiesse, and liquid facelift treatments with a natural look in mind."),
    ],
    "hormones": [
        ("weight-loss.html", "images/stock/interior-cream", "Medical weight loss", "Our Couture Lifestyle Modification program is a three-step, medically supervised plan tailored to your life."),
        ("beauty-club.html", "images/stock/palms", "Beauty Club", "A monthly Age-less Savings Account that builds Age-less Bucks toward products and services."),
    ],
    "weight": [
        ("hormones.html", "images/stock/lounge", "Hormone and age management", "An individualized plan based on your history, labs, and goals, with attention to hormones, nutrition, and exercise."),
        ("beauty-club.html", "images/stock/palms", "Beauty Club", "A monthly Age-less Savings Account that builds Age-less Bucks toward products and services."),
    ],
    "injectables": [
        ("skin.html", "images/stock/still-life", "Skin and facials", "PRP facials, micro-needling, peels, and medical grade products chosen by Dr. Linda."),
        ("prp.html", "images/stock/palms", "PRP Stem-Cell Facial", "A preparation from your own blood, applied with micro-needling."),
    ],
    "skin": [
        ("prp.html", "images/stock/palms", "PRP Stem-Cell Facial", "A preparation from your own blood, applied with micro-needling."),
        ("injectables.html", "images/stock/hallway", "Injectables", "Muscle relaxants and dermal fillers, offered with a natural look in mind."),
    ],
}


def related_section(key):
    cards = ""
    for href, image, title, lede in RELATED[key]:
        cards += f"""          <a class="related-card" href="{href}" data-reveal>
            <picture>
              <source type="image/webp" srcset="{image}.webp">
              <img src="{image}.jpg" alt="" width="900" height="600">
            </picture>
            <div>
              <h3>{title}</h3>
              <p>{lede}</p>
              <span class="treat-more">Explore this visit</span>
            </div>
          </a>
"""
    return f"""    <section class="section section--ivory related">
      <div class="wrap">
        <div class="section-head" data-reveal>
          <p class="eyebrow">Continue exploring</p>
          <h2 class="display">You might also like</h2>
          <hr class="gold-rule">
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


def page(filename, title, description, active, body, solid=False):
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <meta name="view-transition" content="same-origin">
  <title>{title}</title>
  <style>html,body{{background:#faf6ee}}</style>
  <meta name="description" content="{description}">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Outfit:wght@300;400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
  <noscript><style>[data-reveal]{{opacity:1;transform:none}}</style></noscript>
</head>
<body{" class='has-solid-header'" if solid else ""}>
  <a class="skip" href="#main">Skip to content</a>
{header(active)}
  <main id="main">
{body}
  </main>
{footer()}
{book_bar()}
{modal()}
{quiz_modal()}
  <script src="js/main.js" defer></script>
</body>
</html>
"""
    # If solid header pages without a hero, mark header as solid via a class on body
    if solid:
        html = html.replace('<header class="site-header">', '<header class="site-header is-solid">')
    html = re.sub(
        r'(<(?:h1|h2) class="display"[^>]*>)([^<]+)(</(?:h1|h2)>)',
        lambda m: m.group(1) + nowidow(m.group(2)) + m.group(3),
        html,
    )
    (ROOT / filename).write_text(html)
    print("wrote", filename, len(html))


def page_hero(eyebrow, heading, lede, image, image_alt, extra_btn=""):
    return f"""    <section class="page-hero">
      <div class="hero-media" aria-hidden="true">
        <picture>
          <source type="image/webp" srcset="{image}.webp">
          <img src="{image}.jpg" alt="" width="1800" height="1200">
        </picture>
      </div>
      <div class="hero-overlay" aria-hidden="true"></div>
      <div class="hero-copy">
        <p class="eyebrow">{eyebrow}</p>
        <h1 class="display">{heading}</h1>
        <hr class="gold-rule">
        <p class="lede">{lede}</p>
        <div class="btn-row">
          <a class="btn btn--gold" href="#book" data-open-booking>Book a visit</a>
          {extra_btn}
        </div>
      </div>
    </section>"""


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
    return cards + cards


def build_home():
    body = f"""    <section class="hero" data-hero-video>
      <div class="hero-media" aria-hidden="true">
        <video class="hero-video" muted loop playsinline preload="none" poster="images/stock/hero-video-poster.jpg"></video>
        <picture class="hero-fallback">
          <source type="image/webp" srcset="images/stock/hero-video-poster.webp">
          <img src="images/stock/hero-video-poster.jpg" alt="" width="1920" height="1080">
        </picture>
      </div>
      <div class="hero-overlay" aria-hidden="true"></div>
      <div class="hero-copy">
        <p class="eyebrow">Tampa  ·  Founded 2006</p>
        <h1 class="display">Aging is not optional, but youthfulness is.</h1>
        <hr class="gold-rule">
        <p class="lede">We opened Age-Less Medicine so you can look and feel your very best. Dr. Linda McClintock leads our Tampa practice in age management, bio-identical hormone care, medically supervised weight loss, and aesthetic skin treatments for women and men.</p>
        <div class="btn-row">
          <a class="btn btn--gold" href="#book" data-open-booking>Book a visit</a>
          <a class="btn btn--ghost" href="#find-treatment" data-open-quiz>Find your treatment</a>
        </div>
      </div>
    </section>

    <section class="intro-strip section--tight">
      <div class="wrap intro-grid" data-reveal>
        <p class="intro-quote">We believe every person has a chronological age and a biological age.</p>
        <div class="stat"><dt>Our beginning</dt><dd>Founded in 2006 by Linda McClintock, M.D.</dd></div>
        <div class="stat"><dt>Our home</dt><dd>Suite 110, One Urban Centre, Westshore</dd></div>
        <div class="stat"><dt>Who we see</dt><dd>Thoughtful care for women and men</dd></div>
      </div>
    </section>

    <section class="section section--ivory" id="treatments">
      <div class="wrap">
        <div class="section-head" data-reveal>
          <p class="eyebrow">How we can help</p>
          <h2 class="display">Care from the inside out</h2>
          <hr class="gold-rule">
          <p class="lede">Beauty is not only skin deep. The way you feel, eat, rest, and care for your hormones can shape how you age. We offer medical weight management, skin rejuvenation, and age management through bio-identical hormone care.</p>
        </div>
        <div class="treat-grid">
          <a class="treat-card" href="hormones.html" data-reveal>
            <picture><source type="image/webp" srcset="images/stock/lounge.webp"><img src="images/stock/lounge.jpg" alt="A calm sitting room with cream chairs and greenery" width="1800" height="1350"></picture>
            <div class="treat-body">
              <h3>Hormone and age management</h3>
              <p>An individualized plan based on your history, labs, and goals, with attention to hormones, nutrition, and exercise.</p>
              <span class="treat-more">Explore this visit</span>
            </div>
          </a>
          <a class="treat-card" href="weight-loss.html" data-reveal>
            <picture><source type="image/webp" srcset="images/stock/interior-cream.webp"><img src="images/stock/interior-cream.jpg" alt="A cream-toned sitting room with linen textures" width="1800" height="1318"></picture>
            <div class="treat-body">
              <h3>Medical weight loss</h3>
              <p>Our Couture Lifestyle Modification program is a three-step, medically supervised plan tailored to your life, not a cookie-cutter diet.</p>
              <span class="treat-more">See how it works</span>
            </div>
          </a>
          <a class="treat-card" href="injectables.html" data-reveal>
            <picture><source type="image/webp" srcset="images/stock/hallway.webp"><img src="images/stock/hallway.jpg" alt="A quiet interior with a cream mirror" width="1600" height="1048"></picture>
            <div class="treat-body">
              <h3>Injectables</h3>
              <p>Dr. Linda offers Botox, Dysport, Restylane, Juvederm, Radiesse, and liquid facelift treatments with an eye toward a natural look.</p>
              <span class="treat-more">View injectables</span>
            </div>
          </a>
          <a class="treat-card" href="skin.html" data-reveal>
            <picture><source type="image/webp" srcset="images/stock/still-life.webp"><img src="images/stock/still-life.jpg" alt="A linen towel, bottle, candle, and tulips" width="1600" height="1066"></picture>
            <div class="treat-body">
              <h3>Skin and facials</h3>
              <p>PRP facials, micro-needling, Diamond Tome microdermabrasion, Dermawave, Cosmelan, Fire and Ice, and medical grade peels.</p>
              <span class="treat-more">Browse skin care</span>
            </div>
          </a>
        </div>
      </div>
    </section>


    <section class="section" id="find-treatment">
      <div class="wrap quiz-intro" data-reveal>
        <p class="eyebrow">A simple starting point</p>
        <h2 class="display">Find your treatment</h2>
        <hr class="gold-rule">
        <p class="lede">Answer two short questions about what brings you in. We will point you toward a visit that may fit. No medical details are collected, and nothing is sent.</p>
        <div class="btn-row" style="margin-top:1.5rem">
          <a class="btn btn--gold" href="#find-treatment" data-open-quiz>Find your treatment</a>
        </div>
      </div>
    </section>

    <section class="section" data-reveal>
      <div class="wrap">
        <article class="signature">
          <div class="signature-media">
            <picture>
              <source type="image/webp" srcset="images/stock/palms.webp">
              <img src="images/stock/palms.jpg" alt="Dark green palm leaves" width="1800" height="1200">
            </picture>
          </div>
          <div class="signature-copy">
            <p class="eyebrow">Signature treatment</p>
            <h2 class="display">The PRP Stem-Cell Facial</h2>
            <hr class="gold-rule">
            <p>A PRP facial uses a preparation made from a small sample of your own blood. We draw the sample, prepare the serum in a centrifuge, and apply it to your skin with micro-needling.</p>
            <div class="btn-row" style="margin-top:1.4rem">
              <a class="btn btn--gold" href="prp.html">Learn about the PRP facial</a>
              <a class="btn btn--ghost" href="#book" data-open-booking data-treatment="PRP Stem-Cell Facial">Book this visit</a>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="section section--ivory">
      <div class="wrap about-grid">
        <div class="portrait-frame" data-reveal>
          <img src="images/clinic/dr-linda.jpg" alt="Dr. Linda McClintock, medical director of Age-Less Medicine" width="302" height="319">
        </div>
        <div data-reveal>
          <p class="eyebrow">Medical director</p>
          <h2 class="display">Meet Dr. Linda McClintock</h2>
          <hr class="gold-rule">
          <p class="lede">Dr. Linda is our medical director and president. She founded Age-Less Medicine in 2006 around quality-of-life medicine: helping people look and feel their very best.</p>
          <p>For more than a decade she appeared as a health correspondent for Bay News 9. She oversees every part of your care and medically supervises our aestheticians. She is fluent in Spanish, and we welcome patients in English and Spanish.</p>
          <div class="btn-row" style="margin-top:1.4rem">
            <a class="btn btn--line" href="about.html">Read Dr. Linda’s story</a>
          </div>
        </div>
      </div>
    </section>

    <section class="reviews section">
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

    <section class="section section--ivory">
      <div class="wrap">
        <div class="section-head" data-reveal>
          <p class="eyebrow">Membership</p>
          <h2 class="display">The Beauty Club</h2>
          <hr class="gold-rule">
          <p class="lede">Dr. Linda’s Age-less Savings Account lets you set aside a monthly amount and build Age-less Bucks toward our products and services. Retail discounts begin at 8 percent for a Bronze account.</p>
        </div>
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

    <section class="section" id="visit">
      <div class="wrap visit-grid">
        <div data-reveal>
          <p class="eyebrow">Westshore, Tampa</p>
          <h2 class="display">Come see us</h2>
          <hr class="gold-rule">
          <p>One Urban Centre<br>4830 West Kennedy Boulevard, Suite 110<br>Tampa, Florida 33609</p>
          <p style="margin-top:1rem"><a href="tel:+18132864404">(813) 286-4404</a><br>
          <a href="mailto:info@age-lessmedicine.com">info@age-lessmedicine.com</a></p>
          <p style="margin-top:1rem">Monday through Thursday, 10:00 a.m. to 5:00 p.m.<br>Friday through Sunday, closed</p>
          <div class="btn-row" style="margin-top:1.5rem">
            <a class="btn btn--gold" href="#book" data-open-booking>Book a visit</a>
            <a class="btn btn--line" href="tel:+18132864404">Call</a>
            <a class="btn btn--line" href="https://maps.google.com/?q=4830+West+Kennedy+Boulevard+Suite+110+Tampa+FL+33609" rel="noopener noreferrer" target="_blank">Directions</a>
          </div>
        </div>
        <div class="visit-visual" data-reveal>
          <figure class="building-photo">
            <img src="images/clinic/urban-centre.jpg" alt="The glass towers of Urban Centre on West Kennedy Boulevard in Tampa" width="322" height="220">
            <figcaption>One Urban Centre, 4830 West Kennedy Boulevard</figcaption>
          </figure>
        </div>
      </div>
    </section>
"""
    page(
        "index.html",
        "Age-Less Medicine | Tampa Age and Aesthetic Care",
        "Age-Less Medicine in Tampa offers physician-led age management, bio-identical hormone care, medically supervised weight loss, and aesthetic skin treatments with Dr. Linda McClintock.",
        "home",
        body,
    )


def build_prp():
    body = f"""{page_hero(
        "Skin care",
        "The PRP Stem-Cell Facial",
        "A facial that uses your own blood's natural growth factors, paired with micro-needling, to refresh and renew your skin.",
        "images/stock/palms",
        "",
        '<a class="btn btn--ghost" href="skin.html">See all skin treatments</a>',
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
        "Inside out",
        "Hormone and age management",
        "Age management, for us, is the science of youthful aging: helping you maintain health and energy for as long as possible.",
        "images/stock/lounge",
        "",
        '<a class="btn btn--ghost" href="weight-loss.html">Explore weight management</a>',
    )}
    <section class="section">
      <div class="wrap prose" data-reveal>
        <p>Your first visits with Dr. Linda begin with a careful look at your medical history, blood analysis, and other biological markers. From there she creates an individualized program that may include bio-identical hormone care, nutrition, and exercise.</p>
        <p>We see this work as a partnership. The goal is a plan that fits your life, reviewed over time as your needs change.</p>
      </div>
    </section>
    <section class="section">
      <div class="wrap prose" data-reveal>
        <h2 class="display">Specialized testing</h2>
        <hr class="gold-rule">
        <p>When it is helpful, we also offer specialized testing. Spectracell analysis looks at selected vitamins, minerals, antioxidants, and other micronutrients inside your white blood cells. ALCAT testing can identify foods that may be a problem for you. After your results return, you meet with Dr. Linda, and you may also meet with our nutritionist.</p>
      </div>
    </section>
    <section class="section section--ivory">
      <div class="wrap prose" data-reveal>
        <p class="eyebrow">Is this visit right for you?</p>
        <h2 class="display">Who it is for</h2>
        <hr class="gold-rule">
        <p>We welcome women and men who want a thoughtful look at how they age and how they feel. Dr. Linda creates an individualized program that may include bio-identical hormone care, nutrition, and exercise, based on your history, labs, and goals.</p>
      </div>
    </section>
    <section class="section">
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
        {book_block("Hormone and age management", "Book this visit")}
      </div>
    </section>
{related_section("hormones")}
"""
    page(
        "hormones.html",
        "Hormone and Age Management | Age-Less Medicine",
        "Bio-identical hormone care and age management with Dr. Linda McClintock in Tampa, including labs, EKG, body fat analysis, and a nutritional consult.",
        "hormones",
        body,
    )


def build_weight():
    body = f"""{page_hero(
        "Couture Lifestyle Modification",
        "Medical weight loss",
        "We personally tailor each plan to your dietary and lifestyle needs. No more cookie-cutter diets.",
        "images/stock/interior-cream",
        "",
        '<a class="btn btn--ghost" href="hormones.html">Hormone and age care</a>',
    )}
    <section class="section">
      <div class="wrap prose" data-reveal>
        <p>Our medically supervised weight program is a three-step plan. Dr. Linda designed it to give you knowledge, support, and a pace that can be maintained. Appetite suppressants, vitamins, and minerals may be included when they are medically appropriate. In some cases, hormone care may also be part of understanding what led to weight gain.</p>
      </div>
    </section>
    <section class="section section--ivory">
      <div class="wrap">
        <div class="steps">
          <article class="step-card" data-reveal>
            <p class="n">01</p>
            <h3>Acute phase</h3>
            <p>A carbohydrate and calorie-restricted diet begins this stage. We may add appetite suppressants, vitamins, and minerals when they are appropriate.</p>
          </article>
          <article class="step-card" data-reveal>
            <p class="n">02</p>
            <h3>Transition</h3>
            <p>Medication is often decreased, some carbohydrates return, and we begin to encourage regular exercise.</p>
          </article>
          <article class="step-card" data-reveal>
            <p class="n">03</p>
            <h3>Maintenance</h3>
            <p>The final stage is about support and guidance so you can stay with the habits that fit your life.</p>
          </article>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap detail-grid">
        <article class="detail" data-reveal>
          <h3>Your first visit</h3>
          <ul>
            <li>Labs</li>
            <li>An EKG</li>
            <li>Vitamin injections</li>
            <li>A thorough nutritional consult</li>
          </ul>
        </article>
        <article class="detail" data-reveal>
          <h3>Weekly visits</h3>
          <p>Follow-up visits typically include a weigh-in, injections, and medication when it is needed.</p>
        </article>
      </div>
    </section>
    <section class="section section--ivory">
      <div class="wrap prose" data-reveal>
        <p class="eyebrow">Is this visit right for you?</p>
        <h2 class="display">Who it is for</h2>
        <hr class="gold-rule">
        <p>This program is for people who want a medically supervised plan tailored to their dietary and lifestyle needs, not a cookie-cutter diet. Appetite suppressants, vitamins, and minerals may be included when they are medically appropriate. In some cases, hormone care may also be part of understanding what led to weight gain.</p>
      </div>
    </section>
    <section class="section">
      <div class="wrap" data-reveal>
        <div class="section-head">
          <p class="eyebrow">Your visit</p>
          <h2 class="display">What to expect</h2>
          <hr class="gold-rule">
          <p class="lede">Your first visit typically includes labs, an EKG, vitamin injections, and a thorough nutritional consult. Follow-up visits typically include a weigh-in, injections, and medication when it is needed.</p>
        </div>
        {book_block("Medical weight loss", "Book a weight management visit")}
      </div>
    </section>
{related_section("weight")}
"""
    page(
        "weight-loss.html",
        "Medical Weight Loss | Age-Less Medicine",
        "Couture Lifestyle Modification is Age-Less Medicine’s three-step, medically supervised weight program in Tampa, personalized by Dr. Linda McClintock.",
        "weight",
        body,
    )


def build_injectables():
    body = f"""{page_hero(
        "Facial rejuvenation",
        "Injectables",
        "Dr. Linda is internationally trained in facial rejuvenation with dermal fillers and muscle relaxants.",
        "images/stock/hallway",
        "",
        '<a class="btn btn--ghost" href="skin.html">Skin and facials</a>',
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
        {book_block("Injectables", "Book an injectable visit")}
      </div>
    </section>
{related_section("injectables")}
"""
    page(
        "injectables.html",
        "Injectables | Age-Less Medicine",
        "Botox, Dysport, Restylane, Juvederm, Radiesse, and liquid facelift treatments with Dr. Linda McClintock at Age-Less Medicine in Tampa.",
        "injectables",
        body,
    )


def build_skin():
    body = f"""{page_hero(
        "Skin care",
        "Skin and facials",
        "From our PRP Stem-Cell Facial to peels and medical grade products, our skin treatments are chosen and supervised by Dr. Linda.",
        "images/stock/still-life",
        "",
        '<a class="btn btn--ghost" href="prp.html">The PRP facial</a>',
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
    <section class="section section--ivory">
      <div class="wrap prose" data-reveal>
        <h2 class="display">Medical grade products</h2>
        <hr class="gold-rule">
        <p>Dr. Linda personally selects the skin care we carry. Our shelves include IS Clinical, Neocutis, Proplus, Neova, Mesoestetic, and other medical grade lines.</p>
      </div>
    </section>
    <section class="section">
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
        "images/stock/palms",
        "",
        '<a class="btn btn--ghost" href="https://agelessbydrlinda.com/shop/" rel="noopener noreferrer" target="_blank">Visit the shop</a>',
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
          <p class="lede">At the request of our clients, we made our nutritional supplements available online. Dr. Linda evaluates the products we offer, and they can be delivered to your door.</p>
        </div>
        <div class="shop-grid">
          <a class="product" data-reveal href="https://agelessbydrlinda.com/product/age-less-greens/" rel="noopener noreferrer" target="_blank">
            <div class="product-photo"><picture><source type="image/webp" srcset="images/products/greens.webp"><img src="images/products/greens.jpg" alt="A jar of Age-Less Greens" width="470" height="694"></picture></div>
            <div class="product-body"><h3>Age-Less Greens</h3><p class="amt">$46.95</p></div>
          </a>
          <a class="product" data-reveal href="https://agelessbydrlinda.com/shop/" rel="noopener noreferrer" target="_blank">
            <div class="product-photo"><picture><source type="image/webp" srcset="images/products/reds.webp"><img src="images/products/reds.jpg" alt="A jar of Age-Less Reds" width="470" height="694"></picture></div>
            <div class="product-body"><h3>Age-Less Reds</h3><p class="amt">$49.92</p></div>
          </a>
          <a class="product" data-reveal href="https://agelessbydrlinda.com/shop/" rel="noopener noreferrer" target="_blank">
            <div class="product-photo"><picture><source type="image/webp" srcset="images/products/purples.webp"><img src="images/products/purples.jpg" alt="A jar of Age-Less Purples" width="470" height="694"></picture></div>
            <div class="product-body"><h3>Age-Less Purples</h3><p class="amt">$50.88</p></div>
          </a>
        </div>
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
        "images/stock/lounge",
        "",
        '<a class="btn btn--ghost" href="contact.html">Visit the office</a>',
    )}
    <section class="section">
      <div class="wrap about-grid">
        <div class="portrait-frame" data-reveal>
          <img src="images/clinic/dr-linda.jpg" alt="Dr. Linda McClintock" width="302" height="319">
        </div>
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
        "images/stock/hero-spa",
        "",
        '<a class="btn btn--ghost" href="tel:+18132864404">Call (813) 286-4404</a>',
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
            <img src="images/clinic/urban-centre.jpg" alt="Urban Centre on West Kennedy Boulevard in Tampa" width="322" height="220">
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
    build_home()
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
