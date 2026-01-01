'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useContent, useThemeColor } from '../../lib/hooks';

const MotionDiv = motion.div;

const CTASection = () => {
  const { content } = useContent('cta');
  const brandColor = useThemeColor('--color-brand-500', '#00abad');

  return (
    <div
      className="py-20 relative overflow-hidden"
      id="contact"
      style={{ backgroundColor: brandColor }}
    >
      <div className="container mx-auto max-w-7xl px-4 relative z-[10]">
        <div className="flex flex-col md:flex-row items-end justify-between gap-12 min-h-[600px] md:min-h-[400px]">
          {/* Left Column - Text Content */}
          <MotionDiv
              className="
    w-full md:flex-1
    order-1
    flex justify-center
  "
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div
              className="flex flex-col gap-6 items-center md:items-start text-center md:text-left"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-lg">
                {content?.title}
              </h2>
              <p className="text-lg text-white opacity-90">
                {content?.subtitle}
              </p>

              {content?.points && content.points.length > 0 && (
                <div className="flex flex-col items-center md:items-start gap-3 w-full">
                  {content.points.map((point, i) => (
                    <div key={i} className="flex items-center justify-start gap-3">
                      <svg
                        viewBox="0 0 20 20"
                        className="w-5 h-5"
                        fill="currentColor"
                        style={{ color: 'white' }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-white text-base font-medium">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="px-10 h-14 text-base font-bold rounded-full bg-white transition-all hover:bg-gray-100 hover:-translate-y-0.5"
                style={{ color: brandColor }}
              >
                {content?.buttonText}
              </button>
            </div>
          </MotionDiv>

          {/* Astronaut Image - Always absolute */}
          <MotionDiv
            className="flex-1 order-2 absolute bottom-0   md:right-0 md:left-auto left-1/2 md:left-auto transform md:transform-none -translate-x-1/2 md:translate-x-0 flex justify-end"
            initial={{ y: 200 }}
            whileInView={{ y: 100 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
            style={{ zIndex: 5 }}
          >
            <img
              src="/astro.png"
              alt="Astronaut"
              className="max-w-[450px] md:max-w-[550px] lg:max-w-[650px]"
            />
          </MotionDiv>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
