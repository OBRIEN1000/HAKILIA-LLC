document.addEventListener('DOMContentLoaded', function() {
        // --- Header Scroll Effect ---
        const header = document.getElementById('header');
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });

        // --- Scroll Reveal Animation ---
        const revealElements = document.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => observer.observe(el));

        // --- Constellation Canvas Animation ---
        const canvas = document.getElementById('constellation-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: undefined, y: undefined, radius: 100 };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            let particleCount = Math.floor((canvas.width * canvas.height) / 15000);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 1;
                this.speedX = (Math.random() * 0.4) - 0.2;
                this.speedY = (Math.random() * 0.4) - 0.2;
                this.color = `rgba(0, 162, 255, ${Math.random() * 0.5 + 0.3})`;
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
                this.x += this.speedX;
                this.y += this.speedY;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = Math.sqrt(
                        (particles[a].x - particles[b].x) * (particles[a].x - particles[b].x) +
                        (particles[a].y - particles[b].y) * (particles[a].y - particles[b].y)
                    );
                    if (distance < 100) {
                        opacityValue = 1 - (distance / 100);
                        ctx.strokeStyle = `rgba(0, 162, 255, ${opacityValue * 0.5})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connect();
            requestAnimationFrame(animate);
        }

        resizeCanvas();
        animate();
        window.addEventListener('resize', resizeCanvas);
    });
