'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer 
            className="py-12 border-t border-gray-200"
            style={{ 
                backgroundColor: 'var(--color-bg-secondary, #ffffff)',
                color: 'var(--color-text-secondary, #86868b)'
            }}
        >
            <div className="container mx-auto max-w-7xl px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <p className="font-bold text-lg mb-1" style={{ color: 'var(--color-text-main, #1d1d1f)' }}>
                            DREAMdvpr
                        </p>
                        <p className="text-sm">© 2025 DREAMdvpr. All rights reserved.</p>
                    </div>

                    <div className="flex flex-row gap-8 font-medium">
                        <Link 
                            href="#services" 
                            className="transition-colors hover:text-[var(--color-brand-500)]"
                            style={{ color: 'var(--color-text-secondary, #86868b)' }}
                        >
                            Services
                        </Link>
                        <Link 
                            href="/blog" 
                            className="transition-colors hover:text-[var(--color-brand-500)]"
                            style={{ color: 'var(--color-text-secondary, #86868b)' }}
                        >
                            Blog
                        </Link>
                        <Link 
                            href="#contact" 
                            className="transition-colors hover:text-[var(--color-brand-500)]"
                            style={{ color: 'var(--color-text-secondary, #86868b)' }}
                        >
                            Contact
                        </Link>
                    </div>

                    <div className="flex flex-row gap-4">
                        <a
                            href="#"
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-[var(--color-brand-500)] hover:text-white"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                        >
                            <span className="text-xs font-bold">TW</span>
                        </a>
                        <a
                            href="#"
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-[var(--color-brand-500)] hover:text-white"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                        >
                            <span className="text-xs font-bold">LI</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
