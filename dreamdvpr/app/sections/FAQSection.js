'use client';

import React from 'react';
import { Box, Container, Heading, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import ParticleBackground from '../components/ParticleBackground';

const FAQSection = () => {
    const faqs = [
        {
            title: "What makes DREAMdvpr different?",
            content: "We focus on 'Premium' in every sense. Not just how it looks, but how it feels and performs. We combine high-end aesthetic sensibilities with rigorous engineering standards."
        },
        {
            title: "Do you work with startups?",
            content: "Yes, we love working with ambitious visionaries, whether they are just starting out with a disruptive idea or are an established brand looking to modernize."
        },
        {
            title: "How long does a project take?",
            content: "It varies, but a typical high-end landing page takes 2-4 weeks, while complex web applications can take 2-4 months."
        },
        {
            title: "What is your pricing model?",
            content: "We provide a detailed fixed-price proposal after understanding your specific needs. No hidden surprises."
        }
    ];

    return (
        <Box py={24} bg="gray.50" position="relative" overflow="hidden">
            <Box position="absolute" top={0} left={0} right={0} bottom={0} zIndex={0}>
                <ParticleBackground />
            </Box>
            <Container maxW="container.md" position="relative" zIndex={10}>
                <Box textAlign="center" mb={16}>
                    <Heading size="2xl" mb={4} color="gray.900">Common Questions</Heading>
                    <Text color="gray.700" fontWeight="medium">Everything you need to know about working with us.</Text>
                </Box>

                <Accordion allowToggle>
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} border="none" mb={4} bg="rgba(255, 255, 255, 0.4)" backdropFilter="blur(20px)" rounded="xl" shadow="lg" borderWidth="1px" borderColor="rgba(255, 255, 255, 0.8)" boxShadow="0 0 20px rgba(0, 171, 173, 0.08)">
                            <h2>
                                <AccordionButton _expanded={{ color: 'brand.500' }} py={6} px={8} _hover={{ bg: 'gray.50' }} rounded="xl">
                                    <Box as="span" flex='1' textAlign='left' fontWeight="bold" fontSize="lg">
                                        {faq.title}
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={6} px={8} color="gray.700" fontWeight="medium">
                                {faq.content}
                            </AccordionPanel>
                        </AccordionItem>
                    ))}
                </Accordion>
            </Container>
        </Box>
    );
};

export default FAQSection;
