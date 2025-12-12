document.addEventListener('DOMContentLoaded', function() {
    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- Horizontal Scroll with Mouse ---
    const scrollContainer = document.querySelector('.showcase-container');
    if (scrollContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;

        scrollContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            scrollContainer.style.cursor = 'grabbing';
            startX = e.pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        });
        scrollContainer.addEventListener('mouseleave', () => {
            isDown = false;
            scrollContainer.style.cursor = 'grab';
        });
        scrollContainer.addEventListener('mouseup', () => {
            isDown = false;
            scrollContainer.style.cursor = 'grab';
        });
        scrollContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 2; //scroll-fast
            scrollContainer.scrollLeft = scrollLeft - walk;
        });
        scrollContainer.style.cursor = 'grab';
    }

    // --- Interactive Grid Background ---
    const canvas = document.getElementById('grid-canvas');
    const ctx = canvas.getContext('2d');
    let mouse = { x: undefined, y: undefined };
    let points = [];
    const gridSize = 40;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        points = [];
        for (let x = 0; x < canvas.width + gridSize; x += gridSize) {
            for (let y = 0; y < canvas.height + gridSize; y += gridSize) {
                points.push({
                    x: x,
                    y: y,
                    ox: x,
                    oy: y,
                });
            }
        }
    }
    resizeCanvas();

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('resize', resizeCanvas);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        points.forEach(p => {
            let dx = p.ox - mouse.x;
            let dy = p.oy - mouse.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            let force = -10000 / (dist * dist);
            if (dist < 100) {
                let angle = Math.atan2(dy, dx);
                p.x = p.ox + Math.cos(angle) * force;
                p.y = p.oy + Math.sin(angle) * force;
            } else {
                p.x = p.ox;
                p.y = p.oy;
            }
        });

        ctx.strokeStyle = 'rgba(158, 71, 255, 0.05)';
        ctx.beginPath();
        for (let i = 0; i < points.length; i++) {
            let p = points[i];
            let neighbors = points.filter(other => {
                let d = Math.sqrt(Math.pow(p.x - other.x, 2) + Math.pow(p.y - other.y, 2));
                return d < gridSize * 1.5 && d > 0;
            });
            neighbors.forEach(n => {
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(n.x, n.y);
            });
        }
        ctx.stroke();
        requestAnimationFrame(animate);
    }
    animate();
});
