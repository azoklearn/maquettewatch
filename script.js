// ===================================
// PERFORMANCE OPTIMIZATIONS
// ===================================

// Détecter uniquement les très anciens appareils (pour désactiver uniquement les animations lourdes de scroll)
const isVeryOldDevice = () => {
    const ua = navigator.userAgent;
    // Détecter uniquement les très anciennes versions
    const isVeryOldIOS = /iPhone OS [0-9]|iPhone OS 1[0-1]/.test(ua);
    const isVeryOldAndroid = /Android [0-3]\./.test(ua);
    const isSlowConnection = navigator.connection && (
        navigator.connection.effectiveType === 'slow-2g' || 
        navigator.connection.effectiveType === '2g'
    );
    return isVeryOldIOS || isVeryOldAndroid || isSlowConnection;
};

// Préférence utilisateur pour réduire les animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const shouldReduceScrollAnimations = isVeryOldDevice() || prefersReducedMotion;

// Appliquer la classe uniquement pour les très anciens appareils
if (shouldReduceScrollAnimations) {
    document.documentElement.classList.add('reduce-motion');
}

// Fonctions utilitaires pour debounce et throttle
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===================================
// NAVIGATION
// ===================================

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Menu en grand pour navbar-minimal
const menuToggle = document.getElementById('menuToggle');
const fullMenu = document.getElementById('fullMenu');

if (menuToggle && fullMenu) {
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        fullMenu.classList.toggle('active');
        document.body.style.overflow = fullMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Bouton de fermeture
    const menuClose = document.getElementById('menuClose');
    if (menuClose) {
        menuClose.addEventListener('click', () => {
            fullMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Gérer les sous-menus (pour mobile et desktop)
    const menuItemsWithSubmenu = fullMenu.querySelectorAll('.nav-menu-item-with-submenu > .nav-minimal-item');
    menuItemsWithSubmenu.forEach(item => {
        const parent = item.closest('.nav-menu-item-with-submenu');
        if (parent) {
            item.addEventListener('click', (e) => {
                // Sur mobile, toggle le sous-menu au clic
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    parent.classList.toggle('active');
                }
            });
        }
    });

    // Fermer le menu quand on clique sur un lien (sauf les items avec sous-menu)
    const menuItems = fullMenu.querySelectorAll('.nav-minimal-item:not(.nav-menu-item-with-submenu > .nav-minimal-item)');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            fullMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Fermer le menu quand on clique sur un sous-menu item
    const submenuItems = fullMenu.querySelectorAll('.nav-submenu-item');
    submenuItems.forEach(item => {
        item.addEventListener('click', () => {
            fullMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Fermer le menu quand on clique en dehors
    fullMenu.addEventListener('click', (e) => {
        if (e.target === fullMenu) {
            fullMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Navbar scroll effect (only if navbar exists) - Optimisé avec throttle
if (navbar) {
    const handleScroll = throttle(() => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
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

let testimonialsSliderInitialized = false;

function initTestimonialsSlider() {
    // Éviter l'initialisation multiple
    if (testimonialsSliderInitialized) {
        return;
    }
    
    const testimonialsSection = document.querySelector('.testimonials-slider');
    if (!testimonialsSection) {
        return;
    }
    
    const testimonialCards = testimonialsSection.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const sliderDotsContainer = document.getElementById('sliderDots');

    // Vérifier que les éléments existent
    if (!testimonialCards.length || !prevBtn || !nextBtn || !sliderDotsContainer) {
        return;
    }

    // Vider le conteneur des dots pour éviter les doublons
    sliderDotsContainer.innerHTML = '';

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

    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        nextSlide();
    });
    
    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        prevSlide();
    });

    // Auto-slide every 5 seconds
    setInterval(nextSlide, 5000);
    
    testimonialsSliderInitialized = true;
}

// Initialiser le slider quand le DOM est chargé
function initSliderWhenReady() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initTestimonialsSlider, 100);
        });
    } else {
        setTimeout(initTestimonialsSlider, 100);
    }
}

// Essayer plusieurs fois pour s'assurer que les éléments sont disponibles
window.addEventListener('load', () => {
    setTimeout(initTestimonialsSlider, 200);
});

initSliderWhenReady();

// ===================================
// CONTACT FORM
// ===================================
// Formulaire de contact supprimé

// ===================================
// SCROLL ANIMATIONS
// ===================================

// Options optimisées pour observer - garder les animations smooth
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

// Désactiver le parallax uniquement sur très anciens appareils
// Garder le parallax smooth sur la plupart des appareils
const handleParallax = throttle(() => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-content, .hero-overlay');
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
}, 16); // ~60fps

// Désactiver uniquement sur très anciens appareils
if (!shouldReduceScrollAnimations) {
    window.addEventListener('scroll', handleParallax, { passive: true });
}

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

// Optimiser updateActiveNav avec throttle
const handleActiveNav = throttle(updateActiveNav, 100);
window.addEventListener('scroll', handleActiveNav, { passive: true });

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Lazy loading optimisé pour images avec IntersectionObserver
if ('IntersectionObserver' in window) {
    const imageObserverOptions = {
        rootMargin: '50px', // Charger les images 50px avant qu'elles soient visibles
        threshold: 0.01
    };
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    }, imageObserverOptions);
    
    // Observer toutes les images avec loading="lazy" ou classe lazy
    const lazyImages = document.querySelectorAll('img[loading="lazy"], img.lazy');
    lazyImages.forEach(img => {
        // S'assurer que les images ont bien l'attribut loading
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        imageObserver.observe(img);
    });
}

// Optimiser les images uniquement sur très anciens appareils
if (shouldReduceScrollAnimations) {
    // Charger immédiatement les images au-dessus de la ligne de flottaison
    const aboveFoldImages = document.querySelectorAll('img[loading="lazy"]');
    aboveFoldImages.forEach((img, index) => {
        if (index < 3) { // Charger les 3 premières images immédiatement
            img.removeAttribute('loading');
        }
    });
}

// ===================================
// PARTICULES DORÉES ANIMÉES
// ===================================

function createLuxuryParticles() {
    // Désactiver les particules uniquement sur très anciens appareils
    if (shouldReduceScrollAnimations) {
        return;
    }
    
    const particlesContainer = document.getElementById('luxuryParticles');
    if (!particlesContainer) return;

    // Réduire légèrement le nombre de particules sur mobile (mais garder l'animation)
    const particleCount = window.innerWidth <= 768 ? 10 : 15;
    
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

// Options optimisées pour IntersectionObserver - garder les animations smooth
const scrollObserverOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const scrollObserverText = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
            entry.target.classList.add('visible');
            // Désactiver l'observer après la première animation pour éviter les doubles déclenchements
            scrollObserverText.unobserve(entry.target);
        }
    });
}, scrollObserverOptions);

