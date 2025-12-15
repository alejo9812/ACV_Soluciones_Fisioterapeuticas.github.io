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
    // Obtenemos todos los elementos .faq-item
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Para cada pregunta, escuchamos el clic
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Cerramos cualquier otra pregunta que esté abierta
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Abrimos/cerramos la pregunta actual
            item.classList.toggle('active');
        });
    });

    // ========================
    // 2. Manejo del formulario de contacto
    // ========================
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Tomamos los datos del formulario
            const formData = new FormData(contactForm);
            const nombre = formData.get('nombre');
            const telefono = formData.get('telefono');
            const email = formData.get('email');
            const mensaje = formData.get('mensaje');
            
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
            
            // En un proyecto real aquí se enviaría a un servidor.
            // De momento solo mostramos un mensaje de éxito.
            showFormMessage('¡Gracias por tu consulta! Nos pondremos en contacto contigo pronto.', 'success');
            
            // Limpiamos los campos
            contactForm.reset();
            
            // Optionally, you could send the data via WhatsApp or email
            // Example: window.open(`https://wa.me/573114768213?text=Consulta de ${nombre}: ${mensaje}`);
        });
    }
    
    // ========================
    // 3. Botón de teléfono / WhatsApp
    // ========================
    const phoneButton = document.querySelector('.phone-button');
    if (phoneButton) {
        phoneButton.addEventListener('click', function() {
            const phoneNumber = '573114768213';
            // Abrimos WhatsApp en una nueva pestaña con el número configurado
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
    let lastScroll = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.12)';
        } else {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
        }
        
        lastScroll = currentScroll;
    });

    // ========================
    // 6. Menú móvil (botón hamburguesa)
    // ========================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    const body = document.body;
    
    if (mobileMenuToggle && navLinks) {
        const toggleMenu = (open) => {
            const isOpen = navLinks.classList.contains('active');
            
            if (open === undefined) {
                // Toggle
                if (isOpen) {
                    closeMenu();
                } else {
                    openMenu();
                }
            } else if (open) {
                openMenu();
            } else {
                closeMenu();
            }
        };

        const openMenu = () => {
            navLinks.classList.add('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.add('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'true');
            }
        };

        const closeMenu = () => {
            navLinks.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        };

        // Toggle al hacer clic en el botón
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Cerrar al hacer clic en un enlace
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(closeMenu, 150);
            });
        });

        // Cerrar con la tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });

        // Cerrar al hacer clic fuera del menú
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                !mobileMenuToggle.contains(e.target) &&
                !header.contains(e.target)) {
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
    const submitButton = form.querySelector('button[type="submit"]');
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

