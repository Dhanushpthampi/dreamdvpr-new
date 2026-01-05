'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '#services', label: 'Services', isAnchor: true },
    { href: '#comparison', label: 'Why Us', isAnchor: true },
    { href: '/blog', label: 'Blog', isAnchor: false },
    { href: '/login', label: 'Login', isAnchor: false },
  ];

  return (
    <>
      <header
        className={`
          z-[1000]
          ${
            isHome
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
                className="text-2xl font-bold tracking-tight"
                style={{
                  color: 'var(--color-brand-500, #e53e3e)'
                }}
              >
                RED
                <span style={{ color: isHome ? 'white' : 'var(--color-text-main, #1d1d1f)'
                   }}>
                  gravity
                </span>
              </h2>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) =>
                link.isAnchor ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="font-medium transition-colors hover:text-[var(--color-brand-500)]"
                    style={{
                      color: isHome
                        ? 'white'
                        : 'var(--color-text-secondary, #86868b)',
                    }}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-medium transition-colors hover:text-[var(--color-brand-500)]"
                    style={{
                      color: isHome
                        ? 'white'
                        : 'var(--color-text-secondary, #86868b)',
                    }}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* CTA + MOBILE */}
            <div className="flex items-center gap-4">
              <a
                href="#contact"
                className="hidden md:flex px-4 py-2 text-sm font-medium rounded-xl hover:opacity-90"
                style={{
                  backgroundColor: 'var(--color-brand-500, #e53e3e)',
                  color: 'white',
                }}
              >
                Book a Call
              </a>

              <button
                onClick={() => setIsOpen(true)}
                className="md:hidden p-2"
                aria-label="Open menu"
                style={{
                  color: isHome
                    ? 'white'
                    : 'var(--color-text-main, #1d1d1f)',
                }}
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
                link.isAnchor ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
