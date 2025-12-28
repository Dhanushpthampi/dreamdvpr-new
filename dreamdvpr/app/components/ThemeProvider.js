'use client';

import { useEffect, useState } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const defaultTheme = {
    colors: {
        brand500: '#00abad',
        brand600: '#008c8e',
        accent500: '#ff0000ff',
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
};

// Get initial theme from window if available (set by server)
function getInitialTheme() {
    if (typeof window !== 'undefined' && window.__THEME_DATA__) {
        return window.__THEME_DATA__;
    }
    return null;
}

export function ThemeProvider({ children, initialTheme = null }) {
    const [theme, setTheme] = useState(null);
    const [chakraTheme, setChakraTheme] = useState(null);
    const [themeKey, setThemeKey] = useState(0);

    useEffect(() => {
        // Use initial theme if provided, otherwise fetch once
        const initial = initialTheme || getInitialTheme();
        if (initial) {
            const completeTheme = normalizeTheme(initial);
            setTheme(completeTheme);
            applyTheme(completeTheme);
        } else {
            fetchTheme();
        }
    }, [initialTheme]);

    const normalizeTheme = (themeData) => {
        return {
            colors: {
                brand500: themeData.colors?.brand500 || defaultTheme.colors.brand500,
                brand600: themeData.colors?.brand600 || defaultTheme.colors.brand600,
                accent500: themeData.colors?.accent500 || defaultTheme.colors.accent500,
                bgApp: themeData.colors?.bgApp || defaultTheme.colors.bgApp,
                bgSecondary: themeData.colors?.bgSecondary || defaultTheme.colors.bgSecondary,
                textMain: themeData.colors?.textMain || defaultTheme.colors.textMain,
                textSecondary: themeData.colors?.textSecondary || defaultTheme.colors.textSecondary,
            },
            fonts: {
                heading: themeData.fonts?.heading || defaultTheme.fonts.heading,
                body: themeData.fonts?.body || defaultTheme.fonts.body,
            },
            borderRadius: themeData.borderRadius || defaultTheme.borderRadius,
        };
    };

    const fetchTheme = async () => {
        try {
            const res = await fetch('/api/content', { cache: 'no-store' });
            const data = await res.json();
            const themeData = data.content?.theme || defaultTheme;
            const completeTheme = normalizeTheme(themeData);
            setTheme(completeTheme);
            applyTheme(completeTheme);
        } catch (error) {
            console.error('Error fetching theme:', error);
            applyTheme(defaultTheme);
        }
    };

    const applyTheme = (themeData) => {
        // Apply CSS variables for dynamic theming
        if (typeof document !== 'undefined') {
            const root = document.documentElement;
            
            // Apply all color variables
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
            
            // Also update Tailwind theme variables if they exist
            root.style.setProperty('--color-primary', themeData.colors.brand500);
            
            // Update body background immediately
            if (document.body) {
                document.body.style.backgroundColor = themeData.colors.bgApp;
            }
            
            // Debug logging (remove in production)
            if (process.env.NODE_ENV === 'development') {
                console.log('Theme applied:', {
                    brand500: themeData.colors.brand500,
                    brand600: themeData.colors.brand600,
                });
            }
        }

        // Create Chakra theme with dynamic colors
        const dynamicTheme = extendTheme({
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
                    }
                }
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
                            }
                        },
                        outline: {
                            borderColor: 'text.main',
                            borderWidth: '2px',
                            color: 'text.main',
                            _hover: {
                                bg: 'gray.100',
                            }
                        }
                    }
                }
            }
        });

        setChakraTheme(dynamicTheme);
        setThemeKey(prev => prev + 1); // Force re-render
    };

    // Listen for theme updates (only when explicitly triggered, no polling)
    useEffect(() => {
        const handleThemeUpdate = (event) => {
            // If theme data is passed in the event, use it directly
            if (event.detail) {
                const completeTheme = normalizeTheme(event.detail);
                setTheme(completeTheme);
                applyTheme(completeTheme);
            }
        };

        const handleStorageChange = (e) => {
            // Only listen for theme updates from other tabs
            if (e.key === 'theme-updated' && e.newValue) {
                try {
                    const themeData = JSON.parse(e.newValue);
                    const completeTheme = normalizeTheme(themeData);
                    setTheme(completeTheme);
                    applyTheme(completeTheme);
                } catch (error) {
                    console.error('Error parsing theme from storage:', error);
                }
            }
        };

        // Listen for storage events (when theme is updated in another tab)
        window.addEventListener('storage', handleStorageChange);
        
        // Listen for custom theme-updated event (only when admin saves)
        window.addEventListener('theme-updated', handleThemeUpdate);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('theme-updated', handleThemeUpdate);
        };
    }, []);

    if (!chakraTheme) {
        // Return default theme while loading
        const defaultChakraTheme = extendTheme({
            colors: {
                brand: {
                    500: defaultTheme.colors.brand500,
                    600: defaultTheme.colors.brand600,
                },
                accent: {
                    500: defaultTheme.colors.accent500,
                },
                bg: {
                    app: defaultTheme.colors.bgApp,
                    secondary: defaultTheme.colors.bgSecondary,
                },
                text: {
                    main: defaultTheme.colors.textMain,
                    secondary: defaultTheme.colors.textSecondary,
                },
            },
            fonts: {
                heading: defaultTheme.fonts.heading,
                body: defaultTheme.fonts.body,
            },
        });
        return <ChakraProvider theme={defaultChakraTheme}>{children}</ChakraProvider>;
    }

    return (
        <ChakraProvider theme={chakraTheme} key={themeKey}>
            {children}
        </ChakraProvider>
    );
}
