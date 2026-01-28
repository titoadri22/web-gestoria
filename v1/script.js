/* =====================================================
   RICART CAMBRA S.L. - JavaScript - Versión 1
   Navegación, animaciones y funcionalidades
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.getElementById('header');

    const handleScroll = () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // Mobile Navigation
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');

    navToggle?.addEventListener('click', () => {
        navMenu.classList.add('show');
        document.body.style.overflow = 'hidden';
    });

    navClose?.addEventListener('click', () => {
        navMenu.classList.remove('show');
        document.body.style.overflow = '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            document.body.style.overflow = '';
        });
    });

    // Active Navigation Link
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

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Animated Counter
    const stats = document.querySelectorAll('.stat__number');
    let countersStarted = false;

    const animateCounter = (element, target) => {
        const duration = 2000;
        const step = target / (duration / 16);
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
    startCounters();

    // Reveal Animation
    const revealElements = document.querySelectorAll('.servicio, .stat, .contacto__card, .nosotros__features li');

    const revealOnScroll = () => {
        revealElements.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;

            if (isVisible && !el.classList.contains('revealed')) {
                el.style.transitionDelay = `${(index % 3) * 0.1}s`;
                el.classList.add('revealed');
            }
        });
    };

    const style = document.createElement('style');
    style.textContent = `
        .servicio,
        .stat,
        .contacto__card,
        .nosotros__features li {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .servicio.revealed,
        .stat.revealed,
        .contacto__card.revealed,
        .nosotros__features li.revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // Form Handling
    const contactForm = document.getElementById('contact-form');

    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = 'Enviando...';
        submitBtn.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            showNotification('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.', 'success');
            contactForm.reset();
        } catch (error) {
            showNotification('Ha ocurrido un error. Por favor, inténtalo de nuevo.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Notification System
    function showNotification(message, type = 'success') {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification__close">×</button>
        `;

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
                    background: #0a0a0a;
                    color: #fff;
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
                
                .notification--success {
                    border-left: 3px solid #b8860b;
                }
                
                .notification--error {
                    border-left: 3px solid #ef4444;
                }
                
                .notification__close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: rgba(255,255,255,0.6);
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }
                
                .notification__close:hover {
                    color: #fff;
                }
            `;
            document.head.appendChild(notificationStyles);
        }

        document.body.appendChild(notification);

        notification.querySelector('.notification__close').addEventListener('click', () => {
            notification.remove();
        });

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.4s ease reverse';
            setTimeout(() => notification.remove(), 400);
        }, 5000);
    }

    console.log('✨ Ricart Cambra S.L. - Versión 1 loaded!');
});
