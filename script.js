/* ============================
   AL-SHIFA CLINIC – JAVASCRIPT
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- NAVBAR SCROLL ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 400);
  });

  // ---- HAMBURGER MENU ----
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
    navbar.classList.toggle('menu-open');
  });
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      navbar.classList.remove('menu-open');
    });
  });

  // ---- ACTIVE NAV LINK ----
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));

  // ---- BACK TO TOP ----
  document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- COUNTER ANIMATION ----
  function animateCounter(el, target, duration = 1800) {
    const isK = target >= 1000;
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      if (isK) {
        el.textContent = current >= 1000 ? (current / 1000).toFixed(0) + 'K' : current;
      } else {
        el.textContent = current;
      }
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = isK ? (target / 1000) + 'K' : target;
    };
    requestAnimationFrame(step);
  }

  let countersStarted = false;
  const statsSection = document.getElementById('hero-stats');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        document.querySelectorAll('.stat-num[data-target]').forEach(el => {
          animateCounter(el, parseInt(el.dataset.target));
        });
      }
    });
  }, { threshold: 0.5 });
  if (statsSection) statsObserver.observe(statsSection);

  // ---- SCROLL REVEAL ----
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  // Add reveal classes to elements
  document.querySelectorAll('.service-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.1}s`;
    revealObserver.observe(el);
  });
  document.querySelectorAll('.pillar').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.15}s`;
    revealObserver.observe(el);
  });
  [
    'about-visual', 'about-content', 'doctor-visual', 'doctor-content',
    'hours-content', 'hours-cta-card', 'contact-info', 'contact-form',
    'hero-badge', 'hero-stats'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id.includes('visual') || id === 'contact-info' || id === 'hours-content') {
        el.classList.add('reveal-left');
      } else if (id.includes('content') || id === 'hours-cta-card' || id === 'contact-form') {
        el.classList.add('reveal-right');
      }
      revealObserver.observe(el);
    }
  });

  // ---- TESTIMONIALS SLIDER ----
  const cards = Array.from(document.querySelectorAll('.testimonial-card'));
  const dotsContainer = document.getElementById('testi-dots');
  let currentPage = 0;
  const getPerPage = () => window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
  let perPage = getPerPage();
  let totalPages = Math.ceil(cards.length / perPage);

  function buildDots() {
    dotsContainer.innerHTML = '';
    totalPages = Math.ceil(cards.length / perPage);
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === currentPage ? ' active' : '');
      dot.addEventListener('click', () => goToPage(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goToPage(page) {
    currentPage = (page + totalPages) % totalPages;
    const start = currentPage * perPage;
    cards.forEach((card, idx) => {
      card.classList.toggle('visible', idx >= start && idx < start + perPage);
    });
    document.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === currentPage));
  }

  window.addEventListener('resize', () => {
    perPage = getPerPage();
    buildDots();
    goToPage(0);
  });

  buildDots();
  goToPage(0);

  document.getElementById('testi-prev').addEventListener('click', () => goToPage(currentPage - 1));
  document.getElementById('testi-next').addEventListener('click', () => goToPage(currentPage + 1));

  // Auto-slide testimonials
  setInterval(() => goToPage(currentPage + 1), 5000);

  // ---- CONTACT FORM ----
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('inp-name').value.trim();
    const phone = document.getElementById('inp-phone').value.trim();
    if (!name || !phone) {
      alert('Please fill in your name and phone number.');
      return;
    }
    const btn = document.getElementById('form-submit-btn');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      document.getElementById('form-success').style.display = 'flex';
      form.reset();
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> Request Appointment`;
      btn.disabled = false;
    }, 1400);
  });

  // ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- PARALLAX HERO ----
  const heroImg = document.getElementById('hero-bg-img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      heroImg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }, { passive: true });
  }

  // ---- DOCTOR CREDENTIALS FLOAT ----
  const credCard = document.getElementById('doctor-cred-card');
  if (credCard) {
    credCard.style.animation = 'floatCard 5s ease-in-out infinite';
  }

  console.log('✅ Al-Shifa Clinic website loaded successfully.');
});
