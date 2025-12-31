'use client';

import React, { useState } from 'react';
import ParticleBackground from './ParticleBackground';
import { useContent, useBackgroundColor } from '../../lib/hooks';
import ServiceCard from './ServiceCard';

const ServicesGrid = () => {
  const { content } = useContent('services');
  const bgColor = useBackgroundColor('primary');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      id="services"
      className="py-24 relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <ParticleBackground />

      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--color-text-main,#1d1d1f)]">
            {content?.title || 'Services'}
          </h2>
          <p className="text-lg text-[var(--color-text-secondary,#86868b)]">
            {content?.subtitle || ''}
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 relative items-stretch"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Grid hover glow */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-lg"
            style={{
              opacity: hovered ? 1 : 0,
              background: `radial-gradient(
                600px circle at ${mousePos.x}px ${mousePos.y}px,
                rgba(0, 171, 173, 0.15),
                transparent 60%
              )`,
            }}
          />

          {(content?.items || []).map((item, index) => (
            <ServiceCard
              key={index}
              title={item.title}
              description={item.description}
              media={item.media}
              isFeatured={item.isFeatured}

              /** Spans only apply from md+ */
              colSpan={item.colSpan || 1}
              rowSpan={item.rowSpan || 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
