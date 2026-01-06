'use client';

import SmoothScroll from './components/homepage/SmoothScroll';

export function Providers({ children }) {
    return (
        <SmoothScroll>
            {children}
        </SmoothScroll>
    );
}
