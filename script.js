/* 
    Avinav Acharya Portfolio JavaScript Logic
    Interactivity: Scroll Spy, Typewriter, Scroll Reveals, Filters, Form Handler
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Header Scroll Effect ---
    const header = document.getElementById('header');
    const backToTopBtn = document.getElementById('back-to-top-btn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            backToTopBtn.classList.add('show');
        } else {
            header.classList.remove('scrolled');
            backToTopBtn.classList.remove('show');
        }
    });

    // --- 2. Mobile Navigation Toggle ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    
    function toggleMobileMenu() {
        mobileDrawer.classList.toggle('open');
        mobileToggle.classList.toggle('active');
        
        // Animated hamburger bars transition
        const bars = mobileToggle.querySelectorAll('.bar');
        if (mobileToggle.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 5px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-6px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    }
    
    mobileToggle.addEventListener('click', toggleMobileMenu);
    
    // Close mobile drawer when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileDrawer.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // --- 3. Typing Animation (Hero Section) ---
    const typewriterElement = document.getElementById('typewriter');
    const roles = ["Full Stack Developer", "AI Enthusiast", "Problem Solver"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Delete character
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Speed up when deleting
        } else {
            // Write character
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Natural typing pace
        }
        
        // State checks
        if (!isDeleting && charIndex === currentRole.length) {
            // Pausing at the end of the text
            isDeleting = true;
            typingSpeed = 1800; // Time text remains visible
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next word
        }
        
        setTimeout(typeEffect, typingSpeed);
    }
    
    // Launch Typing Effect
    typeEffect();

    // --- 4. Entrance Scroll Reveal Animations ---
    const fadeElements = document.querySelectorAll('.fade-in-element');
    const skillBars = document.querySelectorAll('.skill-bar-progress');
    
    // General Observer for elements fade-in
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });
    
    fadeElements.forEach(el => revealObserver.observe(el));
    
    // Observer for skill progress bars animation
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate to full scale
                entry.target.style.transform = 'scaleX(1)';
            }
        });
    }, {
        threshold: 0.5
    });
    
    skillBars.forEach(bar => skillObserver.observe(bar));

    // --- 5. Scrollspy (Highlight Active Nav Link) ---
    const sections = document.querySelectorAll('.scroll-spy');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150; // offset header height
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // Update desktop links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
        
        // Update mobile drawer links
        mobNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // --- 6. Project Filter Grid ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active status from all filters
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const selectedCategory = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'flex';
                    // Trigger reflow to restart entry animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.85)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300); // match transition speeds
                }
            });
        });
    });

    // --- 7. Certificates Carousel Indicator Dots Sync ---
    const certsWrapper = document.getElementById('certs-wrapper');
    const certDots = document.querySelectorAll('#certs-indicators .dot');
    
    certDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.getAttribute('data-slide'));
            
            // Highlight dot
            certDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            
            // Calculate scroll target based on index
            const cards = certsWrapper.querySelectorAll('.certificate-card');
            if (cards.length > 0) {
                const cardWidth = cards[0].offsetWidth;
                const gap = 30; // matches css gap
                certsWrapper.scrollTo({
                    left: slideIndex * (cardWidth + gap),
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Auto sync indicators on manual swipe scroll
    certsWrapper.addEventListener('scroll', () => {
        const cards = certsWrapper.querySelectorAll('.certificate-card');
        if (cards.length > 0) {
            const cardWidth = cards[0].offsetWidth;
            const gap = 30;
            const scrollPosition = certsWrapper.scrollLeft;
            
            const slideIndex = Math.round(scrollPosition / (cardWidth + gap));
            
            certDots.forEach((dot, idx) => {
                if (idx === slideIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    });

    // --- 8. Contact Form Handler with Validation & Popup ---
    const contactForm = document.getElementById('portfolio-contact-form');
    const formSuccessPopup = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-contact-btn');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Capture inputs
        const nameVal = document.getElementById('contact-name').value.trim();
        const emailVal = document.getElementById('contact-email').value.trim();
        const subjectVal = document.getElementById('contact-subject').value.trim();
        const messageVal = document.getElementById('contact-message').value.trim();
        
        if (!nameVal || !emailVal || !subjectVal || !messageVal) {
            alert('Please fill out all fields.');
            return;
        }
        
        // Visual button status change
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `Sending... <i class="fa-solid fa-spinner fa-spin"></i>`;
        
        // Simulate API network POST request
        setTimeout(() => {
            // Hide Form
            contactForm.style.opacity = '0';
            setTimeout(() => {
                contactForm.style.display = 'none';
                
                // Show success block
                formSuccessPopup.style.display = 'flex';
                
                // Clear form fields
                contactForm.reset();
            }, 300);
        }, 1500);
    });
});
