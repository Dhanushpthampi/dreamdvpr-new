'use client';

import { Box, useColorMode } from '@chakra-ui/react';
import { hexToRgba } from '../lib/utils';
import { useThemeColor } from '../lib/hooks';

/**
 * Reusable glassmorphism card component
 */
const GlassCard = ({
  children,
  p = 6,
  hover = true,
  onClick,
  ...rest
}) => {
  const brandColor = useThemeColor('--color-brand-500', '#00abad');
  const { colorMode } = useColorMode();

  return (
    <Box
      /* TRUE GLASS */
      bg="transparent"
      backdropFilter="saturate(180%) blur(20px)"

      /* SHAPE */
      rounded="xl"
      p={p}

      /* BORDER */
      border="1px solid"
      borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'whiteAlpha.400'}

      /* DEPTH */
      boxShadow={`0 0 20px ${hexToRgba(brandColor, 0.12)}`}
      transition="all 0.3s ease"

      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}

      _hover={
        hover
          ? {
              transform: 'translateY(-2px)',
              boxShadow: `
                0 0 32px ${hexToRgba(brandColor, 0.25)},
                0 8px 32px rgba(0,0,0,0.12)
              `,
            }
          : {}
      }
      {...rest}
    >
      {children}
    </Box>
  );
};

export default GlassCard;
