'use client';

import React from 'react';
import AnimatedCounter from '../ui/AnimatedCounter';
import { useContent } from '../../lib/hooks';

/* =======================
   Stat Card (Theme-aware)
======================= */
const StatCard = ({ end, suffix, label, delay = 0 }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      className={`flex flex-col items-center gap-2 bg-white/40 backdrop-blur-[24px] backdrop-saturate-[180%] p-8 rounded-xl border border-white/30 transition-all duration-300 ease-in-out ${hovered
        ? 'shadow-[0_10px_40px_rgba(0,0,0,0.1)]'
        : 'shadow-[0_5px_20px_rgba(0,0,0,0.05)]'
        }`}
      style={{
        transform: `translateY(${delay}px)`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={() => {
        if (!hovered) setHovered(true);
      }}
    >
      <div className="text-brand-500 mb-1">
        <AnimatedCounter end={end} suffix={suffix} />
      </div>
      <p className="text-[12px] uppercase font-black tracking-widest text-text-main">
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


  return (
    <div
      className="py-24 relative overflow-hidden bg-bg-secondary"
    >
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.03),transparent_60%)]"
      />

      <div className="container mx-auto max-w-7xl px-4 relative z-[1]">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-text-main">
              {content?.title}
            </h2>

            <p
              className="text-lg mb-8 font-medium text-text-secondary"
            >
              {content?.subtitle}
            </p>

            <div className="flex flex-col items-start gap-4">
              {content?.points?.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="p-1.5 rounded-full bg-brand-500/15"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="w-4 h-4 text-brand-500"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="font-medium text-text-main">
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
