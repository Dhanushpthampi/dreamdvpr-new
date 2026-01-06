'use client';

import React, { useState } from 'react';
import ParticleBackground from './ParticleBackground';
import { useContent } from '../../lib/hooks';

const FAQSection = () => {
    const { content } = useContent('faq');
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="py-24 relative overflow-hidden bg-bg-app">
            {/* Particle Background */}
            <div className="absolute inset-0 z-0">
                {/* <ParticleBackground /> */}
            </div>

            <div className="container mx-auto max-w-3xl px-4 relative z-[10]">
                {/* Section Heading */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-text-main">
                        {content?.title}
                    </h2>
                    <p className="font-medium text-text-secondary">
                        {content?.subtitle}
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {content?.items?.map((faq, i) => (
                        <div
                            key={i}
                            className="mb-4 bg-white/60 backdrop-blur-[20px] rounded-xl border border-gray-200 shadow-[0_0_20px_rgba(229,62,62,0.08)]"
                        >
                            <button
                                onClick={() => toggleFAQ(i)}
                                className={`w-full py-6 px-8 rounded-xl flex items-center justify-between transition-colors hover:bg-gray-50 ${openIndex === i ? 'text-brand-500' : 'text-text-main'
                                    }`}
                            >
                                <span className="flex-1 text-left font-bold text-lg">
                                    {faq.question?.split('REDgravity').map((part, i, arr) => (
                                        <React.Fragment key={i}>
                                            {part}
                                            {i < arr.length - 1 && (
                                                <>RE<span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>D</span>gravity</>
                                            )}
                                        </React.Fragment>
                                    ))}
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
                                <div className="pb-6 px-8 font-medium text-text-secondary">
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
