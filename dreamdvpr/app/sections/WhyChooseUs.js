'use client';

import React from 'react';
import { Box, Container, Heading, Text, SimpleGrid, Flex, Icon, VStack, HStack } from '@chakra-ui/react';
import AnimatedCounter from '../components/AnimatedCounter';
import { useContent, useThemeColor, useBackgroundColor } from '../lib/hooks';
import { hexToRgba } from '../lib/utils';

const StatCard = ({ end, suffix, label, delay = 0 }) => {
    const brandColor = useThemeColor('--color-brand-500', '#00abad');

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
    const { content } = useContent('whyChooseUs');
    const bgColor = useBackgroundColor('secondary');

    return (
        <Box py={24} bg={bgColor} position="relative" overflow="hidden">
            <Container maxW="container.xl" position="relative" zIndex="10">
                <Flex direction={{ base: 'column', md: 'row' }} gap={12} align="center">

                    <Box flex={1}>
                        <Heading size="2xl" mb={6} lineHeight="shorter">
                            {content?.title.split(content?.titleHighlight || 'DREAMdvpr').map((part, i, arr) => 
                                i === arr.length - 1 ? (
                                    <React.Fragment key={i}>
                                        <Box as="span" color="brand.500">{content?.titleHighlight || 'DREAMdvpr'}</Box>
                                        {part}
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment key={i}>{part}</React.Fragment>
                                )
                            )}
                        </Heading>
                        <Text fontSize="lg" color="gray.700" mb={8} fontWeight="medium">
                            {content?.subtitle}
                        </Text>
                        <VStack align="start" spacing={4}>
                            {content?.points && content.points.map((item, i) => (
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
