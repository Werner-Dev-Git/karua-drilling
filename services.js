// ========================================
// SERVICES PAGE JAVASCRIPT
// Karua Drilling - Professional Borehole Services
// ========================================

// ========================================
// PRELOADER
// ========================================
(function() {
    let hidden = false;

    function hidePreloader() {
        if (hidden) return;
        const preloader = document.getElementById('preloader');
        if (!preloader) return;
        hidden = true;
        preloader.classList.add('loaded');
        // Remove from DOM after transition
        setTimeout(function() {
            preloader.style.display = 'none';
        }, 500);
    }

    // Normal path: everything has loaded, keep the preloader up for a 1.5s minimum.
    window.addEventListener('load', function() {
        setTimeout(hidePreloader, 1500);
    });

    // Failsafe: 'load' waits on every image and video, so a single slow or
    // stalled asset would otherwise leave visitors staring at the preloader
    // forever. Reveal the page regardless once this deadline passes.
    setTimeout(hidePreloader, 5000);
})();

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // INITIALIZE AOS ANIMATIONS
    // ========================================
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });

    // ========================================
    // HEADER SCROLL EFFECT
    // ========================================
    const header = document.getElementById('header');
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
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
    });

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
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

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
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            setTimeout(closeMobileMenu, 300);
        });
    });

    // ========================================
    // FILTER TABS FUNCTIONALITY
    // ========================================
    const filterTabs = document.querySelectorAll('.filter-tab');
    const showcaseCards = document.querySelectorAll('.showcase-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked tab
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Filter cards with animation
            showcaseCards.forEach((card, index) => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'none';
                    card.offsetHeight; // Trigger reflow
                    card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Add fadeInUp animation dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // ========================================
    // SERVICE DETAIL PANELS
    // ========================================
    const expandButtons = document.querySelectorAll('.btn-expand');
    const detailPanels = document.querySelectorAll('.service-detail-panel');
    const detailOverlay = document.getElementById('detailOverlay');
    const closeButtons = document.querySelectorAll('.detail-close');
    const serviceLinks = document.querySelectorAll('.service-link');

    function openDetailPanel(targetId) {
        const panel = document.getElementById(targetId);
        if (panel) {
            // Close any open panels first
            detailPanels.forEach(p => p.classList.remove('active'));
            
            // Open the target panel
            panel.classList.add('active');
            detailOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Animate content elements
            const contentElements = panel.querySelectorAll('.method-card, .plan-card, .filter-card, .issue-item, .solar-item, .fence-stat');
            contentElements.forEach((el, index) => {
                el.style.animation = 'none';
                el.offsetHeight;
                el.style.animation = `fadeInUp 0.4s ease forwards ${index * 0.05}s`;
            });
        }
    }

    function closeDetailPanels() {
        detailPanels.forEach(p => p.classList.remove('active'));
        detailOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Open panel on button click
    expandButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            openDetailPanel(targetId);
        });
    });

    // Also allow tapping/clicking the full card image area to open details.
    showcaseCards.forEach(card => {
        const expandBtn = card.querySelector('.btn-expand');
        if (!expandBtn) return;

        card.addEventListener('click', function(e) {
            if (e.target.closest('.btn-expand')) return;
            openDetailPanel(expandBtn.dataset.target);
        });
    });

    // Open panel from footer links
    serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').replace('#', '');
            openDetailPanel(targetId);
        });
    });

    // Close panel on close button click
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeDetailPanels);
    });

    // Close panel on overlay click
    detailOverlay.addEventListener('click', closeDetailPanels);

    // Close panel on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDetailPanels();
            closeMobileMenu();
        }
    });

    // ========================================
    // CARD TILT EFFECT (ADVANCED)
    // ========================================
    const cards = document.querySelectorAll('.showcase-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ========================================
    // PARALLAX EFFECT FOR HERO
    // ========================================
    const heroSection = document.querySelector('.services-hero');
    
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            
            if (heroSection.querySelector('.page-hero-particles')) {
                heroSection.querySelector('.page-hero-particles').style.transform = `translateY(${rate}px)`;
            }
        });
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's a detail panel link
            if (href.includes('-details')) return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Observe process steps for animation
    document.querySelectorAll('.process-step').forEach(step => {
        observer.observe(step);
    });

    // ========================================
    // STICKY FILTER BAR SHADOW
    // ========================================
    const filterSection = document.querySelector('.services-filter');
    
    if (filterSection) {
        window.addEventListener('scroll', function() {
            const rect = filterSection.getBoundingClientRect();
            
            if (rect.top <= 80) {
                filterSection.classList.add('stuck');
            } else {
                filterSection.classList.remove('stuck');
            }
        });
    }

    // ========================================
    // PRELOAD IMAGES FOR SMOOTH HOVER
    // ========================================
    const imagesToPreload = [
        'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
    ];

    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // ========================================
    // CHECK FOR HASH ON PAGE LOAD
    // ========================================
    if (window.location.hash) {
        const hash = window.location.hash.replace('#', '');
        if (hash.includes('-details')) {
            setTimeout(() => {
                openDetailPanel(hash);
            }, 500);
        }
    }

});
