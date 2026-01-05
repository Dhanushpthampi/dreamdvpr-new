'use client';

import React, { useState, useEffect } from 'react';
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
  const [isDesktop, setIsDesktop] = useState(false);

  /* ===============================
     BREAKPOINT DETECTION
  ================================ */
  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* ===============================
     MEDIA HEIGHT LOGIC
  ================================ */
  const baseMediaHeight = isDesktop ? 140 : 160;

  const mediaHeight = isDesktop
    ? baseMediaHeight * (rowSpan > 1 ? 5 : 2)
    : baseMediaHeight * 2;

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
      className="
        relative overflow-hidden rounded-xl
        bg-white/70
        backdrop-blur-xl backdrop-saturate-150
        border border-black/5
        flex flex-col
      "
      style={{
        gridColumn: isDesktop ? `span ${colSpan}` : 'span 1',
        gridRow: isDesktop ? `span ${rowSpan}` : 'span 1',

        /* 🍎 Apple-style neutral gray shadows */
        boxShadow: hovered
          ? `
            0 2px 4px rgba(0, 0, 0, 0.08),
            0 12px 32px rgba(0, 0, 0, 0.12),
            0 0 20px rgba(229, 62, 62, 0.15)
          `
          : `
            0 1px 2px rgba(0, 0, 0, 0.06),
            0 4px 12px rgba(0, 0, 0, 0.08)
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
            {isVideo(media) && (
              <video
                src={media}
                autoPlay={isFeatured}
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />
            )}

            {isImage(media) && (
              <img
                src={media}
                alt={title}
                className="w-full h-full object-cover"
              />
            )}

            {/* Subtle Apple-style dark overlay */}
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="relative z-[3] px-5 pb-5 pt-3 flex-1 flex flex-col justify-end">
        <h3 className="text-sm md:text-base font-semibold mb-1 text-neutral-900">
          {title}
        </h3>
        <p className="text-xs md:text-sm leading-relaxed text-neutral-500">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
