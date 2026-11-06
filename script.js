/* ═══════════════════════════════════════════════════
   MULENGA MUSAMBA — PORTFOLIO SCRIPTS
   ═══════════════════════════════════════════════════ */

// ── Space Canvas ──────────────────────────────────
const canvas = document.getElementById('space-canvas');
const ctx    = canvas.getContext('2d');
const glow   = document.getElementById('mouse-glow');

let stars          = [];
const NUM_STARS    = 350;
let speedMultiplier = 1;
let targetSpeed    = 1;
let mouseX = window.innerWidth  / 2;
let mouseY = window.innerHeight / 2;
let scrollOffset   = 0;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Star {
  constructor() { this.reset(); }
  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height;
    this.z     = Math.random() * canvas.width;
    this.size  = 0.5 + Math.random() * 1.8;
    this.speed = 0.2 + Math.random() * 0.9;
    this.color = `rgba(255,255,255,${(Math.random() * 0.6 + 0.2).toFixed(2)})`;
  }
  update() {
    this.z -= this.speed * speedMultiplier;
    if (this.z <= 0) { this.reset(); this.z = canvas.width; return; }

    const scrollParallax = scrollOffset * (this.speed * 0.04);
    const offsetX = (mouseX - canvas.width  / 2) * (this.speed * 0.04);
    const offsetY = (mouseY - canvas.height / 2) * (this.speed * 0.04) - scrollParallax;

    const sx = (this.x - canvas.width  / 2) * (canvas.width / this.z) + canvas.width  / 2 + offsetX;
    const sy = (this.y - canvas.height / 2) * (canvas.width / this.z) + canvas.height / 2 + offsetY;
    const r  = this.size * (canvas.width / this.z);

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
  for (let i = 0; i < NUM_STARS; i++) stars.push(new Star());
}

function animate() {
  // Fill dark when in dark mode, transparent otherwise
  const isDark = document.documentElement.classList.contains('dark');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (isDark) {
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  speedMultiplier += (targetSpeed - speedMultiplier) * 0.05;
  stars.forEach(s => s.update());
  requestAnimationFrame(animate);
}

// Called by Alpine when dark mode changes
function updateCanvasForTheme(isDark) {
  // Canvas visibility is handled via CSS opacity on .dark #space-canvas
}

// Warp speed button
function warpSpeed() {
  targetSpeed = 55;
  setTimeout(() => {
    targetSpeed = 1;
    document.getElementById('work').scrollIntoView({ behavior: 'smooth' });
  }, 800);
}

window.addEventListener('resize', resizeCanvas, { passive: true });

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (glow) {
    glow.style.left = `${mouseX}px`;
    glow.style.top  = `${mouseY}px`;
  }
}, { passive: true });

window.addEventListener('scroll', () => {
  scrollOffset = window.scrollY;
}, { passive: true });

resizeCanvas();
initStars();
animate();

// ── Scroll Reveal ─────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});

// ── Footer year ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
});

// ── Wave Gallery — Modal ──────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tj-item').forEach(item => {
    item.addEventListener('click', () => {
      const img  = item.querySelector('img');
      const modal    = document.getElementById('tj-modal');
      const modalImg = document.getElementById('tj-modal-img');
      if (modal && modalImg && img) {
        modalImg.src = img.src;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    });
  });
});

function tjCloseModal() {
  const modal = document.getElementById('tj-modal');
  if (modal) {
    modal.style.display = 'none';
    document.getElementById('tj-modal-img').src = '';
    document.body.style.overflow = '';
  }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') tjCloseModal();
});
