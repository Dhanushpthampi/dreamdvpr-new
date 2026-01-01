'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname(); // detect current route
  const isHome = pathname === '/'; // homepage check

  const [showNavbar, setShowNavbar] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const lastScrollY = useRef(0);

  const navLinks = [
    { href: '#services', label: 'Services', isAnchor: true },
    { href: '#comparison', label: 'Why Us', isAnchor: true },
    { href: '/blog', label: 'Blog', isAnchor: false },
    { href: '/login', label: 'Login', isAnchor: false },
  ];

  useEffect(() => {
    if (isHome) return; // on homepage, no scroll effect

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setAtTop(currentScrollY === 0);

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // scrolling down → hide navbar
        setShowNavbar(false);
      } else {
        // scrolling up → show navbar
        setShowNavbar(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  return (
    <>
      <header
        className={`
          ${isHome ? 'absolute top-0 left-0 right-0 z-[1000]' : 'fixed top-0 left-0 right-0 z-[1000] transition-all duration-300'}
          ${!isHome ? (showNavbar ? 'translate-y-0' : '-translate-y-full') : ''}
          ${!isHome ? (!atTop ? 'bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] py-3' : 'bg-transparent py-5') : ''}
        `}
      >
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="cursor-pointer">
              <h2
                className="text-2xl font-bold tracking-tight transition-colors duration-300"
                style={{
                  color: isHome || atTop ? 'white' : 'var(--color-text-main, #1d1d1f)',
                }}
              >
                DREAM<span style={{ color: 'var(--color-brand-500, #00abad)' }}>dvpr</span>
              </h2>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) =>
                link.isAnchor ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="font-medium transition-colors duration-300 hover:text-[var(--color-brand-500)]"
                    style={{
                      color: isHome || atTop ? 'white' : 'var(--color-text-secondary, #86868b)',
                    }}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-medium transition-colors duration-300 hover:text-[var(--color-brand-500)]"
                    style={{
                      color: isHome || atTop ? 'white' : 'var(--color-text-secondary, #86868b)',
                    }}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-4">
              <a
                href="#contact"
                className="hidden md:flex px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 hover:opacity-90"
                style={{
                  backgroundColor: 'var(--color-brand-500, #00abad)',
                  color: 'white',
                }}
              >
                Book a Call
              </a>

              <button
                onClick={() => setIsOpen(true)}
                className="md:hidden p-2 transition-colors duration-300"
                aria-label="Open menu"
                style={{ color: isHome || atTop ? 'white' : 'var(--color-text-main, #1d1d1f)' }}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
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
