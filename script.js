// --- CONFIGURATION ---
const currentYear = new Date().getFullYear();
let birthdayDate = new Date(currentYear, 9, 16, 0, 0, 0).getTime();

if (new Date().getTime() > birthdayDate + (24 * 60 * 60 * 1000)) {
    birthdayDate = new Date(currentYear + 1, 9, 16, 0, 0, 0).getTime();
}

// UI Elements
const countdownSection = document.getElementById('countdown-section');
const celebrationSection = document.getElementById('celebration-section');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

let isCelebrating = false;

// --- TIMER LOGIC ---
let timerInterval = setInterval(updateTimer, 1000);

function updateTimer() {
    if (isCelebrating) return;

    const now = new Date().getTime();
    const distance = birthdayDate - now;

    if (distance <= 0) {
        triggerCelebration(false);
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerText = days < 10 ? '0' + days : days;
    hoursEl.innerText = hours < 10 ? '0' + hours : hours;
    minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
    secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
}

updateTimer();

// --- TRANSITION LOGIC ---
function triggerCelebration(isManualSkip = false) {
    if (isCelebrating) return;
    isCelebrating = true;
    clearInterval(timerInterval);

    countdownSection.classList.add('fade-out');
    
    setTimeout(() => {
        countdownSection.style.display = 'none';
        celebrationSection.classList.remove('hidden');
        celebrationSection.classList.add('flex', 'fade-in');
        startConfetti();
    }, 800); 
}

// --- CONFETTI ANIMATION LOGIC ---
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

const colors = ['#fef08a', '#eab308', '#ca8a04', '#ffffff', '#fbbf24', '#d97706'];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height; 
        this.size = Math.random() * 12 + 6;
        this.speedY = Math.random() * 4 + 2;
        this.speedX = Math.random() * 3 - 1.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 6 - 3;
        this.shape = Math.random() > 0.5 ? 'circle' : 'rect';
        this.oscillationSpeed = Math.random() * 0.05 + 0.01;
        this.oscillationDistance = Math.random() * 2 + 0.5;
        this.time = Math.random() * 100;
    }

    update() {
        this.time += this.oscillationSpeed;
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.time) * this.oscillationDistance;
        this.rotation += this.rotationSpeed;

        if (this.y > canvas.height + this.size) {
            this.y = -this.size;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.85;

        if (this.shape === 'rect') {
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

function initConfetti() {
    particles = [];
    const particleCount = window.innerWidth < 768 ? 150 : 350; 
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    animationId = requestAnimationFrame(animateConfetti);
}

function startConfetti() {
    initConfetti();
    animateConfetti();
}