// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Add click event to each FAQ item
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const nombre = formData.get('nombre');
            const telefono = formData.get('telefono');
            const email = formData.get('email');
            const mensaje = formData.get('mensaje');
            
            // Basic validation
            if (!nombre || !telefono || !email || !mensaje) {
                showFormMessage('Por favor, completa todos los campos.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Por favor, ingresa un correo electrónico válido.', 'error');
                return;
            }
            
            // Simulate form submission (in a real scenario, you would send this to a server)
            // For now, we'll just show a success message
            showFormMessage('¡Gracias por tu consulta! Nos pondremos en contacto contigo pronto.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Optionally, you could send the data via WhatsApp or email
            // Example: window.open(`https://wa.me/573114768213?text=Consulta de ${nombre}: ${mensaje}`);
        });
    }
    
    // Phone button click handler
    const phoneButton = document.querySelector('.phone-button');
    if (phoneButton) {
        phoneButton.addEventListener('click', function() {
            const phoneNumber = '573114768213';
            // Open WhatsApp
            window.open(`https://wa.me/${phoneNumber}`, '_blank', 'noopener');
        });
    }
    
    // Smooth scroll for anchor links
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
    
    // Navbar scroll effect (optional enhancement)
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

    // Mobile menu toggle - Mejorado
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

