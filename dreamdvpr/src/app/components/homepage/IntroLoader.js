'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function IntroLoader({ onComplete }) {
  const [startAnimation, setStartAnimation] = useState(false);
  const brandColor = '#e53e3e';

  useEffect(() => {
    // Lock scroll
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // Start animation sequence
    setStartAnimation(true);

    const totalDuration = 1500; // Reduced duration

    const timer = setTimeout(() => {
      onComplete?.();
    }, totalDuration);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalStyle;
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden">

      {/* Container - Gravity is the anchor */}
      <div className="relative flex flex-col items-center justify-center">

        {/* RED Text - Absolute above Gravity */}
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none"
          style={{ marginBottom: '-10rem' }} // Tighten spacing to gravity
        >
          <motion.h1
            className="text-[400px] font-black tracking-tighter text-center whitespace-nowrap leading-none antialiased"
            style={{
              color: brandColor,
              backfaceVisibility: 'hidden',
              WebkitFontSmoothing: 'antialiased',
              transformOrigin: 'center center'
            }}
            initial={{ scale: 0.25 }}
            animate={startAnimation ? {
              scale: [0.25, 0.25, 0.3, 0.2, 30] // Reduced final scale from 40 to 30
            } : { scale: 0.25 }}
            transition={{
              duration: 1.2,
              times: [0, 0.4, 0.5, 0.6, 1],
              ease: "easeInOut"
            }}
          >
            RE<span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>D</span>
          </motion.h1>
        </div>

        {/* gravity Text - Center of Page (No animation, just static) */}
        <p
          className="text-4xl md:text-5xl font-bold tracking-widest relative z-20 text-black uppercase"
        >
          gravity
        </p>

      </div>
    </div>
  );
}
