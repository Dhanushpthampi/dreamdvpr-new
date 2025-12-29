'use client';

import React from 'react';
import { Box, Container, Heading, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import ParticleBackground from '../components/ParticleBackground';
import { useContent, useThemeColor, useBackgroundColor } from '../lib/hooks';
import { hexToRgba } from '../lib/utils';

const FAQSection = () => {
    const { content } = useContent('faq');
    const brandColor = useThemeColor('--color-brand-500', '#00abad');
    const bgColor = useBackgroundColor('primary');

    return (
        <Box py={24} bg={bgColor} position="relative" overflow="hidden">
            {/* Particle Background */}
            <Box position="absolute" inset={0} zIndex={0}>
                <ParticleBackground />
            </Box>

            <Container maxW="container.md" position="relative" zIndex={10}>
                {/* Section Heading */}
                <Box textAlign="center" mb={16}>
                    <Heading size="2xl" mb={4} color="text.main">{content?.title}</Heading>
                    <Text color="text.secondary" fontWeight="medium">{content?.subtitle}</Text>
                </Box>

                {/* FAQ Accordion */}
                <Accordion allowToggle>
                    {content?.items?.map((faq, i) => (
                        <AccordionItem
                            key={i}
                            border="none"
                            mb={4}
                            bg="bg.surface"                   // theme-aware background
                            backdropFilter="blur(20px)"       // frosted effect
                            rounded="xl"
                            borderWidth="1px"
                            borderColor="border.light"
                            boxShadow={`0 0 20px ${hexToRgba(brandColor, 0.08)}`}
                        >
                            <h2>
                                <AccordionButton
                                    _expanded={{ color: 'brand.500' }}
                                    py={6}
                                    px={8}
                                    _hover={{ bg: 'bg.muted' }}   // subtle hover from theme
                                    rounded="xl"
                                >
                                    <Box as="span" flex='1' textAlign='left' fontWeight="bold" fontSize="lg">
                                        {faq.question}
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={6} px={8} color="text.secondary" fontWeight="medium">
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
