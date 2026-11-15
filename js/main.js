(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lastOpener = null;
  var NAV_MQ = "(max-width: 1080px)";
  var trapCleanup = null;

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    initHeader();
    initNav();
    initReveals();
    initFaq();
    initOverlays();
    initBookingExtras();
    initHeroVideo();
    initQuiz();
    initCounters();
    initMarquee();
    initBlurUp();
    initPageFade();
    initVoiceNote();
  });

  function modalOpen() {
    return !!document.querySelector(".modal.is-open");
  }

  function overlayOpen() {
    return !!(modalOpen() || document.querySelector(".site-header.nav-open"));
  }

  function syncLock() {
    if (overlayOpen()) {
      document.body.classList.add("is-overlay");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("is-overlay");
      document.body.style.overflow = "";
      stopTrap();
    }
    document.body.classList.toggle("is-modal", modalOpen());
  }

  function visible(el) {
    return !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length));
  }

  function focusable(container) {
    return Array.prototype.filter.call(
      container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      visible
    );
  }

  function startTrap(container) {
    stopTrap();
    function onKey(event) {
      if (event.key !== "Tab") return;
      var list = focusable(container);
      if (!list.length) return;
      var first = list[0];
      var last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    trapCleanup = function () {
      document.removeEventListener("keydown", onKey);
    };
  }

  function stopTrap() {
    if (trapCleanup) {
      trapCleanup();
      trapCleanup = null;
    }
  }

  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var onHero = document.querySelector(".hero, .page-hero");
    function paint() {
      var y = window.scrollY || document.documentElement.scrollTop;
      header.classList.toggle("is-scrolled", y > 20 || !onHero);
    }
    paint();
    window.addEventListener("scroll", paint, { passive: true });
  }

  function closeNav() {
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".nav-toggle");
    if (header) header.classList.remove("nav-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
    syncLock();
  }

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var header = document.querySelector(".site-header");
    var submenu = document.querySelector(".has-sub");
    var subButton = document.querySelector(".nav-label");
    if (toggle && header) {
      toggle.addEventListener("click", function () {
        var open = header.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        syncLock();
      });
      header.querySelectorAll(".nav a").forEach(function (link) {
        link.addEventListener("click", function () {
          header.classList.remove("nav-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Open menu");
          syncLock();
        });
      });
    }
    if (submenu && subButton) {
      var setSub = function (open) {
        submenu.classList.toggle("is-open", open);
        subButton.setAttribute("aria-expanded", open ? "true" : "false");
      };
      // Phone: accordion inside the menu. Desktop: click or keyboard opens the Treatments panel
      // (hover still previews it). Escape or a click outside closes it.
      subButton.addEventListener("click", function (event) {
        event.preventDefault();
        setSub(!submenu.classList.contains("is-open"));
      });
      document.addEventListener("click", function (event) {
        if (!submenu.contains(event.target) && !window.matchMedia(NAV_MQ).matches) setSub(false);
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && submenu.classList.contains("is-open") && !window.matchMedia(NAV_MQ).matches) {
          setSub(false);
          subButton.focus();
        }
      });
      submenu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setSub(false); }); });
    }
    window.addEventListener("resize", function () {
      if (!window.matchMedia(NAV_MQ).matches && header && header.classList.contains("nav-open")) closeNav();
    });
  }

  function initReveals() {
    var nodes = document.querySelectorAll("[data-reveal]");
    if (!nodes.length) return;
    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    nodes.forEach(function (n) { io.observe(n); });
  }

  function initFaq() {
    document.querySelectorAll(".faq-item button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".faq-item");
        var open = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  function initOverlays() {
    var booking = document.getElementById("book");
    var quiz = document.getElementById("quiz");

    document.addEventListener("click", function (event) {
      var openBook = event.target.closest("[data-open-booking]");
      if (openBook) {
        event.preventDefault();
        lastOpener = openBook;
        openBooking(openBook.getAttribute("data-treatment") || "");
        return;
      }
      if (event.target.closest("[data-close-booking]")) {
        event.preventDefault();
        closeBooking();
        return;
      }
      var openQuiz = event.target.closest("[data-open-quiz]");
      if (openQuiz) {
        event.preventDefault();
        lastOpener = openQuiz;
        openQuizModal();
        return;
      }
      if (event.target.closest("[data-close-quiz]")) {
        event.preventDefault();
        closeQuiz();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      if (booking && booking.classList.contains("is-open")) closeBooking();
      else if (quiz && quiz.classList.contains("is-open")) closeQuiz();
      else closeNav();
    });

    if (window.location.hash === "#book") openBooking("");
    // From the shop: "Book a skin consultation" lands here with the visit type preselected
    if (window.location.hash === "#book-skin") openBooking("Skin and facials");
    if (window.location.hash === "#quiz") openQuizModal();
  }

  function openBooking(treatment) {
    var modal = document.getElementById("book");
    if (!modal) return;
    closeQuiz(true);
    closeNav();
    var form = modal.querySelector("#booking-form");
    var confirmBox = modal.querySelector("#booking-confirm");
    var errorBox = modal.querySelector("#booking-error");
    var treatmentSelect = modal.querySelector("#visit-treatment");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true");
    if (form) form.hidden = false;
    if (confirmBox) {
      confirmBox.classList.remove("is-on");
      confirmBox.hidden = true;
    }
    if (errorBox) errorBox.classList.remove("is-on");
    if (treatment && treatmentSelect) {
      var match = Array.prototype.find.call(treatmentSelect.options, function (opt) {
        return opt.value === treatment;
      });
      if (match) treatmentSelect.value = treatment;
    }
    syncLock();
    startTrap(modal.querySelector(".modal-card") || modal);
    var first = modal.querySelector("select, input, button");
    if (first) first.focus();
  }

  function closeBooking(keepLock) {
    var modal = document.getElementById("book");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    if (!keepLock) {
      syncLock();
      if (lastOpener && visible(lastOpener)) lastOpener.focus();
    }
  }

  function initBookingExtras() {
    var modal = document.getElementById("book");
    if (!modal) return;
    var form = modal.querySelector("#booking-form");
    var confirmBox = modal.querySelector("#booking-confirm");
    var errorBox = modal.querySelector("#booking-error");
    var dateInput = modal.querySelector("#visit-date");

    if (dateInput) {
      var today = new Date();
      var iso = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
      dateInput.min = iso;
      dateInput.addEventListener("change", function () {
        if (!dateInput.value) return;
        var day = new Date(dateInput.value + "T12:00:00").getDay();
        if (day === 0 || day === 5 || day === 6) {
          dateInput.value = "";
          if (errorBox) {
            errorBox.textContent = "We are open Monday through Thursday, from 10:00 a.m. to 5:00 p.m.";
            errorBox.classList.add("is-on");
          }
        } else if (errorBox) {
          errorBox.classList.remove("is-on");
        }
      });
    }

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        var data = new FormData(form);
        var name = (data.get("name") || "").toString().trim();
        var treatment = (data.get("treatment") || "").toString();
        var day = (data.get("date") || "").toString();
        var time = (data.get("time") || "").toString();
        var phone = (data.get("phone") || "").toString();
        var email = (data.get("email") || "").toString();
        var I18N = window.ALi18n, es = !!(I18N && I18N.lang() === "es");
        var tr = function (x) { return I18N ? I18N.t(x) : x; };
        var prettyDay = day;
        if (day) {
          var parsed = new Date(day + "T12:00:00");
          prettyDay = parsed.toLocaleDateString(es ? "es-US" : "en-US", { weekday: "long", month: "long", day: "numeric" });
        }
        form.hidden = true;
        confirmBox.hidden = false;
        confirmBox.classList.add("is-on");
        var timeClean = time ? time.replace(/\.$/, "") : "";
        var tel = "<a href=\"tel:+18132864404\">(813) 286-4404</a>";
        var mail = "<a href=\"mailto:info@age-lessmedicine.com\">info@age-lessmedicine.com</a>";
        confirmBox.innerHTML = es ?
          "<h3>Gracias, " + escapeHtml(name) + ".</h3>" +
          "<p>Nos preguntaste por " + escapeHtml(tr(treatment)) +
          (prettyDay ? " el " + escapeHtml(prettyDay) : "") +
          (timeClean ? ", en el horario de " + escapeHtml(timeClean) : "") + ".</p>" +
          "<p>Este formulario no envía tu información. Para completar tu solicitud, llámanos al " + tel + " o escríbenos a " + mail + ".</p>" +
          "<p>Con gusto hablaremos contigo" +
          (phone ? " al " + escapeHtml(phone) : "") +
          (email ? " o en " + escapeHtml(email) : "") + ".</p>" +
          "<div class=\"btn-row\" style=\"margin-top:1.2rem\">" +
          "<a class=\"btn btn--gold\" href=\"tel:+18132864404\">Llama al consultorio</a>" +
          "<button class=\"btn btn--line\" type=\"button\" data-close-booking>Cerrar</button></div>"
          :
          "<h3>Thank you, " + escapeHtml(name) + ".</h3>" +
          "<p>You asked about " + escapeHtml(treatment) +
          (prettyDay ? " on " + escapeHtml(prettyDay) : "") +
          (timeClean ? ", for " + escapeHtml(timeClean) : "") + ".</p>" +
          "<p>This form does not send your information. To finish your request, please call us at " + tel + " or email " + mail + ".</p>" +
          "<p>We look forward to speaking with you" +
          (phone ? " at " + escapeHtml(phone) : "") +
          (email ? " or " + escapeHtml(email) : "") + ".</p>" +
          "<div class=\"btn-row\" style=\"margin-top:1.2rem\">" +
          "<a class=\"btn btn--gold\" href=\"tel:+18132864404\">Call the office</a>" +
          "<button class=\"btn btn--line\" type=\"button\" data-close-booking>Close</button></div>";
        var closeBtn = confirmBox.querySelector("[data-close-booking]");
        if (closeBtn) closeBtn.focus();
      });
    }
  }

  /* Welcome note: placeholder until Dr. Linda records her welcome.
     LIVE BUILD: play her recording here, e.g. new Audio("audio/welcome-" + lang + ".mp3").play() */
  function initVoiceNote() {
    // Same behaviour as the shop's "Tap to hear Dr. Linda": a small "coming soon" card with a moving
    // waveform for a few seconds. LIVE BUILD: play her recording here instead, e.g.
    // new Audio("audio/welcome-" + (window.ALi18n ? ALi18n.lang() : "en") + ".mp3").play()
    var pop = document.getElementById("voice-pop");
    if (!pop) return;
    var timer = null, active = null;
    document.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-voice]");
      if (!btn) return;
      if (active) active.classList.remove("is-playing");
      active = btn;
      btn.classList.add("is-playing");
      pop.hidden = false;
      pop.style.animation = "none"; void pop.offsetWidth; pop.style.animation = "";
      clearTimeout(timer);
      timer = setTimeout(function () { pop.hidden = true; btn.classList.remove("is-playing"); }, 3600);
    });
  }

  var QUIZ = {
    first: {
      title: "What brings you in?",
      options: [
        { id: "energy", label: "Energy, hormones and healthy aging" },
        { id: "weight", label: "Weight and metabolic health" },
        { id: "lines", label: "Smoothing lines" },
        { id: "skin", label: "Skin and facials" }
      ]
    },
    second: {
      energy: {
        title: "Where would you like to begin?",
        options: [
          { id: "longevity", label: "A longevity and wellness assessment" },
          { id: "hormones", label: "Hormone optimization with Dr. Linda" }
        ]
      },
      weight: {
        title: "What would you like to explore first?",
        options: [
          { id: "weight", label: "Our micro-dose GLP-1 weight loss program" },
          { id: "iv", label: "Customized IV therapies" }
        ]
      },
      lines: {
        title: "Which approach sounds closer?",
        options: [
          { id: "injectables", label: "Botox and dermal fillers" },
          { id: "skin", label: "Skin treatments and facials" }
        ]
      },
      skin: {
        title: "What kind of skin visit interests you?",
        options: [
          { id: "prp", label: "A PRP facial using a preparation from your own blood" },
          { id: "skin", label: "Our wider range of facials and skin treatments" }
        ]
      }
    },
    results: {
      longevity: {
        title: "Longevity and wellness assessment",
        lede: "A personalized review of your health history, lifestyle and wellness priorities, with testing guided by clinical needs.",
        href: "longevity.html#assessments",
        treatment: "Longevity and wellness assessment",
        cta: "Explore longevity and hormones"
      },
      hormones: {
        title: "Hormone optimization",
        lede: "An individualized assessment for women and men, including symptoms, appropriate lab evaluation and a discussion of treatment options.",
        href: "hormones.html",
        treatment: "Hormone optimization",
        cta: "Explore this visit"
      },
      weight: {
        title: "Micro-dose GLP-1 weight loss",
        lede: "Physician-guided weight management with individualized dosing discussions, nutrition guidance and follow-up for eligible patients.",
        href: "weight-loss.html",
        treatment: "Micro-dose GLP-1 weight loss",
        cta: "See how it works"
      },
      iv: {
        title: "Customized IV therapies",
        lede: "Personalized IV formulations, selected after a review of your medical history, your needs and whether treatment is suitable for you.",
        href: "metabolic.html#iv",
        treatment: "IV therapy",
        cta: "Explore metabolic and IV care"
      },
      injectables: {
        title: "Botox and dermal fillers",
        lede: "Individualized aesthetic consultations with an expert injector, and treatment planning focused on facial balance and your personal preferences.",
        href: "injectables.html",
        treatment: "Botox and dermal fillers",
        cta: "Explore this visit"
      },
      prp: {
        title: "The PRP Stem\u2011Cell\u00a0Facial",
        lede: "A facial that uses a preparation from your own blood, applied with micro-needling.",
        href: "prp.html",
        treatment: "PRP Stem-Cell Facial",
        cta: "Learn about the PRP facial"
      },
      skin: {
        title: "Skin and facials",
        lede: "PRP facials, micro-needling, Diamond Tome microdermabrasion, Cosmelan and medical grade peels, chosen and supervised by Dr. Linda.",
        href: "skin.html",
        treatment: "Skin and facials",
        cta: "Explore skin treatments"
      }
    }
  };

  var quizChoice = "";

  function quizRoot() {
    return document.getElementById("quiz-app");
  }

  function openQuizModal() {
    var modal = document.getElementById("quiz");
    if (!modal) return;
    closeBooking(true);
    closeNav();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true");
    quizChoice = "";
    renderQuizStep("first");
    syncLock();
    startTrap(modal.querySelector(".modal-card") || modal);
  }

  function closeQuiz(keepLock) {
    var modal = document.getElementById("quiz");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    if (!keepLock) {
      syncLock();
      if (lastOpener && visible(lastOpener)) lastOpener.focus();
    }
  }

  function renderQuizStep(which, key) {
    var root = quizRoot();
    if (!root) return;
    if (which === "first") {
      var first = QUIZ.first;
      root.innerHTML =
        '<p class="eyebrow">Question 1 of 2</p>' +
        '<h2 class="display" id="quiz-title">' + first.title + "</h2>" +
        '<hr class="gold-rule">' +
        '<p class="form-note">Please do not include medical details. Nothing is sent.</p>' +
        '<div class="quiz-options" role="group" aria-label="What brings you in">' +
        first.options.map(function (opt) {
          return '<button class="quiz-option" type="button" data-quiz-step="1" data-quiz-id="' + opt.id + '">' + opt.label + "</button>";
        }).join("") +
        "</div>";
    } else if (which === "second") {
      var second = QUIZ.second[key];
      root.innerHTML =
        '<p class="eyebrow">Question 2 of 2</p>' +
        '<h2 class="display" id="quiz-title">' + second.title + "</h2>" +
        '<hr class="gold-rule">' +
        '<div class="quiz-options" role="group" aria-label="A closer look">' +
        second.options.map(function (opt) {
          return '<button class="quiz-option" type="button" data-quiz-step="2" data-quiz-id="' + opt.id + '">' + opt.label + "</button>";
        }).join("") +
        "</div>" +
        '<p class="quiz-back-wrap"><button class="quiz-back" type="button" data-quiz-back>Back</button></p>';
    } else {
      var result = QUIZ.results[key];
      root.innerHTML =
        '<p class="eyebrow">A visit that may fit</p>' +
        '<h2 class="display" id="quiz-title">' + result.title + "</h2>" +
        '<hr class="gold-rule">' +
        "<p>" + result.lede + "</p>" +
        '<div class="btn-row" style="margin-top:1.4rem">' +
        '<a class="btn btn--gold" href="' + result.href + '">' + result.cta + "</a>" +
        '<a class="btn btn--line" href="#book" data-open-booking data-treatment="' + result.treatment + '">Book a visit</a>' +
        "</div>" +
        '<p class="quiz-back-wrap"><button class="quiz-back" type="button" data-quiz-restart>Start over</button></p>' +
        '<p class="form-note">This guide does not collect medical details.</p>';
    }
    var focusEl = root.querySelector("button, a");
    if (focusEl) focusEl.focus();
  }

  function initQuiz() {
    var modal = document.getElementById("quiz");
    if (!modal) return;
    modal.addEventListener("click", function (event) {
      var opt = event.target.closest("[data-quiz-step]");
      if (opt) {
        var step = opt.getAttribute("data-quiz-step");
        var id = opt.getAttribute("data-quiz-id");
        if (step === "1") {
          quizChoice = id;
          renderQuizStep("second", id);
        } else {
          renderQuizStep("result", id);
        }
        return;
      }
      if (event.target.closest("[data-quiz-back], [data-quiz-restart]")) {
        quizChoice = "";
        renderQuizStep("first");
      }
    });
  }

  function initHeroVideo() {
    var hero = document.querySelector("[data-hero-video]");
    var video = document.querySelector(".hero-video");
    if (!hero || !video) return;

    function showStill() {
      hero.classList.add("is-static");
      video.removeAttribute("src");
      video.load();
    }

    if (reduce) {
      showStill();
      return;
    }
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn && (conn.saveData || conn.effectiveType === "slow-2g" || conn.effectiveType === "2g")) {
      showStill();
      return;
    }

    var mobile = window.matchMedia(NAV_MQ).matches;
    var webm = video.canPlayType('video/webm; codecs="vp9"') || video.canPlayType("video/webm");
    var src = mobile
      ? (webm ? "images/stock/hero-ambient-sm.webm" : "images/stock/hero-ambient-sm.mp4")
      : (webm ? "images/stock/hero-ambient.webm" : "images/stock/hero-ambient.mp4");
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("data-src", src);
    video.src = src;

    function tryPlay() {
      var playPromise = video.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () { /* autoplay can fail; poster remains */ });
      }
    }

    video.addEventListener("playing", function () {
      hero.classList.add("is-playing");
    });
    var fallbackTried = false;
    video.addEventListener("error", function () {
      if (!fallbackTried && /\.webm($|\?)/i.test(video.currentSrc || src)) {
        fallbackTried = true;
        video.src = mobile ? "images/stock/hero-ambient-sm.mp4" : "images/stock/hero-ambient.mp4";
        tryPlay();
        return;
      }
      showStill();
    });

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) tryPlay();
          else video.pause();
        });
      }, { threshold: 0.12 });
      io.observe(hero);
    } else {
      tryPlay();
    }
  }

  function initCounters() {
    var nodes = document.querySelectorAll("[data-count]");
    if (!nodes.length) return;

    function run(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      if (isNaN(target)) return;
      if (reduce) {
        el.textContent = String(Math.round(target));
        return;
      }
      var start = 0;
      var duration = 620;
      var begun = null;
      function frame(now) {
        if (!begun) begun = now;
        var t = Math.min(1, (now - begun) / duration);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = String(Math.round(start + (target - start) * eased));
        if (t < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    if (!("IntersectionObserver" in window) || reduce) {
      nodes.forEach(run);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  function initMarquee() {
    var wrap = document.querySelector(".marquee");
    if (!wrap) return;
    wrap.addEventListener("touchstart", function () { wrap.classList.add("is-paused"); }, { passive: true });
    wrap.addEventListener("touchend", function () { wrap.classList.remove("is-paused"); }, { passive: true });
    wrap.addEventListener("mouseenter", function () { wrap.classList.add("is-paused"); });
    wrap.addEventListener("mouseleave", function () { wrap.classList.remove("is-paused"); });
  }

  function initBlurUp() {
    var images = document.querySelectorAll("main img, .signature img, .related-card img");
    images.forEach(function (img) {
      if (reduce) {
        img.classList.add("is-ready");
        return;
      }
      img.classList.add("js-blur");
      function done() { img.classList.add("is-ready"); }
      if (img.complete && img.naturalWidth) done();
      else {
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      }
    });
  }

  function initPageFade() {
    window.addEventListener("pageshow", function (event) {
      document.documentElement.classList.remove("is-leaving");
      if (event.persisted) {
        document.querySelectorAll(".modal.is-open").forEach(function (modal) {
          modal.classList.remove("is-open");
          modal.setAttribute("aria-hidden", "true");
          modal.removeAttribute("aria-modal");
        });
        closeNav();
        document.body.classList.remove("is-overlay", "is-modal");
        document.body.style.overflow = "";
        stopTrap();
      }
    });

    if (reduce) return;

    var nativeVT = false;
    try {
      nativeVT = !!(window.CSS && CSS.supports && CSS.supports("at-rule", "@view-transition"));
    } catch (err) {
      nativeVT = "startViewTransition" in document;
    }
    if (nativeVT) return;

    document.addEventListener("click", function (event) {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var link = event.target.closest("a[href]");
      if (!link) return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;
      if (link.hasAttribute("data-open-booking") || link.hasAttribute("data-open-quiz")) return;
      if (link.protocol !== "http:" && link.protocol !== "https:") return;
      if (link.origin !== location.origin) return;
      var next = new URL(link.href, location.href);
      if (next.pathname === location.pathname && next.hash) return;
      if (next.href === location.href) {
        event.preventDefault();
        return;
      }
      if (document.documentElement.classList.contains("is-leaving")) return;
      event.preventDefault();
      document.documentElement.classList.add("is-leaving");
      window.setTimeout(function () {
        location.href = link.href;
      }, 280);
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[ch];
    });
  }
})();
