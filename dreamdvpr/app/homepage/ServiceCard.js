'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeColor } from '../lib/hooks';
import { hexToRgba } from '../lib/utils';

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
  const [hoverScale, setHoverScale] = useState(1);
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateScale = () => {
      setHoverScale(window.innerWidth >= 768 ? 1.01 : 1);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const getMediaHeight = () => {
    if (typeof window === 'undefined' || window.innerWidth < 768) return '400px';
    if (rowSpan > 1) return '320px';
    if (colSpan > 1) return '220px';
    return '160px';
  };

  const mediaHeight = getMediaHeight();
  const getPaddingTop = () => {
    if (typeof window === 'undefined' || window.innerWidth < 768) return '300px';
    const baseHeight = rowSpan > 1 ? 320 : colSpan > 1 ? 220 : 160;
    return `calc(${baseHeight}px - 40px)`;
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg bg-transparent backdrop-saturate-[160%] backdrop-blur-[18px] border border-white/30"
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
        boxShadow: hovered 
          ? `0 0 18px ${hexToRgba(brandColor, 0.22)}`
          : `0 0 12px ${hexToRgba(brandColor, 0.15)}`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: hoverScale }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Hover gradient overlay */}
      <div
        className="absolute inset-0 rounded-inherit pointer-events-none transition-opacity duration-400 z-[2]"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(
            700px circle at ${mousePos.x}px ${mousePos.y}px,
            ${hexToRgba(brandColor, 0.12)},
            transparent 45%
          )`,
        }}
      />

      {/* MEDIA */}
      {media && (
        <div
          className="absolute top-0 left-0 right-0 z-0 overflow-hidden"
          style={{
            height: mediaHeight,
            WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
          }}
        >
          <div
            className="w-full h-full transition-all duration-350 ease-in-out group"
            style={{
              filter: isFeatured
                ? 'brightness(1) saturate(1)'
                : 'brightness(0.75) saturate(0.85)',
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
          </div>

          {/* SUBTLE OVERLAY FOR READABILITY */}
          <div className="absolute inset-0 bg-black/35 z-[1]" />
        </div>
      )}

      {/* CONTENT */}
      <div
        className="relative z-[3] h-full flex flex-col justify-end"
        style={{
          paddingTop: getPaddingTop(),
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          paddingBottom: '1.25rem',
        }}
      >
        <h3 className="text-xs md:text-sm font-semibold mb-1" style={{ color: 'var(--color-text-main, #1d1d1f)' }}>
          {title}
        </h3>
        <p className="text-xs md:text-sm" style={{ color: 'var(--color-text-secondary, #86868b)' }}>
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
