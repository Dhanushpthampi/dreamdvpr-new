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
import Footer from './components/homepage/Footer';
import IntroLoader from './components/homepage/IntroLoader';
import WaveSeparator from './components/homepage/WaveSeparator';

import "./styles/globals.css";


export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

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
        className="min-h-screen overflow-x-hidden bg-bg-app"
        style={{
          opacity: showLoader ? 0 : 1,
          transition: 'opacity 0.5s ease-in'
        }}
      >

        <Header />
        <Hero /><WaveSeparator />
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
