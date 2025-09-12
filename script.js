// --- LÓGICA DA TELA DE BOAS-VINDAS E MÚSICA ---
const welcomeScreen = document.getElementById('welcome-screen');
const mainContent = document.getElementById('main-site-content');
const backgroundMusic = document.getElementById('background-music');

welcomeScreen.addEventListener('click', () => {
    // Inicia a música
    backgroundMusic.play();

    // Esconde a tela de boas-vindas
    welcomeScreen.style.opacity = '0';
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
    }, 800); // Tempo da transição do CSS

    // Mostra o conteúdo principal
    mainContent.style.opacity = '1';
});


// --- EFEITO DE FUMAÇA (SEU CÓDIGO ORIGINAL) ---
const canvas = document.getElementById('smoke');
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
        if(this.fromTop) {
            this.y += this.speedY;
        } else {
            this.y -= this.speedY;
        }
        this.angle += 0.002;
        this.x += Math.sin(this.angle) * 0.3;
        this.alpha -= 0.0005;
        if (this.alpha <= 0 || this.y < -100 || this.y > canvas.height + 100) this.reset();
    }
    draw() {
        const gradient = ctx.createRadialGradient(this.x, this.y, this.size*0.1, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(200,200,200,${this.alpha})`);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fill();
    }
}

const smokes = [];
for (let i=0; i<60; i++) smokes.push(new Smoke());

function animateSmoke() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    smokes.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(animateSmoke);
}
animateSmoke();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});