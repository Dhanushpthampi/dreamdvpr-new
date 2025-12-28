'use client';

import React from 'react';
import { Box, Container, Heading, Text, Button, VStack, Image, Flex } from '@chakra-ui/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const MotionBox = motion(Box);
const MotionImage = motion(Image);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const CTASection = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Astronaut moves up as it enters view, down as it leaves
    const astronautY = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, 100]);

    return (
        <Box py={20} bg="brand.500" id="contact" position="relative" overflow="hidden" ref={ref}>
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
                                Ready to Transform Your Business with DREAMdvpr?
                            </Heading>
                            <Text
                                fontSize="lg"
                                color="white"
                                opacity={0.9}
                            >
                                Your Trusted Partner for Transformative Digital Solutions
                            </Text>
                            <Button
                                size="lg"
                                bg="white"
                                color="brand.500"
                                rounded="full"
                                _hover={{ bg: 'gray.100', transform: 'translateY(-2px)' }}
                                px={10}
                                h={14}
                                fontSize="md"
                                fontWeight="bold"
                            >
                                Book a Call today!
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
