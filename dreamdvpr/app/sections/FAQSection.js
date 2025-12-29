'use client';

import React from 'react';
import { Box, Container, Heading, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import ParticleBackground from '../components/ParticleBackground';
import { useContent } from '../lib/hooks';
import { useThemeColor, useBackgroundColor } from '../lib/hooks';
import { hexToRgba } from '../lib/utils';

const FAQSection = () => {
    const { content } = useContent('faq');
    const brandColor = useThemeColor('--color-brand-500', '#00abad');
    const bgColor = useBackgroundColor('primary');

    return (
        <Box py={24} bg={bgColor} position="relative" overflow="hidden">
            <Box position="absolute" top={0} left={0} right={0} bottom={0} zIndex={0}>
                <ParticleBackground />
            </Box>
            <Container maxW="container.md" position="relative" zIndex={10}>
                <Box textAlign="center" mb={16}>
                    <Heading size="2xl" mb={4} color="gray.900">{content?.title}</Heading>
                    <Text color="gray.700" fontWeight="medium">{content?.subtitle}</Text>
                </Box>

                <Accordion allowToggle>
                    {content?.items && content.items.map((faq, i) => (
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