const scrollObserverImg = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
            entry.target.classList.add('visible');
            // Désactiver l'observer après la première animation pour éviter les doubles déclenchements
            scrollObserverImg.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

// Appliquer les animations au scroll
document.addEventListener('DOMContentLoaded', () => {
    // Section Notre Vision : AUCUNE animation au scroll
    const philosophySection = document.querySelector('.philosophy');
    if (philosophySection) {
        const philosophyElements = philosophySection.querySelectorAll('.section-label, .section-title, .philosophy-text, .philosophy-content, .catalogue-button');
        philosophyElements.forEach(el => {
            // Pas d'animation, les éléments sont visibles directement
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
    
    // Textes qui apparaissent depuis la droite (en excluant ceux déjà traités dans philosophy)
    const textsToAnimate = document.querySelectorAll(
        '.about-text, .about-content, ' +
        '.watch-name, .watch-price, ' +
        '.craft-card h3, .craft-card p, .testimonial-text, .contact-text, ' +
        '.about-tagline, .section-header, .watch-info, ' +
        '.collection .section-title, .collection .section-label, .collection-text'
    );
    textsToAnimate.forEach(el => {
        // Vérifier que l'élément n'est pas dans la section philosophy
        if (!el.closest('.philosophy')) {
            // Vérifier si l'élément est déjà visible dans le viewport pour éviter le flash
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && rect.top < window.innerHeight * 0.5) {
                // Si l'élément est déjà visible, l'animer immédiatement sans observer
                el.classList.add('slide-in-right', 'visible');
            } else {
                // Sinon, ajouter l'animation et observer
                el.classList.add('slide-in-right');
                scrollObserverText.observe(el);
            }
        }
    });
    
    // Images qui apparaissent depuis la droite (dans les watch-card et ailleurs)
    const imagesToAnimate = document.querySelectorAll(
        '.watch-card img.watch-img, .about-image, .craft-icon, .watch-img'
    );
    imagesToAnimate.forEach(img => {
        // Vérifier si l'image est déjà visible dans le viewport pour éviter le flash
        const rect = img.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && rect.top < window.innerHeight * 0.5) {
            // Si l'image est déjà visible, l'animer immédiatement sans observer
            img.classList.add('slide-in-right-img', 'visible');
        } else {
            // Sinon, ajouter l'animation et observer
            img.classList.add('slide-in-right-img');
            scrollObserverImg.observe(img);
        }
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
        
        // Section collection sans animation en diagonale
        if (collectionSection) {
            // La section collection reste statique, sans animation de glissement
            collectionSection.style.transform = 'translateX(0) translateY(0) translateZ(0)';
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

// ===================================
// ÉCRAN D'ENTRÉE AVEC VIDÉO
// ===================================

// Toujours commencer en haut de la page
window.scrollTo({ top: 0, behavior: 'instant' });

// Intro masquée par défaut (conformité Better Ads) — pas de loading au chargement
function hideEntrance() {
    const doorEntrance = document.getElementById('doorEntrance');
    
    // Toujours scroller vers le haut de la page
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    if (doorEntrance) {
        // Ajouter la classe hidden pour déclencher la transition fade-out
        doorEntrance.classList.add('hidden');
        
        // Retirer la classe loading immédiatement pour révéler le site
        document.body.classList.remove('loading');
    } else {
        // Fallback si pas d'écran d'entrée
        document.body.classList.remove('loading');
    }
    
    // S'assurer qu'on reste en haut après un court délai
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, 100);
}

// Afficher l'intro (au clic sur "Watch intro")
function showEntrance() {
    const doorEntrance = document.getElementById('doorEntrance');
    const doorIntro = document.getElementById('doorIntro');
    const storeVideo = document.getElementById('storeVideo');
    const welcomeText = document.getElementById('welcomeText');
    const doorLogoImage = document.getElementById('doorLogoImage');
    if (doorEntrance) {
        doorEntrance.classList.remove('hidden');
        document.body.classList.add('loading');
        window.scrollTo({ top: 0, behavior: 'instant' });
    }
    if (doorIntro) doorIntro.style.display = '';
    if (storeVideo) {
        storeVideo.style.display = 'none';
        storeVideo.pause();
        storeVideo.currentTime = 0;
    }
    if (welcomeText) welcomeText.style.opacity = '1';
    if (doorLogoImage) doorLogoImage.classList.remove('no-blur');
}

window.addEventListener('load', () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.body.classList.remove('loading');

    const watchIntroBtn = document.getElementById('watchIntroButton');
    if (watchIntroBtn) {
        watchIntroBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showEntrance();
        });
    }

    const storeVideo = document.getElementById('storeVideo');
    const doorEntrance = document.getElementById('doorEntrance');
    
    if (doorEntrance) {
        doorEntrance.addEventListener('click', (e) => {
            const skipButton = e.target.closest('#skipIntroButton');
            if (skipButton) {
                e.preventDefault();
                e.stopPropagation();
                hideEntrance();
            }
        });
        
        doorEntrance.addEventListener('click', (e) => {
            const enterBtn = e.target.closest('#enterButton');
            if (enterBtn) {
                e.preventDefault();
                e.stopPropagation();
                const doorLogoImage = document.getElementById('doorLogoImage');
                const welcomeText = document.getElementById('welcomeText');
                const doorIntro = document.getElementById('doorIntro');
                
                if (welcomeText) welcomeText.style.opacity = '0';
                
                if (doorLogoImage) {
                    doorLogoImage.classList.add('no-blur');
                    setTimeout(() => {
                        if (doorIntro) doorIntro.style.display = 'none';
                        if (storeVideo) {
                            storeVideo.style.display = 'block';
                            storeVideo.playbackRate = 1.5;
                            storeVideo.play();
                        }
                    }, 500);
                } else {
                    if (doorIntro) doorIntro.style.display = 'none';
                    if (storeVideo) {
                        storeVideo.style.display = 'block';
                        storeVideo.playbackRate = 1.5;
                        storeVideo.play();
                    }
                }
            }
        });
    }
    
    if (storeVideo) {
        storeVideo.load();
        storeVideo.addEventListener('ended', hideEntrance);
        storeVideo.addEventListener('error', hideEntrance);
    }
});

if (document.readyState === 'complete') {
    document.body.classList.remove('loading');
    const watchIntroBtn = document.getElementById('watchIntroButton');
    if (watchIntroBtn) {
        watchIntroBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showEntrance();
        });
    }
}

// ===================================
// TRANSLATION SYSTEM
// ===================================

