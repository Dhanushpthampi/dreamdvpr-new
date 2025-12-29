/**
 * Default content constants - Single source of truth for content defaults
 * @module lib/content/constants
 */

import { DEFAULT_THEME } from '../theme/constants';

export const DEFAULT_CONTENT = {
  hero: {
    title: "Explore the Future of Web",
    titleHighlight: "Future of Web",
    subtitle: "DREAMdvpr crafts digital experiences that are out of this world. Clean, precise, and engineered for performance.",
    ctaText: "Start Mission",
  },
  services: {
    title: "Our Expertise",
    subtitle: "A comprehensive suite of digital services designed to elevate your brand.",
    items: [
      {
        title: "Web & App Development",
        description: "Building the foundations of your digital empire with Next.js, React, and native technologies.",
        colSpan: 2,
        rowSpan: 2,
        iconColor: "brand.500",
      },
      {
        title: "UI/UX Design",
        description: "Interfaces that feel as good as they look.",
        colSpan: 1,
        rowSpan: 1,
        iconColor: "accent.500",
      },
      {
        title: "Brand Strategy",
        description: "Crafting correct narratives.",
        colSpan: 1,
        rowSpan: 1,
        iconColor: "purple.400",
      },
      {
        title: "Performance",
        description: "Speed is a feature.",
        colSpan: 1,
        rowSpan: 1,
        iconColor: "green.400",
      },
      {
        title: "SEO & Growth",
        description: "Data-driven visibility.",
        colSpan: 2,
        rowSpan: 1,
        iconColor: "blue.400",
      },
    ],
  },
  whyChooseUs: {
    title: "Why leading brands choose DREAMdvpr.",
    titleHighlight: "DREAMdvpr",
    subtitle: "We don't just write code; we engineer experiences. Our obsessive attention to detail and performance optimization ensures your digital product stands out in a crowded market.",
    points: [
      "Apple-inspired design philosophy",
      "Performance-first engineering",
      "Conversion-focused user flows",
      "Scalable & maintainable code"
    ],
  },
  comparison: {
    title: "The Difference is Clear",
    subtitle: "Stop settling for average. Upgrade to premium.",
    traditionalPoints: [
      "Generic, template designs",
      "Slow loading & unoptimized",
      "Cluttered user experience",
      "Poor communication"
    ],
    ourPoints: [
      "Custom, high-end aesthetics",
      "Blazing fast load times",
      "Intuitive, fluid animations",
      "Strategic growth partnership"
    ],
  },
  faq: {
    title: "Common Questions",
    subtitle: "Everything you need to know about working with us.",
    items: [
      {
        question: "What makes DREAMdvpr different?",
        answer: "We focus on 'Premium' in every sense. Not just how it looks, but how it feels and performs. We combine high-end aesthetic sensibilities with rigorous engineering standards."
      },
      {
        question: "Do you work with startups?",
        answer: "Yes, we love working with ambitious visionaries, whether they are just starting out with a disruptive idea or are an established brand looking to modernize."
      },
      {
        question: "How long does a project take?",
        answer: "It varies, but a typical high-end landing page takes 2-4 weeks, while complex web applications can take 2-4 months."
      },
      {
        question: "What is your pricing model?",
        answer: "We provide a detailed fixed-price proposal after understanding your specific needs. No hidden surprises."
      }
    ],
  },
  cta: {
    title: "Ready to Transform Your Business with DREAMdvpr?",
    subtitle: "Your Trusted Partner for Transformative Digital Solutions",
    buttonText: "Book a Call today!",
    points: [
      "Premium Quality Guaranteed",
      "Fast Turnaround Times",
      "Dedicated Support Team",
      "Scalable Solutions"
    ],
  },
  theme: DEFAULT_THEME,
};
