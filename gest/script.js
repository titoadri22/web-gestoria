/* =====================================================
   RICART CAMBRA S.L. - JavaScript
   Navegación, animaciones y funcionalidades PREMIUM
   ===================================================== */

// Debounce utility for performance
const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};

// Throttle utility for scroll events
const throttle = (fn, limit) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

document.addEventListener('DOMContentLoaded', () => {
    // =====================================================
    // SCROLL TO TOP ON PAGE LOAD
    // =====================================================
    window.scrollTo(0, 0);

    // Also handle page refresh/reload
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // =====================================================
    // HERO INITIAL ANIMATIONS
    // =====================================================
    const initHeroAnimations = () => {
        // Animate hero elements sequentially
        const heroElements = document.querySelectorAll('.hero__subtitle, .hero__title, .hero__description, .hero__buttons');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            setTimeout(() => {
                el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100 + (index * 200));
        });
    };

    // Start animations when DOM is ready
    initHeroAnimations();

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

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // =====================================================
    // MOBILE NAVIGATION
    // =====================================================
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

    window.addEventListener('scroll', scrollActive, { passive: true });

    // =====================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =====================================================
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

    // =====================================================
    // INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
    // =====================================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.dataset.delay || 0;
                element.style.transitionDelay = `${delay}ms`;
                element.classList.add('animate-visible');
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe all animatable elements with stagger
    const animatableElements = document.querySelectorAll(
        '.servicio__card, .feature, .contacto__card, .section__header, .nosotros__text, .nosotros__empresas, .servicios__nota, .contacto__form'
    );

    animatableElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.dataset.delay = (index % 6) * 100;
        observer.observe(el);
    });

    // Tilt effect removed for performance optimization

    // Cursor trail removed for performance optimization
    const hero = document.querySelector('.hero');

    // =====================================================
    // ANIMATED TEXT HIGHLIGHT
    // =====================================================
    const highlights = document.querySelectorAll('.highlight');

    const highlightObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('highlight-animate');
                highlightObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    highlights.forEach(el => highlightObserver.observe(el));

    // =====================================================
    // COUNTER ANIMATION
    // =====================================================
    const stats = document.querySelectorAll('.stat__number');
    let countersStarted = false;

    const animateCounter = (element, target) => {
        const duration = 2500;
        const startTime = performance.now();

        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);

            const currentValue = Math.floor(easedProgress * target);
            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(updateCounter);
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

    window.addEventListener('scroll', startCounters, { passive: true });
    startCounters();

    // =====================================================
    // RIPPLE EFFECT ON BUTTONS
    // =====================================================
    const createRipple = (e) => {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();

        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${diameter}px;
            height: ${diameter}px;
            left: ${e.clientX - rect.left - radius}px;
            top: ${e.clientY - rect.top - radius}px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    };

    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', createRipple);
    });

    // Floating particles removed for performance optimization

    // =====================================================
    // CONTACT FORM HANDLING
    // =====================================================
    const contactForm = document.getElementById('contact-form');

    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = `
            <svg class="spinner" viewBox="0 0 24 24" style="width: 20px; height: 20px; animation: spin 1s linear infinite;">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="30 70"></circle>
            </svg>
            Enviando...
        `;
        submitBtn.disabled = true;

        // Honeypot check - if filled, it's a bot
        const honeypot = contactForm.querySelector('#website');
        if (honeypot && honeypot.value !== '') {
            // Silently reject - pretend success to fool bots
            setTimeout(() => {
                showNotification('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.', 'success');
                contactForm.reset();
                createSuccessAnimation();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1000);
            return;
        }

        try {
            // EmailJS Service ID and Template ID
            const serviceID = 'service_jey3m5a';
            const templateID = 'template_ldzwpum';

            // Get the selected service text instead of value
            const serviceSelect = contactForm.querySelector('#servicio');
            const selectedService = serviceSelect.options[serviceSelect.selectedIndex].text;

            // Map form fields to the specific variables used in your EmailJS template
            const templateParams = {
                nombre_entidad: contactForm.querySelector('#nombre').value,
                email_cliente: contactForm.querySelector('#email').value,
                telefono_cliente: contactForm.querySelector('#telefono').value,
                servicio_interes: selectedService,
                mensaje_necesidad: contactForm.querySelector('#mensaje').value
            };

            await emailjs.send(serviceID, templateID, templateParams);

            showNotification('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.', 'success');
            contactForm.reset();
            createSuccessAnimation();

            // Remove 'has-value' and 'focused' classes
            document.querySelectorAll('.form__group input, .form__group textarea').forEach(input => {
                input.classList.remove('has-value');
                input.parentElement.classList.remove('focused');
            });

        } catch (error) {
            console.error('Error:', error);
            showNotification('Ha ocurrido un error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // =====================================================
    // SUCCESS ANIMATION (CHECKMARK)
    // =====================================================
    const createSuccessAnimation = () => {
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        overlay.innerHTML = `
            <div class="success-checkmark">
                <svg viewBox="0 0 52 52">
                    <circle cx="26" cy="26" r="25" fill="none" stroke="#10B981" stroke-width="2"/>
                    <path fill="none" stroke="#10B981" stroke-width="3" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
            </div>
        `;
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.classList.add('fade-out');
            setTimeout(() => overlay.remove(), 500);
        }, 2000);
    };

    // =====================================================
    // NOTIFICATION SYSTEM
    // =====================================================
    function showNotification(message, type = 'success') {
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

        document.body.appendChild(notification);

        notification.querySelector('.notification__close').addEventListener('click', () => {
            notification.remove();
        });

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.4s ease reverse';
            setTimeout(() => notification.remove(), 400);
        }, 5000);
    }

    // =====================================================
    // FORM INPUT ANIMATIONS
    // =====================================================
    const formInputs = document.querySelectorAll('.form__group input, .form__group textarea, .form__group select');

    formInputs.forEach(input => {
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

        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });

    // =====================================================
    // SCROLL PROGRESS BAR
    // =====================================================
    const createScrollProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }, { passive: true });
    };

    createScrollProgress();

    // =====================================================
    // SECTION REVEAL ON SCROLL
    // =====================================================
    const revealSections = () => {
        const sectionElements = document.querySelectorAll('section');

        sectionElements.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight * 0.85) {
                section.classList.add('section-visible');
            }
        });
    };

    window.addEventListener('scroll', revealSections, { passive: true });
    revealSections();


});
