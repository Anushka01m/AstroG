export function initOrbitCanvas() {
  const canvas = document.getElementById('orbitCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);

  let t = 0;

  function draw() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.6)';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 80, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 140, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();

    const angle1 = t * 0.02;
    const x1 = cx + 80 * Math.cos(angle1);
    const y1 = cy + 80 * Math.sin(angle1);
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(x1, y1, 6, 0, Math.PI * 2);
    ctx.fill();

    const angle2 = t * -0.012;
    const x2 = cx + 140 * Math.cos(angle2);
    const y2 = cy + 140 * Math.sin(angle2);
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(x2, y2, 8, 0, Math.PI * 2);
    ctx.fill();

    t += 1;
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}
