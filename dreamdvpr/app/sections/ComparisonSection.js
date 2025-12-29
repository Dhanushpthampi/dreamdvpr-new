'use client';

import React from 'react';
import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Icon, Badge } from '@chakra-ui/react';
import ParticleBackground from '../components/ParticleBackground';
import { useContent, useThemeColor, useBackgroundColor } from '../lib/hooks';
import { hexToRgba } from '../lib/utils';

const ComparisonSection = () => {
    const { content } = useContent('comparison');
    const brandColor = useThemeColor('--color-brand-500', '#00abad');
    const bgColor = useBackgroundColor('primary');

    return (
        <Box py={24} bg={bgColor} id="comparison" position="relative" overflow="hidden">
            <ParticleBackground />
            <Container maxW="container.xl" position="relative" zIndex={10}>
                <Box textAlign="center" mb={16}>
                    <Heading size="2xl" mb={4} color="gray.900">{content?.title}</Heading>
                    <Text color="gray.700" fontWeight="medium">{content?.subtitle}</Text>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} maxW="5xl" mx="auto">
                    {/* Traditional Agencies */}
                    <Box p={8} rounded="2xl" bg="rgba(255, 255, 255, 0.3)" backdropFilter="blur(20px)" border="1px solid" borderColor="rgba(255, 255, 255, 0.6)" boxShadow="0 0 15px rgba(0, 0, 0, 0.05)" opacity={0.7} filter="grayscale(100%)">
                        <HStack mb={6} spacing={4}>
                            <Box fontSize="3xl">😑</Box>
                            <Heading size="md" color="gray.600">Traditional Agencies</Heading>
                        </HStack>
                        <VStack align="start" spacing={4} color="gray.500">
                            {content?.traditionalPoints && content.traditionalPoints.map((point, i) => (
                                <HStack key={i}><Text color="red.400">✕</Text><Text>{point}</Text></HStack>
                            ))}
                        </VStack>
                    </Box>

                    {/* DREAMdvpr */}
                    <Box p={8} rounded="2xl" bg="rgba(255, 255, 255, 0.5)" backdropFilter="blur(20px)" shadow="xl" border="2px solid" borderColor={hexToRgba(brandColor, 0.6)} boxShadow={`0 0 30px ${hexToRgba(brandColor, 0.15)}`} position="relative">
                        <Badge position="absolute" top={0} right={0} borderTopRightRadius="2xl" borderBottomLeftRadius="xl" px={4} py={1} colorScheme="brand" variant="solid">RECOMMENDED</Badge>
                        <HStack mb={6} spacing={4}>
                            <Box fontSize="3xl">🤩</Box>
                            <Heading size="md">DREAMdvpr</Heading>
                        </HStack>
                        <VStack align="start" spacing={4} fontWeight="medium">
                            {content?.ourPoints && content.ourPoints.map((point, i) => (
                                <HStack key={i}>
                                    <Icon viewBox="0 0 20 20" fill="currentColor" color="brand.500">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </Icon>
                                    <Text>{point}</Text>
                                </HStack>
                            ))}
                        </VStack>
                    </Box>
                </SimpleGrid>
            </Container>
        </Box>
    );
};

export default ComparisonSection;
