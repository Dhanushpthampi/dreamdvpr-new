'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleBackground from './ParticleBackground';

export default function IntroLoader({ onComplete }) {
  const [startAnimation, setStartAnimation] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const brandColor = '#c53030';

  useEffect(() => {
    // Lock scroll
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // Start animation sequence
    setStartAnimation(true);

    const animationDuration = 800;
    const exitDuration = 300;

    // Trigger exit animation before completion
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, animationDuration);

    const completionTimer = setTimeout(() => {
      onComplete?.();
    }, animationDuration + exitDuration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completionTimer);
      document.body.style.overflow = originalStyle;
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <ParticleBackground />
      {!isExiting && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] bg-[#f5f5f7] flex items-center justify-center overflow-hidden"
        >
          {/* Container - Gravity is the anchor */}
          <div className="relative flex flex-col items-center justify-center">

            {/* RED Text - Absolute above Gravity */}
            <div
              className="absolute bottom-full left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none"
              style={{ marginBottom: '-10rem' }} // Tighten spacing to gravity
            >
              <motion.h1
                className="text-[200px] md:text-[300px] font-black tracking-tighter text-center whitespace-nowrap leading-none antialiased mb-20"
                style={{
                  color: brandColor,
                  backfaceVisibility: 'hidden',
                  WebkitFontSmoothing: 'antialiased',
                  transformOrigin: 'center center'
                }}
                initial={{ scale: 0.5 }}
                animate={startAnimation ? {
                  scale: [0.5, 0.5, 0.6, 0.4, 60]
                } : { scale: 0.5 }}
                transition={{
                  duration: 0.8,
                  times: [0, 0.4, 0.5, 0.6, 1],
                  ease: "easeInOut"
                }}
              >
                RE<span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>D</span>
              </motion.h1>
            </div>

            {/* gravity Text - Center of Page */}
            <p
              className="text-4xl md:text-5xl font-bold tracking-widest relative z-20 text-black uppercase"
            >
              gravity
            </p>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
