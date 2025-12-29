'use client';

import { Box, Container, Heading, Text, Button, VStack, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import { useThemeColor, useBackgroundColor } from './lib/hooks';
import ParticleBackground from './components/ParticleBackground';

export default function NotFound() {
  const brandColor = useThemeColor('--color-brand-500', '#00abad');
  const bgColor = useBackgroundColor('primary');

  return (
    <Box
      minH="100vh"
      bg={bgColor}
      position="relative"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <ParticleBackground />
      <Container maxW="container.md" position="relative" zIndex={10} textAlign="center">
        <VStack spacing={8}>
          {/* 404 Number with animation */}
          <Box position="relative">
            <Heading
              fontSize={{ base: '8xl', md: '12xl' }}
              fontWeight="bold"
              color={brandColor}
              opacity={0.1}
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              userSelect="none"
              pointerEvents="none"
            >
              404
            </Heading>
            <Heading
              fontSize={{ base: '6xl', md: '8xl' }}
              fontWeight="extrabold"
              bgGradient={`linear(to-r, ${brandColor}, ${brandColor}dd)`}
              bgClip="text"
              position="relative"
              zIndex={1}
            >
              404
            </Heading>
          </Box>

          {/* Error Message */}
          <VStack spacing={4}>
            <Heading size="2xl" color="text.main">
              Page Not Found
            </Heading>
            <Text fontSize="lg" color="text.secondary" maxW="md">
              Oops! The page you're looking for seems to have drifted off into the digital void.
              Let's get you back on track.
            </Text>
          </VStack>

          {/* Action Buttons */}
          <Flex gap={4} flexWrap="wrap" justify="center">
            <Button
              as={Link}
              href="/"
              size="lg"
              bg={brandColor}
              color="white"
              _hover={{ bg: brandColor, transform: 'translateY(-2px)', boxShadow: 'lg' }}
              transition="all 0.3s"
            >
              Go Home
            </Button>
            <Button
              as={Link}
              href="/blog"
              size="lg"
              variant="outline"
              borderColor={brandColor}
              color={brandColor}
              _hover={{ bg: brandColor, color: 'white' }}
              transition="all 0.3s"
            >
              Browse Blog
            </Button>
          </Flex>

          {/* Decorative Elements */}
          <Box mt={8}>
            <Text fontSize="sm" color="text.secondary" opacity={0.7}>
              Error Code: 404 | Lost in Space
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
