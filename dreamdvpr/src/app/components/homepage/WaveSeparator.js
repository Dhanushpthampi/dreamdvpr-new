'use client';

import { useEffect, useRef } from 'react';

export default function WaveSeparator() {
  const ref = useRef(null);

  useEffect(() => {
    const layers = ref.current.querySelectorAll('[data-speed]');

    const onScroll = () => {
      const scrollY = window.scrollY;
      layers.forEach(layer => {
        const speed = Number(layer.dataset.speed);
        layer.style.transform = `
          translateY(${scrollY * speed}px)
          rotateX(180deg)
        `;  
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full h-[720px] overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(255, 255, 255, 0) 80%)'
      }}
    >
      {/* WAVE 1 — VERY DARK, HIGHER FREQUENCY */}
      <svg
        data-speed="0.04"
        className="absolute bottom-0 w-[240%] h-full"
        viewBox="0 0 2400 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#050814"
          d="
            M0,140
            C80,110 160,170 240,140
            C320,110 400,170 480,140
            C560,110 640,170 720,140
            C800,110 880,170 960,140
            C1040,110 1120,170 1200,140
            C1280,110 1360,170 1440,140
            C1520,110 1600,170 1680,140
            C1760,110 1840,170 1920,140
            C2000,110 2080,170 2160,140
            C2240,110 2320,170 2400,140
            L2400,320 L0,320 Z
          "
        />
      </svg>

      {/* WAVE 2 — DARK BLUE, HIGHER FREQUENCY */}
      <svg
        data-speed="0.1"
        className="absolute bottom-0 w-[240%] h-[85%]"
        viewBox="0 0 2400 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#0b0f2a"
          d="
            M0,170
            C70,200 140,140 210,170
            C280,200 350,140 420,170
            C490,200 560,140 630,170
            C700,200 770,140 840,170
            C910,200 980,140 1050,170
            C1120,200 1190,140 1260,170
            C1330,200 1400,140 1470,170
            C1540,200 1610,140 1680,170
            C1750,200 1820,140 1890,170
            C1960,200 2030,140 2100,170
            C2170,200 2240,140 2310,170
            C2380,200 2400,140 2400,170
            L2400,320 L0,320 Z
          "
        />
      </svg>

      {/* WAVE 3 — COSMIC BLUE, moderate frequency */}
      <svg
        data-speed="0.18"
        className="absolute bottom-0 w-[240%] h-[70%]"
        viewBox="0 0 2400 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#141a44"
          d="
            M0,210
            C90,250 180,170 270,210
            C360,250 450,170 540,210
            C630,250 720,170 810,210
            C900,250 990,170 1080,210
            C1170,250 1260,170 1350,210
            C1440,250 1530,170 1620,210
            C1710,250 1800,170 1890,210
            C1980,250 2070,170 2160,210
            C2250,250 2340,170 2430,210
            L2430,320 L0,320 Z
          "
        />
      </svg> 
    </div>
  );
}
    