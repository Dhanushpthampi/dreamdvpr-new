'use client';

import React, { useState } from 'react';
import { useContent } from '../../lib/hooks';
import ServiceCard from './ServiceCard';

const ServicesGrid = () => {
  const { content } = useContent('services');
  const [hovered, setHovered] = useState(false);
  const overlayRef = React.useRef(null);

  const handleMouseMove = (e) => {
    if (!overlayRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    overlayRef.current.style.background = `radial-gradient(
      600px circle at ${x}px ${y}px,
      rgba(229, 62, 62, 0.15),
      transparent 60%
    )`;
  };

  return (
    <section
      id="services"
      className="py-24 relative overflow-hidden bg-bg-app"
    >
      {/* <ParticleBackground /> */}

      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-text-main">
            {content?.title || 'Services'}
          </h2>
          <p className="text-lg text-text-secondary">
            {content?.subtitle || ''}
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 relative items-stretch"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Grid hover glow */}
          <div
            ref={overlayRef}
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-lg"
            style={{
              opacity: hovered ? 1 : 0,
              background: 'transparent',
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
