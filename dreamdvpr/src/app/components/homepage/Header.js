'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/#services', label: 'Services', isAnchor: false },
    { href: '/#comparison', label: 'Why Us', isAnchor: false },
    { href: '/blog', label: 'Blog', isAnchor: false },
    { href: '/login', label: 'Login', isAnchor: false },
  ];

  return (
    <>
      <header
        className={`
          z-[1000]
          ${isHome
            ? 'absolute top-2 left-0 right-0 bg-transparent py-5'
            : 'fixed top-0 left-0 right-0 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] py-3'
          }
        `}
      >
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            {/* LOGO */}
            <Link href="/">
              <h2
                className="text-2xl font-bold tracking-tight text-brand-500"
              >
                RED
                <span className={isHome ? 'text-white' : 'text-text-main'}>
                  GRAVITY
                </span>
              </h2>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) =>
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-bold transition-colors hover:text-brand-500 ${isHome ? 'text-white/70' : 'text-text-secondary'
                    }`}
                >
                  {link.label}
                </Link>
              )}
            </nav>

            {/* CTA + MOBILE */}
            <div className="flex items-center gap-4">
              <a
                href="tel:9945291958"
                className="hidden md:flex items-center gap-2 px-6 py-2 text-sm font-bold rounded-xl hover:bg-black/90 transition-all hover:scale-105 bg-[#1d1d1f] text-white border border-white/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                </svg>
                Call Now
              </a>

              <button
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
                className={`md:hidden p-2 ${isHome ? 'text-white' : 'text-text-main'}`}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[2000]"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-white z-[2001] shadow-xl">
            <div className="p-4 flex justify-end">
              <button onClick={() => setIsOpen(false)} className="p-2">
                ✕
              </button>
            </div>
            <div className="pt-12 px-6 flex flex-col gap-6">
              {navLinks.map((link) =>
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
