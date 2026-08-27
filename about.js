// ========================================
// KARUA DRILLING - ABOUT PAGE JAVASCRIPT
// ========================================

// ========================================
// PRELOADER
// ========================================
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(function() {
            preloader.classList.add('loaded');
            // Remove from DOM after transition
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        }, 1500); // Show preloader for 1.5 seconds minimum
    }
});

// ========================================
// INITIALIZE AOS ANIMATIONS
// ========================================
AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 50
});

// ========================================
// STICKY HEADER
// ========================================
const header = document.getElementById('header');
const backToTopBtn = document.getElementById('backToTop');

function handleScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    if (backToTopBtn) {
        if (window.scrollY > 350) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }
}

window.addEventListener('scroll', handleScroll);
// Run on load to check initial scroll position
handleScroll();

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// MOBILE MENU TOGGLE
// ========================================
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileNavLinks = mobileNav.querySelector('.mobile-nav-links');
const mobileLinks = mobileNav.querySelectorAll('a');

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', toggleMobileMenu);
mobileOverlay.addEventListener('click', closeMobileMenu);

// Close menu when clicking any link
mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
        // Small delay for visual feedback before closing
        setTimeout(closeMobileMenu, 150);
    });
});

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// ANIMATED NUMBER COUNTER
// ========================================
const statNumbers = document.querySelectorAll('.stat-number[data-count]');
let countersAnimated = false;

function animateCounters() {
    if (countersAnimated) return;
    
    statNumbers.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
    
    countersAnimated = true;
}

// Intersection Observer for counter animation
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    statsObserver.observe(statsSection);
}

// Also check intro stats card
const introStatsCard = document.querySelector('.intro-stats-card');
if (introStatsCard) {
    const introCounter = introStatsCard.querySelector('.stat-number[data-count]');
    if (introCounter) {
        const introObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(introCounter.getAttribute('data-count'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            introCounter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            introCounter.textContent = target;
                        }
                    };
                    
                    updateCounter();
                    introObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        introObserver.observe(introStatsCard);
    }
}

// ========================================
// TIMELINE ANIMATION ON SCROLL
// ========================================
const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

timelineItems.forEach(item => {
    timelineObserver.observe(item);
});

// ========================================
// TEAM CARD HOVER EFFECTS
// ========================================
const teamCards = document.querySelectorAll('.team-card');

teamCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ========================================
// VALUE CARDS STAGGER ANIMATION
// ========================================
const valueCards = document.querySelectorAll('.value-card');

const valueObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

valueCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease-out';
    valueObserver.observe(card);
});

// ========================================
// PARALLAX EFFECT FOR PAGE HERO
// ========================================
const pageHeroBg = document.querySelector('.page-hero-bg img');

if (pageHeroBg) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = document.querySelector('.page-hero').offsetHeight;
        
        if (scrolled < heroHeight) {
            pageHeroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
}

// ========================================
// CERTIFICATION SHOWCASE - ADVANCED ANIMATIONS
// ========================================

// Create floating particles
function createCertParticles() {
    const container = document.getElementById('certParticles');
    if (!container) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 4 + 's';
        particle.style.animationDuration = (3 + Math.random() * 2) + 's';
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

// Initialize particles
createCertParticles();

// Animate certification cards and SVG circles on scroll
const certShowcase = document.querySelector('.cert-showcase');
const certFlipCards = document.querySelectorAll('.cert-flip-card');

// Keep exactly one certification card flipped at a time.
if (certFlipCards.length > 0) {
    if (!document.querySelector('.cert-flip-card.is-flipped')) {
        certFlipCards[0].classList.add('is-flipped');
    }

    certFlipCards.forEach(card => {
        card.addEventListener('click', () => {
            certFlipCards.forEach(c => c.classList.remove('is-flipped'));
            card.classList.add('is-flipped');
        });
    });
}

if (certShowcase) {
    const certObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate each card with stagger
                certFlipCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animated');
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 150);
                });
                
                // Animate stats counters
                animateCertStats();
                
                certObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // Set initial state for cards
    certFlipCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    certObserver.observe(certShowcase);
}

// Stats counter animation for certification section
function animateCertStats() {
    const certStatNumbers = document.querySelectorAll('.cert-stats-row .stat-number[data-count]');
    
    certStatNumbers.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);
            
            counter.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                counter.textContent = target;
            }
        }
        
        requestAnimationFrame(updateCount);
    });
}

// Add tilt effect on card hover (3D perspective)
certFlipCards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        // Don't apply tilt if card is flipped
        if (!this.matches(':hover .cert-flip-inner[style*="rotateY(180deg)"]')) {
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// Mouse parallax for background orbs
const certBgEffects = document.querySelector('.cert-bg-effects');
if (certBgEffects) {
    document.addEventListener('mousemove', function(e) {
        const orbs = certBgEffects.querySelectorAll('.cert-orb');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// ========================================
// PRELOAD IMAGES FOR SMOOTHER EXPERIENCE
// ========================================
const imagesToPreload = [
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=400&h=500&q=80'
];

imagesToPreload.forEach(src => {
    const img = new Image();
    img.src = src;
});

console.log('Karua Drilling - About Page Loaded');
