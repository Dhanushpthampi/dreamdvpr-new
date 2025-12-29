'use client';

/**
 * React hook for theme management
 * @module lib/theme/hooks/useTheme
 */

import { useEffect, useState, useCallback } from 'react';
import { normalizeTheme, getInitialTheme } from '../normalize';
import { applyTheme } from '../apply';
import { DEFAULT_THEME } from '../constants';

/**
 * Custom hook for managing theme state and updates
 * @param {Object} initialTheme - Initial theme data (from server)
 * @param {boolean} enabled - Whether to apply theme (for conditional pages)
 * @returns {Object} Theme state and utilities
 */
export function useTheme(initialTheme = null, enabled = true) {
  const [theme, setTheme] = useState(null);

  /**
   * Fetches theme from API
   */
  const fetchTheme = useCallback(async () => {
    if (!enabled) return;
    try {
      const res = await fetch('/api/content', { cache: 'no-store' });
      const data = await res.json();
      const themeData = data.content?.theme || DEFAULT_THEME;
      const normalizedTheme = normalizeTheme(themeData);
      setTheme(normalizedTheme);
      applyTheme(normalizedTheme);
    } catch (error) {
      console.error('Error fetching theme:', error);
      applyTheme(DEFAULT_THEME);
      setTheme(DEFAULT_THEME);
    }
  }, [enabled]);

  /**
   * Applies theme and updates state
   */
  const applyThemeData = useCallback((themeData) => {
    if (!enabled) return;
    const normalizedTheme = normalizeTheme(themeData);
    setTheme(normalizedTheme);
    applyTheme(normalizedTheme);
  }, [enabled]);

  // Initialize theme on mount
  useEffect(() => {
    if (!enabled) return;
    const initial = initialTheme || getInitialTheme();
    if (initial) {
      applyThemeData(initial);
    } else {
      fetchTheme();
    }
  }, [initialTheme, applyThemeData, fetchTheme, enabled]);

  // Listen for theme updates
  useEffect(() => {
    if (!enabled) return;
    
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
  }, [applyThemeData, enabled]);

  return {
    theme,
    applyTheme: applyThemeData,
    fetchTheme,
  };
}
