// Basic UI interactions: hamburger, smooth scroll, contact form
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger) {
    hamburger.addEventListener('click', () => navMenu.classList.toggle('open'));
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (navMenu.classList.contains('open')) navMenu.classList.remove('open');
      }
    });
  });

  // Simple contact form handler
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      if (!name || !email || !message) {
        alert('Please fill all fields');
        return;
      }
      alert('Thanks, ' + (name || 'there') + '! I will get back to you soon.');
      form.reset();
    });
  }

  // Simple reveal animation
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('is-visible');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.section, .project-card, .bio-card').forEach(el => { el.classList.add('reveal'); reveal.observe(el); });
});

