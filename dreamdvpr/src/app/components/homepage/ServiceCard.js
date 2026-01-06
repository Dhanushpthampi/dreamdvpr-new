'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const isVideo = (url = '') => /\.(mp4|webm|ogg)$/i.test(url);
const isImage = (url = '') => /\.(gif|png|jpg|jpeg|webp)$/i.test(url);

const ServiceCard = ({
  title,
  description,
  media,
  colSpan = 1,
  rowSpan = 1,
  isFeatured = false,
}) => {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [screenSize, setScreenSize] = useState('mobile');
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef(null);

  /* ===============================
     BREAKPOINT DETECTION
  ================================ */
  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width >= 1024) setScreenSize('lg');
      else if (width >= 768) setScreenSize('md');
      else setScreenSize('mobile');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Once in view, keep it loaded
        }
      },
      { rootMargin: '200px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  /* ===============================
     MEDIA HEIGHT LOGIC
  ================================ */
  const getMediaHeight = () => {
    if (screenSize === 'lg') return 140 * (rowSpan > 1 ? 5 : 2);
    if (screenSize === 'md') return 80 * (rowSpan > 1 ? 4 : 1.5); // Significantly reduced for md
    return 160 * 2; // Mobile
  };
  const mediaHeight = getMediaHeight();
  const isDesktop = screenSize === 'lg' || screenSize === 'md';

  /* ===============================
     MOUSE TRACKING (for glow)
  ================================ */
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`
        relative overflow-hidden rounded-xl
        bg-white/70
        backdrop-blur-xl backdrop-saturate-150
        flex flex-col
        border ${isFeatured ? 'border-emerald-500/30' : 'border-black/5'}
      `}
      style={{
        gridColumn: isDesktop ? `span ${colSpan}` : 'span 1',
        gridRow: isDesktop ? `span ${rowSpan}` : 'span 1',

        /* 🍎 Apple-style neutral gray shadows */
        boxShadow: hovered
          ? `
            0 2px 4px rgba(0, 0, 0, 0.08),
            0 12px 32px rgba(0, 0, 0, 0.12),
            0 0 20px ${isFeatured ? 'rgba(16, 185, 129, 0.2)' : 'rgba(71, 85, 105, 0.15)'}
          `
          : `
            0 1px 2px rgba(0, 0, 0, 0.06),
            0 4px 12px rgba(0, 0, 0, 0.08)
            ${isFeatured ? ', 0 0 10px rgba(16, 185, 129, 0.1)' : ''}
          `,
      }}
      whileHover={isDesktop ? { scale: 1.01 } : undefined}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* MEDIA */}
      {media && (
        <div className="relative z-[2] p-3" style={{ height: mediaHeight }}>
          <div
            className="relative w-full h-full overflow-hidden rounded-lg"
            style={{
              WebkitMaskImage:
                'linear-gradient(to bottom, black 75%, transparent 100%)',
              maskImage:
                'linear-gradient(to bottom, black 75%, transparent 100%)',
            }}
          >
            {isInView ? (
              <>
                {isVideo(media) && (
                  <video
                    src={media}
                    autoPlay={isFeatured}
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                  />
                )}

                {isImage(media) && (
                  <img
                    src={media}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full bg-neutral-100/50 animate-pulse" />
            )}

            {/* Subtle Apple-style dark overlay */}
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="relative z-[3] px-5 pb-5 pt-3 flex-1 flex flex-col justify-end">
        <h3 className="text-base md:text-xl font-semibold mb-1 text-neutral-900">
          {title}
        </h3>
        <p className="text-sm md:text-base leading-relaxed text-neutral-500">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
