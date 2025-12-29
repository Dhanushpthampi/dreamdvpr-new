'use client';

import React from 'react';
import {
  Box,
  Heading,
  Text,
  GridItem,
  useBreakpointValue,
} from '@chakra-ui/react';
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
  isFeatured = false,
}) => {
  const brandColor = useThemeColor('--color-brand-500', '#00abad');

  // ✅ SAFE Framer Motion value
  const hoverScale = useBreakpointValue({
    base: 1,
    md: 1.01,
  });

  const mediaHeight = {
    base: '400px',
    md:
      rowSpan > 1
        ? '320px'
        : colSpan > 1
        ? '220px'
        : '160px',
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <MotionGridItem
      colSpan={{ base: 1, md: colSpan }}
      rowSpan={{ base: 2, md: rowSpan }}
      position="relative"
      overflow="hidden"
      rounded="lg"
      bg="transparent"
      backdropFilter="saturate(160%) blur(18px)"
      border="1px solid"
      borderColor="whiteAlpha.300"
      onMouseMove={handleMouseMove}
      whileHover={{ scale: hoverScale }}
      transition="all 0.3s ease"
      boxShadow={`0 0 12px ${hexToRgba(brandColor, 0.15)}`}
      _before={{
        content: '""',
        position: 'absolute',
        inset: 0,
        opacity: 0,
        rounded: 'inherit',
        bg: `radial-gradient(
          700px circle at var(--mouse-x) var(--mouse-y),
          ${hexToRgba(brandColor, 0.12)},
          transparent 45%
        )`,
        transition: 'opacity 0.4s',
        zIndex: 2,
      }}
      _hover={{
        _before: { opacity: 1 },
        boxShadow: `0 0 18px ${hexToRgba(brandColor, 0.22)}`,
      }}
    >
      {/* MEDIA */}
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
              'linear-gradient(to bottom, black 65%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, black 65%, transparent 100%)',
          }}
        >
          <Box
            w="100%"
            h="100%"
            transition="filter 0.35s ease"
            filter={
              isFeatured
                ? 'brightness(1) saturate(1)'
                : 'brightness(0.75) saturate(0.85)'
            }
            _hover={{
              filter: 'brightness(1) saturate(1)',
            }}
          >
            {isVideo(media) && (
              <video
                src={media}
                autoPlay={isFeatured}
                loop
                muted
                playsInline
                preload="metadata"
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

          {/* SUBTLE OVERLAY FOR READABILITY */}
          <Box
            position="absolute"
            inset={0}
            bg="blackAlpha.350"
            zIndex={1}
          />
        </Box>
      )}

      {/* CONTENT */}
      <Box
        position="relative"
        zIndex={3}
        pt={{
          base: '300px',
          md: `calc(${rowSpan > 1 ? '320px' : colSpan > 1 ? '220px' : '160px'} - 40px)`,
        }}
        px={{ base: 4, md: 5 }}
        pb={{ base: 4, md: 5 }}
        h="100%"
        display="flex"
        flexDirection="column"
        justifyContent="flex-end"
      >
        <Heading size={{ base: 'xs', md: 'sm' }} mb={1}>
          {title}
        </Heading>
        <Text fontSize={{ base: 'xs', md: 'sm' }}>
          {description}
        </Text>
      </Box>
    </MotionGridItem>
  );
};

export default ServiceCard;
