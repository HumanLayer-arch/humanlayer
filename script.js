/* ═══════════════════════════════════════════
   HUMAN LAYER · script.js
   ═══════════════════════════════════════════ */

'use strict';

/* ─── 1. CANVAS BACKGROUND DOTS ───────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const BLUE = '74,111,255';
  let W, H, dots;

  /* Dot definition */
  function makeDot(i) {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  1.5 + Math.random() * 2.5,
      vx: (Math.random() - .5) * .28,
      vy: (Math.random() - .5) * .28,
      phase: Math.random() * Math.PI * 2,
      speed: .004 + Math.random() * .008,
      /* each dot is one of two 'roles': H-node or L-node */
      role: i % 2,
    };
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const count = Math.min(Math.floor(W * H / 18000), 60);
    dots = Array.from({ length: count }, (_, i) => makeDot(i));
  }

  /* Draw a single dot with opacity pulse */
  function drawDot(d, t) {
    const pulse = .3 + .45 * Math.sin(d.phase + t * d.speed * 60);
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${BLUE},${pulse.toFixed(2)})`;
    ctx.fill();
  }

  /* Draw a faint connection line between two nearby dots */
  function drawLink(a, b, dist, maxDist) {
    const alpha = (.22 * (1 - dist / maxDist)).toFixed(3);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = `rgba(${BLUE},${alpha})`;
    ctx.lineWidth = .6;
    ctx.stroke();
  }

  function tick(t) {
    ctx.clearRect(0, 0, W, H);

    const MAX_LINK = 160;

    /* Move dots */
    dots.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;
      /* wrap around edges */
      if (d.x < -10) d.x = W + 10;
      if (d.x > W + 10) d.x = -10;
      if (d.y < -10) d.y = H + 10;
      if (d.y > H + 10) d.y = -10;
    });

    /* Links first (under dots) */
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_LINK) {
          drawLink(dots[i], dots[j], dist, MAX_LINK);
        }
      }
    }

    /* Dots on top */
    dots.forEach(d => drawDot(d, t));

    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  requestAnimationFrame(tick);
})();


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


/* ─── 6. WHITE PAPER DOWNLOAD BUTTON ────────────────────────── */
(function initDownload() {
  const btn = document.getElementById('dlBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    btn.textContent = 'Coming soon ·';
    btn.style.background = 'var(--dark)';
    setTimeout(() => {
      btn.textContent = 'Download the White Paper';
      btn.style.background = '';
    }, 2600);
  });
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
