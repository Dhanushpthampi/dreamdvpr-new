'use client';
 
import { ThemeProvider } from './components/ThemeProvider';

export function Providers({ children, initialTheme = null }) {
    return ( 
        <ThemeProvider initialTheme={initialTheme}>
            {children}
        </ThemeProvider>
    );
}
