// =======================================
// LÓGICA DE INTERACCIÓN DE LA PÁGINA
// Aquí se controla:
// - Acordeón de Preguntas Frecuentes (FAQ)
// - Envío y validación del formulario de contacto
// - Botón que abre WhatsApp
// - Scroll suave al hacer clic en el menú
// - Comportamiento del menú móvil (hamburguesa)
// =======================================

document.addEventListener('DOMContentLoaded', function() {
    // ========================
    // 1. FAQ: abrir/cerrar respuestas
    // ========================
    const faqItems = document.querySelectorAll('.faq-item');
  
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
  
      if (!question) return;
  
      question.addEventListener('click', () => {
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
          }
        });
  
        item.classList.toggle('active');
      });
    });
  
    // ========================
    // 2. Manejo del formulario de contacto (Formspree)
    // ========================
    const contactForm = document.querySelector('.contact-form');
  
    if (contactForm) {
      contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
  
        // Tomamos los datos del formulario
        const formData = new FormData(contactForm);
        const nombre = (formData.get('nombre') || '').toString().trim();
        const telefono = (formData.get('telefono') || '').toString().trim();
        const email = (formData.get('email') || '').toString().trim();
        const mensaje = (formData.get('mensaje') || '').toString().trim();
  
        // Validación básica: que no haya campos vacíos
        if (!nombre || !telefono || !email || !mensaje) {
          showFormMessage('Por favor, completa todos los campos.', 'error');
          return;
        }
  
        // Validación sencilla del formato del correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          showFormMessage('Por favor, ingresa un correo electrónico válido.', 'error');
          return;
        }
  
        // Endpoint de Formspree: se toma del action del form
        const endpoint = contactForm.getAttribute('action') || 'https://formspree.io/f/mdaoyqpy';
  
        // Asunto del correo (Formspree lo soporta con _subject)
        formData.append('_subject', `Nueva consulta web - ${nombre}`);
  
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });
  
          if (res.ok) {
            showFormMessage('¡Gracias por tu consulta! Nos pondremos en contacto contigo pronto.', 'success');
            contactForm.reset();
          } else {
            showFormMessage('No se pudo enviar la consulta. Intenta de nuevo.', 'error');
          }
        } catch (err) {
          showFormMessage('Error de conexión. Revisa tu internet e intenta nuevamente.', 'error');
        }
      });
    }
  
    // ========================
    // 3. Botón de teléfono / WhatsApp
    // ========================
    const phoneButton = document.querySelector('.phone-button');
    if (phoneButton) {
      phoneButton.addEventListener('click', function() {
        const phoneNumber = '573114768213';
        window.open(`https://wa.me/${phoneNumber}`, '_blank', 'noopener');
      });
    }
  
    // ========================
    // 4. Scroll suave al hacer clic en enlaces con #
    // ========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
  
        e.preventDefault();
        const target = document.querySelector(href);
  
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  
    // ========================
    // 5. Efecto de sombra en el header al hacer scroll
    // ========================
    const header = document.querySelector('header');
  
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
  
      if (!header) return;
  
      if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.12)';
      } else {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
      }
    });
  
    // ========================
    // 6. Menú móvil (botón hamburguesa)
    // ========================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
  
    if (mobileMenuToggle && navLinks) {
      const openMenu = () => {
        navLinks.classList.add('active');
        mobileMenuToggle.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
      };
  
      const closeMenu = () => {
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      };
  
      mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (navLinks.classList.contains('active')) closeMenu();
        else openMenu();
      });
  
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          setTimeout(closeMenu, 150);
        });
      });
  
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
          closeMenu();
        }
      });
  
      document.addEventListener('click', (e) => {
        if (
          navLinks.classList.contains('active') &&
          !navLinks.contains(e.target) &&
          !mobileMenuToggle.contains(e.target)
        ) {
          closeMenu();
        }
      });
    }
  });
  
  // Function to show form messages
  function showFormMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }
  
    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
  
    // Insert before submit button
    const form = document.querySelector('.contact-form');
    if (!form) return;
  
    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) return;
  
    form.insertBefore(messageDiv, submitButton);
  
    // Auto-remove after 5 seconds
    setTimeout(() => {
      messageDiv.style.transition = 'opacity 0.3s';
      messageDiv.style.opacity = '0';
      setTimeout(() => {
        messageDiv.remove();
      }, 300);
    }, 5000);
  }
  
