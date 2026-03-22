
/* ── 1. Custom Cursor ───────────────────────────────────────── */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;   // true pointer position
let ringX  = 0, ringY  = 0;   // lagging ring position

// Follow the pointer precisely
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Animate the ring with eased lag
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Grow cursor on interactive elements
const interactiveEls = document.querySelectorAll(
  'a, button, .cat-card, .book-card, .why-item, .stat-card, .feature-card, .testi-card'
);

interactiveEls.forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform     = 'translate(-50%, -50%) scale(2.5)';
    cursorRing.style.width     = '60px';
    cursorRing.style.height    = '60px';
    cursorRing.style.opacity   = '0.25';
  });

  el.addEventListener('mouseleave', () => {
    cursor.style.transform     = 'translate(-50%, -50%) scale(1)';
    cursorRing.style.width     = '36px';
    cursorRing.style.height    = '36px';
    cursorRing.style.opacity   = '0.6';
  });
});


/* ── 2. Navbar — Shrink on Scroll ───────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


/* ── 3. Scroll Reveal (IntersectionObserver) ────────────────── */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing once revealed — no re-trigger needed
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => revealObserver.observe(el));


/* ── 4. Hero Parallax (background text) ─────────────────────── */
const heroBgText = document.querySelector('.hero-bg-text');

if (heroBgText) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.3;
    heroBgText.style.transform = `translate(-50%, calc(-50% + ${offset}px))`;
  }, { passive: true });
}


/* ── 5. Mobile Menu Toggle ──────────────────────────────────── */
function toggleMenu() {
  const links = document.querySelector('.nav-links');

  if (links.style.display === 'flex') {
    // Close
    links.style.display = 'none';
  } else {
    // Open — override to a vertical dropdown
    links.style.cssText = [
      'display: flex',
      'flex-direction: column',
      'position: fixed',
      'top: 70px',
      'left: 0',
      'right: 0',
      'background: var(--paper)',
      'padding: 2rem',
      'gap: 1.5rem',
      'z-index: 499',
      'border-bottom: 1px solid var(--line)',
    ].join('; ');
  }
}

// Close mobile menu when a nav link is clicked
document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    const links = document.querySelector('.nav-links');
    links.style.display = 'none';
  });
});

// Close mobile menu when resizing back to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    const links = document.querySelector('.nav-links');
    links.style.cssText = '';   // restore CSS-controlled display
  }
});


/* ── 6. Contact Form — Submit Handler ───────────────────────── */
function handleFormSubmit(btn) {
  const span = btn.querySelector('span');

  // Disable & show loading state
  span.textContent      = 'Sending…';
  btn.style.pointerEvents = 'none';
  btn.style.opacity       = '0.75';

  // Simulate async send (replace with real fetch/XHR for production)
  setTimeout(() => {
    span.textContent    = '✓ Message Sent!';
    btn.style.background  = 'var(--sage)';
    btn.style.opacity     = '1';

    // Reset after 3 s
    setTimeout(() => {
      span.textContent      = 'Send Message';
      btn.style.background  = '';
      btn.style.pointerEvents = '';
      btn.style.opacity       = '';

      // Clear form fields
      const form = btn.closest('section');
      if (form) {
        form.querySelectorAll('.form-input').forEach((input) => {
          input.value = '';
        });
      }
    }, 3000);
  }, 1200);
}


/* ── 7. Smooth Anchor Scroll (offset for fixed nav) ─────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    const navHeight = navbar ? navbar.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── 8. Book Cards — Subtle Tilt on Hover ───────────────────── */
document.querySelectorAll('.book-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -4;   // max ±4 deg
    const rotateY = ((x - cx) / cx) *  4;

    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease, background 0.4s';
  });
});


/* ── 9. Active Nav Link Highlight on Scroll ─────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.style.color = 'var(--gold)';
          }
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((s) => sectionObserver.observe(s));