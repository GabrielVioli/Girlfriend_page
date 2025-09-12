// --- LÓGICA GLOBAL COMPLETA DO SITE (COM FADE E AUTOPLAY) ---
document.addEventListener('DOMContentLoaded', () => {

    const backgroundMusic = document.getElementById('background-music');
    let musicControl = document.getElementById('music-control');
    let musicIcon = document.getElementById('music-icon');

    // Cria o botão de controlo de música se ele não existir
    if (!musicControl) {
        const musicButton = document.createElement('div');
        musicButton.id = 'music-control';
        musicButton.className = 'music-control-button';
        musicButton.innerHTML = '<i id="music-icon" class="fa-solid fa-play"></i>';
        document.body.appendChild(musicButton);
        musicControl = musicButton;
        musicIcon = document.getElementById('music-icon');
    }
    
    // Adiciona o evento de clique ao botão
    if (musicControl) {
        musicControl.addEventListener('click', togglePlayPause);
    }
    
    // --- NOVA FUNÇÃO DE FADE PARA ÁUDIO ---
    let fadeInterval;
    function fadeAudio(audio, targetVolume, duration) {
        clearInterval(fadeInterval);
        const startVolume = audio.volume;
        const volumeChange = targetVolume - startVolume;
        if (volumeChange === 0) return;

        const steps = duration / 20;
        let currentStep = 0;

        if (targetVolume > 0 && audio.paused) {
            audio.volume = 0;
            audio.play().catch(e => {});
        }

        fadeInterval = setInterval(() => {
            currentStep++;
            const newVolume = startVolume + (volumeChange * (currentStep / steps));
            audio.volume = Math.max(0, Math.min(1, newVolume));

            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                audio.volume = targetVolume;
                if (targetVolume === 0) {
                    audio.pause();
                }
            }
        }, 20);
    }
    
    // Função principal para tocar/pausar (agora com fade)
    function togglePlayPause() {
        if (!backgroundMusic) return;
        
        if (backgroundMusic.paused) {
            fadeAudio(backgroundMusic, 0.7, 500); // Fade in suave para 70% do volume
            if(musicIcon) {
                musicIcon.classList.remove('fa-play');
                musicIcon.classList.add('fa-pause');
            }
        } else {
            fadeAudio(backgroundMusic, 0, 500); // Fade out suave
             if(musicIcon) {
                musicIcon.classList.remove('fa-pause');
                musicIcon.classList.add('fa-play');
            }
        }
    }
    
    // --- LÓGICA ATUALIZADA PARA MANTER A MÚSICA ENTRE PÁGINAS ---
    if (backgroundMusic) {
        // Salva o estado da música antes de sair da página
        window.addEventListener('beforeunload', () => {
            localStorage.setItem('musicWasPlaying', !backgroundMusic.paused);
            localStorage.setItem('musicTime', backgroundMusic.currentTime);
        });

        // Restaura o estado da música ao carregar uma nova página
        const musicWasPlaying = localStorage.getItem('musicWasPlaying') === 'true';
        const musicTime = localStorage.getItem('musicTime');

        if (musicTime) {
            backgroundMusic.currentTime = parseFloat(musicTime);
        }

        if (musicWasPlaying) {
            // Tenta tocar automaticamente
            backgroundMusic.play().then(() => {
                // Se conseguir tocar, ajusta o ícone e o volume com fade
                fadeAudio(backgroundMusic, 0.7, 500);
                if(musicIcon) {
                    musicIcon.classList.remove('fa-play');
                    musicIcon.classList.add('fa-pause');
                }
            }).catch(error => {
                // Se o navegador bloquear, apenas atualiza o ícone para "play"
                if(musicIcon) {
                    musicIcon.classList.remove('fa-pause');
                    musicIcon.classList.add('fa-play');
                }
                console.log("Autoplay bloqueado pelo navegador.");
            });
        }
    }

    // --- LÓGICA DA TELA DE BOAS-VINDAS ---
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainContent = document.getElementById('main-site-content');

    if (welcomeScreen) {
        welcomeScreen.addEventListener('click', () => {
            if (backgroundMusic && backgroundMusic.paused) {
                togglePlayPause(); // Já usa a nova função com fade
            }
            welcomeScreen.style.opacity = '0';
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
            }, 800);
            if(mainContent) mainContent.style.opacity = '1';
        });
    }

    // --- LÓGICA PARA A PÁGINA DE CARTAS (sem alteração) ---
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

    // --- LÓGICA PARA A PÁGINA DE GALERIA (LIGHTBOX) (sem alteração) ---
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
    
    // --- LÓGICA PARA A PÁGINA DE QUIZ (sem alteração) ---
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

    // --- LÓGICA PARA A PÁGINA DATE BUILDER (sem alteração) ---
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

    // --- LÓGICA PARA A PÁGINA DE PLAYLIST COLABORATIVA (sem alteração) ---
    const suggestionForm = document.getElementById('suggestion-form');
    if (suggestionForm) {
        const thanksCard = document.getElementById('suggestion-thanks');
        suggestionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            suggestionForm.style.display = 'none';
            thanksCard.style.display = 'block';
        });
    }

    // --- LÓGICA PARA A PÁGINA DO MAPA (sem alteração) ---
    const mapDiv = document.getElementById('map');
    if (mapDiv) {
        const map = L.map('map').setView([-25.385679501650788, -51.48159767058508], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        L.marker([-25.396641162563988, -51.49697690572052]).addTo(map).bindPopup("<b>Nosso lugar favorito</b>");
        L.marker([-25.393455795642158, -51.46562171887554]).addTo(map).bindPopup("<b>Lugar que a gente mais vai</b>");
        L.marker([-25.399750871982004, -51.47213643378566]).addTo(map).bindPopup("<b>As vezes a gente vai</b>");
        L.marker([-25.40790398079299, -51.47148555571832]).addTo(map).bindPopup("<b>A gente foi muitas vezes</b>");
        L.marker([-25.405080594528208, -51.466996417787996]).addTo(map).bindPopup("<b>QUERO IR DE NOVO</b>");
        L.marker([-25.399414785408815, -51.470535794523094]).addTo(map).bindPopup("<b>sdds rs</b>");
        L.marker([-25.57035259941736, -48.31507901555088]).addTo(map).bindPopup("<b>Ano que vem tamo de volta</b>");
        L.marker([-25.402392586653214, -51.498051282499354]).addTo(map).bindPopup("<b>A maior parte do nosso tempo se passa aqui</b>");
        L.marker([-25.40581008919907, -51.49761758398823]).addTo(map).bindPopup("<b>Um dos lugares que mais gosto</b>");
    }

    // --- EFEITO DE FUMAÇA (sem alteração) ---
    const canvas = document.getElementById('smoke');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        class Smoke { constructor() { this.reset(); } reset() { this.fromTop = Math.random() < 0.5; this.x = Math.random() * canvas.width; this.y = this.fromTop ? -Math.random() * 100 : canvas.height + Math.random() * 100; this.size = Math.random() * 60 + 40; this.speedY = Math.random() * 0.3 + 0.1; this.angle = Math.random() * Math.PI * 2; this.alpha = Math.random() * 0.1 + 0.05; } update() { if (this.fromTop) { this.y += this.speedY; } else { this.y -= this.speedY; } this.angle += 0.002; this.x += Math.sin(this.angle) * 0.3; this.alpha -= 0.0005; if (this.alpha <= 0 || this.y < -100 || this.y > canvas.height + 100) this.reset(); } draw() { const gradient = ctx.createRadialGradient(this.x, this.y, this.size * 0.1, this.x, this.y, this.size); gradient.addColorStop(0, `rgba(200,200,200,${this.alpha})`); gradient.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); } }
        const smokes = [];
        for (let i = 0; i < 60; i++) smokes.push(new Smoke());
        function animateSmoke() { ctx.clearRect(0, 0, canvas.width, canvas.height); smokes.forEach(s => { s.update(); s.draw(); }); requestAnimationFrame(animateSmoke); }
        animateSmoke();
        window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
    }
});