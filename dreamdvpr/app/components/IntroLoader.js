'use client';

import { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useThemeColor } from '../lib/hooks';

/**
 * IntroLoader - Simple intro loader with progress bar
 */
export default function IntroLoader({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  const brandColor = useThemeColor('--color-brand-500', '#00abad');

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('introLoaderShown');
    if (hasLoaded) {
      setIsVisible(false);
      onComplete?.();
      return;
    }

    const duration = 2500;
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        sessionStorage.setItem('introLoaderShown', 'true');

        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            onComplete?.();
          }, 500);
        }, 300);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={9999}
      bg="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      transition="opacity 0.5s ease-out"
    >
      <Box textAlign="center">
        <Text
          fontSize={{ base: '3xl', md: '4xl' }}
          fontWeight="bold"
          color={brandColor}
          letterSpacing="wide"
          mb={2}
        >
          DREAMdvpr
        </Text>

        <Text
          fontSize="sm"
          color="gray.600"
          opacity={0.7}
          fontWeight="medium"
        >
          Loading...
        </Text>

        {/* Progress Bar */}
        <Box
          mt={6}
          w="200px"
          h="2px"
          bg="gray.200"
          borderRadius="full"
          overflow="hidden"
          mx="auto"
        >
          <Box
            h="100%"
            bg={brandColor}
            borderRadius="full"
            transition="width 0.3s ease"
            style={{ width: `${progress}%` }}
          />
        </Box>
      </Box>
    </Box>
  );
}
