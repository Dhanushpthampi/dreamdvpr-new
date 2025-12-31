'use client';

import { useState, useEffect, useCallback } from 'react';
import { normalizeTheme, getInitialTheme, applyTheme, DEFAULT_THEME } from '../theme';

export function useTheme(initialTheme = null, enabled = true) {
    const [theme, setTheme] = useState(null);

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

    const applyThemeData = useCallback((themeData) => {
        if (!enabled) return;
        const normalizedTheme = normalizeTheme(themeData);
        setTheme(normalizedTheme);
        applyTheme(normalizedTheme);
    }, [enabled]);

    useEffect(() => {
        if (!enabled) return;
        const initial = initialTheme || getInitialTheme();
        if (initial) applyThemeData(initial);
        else fetchTheme();
    }, [initialTheme, applyThemeData, fetchTheme, enabled]);

    useEffect(() => {
        if (!enabled) return;
        const handleThemeUpdate = (event) => { if (event.detail) applyThemeData(event.detail); };
        const handleStorageChange = (e) => {
            if (e.key === 'theme-updated' && e.newValue) {
                try { applyThemeData(JSON.parse(e.newValue)); }
                catch (error) { console.error('Error parsing theme from storage:', error); }
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

    return { theme, applyTheme: applyThemeData, fetchTheme };
}
