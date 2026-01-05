'use client';

import Link from 'next/link';
import ParticleBackground from './components/homepage/ParticleBackground';
import { useThemeColor, useBackgroundColor } from './lib/hooks';

export default function NotFound() {
  const brandColor = useThemeColor('--color-brand-500', '#e53e3e');
  const bgColor = useBackgroundColor('primary');

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Particle Background */}
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10 max-w-3xl w-full px-6 text-center">
        <div className="flex flex-col items-center gap-8">
          {/* 404 Number */}
          <div className="relative">
            {/* Background 404 */}
            <h1
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold select-none pointer-events-none
                         text-[8rem] md:text-[12rem] opacity-10"
              style={{ color: brandColor }}
            >
              404
            </h1>

            {/* Foreground 404 */}
            <h1
              className="relative z-10 font-extrabold bg-clip-text text-transparent
                         text-[6rem] md:text-[8rem]"
              style={{
                backgroundImage: `linear-gradient(to right, ${brandColor}, ${brandColor}dd)`,
              }}
            >
              404
            </h1>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-4">
            <h2 className="text-4xl font-bold text-[var(--color-text-main)]">
              Page Not Found
            </h2>
            <p className="text-lg max-w-md mx-auto text-[var(--color-text-secondary)]">
              Oops! The page you're looking for seems to have drifted off into the
              digital void. Let&apos;s get you back on track.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 text-lg font-semibold rounded-lg text-white
                         transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ backgroundColor: brandColor }}
            >
              Go Home
            </Link>

            <Link
              href="/blog"
              className="px-6 py-3 text-lg font-semibold rounded-lg border
                         transition-all duration-300 hover:text-white"
              style={{
                borderColor: brandColor,
                color: brandColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = brandColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Browse Blog
            </Link>
          </div>

          {/* Footer note */}
          <p className="text-sm opacity-70 text-[var(--color-text-secondary)] mt-8">
            Error Code: 404 | Lost in Space
          </p>
        </div>
      </div>
    </div>
  );
}
