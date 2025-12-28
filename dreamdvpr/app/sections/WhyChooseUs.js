'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Heading, Text, SimpleGrid, Flex, Icon, VStack, HStack } from '@chakra-ui/react';
import AnimatedCounter from '../components/AnimatedCounter';

const StatCard = ({ end, suffix, label, delay = 0 }) => {
    const [brandColor, setBrandColor] = React.useState('#00abad');

    React.useEffect(() => {
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

    return (
        <VStack
            bg="rgba(255, 255, 255, 0.4)"
            backdropFilter="blur(20px)"
            p={8}
            rounded="xl"
            shadow="lg"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.8)"
            boxShadow={`0 0 20px ${hexToRgba(brandColor, 0.1)}`}
            spacing={2}
            transform={`translateY(${delay}px)`}
        >
            <AnimatedCounter end={end} suffix={suffix} />
            <Text color="gray.700" fontWeight="bold">{label}</Text>
        </VStack>
    );
};

const WhyChooseUs = () => {
    const [content, setContent] = useState({
        title: "Why leading brands choose DREAMdvpr.",
        titleHighlight: "DREAMdvpr",
        subtitle: "We don't just write code; we engineer experiences. Our obsessive attention to detail and performance optimization ensures your digital product stands out in a crowded market.",
        points: [
            "Apple-inspired design philosophy",
            "Performance-first engineering",
            "Conversion-focused user flows",
            "Scalable & maintainable code"
        ],
    });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch('/api/content');
            const data = await res.json();
            if (data.content?.whyChooseUs) {
                setContent(data.content.whyChooseUs);
            }
        } catch (error) {
            console.error('Error fetching WhyChooseUs content:', error);
        }
    };

    const [bgColor, setBgColor] = useState('#ffffff');

    useEffect(() => {
        const updateBgColor = () => {
            if (typeof window !== 'undefined') {
                const color = getComputedStyle(document.documentElement)
                    .getPropertyValue('--color-bg-secondary')
                    .trim() || '#ffffff';
                setBgColor(color);
            }
        };
        
        updateBgColor();
        window.addEventListener('theme-updated', updateBgColor);
        return () => window.removeEventListener('theme-updated', updateBgColor);
    }, []);

    return (
        <Box py={24} bg={bgColor} position="relative" overflow="hidden">
            <Container maxW="container.xl" position="relative" zIndex="10">
                <Flex direction={{ base: 'column', md: 'row' }} gap={12} align="center">

                    <Box flex={1}>
                        <Heading size="2xl" mb={6} lineHeight="shorter">
                            {content.title.split(content.titleHighlight || 'DREAMdvpr').map((part, i, arr) => 
                                i === arr.length - 1 ? (
                                    <React.Fragment key={i}>
                                        <Box as="span" color="brand.500">{content.titleHighlight || 'DREAMdvpr'}</Box>
                                        {part}
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment key={i}>{part}</React.Fragment>
                                )
                            )}
                        </Heading>
                        <Text fontSize="lg" color="gray.700" mb={8} fontWeight="medium">
                            {content.subtitle}
                        </Text>
                        <VStack align="start" spacing={4}>
                            {content.points && content.points.map((item, i) => (
                                <HStack key={i} spacing={3}>
                                    <Box p={1} rounded="full" bg="brand.500" opacity={0.1}>
                                        <Icon viewBox="0 0 20 20" fill="currentColor" color="brand.500">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </Icon>
                                    </Box>
                                    <Text fontWeight="medium" color="text.main">{item}</Text>
                                </HStack>
                            ))}
                        </VStack>
                    </Box>

                    <SimpleGrid columns={2} gap={6} flex={1} w="full">
                        <StatCard end={98} suffix="%" label="Client Satisfaction" />
                        <StatCard end={250} suffix="+" label="Projects Delivered" delay={20} />
                        <StatCard end={3} suffix="x" label="Faster Load Times" />
                        <StatCard end={24} suffix="/7" label="Support" delay={20} />
                    </SimpleGrid>

                </Flex>
            </Container>
        </Box>
    );
};

export default WhyChooseUs;
