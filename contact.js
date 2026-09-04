// ========================================
// KARUA DRILLING - CONTACT PAGE JAVASCRIPT
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
// CONTACT FORM HANDLING
// ========================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        // Basic validation
        if (!formObject.name || !formObject.email || !formObject.phone || !formObject.service) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formObject.email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(function() {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Show success message
            showFormMessage('Thank you! Your quote request has been sent. We\'ll get back to you within 24 hours.', 'success');

            // Reset form
            contactForm.reset();
        }, 2000);
    });
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;

    // Insert after form
    contactForm.appendChild(messageDiv);

    // Auto remove after 5 seconds
    setTimeout(function() {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// ========================================
// SERVICE MAP INITIALIZATION
// ========================================
function initServiceMap() {
    const mapElement = document.getElementById('service-map');
    if (!mapElement) return;

    const map = L.map('service-map', {
        scrollWheelZoom: false,
        dragging: true,
        zoomControl: true
    }).setView([-33.7, 22.2], 8);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

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

    const markers = [];

    locations.forEach(loc => {
        const marker = L.marker(loc.coords, {
            icon: loc.isHQ ? hqIcon : opsIcon
        }).addTo(map);

        marker.bindPopup(`<strong>${loc.name}</strong><br>${loc.desc}`);
        markers.push(marker);

        if (loc.isHQ) {
            marker.openPopup();
        }
    });

    const group = new L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.12));
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', function() {
    initServiceMap();
});

// ========================================
// FORM FIELD ENHANCEMENTS
// ========================================
// Auto-format phone number
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        // Remove all non-numeric characters
        let value = e.target.value.replace(/\D/g, '');

        // Format as South African mobile number
        if (value.length >= 10) {
            if (value.startsWith('27')) {
                // Already has country code
                value = value.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');
            } else {
                // Add country code
                value = '27' + value.substring(0, 9);
                value = value.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');
            }
        } else if (value.length > 3) {
            value = value.replace(/(\d{3})(\d{3})/, '$1 $2');
        }

        e.target.value = value;
    });
}

// ========================================
// SERVICE SELECTION ENHANCEMENT
// ========================================
const serviceSelect = document.getElementById('service');
if (serviceSelect) {
    serviceSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const service = selectedOption.value;

        // Update message placeholder based on service
        const messageTextarea = document.getElementById('message');
        if (messageTextarea) {
            const placeholders = {
                borehole: 'Please describe your borehole requirements: depth needed (meters), water yield expectations, soil/rock type, intended use (domestic/agricultural), etc.',
                solar: 'Please describe your solar foundation requirements: number of panels, foundation type needed, soil conditions, site accessibility, etc.',
                fence: 'Please describe your fence post requirements: number of posts, post spacing, soil type, fence height, post material preferences, etc.'
            };

            messageTextarea.placeholder = placeholders[service] || 'Please describe your drilling requirements, depth needed, soil type, water requirements, etc.';
        }
    });
}