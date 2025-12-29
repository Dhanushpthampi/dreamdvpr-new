'use client';

import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Badge,
} from '@chakra-ui/react';
import ParticleBackground from '../components/ParticleBackground';
import { useContent, useThemeColor, useBackgroundColor } from '../lib/hooks';
import { hexToRgba } from '../lib/utils';

const ComparisonSection = () => {
  const { content } = useContent('comparison');
  const brandColor = useThemeColor('--color-brand-500', '#00abad');
  const bgColor = useBackgroundColor('primary');

  return (
    <Box
      py={24}
      bg={bgColor}
      id="comparison"
      position="relative"
      overflow="hidden"
    >
      <ParticleBackground />

      <Container maxW="container.xl" position="relative" zIndex={10}>
        {/* SECTION HEADER */}
        <Box textAlign="center" mb={16}>
          <Heading size="2xl" mb={4} color="text.main">
            {content?.title}
          </Heading>
          <Text color="text.secondary" fontWeight="medium">
            {content?.subtitle}
          </Text>
        </Box>

        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          gap={8}
          maxW="5xl"
          mx="auto"
        >
          {/* ❌ TRADITIONAL AGENCIES */}
          <Box
            p={8}
            rounded="2xl"
            bg="transparent"
            backdropFilter="saturate(160%) blur(20px)"
            border="1px solid"
            borderColor="whiteAlpha.300"
            opacity={0.6}
            filter="grayscale(100%)"
          >
            <HStack mb={6} spacing={4}>
              <Box fontSize="3xl">😑</Box>
              <Heading size="md" color="text.secondary">
                Traditional Agencies
              </Heading>
            </HStack>

            <VStack align="start" spacing={4}>
              {content?.traditionalPoints?.map((point, i) => (
                <HStack key={i} spacing={3}>
                  <Text color="text.secondary">✕</Text>
                  <Text color="text.secondary">{point}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>

          {/* ✅ DREAMdvpr */}
          <Box
            p={8}
            rounded="2xl"
            bg="transparent"
            backdropFilter="saturate(180%) blur(20px)"
            border="2px solid"
            borderColor={hexToRgba(brandColor, 0.5)}
            boxShadow={`0 0 30px ${hexToRgba(brandColor, 0.15)}`}
            position="relative"
          >
            <Badge
              position="absolute"
              top={0}
              right={0}
              borderTopRightRadius="2xl"
              borderBottomLeftRadius="xl"
              px={4}
              py={1}
              bg="brand.500"
              color="white"
            >
              RECOMMENDED
            </Badge>

            <HStack mb={6} spacing={4}>
              <Box fontSize="3xl">🤩</Box>
              <Heading size="md" color="text.main">
                DREAMdvpr
              </Heading>
            </HStack>

            <VStack align="start" spacing={4} fontWeight="medium">
              {content?.ourPoints?.map((point, i) => (
                <HStack key={i} spacing={3}>
                  <Icon
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    color="brand.500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </Icon>
                  <Text color="text.main">{point}</Text>
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
