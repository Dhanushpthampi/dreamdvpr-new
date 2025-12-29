'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { useTheme } from '@/app/lib/theme';
import { createChakraTheme, DEFAULT_THEME } from '@/app/lib/theme';

/**
 * ThemeProvider - Provides theme context to the application
 * Uses centralized theme utilities for maintainability
 */
export function ThemeProvider({ children, initialTheme = null }) {
  const { chakraTheme, themeKey } = useTheme(initialTheme);

  // Return default theme while loading
  if (!chakraTheme) {
    const defaultChakraTheme = createChakraTheme(DEFAULT_THEME);
    return <ChakraProvider theme={defaultChakraTheme}>{children}</ChakraProvider>;
  }

  return (
    <ChakraProvider theme={chakraTheme} key={themeKey}>
      {children}
    </ChakraProvider>
  );
}
