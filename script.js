// ===================================
// NAVIGATION
// ===================================

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect (only if navbar exists)
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Mobile menu toggle (only if elements exist)
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
if (hamburger && navMenu && navLinks.length) {
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Smooth scroll for navigation links
if (navLinks.length) {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===================================
// TESTIMONIALS SLIDER
// ===================================

function initTestimonialsSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const sliderDotsContainer = document.getElementById('sliderDots');

    // Vérifier que les éléments existent
    if (!testimonialCards.length || !prevBtn || !nextBtn || !sliderDotsContainer) {
        return;
    }

    let currentSlide = 0;
    const totalSlides = testimonialCards.length;

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        sliderDotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.dot');

    function updateSlider() {
        testimonialCards.forEach((card, index) => {
            card.classList.remove('active');
            if (index === currentSlide) {
                card.classList.add('active');
            }
        });
        
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentSlide) {
                dot.classList.add('active');
            }
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto-slide every 5 seconds
    setInterval(nextSlide, 5000);
}

// Initialiser le slider quand le DOM est chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestimonialsSlider);
} else {
    initTestimonialsSlider();
}

// ===================================
// CONTACT FORM
// ===================================

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    // Simulate form submission
    alert(`Merci ${name} ! Votre message a été envoyé avec succès.\n\nNous vous contacterons bientôt à l'adresse : ${email}`);
    
    // Reset form
    contactForm.reset();
});

// ===================================
// SCROLL ANIMATIONS
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate elements on scroll
const animateOnScroll = document.querySelectorAll('.watch-card, .craft-card, .timeline-item, .philosophy-content');

animateOnScroll.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// ===================================
// PARALLAX EFFECT
// ===================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-content, .hero-overlay');
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===================================
// FICHE PRODUIT - MODALE
// ===================================

const watchCards = document.querySelectorAll('.watch-card');
const productModal = document.getElementById('productModal');
const productModalName = document.getElementById('productModalName');
const productModalPrice = document.getElementById('productModalPrice');
const productModalClose = document.getElementById('productModalClose');
const productModalBackdrop = document.getElementById('productModalBackdrop');

function openProductModal(card) {
    if (!productModal || !productModalName || !productModalPrice) return;

    const name = card.querySelector('.watch-name')?.textContent || '';
    const price = card.querySelector('.watch-price')?.textContent || '';

    productModalName.textContent = name;
    productModalPrice.textContent = price;

    productModal.classList.add('open');
    productModal.setAttribute('aria-hidden', 'false');
}

function closeProductModal() {
    if (!productModal) return;
    productModal.classList.remove('open');
    productModal.setAttribute('aria-hidden', 'true');
}

watchCards.forEach(card => {
    card.addEventListener('click', () => openProductModal(card));
});

if (productModalClose) {
    productModalClose.addEventListener('click', closeProductModal);
}

if (productModalBackdrop) {
    productModalBackdrop.addEventListener('click', closeProductModal);
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProductModal();
    }
});

// ===================================
// WATCH IMAGE LOADING
// ===================================

// Lazy load watch images for better performance
const watchImages = document.querySelectorAll('.watch-img');
watchImages.forEach(img => {
    img.addEventListener('load', () => {
        img.style.opacity = '1';
    });
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease-in';
});

// ===================================
// PRELOADER (Optional Enhancement)
// ===================================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

// ===================================
// ACTIVE NAVIGATION INDICATOR
// ===================================

const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.style.color = '#d4af37';
                } else {
                    link.style.color = '';
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Lazy loading for images (if you add real images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===================================
// PARTICULES DORÉES ANIMÉES
// ===================================

function createLuxuryParticles() {
    const particlesContainer = document.getElementById('luxuryParticles');
    if (!particlesContainer) return;

    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Position aléatoire
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        
        // Taille variée
        const size = 2 + Math.random() * 3;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particlesContainer.appendChild(particle);
    }
}

// ===================================
// ANIMATIONS AU SCROLL DEPUIS LA DROITE
// ===================================

const scrollObserverText = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
});

