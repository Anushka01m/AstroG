import { useRef, useEffect } from 'react';

const OrbitCanvas = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let time = 0;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Central body (Earth-like)
      ctx.fillStyle = '#4fd1c7';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.fill();

      // Orbit 1: Close asteroid
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
      ctx.stroke();

      // Orbit 2: Far asteroid
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 140, 0, Math.PI * 2);
      ctx.stroke();

      // Animated asteroids
      ctx.save();
      ctx.translate(centerX, centerY);

      // Close asteroid
      ctx.rotate(time * 0.02);
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(80, 0, 6, 0, Math.PI * 2);
      ctx.fill();

      // Far asteroid
      ctx.rotate(-time * 0.01);
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(140, 0, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      time += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="xl:col-span-2 bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Live Orbit Visualization</h2>
      <canvas
        ref={canvasRef}
        className="w-full h-96 bg-space-black rounded-xl border border-blue-500/50 shadow-lg"
      />
      <p className="text-sm text-gray-400 mt-4 text-center">
        Blue: Low-risk NEO | Orange: Medium-risk NEO
      </p>
    </div>
  );
};

export default OrbitCanvas;
