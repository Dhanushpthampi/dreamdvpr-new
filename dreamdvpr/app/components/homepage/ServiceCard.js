'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeColor } from '../../lib/hooks';
import { hexToRgba } from '../../lib/utils/colors';

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
  const brandColor = useThemeColor('--color-brand-500', '#00abad');

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
     MEDIA HEIGHT LOGIC (CORRECT)
     Desktop: big = 2x
     Mobile: ALL = big height
  ================================ */
  const baseMediaHeight = isDesktop ? 140 : 160;

  const mediaHeight = isDesktop
    ? baseMediaHeight * (rowSpan > 1 ? 5 : 2)
    : baseMediaHeight * 2;

  /* ===============================
     MOUSE TRACKING
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
        bg-white/10
        backdrop-blur-[18px] backdrop-saturate-[160%]
        border border-white/100
        flex flex-col
      "
      style={{
        gridColumn: isDesktop ? `span ${colSpan}` : 'span 1',
        gridRow: isDesktop ? `span ${rowSpan}` : 'span 1',
        boxShadow: hovered
          ? `0 12px 35px ${hexToRgba(brandColor, 0.28)}`
          : `0 8px 25px ${hexToRgba(brandColor, 0.18)}`,
      }}
      whileHover={isDesktop ? { scale: 1.015 } : undefined}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* HOVER GLOW */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(
            600px circle at ${mousePos.x}px ${mousePos.y}px,
            ${hexToRgba(brandColor, 0.12)},
            transparent 45%
          )`,
        }}
      />

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

            {/* SOFT DARKENING */}
            <div className="absolute inset-0 bg-black/25" />
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="relative z-[3] px-5 pb-5 pt-3 flex-1 flex flex-col justify-end">
        <h3 className="text-sm md:text-base font-semibold mb-1 text-[var(--color-text-main,#1d1d1f)]">
          {title}
        </h3>
        <p className="text-xs md:text-sm leading-relaxed text-[var(--color-text-secondary,#86868b)]">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
