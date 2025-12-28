'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Heading, Text, Button, VStack, Image, Flex, HStack, Icon } from '@chakra-ui/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const MotionBox = motion(Box);
const MotionImage = motion(Image);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const CTASection = () => {
    const [content, setContent] = useState({
        title: "Ready to Transform Your Business with DREAMdvpr?",
        subtitle: "Your Trusted Partner for Transformative Digital Solutions",
        buttonText: "Book a Call today!",
        points: [
            "Premium Quality Guaranteed",
            "Fast Turnaround Times",
            "Dedicated Support Team",
            "Scalable Solutions"
        ],
    });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch('/api/content');
            const data = await res.json();
            if (data.content?.cta) {
                setContent(data.content.cta);
            }
        } catch (error) {
            console.error('Error fetching CTA content:', error);
        }
    };

    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Astronaut moves up as it enters view, down as it leaves
    const astronautY = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, 100]);

    // Get brand color from CSS variable for dynamic theming
    const [brandColor, setBrandColor] = useState('#00abad');

    useEffect(() => {
        const updateBrandColor = () => {
            if (typeof window !== 'undefined') {
                const color = getComputedStyle(document.documentElement)
                    .getPropertyValue('--color-brand-500')
                    .trim() || '#00abad';
                setBrandColor(color);
            }
        };
        
        updateBrandColor();
        // Listen for theme updates
        window.addEventListener('theme-updated', updateBrandColor);
        return () => window.removeEventListener('theme-updated', updateBrandColor);
    }, []);

    return (
        <Box py={20} bg={brandColor} id="contact" position="relative" overflow="hidden" ref={ref}>
            <Container maxW="container.xl" position="relative" zIndex="10">
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    align="center"
                    justify="space-between"
                    gap={12}
                    minH={{ base: 'auto', md: '400px' }}
                >
                    {/* Left Column - Text Content */}
                    <MotionBox
                        flex={1}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <VStack
                            spacing={6}
                            align={{ base: 'center', md: 'flex-start' }}
                            textAlign={{ base: 'center', md: 'left' }}
                        >
                            <Heading
                                size="3xl"
                                color="white"
                                fontWeight="bold"
                                maxW="lg"
                            >
                                {content.title}
                            </Heading>
                            <Text
                                fontSize="lg"
                                color="white"
                                opacity={0.9}
                            >
                                {content.subtitle}
                            </Text>
                            {content.points && content.points.length > 0 && (
                                <VStack align={{ base: 'center', md: 'flex-start' }} spacing={3} w="full">
                                    {content.points.map((point, i) => (
                                        <HStack key={i} spacing={3}>
                                            <Icon viewBox="0 0 20 20" fill="currentColor" color="white" boxSize={5}>
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </Icon>
                                            <Text color="white" fontSize="md" fontWeight="medium">{point}</Text>
                                        </HStack>
                                    ))}
                                </VStack>
                            )}
                            <Button
                                size="lg"
                                bg="white"
                                color={brandColor}
                                rounded="full"
                                _hover={{ bg: 'gray.100', transform: 'translateY(-2px)' }}
                                px={10}
                                h={14}
                                fontSize="md"
                                fontWeight="bold"
                            >
                                {content.buttonText}
                            </Button>
                        </VStack>
                    </MotionBox>

                    {/* Right Column - Astronaut with scroll-based animation */}
                    <MotionBox
                        flex={1}
                        display="flex"
                        justifyContent={{ base: 'center', md: 'flex-end' }}
                        alignItems="flex-end"
                        style={{ y: astronautY }}
                    >
                        <Image
                            src="/astro.png"
                            alt="Astronaut"
                            maxW={{ base: "450px", md: "550px", lg: "650px" }}
                        />
                    </MotionBox>
                </Flex>
            </Container>
        </Box>
    );
};

export default CTASection;
