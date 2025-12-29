/**
 * Default theme constants - Single source of truth for theme defaults
 * @module lib/theme/constants
 */

export const DEFAULT_THEME = {
  colors: {
    brand500: '#00abad',
    brand600: '#008c8e',
    accent500: '#ff6b6b',
    bgApp: '#f5f5f7',
    bgSecondary: '#ffffff',
    textMain: '#1d1d1f',
    textSecondary: '#86868b',
  },
  fonts: {
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  borderRadius: 'xl',
  logo: '',
};

/**
 * CSS variable mappings for theme colors
 */
export const CSS_VARIABLE_MAP = {
  '--color-brand-500': 'colors.brand500',
  '--color-brand-600': 'colors.brand600',
  '--color-accent-500': 'colors.accent500',
  '--color-bg-app': 'colors.bgApp',
  '--color-bg-secondary': 'colors.bgSecondary',
  '--color-text-main': 'colors.textMain',
  '--color-text-secondary': 'colors.textSecondary',
  '--font-heading': 'fonts.heading',
  '--font-body': 'fonts.body',
  '--border-radius': 'borderRadius',
};

/**
 * Chakra UI theme color mappings
 */
export const CHAKRA_COLOR_MAP = {
  brand: {
    500: 'colors.brand500',
    600: 'colors.brand600',
  },
  accent: {
    500: 'colors.accent500',
  },
  bg: {
    app: 'colors.bgApp',
    secondary: 'colors.bgSecondary',
  },
  text: {
    main: 'colors.textMain',
    secondary: 'colors.textSecondary',
  },
};
