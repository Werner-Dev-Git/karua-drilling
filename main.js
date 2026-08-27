// ========================================
// KARUA DRILLING - MAIN JAVASCRIPT
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

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
// SMOOTH SCROLL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
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
// DRILLING METHODS TABS
// ========================================
const methodTabs = document.querySelectorAll('.method-tab');
const methodPanels = document.querySelectorAll('.method-panel');
let isAnimating = false;

methodTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Prevent rapid clicking
        if (isAnimating) return;
        
        // Check if this tab is already active
        if (tab.classList.contains('active')) return;
        
        isAnimating = true;
        
        // Remove active class from all tabs
        methodTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Get target panel
        const targetPanel = document.getElementById('panel-' + tab.dataset.tab);
        const currentPanel = document.querySelector('.method-panel.active');
        
        // Fade out current panel
        if (currentPanel) {
            currentPanel.classList.remove('active');
        }
        
        // Fade in new panel after transition completes
        setTimeout(() => {
            targetPanel.classList.add('active');
            isAnimating = false;
        }, 300);
    });
});

// ========================================
// LEAFLET MAP INITIALIZATION
// ========================================
const map = L.map('map', {
    scrollWheelZoom: false,
    dragging: true,
    zoomControl: true
}).setView([-33.7, 22.2], 8);

// Use CartoDB Positron (light, clean tiles)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// Custom marker icons
const hqIcon = L.divIcon({
    className: 'leaflet-marker-hq',
    html: '<div class="marker-pin hq"><span class="pulse"></span></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

const opsIcon = L.divIcon({
    className: 'leaflet-marker-ops',
    html: '<div class="marker-pin ops"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

// Location data - Garden Route & Karoo Region
const locations = [
    { coords: [-34.0931, 22.0014], name: 'Mossel Bay', desc: 'Garden Route Hub', isHQ: true },
    { coords: [-33.9328, 22.4531], name: 'George', desc: 'Central Garden Route operations', isHQ: false },
    { coords: [-34.0527, 23.3716], name: 'Plettenberg Bay', desc: 'Eastern Garden Route coverage', isHQ: false },
    { coords: [-34.1897, 21.4239], name: 'Riversdale', desc: 'Hessequa region services', isHQ: false },
    { coords: [-34.0983, 21.4194], name: 'Stilbaai', desc: 'Coastal drilling services', isHQ: false },
    { coords: [-33.7286, 21.5897], name: 'Van Wyksdorp', desc: 'Rural Karoo services', isHQ: false },
    { coords: [-33.5888, 22.2023], name: 'Oudtshoorn', desc: 'Klein Karoo operations', isHQ: false },
    { coords: [-34.1708, 24.8333], name: 'St Francis Bay', desc: 'Coastal Eastern Cape', isHQ: false },
    { coords: [-33.3167, 22.0500], name: 'Klipfontein', desc: 'Deep Karoo coverage', isHQ: false }
];

// Add markers to map
locations.forEach(loc => {
    const marker = L.marker(loc.coords, {
        icon: loc.isHQ ? hqIcon : opsIcon
    }).addTo(map);
    
    marker.bindPopup(`<strong>${loc.name}</strong><br>${loc.desc}`);
    
    // Open HQ popup by default
    if (loc.isHQ) {
        marker.openPopup();
    }
});

// ========================================
// FORM VALIDATION & SUBMISSION
// ========================================
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Basic validation
    let isValid = true;
    const requiredFields = contactForm.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    // Email validation
    const emailField = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailField.value && !emailRegex.test(emailField.value)) {
        emailField.classList.add('error');
        isValid = false;
    }
    
    // Consent validation
    const consentField = document.getElementById('consent');
    if (!consentField.checked) {
        isValid = false;
        alert('Please consent to data collection to submit your enquiry.');
    }
    
    if (isValid) {
        // Simulate form submission
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
        
        // Reset form after delay
        setTimeout(() => {
            contactForm.reset();
            contactForm.style.display = 'grid';
            formSuccess.classList.remove('show');
        }, 5000);
    }
});

// Remove error class on input
contactForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
        field.classList.remove('error');
    });
});

// ========================================
// VIDEO SHOWCASE - PLAY ON HOVER
// ========================================
const videoCards = document.querySelectorAll('.video-card');

videoCards.forEach(card => {
    const video = card.querySelector('video');
    
    if (video) {
        card.addEventListener('mouseenter', () => {
            video.play().catch(err => {
                console.log('Video autoplay prevented:', err);
            });
        });
        
        card.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
        
        // Touch support for mobile
        card.addEventListener('touchstart', () => {
            if (video.paused) {
                video.play().catch(err => {
                    console.log('Video autoplay prevented:', err);
                });
            } else {
                video.pause();
                video.currentTime = 0;
            }
        }, { passive: true });
    }
});