const translations = {
    fr: {
        // Navigation
        'MENU': 'MENU',
        'STOCK': 'STOCK',
        'CONTACT': 'CONTACT',
        'Home': 'Accueil',
        'HOME': 'ACCUEIL',
        'Catalogue': 'Catalogue',
        'Watches': 'Montres',
        'Jewelry': 'Bijoux',
        'Leather Goods': 'Maroquinerie',
        'About': 'À propos',
        'Sell your watches': 'Vendez vos montres',
        'Find my watch': 'Sourcer ma montre',
        'Source my watch': 'Sourcer ma montre',
        'Our Socials': 'Nos réseaux',
        // Intro
        'Skip': 'Passer',
        'Welcome to': 'Bienvenue chez',
        'ENTER': 'ENTRER',
        'WATCH INTRO': 'VOIR L\'INTRO',
        // Hero
        'OUR STOCK': 'NOTRE STOCK',
        // Philosophy
        'Our Vision': 'Notre Vision',
        'Welcome to Machiavelli': 'Bienvenue chez Machiavelli',
        'We are your premier destination for luxury timepieces. Based in Liège, Belgium, we specialize in the trading and resale of exclusive watches, connecting collectors and enthusiasts worldwide.\nWith a commitment to quality and authenticity, we curate a selection of the finest timepieces, ensuring that every purchase reflects our passion for excellence.': 'Nous sommes votre destination de choix pour les montres de luxe. Basés à Liège, en Belgique, nous nous spécialisons dans le commerce et la revente de montres exclusives, connectant collectionneurs et passionnés du monde entier.\nAvec un engagement envers la qualité et l\'authenticité, nous sélectionnons les plus belles montres, garantissant que chaque achat reflète notre passion pour l\'excellence.',
        // Store
        'Boutique': 'Boutique',
        'Our Store': 'Notre Boutique',
        'We welcome you to our boutique at Passage Lemonnier in the center of Liège from Tuesday to Saturday from 10am to 6pm.': 'Nous vous accueillons dans notre boutique Passage Lemonnier dans le centre de Liège du mardi au samedi de 10h à 18h.',
        // Selection
        'Selection of Watches': 'Sélection de montres',
        'All Watches': 'Toutes nos montres',
        'All Our Watches': 'Toutes nos montres',
        'Search': 'Rechercher',
        'Search for a specific model or let yourself be inspired by our catalog': 'Recherchez un modèle spécifique ou laissez-vous inspirer par notre catalogue',
        'Search for a watch...': 'Rechercher une montre...',
        'All Brands': 'Toutes les marques',
        'All brands': 'Toutes les marques',
        'All Types': 'Tous les types',
        'All types': 'Tous les types',
        'Sort by': 'Trier par',
        'Price: Low to High': 'Prix : Croissant',
        'Price: High to Low': 'Prix : Décroissant',
        'Name A-Z': 'Nom : A-Z',
        'Name: A-Z': 'Nom : A-Z',
        'Name: Z-A': 'Nom : Z-A',
        'Other': 'Autre',
        // Latest additions
        'Latest Additions': 'Derniers Ajouts',
        // Footer
        'Belgium': 'Belgique',
        'Legal Notice': 'Mentions Légales',
        'Privacy': 'Confidentialité',
        // Watch detail pages
        'Reference': 'Référence',
        'Date': 'Date',
        'Condition': 'Condition',
        'Set': 'Set',
        'FULL SET': 'SET COMPLET',
        'I am interested': 'Je suis intéressé',
        'Back to catalog': 'Retour au catalogue',
        // Common watch descriptions
        'The Rolex Daytona Platinum embodies Swiss watchmaking excellence. This exceptional piece combines technical precision and refined aesthetics, representing the pinnacle of watchmaking craftsmanship.': 'La Rolex Daytona Platinum incarne l\'excellence de l\'horlogerie suisse. Cette pièce exceptionnelle allie précision technique et esthétique raffinée, représentant le summum de l\'art horloger.',
        'The chronometer-certified chronograph movement ensures remarkable precision, while the platinum case gives this watch a unique and prestigious character.': 'Le mouvement chronographe certifié chronomètre assure une précision remarquable, tandis que le boîtier en platine confère à cette montre un caractère unique et prestigieux.',
        // Generic watch description patterns
        'embodies Swiss watchmaking excellence': 'incarne l\'excellence de l\'horlogerie suisse',
        'This exceptional piece combines technical precision and refined aesthetics, representing the pinnacle of watchmaking craftsmanship.': 'Cette pièce exceptionnelle allie précision technique et esthétique raffinée, représentant le summum de l\'art horloger.',
        'The certified movement ensures remarkable precision, while the refined design gives this watch a unique and prestigious character.': 'Le mouvement certifié assure une précision remarquable, tandis que le design raffiné confère à cette montre un caractère unique et prestigieux.',
        'The chronometer-certified chronograph movement ensures remarkable precision': 'Le mouvement chronographe certifié chronomètre assure une précision remarquable',
        'while the platinum case gives this watch a unique and prestigious character.': 'tandis que le boîtier en platine confère à cette montre un caractère unique et prestigieux.',
        'while the refined design gives this watch a unique and prestigious character.': 'tandis que le design raffiné confère à cette montre un caractère unique et prestigieux.',
        // About page
        'HOME': 'ACCUEIL',
        'Who I am': 'Qui je suis',
        'Your dream is in good hands.': 'Votre rêve est entre de bonnes mains.',
        'Time is a Choice': 'Le temps est un choix',
        'Machiavelli selects and resells prestigious watches from the finest watchmaking houses. \n                    We do not create timepieces, we choose the most desired, rarest, and most relevant ones \n                    for our clients, based on a deep understanding of the market and trends.': 'Machiavelli sélectionne et revend des montres prestigieuses des plus grandes maisons horlogères. \n                    Nous ne créons pas de montres, nous choisissons les plus désirées, les plus rares et les plus pertinentes \n                    pour nos clients, en nous basant sur une compréhension approfondie du marché et des tendances.',
        'Machiavelli selects and resells prestigious watches from the finest watchmaking houses. We do not create timepieces, we choose the most desired, rarest, and most relevant ones for our clients, based on a deep understanding of the market and trends.': 'Machiavelli sélectionne et revend des montres prestigieuses des plus grandes maisons horlogères. Nous ne créons pas de montres, nous choisissons les plus désirées, les plus rares et les plus pertinentes pour nos clients, en nous basant sur une compréhension approfondie du marché et des tendances.',
        'Authenticity': 'Authenticité',
        'Authentic Pieces': 'Des pièces authentiques',
        'All our models are authenticated by a trusted and verified expert. \n                    This certification guarantees the authenticity and quality of each piece in our collection, \n                    giving you peace of mind and the confidence needed to invest in horological excellence.': 'Tous nos modèles sont authentifiés par un expert horloger reconnu et vérifié. \n                    Cette certification garantit l\'authenticité et la qualité de chaque pièce de notre collection, \n                    vous offrant la tranquillité d\'esprit et la confiance nécessaires pour investir dans l\'excellence horlogère.',
        'All our models are authenticated by a trusted and verified expert. This certification guarantees the authenticity and quality of each piece in our collection, giving you peace of mind and the confidence needed to invest in horological excellence.': 'Tous nos modèles sont authentifiés par un expert horloger reconnu et vérifié. Cette certification garantit l\'authenticité et la qualité de chaque pièce de notre collection, vous offrant la tranquillité d\'esprit et la confiance nécessaires pour investir dans l\'excellence horlogère.',
        'by a trusted and verified expert': 'par un expert horloger reconnu et vérifié',
        // Nizar's bio text
        '« I have spent years perfecting the art of buying and reselling, developing a deep understanding of market trends and value assessment. With a keen eye for high-demand products and the ability to make strategic acquisitions, I help my clients and partners maximize their returns through informed resale strategies.': '« J\'ai passé des années à perfectionner l\'art de l\'achat et de la revente, développant une compréhension approfondie des tendances du marché et de l\'évaluation de la valeur. Avec un œil aiguisé pour les produits à forte demande et la capacité d\'effectuer des acquisitions stratégiques, j\'aide mes clients et partenaires à maximiser leurs rendements grâce à des stratégies de revente éclairées.',
        'My expertise lies in identifying market opportunities and anticipating developments, which allows me to make sound, data-driven decisions. Over time, I have built a reputation based on integrity and precision, ensuring that every transaction I oversee meets the highest standards of quality and transparency.': 'Mon expertise réside dans l\'identification des opportunités de marché et l\'anticipation des évolutions, ce qui me permet de prendre des décisions solides et basées sur les données. Au fil du temps, j\'ai construit une réputation basée sur l\'intégrité et la précision, garantissant que chaque transaction que je supervise répond aux normes les plus élevées de qualité et de transparence.',
        'Whether it\'s luxury products, collectible pieces, or unique high-value items, my approach is guided by a passion for excellence and a total commitment to my clients\' satisfaction. I take pride in delivering results that reflect my years of experience and dedication to the art of buying and reselling. »': 'Qu\'il s\'agisse de produits de luxe, de pièces de collection ou d\'articles uniques de grande valeur, mon approche est guidée par une passion pour l\'excellence et un engagement total envers la satisfaction de mes clients. Je suis fier de fournir des résultats qui reflètent mes années d\'expérience et mon dévouement à l\'art de l\'achat et de la revente. »',
        // Contact page
        'Contact Us': 'Contactez-nous',
        'Send us a message': 'Envoyez-nous un message',
        'Message': 'Message',
        'Send': 'Envoyer',
        'Follow us': 'Suivez-nous',
        // Find my watch page
        'Watch Search': 'Recherche de montres',
        'Find my watch': 'Sourcer ma montre',
        'Source my watch': 'Sourcer ma montre',
        'Tell us what you\'re looking for': 'Dites-nous ce que vous recherchez',
        'Looking for a specific watch? Fill out the form below with your requirements and we will do our best to find it for you.': 'Vous recherchez une montre spécifique ? Remplissez le formulaire ci-dessous avec vos critères et nous ferons de notre mieux pour la trouver.',
        'Preferred Condition': 'Condition préférée',
        'Any condition': 'Toute condition',
        'Maximum Budget (€)': 'Budget maximum (€)',
        'Additional Requirements': 'Exigences supplémentaires',
        'Send request': 'Envoyer la demande',
        '1. Submit your request': '1. Soumettez votre demande',
        'Fill out the form with as much detail as possible about the watch you\'re looking for. The more information you provide, the better we can assist you.': 'Remplissez le formulaire avec le plus de détails possible sur la montre que vous recherchez. Plus vous fournissez d\'informations, mieux nous pourrons vous aider.',
        '2. Pay the deposit (defined by the seller) to start the search': '2. Régler l\'acompte (défini par le vendeur) pour démarrer la recherche',
        'Once we receive your request, we will contact you to arrange payment of a deposit. This deposit will initiate our search process.': 'Une fois votre demande reçue, nous vous contacterons pour organiser le paiement d\'un acompte. Cet acompte lancera notre processus de recherche.',
        '3. We search for you': '3. Nous recherchons pour vous',
        'Our team will search through our network and inventory to find the watch that matches your criteria. We\'ll contact you as soon as we have news.': 'Notre équipe recherchera dans notre réseau et notre inventaire pour trouver la montre qui correspond à vos critères. Nous vous contacterons dès que nous aurons des nouvelles.',
        '4. We contact you': '4. Nous vous contactons',
        'When we find a watch that matches your request, we\'ll contact you with all the details and photos so you can make an informed decision.': 'Lorsque nous trouvons une montre qui correspond à votre demande, nous vous contactons avec tous les détails et photos afin que vous puissiez prendre une décision éclairée.',
        // Sell your watch page
        'Watch Sales': 'Vente de montres',
        'Sell your watches': 'Vendez vos montres',
        'Propose your watch to us': 'Proposez-nous votre montre',
        'We are always looking for exceptional pieces to enrich our collection. \n                        If you own a quality watch that you would like to sell, please do not hesitate to contact us.': 'Nous recherchons toujours des pièces exceptionnelles pour enrichir notre collection. \n                        Si vous possédez une montre de qualité que vous souhaitez vendre, n\'hésitez pas à nous contacter.',
        'Desired Price (€)': 'Prix souhaité (€)',
        'Additional Details': 'Détails supplémentaires',
        'Send proposal': 'Envoyer la proposition',
        'How it works?': 'Comment ça marche ?',
        '1. Propose your watch': '1. Proposez votre montre',
        'Fill out the form with detailed information about your watch. The more precise the information, the better we can make you an appropriate offer.': 'Remplissez le formulaire avec des informations détaillées sur votre montre. Plus les informations sont précises, mieux nous pourrons vous faire une offre appropriée.',
        '2. Evaluation': '2. Évaluation',
        'Our experts will review your proposal and contact you as soon as possible to discuss your watch and make you an offer.': 'Nos experts examineront votre proposition et vous contacteront dans les plus brefs délais pour discuter de votre montre et vous faire une offre.',
        '3. Transaction': '3. Transaction',
        'If our offer suits you, we organize the transaction in a secure and transparent manner.': 'Si notre offre vous convient, nous organisons la transaction de manière sécurisée et transparente.',
        'Direct Contact': 'Contact direct',
        'Do you prefer to contact us directly?': 'Préférez-vous nous contacter directement ?',
        // Our socials page
        'Social Networks': 'Réseaux sociaux',
        'Our Socials': 'Nos réseaux',
        'Follow us for the latest watches and updates': 'Suivez-nous pour les dernières montres et mises à jour',
        'View All on TikTok': 'Voir tout sur TikTok',
        'View All on Instagram': 'Voir tout sur Instagram',
        // Catalogue page
        'Complete Catalog': 'Catalogue complet',
        // Other
        'New': 'Neuf',
        'Excellent': 'Excellent',
        'Very Good': 'Très bon',
        'Good': 'Bon',
        'Fair': 'Correct',
        'Reserved': 'Réservé',
        // Richard Mille RM011 TI description
        'The Richard Mille RM011 TI represents the pinnacle of high-end watchmaking innovation. This exceptional timepiece combines cutting-edge technology with avant-garde design, embodying the brand\'s philosophy of pushing boundaries.': 'La Richard Mille RM011 TI représente le summum de l\'innovation horlogère haut de gamme. Cette pièce exceptionnelle allie technologie de pointe et design avant-gardiste, incarnant la philosophie de la marque qui repousse les limites.',
        'The titanium case ensures exceptional lightness and durability, while the sophisticated chronograph movement delivers remarkable precision. A true collector\'s piece that stands out for its technical excellence and distinctive aesthetic.': 'Le boîtier en titane assure une légèreté et une durabilité exceptionnelles, tandis que le mouvement chronographe sophistiqué offre une précision remarquable. Une véritable pièce de collection qui se distingue par son excellence technique et son esthétique distinctive.',
        // Rolex Daytona Steel description
        'The Rolex Daytona Steel represents the perfect balance between sporty elegance and technical excellence. This iconic chronograph combines timeless design with exceptional performance, making it one of the most sought-after timepieces in the world.': 'La Rolex Daytona Steel représente l\'équilibre parfait entre élégance sportive et excellence technique. Ce chronographe emblématique allie design intemporel et performance exceptionnelle, en faisant l\'une des montres les plus recherchées au monde.',
        'The robust steel case houses a precision chronograph movement, while the classic design ensures this watch remains a timeless classic. A true symbol of watchmaking excellence that transcends trends.': 'Le boîtier robuste en acier abrite un mouvement chronographe de précision, tandis que le design classique garantit que cette montre reste un classique intemporel. Un véritable symbole de l\'excellence horlogère qui transcende les tendances.',
        // Generic watch descriptions - Pattern 1
        'represents the perfect balance between elegance and technical excellence': 'représente l\'équilibre parfait entre élégance et excellence technique',
        'This exceptional timepiece combines timeless design with exceptional performance, making it a true collector\'s piece.': 'Cette pièce exceptionnelle allie design intemporel et performance exceptionnelle, en faisant une véritable pièce de collection.',
        'This exceptional piece combines timeless design with exceptional craftsmanship, making it a true collector\'s item.': 'Cette pièce exceptionnelle allie design intemporel et savoir-faire exceptionnel, en faisant un véritable objet de collection.',
        // Generic watch descriptions - Pattern 2
        'is a highly sought-after timepiece that combines exceptional craftsmanship with iconic design': 'est une montre très recherchée qui allie savoir-faire exceptionnel et design emblématique',
        'This limited edition model represents the perfect fusion of luxury and performance.': 'Ce modèle en édition limitée représente la fusion parfaite entre luxe et performance.',
        'while the distinctive design gives this watch a unique and prestigious character that appeals to collectors worldwide.': 'tandis que le design distinctif confère à cette montre un caractère unique et prestigieux qui séduit les collectionneurs du monde entier.',
        // Generic watch descriptions - Pattern 3
        'The refined design gives this piece a unique and prestigious character.': 'Le design raffiné confère à cette pièce un caractère unique et prestigieux.',
        // Patek Philippe Annual Calendar description
        'The Patek Philippe Annual Calendar 5726 represents the perfect balance between elegance and technical excellence. This exceptional timepiece combines timeless design with exceptional performance, making it a true collector\'s piece.': 'La Patek Philippe Annual Calendar 5726 représente l\'équilibre parfait entre élégance et excellence technique. Cette pièce exceptionnelle allie design intemporel et performance exceptionnelle, en faisant une véritable pièce de collection.',
        // Rolex Daytona John Mayer description
        'The Rolex Daytona John Mayer is a highly sought-after timepiece that combines exceptional craftsmanship with iconic design. This limited edition model represents the perfect fusion of luxury and performance.': 'La Rolex Daytona John Mayer est une montre très recherchée qui allie savoir-faire exceptionnel et design emblématique. Ce modèle en édition limitée représente la fusion parfaite entre luxe et performance.',
        'The chronometer-certified chronograph movement ensures remarkable precision, while the distinctive design gives this watch a unique and prestigious character that appeals to collectors worldwide.': 'Le mouvement chronographe certifié chronomètre assure une précision remarquable, tandis que le design distinctif confère à cette montre un caractère unique et prestigieux qui séduit les collectionneurs du monde entier.'
    }
};

