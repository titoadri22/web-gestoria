/* =====================================================
   RICART CAMBRA S.L. - JavaScript
   Navegación, animaciones y funcionalidades
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // =====================================================
    // HEADER SCROLL EFFECT
    // =====================================================
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on load

    // =====================================================
    // MOBILE NAVIGATION
    // =====================================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');

    // Open menu
    navToggle?.addEventListener('click', () => {
        navMenu.classList.add('show');
        document.body.style.overflow = 'hidden';
    });

    // Close menu
    navClose?.addEventListener('click', () => {
        navMenu.classList.remove('show');
        document.body.style.overflow = '';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            document.body.style.overflow = '';
        });
    });

    // =====================================================
    // ACTIVE NAVIGATION LINK
    // =====================================================
    const sections = document.querySelectorAll('section[id]');
    
    const scrollActive = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 200;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href*="${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink?.classList.add('active');
            } else {
                navLink?.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', scrollActive);

    // =====================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =====================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =====================================================
    // ANIMATED COUNTER FOR STATS
    // =====================================================
    const stats = document.querySelectorAll('.stat__number');
    let countersStarted = false;

    const animateCounter = (element, target) => {
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    };

    const startCounters = () => {
        if (countersStarted) return;
        
        const statsSection = document.querySelector('.nosotros__stats');
        if (!statsSection) return;
        
        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            countersStarted = true;
            stats.forEach(stat => {
                const target = parseInt(stat.dataset.target);
                animateCounter(stat, target);
            });
        }
    };

    window.addEventListener('scroll', startCounters);
    startCounters(); // Check on load

    // =====================================================
    // SCROLL ANIMATIONS
    // =====================================================
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.servicio__card, .stat, .contacto__card, .feature');
        
        elements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible && !element.classList.contains('animated')) {
                element.style.animationDelay = `${index * 0.1}s`;
                element.classList.add('animate-on-scroll', 'animated');
            }
        });
    };

    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .servicio__card,
        .stat,
        .contacto__card,
        .feature {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .servicio__card.animated,
        .stat.animated,
        .contacto__card.animated,
        .feature.animated {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Check on load

    // =====================================================
    // CONTACT FORM HANDLING
    // =====================================================
    const contactForm = document.getElementById('contact-form');

    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Get submit button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = `
            <svg class="spinner" viewBox="0 0 24 24" style="width: 20px; height: 20px; animation: spin 1s linear infinite;">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="30 70"></circle>
            </svg>
            Enviando...
        `;
        submitBtn.disabled = true;

        // Add spinner animation
        const spinnerStyle = document.createElement('style');
        spinnerStyle.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(spinnerStyle);

        // Simulate form submission (replace with actual API call)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            showNotification('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.', 'success');
            contactForm.reset();
            
        } catch (error) {
            showNotification('Ha ocurrido un error. Por favor, inténtalo de nuevo.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // =====================================================
    // NOTIFICATION SYSTEM
    // =====================================================
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__icon">${type === 'success' ? '✓' : '✕'}</span>
                <span class="notification__message">${message}</span>
            </div>
            <button class="notification__close">×</button>
        `;

        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const notificationStyles = document.createElement('style');
            notificationStyles.id = 'notification-styles';
            notificationStyles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    max-width: 400px;
                    padding: 20px 24px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    z-index: 10000;
                    animation: slideIn 0.4s ease;
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .notification__content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .notification__icon {
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    font-weight: bold;
                    color: white;
                }
                
                .notification--success .notification__icon {
                    background: #10B981;
                }
                
                .notification--error .notification__icon {
                    background: #EF4444;
                }
                
                .notification__message {
                    font-size: 0.9375rem;
                    color: #1A1612;
                }
                
                .notification__close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: #6B6560;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }
                
                .notification__close:hover {
                    color: #1A1612;
                }
            `;
            document.head.appendChild(notificationStyles);
        }

        document.body.appendChild(notification);

        // Close button
        notification.querySelector('.notification__close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.4s ease reverse';
            setTimeout(() => notification.remove(), 400);
        }, 5000);
    }

    // =====================================================
    // PARALLAX EFFECT FOR HERO
    // =====================================================
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            
            if (scrolled < heroHeight) {
                hero.style.setProperty('--parallax', `${scrolled * 0.3}px`);
            }
        });
    }

    // =====================================================
    // FORM INPUT ANIMATIONS
    // =====================================================
    const formInputs = document.querySelectorAll('.form__group input, .form__group textarea, .form__group select');
    
    formInputs.forEach(input => {
        // Check if input has value on load
        if (input.value) {
            input.classList.add('has-value');
        }
        
        input.addEventListener('input', () => {
            if (input.value) {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    });

    console.log('✨ Ricart Cambra S.L. website loaded successfully!');
});
