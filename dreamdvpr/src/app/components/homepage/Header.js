'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '#services', label: 'Services', isAnchor: true },
        { href: '#comparison', label: 'Why Us', isAnchor: true },
        { href: '/blog', label: 'Blog', isAnchor: false },
        { href: '/login', label: 'Login', isAnchor: false },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
                    scrolled ? 'py-3 bg-white/20 backdrop-saturate-[180%] backdrop-blur-[20px]' : 'py-5 bg-transparent'
                }`}
            >
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="cursor-pointer">
                            <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text-main, #1d1d1f)' }}>
                                DREAM<span style={{ color: 'var(--color-brand-500, #00abad)' }}>dvpr</span>
                            </h2>
                        </Link>

                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) =>
                                link.isAnchor ? (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="font-medium transition-colors hover:text-[var(--color-brand-500)]"
                                        style={{ color: 'var(--color-text-secondary, #86868b)' }}
                                    >
                                        {link.label}
                                    </a>
                                ) : (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="font-medium transition-colors hover:text-[var(--color-brand-500)]"
                                        style={{ color: 'var(--color-text-secondary, #86868b)' }}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            )}
                        </nav>

                        <div className="flex items-center gap-4">
                            <a
                                href="#contact"
                                className="hidden md:flex px-4 py-2 text-sm font-medium text-white rounded-xl transition-all hover:opacity-90"
                                style={{ backgroundColor: 'var(--color-brand-500, #00abad)' }}
                            >
                                Book a Call
                            </a>
                            <button
                                onClick={() => setIsOpen(true)}
                                className="md:hidden p-2"
                                aria-label="Open menu"
                                style={{ color: 'var(--color-text-main, #1d1d1f)' }}
                            >
                                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Drawer */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-[2000]"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="fixed right-0 top-0 bottom-0 w-80 bg-white z-[2001] shadow-xl">
                        <div className="p-4 flex justify-end">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2"
                                aria-label="Close menu"
                            >
                                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                </svg>
                            </button>
                        </div>
                        <div className="pt-16 px-6 flex flex-col gap-6">
                            {navLinks.map((link) =>
                                link.isAnchor ? (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="font-medium text-lg transition-colors hover:text-[var(--color-brand-500)]"
                                        style={{ color: 'var(--color-text-main, #1d1d1f)' }}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.label}
                                    </a>
                                ) : (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="font-medium text-lg transition-colors hover:text-[var(--color-brand-500)]"
                                        style={{ color: 'var(--color-text-main, #1d1d1f)' }}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            )}
                            <a
                                href="#contact"
                                className="px-4 py-2 text-white rounded-xl transition-all hover:opacity-90 text-center"
                                style={{ backgroundColor: 'var(--color-brand-500, #00abad)' }}
                                onClick={() => setIsOpen(false)}
                            >
                                Book a Call
                            </a>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Header;
