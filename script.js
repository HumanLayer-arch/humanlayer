/* ═══════════════════════════════════════════
   HUMAN LAYER · script.js
   ═══════════════════════════════════════════ */

'use strict';


/* ─── 2. NAV: SCROLLED STATE + ACTIVE LINK ─────────────────────── */
(function initNav() {
  const nav   = document.getElementById('nav');
  const links = document.querySelectorAll('.nav-links a');

  /* Scrolled style */
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Active section highlight via IntersectionObserver */
  const sections = document.querySelectorAll('section[id]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: .35 });

  sections.forEach(s => io.observe(s));
})();


/* ─── 3. MOBILE MENU ─────────────────────────────────────────── */
(function initMobileMenu() {
  const burger  = document.getElementById('burger');
  const menu    = document.getElementById('mobMenu');
  const mobLinks = document.querySelectorAll('.mob-link');

  function toggleMenu(open) {
    burger.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  burger.addEventListener('click', () => toggleMenu(!menu.classList.contains('open')));

  mobLinks.forEach(l => l.addEventListener('click', () => toggleMenu(false)));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') toggleMenu(false);
  });
})();


/* ─── 4. SCROLL REVEAL ───────────────────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -44px 0px',
  });

  items.forEach(el => io.observe(el));
})();


/* ─── 5. HL SEPARATOR: DOTS CONVERGE ON SCROLL ──────────────── */
(function initSepDots() {
  const seps = document.querySelectorAll('.hl-sep');

  function update() {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    seps.forEach(sep => {
      const line = sep.querySelector('.sp-l');
      if (line) {
        const w = Math.max(6, 40 * (1 - pct * .6));
        line.style.width = w + 'px';
      }
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();





/* ─── 7. SMOOTH CURSOR CROSSHAIR (desktop only) ──────────────── */
(function initCursor() {
  /* Only apply custom cursor on pointer devices */
  if (!window.matchMedia('(hover: hover)').matches) return;
  document.documentElement.style.cursor = 'crosshair';
})();


/* ─── 8. SECTION ENTRANCE: stagger children ─────────────────── */
(function initStagger() {
  /* App cards get a micro stagger when their section enters viewport */
  const grid = document.querySelector('.apps-grid');
  if (!grid) return;

  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      const cards = grid.querySelectorAll('.app-card');
      cards.forEach((c, i) => {
        c.style.transitionDelay = (i * 0.06) + 's';
      });
      io.unobserve(grid);
    }
  }, { threshold: 0.1 });

  io.observe(grid);
})();
