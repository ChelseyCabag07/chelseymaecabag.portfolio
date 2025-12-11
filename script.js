document.addEventListener('DOMContentLoaded', function() {
  console.log('Portfolio loaded successfully');
  initNavigation();
  initScrollAnimations();
  initResumeDownload();
  initContactForm();
  initMobileMenu();
  lazyLoadImages();
});

function initNavigation() {
  const navLinks = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('section');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
  window.addEventListener('scroll', function() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
}

function initScrollAnimations() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#' && targetId.length > 1) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, observerOptions);
  const animatedElements = document.querySelectorAll('.skill-box, .service-tag, .experience-item');
  animatedElements.forEach(el => observer.observe(el));
}

function initResumeDownload() {
  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      generatePDF();
    });
  }
}

function generatePDF() {
  const element = document.getElementById('resumeContent');
  const btn = document.getElementById('downloadBtn');
  if (!element || !btn) return;

  const opt = {
    margin: 0.2,
    filename: 'Chelsey_Mae_Cabag_Resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
  btn.style.pointerEvents = 'none';
  btn.style.opacity = '0.7';

  html2pdf().set(opt).from(element).toPdf().get('pdf').then(jsPdf => {
    const pageWidth = jsPdf.internal.pageSize.getWidth();
    const pageHeight = jsPdf.internal.pageSize.getHeight();
    const contentWidth = element.scrollWidth;
    const contentHeight = element.scrollHeight;
    const scale = Math.min(pageWidth / contentWidth, pageHeight / contentHeight);
    jsPdf.internal.scaleFactor = jsPdf.internal.scaleFactor * scale;
  }).save().then(() => {
    btn.innerHTML = originalText;
    btn.style.pointerEvents = 'auto';
    btn.style.opacity = '1';
    showNotification('Resume downloaded successfully!', 'success');
  }).catch(error => {
    console.error('PDF generation failed:', error);
    btn.innerHTML = originalText;
    btn.style.pointerEvents = 'auto';
    btn.style.opacity = '1';
    showNotification('Failed to generate PDF. Please try again.', 'error');
  });
}

function showNotification(message, type = 'success') {
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) existingNotification.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    background: ${type === 'success' ? '#4caf50' : '#f44336'};
    color: white;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(contactForm));
    if (validateForm(formData)) {
      console.log('Form data:', formData);
      showNotification('Message sent successfully!', 'success');
      contactForm.reset();
    } else {
      showNotification('Please fill in all required fields.', 'error');
    }
  });
}

function validateForm(data) {
  return data.name && data.email && data.message && data.email.includes('@') && data.email.includes('.');
}

function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  if (!menuToggle || !nav) return;
  menuToggle.addEventListener('click', function() {
    nav.classList.toggle('active');
    this.classList.toggle('active');
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });
}

function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        obs.unobserve(img);
      }
    });
  });
  images.forEach(img => observer.observe(img));
}

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn { from {transform: translateX(400px); opacity:0;} to {transform: translateX(0); opacity:1;} }
  @keyframes slideOut { from {transform: translateX(0); opacity:1;} to {transform: translateX(400px); opacity:0;} }
  .fade-in { animation: fadeIn 0.6s ease forwards; }
  @keyframes fadeIn { from {opacity:0; transform: translateY(20px);} to {opacity:1; transform: translateY(0);} }
`;
document.head.appendChild(style);

console.log('All JavaScript functions initialized successfully!');
