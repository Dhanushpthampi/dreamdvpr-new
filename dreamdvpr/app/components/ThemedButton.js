'use client';

import { Button } from '@chakra-ui/react';

/**
 * Themed button component with consistent styling
 * @param {Object} props
 * @param {string} props.variant - Button variant: 'primary' | 'secondary' | 'outline' | 'ghost'
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.isDisabled - Disabled state
 * @param {string} props.size - Button size: 'sm' | 'md' | 'lg'
 * @param {React.ReactNode} props.children - Button content
 */
const ThemedButton = ({
    variant = 'primary',
    isLoading = false,
    isDisabled = false,
    size = 'md',
    children,
    ...rest
}) => {
    const variants = {
        primary: {
            bg: 'brand.500',
            color: 'white',
            _hover: { bg: 'brand.600', transform: 'translateY(-1px)' },
            _active: { bg: 'brand.700' },
        },
        secondary: {
            bg: 'gray.100',
            color: 'gray.700',
            _hover: { bg: 'gray.200', transform: 'translateY(-1px)' },
            _active: { bg: 'gray.300' },
        },
        outline: {
            bg: 'transparent',
            color: 'brand.500',
            border: '2px solid',
            borderColor: 'brand.500',
            _hover: { bg: 'brand.50', transform: 'translateY(-1px)' },
            _active: { bg: 'brand.100' },
        },
        ghost: {
            bg: 'transparent',
            color: 'gray.700',
            _hover: { bg: 'gray.100', transform: 'translateY(-1px)' },
            _active: { bg: 'gray.200' },
        },
    };

    return (
        <Button
            {...variants[variant]}
            size={size}
            isLoading={isLoading}
            isDisabled={isDisabled}
            transition="all 0.2s"
            fontWeight="semibold"
            {...rest}
        >
            {children}
        </Button>
    );
};

export default ThemedButton;
