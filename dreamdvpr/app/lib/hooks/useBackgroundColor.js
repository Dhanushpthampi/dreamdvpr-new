'use client';

/**
 * Hook for getting background colors from theme
 * @module lib/hooks/useBackgroundColor
 */

import { useThemeColor } from './useThemeColor';

/**
 * Hook to get background color (primary or secondary)
 * @param {'primary' | 'secondary'} variant - Background variant
 * @returns {string} Background color value
 */
export function useBackgroundColor(variant = 'primary') {
  const colorVariable = variant === 'primary' 
    ? '--color-bg-app' 
    : '--color-bg-secondary';
  
  const defaultValue = variant === 'primary' ? '#f5f5f7' : '#ffffff';
  
  return useThemeColor(colorVariable, defaultValue);
}
