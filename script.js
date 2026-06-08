
document.addEventListener('DOMContentLoaded', () => {

  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  function openMenu() {
    navLinks.classList.add('open');
    hamburger.classList.add('menu-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  }

  hamburger.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) closeMenu();
    else openMenu();
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const revealElements = document.querySelectorAll(
    '.service-card, .portfolio-item, .team-card, .testi-card, ' +
    '.stat-item, .feature-item, .contact-item, .about-content, ' +
    '.about-visual, .section-header, .footer-col, .footer-brand'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Number(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => revealObserver.observe(el));

  const counters = document.querySelectorAll('.stat-num[data-count]');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => countObserver.observe(c));

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  const filterBtns   = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        const cat = item.dataset.category;
        if (filter === 'all' || cat === filter) {
          item.style.display = '';
          setTimeout(() => item.classList.add('visible'), 10);
        } else {
          item.classList.remove('visible');
          item.style.display = 'none';
        }
      });
    });
  });

  const testiTrack = document.getElementById('testimonialTrack');
  const testiCards  = testiTrack ? testiTrack.querySelectorAll('.testi-card') : [];
  const dots        = document.querySelectorAll('.testi-dots .dot');
  let currentSlide  = 0;

  function isMobile() { return window.innerWidth <= 1024; }

  function showSlide(index) {
    if (!isMobile()) return;
    testiCards.forEach((card, i) => {
      card.style.display = i === index ? 'block' : 'none';
    });
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    currentSlide = index;
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));

  // Auto-slide on mobile
  let slideInterval;
  function startSlider() {
    clearInterval(slideInterval);
    if (isMobile()) {
      showSlide(currentSlide);
      slideInterval = setInterval(() => {
        showSlide((currentSlide + 1) % testiCards.length);
      }, 4000);
    } else {
      testiCards.forEach(c => c.style.display = '');
    }
  }

  startSlider();
  window.addEventListener('resize', startSlider);

  const submitBtn    = document.getElementById('submitBtn');
  const formSuccess  = document.getElementById('formSuccess');
  const inputName    = document.getElementById('inputName');
  const inputEmail   = document.getElementById('inputEmail');
  const inputService = document.getElementById('inputService');
  const inputMessage = document.getElementById('inputMessage');

  submitBtn && submitBtn.addEventListener('click', () => {
    const name    = inputName.value.trim();
    const email   = inputEmail.value.trim();
    const message = inputMessage.value.trim();

    // Simple validation
    if (!name || !email || !message) {
      shake(submitBtn);
      highlightEmpty([inputName, inputEmail, inputMessage]);
      return;
    }
    if (!isValidEmail(email)) {
      shake(inputEmail);
      inputEmail.style.borderColor = '#f87171';
      return;
    }

    // Simulate send
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled    = true;

    setTimeout(() => {
      submitBtn.textContent = 'Kirim Pesan ✦';
      submitBtn.disabled    = false;
      formSuccess.style.display = 'block';
      // Reset form
      [inputName, inputEmail, inputService, inputMessage].forEach(el => el.value = '');
      setTimeout(() => formSuccess.style.display = 'none', 5000);
    }, 1500);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function shake(el) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'shakeX 0.4s ease';
    setTimeout(() => el.style.animation = '', 400);
  }
  function highlightEmpty(fields) {
    fields.forEach(f => {
      if (!f.value.trim()) {
        f.style.borderColor = '#f87171';
        f.addEventListener('input', () => f.style.borderColor = '', { once: true });
      }
    });
  }

  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 100;
      if (window.scrollY >= sectionTop) current = sec.getAttribute('id');
    });
    navLinkEls.forEach(link => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${current}`);
    });
  });

  const heroBgText = document.querySelector('.hero-bg-text');
  if (heroBgText) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY;
      heroBgText.style.transform = `translate(-50%, calc(-50% + ${offset * 0.15}px))`;
    });
  }

  // Inject shakeX keyframe dynamically
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes shakeX {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-6px); }
      40%, 80% { transform: translateX(6px); }
    }
    .nav-links a.active-link { color: var(--accent) !important; }
    .nav-links a.active-link::after { width: 100% !important; }
  `;
  document.head.appendChild(styleTag);

  console.log('%c xevrstudio Website Loaded ✦', 'color: #e8c36a; font-size: 14px; font-weight: bold;');
});
