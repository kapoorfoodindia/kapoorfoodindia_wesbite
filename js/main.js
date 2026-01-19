// Main JavaScript file for Kapoor Food India website

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    // Ensure favicon exists on all pages (especially minified product pages)
    (function ensureFavicon() {
        const existingIcon = document.querySelector('link[rel~="icon"]');
        if (existingIcon) return;

        const pathname = window.location.pathname || '';
        let faviconHref = 'assets/logo/fasal-favicon.png';
        if (pathname.includes('/products/')) {
            faviconHref = '../../assets/logo/fasal-favicon.png';
        } else if (pathname.includes('/admin/')) {
            faviconHref = '../assets/logo/fasal-favicon.png';
        }

        const icon = document.createElement('link');
        icon.rel = 'icon';
        icon.type = 'image/png';
        icon.href = faviconHref;
        document.head.appendChild(icon);

        const apple = document.createElement('link');
        apple.rel = 'apple-touch-icon';
        apple.href = faviconHref;
        document.head.appendChild(apple);
    })();

    const navMenu = document.querySelector('.nav-menu');
    const navWrapper = document.querySelector('.nav-wrapper');

    // Normalize brand display: switch logo text to "Fasal"
    (function updateBranding(){
        const logoLink = document.querySelector('.logo.logo-link');
        const logoImg = document.querySelector('.logo-img');
        const logoTitle = document.querySelector('.logo-text h1');

        if (logoLink) logoLink.setAttribute('aria-label', 'Fasal');
        if (logoImg) logoImg.setAttribute('alt', 'Fasal logo');
        if (logoTitle) logoTitle.textContent = 'Fasal';
    })();

    // Some pages (e.g., older/minified product pages) may not include the hamburger button.
    // Inject it so the menu stays hidden on mobile until clicked.
    let mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (!mobileMenuToggle && navWrapper && navMenu) {
        mobileMenuToggle = document.createElement('button');
        mobileMenuToggle.className = 'mobile-menu-toggle';
        mobileMenuToggle.type = 'button';
        mobileMenuToggle.setAttribute('aria-label', 'Toggle menu');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        navWrapper.insertBefore(mobileMenuToggle, navMenu);
    }
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const expanded = navMenu.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');

            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                if (mobileMenuToggle) {
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    const icon = mobileMenuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .product-card, .value-card, .benefit-card, .process-step');
    animateElements.forEach(el => observer.observe(el));
});

// Utility function to format dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
