document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : 'auto';
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = 'auto';
      });
    });
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (navMenu && navMenu.classList.contains('open')) {
          hamburger.classList.remove('open');
          navMenu.classList.remove('open');
          document.body.style.overflow = 'auto';
        }
      }
    });
  });

  // Navbar scroll background change
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check on load

  // Scroll spy: Highlight active section in navigation
  const sections = document.querySelectorAll('section[id]');
  const scrollSpy = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // Offset for nav height
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          activeLink.classList.add('active');
        } else {
          activeLink.classList.remove('active');
        }
      }
    });
  };
  window.addEventListener('scroll', scrollSpy);
  scrollSpy(); // Check on load

  // Reveal animations on scroll
  const revealElements = document.querySelectorAll('.reveal, .stagger-container');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Dynamic Portfolio / Projects Filter
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Active state swap
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        projectCards.forEach(card => {
          if (filterValue === 'all') {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.4s ease-out forwards';
          } else {
            const categories = card.getAttribute('data-category').split(' ');
            if (categories.includes(filterValue)) {
              card.style.display = 'flex';
              card.style.animation = 'fadeIn 0.4s ease-out forwards';
            } else {
              card.style.display = 'none';
            }
          }
        });
      });
    });
  }

  // Interactive Card Tilt for Bio Card
  const bioCard = document.querySelector('.bio-card');
  if (bioCard) {
    const wrapper = bioCard.parentElement;
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Calculate rotation angles (max 10 degrees)
      const rotateX = -(y / (rect.height / 2)) * 10;
      const rotateY = (x / (rect.width / 2)) * 10;
      
      bioCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    wrapper.addEventListener('mouseleave', () => {
      bioCard.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  }

  // Contact Form Handlers with Floating Labels and Custom Feedback
  const form = document.getElementById('contactForm');
  const submitStatus = document.getElementById('submitStatus');

  if (form) {
    // Keep labels floated if input has value on page load
    const formInputs = form.querySelectorAll('.form-input, .form-textarea');
    formInputs.forEach(input => {
      const handleInput = () => {
        if (input.value.trim() !== "") {
          input.setAttribute('placeholder', ' '); // ensures css placeholder-shown is bypassed
        }
      };
      input.addEventListener('blur', handleInput);
      input.addEventListener('input', handleInput);
      handleInput(); // Initial run
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        showStatus('Please fill in all fields before sending.', 'error');
        return;
      }

      // Simulate sending message
      showStatus('Sending your message, please wait...', '');
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      setTimeout(() => {
        showStatus(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
        form.reset();
        
        // Reset placeholders/labels
        formInputs.forEach(input => input.setAttribute('placeholder', ''));
        
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }

        // Hide success message after 5 seconds
        setTimeout(() => {
          submitStatus.style.display = 'none';
        }, 5000);
      }, 1500);
    });
  }

  function showStatus(msg, type) {
    if (!submitStatus) return;
    submitStatus.textContent = msg;
    submitStatus.className = 'submit-status'; // reset
    if (type === 'success') {
      submitStatus.classList.add('success');
    } else if (type === 'error') {
      submitStatus.classList.add('error');
    } else {
      submitStatus.style.display = 'block'; // standard status message
      submitStatus.style.background = 'rgba(255, 255, 255, 0.05)';
      submitStatus.style.color = '#fff';
    }
  }
});
