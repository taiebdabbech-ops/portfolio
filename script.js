/* ══════════════════════════════════════════════
   CANVAS PARTICLE NETWORK
══════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('canvas-bg');
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const COUNT = window.innerWidth < 600 ? 40 : 80;
  const MAX_DIST = 130;
  const CYAN = '0,229,255';

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - .5) * .4;
    this.vy = (Math.random() - .5) * .4;
    this.r = Math.random() * 1.5 + .5;
  }
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CYAN},.6)`;
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${CYAN},${(1 - d / MAX_DIST) * .2})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  init();
  draw();
})();

/* ══════════════════════════════════════════════
   SCROLL PROGRESS + NAV + BACK TO TOP
══════════════════════════════════════════════ */
const progressBar = document.getElementById('progress-bar');
const navbar      = document.getElementById('navbar');
const backTop     = document.getElementById('back-top');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrolled / total * 100) + '%';
  navbar.classList.toggle('scrolled', scrolled > 40);
  backTop.classList.toggle('visible', scrolled > 400);
}, { passive: true });

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ══════════════════════════════════════════════
   HAMBURGER / MOBILE MENU
══════════════════════════════════════════════ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ══════════════════════════════════════════════
   TYPED EFFECT
══════════════════════════════════════════════ */
(function () {
  const el = document.getElementById('typed');
  const phrases = [
    'Étudiant ingénieur ICT',
    'Développeur FPGA / VHDL',
    'Enthousiaste IA & ML',
    'Passionné RF & Embarqué',
    'Co-fondateur CRAC Club',
  ];
  let pi = 0, ci = 0, deleting = false;
  const SPEED = 60, DELETE = 35, PAUSE = 1800;

  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(type, PAUSE); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? DELETE : SPEED);
  }
  setTimeout(type, 800);
})();

/* ══════════════════════════════════════════════
   INTERSECTION OBSERVER — APPEAR ANIMATIONS
══════════════════════════════════════════════ */
(function () {
  const els = document.querySelectorAll('.appear, .appear-left, .appear-right, .timeline-item');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ══════════════════════════════════════════════
   SKILL BARS — animate on scroll
══════════════════════════════════════════════ */
(function () {
  const bars = document.querySelectorAll('.skill-bar');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.pct + '%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: .3 });
  bars.forEach(b => io.observe(b));
})();

/* ══════════════════════════════════════════════
   HERO GRID RESPONSIVE FIX
══════════════════════════════════════════════ */
(function () {
  const grid = document.getElementById('hero-grid');
  function fix() {
    grid.style.gridTemplateColumns = window.innerWidth <= 900 ? '1fr' : '1fr 1fr';
  }
  fix();
  window.addEventListener('resize', fix, { passive: true });
})();

/* ══════════════════════════════════════════════
   CONTACT FORM (demo — pas d'envoi réel)
══════════════════════════════════════════════ */
document.getElementById('form-submit').addEventListener('click', function () {
  const name  = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const msg   = document.getElementById('f-msg').value.trim();
  const msgEl = document.getElementById('form-msg');
  msgEl.className = 'form-msg';

  if (!name || !email || !msg) {
    msgEl.textContent = '⚠ Veuillez remplir tous les champs.';
    msgEl.classList.add('error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msgEl.textContent = '⚠ Email invalide.';
    msgEl.classList.add('error');
    return;
  }

  this.textContent = 'Envoi en cours…';
  this.disabled = true;
  setTimeout(() => {
    msgEl.textContent = '✓ Message bien reçu ! Je vous répondrai bientôt.';
    msgEl.classList.add('success');
    document.getElementById('f-name').value  = '';
    document.getElementById('f-email').value = '';
    document.getElementById('f-msg').value   = '';
    this.textContent = 'Envoyer le message →';
    this.disabled = false;
  }, 1400);
});

/* ══════════════════════════════════════════════
   SMOOTH NAV LINKS
══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
