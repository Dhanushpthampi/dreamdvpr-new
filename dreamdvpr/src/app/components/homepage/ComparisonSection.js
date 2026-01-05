'use client';

import React from 'react';
import { useContent } from '../../lib/hooks';

const ComparisonSection = () => {
  const { content } = useContent('comparison');

  return (
    <div
      className="py-24 relative overflow-hidden bg-bg-app"
      id="comparison"
    >

      {/* <ParticleBackground /> */}

      <div className="container mx-auto max-w-7xl px-4 relative z-[10]">
        {/* SECTION HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            {content?.title}
          </h2>
          <p className="font-medium text-[#d1d1d6]">
            {content?.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* ❌ TRADITIONAL AGENCIES */}
          <div
            className="p-8 rounded-2xl bg-transparent backdrop-saturate-[160%] backdrop-blur-[20px] border opacity-60 grayscale"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl">😑</span>
              <h3 className="text-lg font-semibold text-[#d1d1d6]">
                Traditional Agencies
              </h3>
            </div>

            <div className="flex flex-col items-start gap-4">
              {content?.traditionalPoints?.map((point, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[#a1a1a6]">✕</span>
                  <p className="text-[#a1a1a6]">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ REDgravity */}
          <div
            className="p-8 rounded-2xl bg-transparent backdrop-saturate-[180%] backdrop-blur-[20px] border-2 relative border-brand-500/50 shadow-[0_0_30_rgba(229,62,62,0.15)]"
          >
            <span
              className="absolute top-0 right-0 px-4 py-1 text-white text-xs font-bold rounded-tr-2xl rounded-bl-xl"
              style={{ backgroundColor: 'var(--color-brand-500, #e53e3e)' }}
            >
              RECOMMENDED
            </span>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl">🤩</span>
              <h3 className="text-lg font-bold text-white">
                REDgravity
              </h3>
            </div>

            <div className="flex flex-col items-start gap-4 font-medium">
              {content?.ourPoints?.map((point, i) => (
                <div key={i} className="flex items-center gap-3">
                  <svg
                    viewBox="0 0 20 20"
                    className="w-5 h-5 text-brand-500"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-white">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonSection;
