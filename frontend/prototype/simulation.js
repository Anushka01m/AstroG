
// ================= CANVAS =================
const canvas = document.getElementById("orbitCanvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const cx = () => canvas.width / 2;
const cy = () => canvas.height / 2;

// ================= STAR BACKGROUND =================
const stars = [];
const STAR_COUNT = 300;

function createStars() {
  stars.length = 0;
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5,
      alpha: 0.3 + Math.random() * 0.7
    });
  }
}

function drawStars() {
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.fill();
  });
}

createStars();

// ================= UI =================
let showTrails = false;
let isPaused = false;
let speedMultiplier = 1;

const trailBtn = document.getElementById("trailToggle");
const playPauseBtn = document.getElementById("playPause");
const speedSlider = document.getElementById("speedSlider");

trailBtn.onclick = () => {
  showTrails = !showTrails;
  trailBtn.innerText = showTrails ? "Hide Trails" : "Show Trails";
};

playPauseBtn.onclick = () => {
  isPaused = !isPaused;
  playPauseBtn.innerText = isPaused ? "Play" : "Pause";
};

speedSlider.oninput = () => {
  speedMultiplier = speedSlider.value / 50;
};

// ================= EARTH =================
const earth = { radius: 20, color: "deepskyblue" };

function drawEarth() {
  ctx.beginPath();
  ctx.arc(cx(), cy(), earth.radius, 0, Math.PI * 2);
  ctx.fillStyle = earth.color;
  ctx.fill();
}

// ================= CONSTANTS =================
const GRAVITY_SCALE = 0.15;
const DANGER_RADIUS = 120;
const MAX_TRAIL_LENGTH = 25;

// ================= ASTEROIDS =================
const asteroids = [];
const COUNT = 18;

for (let i = 0; i < COUNT; i++) {
  let a, b;

  if (i < 3) {
    a = 30 + Math.random() * 15;
    b = a * (0.8 + Math.random() * 0.1);
  } else {
    a = 120 + Math.random() * 300;
    b = a * (0.6 + Math.random() * 0.3);
  }

  asteroids.push({
    a, b,
    angle: Math.random() * Math.PI * 2,
    size: 3 + Math.random() * 3,
    trail: [],
    x: 0, y: 0, r: 0,
    vx: 0, vy: 0,
    state: "normal"
  });
}

// ================= UPDATE =================
function updateAsteroid(a) {
  const x = cx() + a.a * Math.cos(a.angle);
  const y = cy() + a.b * Math.sin(a.angle);

  const dx = x - cx();
  const dy = y - cy();
  const r = Math.sqrt(dx * dx + dy * dy);

  const speed = (GRAVITY_SCALE / Math.sqrt(r)) * speedMultiplier;

  a.vx = -Math.sin(a.angle) * speed * a.a;
  a.vy =  Math.cos(a.angle) * speed * a.b;

  a.angle += speed;
  a.x = x;
  a.y = y;
  a.r = r;

  if (showTrails) {
    a.trail.push({ x, y });
    if (a.trail.length > MAX_TRAIL_LENGTH) {
      a.trail.shift();
    }
  } else {
    a.trail = [];
  }
}

// ================= COLLISION =================
function checkCollision(a) {
  a.state = "normal";

  if (a.r < DANGER_RADIUS) {
    a.state = "near";

    if (a.r <= earth.radius + a.size) {
      a.state = "hit";
      return;
    }

    const nx = a.x + a.vx * 25;
    const ny = a.y + a.vy * 25;

    const dx = nx - cx();
    const dy = ny - cy();

    if (Math.sqrt(dx * dx + dy * dy) <= earth.radius) {
      a.state = "predict";
    }
  }
}

// ================= DRAW =================
function drawTrails(a) {
  for (let i = 1; i < a.trail.length; i++) {
    const p1 = a.trail[i - 1];
    const p2 = a.trail[i];
    const alpha = i / a.trail.length;

    ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.45})`;
    ctx.lineWidth = 0.8;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }
}

function drawAsteroid(a) {
  if (showTrails) drawTrails(a);

  ctx.beginPath();
  ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);

  if (a.state === "hit") ctx.fillStyle = "red";
  else if (a.state === "predict") ctx.fillStyle = "orange";
  else if (a.state === "near") ctx.fillStyle = "yellow";
  else ctx.fillStyle = "white";

  ctx.fill();
}

// ================= LOOP =================
function animate() {
  requestAnimationFrame(animate);

  if (isPaused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawStars();
  drawEarth();

  asteroids.forEach(a => {
    updateAsteroid(a);
    checkCollision(a);
    drawAsteroid(a);
  });
}

animate();

