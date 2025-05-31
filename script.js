// Snowy River Sheds - JavaScript

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const testimonialSlider = document.getElementById('testimonial-slider');
const testimonials = testimonialSlider.querySelectorAll('.testimonial');
const quoteButtons = document.querySelectorAll('.quote-button');
const modal = document.getElementById('quote-modal');
const modalClose = document.getElementById('modal-close');
const contactForm = document.getElementById('contact-form');
const modalForm = document.getElementById('modal-form');
const toast = document.getElementById('success-toast');
const animateElements = document.querySelectorAll('.animate-on-scroll');

// Range Carousel
const rangeCarousel = document.getElementById('range-carousel');
const rangeCards = rangeCarousel.querySelectorAll('.range-card');
const carouselPrev = document.querySelector('.carousel-nav.prev');
const carouselNext = document.querySelector('.carousel-nav.next');
const carouselIndicators = document.querySelectorAll('.carousel-indicator');
let currentCarouselIndex = 0;
let cardsPerView = 4;

// Calculate cards per view based on screen width
function calculateCardsPerView() {
  const width = window.innerWidth;
  if (width < 768) {
    cardsPerView = 1;
  } else if (width < 992) {
    cardsPerView = 1; // Larger cards need more space
  } else if (width < 1200) {
    cardsPerView = 2; // Can fit 2 cards
  } else {
    cardsPerView = 3; // Desktop shows 3 cards, requiring scroll for the 4th
  }
}

// Update carousel position
function updateCarousel() {
  const cardWidth = rangeCards[0].offsetWidth;
  const gap = parseInt(getComputedStyle(rangeCarousel).gap);
  const offset = currentCarouselIndex * (cardWidth + gap);
  rangeCarousel.style.transform = `translateX(-${offset}px)`;
  
  // Update indicators
  carouselIndicators.forEach((indicator, index) => {
    // Calculate total pages needed
    const totalPages = Math.ceil(rangeCards.length / cardsPerView);
    const currentPage = Math.floor(currentCarouselIndex / cardsPerView);
    
    // Show/hide indicators based on total pages
    indicator.style.display = index < totalPages ? 'block' : 'none';
    indicator.classList.toggle('active', index === currentPage);
  });
  
  // Update navigation buttons
  carouselPrev.disabled = currentCarouselIndex === 0;
  carouselNext.disabled = currentCarouselIndex >= rangeCards.length - cardsPerView;
}

// Carousel navigation
carouselPrev.addEventListener('click', () => {
  if (currentCarouselIndex > 0) {
    currentCarouselIndex = Math.max(0, currentCarouselIndex - cardsPerView);
    updateCarousel();
  }
});

carouselNext.addEventListener('click', () => {
  if (currentCarouselIndex < rangeCards.length - cardsPerView) {
    currentCarouselIndex = Math.min(rangeCards.length - cardsPerView, currentCarouselIndex + cardsPerView);
    updateCarousel();
  }
});

// Carousel indicators
carouselIndicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => {
    currentCarouselIndex = index * cardsPerView;
    if (currentCarouselIndex > rangeCards.length - cardsPerView) {
      currentCarouselIndex = rangeCards.length - cardsPerView;
    }
    updateCarousel();
  });
});

// Touch support for carousel
let carouselTouchStartX = 0;
let carouselTouchEndX = 0;

rangeCarousel.addEventListener('touchstart', (e) => {
  carouselTouchStartX = e.changedTouches[0].screenX;
});

rangeCarousel.addEventListener('touchend', (e) => {
  carouselTouchEndX = e.changedTouches[0].screenX;
  handleCarouselSwipe();
});

function handleCarouselSwipe() {
  if (carouselTouchEndX < carouselTouchStartX - 50) {
    // Swipe left - next
    if (currentCarouselIndex < rangeCards.length - cardsPerView) {
      currentCarouselIndex = Math.min(rangeCards.length - cardsPerView, currentCarouselIndex + 1);
      updateCarousel();
    }
  } else if (carouselTouchEndX > carouselTouchStartX + 50) {
    // Swipe right - previous
    if (currentCarouselIndex > 0) {
      currentCarouselIndex = Math.max(0, currentCarouselIndex - 1);
      updateCarousel();
    }
  }
}

// Update carousel on window resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    calculateCardsPerView();
    if (currentCarouselIndex > rangeCards.length - cardsPerView) {
      currentCarouselIndex = Math.max(0, rangeCards.length - cardsPerView);
    }
    updateCarousel();
  }, 250);
});

// Navigation Shrink on Scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// Hamburger Menu Toggle
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking nav links
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      const offsetTop = target.offsetTop - navbar.offsetHeight;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// Intersection Observer for Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
    }
  });
}, observerOptions);

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  animateElements.forEach(el => {
    animationObserver.observe(el);
  });
}

// Testimonial Slider
let currentTestimonial = 0;
let testimonialInterval;

function showTestimonial(index) {
  testimonials.forEach((testimonial, i) => {
    testimonial.classList.toggle('active', i === index);
  });
}

function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
}

function startTestimonialSlider() {
  testimonialInterval = setInterval(nextTestimonial, 6000);
}

