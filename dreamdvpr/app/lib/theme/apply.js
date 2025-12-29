/**
 * Theme application utilities - Applies theme to CSS variables and Chakra UI
 * @module lib/theme/apply
 */

import { extendTheme } from '@chakra-ui/react';
import { CSS_VARIABLE_MAP } from './constants';

/**
 * Applies theme colors to CSS variables
 * @param {Object} themeData - Normalized theme data
 */
export function applyCSSVariables(themeData) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Apply color variables
  root.style.setProperty('--color-brand-500', themeData.colors.brand500);
  root.style.setProperty('--color-brand-600', themeData.colors.brand600);
  root.style.setProperty('--color-accent-500', themeData.colors.accent500);
  root.style.setProperty('--color-bg-app', themeData.colors.bgApp);
  root.style.setProperty('--color-bg-secondary', themeData.colors.bgSecondary);
  root.style.setProperty('--color-text-main', themeData.colors.textMain);
  root.style.setProperty('--color-text-secondary', themeData.colors.textSecondary);
  
  // Apply font variables
  root.style.setProperty('--font-heading', themeData.fonts.heading);
  root.style.setProperty('--font-body', themeData.fonts.body);
  
  // Apply other variables
  root.style.setProperty('--border-radius', themeData.borderRadius);
  root.style.setProperty('--color-primary', themeData.colors.brand500);
  
  // Update body background immediately
  if (document.body) {
    document.body.style.backgroundColor = themeData.colors.bgApp;
  }
}

/**
 * Creates Chakra UI theme configuration from theme data
 * @param {Object} themeData - Normalized theme data
 * @returns {Object} Chakra UI theme configuration
 */
export function createChakraTheme(themeData) {
  return extendTheme({
    colors: {
      brand: {
        500: themeData.colors.brand500,
        600: themeData.colors.brand600,
      },
      accent: {
        500: themeData.colors.accent500,
      },
      bg: {
        app: themeData.colors.bgApp,
        secondary: themeData.colors.bgSecondary,
      },
      text: {
        main: themeData.colors.textMain,
        secondary: themeData.colors.textSecondary,
      },
    },
    fonts: {
      heading: themeData.fonts.heading,
      body: themeData.fonts.body,
    },
    styles: {
      global: {
        body: {
          bg: 'bg.app',
          color: 'text.main',
        },
      },
    },
    components: {
      Button: {
        baseStyle: {
          rounded: themeData.borderRadius,
          fontWeight: 'medium',
        },
        variants: {
          solid: {
            bg: 'brand.500',
            color: 'white',
            _hover: {
              bg: 'brand.600',
              boxShadow: 'lg',
            },
            _active: {
              bg: 'brand.600',
              transform: 'scale(0.98)',
            },
          },
          outline: {
            borderColor: 'text.main',
            borderWidth: '2px',
            color: 'text.main',
            _hover: {
              bg: 'gray.100',
            },
          },
        },
      },
    },
  });
}

/**
 * Applies complete theme (CSS variables only)
 * Note: Chakra theme should be created separately using createChakraTheme
 * @param {Object} themeData - Normalized theme data
 */
export function applyTheme(themeData) {
  applyCSSVariables(themeData);
}
