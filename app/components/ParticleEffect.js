'use client';

import { useEffect, useRef } from 'react';

export default function ParticleEffect() {
  const canvasRef = useRef(null);
  const animIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles = [];
    const PARTICLE_COUNT = 40;
    const COLORS = [
      'rgba(255, 45, 120, 0.3)',
      'rgba(255, 138, 0, 0.25)',
      'rgba(0, 212, 170, 0.2)',
      'rgba(255, 215, 0, 0.2)',
      'rgba(255, 255, 255, 0.15)',
    ];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -(Math.random() * 0.4 + 0.1),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: Math.random() * 0.6 + 0.2,
        life: Math.random() * 200 + 100,
        maxLife: 0,
      };
    }

    function init() {
      resize();
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = createParticle();
        p.maxLife = p.life;
        particles.push(p);
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.life--;

        const lifeRatio = p.life / p.maxLife;
        const currentOpacity = p.opacity * lifeRatio;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${currentOpacity})`);
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${currentOpacity * 0.15})`);
        ctx.fill();

        if (p.life <= 0 || p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
          particles[i] = createParticle();
          particles[i].y = canvas.height + 10;
          particles[i].maxLife = particles[i].life;
        }
      }

      animIdRef.current = requestAnimationFrame(animate);
    }

    // Check for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return;

    init();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}
