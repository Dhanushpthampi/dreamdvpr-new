'use client';

import { ThemeProvider } from './components/providers/ThemeProvider';

export function Providers({ children }) {
    return (
        <ThemeProvider>
            {children}
        </ThemeProvider>
    );
}
