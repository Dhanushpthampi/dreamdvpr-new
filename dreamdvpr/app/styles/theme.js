import { extendTheme } from '@chakra-ui/react';

const colors = {
    brand: {
        500: '#00abad',
        600: '#008c8e',
    },
    accent: {
        500: '#ff0000ff',
    },
    bg: {
        app: '#f5f5f7',
    },
    text: {
        main: '#1d1d1f',
        secondary: '#86868b',
    }
};

const theme = extendTheme({
    colors,
    fonts: {
        heading: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
        body: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
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
                rounded: 'xl',
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
                    borderColor: 'black',
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

export default theme;
