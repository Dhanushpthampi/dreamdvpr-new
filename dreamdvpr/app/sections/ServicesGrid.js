'use client';

import React from 'react';
import { Box, Container, Heading, Text, Grid, GridItem, Flex, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import ParticleBackground from '../components/ParticleBackground';
import { useContent, useThemeColor, useBackgroundColor } from '../lib/hooks';
import { hexToRgba } from '../lib/utils';

const MotionGridItem = motion(GridItem);

const ServiceCard = ({ title, description, icon, colSpan = 1, rowSpan = 1, iconColor }) => {
    const brandColor = useThemeColor('--color-brand-500', '#00abad');

    return (
        <MotionGridItem
            colSpan={{ base: 1, md: colSpan }}
            rowSpan={{ base: 1, md: rowSpan }}
            bg="rgba(255, 255, 255, 0.4)"
            backdropFilter="blur(20px)"
            rounded="2xl"
            p={8}
            shadow="lg"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.8)"
            boxShadow={`0 0 20px ${hexToRgba(brandColor, 0.1)}`}
            transition="all 0.3s"
            whileHover={{ boxShadow: `0 0 30px ${hexToRgba(brandColor, 0.2)}, 0 8px 32px rgba(0, 0, 0, 0.1)` }}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            minH="200px"
        >
            <Box mb={6} color={iconColor} w={12} h={12} transform="scale(1.2)">
                {icon}
            </Box>
            <Box>
                <Heading size="md" mb={2} color="text.main">{title}</Heading>
                <Text color="gray.700" fontSize="sm" fontWeight="medium">{description}</Text>
            </Box>
        </MotionGridItem>
    );
};

const ServicesGrid = () => {
    const { content } = useContent('services');
    const bgColor = useBackgroundColor('primary');

    return (
        <Box py={24} bg={bgColor} id="services" position="relative" overflow="hidden">
            <ParticleBackground />
            <Container maxW="container.xl">
                <Box textAlign="center" mb={16} maxW="2xl" mx="auto">
                    <Heading size="2xl" mb={4} color="text.main">{content?.title || ''}</Heading>
                    <Text fontSize="lg" color="text.secondary">
                        {content?.subtitle || ''}
                    </Text>
                </Box>

                <Grid
                    templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                    gap={6}
                    autoRows="minmax(200px, auto)"
                >
                    {content?.items && content.items.length > 0 ? (
                        content.items.map((item, index) => (
                            <ServiceCard
                                key={index}
                                title={item.title}
                                description={item.description}
                                colSpan={item.colSpan || 1}
                                rowSpan={item.rowSpan || 1}
                                iconColor={item.iconColor || "brand.500"}
                                icon={
                                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                                }
                            />
                        ))
                    ) : (
                        // Default services if none configured
                        <>
                            <ServiceCard
                                title="Web & App Development"
                                description="Building the foundations of your digital empire with Next.js, React, and native technologies."
                                colSpan={2}
                                rowSpan={2}
                                iconColor="brand.500"
                                icon={
                                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                                }
                            />
                            <ServiceCard
                                title="UI/UX Design"
                                description="Interfaces that feel as good as they look."
                                iconColor="accent.500"
                                icon={
                                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg>
                                }
                            />
                            <ServiceCard
                                title="Brand Strategy"
                                description="Crafting correct narratives."
                                iconColor="purple.400"
                                icon={
                                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                                }
                            />
                            <ServiceCard
                                title="Performance"
                                description="Speed is a feature."
                                iconColor="green.400"
                                icon={
                                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9v8l10-12h-9l9-8z" /></svg>
                                }
                            />
                            <ServiceCard
                                title="SEO & Growth"
                                description="Data-driven visibility."
                                colSpan={2}
                                iconColor="blue.400"
                                icon={
                                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>
                                }
                            />
                        </>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default ServicesGrid;
