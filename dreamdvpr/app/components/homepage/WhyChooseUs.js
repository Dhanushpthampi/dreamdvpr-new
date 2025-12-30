'use client';

import React from 'react';
import AnimatedCounter from '../ui/AnimatedCounter';
import { useContent, useThemeColor, useBackgroundColor } from '../../lib/hooks';
import { hexToRgba } from '../../lib/utils/colors';

/* =======================
   Stat Card (Theme-aware)
======================= */
const StatCard = ({ end, suffix, label, delay = 0 }) => {
  const brandColor = useThemeColor('--color-brand-500', '#00abad');
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      className="flex flex-col items-center gap-2 bg-white/40 backdrop-blur-[24px] backdrop-saturate-[180%] p-8 rounded-xl border border-white/30 transition-all duration-300 ease-in-out"
      style={{
        transform: `translateY(${delay}px)`,
        boxShadow: hovered
          ? `0 0 30px ${hexToRgba(brandColor, 0.22)}`
          : `0 0 20px ${hexToRgba(brandColor, 0.12)}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={() => {
        if (!hovered) setHovered(true);
      }}
    >
      <AnimatedCounter end={end} suffix={suffix} />
      <p className="font-semibold" style={{ color: 'var(--color-text-secondary, #86868b)' }}>
        {label}
      </p>
    </div>
  );
};

/* =======================
   Why Choose Us Section
======================= */
const WhyChooseUs = () => {
  const { content } = useContent('whyChooseUs');
  const bgColor = useBackgroundColor('secondary');
  const brandColor = useThemeColor('--color-brand-500', '#00abad');

  const titleParts = content?.title?.split(content?.titleHighlight || 'DREAMdvpr') || [];

  return (
    <div
      className="py-24 relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* subtle glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${hexToRgba(brandColor, 0.12)}, transparent 60%)`,
        }}
      />

      <div className="container mx-auto max-w-7xl px-4 relative z-[1]">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="flex-1">
            <h2
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              style={{ color: 'var(--color-text-main, #1d1d1f)' }}
            >
              {titleParts.map((part, i, arr) =>
                i === arr.length - 1 ? (
                  <React.Fragment key={i}>
                    <span style={{ color: 'var(--color-brand-500, #00abad)' }}>
                      {content?.titleHighlight || 'DREAMdvpr'}
                    </span>
                    {part}
                  </React.Fragment>
                ) : (
                  <React.Fragment key={i}>{part}</React.Fragment>
                )
              )}
            </h2>

            <p
              className="text-lg mb-8 font-medium"
              style={{ color: 'var(--color-text-secondary, #86868b)' }}
            >
              {content?.subtitle}
            </p>

            <div className="flex flex-col items-start gap-4">
              {content?.points?.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="p-1.5 rounded-full"
                    style={{ backgroundColor: hexToRgba(brandColor, 0.15) }}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="w-4 h-4"
                      style={{ color: 'var(--color-brand-500, #00abad)' }}
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="font-medium" style={{ color: 'var(--color-text-main, #1d1d1f)' }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT STATS */}
          <div className="grid grid-cols-2 gap-6 flex-1 w-full">
            <StatCard end={98} suffix="%" label="Client Satisfaction" />
            <StatCard end={250} suffix="+" label="Projects Delivered" delay={20} />
            <StatCard end={3} suffix="x" label="Faster Load Times" />
            <StatCard end={24} suffix="/7" label="Support" delay={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
