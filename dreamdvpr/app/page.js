'use client';

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
  return (
    <Box as="main" minH="100vh" bg="bg.app" overflowX="hidden" _selection={{ bg: 'brand.500', color: 'white' }} suppressHydrationWarning>
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
