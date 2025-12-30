/**
 * Theme system - Single source of truth for theme defaults, normalization, and application
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

export function getInitialTheme() {
    if (typeof window !== 'undefined' && window.__THEME_DATA__) {
        return window.__THEME_DATA__;
    }
    return null;
}

export function applyCSSVariables(themeData) {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    root.style.setProperty('--color-brand-500', themeData.colors.brand500);
    root.style.setProperty('--color-brand-600', themeData.colors.brand600);
    root.style.setProperty('--color-accent-500', themeData.colors.accent500);
    root.style.setProperty('--color-bg-app', themeData.colors.bgApp);
    root.style.setProperty('--color-bg-secondary', themeData.colors.bgSecondary);
    root.style.setProperty('--color-text-main', themeData.colors.textMain);
    root.style.setProperty('--color-text-secondary', themeData.colors.textSecondary);

    root.style.setProperty('--font-heading', themeData.fonts.heading);
    root.style.setProperty('--font-body', themeData.fonts.body);

    root.style.setProperty('--border-radius', themeData.borderRadius);
    root.style.setProperty('--color-primary', themeData.colors.brand500);

    if (document.body) {
        document.body.style.backgroundColor = themeData.colors.bgApp;
    }
}

export function applyTheme(themeData) {
    applyCSSVariables(themeData);
}