let currentLang = 'en';

function translatePage(lang) {
    if (lang === 'en') {
        // Restore original English content
        localStorage.removeItem('preferredLanguage');
        location.reload();
        return;
    }
    
    if (lang === 'fr' && translations.fr) {
        // Skip translation for mentions-legales.html page
        if (window.location.pathname.includes('mentions-legales.html')) {
            return;
        }
        
        // Ensure CSS is loaded before translating
        const stylesheets = Array.from(document.styleSheets);
        const styleCssLoaded = stylesheets.some(sheet => {
            try {
                return sheet.href && sheet.href.includes('style.css');
            } catch (e) {
                return false;
            }
        });
        
        if (!styleCssLoaded && document.readyState !== 'complete') {
            // CSS not loaded yet, wait and retry
            setTimeout(() => translatePage(lang), 100);
            return;
        }
        
        currentLang = 'fr';
        
        // Function to safely translate text
        function translateText(text) {
            if (!text || typeof text !== 'string') return text;
            const trimmed = text.trim();
            return translations.fr[trimmed] || text;
        }
        
        // 1. Translate menu dropdown items FIRST (before other translations)
        document.querySelectorAll('.nav-minimal-item, .nav-submenu-item').forEach(item => {
            if (item.id === 'langEn' || item.id === 'langFr') return;
            const text = item.textContent.trim();
            if (text && translations.fr[text]) {
                if (!item.hasAttribute('data-translated')) {
                    item.setAttribute('data-translated', 'true');
                    item.textContent = translations.fr[text];
                }
            }
        });
        
        // 2. Translate buttons and links (watch action buttons, catalogue buttons)
        document.querySelectorAll('button, a.watch-action-button, a.watch-back-button, a.catalogue-button, a.hero-catalogue-button, .catalogue-button, .hero-catalogue-button').forEach(btn => {
            if (btn.id === 'langEn' || btn.id === 'langFr' || btn.id === 'menuToggle' || btn.id === 'menuClose') return;
            const text = btn.textContent.trim();
            if (text && translations.fr[text]) {
                if (!btn.hasAttribute('data-translated')) {
                    btn.setAttribute('data-translated', 'true');
                    btn.textContent = translations.fr[text];
                }
            }
        });
        
        // 3. Translate about page paragraphs (before watch descriptions)
        document.querySelectorAll('.about-text, .collection-text, .about-tagline').forEach(p => {
            if (p.hasAttribute('data-translated')) return;
            
            // Store all attributes before translation
            const originalAttributes = {};
            Array.from(p.attributes).forEach(attr => {
                originalAttributes[attr.name] = attr.value;
            });
            
            let text = p.textContent.trim();
            if (!text) return;
            
            // Normalize whitespace for comparison
            const normalizedText = text.replace(/\s+/g, ' ').trim();
            
            // Try exact match first
            if (translations.fr[text]) {
                p.setAttribute('data-translated', 'true');
                p.textContent = translations.fr[text];
                // Ensure all original attributes are preserved
                Object.keys(originalAttributes).forEach(attrName => {
                    if (attrName !== 'data-translated' && p.getAttribute(attrName) !== originalAttributes[attrName]) {
                        p.setAttribute(attrName, originalAttributes[attrName]);
                    }
                });
                return;
            }
            
            // Try normalized match
            for (const [key, value] of Object.entries(translations.fr)) {
                const normalizedKey = key.replace(/\s+/g, ' ').trim();
                if (normalizedText === normalizedKey && key.length > 50) {
                    p.setAttribute('data-translated', 'true');
                    p.textContent = value;
                    // Ensure all original attributes are preserved
                    Object.keys(originalAttributes).forEach(attrName => {
                        if (attrName !== 'data-translated' && p.getAttribute(attrName) !== originalAttributes[attrName]) {
                            p.setAttribute(attrName, originalAttributes[attrName]);
                        }
                    });
                    return;
                }
            }
            
            // Try partial match for long texts
            for (const [key, value] of Object.entries(translations.fr)) {
                if (key.length > 100 && normalizedText.includes(key.replace(/\s+/g, ' ').trim())) {
                    p.setAttribute('data-translated', 'true');
                    p.textContent = value;
                    // Ensure all original attributes are preserved
                    Object.keys(originalAttributes).forEach(attrName => {
                        if (attrName !== 'data-translated' && p.getAttribute(attrName) !== originalAttributes[attrName]) {
                            p.setAttribute(attrName, originalAttributes[attrName]);
                        }
                    });
                    return;
                }
            }
        });
        
        // 3. Translate watch descriptions
        document.querySelectorAll('.watch-description p').forEach(p => {
            if (p.hasAttribute('data-translated')) return;
            
            let text = p.textContent.trim();
            if (!text) return;
            
            // Try exact match first
            if (translations.fr[text]) {
                p.setAttribute('data-translated', 'true');
                p.textContent = translations.fr[text];
                return;
            }
            
            // Try to translate by replacing known phrases
            let translated = text;
            let wasTranslated = false;
            
            // Sort translations by length (longest first) to match longer phrases first
            const sortedTranslations = Object.entries(translations.fr)
                .filter(([key]) => key.length > 20) // Only longer phrases
                .sort(([keyA], [keyB]) => keyB.length - keyA.length);
            
            for (const [key, value] of sortedTranslations) {
                // Try to find the key in the text (case-insensitive, allowing for some variation)
                const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                if (regex.test(text)) {
                    translated = text.replace(regex, value);
                    wasTranslated = true;
                    break; // Use first match
                }
            }
            
            // If we found translations, apply them
            if (wasTranslated && translated !== text) {
                p.setAttribute('data-translated', 'true');
                p.textContent = translated;
            } else {
                // Fallback: try to translate common patterns
                // Replace common English phrases with French equivalents
                const commonPatterns = [
                    [/embodies Swiss watchmaking excellence/gi, 'incarne l\'excellence de l\'horlogerie suisse'],
                    [/This exceptional piece combines technical precision and refined aesthetics, representing the pinnacle of watchmaking craftsmanship\./g, 'Cette pièce exceptionnelle allie précision technique et esthétique raffinée, représentant le summum de l\'art horloger.'],
                    [/The certified movement ensures remarkable precision, while the refined design gives this watch a unique and prestigious character\./g, 'Le mouvement certifié assure une précision remarquable, tandis que le design raffiné confère à cette montre un caractère unique et prestigieux.'],
                    [/The chronometer-certified chronograph movement ensures remarkable precision/g, 'Le mouvement chronographe certifié chronomètre assure une précision remarquable'],
                    [/while the platinum case gives this watch a unique and prestigious character\./g, 'tandis que le boîtier en platine confère à cette montre un caractère unique et prestigieux.'],
                    [/while the refined design gives this watch a unique and prestigious character\./g, 'tandis que le design raffiné confère à cette montre un caractère unique et prestigieux.'],
                    [/represents the perfect balance between elegance and technical excellence/gi, 'représente l\'équilibre parfait entre élégance et excellence technique'],
                    [/This exceptional timepiece combines timeless design with exceptional performance, making it a true collector\'s piece\./g, 'Cette pièce exceptionnelle allie design intemporel et performance exceptionnelle, en faisant une véritable pièce de collection.'],
                    [/This exceptional piece combines timeless design with exceptional craftsmanship, making it a true collector\'s item\./g, 'Cette pièce exceptionnelle allie design intemporel et savoir-faire exceptionnel, en faisant un véritable objet de collection.'],
                    [/is a highly sought-after timepiece that combines exceptional craftsmanship with iconic design/gi, 'est une montre très recherchée qui allie savoir-faire exceptionnel et design emblématique'],
                    [/This limited edition model represents the perfect fusion of luxury and performance\./g, 'Ce modèle en édition limitée représente la fusion parfaite entre luxe et performance.'],
                    [/while the distinctive design gives this watch a unique and prestigious character that appeals to collectors worldwide\./g, 'tandis que le design distinctif confère à cette montre un caractère unique et prestigieux qui séduit les collectionneurs du monde entier.'],
                    [/The refined design gives this piece a unique and prestigious character\./g, 'Le design raffiné confère à cette pièce un caractère unique et prestigieux.'],
                    // Pattern for "The [Watch Name] represents..."
                ];
                
                for (const [pattern, replacement] of commonPatterns) {
                    if (pattern.test(text)) {
                        translated = text.replace(pattern, replacement);
                        wasTranslated = true;
                    }
                }
                
                // Also try to translate complete sentences by matching patterns with watch names
                // Pattern: "The [Watch Name] represents..."
                const watchNamePattern = /^The (.+?) (represents|is|embodies)/i;
                const watchNameMatch = text.match(watchNamePattern);
                if (watchNameMatch && !wasTranslated) {
                    const watchName = watchNameMatch[1];
                    // Try to translate the rest of the sentence
                    let restOfSentence = text.substring(watchNameMatch[0].length).trim();
                    if (restOfSentence.includes('represents the perfect balance between elegance and technical excellence')) {
                        if (restOfSentence.includes('This exceptional timepiece combines timeless design with exceptional performance')) {
                            translated = `La ${watchName} représente l'équilibre parfait entre élégance et excellence technique. Cette pièce exceptionnelle allie design intemporel et performance exceptionnelle, en faisant une véritable pièce de collection.`;
                            wasTranslated = true;
                        } else if (restOfSentence.includes('This exceptional piece combines timeless design with exceptional craftsmanship')) {
                            translated = `La ${watchName} représente l'équilibre parfait entre élégance et excellence technique. Cette pièce exceptionnelle allie design intemporel et savoir-faire exceptionnel, en faisant un véritable objet de collection.`;
                            wasTranslated = true;
                        }
                    } else if (restOfSentence.includes('is a highly sought-after timepiece that combines exceptional craftsmanship with iconic design')) {
                        translated = `La ${watchName} est une montre très recherchée qui allie savoir-faire exceptionnel et design emblématique. Ce modèle en édition limitée représente la fusion parfaite entre luxe et performance.`;
                        wasTranslated = true;
                    }
                }
                
                if (wasTranslated && translated !== text) {
                    p.setAttribute('data-translated', 'true');
                    p.textContent = translated;
                }
            }
        });
        
        // 3b. Translate watch prices (Reserved)
        document.querySelectorAll('.watch-price, .watch-price-large').forEach(priceEl => {
            if (priceEl.hasAttribute('data-translated')) return;
            
            const text = priceEl.textContent.trim();
            if (text === 'Reserved' && translations.fr['Reserved']) {
                priceEl.setAttribute('data-translated', 'true');
                priceEl.textContent = translations.fr['Reserved'];
            }
        });
        
        // 4. Translate catalogue form - placeholders
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.placeholder && translations.fr[searchInput.placeholder]) {
            searchInput.placeholder = translations.fr[searchInput.placeholder];
        }
        
        // 5. Translate catalogue form - select options
        ['brandFilter', 'typeFilter', 'sortFilter'].forEach(filterId => {
            const select = document.getElementById(filterId);
            if (select) {
                Array.from(select.options).forEach(option => {
                    const text = option.textContent.trim();
                    if (text && translations.fr[text] && !option.hasAttribute('data-translated')) {
                        option.setAttribute('data-translated', 'true');
                        option.textContent = translations.fr[text];
                    }
                });
            }
        });
        
        // 6. Translate headings and labels (h1, h2, h3, h4, h5, h6, .section-label, .section-title)
        // This includes elements with inline styles
        document.querySelectorAll('h1, h2, h3, h4, h5, h6, .section-label, .section-title, .banner-label').forEach(el => {
            if (el.hasAttribute('data-translated') || 
                el.classList.contains('watch-name') || 
                el.classList.contains('banner-watch-name') ||
                el.id === 'langEn' || 
                el.id === 'langFr') {
                return;
            }
            
            // Store original style attribute to preserve it
            const originalStyle = el.getAttribute('style');
            
            const text = el.textContent.trim();
            if (!text) return;
            
            // Try exact match
            if (translations.fr[text]) {
                el.setAttribute('data-translated', 'true');
                el.textContent = translations.fr[text];
                // Restore style if it existed
                if (originalStyle) {
                    el.setAttribute('style', originalStyle);
                }
                return;
            }
            
            // Try normalized match
            const normalizedText = text.replace(/\s+/g, ' ').trim();
            for (const [key, value] of Object.entries(translations.fr)) {
                const normalizedKey = key.replace(/\s+/g, ' ').trim();
                if (normalizedText === normalizedKey) {
                    el.setAttribute('data-translated', 'true');
                    el.textContent = value;
                    // Restore style if it existed
                    if (originalStyle) {
                        el.setAttribute('style', originalStyle);
                    }
                    return;
                }
            }
        });
        
        // 6b. Translate philosophy-text and other paragraph classes (including those with inline styles)
        document.querySelectorAll('.philosophy-text, .about-tagline, .footer-tagline, .about-text').forEach(el => {
            if (el.hasAttribute('data-translated') || 
                el.classList.contains('watch-name') || 
                el.classList.contains('banner-watch-name') ||
                el.id === 'langEn' || 
                el.id === 'langFr') {
                return;
            }
            
            // Store original style attribute to preserve it
            const originalStyle = el.getAttribute('style');
            
            const text = el.textContent.trim();
            if (!text) return;
            
            // Try exact match
            if (translations.fr[text]) {
                el.setAttribute('data-translated', 'true');
                el.textContent = translations.fr[text];
                // Restore style if it existed
                if (originalStyle) {
                    el.setAttribute('style', originalStyle);
                }
                return;
            }
            
            // Try normalized match
            const normalizedText = text.replace(/\s+/g, ' ').trim();
            for (const [key, value] of Object.entries(translations.fr)) {
                const normalizedKey = key.replace(/\s+/g, ' ').trim();
                if (normalizedText === normalizedKey || (key.length > 50 && normalizedText.includes(normalizedKey))) {
                    el.setAttribute('data-translated', 'true');
                    el.textContent = value;
                    // Restore style if it existed
                    if (originalStyle) {
                        el.setAttribute('style', originalStyle);
                    }
                    return;
                }
            }
        });
        
        // 7. Translate links and other text elements (including those with inline styles)
        document.querySelectorAll('a:not(.watch-name):not(.banner-watch-name):not([data-type]):not([data-brand])').forEach(link => {
            if (link.hasAttribute('data-translated') || 
                link.id === 'langEn' || 
                link.id === 'langFr' ||
                link.id === 'menuToggle' ||
                link.id === 'menuClose') {
                return;
            }
            
            // Store original style attribute to preserve it
            const originalStyle = link.getAttribute('style');
            
            const text = link.textContent.trim();
            if (!text) return;
            
            // Skip if link contains images or other complex content
            if (link.querySelector('img, input, button')) {
                return;
            }
            
            // Try exact match
            if (translations.fr[text]) {
                link.setAttribute('data-translated', 'true');
                link.textContent = translations.fr[text];
                // Restore style if it existed
                if (originalStyle) {
                    link.setAttribute('style', originalStyle);
                }
                return;
            }
        });
        
        // 8. Translate all other text elements (exact matches and normalized matches)
        // IMPORTANT: Preserve inline styles
        Object.keys(translations.fr).forEach(key => {
            // Normalize the key (remove extra whitespace, newlines)
            const normalizedKey = key.replace(/\s+/g, ' ').trim();
            
            // Find all elements with this exact text or normalized text
            const allElements = document.querySelectorAll('p, span, div, li, td, th, label, a');
            allElements.forEach(el => {
                // Skip certain elements
                if (el.tagName === 'SCRIPT' || 
                    el.tagName === 'STYLE' ||
                    el.tagName === 'SECTION' || // Skip sections to preserve their style attributes
                    el.classList.contains('watch-name') ||
                    el.classList.contains('banner-watch-name') ||
                    el.id === 'langEn' ||
                    el.id === 'langFr' ||
                    el.hasAttribute('data-translated') ||
                    el.closest('.watch-description') || // Already handled
                    el.closest('.about-text') || // Already handled
                    el.closest('.collection-text') || // Already handled
                    el.closest('h1, h2, h3, h4, h5, h6, .section-label, .section-title')) { // Already handled
                    return;
                }
                
                // Store original style attribute to preserve it
                const originalStyle = el.getAttribute('style');
                
                const text = el.textContent.trim();
                if (!text) return;
                const normalizedText = text.replace(/\s+/g, ' ').trim();
                
                // Try exact match first
                if (text === key) {
                    // Only translate if element has no interactive children
                    if (!el.querySelector('input, select, textarea, button, a[href]')) {
                        el.setAttribute('data-translated', 'true');
                        el.textContent = translations.fr[key];
                        // Restore style if it existed
                        if (originalStyle) {
                            el.setAttribute('style', originalStyle);
                        }
                    }
                }
                // Try normalized match for long texts with variable whitespace
                else if (normalizedText === normalizedKey && key.length > 50) {
                    // Only translate if element has no interactive children
                    if (!el.querySelector('input, select, textarea, button, a[href]')) {
                        el.setAttribute('data-translated', 'true');
                        el.textContent = translations.fr[key];
                        // Restore style if it existed
                        if (originalStyle) {
                            el.setAttribute('style', originalStyle);
                        }
                    }
                }
            });
        });
        
        // 7. Translate placeholders
        document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(input => {
            const placeholder = input.getAttribute('placeholder');
            if (placeholder && translations.fr[placeholder]) {
                input.setAttribute('placeholder', translations.fr[placeholder]);
            }
        });
        
        // 8. Translate all select options (general)
        document.querySelectorAll('select option').forEach(option => {
            const text = option.textContent.trim();
            if (text && translations.fr[text] && !option.hasAttribute('data-translated')) {
                option.setAttribute('data-translated', 'true');
                option.textContent = translations.fr[text];
            }
        });
        
        // Update language buttons
        document.getElementById('langEn')?.classList.remove('active');
        document.getElementById('langFr')?.classList.add('active');
        
        // CRITICAL: Preserve all inline styles on sections and containers
        // Store all inline styles and classes before translation
        const elementsWithStyles = document.querySelectorAll('section[style], div[style], [class*="about"], [class*="collection"]');
        const preservedAttributes = new Map();
        elementsWithStyles.forEach(el => {
            const attrs = {};
            Array.from(el.attributes).forEach(attr => {
                attrs[attr.name] = attr.value;
            });
            preservedAttributes.set(el, attrs);
        });
        
        // Force reflow to ensure CSS is applied
        document.body.offsetHeight;
        
        // Restore all attributes after translation to ensure styles are preserved
        setTimeout(() => {
            preservedAttributes.forEach((attrs, el) => {
                Object.keys(attrs).forEach(attrName => {
                    if (attrName !== 'data-translated' && el.getAttribute(attrName) !== attrs[attrName]) {
                        el.setAttribute(attrName, attrs[attrName]);
                    }
                });
            });
            
            // Force CSS recalculation by toggling a class
            document.body.classList.add('translated');
            setTimeout(() => {
                document.body.classList.remove('translated');
            }, 10);
        }, 100);
        
        // Store language preference
        localStorage.setItem('preferredLanguage', 'fr');
    }
}

// Initialize language switcher
document.addEventListener('DOMContentLoaded', function() {
    // Skip translation for mentions-legales.html page
    if (window.location.pathname.includes('mentions-legales.html')) {
        const langEn = document.getElementById('langEn');
        const langFr = document.getElementById('langFr');
        const savedLang = localStorage.getItem('preferredLanguage');
        
        // Just set the language button state without translating
        if (savedLang === 'fr') {
            if (langFr) langFr.classList.add('active');
        } else {
            if (langEn) langEn.classList.add('active');
        }
        
        // Disable translation on button click for this page
        if (langEn) {
            langEn.addEventListener('click', () => {
                localStorage.setItem('preferredLanguage', 'en');
                // Don't translate, just update button state
                langEn.classList.add('active');
                langFr?.classList.remove('active');
            });
        }
        
        if (langFr) {
            langFr.addEventListener('click', () => {
                localStorage.setItem('preferredLanguage', 'fr');
                // Don't translate, just update button state
                langFr.classList.add('active');
                langEn?.classList.remove('active');
            });
        }
        
        return; // Exit early, don't apply translation
    }
    
    const langEn = document.getElementById('langEn');
    const langFr = document.getElementById('langFr');
    
    // Check for saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    
    if (langEn) {
        langEn.addEventListener('click', () => {
            localStorage.setItem('preferredLanguage', 'en');
            translatePage('en');
        });
    }
    
    if (langFr) {
        langFr.addEventListener('click', () => {
            localStorage.setItem('preferredLanguage', 'fr');
            translatePage('fr');
        });
    }
    
    // Wait for all resources (including CSS) to be loaded
    // Use a more reliable method to ensure CSS is loaded
    const applyTranslationWhenReady = () => {
        // Check if stylesheets are loaded
        const stylesheets = Array.from(document.styleSheets);
        const styleCssLoaded = stylesheets.some(sheet => {
            try {
                return sheet.href && sheet.href.includes('style.css');
            } catch (e) {
                return false;
            }
        });
        
        // Also check if computed styles are applied (CSS is working)
        const testEl = document.querySelector('body, .navbar-minimal, .about');
        let cssApplied = false;
        if (testEl) {
            try {
                const styles = window.getComputedStyle(testEl);
                cssApplied = styles.display !== 'none' && (styles.backgroundColor || styles.color);
            } catch (e) {
                cssApplied = false;
            }
        }
        
        if ((styleCssLoaded || document.readyState === 'complete') && (cssApplied || document.readyState === 'complete')) {
            // CSS is loaded, apply translation
            if (savedLang === 'fr') {
                if (langFr) langFr.classList.add('active');
                // Wait a bit more to ensure CSS is fully applied
                setTimeout(() => {
                    translatePage('fr');
                    // Force a repaint after translation
                    requestAnimationFrame(() => {
                        document.body.style.visibility = 'hidden';
                        document.body.offsetHeight;
                        document.body.style.visibility = 'visible';
                    });
                }, 300);
            } else {
                if (langEn) langEn.classList.add('active');
            }
        } else {
            // CSS not ready yet, retry
            setTimeout(applyTranslationWhenReady, 100);
        }
    };
    
    // Start checking
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyTranslationWhenReady);
    } else {
        applyTranslationWhenReady();
    }
});
