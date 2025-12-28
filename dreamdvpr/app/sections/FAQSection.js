'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Heading, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import ParticleBackground from '../components/ParticleBackground';

const FAQSection = () => {
    const [content, setContent] = useState({
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
    });

    const [brandColor, setBrandColor] = useState('#00abad');

    useEffect(() => {
        fetchContent();
        
        // Get theme brand color
        const updateBrandColor = () => {
            if (typeof window !== 'undefined') {
                const color = getComputedStyle(document.documentElement)
                    .getPropertyValue('--color-brand-500')
                    .trim() || '#00abad';
                setBrandColor(color);
            }
        };
        
        updateBrandColor();
        window.addEventListener('theme-updated', updateBrandColor);
        return () => window.removeEventListener('theme-updated', updateBrandColor);
    }, []);

    // Convert hex to rgba
    const hexToRgba = (hex, alpha) => {
        const h = hex.replace('#', '');
        const r = parseInt(h.substring(0, 2), 16);
        const g = parseInt(h.substring(2, 4), 16);
        const b = parseInt(h.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const fetchContent = async () => {
        try {
            const res = await fetch('/api/content');
            const data = await res.json();
            if (data.content?.faq) {
                setContent(data.content.faq);
            }
        } catch (error) {
            console.error('Error fetching FAQ content:', error);
        }
    };

    const [bgColor, setBgColor] = useState('#f5f5f7');

    useEffect(() => {
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
    }, []);

    return (
        <Box py={24} bg={bgColor} position="relative" overflow="hidden">
            <Box position="absolute" top={0} left={0} right={0} bottom={0} zIndex={0}>
                <ParticleBackground />
            </Box>
            <Container maxW="container.md" position="relative" zIndex={10}>
                <Box textAlign="center" mb={16}>
                    <Heading size="2xl" mb={4} color="gray.900">{content.title}</Heading>
                    <Text color="gray.700" fontWeight="medium">{content.subtitle}</Text>
                </Box>

                <Accordion allowToggle>
                    {content.items && content.items.map((faq, i) => (
                        <AccordionItem key={i} border="none" mb={4} bg="rgba(255, 255, 255, 0.4)" backdropFilter="blur(20px)" rounded="xl" shadow="lg" borderWidth="1px" borderColor="rgba(255, 255, 255, 0.8)" boxShadow={`0 0 20px ${hexToRgba(brandColor, 0.08)}`}>
                            <h2>
                                <AccordionButton _expanded={{ color: 'brand.500' }} py={6} px={8} _hover={{ bg: 'gray.50' }} rounded="xl">
                                    <Box as="span" flex='1' textAlign='left' fontWeight="bold" fontSize="lg">
                                        {faq.question}
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={6} px={8} color="gray.700" fontWeight="medium">
                                {faq.answer}
                            </AccordionPanel>
                        </AccordionItem>
                    ))}
                </Accordion>
            </Container>
        </Box>
    );
};

export default FAQSection;
