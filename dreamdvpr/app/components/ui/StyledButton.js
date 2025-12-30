'use client';

import { Button } from '@chakra-ui/react';

/**
 * Styled button component that uses theme colors
 * Variants: primary, outline, ghost
 */
export const StyledButton = ({ 
    variant = 'primary', 
    children, 
    className = '',
    ...props 
}) => {
    const baseClass = variant === 'primary' 
        ? 'button-primary' 
        : variant === 'outline' 
        ? 'button-outline' 
        : '';
    
    return (
        <Button
            className={`${baseClass} ${className}`}
            variant={variant === 'ghost' ? 'ghost' : undefined}
            {...props}
        >
            {children}
        </Button>
    );
};

export default StyledButton;
