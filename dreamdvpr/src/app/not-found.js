'use client';

import Link from 'next/link';
import ParticleBackground from './components/homepage/ParticleBackground';
// import ParticleBackground from './components/homepage/ParticleBackground';


export default function NotFound() {
  const brandColor = 'var(--color-brand-500, #c53030)';

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-app"
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
                         text-[8rem] md:text-[12rem] opacity-10 text-brand-500"
            >
              404
            </h1>

            {/* Foreground 404 */}
            <h1
              className="relative z-10 font-extrabold bg-clip-text  text-brand-500 opacity-50
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
            <h2 className="text-4xl font-bold text-red-100">
              Page Not Found
            </h2>
            <p className="text-lg max-w-md mx-auto text-text-secondary text-white-50">
              Oops! The page you're looking for seems to have drifted off into the
              digital void. Let&apos;s get you back on track.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 text-lg font-semibold rounded-lg text-white
                         transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg bg-brand-500"
            >
              Go Home
            </Link>

            <Link
              href="/blog"
              className="px-6 py-3 text-lg font-semibold rounded-lg border border-brand-500 text-brand-500 transition-all duration-300 hover:text-white hover:bg-brand-500"
            >
              Browse Blog
            </Link>
          </div>

          {/* Footer note */}
          <p className="text-sm opacity-70 text-text-secondary mt-8">
            Error Code: 404 | Lost in Space
          </p>
        </div>
      </div>
    </div>
  );
}
