'use client';

/**
 * Hook for getting theme colors from CSS variables
 * @module lib/hooks/useThemeColor
 */

import { useState, useEffect } from 'react';

/**
 * Gets a CSS variable value
 * @param {string} variableName - CSS variable name (e.g., '--color-brand-500')
 * @param {string} defaultValue - Default value if variable not found
 * @returns {string} CSS variable value
 */
function getCSSVariable(variableName, defaultValue) {
  if (typeof window === 'undefined') return defaultValue;
  
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
  
  return value || defaultValue;
}

/**
 * Hook to get and listen to theme color changes
 * @param {string} colorVariable - CSS variable name (e.g., '--color-brand-500')
 * @param {string} defaultValue - Default color value
 * @returns {string} Current color value
 */
export function useThemeColor(colorVariable, defaultValue) {
  const [color, setColor] = useState(() => getCSSVariable(colorVariable, defaultValue));

  useEffect(() => {
    const updateColor = () => {
      setColor(getCSSVariable(colorVariable, defaultValue));
    };

    updateColor();
    window.addEventListener('theme-updated', updateColor);
    
    return () => {
      window.removeEventListener('theme-updated', updateColor);
    };
  }, [colorVariable, defaultValue]);

  return color;
}
