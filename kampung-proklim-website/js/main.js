/* ============================================================
   KAMPUNG PROKLIM LESTARI — main.js
   Navbar behaviour for the site foundation (Tahap 2).
   Self-contained: does not depend on programs.js / gallery.js /
   map.js, which will be added in later tahap.
   ============================================================ */
(function () {
  'use strict';

  /**
   * Keeps the --header-h CSS variable in sync with the real
   * header height, so sticky-scroll offsets and the mobile nav
   * panel line up exactly under the header.
   */
  function setHeaderHeightVar() {
    var header = document.getElementById('site-header');
    if (!header) return;
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }

  /**
   * Adds a subtle elevated/solid state to the sticky header once
   * the page has scrolled past the top.
   */
  function initHeaderScrollState() {
    var header = document.getElementById('site-header');
    if (!header) return;

    var ticking = false;
    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /**
   * Hamburger menu for small screens: toggles the nav panel,
   * closes on link click, outside click, or Escape.
   */
  function initMobileNav() {
    var toggle = document.getElementById('nav-toggle');
    var list = document.getElementById('primary-navigation');
    if (!toggle || !list) return;

    function closeNav() {
      toggle.setAttribute('aria-expanded', 'false');
      list.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    }
    function openNav() {
      toggle.setAttribute('aria-expanded', 'true');
      list.classList.add('is-open');
      document.body.classList.add('nav-open');
    }

    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) { closeNav(); } else { openNav(); }
    });

    list.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeNav();
    });

    document.addEventListener('click', function (event) {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (!isOpen) return;
      if (!list.contains(event.target) && !toggle.contains(event.target)) {
        closeNav();
      }
    });
  }

  /**
   * Highlights the nav link matching whichever section is
   * currently in view.
   */
  function initActiveNavHighlight() {
    var sections = document.querySelectorAll('main section[id]');
    var links = document.querySelectorAll('.nav__list a');
    if (!sections.length || !links.length || !('IntersectionObserver' in window)) return;

    var linkBySectionId = {};
    links.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (href.charAt(0) === '#') linkBySectionId[href.slice(1)] = link;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = linkBySectionId[entry.target.id];
        if (!link || !entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('is-active'); });
        link.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  /** Keeps the footer copyright year current without manual edits. */
  function initFooterYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  document.addEventListener('DOMContentLoaded', function () {
    setHeaderHeightVar();
    initHeaderScrollState();
    initMobileNav();
    initActiveNavHighlight();
    initFooterYear();
  });

  window.addEventListener('resize', setHeaderHeightVar);
})();
