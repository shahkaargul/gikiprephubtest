document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('open');
        });
    }

    // Welcome modal functionality
    const welcomeModal = document.getElementById('welcomeModal');
    const closeModal = document.querySelector('.close-modal');
    
    // Show modal after delay
    if (welcomeModal) {
        setTimeout(function() {
            welcomeModal.style.display = 'flex';
            welcomeModal.classList.add('animate__zoomIn');
        }, 2000);
    }
    
    // Close modal when X is clicked
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            welcomeModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside content
    if (welcomeModal) {
        welcomeModal.addEventListener('click', function(e) {
            if (e.target === welcomeModal) {
                welcomeModal.style.display = 'none';
            }
        });
    }

    // Hero section CTA button
    const ctaButton = document.querySelector('.hero-section .cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            // Only prevent default if we're handling the click ourselves
            if (document.querySelector('#resources')) {
                e.preventDefault();
                document.querySelector('#resources').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }

    // Secondary button in hero section
    const demoButton = document.querySelector('.hero-section .secondary-button');
    if (demoButton) {
        demoButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Add your demo video functionality here
            alert('Demo video would play here!');
        });
    }

    // Scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            window.scrollBy({
                top: window.innerHeight - 100,
                behavior: 'smooth'
            });
        });
    }

    // Add animation classes when elements come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .section-header, .testimonial-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                const animationClass = element.classList[1].split('animate__')[1];
                element.classList.add('animate__' + animationClass);
            }
        });
    };

    // Initial check in case elements are already in view
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Form submission for modal
    const modalForm = document.querySelector('.modal-form');
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput.value) {
                // Here you would typically send the email to your server
                alert('Thank you for subscribing! We\'ll keep you updated.');
                welcomeModal.style.display = 'none';
            }
        });
    }
});
