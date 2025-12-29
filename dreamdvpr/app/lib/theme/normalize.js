/**
 * Theme normalization utilities
 * @module lib/theme/normalize
 */

import { DEFAULT_THEME } from './constants';

/**
 * Normalizes theme data to ensure all required fields are present
 * @param {Object} themeData - Raw theme data from API or storage
 * @returns {Object} Normalized theme object with all required fields
 */
export function normalizeTheme(themeData) {
  if (!themeData || typeof themeData !== 'object') {
    return DEFAULT_THEME;
  }

  return {
    colors: {
      brand500: themeData.colors?.brand500 || DEFAULT_THEME.colors.brand500,
      brand600: themeData.colors?.brand600 || DEFAULT_THEME.colors.brand600,
      accent500: themeData.colors?.accent500 || DEFAULT_THEME.colors.accent500,
      bgApp: themeData.colors?.bgApp || DEFAULT_THEME.colors.bgApp,
      bgSecondary: themeData.colors?.bgSecondary || DEFAULT_THEME.colors.bgSecondary,
      textMain: themeData.colors?.textMain || DEFAULT_THEME.colors.textMain,
      textSecondary: themeData.colors?.textSecondary || DEFAULT_THEME.colors.textSecondary,
    },
    fonts: {
      heading: themeData.fonts?.heading || DEFAULT_THEME.fonts.heading,
      body: themeData.fonts?.body || DEFAULT_THEME.fonts.body,
    },
    borderRadius: themeData.borderRadius || DEFAULT_THEME.borderRadius,
    logo: themeData.logo || DEFAULT_THEME.logo,
  };
}

/**
 * Gets initial theme from window object (set by server-side rendering)
 * @returns {Object|null} Theme data or null if not available
 */
export function getInitialTheme() {
  if (typeof window !== 'undefined' && window.__THEME_DATA__) {
    return window.__THEME_DATA__;
  }
  return null;
}
