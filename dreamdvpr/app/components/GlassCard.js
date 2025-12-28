'use client';

import { Box } from '@chakra-ui/react';

/**
 * Reusable glassmorphism card component matching website theme
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {number|string|object} props.p - Padding (default: 6)
 * @param {boolean} props.hover - Enable hover effect (default: true)
 * @param {function} props.onClick - Click handler
 * @param {object} props.rest - Additional Chakra UI Box props
 */
const GlassCard = ({
    children,
    p = 6,
    hover = true,
    onClick,
    ...rest
}) => {
    // Get theme colors from CSS variables
    const getThemeColor = (varName, fallback) => {
        if (typeof window !== 'undefined') {
            return getComputedStyle(document.documentElement)
                .getPropertyValue(varName)
                .trim() || fallback;
        }
        return fallback;
    };

    const brandColor = getThemeColor('--color-brand-500', '#00abad');
    
    // Convert hex to rgba
    const hexToRgba = (hex, alpha) => {
        const h = hex.replace('#', '');
        const r = parseInt(h.substring(0, 2), 16);
        const g = parseInt(h.substring(2, 4), 16);
        const b = parseInt(h.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return (
        <Box
            bg="rgba(255, 255, 255, 0.4)"
            backdropFilter="blur(20px)"
            rounded="xl"
            p={p}
            shadow="lg"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.8)"
            boxShadow={`0 0 20px ${hexToRgba(brandColor, 0.1)}`}
            transition="all 0.3s"
            cursor={onClick ? 'pointer' : 'default'}
            _hover={hover ? {
                boxShadow: `0 0 30px ${hexToRgba(brandColor, 0.2)}, 0 8px 32px rgba(0, 0, 0, 0.1)`,
                transform: "translateY(-2px)"
            } : {}}
            onClick={onClick}
            {...rest}
        >
            {children}
        </Box>
    );
};

export default GlassCard;
