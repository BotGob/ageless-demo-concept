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
    initProcess();
  });

  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var onHero = document.querySelector(".hero, .page-hero");
    function paint() {
      var y = window.scrollY || document.documentElement.scrollTop;
      header.classList.toggle("is-scrolled", y > 24 || !onHero);
    }
    paint();
    window.addEventListener("scroll", paint, { passive: true });
  }

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var header = document.querySelector(".site-header");
    if (!toggle || !header) return;
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
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    nodes.forEach(function (n) { io.observe(n); });
  }

  function initProcess() {
    var root = document.querySelector("[data-process]");
    if (!root) return;
    var articles = root.querySelectorAll(".process-copy article");
    var dial = root.querySelector("[data-dial]");
    var viz = root.querySelectorAll(".viz");
    var label = root.querySelector("[data-step-label]");
    if (!articles.length || !dial) return;

    function setStep(num) {
      dial.setAttribute("data-active", String(num));
      viz.forEach(function (el) {
        el.classList.toggle("is-on", el.getAttribute("data-viz") === String(num));
      });
      if (label) label.textContent = "Step 0" + num;
    }

    setStep(1);

    if (reduce || !("IntersectionObserver" in window)) {
      viz.forEach(function (el) { el.classList.add("is-on"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var num = entry.target.getAttribute("data-step");
        if (num) setStep(num);
      });
    }, { threshold: 0.55 });
    articles.forEach(function (article) { io.observe(article); });
  }
})();