const scrollObserverImg = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

// Appliquer les animations au scroll
document.addEventListener('DOMContentLoaded', () => {
    // Textes qui apparaissent depuis la droite
    const textsToAnimate = document.querySelectorAll(
        '.philosophy-text, .philosophy-content, .about-text, .about-content, ' +
        '.section-title, .section-label, .watch-name, .watch-price, ' +
        '.craft-card h3, .craft-card p, .testimonial-text, .contact-text, ' +
        '.about-tagline, .section-header, .watch-info'
    );
    textsToAnimate.forEach(el => {
        el.classList.add('slide-in-right');
        scrollObserverText.observe(el);
    });
    
    // Images qui apparaissent depuis la droite (dans les watch-card et ailleurs)
    const imagesToAnimate = document.querySelectorAll(
        '.watch-card img.watch-img, .about-image, .craft-icon, .watch-img'
    );
    imagesToAnimate.forEach(img => {
        img.classList.add('slide-in-right-img');
        scrollObserverImg.observe(img);
    });
    
    // Créer les particules
    createLuxuryParticles();
});

// ===================================
// EFFET SCROLL FIXE - SECTION QUI MONTE
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    let ticking = false;

    function updateScrollEffect() {
        const scrolled = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        
        // Trouver la position de la section collection
        const collectionSection = document.querySelector('.collection');
        // La collection commence après la philosophy (2 * windowHeight)
        const collectionStart = windowHeight * 2;
        
        // Faire monter la section philosophy pour remplacer le hero
        const philosophySection = document.querySelector('.philosophy');
        if (philosophySection) {
            // Calculer la position : quand on scroll, la section monte depuis le bas
            // Quand scrolled = 0, la section est à top: 100vh (en bas, invisible)
            // Quand scrolled = windowHeight, la section est à top: 0vh (en haut, visible)
            // Une fois arrivée (scrolled >= windowHeight), elle reste à top: 0vh
            // Mais une fois qu'on arrive au début de la collection, on la fait disparaître
            let topPosition;
            let opacity = 1;
            
            let scale = 1;
            let blur = 0;
            
            if (scrolled < windowHeight) {
                // Phase 1 : La section monte avec effet de transition marqué
                const progress = Math.min(1, Math.max(0, scrolled / windowHeight));
                topPosition = 100 - (progress * 100);
                
                // Effet de scale (zoom) : commence à 0.8 et arrive à 1
                // Utilise une courbe d'ease-out pour un effet plus naturel
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                scale = 0.8 + (easeOutCubic * 0.2);
                
                // Effet de blur qui se dissipe : commence à 20px et arrive à 0
                blur = 20 * (1 - easeOutCubic);
                
                // Opacité qui augmente progressivement
                opacity = Math.min(1, progress * 1.2);
            } else if (scrolled < collectionStart - windowHeight * 0.5) {
                // Phase 2 : La section reste en place pendant qu'on scroll dans la collection
                topPosition = 0;
                opacity = 1;
                scale = 1;
                blur = 0;
            } else {
                // Phase 3 : On arrive au début de la collection, faire disparaître la section
                const fadeStart = collectionStart - windowHeight * 0.5;
                const fadeEnd = collectionStart;
                const fadeRange = fadeEnd - fadeStart;
                if (fadeRange > 0) {
                    const fadeProgress = Math.min(1, Math.max(0, (scrolled - fadeStart) / fadeRange));
                    opacity = 1 - fadeProgress;
                    // Légère réduction de scale lors de la disparition
                    scale = 1 - (fadeProgress * 0.1);
                } else {
                    opacity = 0;
                    scale = 0.9;
                }
                topPosition = 0;
                blur = 0;
            }
            
            // Appliquer la transformation avec requestAnimationFrame pour fluidité
            philosophySection.style.top = `${topPosition}vh`;
            philosophySection.style.opacity = opacity;
            philosophySection.style.transform = `translateZ(0) scale(${scale})`;
            philosophySection.style.filter = `blur(${blur}px)`;
            philosophySection.style.willChange = 'top, opacity, transform, filter';
            
            // Animation du contenu avec un léger délai et slide
            const philosophyContent = philosophySection.querySelector('.philosophy-content');
            if (philosophyContent) {
                if (scrolled < windowHeight) {
                    const progress = Math.min(1, Math.max(0, scrolled / windowHeight));
                    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                    // Le contenu slide depuis la droite avec un léger délai
                    const contentProgress = Math.max(0, (progress - 0.2) / 0.8); // Commence à 20% du scroll
                    const contentEase = 1 - Math.pow(1 - contentProgress, 3);
                    const translateX = (1 - contentEase) * 100;
                    const contentOpacity = Math.min(1, contentProgress * 1.5);
                    philosophyContent.style.transform = `translateX(${translateX}px) translateZ(0)`;
                    philosophyContent.style.opacity = contentOpacity;
                } else if (scrolled < collectionStart - windowHeight * 0.5) {
                    philosophyContent.style.transform = 'translateX(0) translateZ(0)';
                    philosophyContent.style.opacity = 1;
                } else {
                    const fadeStart = collectionStart - windowHeight * 0.5;
                    const fadeEnd = collectionStart;
                    const fadeRange = fadeEnd - fadeStart;
                    if (fadeRange > 0) {
                        const fadeProgress = Math.min(1, Math.max(0, (scrolled - fadeStart) / fadeRange));
                        philosophyContent.style.opacity = 1 - fadeProgress;
                        philosophyContent.style.transform = `translateX(${fadeProgress * -50}px) translateZ(0)`;
                    } else {
                        philosophyContent.style.opacity = 0;
                    }
                }
            }
        }
        
        // Faire disparaître progressivement le contenu du hero
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            if (scrolled <= windowHeight) {
                const opacity = Math.max(0, 1 - (scrolled / (windowHeight * 0.7)));
                heroContent.style.opacity = opacity;
                heroContent.style.transform = `translateY(${scrolled * 0.3}px) translateZ(0)`;
            } else {
                heroContent.style.opacity = 0;
            }
        }
        
        // Faire glisser la section collection depuis la gauche pour remplacer la philosophy
        if (collectionSection) {
            // Calculer quand commencer l'animation : transition plus longue pour ralentir
            const transitionStart = collectionStart - windowHeight * 1.2; // Commence plus tôt
            const transitionEnd = collectionStart + windowHeight * 0.3; // Se termine plus tard
            const transitionRange = transitionEnd - transitionStart;
            
            let translateX = -100; // Commence complètement à gauche
            let translateY = 0;
            
            if (scrolled < transitionStart) {
                // Avant la transition : la collection reste cachée à gauche
                translateX = -100;
                translateY = 0;
            } else if (scrolled >= transitionStart && scrolled <= transitionEnd) {
                // Pendant la transition : la collection glisse depuis la gauche (plus lentement)
                const progress = (scrolled - transitionStart) / transitionRange;
                // Utiliser une courbe plus douce pour ralentir l'animation
                const easeInOutCubic = progress < 0.5 
                    ? 4 * progress * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                translateX = -100 + (easeInOutCubic * 100); // De -100% à 0%
                translateY = 0;
            } else {
                // Après la transition : la collection est en place, puis monte pour révéler les sections suivantes
                translateX = 0;
                // Calculer combien on a scrollé après la transition
                const scrollAfterTransition = scrolled - transitionEnd;
                // La collection monte pour révéler les sections en dessous
                translateY = -scrollAfterTransition;
            }
            
            collectionSection.style.transform = `translateX(${translateX}%) translateY(${translateY}px) translateZ(0)`;
            collectionSection.style.willChange = 'transform';
        }
        
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateScrollEffect);
            ticking = true;
        }
    }, { passive: true });

    // Initialiser au chargement
    updateScrollEffect();
});

console.log('🕐 Machiavelli - L\'Art du Temps - Site chargé avec succès');