function pauseTestimonialSlider() {
  clearInterval(testimonialInterval);
}

// Start slider
startTestimonialSlider();

// Pause on hover
testimonialSlider.addEventListener('mouseenter', pauseTestimonialSlider);
testimonialSlider.addEventListener('mouseleave', startTestimonialSlider);

// Touch support for testimonials
let touchStartX = 0;
let touchEndX = 0;

testimonialSlider.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  pauseTestimonialSlider();
});

testimonialSlider.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
  startTestimonialSlider();
});

function handleSwipe() {
  if (touchEndX < touchStartX - 50) {
    // Swipe left - next testimonial
    nextTestimonial();
  } else if (touchEndX > touchStartX + 50) {
    // Swipe right - previous testimonial
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonial);
  }
}

// Modal Functionality
quoteButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const card = e.target.closest('.range-card');
    const shedType = card.dataset.shedType;
    
    document.getElementById('modal-shed-type').value = shedType;
    document.getElementById('modal-title').textContent = `Request a Quote - ${shedType.charAt(0).toUpperCase() + shedType.slice(1)}`;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
  modalForm.reset();
  clearFormErrors(modalForm);
}

// Form Validation
function validateForm(form) {
  let isValid = true;
  const fields = form.querySelectorAll('[required]');
  
  fields.forEach(field => {
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    // Clear previous error
    formGroup.classList.remove('error');
    errorMessage.textContent = '';
    
    // Check if field is empty
    if (!field.value.trim()) {
      isValid = false;
      formGroup.classList.add('error');
      errorMessage.textContent = 'This field is required';
      return;
    }
    
    // Email validation
    if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        isValid = false;
        formGroup.classList.add('error');
        errorMessage.textContent = 'Please enter a valid email address';
      }
    }
    
    // Phone validation
    if (field.type === 'tel') {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(field.value)) {
        isValid = false;
        formGroup.classList.add('error');
        errorMessage.textContent = 'Please enter a valid phone number';
      }
    }
    
    // Postcode validation (Australian)
    if (field.name === 'postcode') {
      const postcodeRegex = /^\d{4}$/;
      if (!postcodeRegex.test(field.value)) {
        isValid = false;
        formGroup.classList.add('error');
        errorMessage.textContent = 'Please enter a valid 4-digit postcode';
      }
    }
  });
  
  return isValid;
}

function clearFormErrors(form) {
  form.querySelectorAll('.form-group').forEach(group => {
    group.classList.remove('error');
    const errorMessage = group.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.textContent = '';
    }
  });
}

// Contact Form Submission
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (validateForm(contactForm)) {
    // Simulate form submission
    showToast();
    contactForm.reset();
    clearFormErrors(contactForm);
    
    // Scroll to top after submission
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
});

// Modal Form Submission
modalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (validateForm(modalForm)) {
    showToast();
    closeModal();
  }
});

// Toast Notification
function showToast() {
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}

// Phone Badge Pulse Animation on Hover
const phoneBadge = document.getElementById('phone-badge');
const phoneBadgeLink = phoneBadge.querySelector('.phone-badge-link');

// Add pulse animation class on hover
phoneBadgeLink.addEventListener('mouseenter', () => {
  if (!prefersReducedMotion) {
    phoneBadgeLink.style.animationPlayState = 'running';
  }
});

phoneBadgeLink.addEventListener('mouseleave', () => {
  phoneBadgeLink.style.animationPlayState = 'paused';
});

// Real-time form validation
const formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea, .modal-form input');

formInputs.forEach(input => {
  input.addEventListener('blur', () => {
    const formGroup = input.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    if (input.hasAttribute('required') && !input.value.trim()) {
      formGroup.classList.add('error');
      errorMessage.textContent = 'This field is required';
    } else {
      formGroup.classList.remove('error');
      errorMessage.textContent = '';
    }
  });
  
  input.addEventListener('input', () => {
    const formGroup = input.closest('.form-group');
    if (formGroup.classList.contains('error') && input.value.trim()) {
      formGroup.classList.remove('error');
      formGroup.querySelector('.error-message').textContent = '';
    }
  });
});

// Keyboard Navigation for Modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

// Ensure modal form fields are focusable when modal opens
modal.addEventListener('transitionend', () => {
  if (modal.classList.contains('active')) {
    const firstInput = modalForm.querySelector('input:not([type="hidden"])');
    if (firstInput) {
      firstInput.focus();
    }
  }
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  // Set initial testimonial
  showTestimonial(0);
  
  // Initialize carousel
  calculateCardsPerView();
  updateCarousel();
  
  // Check if page was accessed with a hash
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        const offsetTop = target.offsetTop - navbar.offsetHeight;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }, 100);
    }
  }
});

// Performance optimization - Debounce scroll events
let scrollTimer;
window.addEventListener('scroll', () => {
  if (scrollTimer) {
    clearTimeout(scrollTimer);
  }
  
  scrollTimer = setTimeout(() => {
    // Any scroll-based calculations can go here
  }, 100);
});

// Service Worker Registration (for better performance)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment the following line if you add a service worker
    // navigator.serviceWorker.register('/sw.js');
  });
} 