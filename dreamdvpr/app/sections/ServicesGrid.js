'use client';

import React from 'react';
import { Box, Container, Heading, Text, Grid } from '@chakra-ui/react';

import ParticleBackground from '../components/ParticleBackground';
import { useContent, useBackgroundColor } from '../lib/hooks';

import ServiceCard from './ServiceCard';

const ServicesGrid = () => {
  const { content } = useContent('services');
  const bgColor = useBackgroundColor('primary');

  return (
    <Box py={24} bg={bgColor} id="services" position="relative" overflow="hidden">
      <ParticleBackground />

      <Container maxW="container.xl">
        <Box textAlign="center" mb={16} maxW="2xl" mx="auto">
          <Heading size="2xl" mb={4} color="text.main">
            {content?.title || 'Services'}
          </Heading>
          <Text fontSize="lg" color="text.secondary">
            {content?.subtitle || ''}
          </Text>
        </Box>

<Grid
  templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
  gap={4}
  autoRows="minmax(220px, auto)"
  position="relative"
  onMouseMove={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      '--mouse-x',
      `${e.clientX - rect.left}px`
    );
    e.currentTarget.style.setProperty(
      '--mouse-y',
      `${e.clientY - rect.top}px`
    );
  }}
  _before={{
    content: '""',
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    bg: `radial-gradient(
      600px circle at var(--mouse-x) var(--mouse-y),
      rgba(0, 171, 173, 0.15),
      transparent 60%
    )`,
    opacity: 0,
    transition: 'opacity 0.3s',
  }}
  _hover={{
    _before: { opacity: 1 },
  }}
>

          {(content?.items || []).map((item, index) => (
            <ServiceCard
              key={index}
              title={item.title}
              description={item.description}
              media={item.media}
              colSpan={item.colSpan || 1}
              rowSpan={item.rowSpan || 1}
            />

          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ServicesGrid;
