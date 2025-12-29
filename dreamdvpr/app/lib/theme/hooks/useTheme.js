'use client';

/**
 * React hook for theme management
 * @module lib/theme/hooks/useTheme
 */

import { useEffect, useState, useCallback } from 'react';
import { normalizeTheme, getInitialTheme } from '../normalize';
import { applyTheme, createChakraTheme } from '../apply';
import { DEFAULT_THEME } from '../constants';

/**
 * Custom hook for managing theme state and updates
 * @param {Object} initialTheme - Initial theme data (from server)
 * @returns {Object} Theme state and utilities
 */
export function useTheme(initialTheme = null) {
  const [theme, setTheme] = useState(null);
  const [chakraTheme, setChakraTheme] = useState(null);
  const [themeKey, setThemeKey] = useState(0);

  /**
   * Fetches theme from API
   */
  const fetchTheme = useCallback(async () => {
    try {
      const res = await fetch('/api/content', { cache: 'no-store' });
      const data = await res.json();
      const themeData = data.content?.theme || DEFAULT_THEME;
      const normalizedTheme = normalizeTheme(themeData);
      setTheme(normalizedTheme);
      applyTheme(normalizedTheme);
      const chakraThemeObj = createChakraTheme(normalizedTheme);
      setChakraTheme(chakraThemeObj);
    } catch (error) {
      console.error('Error fetching theme:', error);
      applyTheme(DEFAULT_THEME);
      const chakraThemeObj = createChakraTheme(DEFAULT_THEME);
      setChakraTheme(chakraThemeObj);
    }
  }, []);

  /**
   * Applies theme and updates state
   */
  const applyThemeData = useCallback((themeData) => {
    const normalizedTheme = normalizeTheme(themeData);
    setTheme(normalizedTheme);
    applyTheme(normalizedTheme);
    const chakraThemeObj = createChakraTheme(normalizedTheme);
    setChakraTheme(chakraThemeObj);
    setThemeKey(prev => prev + 1); // Force re-render
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    const initial = initialTheme || getInitialTheme();
    if (initial) {
      applyThemeData(initial);
    } else {
      fetchTheme();
    }
  }, [initialTheme, applyThemeData, fetchTheme]);

  // Listen for theme updates
  useEffect(() => {
    const handleThemeUpdate = (event) => {
      if (event.detail) {
        applyThemeData(event.detail);
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === 'theme-updated' && e.newValue) {
        try {
          const themeData = JSON.parse(e.newValue);
          applyThemeData(themeData);
        } catch (error) {
          console.error('Error parsing theme from storage:', error);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('theme-updated', handleThemeUpdate);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('theme-updated', handleThemeUpdate);
      };
    }
  }, [applyThemeData]);

  return {
    theme,
    chakraTheme,
    themeKey,
    applyTheme: applyThemeData,
    fetchTheme,
  };
}
