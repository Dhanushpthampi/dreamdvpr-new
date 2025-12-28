'use client';

import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import Header from './sections/Header';
import Hero from './sections/Hero';
import ServicesGrid from './sections/ServicesGrid';
import WhyChooseUs from './sections/WhyChooseUs';
import ComparisonSection from './sections/ComparisonSection';
import BlogSection from './sections/BlogSection';
import FAQSection from './sections/FAQSection';
import CTASection from './sections/CTASection';
import Footer from './components/Footer';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [bgColor, setBgColor] = useState('#f5f5f7');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const updateBgColor = () => {
      if (typeof window !== 'undefined') {
        const color = getComputedStyle(document.documentElement)
          .getPropertyValue('--color-bg-app')
          .trim() || '#f5f5f7';
        setBgColor(color);
      }
    };
    
    updateBgColor();
    window.addEventListener('theme-updated', updateBgColor);
    return () => window.removeEventListener('theme-updated', updateBgColor);
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <Box as="main" minH="100vh" bg={bgColor} overflowX="hidden" _selection={{ bg: 'brand.500', color: 'white' }}>
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
  );
}
