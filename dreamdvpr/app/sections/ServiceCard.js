'use client';

import React from 'react';
import { Box, Heading, Text, GridItem } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useThemeColor } from '../lib/hooks';
import { hexToRgba } from '../lib/utils';

const MotionGridItem = motion(GridItem);

const isVideo = (url = '') => /\.(mp4|webm|ogg)$/i.test(url);
const isImage = (url = '') => /\.(gif|png|jpg|jpeg|webp)$/i.test(url);

const ServiceCard = ({
  title,
  description,
  media,
  colSpan = 1,
  rowSpan = 1,
}) => {
  const brandColor = useThemeColor('--color-brand-500', '#00abad');

  const mediaHeight = rowSpan > 1 ? '320px' : colSpan > 1 ? '220px' : '160px';


  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <MotionGridItem
      colSpan={{ base: 1, md: colSpan }}
      rowSpan={{ base: 1, md: rowSpan }}
      position="relative"
      overflow="hidden"
      rounded="lg"
      bg="transparent"
backdropFilter="saturate(180%) blur(20px)"
border="1px solid"
borderColor="whiteAlpha.300"
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02 }}
      transition="all 0.3s ease"
      boxShadow={`0 0 20px ${hexToRgba(brandColor, 0.12)}`}
      _before={{
        content: '""',
        position: 'absolute',
        inset: 0,
        opacity: 0,
        rounded: 'inherit',
        bg: `radial-gradient(
          800px circle at var(--mouse-x) var(--mouse-y),
          ${hexToRgba(brandColor, 0.12)},
          transparent 40%
        )`,
        transition: 'opacity 0.4s',
        zIndex: 2,
      }}
      _after={{
        content: '""',
        position: 'absolute',
        inset: 0,
        opacity: 0,
        rounded: 'inherit',
        bg: `radial-gradient(
          600px circle at var(--mouse-x) var(--mouse-y),
          ${hexToRgba(brandColor, 0.28)},
          transparent 40%
        )`,
        transition: 'opacity 0.4s',
        zIndex: 1,
      }}
      _hover={{
        _before: { opacity: 1 },
        _after: { opacity: 1 },
        boxShadow: `0 0 32px ${hexToRgba(brandColor, 0.25)}`,
      }}
    >
      {/* MEDIA – FULL BLEED WITH FADE */}
      {media && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h={mediaHeight}
          zIndex={0}
          overflow="hidden"
          sx={{
            WebkitMaskImage:
              'linear-gradient(to bottom, black 60%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, black 60%, transparent 100%)',
          }}
        >
          {isVideo(media) && (
            <video
              src={media}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}

          {isImage(media) && (
            <img
              src={media}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
        </Box>
      )}

      {/* CONTENT */}
      <Box
        position="relative"
        zIndex={3}
        pt={`calc(${mediaHeight} - 40px)`}
        px={5}
        pb={5}
        h="100%"
        display="flex"
        flexDirection="column"
        justifyContent="flex-end"
      >
        <Heading size="sm" mb={1} color="text.main">
          {title}
        </Heading>
        <Text fontSize="sm" color="text.secondary">
          {description}
        </Text>
      </Box>
    </MotionGridItem>
  );
};

export default ServiceCard;
