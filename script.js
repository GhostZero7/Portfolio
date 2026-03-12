// Boot Sequence Logic
const bootScreen = document.getElementById('boot-screen');
const bootLog = document.getElementById('boot-log');
const progressBar = document.getElementById('boot-progress-bar');

const logMessages = [
    "Establishing secure Uplink...",
    "Decrypting core modules...",
    "Loading neural grid...",
    "Syncing with Copperbelt Universe...",
    "Initializing UI/UX nexus...",
    "Vessel READY."
];

async function runBootSequence() {
    let progress = 0;
    for (let i = 0; i < logMessages.length; i++) {
        const msg = document.createElement('div');
        msg.textContent = `> ${logMessages[i]}`;
        bootLog.appendChild(msg);
        
        // Update progress
        progress += (100 / logMessages.length);
        progressBar.style.width = `${progress}%`;
        
        await new Promise(r => setTimeout(r, 400 + Math.random() * 600));
    }
    
    setTimeout(() => {
        bootScreen.style.opacity = '0';
        bootScreen.style.pointerEvents = 'none';
        setTimeout(() => bootScreen.remove(), 1000);
    }, 500);
}

document.addEventListener('DOMContentLoaded', runBootSequence);

// Space Animation Logic
const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');
const glow = document.getElementById('mouse-glow');

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

let stars = [];
let numStars = 400;
let speedMultiplier = 1;
let targetSpeed = 1;
let mouseX = 0;
let mouseY = 0;
let scrollOffset = 0;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Star {
    constructor() {
        this.init();
    }
    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * canvas.width;
        this.size = 0.5 + Math.random() * 2;
        this.speed = 0.2 + Math.random() * 1;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
    }
    update() {
        this.z -= this.speed * speedMultiplier;

        // Parallax effects
        const scrollParallax = scrollOffset * (this.speed * 0.05);
        const offsetX = (mouseX - canvas.width / 2) * (this.speed * 0.05);
        const offsetY = ((mouseY - canvas.height / 2) * (this.speed * 0.05)) - scrollParallax;

        if (this.z <= 0) {
            this.init();
            this.z = canvas.width;
        }
        const sx = (this.x - canvas.width / 2) * (canvas.width / this.z) + canvas.width / 2 + offsetX;
        const sy = (this.y - canvas.height / 2) * (canvas.width / this.z) + canvas.height / 2 + offsetY;
        const r = this.size * (canvas.width / this.z);

        if (sx >= 0 && sx <= canvas.width && sy >= 0 && sy <= canvas.height) {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(sx, sy, r, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function initStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }
}

function animate() {
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    speedMultiplier += (targetSpeed - speedMultiplier) * 0.05;
    stars.forEach(star => star.update());
    requestAnimationFrame(animate);
}

function warpSpeed() {
    targetSpeed = 50;
    setTimeout(() => {
        targetSpeed = 1;
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    }, 800);
}

window.addEventListener('resize', resize);

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.left = `${mouseX}px`;
    glow.style.top = `${mouseY}px`;
});

window.addEventListener('scroll', () => {
    scrollOffset = window.pageYOffset;

    let current = '';
    sections.forEach(section => {
        if (scrollOffset >= section.offsetTop - 300) {
            current = section.getAttribute('id');
        }
    });

    // Update desktop sidebar nav
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) link.classList.add('active');
    });

    // Update mobile bottom nav
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) link.classList.add('active');
    });
});

resize();
initStars();
animate();
