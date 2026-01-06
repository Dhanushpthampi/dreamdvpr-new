'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer
            className="py-12 border-t border-gray-200 bg-bg-secondary text-text-secondary"
        >
            <div className="container mx-auto max-w-7xl px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <p className="font-bold text-lg mb-1 text-text-main">
                            RE<span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>D</span>gravity
                        </p>
                        <p className="text-sm">© 2025 RE<span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>D</span>gravity. All rights reserved.</p>
                    </div>

                    <div className="flex flex-row gap-8 font-medium">
                        <Link
                            href="#services"
                            className="transition-colors hover:text-brand-500 text-text-secondary"
                        >
                            Services
                        </Link>
                        <Link
                            href="/blog"
                            className="transition-colors hover:text-brand-500 text-text-secondary"
                        >
                            Blog
                        </Link>
                        <Link
                            href="#contact"
                            className="transition-colors hover:text-brand-500 text-text-secondary"
                        >
                            Contact
                        </Link>
                    </div>

                    <div className="flex flex-row gap-4">
                        <a
                            href="https://www.instagram.com/redgravity.in/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-brand-500 hover:text-white bg-black/5"
                        >
                            <span className="text-xs font-bold">IG</span>
                        </a>
                        <a
                            href="https://www.linkedin.com/company/redgravity/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-brand-500 hover:text-white bg-black/5"
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
