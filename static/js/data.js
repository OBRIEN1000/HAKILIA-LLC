document.addEventListener('DOMContentLoaded', function() {
    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- Data Stream Canvas Animation ---
    const canvas = document.getElementById('data-stream-canvas');
    const ctx = canvas.getContext('2d');
    let lines = [];
    let mouse = { x: undefined, y: undefined };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        lines = [];
        const lineCount = Math.floor(canvas.width / 25);
        for (let i = 0; i < lineCount; i++) {
            lines.push(new Line());
        }
    }

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Line {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.speed = Math.random() * 0.5 + 0.2;
            this.length = Math.random() * 200 + 50;
            this.width = Math.random() * 1.5 + 0.2;
            this.hue = Math.random() * 360;
        }
        update() {
            this.x += this.speed;
            if (this.x > canvas.width + this.length) {
                this.x = -this.length;
                this.y = Math.random() * canvas.height;
            }
            
            // Mouse interaction
            if(mouse.x && mouse.y) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 50) {
                    this.speed = 2;
                } else {
                    this.speed = Math.random() * 0.5 + 0.2;
                }
            }
        }
        draw() {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.length, this.y);
            ctx.lineWidth = this.width;
            ctx.strokeStyle = `hsla(${this.hue}, 100%, 70%, 0.5)`;
            ctx.stroke();
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lines.forEach(line => {
            line.update();
            line.draw();
        });
        requestAnimationFrame(animate);
    }

    resizeCanvas();
    animate();
    window.addEventListener('resize', resizeCanvas);
});
