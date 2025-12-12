 // Navigation scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Mobile menu
        const mobileMenuBtn = document.querySelector('.mobile-menu');
        const closeMenuBtn = document.querySelector('.close-menu');
        const mobileNav = document.querySelector('.mobile-nav');
        const overlay = document.querySelector('.overlay');
        const mobileLinks = document.querySelectorAll('.mobile-nav a');
        
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        function closeMenu() {
            mobileNav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        closeMenuBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);
        
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        
        // Particles animation
        function createParticles() {
            const particles = document.getElementById('particles');
            const particlesCount = 20;
            
            for (let i = 0; i < particlesCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Random size
                const size = Math.random() * 10 + 5;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                // Random position
                const posX = Math.random() * 100;
                const posY = Math.random() * 100;
                particle.style.left = `${posX}%`;
                particle.style.top = `${posY}%`;
                
                // Random animation delay
                const delay = Math.random() * 5;
                particle.style.animationDelay = `${delay}s`;
                
                particles.appendChild(particle);
            }
        }
        
        createParticles();
        // Testimonial slider
         const slider = document.querySelector('.testimonials-slider');
        const dots = document.querySelectorAll('.slider-dot');
        const arrowLeft = document.querySelector('.arrow-left');
        const arrowRight = document.querySelector('.arrow-right');
        let currentSlide = 0;
        const slidesCount = document.querySelectorAll('.testimonial').length;
        
        function goToSlide(slideIndex) {
            if (slideIndex < 0) {
                slideIndex = slidesCount - 1;
            } else if (slideIndex >= slidesCount) {
                slideIndex = 0;
            }
            
            slider.style.transform = `translateX(-${slideIndex * 100}%)`;
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === slideIndex);
            });
            
            currentSlide = slideIndex;
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });
        
        arrowLeft.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
        });
        
        arrowRight.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
        });
         // Auto slide
        setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 8000);

        // contact and success message 
           // Contact Form
        const contactForm = document.getElementById('contactForm');
        const successMessage = document.querySelector('.success-message');
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Normally would send data to server here
            // For demo, just show success message
            successMessage.style.display = 'block';
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        });
        
        // Animate features on scroll
        const featureCards = document.querySelectorAll('.feature-card');
        
        function checkVisibility() {
            featureCards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight - 100;
                
                if (isVisible) {
                    setTimeout(() => {
                        card.style.animation = `fadeUp 0.6s forwards`;
                        card.style.opacity = 1;
                    }, index * 100);
                }
            });
        }
        
        window.addEventListener('scroll', checkVisibility);
        window.addEventListener('load', checkVisibility);