'use client';

import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import Header from './homepage/Header';
import Hero from './homepage/Hero';
import ServicesGrid from './homepage/ServicesGrid';
import WhyChooseUs from './homepage/WhyChooseUs';
import ComparisonSection from './homepage/ComparisonSection';
import BlogSection from './homepage/BlogSection';
import FAQSection from './homepage/FAQSection';
import CTASection from './homepage/CTASection';
import Footer from './components/Footer';
import IntroLoader from './components/IntroLoader';
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
      <Box
        as="main"
        minH="100vh"
        bg={bgColor}
        overflowX="hidden"
        _selection={{ bg: 'brand.500', color: 'white' }}
        style={{ opacity: showLoader ? 0 : 1, transition: 'opacity 0.5s ease-in' }}
      >
        <Header />
        <Hero />
        <ServicesGrid />
        <WhyChooseUs />
        <ComparisonSection />
        <BlogSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </Box>
    </>
  );
}
