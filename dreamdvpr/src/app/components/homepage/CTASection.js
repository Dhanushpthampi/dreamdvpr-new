'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../../lib/hooks';

const MotionDiv = motion.div;

const CTASection = () => {
  const { content } = useContent('cta');

  return (
    <div
      className="py-20 relative overflow-hidden bg-[#1d1d1f]"
      id="contact"
    >
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_50%,rgba(37,99,235,0.1),transparent_70%)]"
      /> {/* Midnight Blue Depth Glow */}


      <div className="container mx-auto max-w-7xl px-4 relative z-[10]">
        <div className="flex flex-col md:flex-row items-end justify-between gap-12 min-h-[600px] md:min-h-[400px]">
          {/* Left Column - Text Content */}
          <MotionDiv
            className="
    w-full md:flex-1
    order-1 md:mr-[24rem]
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
                {content?.title?.split('REDgravity').map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <>REDgravity</>
                    )}
                  </React.Fragment>
                ))}
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

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <button
                  className="px-8 h-14 text-base font-bold rounded-full bg-white transition-all hover:bg-gray-100 hover:-translate-y-0.5 text-black-500 whitespace-nowrap min-w-[240px] flex items-center justify-center"
                >
                  {content?.buttonText}
                </button>

                <a
                  href="https://wa.me/7337816195"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 h-14 text-base font-bold rounded-full border-2 border-white text-white transition-all hover:bg-white/10 hover:-translate-y-0.5 flex items-center justify-center gap-2 whitespace-nowrap min-w-[240px]"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Chat with us
                </a>
              </div>
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
