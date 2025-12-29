'use client';

import React, { useState } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import { useContent, useThemeColor, useBackgroundColor } from '../lib/hooks';
import { hexToRgba } from '../lib/utils';

const FAQSection = () => {
    const { content } = useContent('faq');
    const brandColor = useThemeColor('--color-brand-500', '#00abad');
    const bgColor = useBackgroundColor('primary');
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="py-24 relative overflow-hidden" style={{ backgroundColor: bgColor }}>
            {/* Particle Background */}
            <div className="absolute inset-0 z-0">
                <ParticleBackground />
            </div>

            <div className="container mx-auto max-w-3xl px-4 relative z-[10]">
                {/* Section Heading */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text-main, #1d1d1f)' }}>
                        {content?.title}
                    </h2>
                    <p className="font-medium" style={{ color: 'var(--color-text-secondary, #86868b)' }}>
                        {content?.subtitle}
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {content?.items?.map((faq, i) => (
                        <div
                            key={i}
                            className="mb-4 bg-white/60 backdrop-blur-[20px] rounded-xl border border-gray-200"
                            style={{
                                boxShadow: `0 0 20px ${hexToRgba(brandColor, 0.08)}`,
                            }}
                        >
                            <button
                                onClick={() => toggleFAQ(i)}
                                className={`w-full py-6 px-8 rounded-xl flex items-center justify-between transition-colors hover:bg-gray-50 ${
                                    openIndex === i ? 'text-[var(--color-brand-500)]' : ''
                                }`}
                                style={{ color: openIndex === i ? 'var(--color-brand-500, #00abad)' : 'var(--color-text-main, #1d1d1f)' }}
                            >
                                <span className="flex-1 text-left font-bold text-lg">
                                    {faq.question}
                                </span>
                                <svg
                                    className={`w-5 h-5 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openIndex === i && (
                                <div className="pb-6 px-8 font-medium" style={{ color: 'var(--color-text-secondary, #86868b)' }}>
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQSection;
