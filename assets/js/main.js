// =============================================
// MAIN JS — Neo Dark Glass Portfolio
// =============================================

(function () {
  'use strict';

  // --- Navbar: scroll state ---
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Navbar: active link on scroll ---
  const navLinks = document.querySelectorAll('.nav-link-item a');
  const sections = document.querySelectorAll('section[id]');

  function setActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });

  // --- Mobile menu toggle ---
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu   = document.getElementById('mobileMenu');
  const toggleIcon   = mobileToggle?.querySelector('i');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      if (toggleIcon) {
        toggleIcon.className = isOpen ? 'bi bi-x-lg' : 'bi bi-list';
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        if (toggleIcon) toggleIcon.className = 'bi bi-list';
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileMenu.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        if (toggleIcon) toggleIcon.className = 'bi bi-list';
      }
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Scroll reveal (IntersectionObserver) ---
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // --- Stagger children reveal ---
  const staggerWrappers = document.querySelectorAll('.stagger-children');
  if ('IntersectionObserver' in window) {
    const staggerObs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(':scope > *').forEach((child, i) => {
              setTimeout(() => child.classList.add('is-visible'), i * 100);
            });
            staggerObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    staggerWrappers.forEach(el => {
      el.querySelectorAll(':scope > *').forEach(child => {
        child.classList.add('reveal');
      });
      staggerObs.observe(el);
    });
  }

  // --- Contact form (EmailJS) ---
  emailjs.init('-L9vbhPd8l-RV5My5');

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = this.querySelector('.form-submit');
      const originalHTML = btn.innerHTML;

      btn.disabled = true;
      btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending...';

      emailjs.sendForm('service_ukcoeld', 'template_qr6ijvx', this)
        .then(() => {
          btn.innerHTML = '<i class="bi bi-check-circle"></i> Message Sent!';
          btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

          setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            contactForm.reset();
          }, 3000);
        })
        .catch((error) => {
          console.error('EmailJS error status:', error.status);
          console.error('EmailJS error text:', error.text);
          console.error('EmailJS full error:', JSON.stringify(error));
          btn.innerHTML = '<i class="bi bi-x-circle"></i> Failed to Send';
          btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';

          setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalHTML;
            btn.style.background = '';
          }, 3000);
        });
    });
  }

  // --- Cursor glow effect (subtle) ---
  const cursorGlow = document.createElement('div');
  cursorGlow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: left 0.4s ease, top 0.4s ease;
    will-change: left, top;
  `;
  document.body.appendChild(cursorGlow);

  let rafPending = false;
  document.addEventListener('mousemove', (e) => {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top  = e.clientY + 'px';
        rafPending = false;
      });
    }
  });

  // --- Hero stats counter animation ---
  function animateCounter(el, target, duration = 1500) {
    const start = performance.now();
    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window) {
    const statsObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-number').forEach(el => {
            const raw = el.textContent.trim();
            const num = parseInt(raw.replace(/\D/g, ''), 10);
            const suffix = raw.replace(/\d/g, '');
            el.dataset.suffix = suffix;
            animateCounter(el, num);
          });
          statsObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const stats = document.querySelector('.hero-stats');
    if (stats) statsObs.observe(stats);
  }

})();
