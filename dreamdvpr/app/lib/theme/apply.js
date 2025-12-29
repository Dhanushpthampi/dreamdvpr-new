/**
 * Theme application utilities - Applies theme to CSS variables only (Tailwind CSS)
 * @module lib/theme/apply
 */

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
 * Applies complete theme (CSS variables only for Tailwind CSS)
 * @param {Object} themeData - Normalized theme data
 */
export function applyTheme(themeData) {
  applyCSSVariables(themeData);
}
