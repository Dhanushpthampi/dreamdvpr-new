'use client';

import { useEffect, useRef } from 'react';

export default function DreamSpaceBackground() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let nebulaGradient;
    let running = true;
    let isVisible = true;

    const createNebulaGradient = () => {
      nebulaGradient = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.4,
        100,
        canvas.width * 0.5,
        canvas.height * 0.4,
        canvas.width * 0.7
      );

      nebulaGradient.addColorStop(0, 'rgba(90,120,255,0.06)');
      nebulaGradient.addColorStop(0.5, 'rgba(160,90,255,0.04)');
      nebulaGradient.addColorStop(1, 'rgba(0,0,30,0)');
    };

    /* ---------------- Stars ---------------- */

    class Star {
      constructor() {
        this.reset();
      }

      reset() {
        this.depth = Math.random(); // parallax
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = this.depth * 1.5 + 0.3;
        this.speed = this.depth * 0.15;
        this.alpha = Math.random() * 0.7 + 0.3;
        this.twinkle = Math.random() * 0.02 + 0.003;
      }

      update() {
        this.y += this.speed;
        this.alpha += Math.sin(Date.now() * this.twinkle) * 0.01;

        if (this.y > canvas.height) {
          this.y = 0;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.fillStyle = `rgba(200,220,255,${this.alpha})`;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const stars = Array.from({ length: 350 }, () => new Star());

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createNebulaGradient();

      // Redistribute stars to fill new dimensions immediately
      stars.forEach(star => {
        star.x = Math.random() * canvas.width;
        star.y = Math.random() * canvas.height;
      });
    };

    resize();
    window.addEventListener('resize', resize);

    /* ---------------- Shooting Stars ---------------- */

    class ShootingStar {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * 0.3;
        this.vx = Math.random() * 8 + 6;
        this.vy = Math.random() * 4 + 3;
        this.life = 0;
        this.maxLife = 40;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
      }

      draw() {
        ctx.strokeStyle = `rgba(180,220,255,${1 - this.life / this.maxLife})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * 3, this.y - this.vy * 3);
        ctx.stroke();
      }
    }

    const shootingStars = [];

    /* ---------------- Nebula ---------------- */

    const drawNebula = () => {
      if (!nebulaGradient) createNebulaGradient();
      ctx.fillStyle = nebulaGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    /* ---------------- Animate ---------------- */

    const animate = () => {
      if (!running || !isVisible) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawNebula();

      stars.forEach(star => {
        star.update();
        star.draw();
      });

      if (Math.random() < 0.008) {
        shootingStars.push(new ShootingStar());
      }

      shootingStars.forEach((s, i) => {
        s.update();
        s.draw();
        if (s.life > s.maxLife) shootingStars.splice(i, 1);
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleVisibility = () => {
      running = !document.hidden;
      if (running && isVisible) animate();
      else cancelAnimationFrame(rafRef.current);
    };

    // Intersection Observer to stop RAF when out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && running) {
          animate();
        } else {
          cancelAnimationFrame(rafRef.current);
        }
      },
      { threshold: 0 }
    );

    observer.observe(canvas);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      running = false;
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'black'
      }}
    />
  );
}
