// --- LÓGICA GLOBAL COMPLETA DO SITE ---
document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS GERAIS ---
    const backgroundMusic = document.getElementById('background-music');
    const musicControl = document.getElementById('music-control');
    const musicIcon = document.getElementById('music-icon');

    // --- LÓGICA DE CONTROLO DA MÚSICA ---
    if (musicControl) {
        function togglePlayPause() {
            if (backgroundMusic.paused) {
                backgroundMusic.play().catch(e => console.log("Erro ao tocar música:", e));
                musicIcon.classList.remove('fa-play');
                musicIcon.classList.add('fa-pause');
            } else {
                backgroundMusic.pause();
                musicIcon.classList.remove('fa-pause');
                musicIcon.classList.add('fa-play');
            }
        }
        musicControl.addEventListener('click', togglePlayPause);
    }

    // --- LÓGICA DA TELA DE BOAS-VINDAS ---
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainContent = document.getElementById('main-site-content');

    if (welcomeScreen) {
        welcomeScreen.addEventListener('click', () => {
            if (backgroundMusic.paused) {
                backgroundMusic.play().catch(e => console.log("Autoplay bloqueado, aguardando interação."));
                if (musicIcon) {
                    musicIcon.classList.remove('fa-play');
                    musicIcon.classList.add('fa-pause');
                }
            }
            welcomeScreen.style.opacity = '0';
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
            }, 800);
            mainContent.style.opacity = '1';
        });
    }

    // --- LÓGICA PARA A PÁGINA DE CARTAS ---
    const letterTriggers = document.querySelectorAll('.letter-trigger');
    if (letterTriggers.length > 0) {
        const letterContents = document.querySelectorAll('.letter-content');
        const placeholder = document.getElementById('letter-placeholder');

        letterTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const targetId = trigger.dataset.target;
                const targetContent = document.getElementById(targetId);

                // Remove a aura e esconde todas as outras cartas
                letterContents.forEach(content => {
                    content.classList.remove('active');
                });
                if (placeholder) {
                    placeholder.style.display = 'none';
                }

                // Mostra e adiciona a aura na carta clicada
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    // --- LÓGICA PARA A PÁGINA DE GALERIA (LIGHTBOX) ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.querySelector('.lightbox-close');

        galleryItems.forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();
                const imageUrl = item.getAttribute('href');
                lightboxImg.setAttribute('src', imageUrl);
                lightbox.style.display = 'flex';
            });
        });

        function closeLightbox() {
            if (lightbox) lightbox.style.display = 'none';
        }
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightbox) lightbox.addEventListener('click', e => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }


    // --- EFEITO DE FUMAÇA ---
    const canvas = document.getElementById('smoke');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Smoke {
            constructor() { this.reset(); }
            reset() {
                this.fromTop = Math.random() < 0.5;
                this.x = Math.random() * canvas.width;
                this.y = this.fromTop ? -Math.random() * 100 : canvas.height + Math.random() * 100;
                this.size = Math.random() * 60 + 40;
                this.speedY = Math.random() * 0.3 + 0.1;
                this.angle = Math.random() * Math.PI * 2;
                this.alpha = Math.random() * 0.1 + 0.05;
            }
            update() {
                if (this.fromTop) { this.y += this.speedY; } else { this.y -= this.speedY; }
                this.angle += 0.002;
                this.x += Math.sin(this.angle) * 0.3;
                this.alpha -= 0.0005;
                if (this.alpha <= 0 || this.y < -100 || this.y > canvas.height + 100) this.reset();
            }
            draw() {
                const gradient = ctx.createRadialGradient(this.x, this.y, this.size * 0.1, this.x, this.y, this.size);
                gradient.addColorStop(0, `rgba(200,200,200,${this.alpha})`);
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const smokes = [];
        for (let i = 0; i < 60; i++) smokes.push(new Smoke());

        function animateSmoke() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            smokes.forEach(s => { s.update(); s.draw(); });
            requestAnimationFrame(animateSmoke);
        }
        animateSmoke();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
});