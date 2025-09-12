// --- LÓGICA GLOBAL COMPLETA DO SITE ---
document.addEventListener('DOMContentLoaded', () => {

    const backgroundMusic = document.getElementById('background-music');
    let musicControl = document.getElementById('music-control');
    let musicIcon = document.getElementById('music-icon');

    // Cria o botão de controlo de música se ele não existir na página
    if (!musicControl) {
        const musicButton = document.createElement('div');
        musicButton.id = 'music-control';
        musicButton.className = 'music-control-button';
        musicButton.innerHTML = '<i id="music-icon" class="fa-solid fa-play"></i>';
        document.body.appendChild(musicButton);
        musicControl = musicButton;
        musicIcon = document.getElementById('music-icon');
    }
    
    // Adiciona o evento de clique ao botão de controlo
    if (musicControl) {
        musicControl.addEventListener('click', togglePlayPause);
    }
    
    // Função principal para tocar/pausar
    function togglePlayPause() {
        if (!backgroundMusic) return;
        
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(e => console.log("Erro ao tocar música:", e));
            if(musicIcon) {
                musicIcon.classList.remove('fa-play');
                musicIcon.classList.add('fa-pause');
            }
            localStorage.setItem('musicState', 'playing');
        } else {
            backgroundMusic.pause();
             if(musicIcon) {
                musicIcon.classList.remove('fa-pause');
                musicIcon.classList.add('fa-play');
            }
            localStorage.setItem('musicState', 'paused');
        }
    }

    // Identifica se a página é a principal (index)
    const isIndexPage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');
    
    // Salva o estado da música principal APENAS se estiver na página principal
    if (isIndexPage) {
        window.addEventListener('beforeunload', () => {
            if (backgroundMusic && !backgroundMusic.paused) {
                localStorage.setItem('mainMusicState', 'playing');
                localStorage.setItem('mainMusicTime', backgroundMusic.currentTime);
            } else {
                 localStorage.setItem('mainMusicState', 'paused');
            }
        });
    }

    // Restaura o estado da música ao carregar
    if (backgroundMusic) {
        const lastMusicState = localStorage.getItem('mainMusicState');
        const lastMusicTime = localStorage.getItem('mainMusicTime');
        
        // Se a página atual NÃO for a principal, toca a sua própria música
        if (!isIndexPage) {
            if (lastMusicState === 'playing') {
                backgroundMusic.play().catch(e => {});
                if(musicIcon) {
                    musicIcon.classList.remove('fa-play');
                    musicIcon.classList.add('fa-pause');
                }
            }
        } 
        // Se FOR a página principal, restaura o estado anterior
        else {
            if (lastMusicTime) {
                backgroundMusic.currentTime = parseFloat(lastMusicTime);
            }
            if (lastMusicState === 'playing') {
                backgroundMusic.play().catch(e => {});
                if(musicIcon) {
                    musicIcon.classList.remove('fa-play');
                    musicIcon.classList.add('fa-pause');
                }
            }
        }
    }


    // --- LÓGICA DA TELA DE BOAS-VINDAS (só para o index.html) ---
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainContent = document.getElementById('main-site-content');

    if (welcomeScreen) {
        welcomeScreen.addEventListener('click', () => {
            if (backgroundMusic && backgroundMusic.paused) {
                togglePlayPause(); // Usa a nossa função principal
            }
            welcomeScreen.style.opacity = '0';
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
            }, 800);
            if(mainContent) mainContent.style.opacity = '1';
        });
    }

    // --- LÓGICA PARA A PÁGINA DE CARTAS ---
    const letterTriggers = document.querySelectorAll('.letter-trigger');
    if (letterTriggers.length > 0) {
        const letterContents = document.querySelectorAll('.letter-content');
        letterTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const targetId = trigger.dataset.target;
                const targetContent = document.getElementById(targetId);
                letterContents.forEach(content => content.classList.remove('active'));
                if (targetContent) targetContent.classList.add('active');
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
                if(lightboxImg) lightboxImg.setAttribute('src', imageUrl);
                if(lightbox) lightbox.style.display = 'flex';
            });
        });

        function closeLightbox() { if (lightbox) lightbox.style.display = 'none'; }
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    }


    // --- EFEITO DE FUMAÇA ---
    const canvas = document.getElementById('smoke');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        class Smoke {
            constructor() { this.reset(); }
            reset() { this.fromTop = Math.random() < 0.5; this.x = Math.random() * canvas.width; this.y = this.fromTop ? -Math.random() * 100 : canvas.height + Math.random() * 100; this.size = Math.random() * 60 + 40; this.speedY = Math.random() * 0.3 + 0.1; this.angle = Math.random() * Math.PI * 2; this.alpha = Math.random() * 0.1 + 0.05; }
            update() { if (this.fromTop) { this.y += this.speedY; } else { this.y -= this.speedY; } this.angle += 0.002; this.x += Math.sin(this.angle) * 0.3; this.alpha -= 0.0005; if (this.alpha <= 0 || this.y < -100 || this.y > canvas.height + 100) this.reset(); }
            draw() { const gradient = ctx.createRadialGradient(this.x, this.y, this.size * 0.1, this.x, this.y, this.size); gradient.addColorStop(0, `rgba(200,200,200,${this.alpha})`); gradient.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
        }
        const smokes = [];
        for (let i = 0; i < 60; i++) smokes.push(new Smoke());
        function animateSmoke() { ctx.clearRect(0, 0, canvas.width, canvas.height); smokes.forEach(s => { s.update(); s.draw(); }); requestAnimationFrame(animateSmoke); }
        animateSmoke();
        window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
    }

    // --- LÓGICA PARA A PÁGINA DE QUIZ ---
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
        const submitBtn = document.getElementById('quiz-submit-btn');
        const retryBtn = document.getElementById('quiz-retry-btn');
        const questions = document.querySelectorAll('.quiz-question');
        const resultCard = document.getElementById('quiz-result');
        const scoreText = document.getElementById('quiz-score-text');
        const messageText = document.getElementById('quiz-message-text');

        questions.forEach(question => {
            const options = question.querySelectorAll('.quiz-option');
            options.forEach(option => {
                option.addEventListener('click', () => {
                    options.forEach(o => o.classList.remove('selected'));
                    option.classList.add('selected');
                });
            });
        });

        submitBtn.addEventListener('click', () => {
            let score = 0;
            questions.forEach(question => {
                const selectedOption = question.querySelector('.quiz-option.selected');
                if (selectedOption) {
                    if (selectedOption.dataset.correct === 'true') {
                        score++;
                        selectedOption.classList.add('correct');
                    } else {
                        selectedOption.classList.add('incorrect');
                    }
                }
            });

            scoreText.innerText = `Acertou ${score} de ${questions.length}!`;
            if (score === questions.length) {
                messageText.innerText = 'Parabens, bom mesmo❤️';
            } else {
                messageText.innerText = 'Eu acho que você não me ama';
            }

            quizContainer.style.display = 'none';
            resultCard.style.display = 'block';
        });

        retryBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }

    // --- LÓGICA PARA A PÁGINA DATE BUILDER ---
    const dateForm = document.getElementById('date-form');
    if (dateForm) {
        const resultCard = document.getElementById('date-result');
        const resultText = document.getElementById('date-result-text');

        dateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(dateForm);
            const clima = formData.get('clima');
            const comida = formData.get('comida');
            const final = formData.get('final');
            
            resultText.innerText = `Vamos ter ${clima}, depois vamos comer ${comida} e, para terminar, vamo dar uma ${final}.`;

            dateForm.style.display = 'none';
            resultCard.style.display = 'block';
        });
    }
});