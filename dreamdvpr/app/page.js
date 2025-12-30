'use client';

import { useEffect, useState } from 'react';
import Header from './components/homepage/Header';
import Hero from './components/homepage/Hero';
import ServicesGrid from './components/homepage/ServicesGrid';
import WhyChooseUs from './components/homepage/WhyChooseUs';
import ComparisonSection from './components/homepage/ComparisonSection';
import BlogSection from './components/homepage/BlogSection';
import FAQSection from './components/homepage/FAQSection';
import CTASection from './components/homepage/CTASection';
import Footer from './components/layout/Footer';
import IntroLoader from './components/layout/IntroLoader';
import { useBackgroundColor } from './lib/hooks';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const bgColor = useBackgroundColor('primary');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoaderComplete = () => {
    setShowLoader(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {showLoader && <IntroLoader onComplete={handleLoaderComplete} />}
      <main
        className="min-h-screen overflow-x-hidden"
        style={{
          backgroundColor: bgColor,
          opacity: showLoader ? 0 : 1,
          transition: 'opacity 0.5s ease-in'
        }}
      >
        <style jsx global>{`
          ::selection {
            background-color: var(--color-brand-500);
            color: white;
          }
        `}</style>
        <Header />
        <Hero />
        <ServicesGrid />
        <WhyChooseUs />
        <ComparisonSection />
        <BlogSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </main>
    </>
  );
}
