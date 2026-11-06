(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    initHeader();
    initNav();
    initReveals();
    initFaq();
    initBooking();
  });

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

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var header = document.querySelector(".site-header");
    var submenu = document.querySelector(".has-sub");
    var subButton = document.querySelector(".nav-label");
    if (toggle && header) {
      toggle.addEventListener("click", function () {
        var open = header.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
      });
      header.querySelectorAll(".nav a").forEach(function (link) {
        link.addEventListener("click", function () {
          header.classList.remove("nav-open");
          toggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        });
      });
    }
    if (submenu && subButton) {
      subButton.addEventListener("click", function (event) {
        if (window.matchMedia("(max-width: 900px)").matches) {
          event.preventDefault();
          submenu.classList.toggle("is-open");
          subButton.setAttribute("aria-expanded", submenu.classList.contains("is-open") ? "true" : "false");
        }
      });
    }
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

  function initBooking() {
    var modal = document.getElementById("book");
    if (!modal) return;
    var form = modal.querySelector("#booking-form");
    var confirmBox = modal.querySelector("#booking-confirm");
    var errorBox = modal.querySelector("#booking-error");
    var dateInput = modal.querySelector("#visit-date");
    var treatmentSelect = modal.querySelector("#visit-treatment");
    var closeEls = modal.querySelectorAll("[data-close-booking]");

    function openModal(treatment) {
      var header = document.querySelector(".site-header");
      var toggle = document.querySelector(".nav-toggle");
      if (header) header.classList.remove("nav-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      modal.setAttribute("aria-modal", "true");
      document.body.classList.add("is-booking");
      document.body.style.overflow = "hidden";
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
      var first = modal.querySelector("select, input");
      if (first) first.focus();
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      modal.removeAttribute("aria-modal");
      document.body.classList.remove("is-booking");
      if (!document.querySelector(".nav-open")) document.body.style.overflow = "";
    }

    document.querySelectorAll("[data-open-booking]").forEach(function (el) {
      el.addEventListener("click", function (event) {
        event.preventDefault();
        openModal(el.getAttribute("data-treatment") || "");
      });
    });

    closeEls.forEach(function (el) {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });

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

    if (window.location.hash === "#book") openModal("");

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
        var prettyDay = day;
        if (day) {
          var parsed = new Date(day + "T12:00:00");
          prettyDay = parsed.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
        }
        form.hidden = true;
        confirmBox.hidden = false;
        confirmBox.classList.add("is-on");
        confirmBox.innerHTML =
          "<h3>Thank you, " + escapeHtml(name) + ".</h3>" +
          "<p>You asked about " + escapeHtml(treatment) + (prettyDay ? " on " + escapeHtml(prettyDay) : "") +
          (time ? ", " + escapeHtml(time) : "") + ".</p>" +
          "<p>This form does not send your information. To finish your request, please call us at " +
          "<a href=\"tel:+18132864404\">(813) 286-4404</a> or email " +
          "<a href=\"mailto:info@age-lessmedicine.com\">info@age-lessmedicine.com</a>.</p>" +
          "<p>We look forward to speaking with you" +
          (phone ? " at " + escapeHtml(phone) : "") +
          (email ? " or " + escapeHtml(email) : "") + ".</p>" +
          "<div class=\"btn-row\" style=\"margin-top:1.2rem\">" +
          "<a class=\"btn btn--gold\" href=\"tel:+18132864404\">Call the office</a>" +
          "<button class=\"btn btn--line\" type=\"button\" data-close-booking>Close</button></div>";
        confirmBox.querySelectorAll("[data-close-booking]").forEach(function (el) {
          el.addEventListener("click", closeModal);
        });
      });
    }
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[ch];
    });
  }
})();
