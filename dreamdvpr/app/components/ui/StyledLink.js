'use client';

import Link from 'next/link';
import { Box } from '@chakra-ui/react';

/**
 * Styled link component that uses theme colors
 */
export const StyledLink = ({ href, children, className = '', ...props }) => {
    return (
        <Link 
            href={href} 
            className={`link-primary ${className}`}
            style={{ textDecoration: 'none' }}
            {...props}
        >
            {children}
        </Link>
    );
};

export default StyledLink;
